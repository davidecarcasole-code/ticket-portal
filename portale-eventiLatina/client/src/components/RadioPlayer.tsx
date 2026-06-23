import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { Radio, Headphones, Circle, Play, Pause } from 'lucide-react';

export default function RadioPlayer() {
  const [settings, setSettings] = useState<any>(null);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<{ title: string; url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollRef = useRef<any>(null);

  useEffect(() => {
    api.radio.getSettings().then(setSettings).catch(() => {});
    api.radio.getPodcasts().then(setPodcasts).catch(() => {});
    api.radio.getLiveStatus().then(r => setIsLive(r.is_live)).catch(() => {});
  }, []);

  // Poll live status
  useEffect(() => {
    if (!isOpen) return;
    pollRef.current = setInterval(async () => {
      try {
        const status = await api.radio.getLiveStatus();
        setIsLive(status.is_live);
      } catch {}
    }, 10000);
    return () => clearInterval(pollRef.current);
  }, [isOpen]);

  const playPodcast = (podcast: any) => {
    if (currentTrack?.url === `/api/radio/uploads/${podcast.id}.webm` && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    setCurrentTrack({ title: podcast.title, url: `/api/radio/uploads/${podcast.id}.webm` });
    setIsPlaying(true);
    setAudioLoaded(false);
  };

  const playLive = async () => {
    if (isLive && currentTrack?.title === '🔴 Live') {
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentTrack(null);
      return;
    }
    if (!isLive) return;
    setCurrentTrack({ title: '🔴 Live', url: '' });
    setIsPlaying(true);
    // For live, we won't use audio element - just show the status
  };

  useEffect(() => {
    if (!currentTrack?.url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = currentTrack.url;
    audioRef.current.play().then(() => {
      setAudioLoaded(true);
    }).catch(() => {
      setIsPlaying(false);
    });
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentTrack(null);
    };
    audioRef.current.onerror = () => {
      setIsPlaying(false);
    };
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [currentTrack?.url]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  if (!settings) return null;

  return (
    <>
      {/* Floating mini player button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: 'var(--accent)' }}
        title="Radio"
      >
        {isLive ? (
          <span className="relative">
            <Radio size={24} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </span>
        ) : (
          <Headphones size={24} className="text-white" />
        )}
      </button>

      {/* Player panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 rounded-2xl shadow-2xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--card-border)',
            maxHeight: '60vh',
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {settings.station_name || 'Radio Eventi Latina'}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {isLive ? '🔴 In diretta' : '🎧 Podcast'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            {/* Now playing */}
            {currentTrack && (
              <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {isPlaying ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {currentTrack.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {audioLoaded ? 'In riproduzione...' : 'Caricamento...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content tabs */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 120px)' }}>
            {/* Podcast list */}
            {podcasts.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-semibold px-2 py-1" style={{ color: 'var(--text-secondary)' }}>
                  PODCAST
                </p>
                {podcasts.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => playPodcast(p)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:opacity-80 text-left"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: currentTrack?.url === `/api/radio/uploads/${p.id}.webm` ? 'var(--accent)' : 'transparent',
                    }}
                  >
                    <Play size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      {p.duration > 0 && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {Math.floor(p.duration / 60)}:{(p.duration % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {podcasts.length === 0 && !isLive && (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Headphones size={32} className="mx-auto mb-2 opacity-50" />
                Nessun podcast disponibile
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
