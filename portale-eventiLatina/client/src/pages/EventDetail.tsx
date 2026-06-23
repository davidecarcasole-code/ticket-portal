import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import {
  CalendarDays, MapPin, Clock, ExternalLink, ArrowLeft,
  Bookmark, BookmarkCheck, Trash2, Edit3
} from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.events.get(id).then(setEvent).catch(() => navigate('/events')).finally(() => setLoading(false));
    api.events.saved().then((events) => {
      setSaved(events.some((e: any) => e.id === id));
    }).catch(() => {});
  }, [id]);

  const toggleSave = async () => {
    if (!id) return;
    try {
      if (saved) {
        await api.events.unsave(id);
        setSaved(false);
      } else {
        await api.events.save(id);
        setSaved(true);
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!id || !confirm('Eliminare questo evento?')) return;
    try {
      await api.events.delete(id);
      navigate('/events');
    } catch {}
  };

  const formatDate = (d: string) => {
    return new Date(d + 'T00:00:00').toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link to="/events" className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: 'var(--accent)' }}>
        <ArrowLeft size={16} /> Torna agli eventi
      </Link>

      <div className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {event.image_url && (
          <div className="h-56 sm:h-72 overflow-hidden">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: (event.category_color || '#6366f1') + '20', color: event.category_color || '#6366f1' }}>
                {event.category_name}
              </span>
              <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                {event.title}
              </h1>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={toggleSave}
                className="p-2 rounded-xl border transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--card-border)', color: saved ? '#ef4444' : 'var(--text-secondary)' }}>
                {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1.5">
              <CalendarDays size={16} style={{ color: 'var(--accent)' }} />
              {formatDate(event.date)}
              {event.end_date && <> — {formatDate(event.end_date)}</>}
            </div>
            {event.time && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                {event.time}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={16} style={{ color: 'var(--accent)' }} />
                {event.location}{event.city ? `, ${event.city}` : ''}
              </div>
            )}
          </div>

          {event.description && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <h2 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Descrizione</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                {event.description}
              </p>
            </div>
          )}

          {event.source_url && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <a href={event.source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--accent)' }}>
                <ExternalLink size={16} />
                Maggiori Info {event.source_name ? `(${event.source_name})` : ''}
              </a>
            </div>
          )}

          {isAdmin() && (
            <div className="pt-4 border-t flex gap-2" style={{ borderColor: 'var(--card-border)' }}>
              <button onClick={() => navigate(`/events?id=${event.id}`)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                <Edit3 size={16} /> Modifica
              </button>
              <button onClick={handleDelete}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-medium text-red-500 transition-all hover:bg-red-50"
                style={{ borderColor: 'var(--card-border)' }}>
                <Trash2 size={16} /> Elimina
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
