import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { api } from './lib/api';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import SavedEvents from './pages/SavedEvents';
import Radio from './pages/Radio';
import LoginPage from './pages/LoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  if (!user || !token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  if (!user || !token) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'super_admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      api.auth.getMe().then((u) => {
        useAuthStore.getState().setAuth(u, token);
      }).catch(() => logout());
    }
  }, []);

  useEffect(() => {
    if (user?.accent_color) {
      document.documentElement.style.setProperty('--accent', user.accent_color);
      document.documentElement.style.setProperty('--accent-light', user.accent_color + 'cc');
    }
    if (user?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (user?.theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.accent_color, user?.theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="saved" element={<SavedEvents />} />
        <Route path="radio" element={<Radio />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Route>
    </Routes>
  );
}
