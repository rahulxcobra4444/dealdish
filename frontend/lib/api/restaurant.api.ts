import { api, apiForm } from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────
export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  priceRange: 'budget' | 'mid' | 'premium';
  coverImage: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  phone: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  owner: { _id: string; name: string; email: string } | string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
}

// Helper to format address object to string
export function formatAddress(address: Restaurant['address']): string {
  if (!address) return '';
  return [address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ');
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    pagination: Pagination;
  };
}

interface SingleResponse {
  success: boolean;
  message: string;
  data: { restaurant: Restaurant };
}

interface ListResponse {
  success: boolean;
  message: string;
  data: { restaurants: Restaurant[] };
}

// ── Get all restaurants ────────────────────────────────────────
export async function getRestaurants(params?: {
  page?: number;
  limit?: number;
  cuisine?: string;
  priceRange?: string;
  verified?: boolean;
}): Promise<{ restaurants: Restaurant[]; pagination: Pagination }> {
  const res = await api<PaginatedResponse<Restaurant>>('/api/restaurants', {
    method: 'GET',
  });
  return { restaurants: res.data.data, pagination: res.data.pagination };
}

// ── Get single restaurant by slug ──────────────────────────────
export async function getRestaurant(slug: string): Promise<Restaurant> {
  const res = await api<SingleResponse>(`/api/restaurants/${slug}`);
  return res.data.restaurant;
}

// ── Search restaurants ─────────────────────────────────────────
export async function searchRestaurants(
  q: string,
  page = 1,
  limit = 10
): Promise<{ restaurants: Restaurant[]; pagination: Pagination }> {
  const params = new URLSearchParams({ q, page: String(page), limit: String(limit) });
  const res = await api<PaginatedResponse<Restaurant>>(
    `/api/restaurants/search?${params}`
  );
  return { restaurants: res.data.data, pagination: res.data.pagination };
}

// ── Get nearby restaurants ─────────────────────────────────────
export async function getNearbyRestaurants(
  lat: number,
  lng: number,
  distance = 5000
): Promise<Restaurant[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    distance: String(distance),
  });
  const res = await api<ListResponse>(`/api/restaurants/nearby?${params}`);
  return res.data.restaurants;
}

// ── Get my restaurant (owner) ──────────────────────────────────
export async function getMyRestaurant(): Promise<Restaurant> {
  const res = await api<SingleResponse>('/api/restaurants/my-restaurant');
  return res.data.restaurant;
}

// ── Create restaurant (with image) ────────────────────────────
export async function createRestaurant(
  payload: Partial<Restaurant>,
  imageFile?: File
): Promise<Restaurant> {
  if (imageFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    formData.append('image', imageFile);
    const res = await apiForm<SingleResponse>('/api/restaurants', formData);
    return res.data.restaurant;
  }

  const res = await api<SingleResponse>('/api/restaurants', {
    method: 'POST',
    body: payload,
  });
  return res.data.restaurant;
}

// ── Update restaurant (with optional image) ────────────────────
export async function updateRestaurant(
  id: string,
  payload: Partial<Restaurant>,
  imageFile?: File
): Promise<Restaurant> {
  if (imageFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    formData.append('image', imageFile);
    const res = await apiForm<SingleResponse>(`/api/restaurants/${id}`, formData, undefined, 'PUT');
    return res.data.restaurant;
  }

  const res = await api<SingleResponse>(`/api/restaurants/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return res.data.restaurant;
}

// ── Delete restaurant ──────────────────────────────────────────
export async function deleteRestaurant(id: string): Promise<void> {
  await api(`/api/restaurants/${id}`, { method: 'DELETE' });
}