import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'user' | 'admin' | 'super_admin';
  theme?: string;
  accent_color?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().user && !!get().token,
      isAdmin: () => get().user?.role === 'admin' || get().user?.role === 'super_admin',
      isSuperAdmin: () => get().user?.role === 'super_admin',
    }),
    { name: 'eventinlatina-auth' }
  )
);
