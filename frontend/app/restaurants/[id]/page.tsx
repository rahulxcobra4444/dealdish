'use client';
import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ToastProvider';
import OfferCard from '@/components/OfferCard';
import { getRestaurant, formatAddress } from '@/lib/api/restaurant.api';
import { getOffers } from '@/lib/api/offer.api';
import { getReviews, createReview, updateReview, deleteReview, getMyReview } from '@/lib/api/review.api';
import { toggleBookmark } from '@/lib/api/user.api';
import type { Restaurant } from '@/lib/api/restaurant.api';
import type { Offer } from '@/lib/api/offer.api';
import type { Review } from '@/lib/api/review.api';
import { useHydrated } from '@/lib/useHydrated';

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const { isBookmarked, isLoggedIn, user } = useStore();
  const { showToast } = useToast();
  const hydrated = useHydrated();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const r = await getRestaurant(slug);
        setRestaurant(r);
        setBookmarked(isBookmarked(r._id));

        const [offersData, reviewsData] = await Promise.all([
          getOffers({ restaurant: r._id }),
          getReviews(r._id),
        ]);
        setOffers(offersData.offers);
        setReviews(reviewsData.reviews);

        if (isLoggedIn()) {
          const mine = await getMyReview(r._id);
          setMyReview(mine);
        }
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : 'Failed to load restaurant', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleBookmark = async () => {
    if (!restaurant) return;
    if (!isLoggedIn()) { showToast('Please login to bookmark', 'error'); return; }
    try {
      const added = await toggleBookmark(restaurant._id);
      setBookmarked(added);
      showToast(added ? 'Bookmarked!' : 'Bookmark removed', added ? 'success' : 'info');
    } catch {
      showToast('Failed to update bookmark', 'error');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant || !reviewComment.trim()) return;
    if (!isLoggedIn()) { showToast('Please login to leave a review', 'error'); return; }
    setSubmitting(true);
    try {
      const review = await createReview(restaurant._id, { rating: reviewRating, comment: reviewComment });
      setReviews(prev => [review, ...prev]);
      setMyReview(review);
      showToast('Review submitted!', 'success');
      setReviewComment('');
      setReviewRating(5);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (rv: Review) => {
    setEditingId(rv._id);
    setEditRating(rv.rating);
    setEditComment(rv.comment);
  };

  const handleEditSubmit = async (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const updated = await updateReview(reviewId, { rating: editRating, comment: editComment });
      setReviews(prev => prev.map(r => r._id === reviewId ? updated : r));
      setMyReview(updated);
      setEditingId(null);
      showToast('Review updated!', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update review', 'error');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Delete your review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      setMyReview(null);
      showToast('Review deleted', 'info');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete review', 'error');
    }
  };

  if (loading) {
    return (
      <main style={{ paddingTop: 'calc(var(--header-height) + 80px)' }}>
        <div className="empty-state">
          <div className="empty-state__icon">⏳</div>
          <h2 className="empty-state__title">Loading...</h2>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main style={{ paddingTop: 'calc(var(--header-height) + 80px)' }}>
        <div className="empty-state">
          <div className="empty-state__icon">🍽️</div>
          <h2 className="empty-state__title">Restaurant Not Found</h2>
          <Link href="/restaurants" className="btn btn--primary">Browse Restaurants</Link>
        </div>
      </main>
    );
  }

  const img = restaurant.coverImage || '/assets/hero.jpg';
  const addressStr = formatAddress(restaurant.address);

  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '80vh' }}>
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
        <Image src={img} alt={restaurant.name} fill style={{ objectFit: 'cover', filter: 'brightness(0.4)' }} unoptimized />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 30%,var(--bg-base) 100%)' }} />
        <div className="container" style={{ position: 'absolute', bottom: '40px', left: 0, right: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                {restaurant.name}
                {restaurant.isVerified && (
                  <span className="badge badge--verified" style={{ marginLeft: '12px' }}>✓ Verified</span>
                )}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
                {restaurant.cuisine.join(', ')} · {restaurant.address?.city || addressStr}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: 'rgba(255,255,255,0.9)' }}>
                <span>⭐ {restaurant.rating.toFixed(1)}</span>
                <span>💬 {restaurant.reviewCount} reviews</span>
                <span>{restaurant.priceRange}</span>
              </div>
            </div>
            <button className={`btn ${hydrated && bookmarked ? 'btn--primary' : 'btn--ghost'}`} onClick={handleBookmark}>
              {hydrated && bookmarked ? '🔖 Saved' : '🔖 Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        {/* About */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '680px' }}>
            {restaurant.description}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            {addressStr && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>📍 {addressStr}</span>}
            {restaurant.phone && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>📞 {restaurant.phone}</span>}
          </div>
        </section>

        {/* Active Deals */}
        {offers.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>🏷️ Active Deals</h2>
            <div className="offers-grid">
              {offers.map(o => <OfferCard key={o._id} offer={o} />)}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>⭐ Reviews</h2>

          {hydrated && isLoggedIn() && !myReview && (
            <form onSubmit={handleReviewSubmit} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Leave a Review</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewRating(n)}
                    style={{ fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= reviewRating ? 1 : 0.3 }}>
                    ⭐
                  </button>
                ))}
              </div>
              <textarea className="form-input" rows={3} placeholder="Share your experience..."
                value={reviewComment} onChange={e => setReviewComment(e.target.value)} required style={{ resize: 'vertical' }} />
              <button type="submit" className="btn btn--primary btn--sm" style={{ marginTop: '12px' }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {myReview && (
            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', marginBottom: '24px', borderLeft: '3px solid var(--primary-400)' }}>
              <p style={{ fontSize: '13px', color: 'var(--primary-400)', marginBottom: '8px' }}>Your review</p>
              <div>{'⭐'.repeat(myReview.rating)}</div>
              <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>{myReview.comment}</p>
            </div>
          )}

          {hydrated && !isLoggedIn() && (
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              <Link href="/login" style={{ color: 'var(--primary-400)' }}>Login</Link> to leave a review.
            </p>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map(rv => {
                const isOwn = user?.id === rv.user._id;
                const isEditing = editingId === rv._id;

                return (
                  <div key={rv._id} className="review-card">
                    <div className="review-card__header">
                      <div className="review-card__avatar">{rv.user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="review-card__name">{rv.user.name}</div>
                        <div className="review-card__stars">{'⭐'.repeat(rv.rating)}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                          {new Date(rv.createdAt).toLocaleDateString()}
                        </span>
                        {isOwn && !isEditing && (
                          <>
                            <button onClick={() => startEdit(rv)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-400)', fontSize: '13px' }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => handleDeleteReview(rv._id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e', fontSize: '13px' }}>
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <form onSubmit={e => handleEditSubmit(e, rv._id)} style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} type="button" onClick={() => setEditRating(n)}
                              style={{ fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= editRating ? 1 : 0.3 }}>
                              ⭐
                            </button>
                          ))}
                        </div>
                        <textarea className="form-input" rows={3} value={editComment}
                          onChange={e => setEditComment(e.target.value)} required style={{ resize: 'vertical' }} />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button type="submit" className="btn btn--primary btn--sm" disabled={editSubmitting}>
                            {editSubmitting ? 'Saving...' : 'Save'}
                          </button>
                          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="review-card__comment">{rv.comment}</p>
                    )}

                    {rv.ownerReply && !isEditing && (
                      <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-base)', borderRadius: '8px', borderLeft: '3px solid var(--primary-400)' }}>
                        <p style={{ fontSize: '12px', color: 'var(--primary-400)', marginBottom: '4px' }}>Owner reply</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{rv.ownerReply}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
