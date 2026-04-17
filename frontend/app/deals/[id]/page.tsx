'use client';
import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ToastProvider';
import { getOffer, redeemOffer } from '@/lib/api/offer.api';
import type { Offer } from '@/lib/api/offer.api';

const DISCOUNT_ICONS: Record<string, string> = {
  percentage: '🏷️', flat: '💰', bogo: '🎁', freebie: '🎉',
};
const DISCOUNT_COLORS: Record<string, string> = {
  percentage: '#f97316', flat: '#22c55e', bogo: '#f43f5e', freebie: '#eab308',
};

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useStore();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOffer(id);
        setOffer(data);
        setDaysLeft(Math.ceil((new Date(data.validTill).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : 'Failed to load deal', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleClaim = async () => {
    if (!isLoggedIn()) { showToast('Please login to claim deals', 'error'); router.push('/login'); return; }
    setClaiming(true);
    try {
      await redeemOffer(id);
      showToast('Deal claimed! Show this at the restaurant.', 'success');
      setOffer(prev => prev ? { ...prev, redemptionCount: prev.redemptionCount + 1 } : prev);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to claim deal', 'error');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <main style={{ paddingTop: 'calc(var(--header-height) + 80px)' }}>
        <div className="empty-state">
          <div className="empty-state__icon">⏳</div>
          <h2 className="empty-state__title">Loading Deal...</h2>
        </div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main style={{ paddingTop: 'calc(var(--header-height) + 80px)' }}>
        <div className="empty-state">
          <div className="empty-state__icon">🏷️</div>
          <h2 className="empty-state__title">Deal Not Found</h2>
          <Link href="/deals" className="btn btn--primary">Browse Deals</Link>
        </div>
      </main>
    );
  }

  const restaurant = typeof offer.restaurant === 'object' ? offer.restaurant : null;
  const img = restaurant?.coverImage || '/assets/hero.jpg';
  const accentColor = DISCOUNT_COLORS[offer.discountType] || '#f97316';

  const discountLabel = offer.discountType === 'percentage'
    ? `${offer.discountValue}% OFF`
    : offer.discountType === 'flat'
    ? `₹${offer.discountValue} OFF`
    : offer.discountType === 'bogo'
    ? 'BUY 1 GET 1'
    : 'FREE ITEM';

  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '80vh' }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <Image src={img} alt={restaurant?.name || 'Deal'} fill style={{ objectFit: 'cover', filter: 'brightness(0.35)' }} unoptimized />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 20%,var(--bg-base) 100%)' }} />
        <div className="container" style={{ position: 'absolute', bottom: '36px', left: 0, right: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              background: accentColor, color: '#fff', borderRadius: '12px',
              padding: '12px 20px', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px',
            }}>
              {DISCOUNT_ICONS[offer.discountType]} {discountLabel}
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                {offer.title}
              </h1>
              {restaurant && (
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
                  at <Link href={`/restaurants/${restaurant.slug}`} style={{ color: '#fff', textDecoration: 'underline' }}>{restaurant.name}</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px', maxWidth: '760px' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { label: 'Days Left', value: daysLeft > 0 ? `${daysLeft}d` : 'Expired', urgent: daysLeft <= 7 },
            { label: 'Views', value: offer.viewCount.toLocaleString() },
            { label: 'Claimed', value: offer.redemptionCount.toLocaleString() },
            { label: 'Valid Till', value: new Date(offer.validTill).toLocaleDateString() },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px 24px', flex: '1', minWidth: '120px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.urgent ? '#f43f5e' : 'var(--primary-400)' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>About this Deal</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{offer.description}</p>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
          <button
            className="btn btn--primary"
            onClick={handleClaim}
            disabled={claiming || daysLeft <= 0}
          >
            {claiming ? 'Claiming...' : daysLeft <= 0 ? 'Expired' : '🎉 Claim This Deal'}
          </button>
          {restaurant && (
            <Link href={`/restaurants/${restaurant.slug}`} className="btn btn--secondary">
              View Restaurant →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}