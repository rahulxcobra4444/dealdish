import { api } from './client';

export const adminApi = {
  getHealth: (token: string) =>
    api<{ data: unknown }>('/api/admin/health', { token }),

  getStats: (token: string) =>
    api<{ data: unknown }>('/api/admin/stats', { token }),

  getUsers: (token: string) =>
    api<{ data: { users: unknown[] } }>('/api/admin/users', { token }),

  deleteUser: (id: string, token: string) =>
    api(`/api/admin/users/${id}`, { method: 'DELETE', token }),

  getUnverifiedRestaurants: (token: string) =>
    api<{ data: { restaurants: unknown[] } }>('/api/admin/restaurants/unverified', { token }),

  verifyRestaurant: (id: string, token: string) =>
    api(`/api/admin/restaurants/${id}/verify`, { method: 'PATCH', token }),

  deleteOffer: (id: string, token: string) =>
    api(`/api/admin/offers/${id}`, { method: 'DELETE', token }),

  broadcast: (subject: string, message: string, token: string) =>
    api('/api/admin/broadcast', { method: 'POST', body: { subject, message }, token }),

  getSettings: (token: string) =>
    api<{ data: { settings: unknown } }>('/api/admin/settings', { token }),

  updateSettings: (settings: unknown, token: string) =>
    api('/api/admin/settings', { method: 'PATCH', body: settings, token }),

  getRateLimits: (token: string) =>
    api<{ data: { logs: unknown[] } }>('/api/admin/rate-limits', { token }),

  unbanIP: (id: string, token: string) =>
    api(`/api/admin/rate-limits/${id}/unban`, { method: 'PATCH', token }),
};