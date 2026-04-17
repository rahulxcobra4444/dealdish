import { useStore } from '@/lib/store';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Opts {
  method?: string;
  body?: unknown;
  token?: string | null;
}

// Refresh the access token using the refreshToken cookie.
// Returns the new accessToken or throws if refresh fails.
async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Session expired. Please login again.');
  const newToken: string = data.data.accessToken;
  // Persist the new token in the Zustand store
  const { user } = useStore.getState();
  if (user) useStore.getState().login(user, newToken);
  return newToken;
}

export async function api<T = unknown>(endpoint: string, opts: Opts = {}): Promise<T> {
  const { method = 'GET', body } = opts;
  let token = opts.token ?? useStore.getState().token;

  const makeRequest = async (t: string | null) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return fetch(`${BASE}${endpoint}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await makeRequest(token);

  // If 401, try refreshing the token once and retry the original request
  if (res.status === 401 && endpoint !== '/api/auth/refresh' && endpoint !== '/api/auth/login') {
    try {
      token = await refreshAccessToken();
      res = await makeRequest(token);
    } catch {
      // Refresh failed — log the user out
      useStore.getState().logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function apiForm<T = unknown>(
  endpoint: string,
  formData: FormData,
  token?: string | null,
  method = 'POST'
): Promise<T> {
  let resolvedToken = token ?? useStore.getState().token;

  const makeRequest = async (t: string | null) => {
    const headers: Record<string, string> = {};
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return fetch(`${BASE}${endpoint}`, {
      method,
      headers,
      credentials: 'include',
      body: formData,
    });
  };

  let res = await makeRequest(resolvedToken);

  // If 401, try refreshing the token once and retry
  if (res.status === 401) {
    try {
      resolvedToken = await refreshAccessToken();
      res = await makeRequest(resolvedToken);
    } catch {
      useStore.getState().logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}
