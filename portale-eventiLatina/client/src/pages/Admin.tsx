import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import {
  Shield, Users, CalendarDays, Globe, Plus,
  Trash2, RotateCw, Eye, Download, Settings,
  MapPin, Search, ToggleLeft, ToggleRight, ExternalLink, Save
} from 'lucide-react';

const PROVINCE_OPTIONS = [
  { code: 'LT', name: 'Latina' },
  { code: 'RM', name: 'Roma' },
  { code: 'FR', name: 'Frosinone' },
  { code: 'VT', name: 'Viterbo' },
  { code: 'RI', name: 'Rieti' },
];

const ALL_CATEGORIES = [
  { id: 'cat_music', name: 'Musica' },
  { id: 'cat_theater', name: 'Teatro' },
  { id: 'cat_culture', name: 'Cultura' },
  { id: 'cat_sports', name: 'Sport' },
  { id: 'cat_nature', name: 'Natura' },
  { id: 'cat_entertainment', name: 'Spettacolo' },
  { id: 'cat_food', name: 'Enogastronomia' },
];

export default function Admin() {
  const { user, isSuperAdmin } = useAuthStore();
  const [tab, setTab] = useState<'events' | 'scraper' | 'config' | 'users'>('events');
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [scraping, setScraping] = useState(false);
  const [scrapingResult, setScrapingResult] = useState('');
  const [previewEvents, setPreviewEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category_id: 'cat_culture',
    date: '', time: '', location: '', city: 'Latina', source_url: ''
  });

  // Search config state
  const [config, setConfig] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [configCities, setConfigCities] = useState('');
  const [configKeywords, setConfigKeywords] = useState('');
  const [configProvinces, setConfigProvinces] = useState<string[]>([]);
  const [configCategories, setConfigCategories] = useState<string[]>([]);
  const [configAutoScrape, setConfigAutoScrape] = useState(true);
  const [configInterval, setConfigInterval] = useState(6);
  const [showNewSource, setShowNewSource] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '', type: 'html', province: 'LT', city: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (tab === 'events') {
      api.events.list({ limit: '50' }).then((r) => setEvents(r.events)).catch(() => {});
    }
    if (tab === 'users' && isSuperAdmin()) {
      api.users.list().then(setUsers).catch(() => {});
    }
    if (tab === 'config') {
      loadConfig();
    }
  }, [tab]);

  const loadConfig = () => {
    api.searchConfig.get().then((res) => {
      setConfig(res.config);
      setSources(res.sources);
      if (res.config) {
        setConfigCities(JSON.parse(res.config.cities || '[]').join(', '));
        setConfigKeywords(JSON.parse(res.config.keywords || '[]').join(', '));
        setConfigProvinces(JSON.parse(res.config.provinces || '[]'));
        setConfigCategories(JSON.parse(res.config.categories || '[]'));
        setConfigAutoScrape(res.config.auto_scrape !== 0);
        setConfigInterval(res.config.scrape_interval_hours || 6);
      }
    }).catch(() => {});
  };

  const saveConfig = async () => {
    if (!config) return;
    try {
      const cities = configCities.split(',').map((s: string) => s.trim()).filter(Boolean);
      const keywords = configKeywords.split(',').map((s: string) => s.trim()).filter(Boolean);
      const updated = await api.searchConfig.update({
        id: config.id,
        cities,
        provinces: configProvinces,
        categories: configCategories,
        keywords,
        auto_scrape: configAutoScrape ? 1 : 0,
        scrape_interval_hours: configInterval,
      });
      setConfig(updated);
      setScrapingResult('Configurazione salvata!');
      setTimeout(() => setScrapingResult(''), 2000);
    } catch {
      setScrapingResult('Errore nel salvataggio');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.events.create(form);
      setShowForm(false);
      setForm({ title: '', description: '', category_id: 'cat_culture', date: '', time: '', location: '', city: 'Latina', source_url: '' });
      const r = await api.events.list({ limit: '50' });
      setEvents(r.events);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo evento?')) return;
    try {
      await api.events.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {}
  };

  const handleScrape = async () => {
    setScraping(true);
    setScrapingResult('');
    try {
      const res = await api.scraper.run();
      setScrapingResult(`Scraping completato: ${res.count} nuovi eventi trovati.`);
    } catch {
      setScrapingResult('Errore durante lo scraping.');
    }
    setScraping(false);
  };

  const handlePreview = async () => {
    setScraping(true);
    try {
      const res = await api.scraper.preview();
      setPreviewEvents(res.events || []);
      setScrapingResult(`${res.count} eventi trovati online.`);
    } catch {
      setScrapingResult('Errore durante la preview.');
    }
    setScraping(false);
  };

  const handleSearchWeb = async () => {
    if (searchQuery.trim().length < 3) return;
    setSearching(true);
    try {
      const res = await api.scraper.search(searchQuery);
      setSearchResults(res.events || []);
      setScrapingResult(`${res.count} risultati trovati per "${searchQuery}".`);
    } catch {
      setScrapingResult('Errore nella ricerca web.');
    }
    setSearching(false);
  };

  const handleSavePreview = async () => {
    if (previewEvents.length === 0) return;
    try {
      const res = await api.scraper.savePreview(previewEvents);
      setScrapingResult(`${res.count} eventi salvati da preview.`);
      setPreviewEvents([]);
      const r = await api.events.list({ limit: '50' });
      setEvents(r.events);
    } catch {
      setScrapingResult('Errore nel salvataggio preview.');
    }
  };

  const handleSaveSearchResults = async () => {
    if (searchResults.length === 0) return;
    try {
      const res = await api.scraper.savePreview(searchResults);
      setScrapingResult(`${res.count} eventi salvati dalla ricerca web.`);
      setSearchResults([]);
    } catch {
      setScrapingResult('Errore nel salvataggio.');
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.users.updateRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch {}
  };

  const toggleProvince = (code: string) => {
    setConfigProvinces((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const toggleCategory = (id: string) => {
    setConfigCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.url) return;
    try {
      await api.searchConfig.createSource(newSource);
      setNewSource({ name: '', url: '', type: 'html', province: 'LT', city: '' });
      setShowNewSource(false);
      loadConfig();
    } catch {}
  };

  const handleToggleSource = async (source: any) => {
    try {
      await api.searchConfig.updateSource(source.id, { is_active: source.is_active ? 0 : 1 });
      loadConfig();
    } catch {}
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('Eliminare questa fonte?')) return;
    try {
      await api.searchConfig.deleteSource(id);
      loadConfig();
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pannello Admin</h1>
          <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <Shield size={14} />
            {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
        {[
          { id: 'events', label: 'Eventi', icon: CalendarDays },
          { id: 'scraper', label: 'Motore Ricerca', icon: Globe },
          { id: 'config', label: 'Criteri Ricerca', icon: Settings },
          ...(isSuperAdmin() ? [{ id: 'users', label: 'Utenti', icon: Users }] : []),
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'text-white' : ''}`}
              style={{
                backgroundColor: tab === t.id ? 'var(--accent)' : 'transparent',
                color: tab === t.id ? 'white' : 'var(--text-primary)',
              }}>
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'events' && (
        <div className="space-y-4">
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Plus size={16} /> {showForm ? 'Chiudi' : 'Nuovo Evento Manuale'}
          </button>
          {showForm && (
            <form onSubmit={handleCreate} className="rounded-xl border p-4 space-y-3 shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <input type="text" placeholder="Titolo *" value={form.title} required
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
              <textarea placeholder="Descrizione" value={form.description} rows={3}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any}>
                  {ALL_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                <input type="text" placeholder="Luogo" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                <input type="text" placeholder="Città" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
              </div>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--accent)' }}>
                <Save size={16} className="inline mr-1" /> Crea Evento
              </button>
            </form>
          )}
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border shadow-sm"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {event.category_name} &middot; {event.city} ({event.province}) &middot; {event.date}{event.is_auto_generated ? ' \u2022 Web' : ''}
                  </p>
                </div>
                <button onClick={() => handleDelete(event.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'scraper' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-6 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Globe size={24} style={{ color: 'var(--accent)' }} />
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Motore di Ricerca Web</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Cerca automaticamente eventi su oltre 15 fonti in tutto il Lazio
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleScrape} disabled={scraping}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)' }}>
                <RotateCw size={16} className={scraping ? 'animate-spin' : ''} />
                {scraping ? 'Scraping in corso...' : 'Avvia Scraping Completo'}
              </button>
              <button onClick={handlePreview} disabled={scraping}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-50"
                style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                <Eye size={16} /> Anteprima Nuovi
              </button>
            </div>
            {scrapingResult && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <p style={{ color: 'var(--text-primary)' }}>{scrapingResult}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-6 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Search size={24} style={{ color: 'var(--accent)' }} />
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ricerca Web Manuale</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Cerca eventi su Google con parole chiave personalizzate
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="es. concerti Roma giugno 2026, sagre Latina..."
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchWeb()} />
              <button onClick={handleSearchWeb} disabled={searching || searchQuery.trim().length < 3}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)' }}>
                <Search size={16} /> Cerca
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {searchResults.length} risultati
                  </p>
                  <button onClick={handleSaveSearchResults}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent)' }}>
                    <Download size={12} /> Salva tutti
                  </button>
                </div>
                <div className="divide-y max-h-60 overflow-y-auto rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
                  {searchResults.map((event, i) => (
                    <div key={i} className="p-3 text-sm">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {event.source_name} &middot; {event.city} ({event.province})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {previewEvents.length > 0 && (
            <div className="rounded-xl border shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Anteprima ({previewEvents.length} eventi)
                </h3>
                <button onClick={handleSavePreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--accent)' }}>
                  <Download size={16} /> Salva tutti
                </button>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: 'var(--card-border)' }}>
                {previewEvents.map((event, i) => (
                  <div key={i} className="p-4 text-sm">
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {event.source_name} &middot; {event.date} &middot; {event.city} ({event.province})
                    </p>
                    {event.source_url && (
                      <a href={event.source_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs mt-1 inline-flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--accent)' }}>
                        <ExternalLink size={10} />
                        {event.source_url.substring(0, 50)}...
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'config' && (
        <div className="space-y-6">
          <div className="rounded-xl border p-6 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Settings size={24} style={{ color: 'var(--accent)' }} />
                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Criteri di Ricerca</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Configura come e dove cercare gli eventi nel Lazio
                  </p>
                </div>
              </div>
              <button onClick={saveConfig}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--accent)' }}>
                <Save size={16} /> Salva Configurazione
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  <MapPin size={16} className="inline mr-1" /> Province da cercare
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROVINCE_OPTIONS.map((p) => (
                    <button key={p.code} onClick={() => toggleProvince(p.code)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${configProvinces.includes(p.code) ? 'text-white' : ''}`}
                      style={{
                        backgroundColor: configProvinces.includes(p.code) ? 'var(--accent)' : 'var(--bg-primary)',
                        borderColor: configProvinces.includes(p.code) ? 'transparent' : 'var(--card-border)',
                        color: configProvinces.includes(p.code) ? 'white' : 'var(--text-primary)',
                      }}>
                      {p.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Seleziona le province in cui cercare eventi. Se nessuna selezionata, cerca in tutto il Lazio.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  Categorie da cercare
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map((c) => (
                    <button key={c.id} onClick={() => toggleCategory(c.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${configCategories.includes(c.id) ? 'text-white' : ''}`}
                      style={{
                        backgroundColor: configCategories.includes(c.id) ? 'var(--accent)' : 'var(--bg-primary)',
                        borderColor: configCategories.includes(c.id) ? 'transparent' : 'var(--card-border)',
                        color: configCategories.includes(c.id) ? 'white' : 'var(--text-primary)',
                      }}>
                      {c.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Seleziona le categorie di interesse. Se nessuna selezionata, cerca in tutte.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>
                    Città specifiche (separate da virgola)
                  </label>
                  <input type="text" value={configCities} onChange={(e) => setConfigCities(e.target.value)}
                    placeholder="es. Latina, Roma, Frosinone, Viterbo"
                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>
                    Parole chiave (separate da virgola)
                  </label>
                  <input type="text" value={configKeywords} onChange={(e) => setConfigKeywords(e.target.value)}
                    placeholder="es. concerto, mostra, festival, sagra"
                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={configAutoScrape}
                    onChange={(e) => setConfigAutoScrape(e.target.checked)}
                    className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Scraping automatico</span>
                </label>
                {configAutoScrape && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ogni</span>
                    <select value={configInterval} onChange={(e) => setConfigInterval(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg border text-sm outline-none"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any}>
                      <option value={1}>1 ora</option>
                      <option value={3}>3 ore</option>
                      <option value={6}>6 ore</option>
                      <option value={12}>12 ore</option>
                      <option value={24}>24 ore</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border shadow-sm overflow-hidden"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
              <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Globe size={18} /> Fonti Web ({sources.length})
              </h2>
              <button onClick={() => setShowNewSource(!showNewSource)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--accent)' }}>
                <Plus size={14} /> Aggiungi Fonte
              </button>
            </div>

            {showNewSource && (
              <div className="p-4 border-b space-y-3" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--bg-primary)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Nome fonte" value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    className="px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                  <input type="text" placeholder="URL" value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    className="px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                </div>
                <div className="flex gap-3">
                  <select value={newSource.type} onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                    className="px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any}>
                    <option value="html">HTML</option>
                    <option value="rss">RSS Feed</option>
                  </select>
                  <select value={newSource.province} onChange={(e) => setNewSource({ ...newSource, province: e.target.value })}
                    className="px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any}>
                    <option value="">Tutto il Lazio</option>
                    {PROVINCE_OPTIONS.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                  <input type="text" placeholder="Città (opzionale)" value={newSource.city}
                    onChange={(e) => setNewSource({ ...newSource, city: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
                </div>
                <button onClick={handleAddSource}
                  className="px-5 py-2 rounded-xl text-white font-medium text-sm"
                  style={{ backgroundColor: 'var(--accent)' }}>
                  Aggiungi
                </button>
              </div>
            )}

            <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button onClick={() => handleToggleSource(source)}
                      className="shrink-0" title={source.is_active ? 'Disattiva' : 'Attiva'}>
                      {source.is_active
                        ? <ToggleRight size={24} style={{ color: 'var(--accent)' }} />
                        : <ToggleLeft size={24} style={{ color: 'var(--text-secondary)' }} />}
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {source.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {source.url} &middot; {source.type.toUpperCase()} &middot; {source.province ? PROVINCE_OPTIONS.find(p => p.code === source.province)?.name || source.province : 'Lazio'}
                        {source.last_scraped_at ? ` \u2022 Ultimo: ${new Date(source.last_scraped_at).toLocaleDateString('it-IT')}` : ''}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteSource(source.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {scrapingResult && (
            <div className="p-3 rounded-xl text-sm text-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <p style={{ color: 'var(--text-primary)' }}>{scrapingResult}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'users' && isSuperAdmin() && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: 'var(--accent)' }}>
                      {u.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
                </div>
              </div>
              <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}
                className="px-3 py-1.5 rounded-xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
