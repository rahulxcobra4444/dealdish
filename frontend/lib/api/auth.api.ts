import { api } from '@/lib/api/client';
import { useStore } from '@/lib/store';
import type { User } from '@/lib/store';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

interface MessageResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken?: string;
  };
}

// Sets a client-side cookie that Next.js middleware can read.
// The actual security token is the httpOnly cookie set by the backend.
// This is just a signal for route protection on the frontend.
function setSessionFlag(expiryDays = 7) {
  const maxAge = expiryDays * 24 * 60 * 60;
  document.cookie = `isLoggedIn=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearSessionFlag() {
  document.cookie = 'isLoggedIn=; path=/; max-age=0; SameSite=Lax';
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'owner';
  referralCode?: string;
}): Promise<User> {
  const res = await api<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  });
  const { user, accessToken } = res.data;
  useStore.getState().login(user, accessToken);
  setSessionFlag();
  return user;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await api<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
  const { user, accessToken } = res.data;
  useStore.getState().login(user, accessToken);
  setSessionFlag();
  return user;
}

export async function logout(): Promise<void> {
  await api<MessageResponse>('/api/auth/logout', { method: 'POST' });
  useStore.getState().logout();
  clearSessionFlag();
}

export async function getMe(): Promise<User> {
  const res = await api<MeResponse>('/api/auth/me');
  return res.data.user;
}

export async function forgotPassword(email: string): Promise<void> {
  await api<MessageResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  await api<MessageResponse>(`/api/auth/reset-password/${token}`, {
    method: 'PUT',
    body: { password },
  });
}
