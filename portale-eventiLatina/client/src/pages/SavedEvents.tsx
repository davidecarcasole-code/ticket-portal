import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Bookmark, CalendarDays, MapPin, BookmarkCheck } from 'lucide-react';

export default function SavedEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    setLoading(true);
    api.events.saved().then(setEvents).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleUnsave = async (id: string) => {
    try {
      await api.events.unsave(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {}
  };

  const formatDate = (d: string) => {
    return new Date(d + 'T00:00:00').toLocaleDateString('it-IT', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Eventi Salvati</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Nessun evento salvato</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Salva gli eventi che ti interessano per ritrovarli facilmente
          </p>
          <Link to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium text-sm mt-4 transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--accent)' }}>
            Scopri Eventi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id}
              className="rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <Link to={`/events/${event.id}`} className="block p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: (event.category_color || '#6366f1') + '20', color: event.category_color || '#6366f1' }}>
                    {event.category_name}
                  </span>
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
              </Link>
              <div className="px-4 pb-3">
                <button onClick={() => handleUnsave(event.id)}
                  className="flex items-center gap-1 text-xs font-medium transition-all hover:underline"
                  style={{ color: '#ef4444' }}>
                  <BookmarkCheck size={14} /> Rimuovi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
