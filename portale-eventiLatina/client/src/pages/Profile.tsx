import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { Mail, Shield, Palette, Sun, Moon, LogOut, Check, Camera } from 'lucide-react';

const themes = [
  { id: 'default', label: 'Sistema', icon: Sun, dark: false, auto: true },
  { id: 'light', label: 'Chiaro', icon: Sun },
  { id: 'dark', label: 'Scuro', icon: Moon },
];

const accentColors = [
  { label: 'Indaco', value: '#6366f1' },
  { label: 'Viola', value: '#8b5cf6' },
  { label: 'Rosa', value: '#ec4899' },
  { label: 'Rosso', value: '#ef4444' },
  { label: 'Arancione', value: '#f97316' },
  { label: 'Verde', value: '#10b981' },
  { label: 'Blu', value: '#3b82f6' },
  { label: 'Ciano', value: '#06b6d4' },
];

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.users.updateMe({ name });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const setTheme = async (theme: string) => {
    try {
      const updated = await api.users.updateMe({ theme });
      updateUser(updated);
    } catch {}
  };

  const setAccent = async (color: string) => {
    try {
      const updated = await api.users.updateMe({ accent_color: color });
      updateUser(updated);
    } catch {}
  };

  const handleAvatarUpdate = () => {
    const url = prompt('Inserisci URL immagine profilo:');
    if (url) {
      api.users.updateMe({ avatar: url }).then((u) => updateUser(u)).catch(() => {});
    }
  };

  const roleLabel = user?.role === 'super_admin' ? 'Super Admin'
    : user?.role === 'admin' ? 'Admin' : 'Utente';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Il Mio Profilo</h1>

      <div className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent)' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-white font-bold"
                    style={{ backgroundColor: 'var(--accent)' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <button onClick={handleAvatarUpdate}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-white"
                style={{ backgroundColor: 'var(--accent)' }}>
                <Camera size={14} color="white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
              <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={14} /> {user?.email}
              </p>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 font-medium"
                style={{ backgroundColor: 'var(--accent)' + '20', color: 'var(--accent)' }}>
                <Shield size={12} /> {roleLabel}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text-primary)' }}>Nome</label>
            <div className="flex gap-2">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' } as any} />
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)' }}>
                {saved ? <Check size={18} /> : 'Salva'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-6 space-y-6">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Palette size={20} /> Personalizzazione
          </h2>

          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Tema</label>
            <div className="flex gap-2">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = (t.auto && (!user?.theme || user.theme === 'default'))
                  || user?.theme === t.id;
                return (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${isActive ? 'text-white' : ''}`}
                    style={{
                      backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-primary)',
                      borderColor: isActive ? 'transparent' : 'var(--card-border)',
                      color: isActive ? 'white' : 'var(--text-primary)',
                    }}>
                    <Icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Colore Accento</label>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((c) => (
                <button key={c.value} onClick={() => setAccent(c.value)}
                  className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.value,
                    borderColor: user?.accent_color === c.value ? 'var(--text-primary)' : 'transparent',
                    boxShadow: user?.accent_color === c.value ? `0 0 0 2px ${c.value}` : 'none',
                  }}
                  title={c.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-6">
          <button onClick={() => { logout(); window.location.href = '/login'; }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border text-sm font-medium text-red-500 transition-all hover:bg-red-50"
            style={{ borderColor: 'var(--card-border)' }}>
            <LogOut size={16} /> Esci
          </button>
        </div>
      </div>
    </div>
  );
}
