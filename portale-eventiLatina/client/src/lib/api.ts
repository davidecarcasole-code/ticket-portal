import { useAuthStore } from '../store/authStore';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Errore di rete' }));
    throw new Error(err.error || `Errore ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    googleLogin: (credential: string) =>
      request<{ token: string; user: any }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      }),
    demoLogin: () =>
      request<{ token: string; user: any }>('/auth/demo', {
        method: 'POST',
      }),
    getMe: () => request<any>('/auth/me'),
  },
  events: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ events: any[]; pagination: any }>(`/events${qs}`);
    },
    get: (id: string) => request<any>(`/events/${id}`),
    create: (data: any) =>
      request<any>('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/events/${id}`, { method: 'DELETE' }),
    save: (id: string) =>
      request<any>(`/events/${id}/save`, { method: 'POST' }),
    unsave: (id: string) =>
      request<any>(`/events/${id}/save`, { method: 'DELETE' }),
    saved: () => request<any[]>('/events/saved/mine'),
  },
  users: {
    me: () => request<any>('/users/me'),
    updateMe: (data: any) =>
      request<any>('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
    list: () => request<any[]>('/users'),
    updateRole: (id: string, role: string) =>
      request<any>(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  },
  scraper: {
    run: () => request<any>('/scraper/run', { method: 'POST' }),
    preview: () => request<any>('/scraper/preview', { method: 'POST' }),
    search: (query: string) =>
      request<any>('/scraper/search', { method: 'POST', body: JSON.stringify({ query }) }),
    savePreview: (events: any[]) =>
      request<any>('/scraper/save-preview', { method: 'POST', body: JSON.stringify({ events }) }),
  },
  searchConfig: {
    get: () => request<{ config: any; sources: any[] }>('/search-config'),
    update: (data: any) =>
      request<any>('/search-config', { method: 'PUT', body: JSON.stringify(data) }),
    updateSource: (id: string, data: any) =>
      request<any>(`/search-config/source/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    createSource: (data: any) =>
      request<any>('/search-config/source', { method: 'POST', body: JSON.stringify(data) }),
    deleteSource: (id: string) =>
      request<any>(`/search-config/source/${id}`, { method: 'DELETE' }),
  },
  radio: {
    getSettings: () => request<any>('/radio/settings'),
    updateSettings: (data: any) =>
      request<any>('/radio/settings', { method: 'PUT', body: JSON.stringify(data) }),
    getPodcasts: () => request<any[]>('/radio/podcasts'),
    getPodcast: (id: string) => request<any>(`/radio/podcasts/${id}`),
    createPodcast: (data: any) =>
      request<any>('/radio/podcasts', { method: 'POST', body: JSON.stringify(data) }),
    deletePodcast: (id: string) =>
      request<any>(`/radio/podcasts/${id}`, { method: 'DELETE' }),
    uploadPodcastAudio: (id: string, blob: Blob) => {
      return fetch(`/api/radio/podcasts/${id}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
        body: blob,
      }).then(r => r.json());
    },
    getLiveStatus: () => request<{ is_live: boolean; station_name: string }>('/radio/live/status'),
    startLive: () => request<any>('/radio/live/start', { method: 'POST' }),
    stopLive: () => request<any>('/radio/live/stop', { method: 'POST' }),
    sendLiveChunk: async (chunk: Blob, index: number) => {
      return fetch(`/api/radio/live/chunk-binary?index=${index}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
        body: chunk,
      }).then(r => r.json());
    },
    getLiveChunks: () => request<{ live: boolean; chunks: Array<{ index: number; data: string }> }>('/radio/live/chunks'),
  },
};
