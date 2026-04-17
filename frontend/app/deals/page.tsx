'use client';
import { useState, useEffect, useCallback } from 'react';
import OfferCard from '@/components/OfferCard';
import { getOffers } from '@/lib/api/offer.api';
import type { Offer } from '@/lib/api/offer.api';

const FILTERS = [
  { key: '', label: 'All Deals', icon: '🔥' },
  { key: 'percentage', label: 'Percentage Off', icon: '🏷️' },
  { key: 'flat', label: 'Flat Discount', icon: '💰' },
  { key: 'bogo', label: 'Buy 1 Get 1', icon: '🎁' },
  { key: 'freebie', label: 'Freebies', icon: '🎉' },
];

export default function DealsPage() {
  const [discountType, setDiscountType] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { offers: data } = await getOffers({
        discountType: discountType || undefined,
        limit: 50,
      });
      setOffers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, [discountType]);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const activeFilter = FILTERS.find(f => f.key === discountType);

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 32px)', minHeight: '80vh' }}>
      <div className="container">
        <div className="section__header" style={{ marginBottom: '24px' }}>
          <div>
            <div className="section__tag">Deals &amp; Offers</div>
            <h1 className="section__title">
              {activeFilter ? `${activeFilter.icon} ${activeFilter.label}` : '🔥 All Deals'}
            </h1>
            <p className="section__subtitle">
              {loading ? 'Loading...' : `${offers.length} active offers`}
            </p>
          </div>
        </div>

        <div className="cuisine-chips" style={{ marginBottom: '32px' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`cuisine-chip${discountType === f.key ? ' cuisine-chip--active' : ''}`}
              onClick={() => setDiscountType(f.key)}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-state__icon">⏳</div>
            <h2 className="empty-state__title">Loading Deals...</h2>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <h2 className="empty-state__title">Something went wrong</h2>
            <p className="empty-state__text">{error}</p>
            <button className="btn btn--primary" onClick={fetchOffers}>Try Again</button>
          </div>
        ) : offers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🏷️</div>
            <h2 className="empty-state__title">No Deals Found</h2>
            <p className="empty-state__text">Check back soon for new offers.</p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map(o => <OfferCard key={o._id} offer={o} />)}
          </div>
        )}
      </div>
    </main>
  );
}