import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Search, CalendarDays, MapPin, Filter, X,
  Music, Drama, BookOpen, Trophy, Leaf, Sparkles, Utensils, ExternalLink
} from 'lucide-react';

const catIcons: Record<string, any> = {
  musica: Music, teatro: Drama, cultura: BookOpen,
  sport: Trophy, natura: Leaf, spettacolo: Sparkles, enogastronomia: Utensils,
};

const categories = [
  { slug: '', name: 'Tutte' },
  { slug: 'musica', name: 'Musica' },
  { slug: 'teatro', name: 'Teatro' },
  { slug: 'cultura', name: 'Cultura' },
  { slug: 'sport', name: 'Sport' },
  { slug: 'natura', name: 'Natura' },
  { slug: 'spettacolo', name: 'Spettacolo' },
  { slug: 'enogastronomia', name: 'Enogastronomia' },
];

const provinces = [
  { code: '', name: 'Tutto il Lazio' },
  { code: 'LT', name: 'Latina' },
  { code: 'RM', name: 'Roma' },
  { code: 'FR', name: 'Frosinone' },
  { code: 'VT', name: 'Viterbo' },
  { code: 'RI', name: 'Rieti' },
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [province, setProvince] = useState(searchParams.get('province') || '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '');

  const fetchEvents = () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(pagination.page) };
    if (category) params.category = category;
    if (province) params.province = province;
    if (search) params.search = search;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    api.events.list(params).then((res) => {
      setEvents(res.events);
      setPagination(res.pagination);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [category, province, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchEvents();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setProvince('');
    setDateFrom('');
    setDateTo('');
    setPagination((p) => ({ ...p, page: 1 }));
    setSearchParams({});
  };

  const formatDate = (d: string) => {
    return new Date(d + 'T00:00:00').toLocaleDateString('it-IT', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const hasFilters = search || category || province || dateFrom || dateTo;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Eventi</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {pagination.total} eventi trovati nel Lazio
        </p>
      </div>

      <form onSubmit={handleSearch}
        className="rounded-xl p-4 border shadow-sm space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca eventi per titolo, luogo..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' } as any} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {provinces.map((p) => (
              <button key={p.code} type="button" onClick={() => { setProvince(p.code); setPagination((p) => ({ ...p, page: 1 })); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${province === p.code ? 'text-white border-transparent' : ''}`}
                style={{
                  backgroundColor: province === p.code ? 'var(--accent)' : 'var(--bg-primary)',
                  color: province === p.code ? 'white' : 'var(--text-primary)',
                  borderColor: province === p.code ? 'transparent' : 'var(--card-border)',
                }}>
                {p.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button key={cat.slug} type="button" onClick={() => { setCategory(cat.slug); setPagination((p) => ({ ...p, page: 1 })); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${category === cat.slug ? 'text-white border-transparent' : ''}`}
                style={{
                  backgroundColor: category === cat.slug ? 'var(--accent)' : 'var(--bg-primary)',
                  color: category === cat.slug ? 'white' : 'var(--text-primary)',
                  borderColor: category === cat.slug ? 'transparent' : 'var(--card-border)',
                }}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex gap-3 flex-1">
            <div className="flex-1">
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Dal</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Al</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit"
              className="px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--accent)' }}>
              <Filter size={16} className="inline mr-1" /> Filtra
            </button>
            {hasFilters && (
              <button type="button" onClick={clearFilters}
                className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                <X size={16} className="inline mr-1" /> Cancella
              </button>
            )}
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Nessun evento trovato</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Prova a modificare i filtri di ricerca</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {events.map((event) => {
              const Icon = catIcons[event.category_slug] || CalendarDays;
              return (
                <Link key={event.id} to={`/events/${event.id}`}
                  className="rounded-xl border shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: (event.category_color || '#6366f1') + '20' }}>
                        <Icon size={16} style={{ color: event.category_color || '#6366f1' }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: event.category_color }}>
                        {event.category_name}
                      </span>
                      {event.is_auto_generated === 1 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 ml-auto">
                          <ExternalLink size={10} className="inline mr-0.5" />Web
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {event.title}
                    </h3>
                    <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <CalendarDays size={14} />
                      {formatDate(event.date)}
                      {event.time && <> &middot; {event.time}</>}
                    </p>
                    {event.location && (
                      <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin size={12} />
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPagination((prev) => ({ ...prev, page: p }))}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === pagination.page ? 'text-white shadow-md' : 'border'}`}
                  style={{
                    backgroundColor: p === pagination.page ? 'var(--accent)' : 'var(--card-bg)',
                    color: p === pagination.page ? 'white' : 'var(--text-primary)',
                    borderColor: p === pagination.page ? 'transparent' : 'var(--card-border)',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
