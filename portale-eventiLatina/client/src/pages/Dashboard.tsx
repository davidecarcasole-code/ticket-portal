import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import {
  Music, Drama, BookOpen, Trophy, Leaf, Sparkles, Utensils,
  CalendarDays, TrendingUp, ArrowRight, MapPin, Clock
} from 'lucide-react';

const categories = [
  { slug: 'musica', name: 'Musica', icon: Music, color: '#ef4444', count: 0 },
  { slug: 'teatro', name: 'Teatro', icon: Drama, color: '#f59e0b', count: 0 },
  { slug: 'cultura', name: 'Cultura', icon: BookOpen, color: '#3b82f6', count: 0 },
  { slug: 'sport', name: 'Sport', icon: Trophy, color: '#10b981', count: 0 },
  { slug: 'natura', name: 'Natura', icon: Leaf, color: '#22c55e', count: 0 },
  { slug: 'spettacolo', name: 'Spettacolo', icon: Sparkles, color: '#ec4899', count: 0 },
  { slug: 'enogastronomia', name: 'Enogastronomia', icon: Utensils, color: '#a855f7', count: 0 },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    api.events.list({ limit: '6' }).then((res) => {
      setRecentEvents(res.events);
      setStats((prev) => ({ ...prev, total: res.pagination.total }));
    }).catch(() => {});

    const today = new Date().toISOString().split('T')[0];
    api.events.list({ dateFrom: today, limit: '1' }).then((res) => {
      setStats((prev) => ({ ...prev, today: res.pagination.total }));
    }).catch(() => {});

    const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    api.events.list({ dateFrom: today, dateTo: weekLater, limit: '1' }).then((res) => {
      setStats((prev) => ({ ...prev, thisWeek: res.pagination.total }));
    }).catch(() => {});

    Promise.all(
      categories.map((cat) =>
        api.events.list({ category: cat.slug, limit: '1' }).then((res) => ({
          slug: cat.slug,
          count: res.pagination.total,
        }))
      )
    ).then((results) => {
      const counts: Record<string, number> = {};
      results.forEach((r) => { counts[r.slug] = r.count; });
      setCategoryCounts(counts);
    }).catch(() => {});
  }, []);

  const formatDate = (d: string) => {
    return new Date(d + 'T00:00:00').toLocaleDateString('it-IT', {
      weekday: 'short', day: 'numeric', month: 'short',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Ciao, {user?.name?.split(' ')[0] || 'Utente'}!
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Scopri gli eventi a Latina e provincia
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Eventi Oggi', value: stats.today, icon: Clock, color: '#3b82f6' },
          { label: 'Questa Settimana', value: stats.thisWeek, icon: TrendingUp, color: '#10b981' },
          { label: 'Totale Eventi', value: stats.total, icon: CalendarDays, color: '#8b5cf6' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label}
              className="rounded-xl p-4 border shadow-sm transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center opacity-20"
                  style={{ backgroundColor: stat.color }}>
                  <Icon size={20} color="white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Categorie</h2>
          <Link to="/events" className="text-sm font-medium flex items-center gap-1 hover:underline"
            style={{ color: 'var(--accent)' }}>
            Tutti gli eventi <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.slug] || 0;
            return (
              <Link key={cat.slug} to={`/events?category=${cat.slug}`}
                className="rounded-xl p-4 border shadow-sm text-center transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: cat.color + '20' }}>
                  <Icon size={24} style={{ color: cat.color }} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat.name}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {count} {count === 1 ? 'evento' : 'eventi'}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Prossimi Eventi</h2>
          <Link to="/events" className="text-sm font-medium flex items-center gap-1 hover:underline"
            style={{ color: 'var(--accent)' }}>
            Vedi tutti <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}
              className="rounded-xl border shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="h-40 overflow-hidden" style={{ backgroundColor: (event.category_color || '#6366f1') + '15' }}>
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CalendarDays size={48} style={{ color: (event.category_color || '#6366f1') + '40' }} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: (event.category_color || '#6366f1') + '20', color: event.category_color || '#6366f1' }}>
                    {event.category_name}
                  </span>
                  {event.is_auto_generated === 1 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Web</span>
                  )}
                </div>
                <h3 className="font-semibold mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
