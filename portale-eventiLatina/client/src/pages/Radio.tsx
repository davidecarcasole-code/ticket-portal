import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import {
  Radio, Mic, MicOff, Circle, Square,
  Play, Pause, Trash2, Upload, Music,
  Headphones, List, Settings
} from 'lucide-react';

export default function RadioPage() {
  const { user, isSuperAdmin } = useAuthStore();
  const [settings, setSettings] = useState<any>(null);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState<'listen' | 'podcasts' | 'transmit'>('listen');
  const [currentPodcast, setCurrentPodcast] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Live transmission state
  const [isTransmitting, setIsTransmitting] = useState(false);
  const liveMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const liveChunkIndexRef = useRef(0);
  const liveTimerRef = useRef<any>(null);

  // Station name editing
  const [editingStation, setEditingStation] = useState(false);
  const [stationName, setStationName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, p, ls] = await Promise.all([
        api.radio.getSettings(),
        api.radio.getPodcasts(),
        api.radio.getLiveStatus(),
      ]);
      setSettings(s);
      setPodcasts(p);
      setIsLive(ls.is_live);
      setStationName(s.station_name || '');
    } catch {}
  };

  const playPodcast = (podcast: any) => {
    if (currentPodcast?.id === podcast.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    setCurrentPodcast(podcast);
    setIsPlaying(true);
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = `/api/radio/uploads/${podcast.id}.webm`;
    audioRef.current.play().catch(() => {});
    audioRef.current.onended = () => { setIsPlaying(false); };
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentPodcast) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };

  // Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mediaRecorderRef.current = recorder;
      setRecordedBlob(null);
      setRecordingDuration(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordingDuration(Math.floor(timerRef.current || 0));
        clearInterval(timerRef.current);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(1000);
      setIsRecording(true);
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch (err) {
      alert('Impossibile accedere al microfono');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const saveRecording = async () => {
    if (!recordedBlob || !recordingTitle.trim()) return;
    try {
      const podcast = await api.radio.createPodcast({
        title: recordingTitle.trim(),
        duration: recordingDuration,
      });
      await api.radio.uploadPodcastAudio(podcast.id, recordedBlob);
      setRecordedBlob(null);
      setRecordingTitle('');
      setRecordingDuration(0);
      loadData();
    } catch (err) {
      alert('Errore nel salvataggio');
    }
  };

  const deletePodcast = async (id: string) => {
    if (!confirm('Eliminare questo podcast?')) return;
    await api.radio.deletePodcast(id);
    loadData();
  };

  // Live transmission
  const startTransmission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await api.radio.startLive();

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      liveMediaRecorderRef.current = recorder;
      liveChunkIndexRef.current = 0;
      setIsTransmitting(true);
      setIsLive(true);

      recorder.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          const idx = liveChunkIndexRef.current++;
          await api.radio.sendLiveChunk(e.data, idx).catch(() => {});
        }
      };

      recorder.start(5000); // 5-second chunks
    } catch (err) {
      alert('Impossibile accedere al microfono per la diretta');
    }
  };

  const stopTransmission = async () => {
    liveMediaRecorderRef.current?.stop();
    liveMediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    clearInterval(liveTimerRef.current);
    setIsTransmitting(false);
    setIsLive(false);
    await api.radio.stopLive().catch(() => {});
  };

  const saveStationName = async () => {
    await api.radio.updateSettings({ station_name: stationName });
    setEditingStation(false);
    loadData();
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Web Radio</h1>
          {editingStation ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={stationName}
                onChange={e => setStationName(e.target.value)}
                className="px-2 py-1 rounded-lg border text-sm"
                style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <button onClick={saveStationName} className="px-3 py-1 rounded-lg text-white text-xs font-medium" style={{ backgroundColor: 'var(--accent)' }}>Salva</button>
              <button onClick={() => setEditingStation(false)} className="px-3 py-1 rounded-lg text-xs" style={{ color: 'var(--text-secondary)' }}>Annulla</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {settings?.station_name || 'Radio Eventi Latina'}
              </p>
              {isSuperAdmin() && (
                <button onClick={() => setEditingStation(true)} className="text-xs opacity-60 hover:opacity-100" style={{ color: 'var(--text-secondary)' }}>
                  ✏️
                </button>
              )}
            </div>
          )}
        </div>
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-500">Live</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
        {[
          { id: 'listen', label: 'Ascolta', icon: Headphones },
          { id: 'podcasts', label: 'Podcast', icon: List },
          ...(isSuperAdmin() ? [{ id: 'transmit', label: 'Trasmetti', icon: Mic }] : []),
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'text-white shadow-md' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* LISTEN TAB */}
      {activeTab === 'listen' && (
        <div className="space-y-4">
          {/* Live section */}
          {isLive && (
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/20">
                  <Radio size={32} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>🔴 In diretta ora</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {settings?.station_name || 'Radio Eventi Latina'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (currentPodcast?.title === '🔴 Live' && isPlaying) {
                      audioRef.current?.pause();
                      setIsPlaying(false);
                      setCurrentPodcast(null);
                    } else {
                      setCurrentPodcast({ title: '🔴 Live' } as any);
                      setIsPlaying(true);
                    }
                  }}
                  className="px-6 py-3 rounded-full font-medium text-white"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {currentPodcast?.title === '🔴 Live' && isPlaying ? '⏹ Stop' : '🎧 Ascolta'}
                </button>
              </div>
            </div>
          )}

          {!isLive && (
            <div className="p-12 text-center rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
              <Radio size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-secondary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Nessuna diretta in corso
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Ascolta i podcast disponibili nella sezione Podcast
              </p>
            </div>
          )}

          {/* Current player */}
          {currentPodcast && (
            <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                </button>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentPodcast.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {currentPodcast.title === '🔴 Live' ? 'In diretta' : 'Podcast'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Podcast quick list */}
          {podcasts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Podcast recenti</h3>
              <div className="grid gap-2">
                {podcasts.slice(0, 5).map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => playPodcast(p)}
                    className="flex items-center gap-3 p-3 rounded-xl border text-left hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: currentPodcast?.id === p.id ? 'var(--accent)' : 'var(--card-border)',
                    }}
                  >
                    <Play size={16} style={{ color: 'var(--accent)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                      {p.duration > 0 && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDuration(p.duration)}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PODCASTS TAB */}
      {activeTab === 'podcasts' && (
        <div className="space-y-4">
          {isSuperAdmin() && (
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                {isRecording ? '🎙️ Registrazione in corso...' : recordedBlob ? '📼 Anteprima registrazione' : '🎙️ Nuova registrazione'}
              </h3>

              {!isRecording && !recordedBlob && (
                <button onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white"
                  style={{ backgroundColor: '#ef4444' }}>
                  <Mic size={18} /> Inizia registrazione
                </button>
              )}

              {isRecording && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
                      {formatDuration(recordingDuration)}
                    </span>
                  </div>
                  <button onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white"
                    style={{ backgroundColor: '#dc2626' }}>
                    <Square size={18} /> Ferma registrazione
                  </button>
                </div>
              )}

              {recordedBlob && (
                <div className="space-y-3">
                  <audio src={URL.createObjectURL(recordedBlob)} controls className="w-full" />
                  <div className="flex items-center gap-2">
                    <input
                      value={recordingTitle}
                      onChange={e => setRecordingTitle(e.target.value)}
                      placeholder="Titolo del podcast..."
                      className="flex-1 px-4 py-2 rounded-xl border"
                      style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                    <button onClick={saveRecording} disabled={!recordingTitle.trim()}
                      className="px-6 py-2 rounded-xl font-medium text-white disabled:opacity-50"
                      style={{ backgroundColor: 'var(--accent)' }}>
                      <Upload size={18} className="inline mr-1" /> Salva
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Tutti i podcast ({podcasts.length})
            </h3>
            {podcasts.map((p: any) => (
              <div key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                <button onClick={() => playPodcast(p)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentPodcast?.id === p.id && isPlaying ? 'var(--accent)' : 'var(--bg-primary)' }}>
                  {currentPodcast?.id === p.id && isPlaying
                    ? <Pause size={16} style={{ color: 'var(--accent)' }} />
                    : <Play size={16} style={{ color: 'var(--accent)' }} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {p.duration > 0 ? formatDuration(p.duration) : '--:--'}
                    {p.created_at && ` · ${new Date(p.created_at).toLocaleDateString('it-IT')}`}
                  </p>
                </div>
                {isSuperAdmin() && (
                  <button onClick={() => deletePodcast(p.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10"
                    style={{ color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {podcasts.length === 0 && (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                Nessun podcast. {isSuperAdmin() ? 'Registra il primo!' : 'Torna più tardi.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TRANSMIT TAB (super admin only) */}
      {activeTab === 'transmit' && isSuperAdmin() && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              {isTransmitting ? '🔴 In diretta' : 'Avvia una diretta'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {isTransmitting
                ? 'La tua trasmissione è in corso. I listener possono ascoltare in diretta.'
                : 'Avvia una trasmissione live. Il microfono verrà attivato e l\'audio sarà trasmesso in tempo reale.'}
            </p>
            {isTransmitting ? (
              <button onClick={stopTransmission}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white text-lg"
                style={{ backgroundColor: '#dc2626' }}>
                <Square size={20} /> Ferma diretta
              </button>
            ) : (
              <button onClick={startTransmission}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white text-lg"
                style={{ backgroundColor: '#ef4444' }}>
                <Mic size={20} /> Vai in diretta
              </button>
            )}
          </div>

          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              <Settings size={18} className="inline mr-2" />
              Impostazioni stazione
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>Nome stazione</label>
                <input
                  value={stationName}
                  onChange={e => setStationName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border"
                  style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
              <button onClick={saveStationName}
                className="px-6 py-2 rounded-xl font-medium text-white"
                style={{ backgroundColor: 'var(--accent)' }}>
                Salva impostazioni
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <Music size={18} className="inline mr-2" />
              Gestione Podcast
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Vai alla sezione Podcast per registrare, caricare e gestire i tuoi podcast.
            </p>
            <button onClick={() => setActiveTab('podcasts')}
              className="mt-3 px-6 py-2 rounded-xl font-medium"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              Vai ai Podcast
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
