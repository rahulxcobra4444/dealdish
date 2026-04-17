import { api, apiForm } from '@/lib/api/client';
import type { Pagination } from '@/lib/api/restaurant.api';

// ── Types ──────────────────────────────────────────────────────
export interface Offer {
  _id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat' | 'bogo' | 'freebie';
  discountValue: number;
  image: string;
  validTill: string;
  isActive: boolean;
  isPaused: boolean;
  maxRedemptions?: number;
  redemptionCount: number;
  viewCount: number;
  restaurant: {
    _id: string;
    name: string;
    slug: string;
    coverImage: string;
    address: string;
    cuisine: string[];
    rating: number;
  } | string;
  createdAt: string;
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
  data: { offer: Offer };
}

interface ListResponse {
  success: boolean;
  message: string;
  data: { offers: Offer[] };
}

interface MessageResponse {
  success: boolean;
  message: string;
}

// ── Get all offers ─────────────────────────────────────────────
export async function getOffers(params?: {
  page?: number;
  limit?: number;
  discountType?: string;
  restaurant?: string;
}): Promise<{ offers: Offer[]; pagination: Pagination }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.discountType) query.set('discountType', params.discountType);
  if (params?.restaurant) query.set('restaurant', params.restaurant);

  const qs = query.toString();
  const res = await api<PaginatedResponse<Offer>>(`/api/offers${qs ? `?${qs}` : ''}`);
  return { offers: res.data.data, pagination: res.data.pagination };
}

// ── Get single offer ───────────────────────────────────────────
export async function getOffer(id: string): Promise<Offer> {
  const res = await api<SingleResponse>(`/api/offers/${id}`);
  return res.data.offer;
}

// ── Get nearby offers ──────────────────────────────────────────
export async function getNearbyOffers(
  lat: number,
  lng: number,
  distance = 5000
): Promise<Offer[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    distance: String(distance),
  });
  const res = await api<ListResponse>(`/api/offers/nearby?${params}`);
  return res.data.offers;
}

// ── Create offer (with optional image) ────────────────────────
export async function createOffer(
  payload: Partial<Offer>,
  imageFile?: File
): Promise<Offer> {
  if (imageFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    formData.append('image', imageFile);
    const res = await apiForm<SingleResponse>('/api/offers', formData);
    return res.data.offer;
  }

  const res = await api<SingleResponse>('/api/offers', {
    method: 'POST',
    body: payload,
  });
  return res.data.offer;
}

// ── Update offer (with optional image) ────────────────────────
export async function updateOffer(
  id: string,
  payload: Partial<Offer>,
  imageFile?: File
): Promise<Offer> {
  if (imageFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    formData.append('image', imageFile);
    const res = await apiForm<SingleResponse>(`/api/offers/${id}`, formData, undefined, 'PUT');
    return res.data.offer;
  }

  const res = await api<SingleResponse>(`/api/offers/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return res.data.offer;
}

// ── Delete offer ───────────────────────────────────────────────
export async function deleteOffer(id: string): Promise<void> {
  await api(`/api/offers/${id}`, { method: 'DELETE' });
}

// ── Toggle offer (pause / resume) ─────────────────────────────
export async function toggleOffer(id: string): Promise<Offer> {
  const res = await api<SingleResponse>(`/api/offers/${id}/toggle`, {
    method: 'PATCH',
  });
  return res.data.offer;
}

// ── Redeem offer ───────────────────────────────────────────────
export async function redeemOffer(id: string): Promise<Offer> {
  const res = await api<SingleResponse>(`/api/offers/${id}/redeem`, {
    method: 'POST',
  });
  return res.data.offer;
}

// ── Bulk manage offers ─────────────────────────────────────────
export async function bulkManageOffers(
  ids: string[],
  action: 'pause' | 'resume' | 'delete'
): Promise<void> {
  await api<MessageResponse>('/api/offers/bulk', {
    method: 'POST',
    body: { ids, action },
  });
}