'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ToastProvider';
import { getMyRestaurant, createRestaurant, updateRestaurant, formatAddress } from '@/lib/api/restaurant.api';
import { getOffers, createOffer, deleteOffer, toggleOffer } from '@/lib/api/offer.api';
import { getReviews, replyToReview } from '@/lib/api/review.api';
import type { Restaurant } from '@/lib/api/restaurant.api';
import type { Offer } from '@/lib/api/offer.api';
import type { Review } from '@/lib/api/review.api';

type Tab = 'overview' | 'restaurant' | 'offers' | 'add-offer' | 'reviews';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token } = useStore();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [offerForm, setOfferForm] = useState({
    title: '', description: '', discountType: 'percentage',
    discountValue: '', validTill: '', maxRedemptions: ''
  });
  const [offerLoading, setOfferLoading] = useState(false);

  const [restForm, setRestForm] = useState({
    name: '', description: '', cuisine: '', address: '', phone: '', priceRange: 'mid'
  });
  const [restLoading, setRestLoading] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    if (user?.role !== 'owner') {
      showToast('Access denied. Owner accounts only.', 'error');
      router.push('/');
    }
  }, [token, user, router, showToast]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getMyRestaurant();
      setRestaurant(r);
      setRestForm({
        name: r.name || '',
        description: r.description || '',
        cuisine: (r.cuisine || []).join(', '),
        address: formatAddress(r.address) || '',
        phone: r.phone || '',
        priceRange: r.priceRange || 'mid',
      });
      const [offersData, reviewsData] = await Promise.all([
        getOffers({ restaurant: r._id }),
        getReviews(r._id),
      ]);
      setOffers(offersData.offers);
      setReviews(reviewsData.reviews);
    } catch {
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && user?.role === 'owner') loadData();
  }, [token, user, loadData]);

  if (!token || user?.role !== 'owner') return null;

  const totalViews = offers.reduce((s, o) => s + (o.viewCount || 0), 0);
  const totalRedemptions = offers.reduce((s, o) => s + (o.redemptionCount || 0), 0);

  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestLoading(true);
    try {
      const addressParts = restForm.address.split(',').map(p => p.trim());
      const payload: Partial<Restaurant> = {
        name: restForm.name,
        description: restForm.description,
        cuisine: restForm.cuisine.split(',').map(c => c.trim()).filter(Boolean),
        address: {
          street: addressParts[0] || '',
          city: addressParts[1] || '',
          state: addressParts[2] || '',
          pincode: addressParts[3] || '',
        },
        phone: restForm.phone,
        priceRange: restForm.priceRange as Restaurant['priceRange'],
      };
      if (restaurant) {
        await updateRestaurant(restaurant._id, payload);
        showToast('Restaurant updated!', 'success');
      } else {
        await createRestaurant(payload);
        showToast('Restaurant created!', 'success');
      }
      await loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save restaurant', 'error');
    } finally {
      setRestLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferLoading(true);
    try {
      await createOffer({
        title: offerForm.title,
        description: offerForm.description,
        discountType: offerForm.discountType as Offer['discountType'],
        discountValue: Number(offerForm.discountValue),
        validTill: offerForm.validTill,
        ...(offerForm.maxRedemptions && { maxRedemptions: Number(offerForm.maxRedemptions) }),
      });
      showToast('Offer created!', 'success');
      setOfferForm({ title: '', description: '', discountType: 'percentage', discountValue: '', validTill: '', maxRedemptions: '' });
      await loadData();
      setTab('offers');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to create offer', 'error');
    } finally {
      setOfferLoading(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    try {
      await deleteOffer(id);
      showToast('Offer deleted', 'success');
      setOffers(prev => prev.filter(o => o._id !== id));
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
    }
  };

  const handleToggleOffer = async (id: string) => {
    try {
      const updated = await toggleOffer(id);
      setOffers(prev => prev.map(o => o._id === id ? updated : o));
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to toggle', 'error');
    }
  };

  const handleReply = async (reviewId: string, reply: string) => {
    try {
      const updated = await replyToReview(reviewId, reply);
      setReviews(prev => prev.map(r => r._id === reviewId ? updated : r));
      showToast('Reply sent!', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to reply', 'error');
    }
  };

  const navItems: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'restaurant', label: 'My Restaurant', icon: '🏪' },
    { key: 'offers', label: 'My Offers', icon: '🏷️' },
    { key: 'add-offer', label: 'Add Offer', icon: '➕' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

  return (
    <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', display: 'flex' }}>
      <aside className={`dashboard-sidebar${sidebarOpen ? ' dashboard-sidebar--open' : ''}`}>
        <div className="dashboard-sidebar__header">
          <div className="dashboard-sidebar__user">
            <div className="dashboard-sidebar__avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="dashboard-sidebar__name">{user.name}</div>
              <div className="dashboard-sidebar__role">Restaurant Owner</div>
            </div>
          </div>
        </div>
        <nav className="dashboard-sidebar__nav">
          {navItems.map(item => (
            <button key={item.key}
              className={`dashboard-sidebar__nav-item${tab === item.key ? ' dashboard-sidebar__nav-item--active' : ''}`}
              onClick={() => { setTab(item.key); setSidebarOpen(false); }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="dashboard-sidebar__footer">
          <button className="dashboard-sidebar__nav-item" onClick={() => router.push('/')}>← Back to Site</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <button className="dashboard-topbar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="dashboard-topbar__title">{navItems.find(n => n.key === tab)?.label}</h1>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading your dashboard...</div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div>
                  {!restaurant && (
                    <div className="dashboard-card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--warning)' }}>
                      <p style={{ color: 'var(--text-muted)' }}>⚠️ You don't have a restaurant yet.{' '}
                        <button className="btn btn--ghost btn--sm" onClick={() => setTab('restaurant')}>Set up your restaurant</button>
                      </p>
                    </div>
                  )}
                  <div className="stats-grid">
                    <div className="stat-card"><div className="stat-card__value">{offers.length}</div><div className="stat-card__label">Total Offers</div></div>
                    <div className="stat-card"><div className="stat-card__value">{totalViews}</div><div className="stat-card__label">Total Views</div></div>
                    <div className="stat-card"><div className="stat-card__value">{totalRedemptions}</div><div className="stat-card__label">Total Claims</div></div>
                    <div className="stat-card"><div className="stat-card__value">{reviews.length}</div><div className="stat-card__label">Reviews</div></div>
                  </div>
                  {restaurant && (
                    <div className="dashboard-card" style={{ marginTop: '24px' }}>
                      <h3 style={{ marginBottom: '4px' }}>{restaurant.name}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        {restaurant.isVerified ? '✅ Verified' : '⏳ Pending verification'} · ⭐ {(restaurant.rating || 0).toFixed(1)} · 💬 {restaurant.reviewCount} reviews
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* RESTAURANT */}
              {tab === 'restaurant' && (
                <div className="dashboard-card">
                  <h2 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 600 }}>
                    {restaurant ? 'Update Restaurant' : 'Create Restaurant'}
                  </h2>
                  <form onSubmit={handleSaveRestaurant}>
                    <div className="form-group">
                      <label className="form-label">Restaurant Name</label>
                      <input className="form-input" value={restForm.name} onChange={e => setRestForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" rows={3} value={restForm.description} onChange={e => setRestForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cuisines (comma-separated)</label>
                      <input className="form-input" value={restForm.cuisine} placeholder="Indian, Chinese, Italian" onChange={e => setRestForm(f => ({ ...f, cuisine: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input className="form-input" value={restForm.address} onChange={e => setRestForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, City, State, Pincode" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={restForm.phone} onChange={e => setRestForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price Range</label>
                      <select className="form-input" value={restForm.priceRange} onChange={e => setRestForm(f => ({ ...f, priceRange: e.target.value }))}>
                        <option value="budget">Budget</option>
                        <option value="mid">Mid</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={restLoading}>
                      {restLoading ? 'Saving...' : restaurant ? 'Update Restaurant' : 'Create Restaurant'}
                    </button>
                  </form>
                </div>
              )}

              {/* OFFERS */}
              {tab === 'offers' && (
                <div>
                  {offers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state__icon">🏷️</div>
                      <h2 className="empty-state__title">No Offers Yet</h2>
                      <button className="btn btn--primary" onClick={() => setTab('add-offer')}>Create Your First Offer</button>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Title</th><th>Discount</th><th>Claims</th><th>Valid Till</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                          {offers.map(o => (
                            <tr key={o._id}>
                              <td>{o.title}</td>
                              <td>{o.discountType === 'percentage' ? `${o.discountValue}%` : o.discountType === 'flat' ? `₹${o.discountValue}` : o.discountType.toUpperCase()}</td>
                              <td>{o.redemptionCount}</td>
                              <td>{new Date(o.validTill).toLocaleDateString()}</td>
                              <td><span className={`badge ${o.isPaused ? 'badge--warning' : 'badge--success'}`}>{o.isPaused ? 'Paused' : 'Active'}</span></td>
                              <td style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn--ghost btn--sm" onClick={() => handleToggleOffer(o._id)}>{o.isPaused ? '▶ Resume' : '⏸ Pause'}</button>
                                <button className="btn btn--danger btn--sm" onClick={() => handleDeleteOffer(o._id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ADD OFFER */}
              {tab === 'add-offer' && (
                <div className="dashboard-card">
                  <h2 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 600 }}>Create New Offer</h2>
                  {!restaurant?.isVerified && (
                    <div style={{ background: 'rgba(255,200,0,0.1)', border: '1px solid var(--warning)', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: 'var(--warning)', fontSize: '14px' }}>
                      ⚠️ Your restaurant must be verified before creating offers.
                    </div>
                  )}
                  <form onSubmit={handleCreateOffer}>
                    <div className="form-group">
                      <label className="form-label">Offer Title</label>
                      <input className="form-input" value={offerForm.title} onChange={e => setOfferForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. 50% off on all starters" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" rows={2} value={offerForm.description} onChange={e => setOfferForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Discount Type</label>
                        <select className="form-input" value={offerForm.discountType} onChange={e => setOfferForm(f => ({ ...f, discountType: e.target.value }))}>
                          <option value="percentage">Percentage</option>
                          <option value="flat">Flat Amount</option>
                          <option value="bogo">Buy 1 Get 1</option>
                          <option value="freebie">Freebie</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Discount Value</label>
                        <input type="number" className="form-input" value={offerForm.discountValue} onChange={e => setOfferForm(f => ({ ...f, discountValue: e.target.value }))} required />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Valid Till</label>
                        <input type="date" className="form-input" value={offerForm.validTill} onChange={e => setOfferForm(f => ({ ...f, validTill: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Max Claims (optional)</label>
                        <input type="number" className="form-input" value={offerForm.maxRedemptions} onChange={e => setOfferForm(f => ({ ...f, maxRedemptions: e.target.value }))} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={offerLoading || !restaurant?.isVerified}>
                      {offerLoading ? 'Creating...' : 'Create Offer'}
                    </button>
                  </form>
                </div>
              )}

              {/* REVIEWS */}
              {tab === 'reviews' && (
                <div>
                  {reviews.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state__icon">⭐</div>
                      <h2 className="empty-state__title">No Reviews Yet</h2>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {reviews.map(r => (
                        <ReviewCard key={r._id} review={r} onReply={handleReply} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ReviewCard({ review, onReply }: {
  review: Review;
  onReply: (id: string, reply: string) => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__avatar">{review.user?.name?.charAt(0) || 'U'}</div>
        <div>
          <div className="review-card__name">{review.user?.name}</div>
          <div className="review-card__stars">{'⭐'.repeat(review.rating)}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>
      <p className="review-card__comment">{review.comment}</p>
      {review.ownerReply ? (
        <div className="review-card__reply"><strong>Your reply:</strong> {review.ownerReply}</div>
      ) : (
        <>
          {!showForm && (
            <button
              className="btn btn--ghost btn--sm"
              style={{ marginTop: '8px' }}
              onClick={() => setShowForm(true)}
            >
              Reply
            </button>
          )}
          {showForm && (
            <form
              style={{ marginTop: '10px', display: 'flex', gap: '8px', flexDirection: 'column' }}
              onSubmit={e => {
                e.preventDefault();
                if (!replyText.trim()) return;
                onReply(review._id, replyText);
                setShowForm(false);
                setReplyText('');
              }}
            >
              <textarea
                className="form-input"
                rows={2}
                placeholder="Write your reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{ resize: 'vertical' }}
                required
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn--primary btn--sm">Send Reply</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setShowForm(false); setReplyText(''); }}>Cancel</button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
