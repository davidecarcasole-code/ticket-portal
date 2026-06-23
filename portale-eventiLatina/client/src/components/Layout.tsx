import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, CalendarDays, Bookmark, User, Shield,
  LogOut, Menu, X, Search, MapPin, Radio
} from 'lucide-react';
import { useState } from 'react';
import RadioPlayer from './RadioPlayer';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/events', label: 'Eventi', icon: CalendarDays },
  { path: '/radio', label: 'Web Radio', icon: Radio },
  { path: '/saved', label: 'Salvati', icon: Bookmark },
  { path: '/profile', label: 'Profilo', icon: User },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 rounded-lg" style={{ color: 'var(--text-primary)' }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: 'var(--accent)' }}>
                EL
              </div>
              <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--text-primary)' }}>
                eventiNLatina
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <Link to="/events"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  <Search size={16} />
                  Cerca Eventi
                </Link>
                {isAdmin() && (
                  <Link to="/admin"
                    className={`p-2 rounded-lg transition-colors ${location.pathname === '/admin' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    style={{ color: 'var(--text-primary)' }}>
                    <Shield size={20} />
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden transition-all"
                    style={{ boxShadow: '0 0 0 2px var(--accent)' }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: 'var(--accent)' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <button onClick={handleLogout}
                  className="p-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}>
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 lg:z-auto transform transition-transform duration-200 border-r lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-white shadow-md' : 'hover:opacity-80'}`}
                  style={{
                    backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
                  }}>
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-3 px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={14} />
                Latina & Provincia
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {mobileOpen && (
            <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
          )}
          <Outlet />
        </main>
      </div>
      <RadioPlayer />
    </div>
  );
}
