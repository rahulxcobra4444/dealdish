import { api } from '@/lib/api/client';
import { useStore } from '@/lib/store';
import type { Restaurant } from '@/lib/api/restaurant.api';
import type { Offer } from '@/lib/api/offer.api';
import type { User } from '@/lib/store';

// ── Types ──────────────────────────────────────────────────────
export interface Bookmark {
  _id: string;
  user: string;
  restaurant: Pick<Restaurant, '_id' | 'name' | 'slug' | 'coverImage' | 'address' | 'cuisine' | 'rating'>;
  createdAt: string;
}

export interface DashboardStats {
  restaurant: {
    name: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
  } | null;
  totalOffers: number;
  activeOffers: number;
  totalRedemptions: number;
  totalViews: number;
  offers: Offer[];
}

interface BookmarksResponse {
  success: boolean;
  message: string;
  data: { bookmarks: Bookmark[] };
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: { stats: DashboardStats | null };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: { user: User };
}

interface ToggleResponse {
  success: boolean;
  message: string;
}

// ── Get bookmarks ──────────────────────────────────────────────
export async function getBookmarks(): Promise<Bookmark[]> {
  const res = await api<BookmarksResponse>('/api/users/bookmarks');
  return res.data.bookmarks;
}

// ── Toggle bookmark (add / remove) ────────────────────────────
export async function toggleBookmark(restaurantId: string): Promise<boolean> {
  const res = await api<ToggleResponse>(
    `/api/users/bookmarks/${restaurantId}`,
    { method: 'POST' }
  );
  // sync with Zustand store
  useStore.getState().toggleBookmark(restaurantId);
  return res.message === 'Bookmark added';
}

// ── Get dashboard stats (owner) ────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats | null> {
  const res = await api<DashboardResponse>('/api/users/dashboard');
  return res.data.stats;
}

// ── Update profile ─────────────────────────────────────────────
export async function updateProfile(payload: {
  name?: string;
  avatar?: string;
}): Promise<User> {
  const res = await api<ProfileResponse>('/api/users/profile', {
    method: 'PUT',
    body: payload,
  });
  // sync updated user back to store
  useStore.getState().setUser(res.data.user);
  return res.data.user;
}