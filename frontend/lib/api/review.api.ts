import { api } from '@/lib/api/client';
import type { Pagination } from '@/lib/api/restaurant.api';

// ── Types ──────────────────────────────────────────────────────
export interface Review {
  _id: string;
  restaurant: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  ownerReply?: string;
  ownerRepliedAt?: string;
  isVisible: boolean;
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
  data: { review: Review };
}

// ── Get all reviews for a restaurant ──────────────────────────
export async function getReviews(
  restaurantId: string,
  page = 1,
  limit = 10
): Promise<{ reviews: Review[]; pagination: Pagination }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await api<PaginatedResponse<Review>>(
    `/api/reviews/${restaurantId}?${params}`
  );
  return { reviews: res.data.data, pagination: res.data.pagination };
}

// ── Get my review for a restaurant ────────────────────────────
export async function getMyReview(restaurantId: string): Promise<Review | null> {
  try {
    const res = await api<SingleResponse>(
      `/api/reviews/${restaurantId}/my-review`
    );
    return res.data.review;
  } catch {
    return null;
  }
}

// ── Create review ──────────────────────────────────────────────
export async function createReview(
  restaurantId: string,
  payload: { rating: number; comment: string }
): Promise<Review> {
  const res = await api<SingleResponse>(`/api/reviews/${restaurantId}`, {
    method: 'POST',
    body: payload,
  });
  return res.data.review;
}

// ── Update review ──────────────────────────────────────────────
export async function updateReview(
  id: string,
  payload: { rating?: number; comment?: string }
): Promise<Review> {
  const res = await api<SingleResponse>(`/api/reviews/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return res.data.review;
}

// ── Delete review ──────────────────────────────────────────────
export async function deleteReview(id: string): Promise<void> {
  await api(`/api/reviews/${id}`, { method: 'DELETE' });
}

// ── Owner reply to review ──────────────────────────────────────
export async function replyToReview(
  id: string,
  reply: string
): Promise<Review> {
  const res = await api<SingleResponse>(`/api/reviews/${id}/reply`, {
    method: 'POST',
    body: { reply },
  });
  return res.data.review;
}
