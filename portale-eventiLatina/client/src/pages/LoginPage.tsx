import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { MapPin, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      const res = await api.auth.googleLogin(credentialResponse.credential);
      setAuth(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Errore durante il login con Google');
      console.error('Login error:', err);
    }
  };

  const handleDemo = async () => {
    setDemoLoading(true);
    setError('');
    try {
      const res = await api.auth.demoLogin();
      setAuth(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Errore nella modalità demo. Avvia il server con "npm run dev".');
      console.error('Demo login error:', err);
    }
    setDemoLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: 'var(--accent)' }}>
            <span className="text-3xl font-bold text-white">EL</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            eventiNLatina
          </h1>
          <p className="mt-2 flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={16} />
            Scopri tutti gli eventi a Latina e provincia
          </p>
        </div>

        <div className="rounded-2xl p-8 shadow-xl border animate-fade-in"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-semibold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
            Benvenuto
          </h2>
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
            Accedi per scoprire tutti gli eventi
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => setError('Login Google fallito')}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                />
              </div>
            )}

            <div className="relative">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--card-border)' }} />
                </div>
              )}
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'oppure' : ''}
                </span>
              </div>
            </div>

            <button onClick={handleDemo} disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-medium transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}>
              <Sparkles size={18} />
              {demoLoading ? 'Accesso in corso...' : 'Modalità Demo (Super Admin)'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Categorie: Musica &bull; Teatro &bull; Cultura &bull; Sport &bull; Natura &bull; Spettacolo &bull; Enogastronomia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
