'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { redeemOffer } from '@/lib/api/offer.api';
import { useStore } from '@/lib/store';
import type { Offer } from '@/lib/api/offer.api';

const DISCOUNT_ICONS: Record<string, string> = {
  percentage: '🏷️', flat: '💰', bogo: '🎁', freebie: '🎉',
};
const DISCOUNT_LABELS: Record<string, string> = {
  percentage: 'Percentage Off', flat: 'Flat Discount', bogo: 'Buy 1 Get 1', freebie: 'Freebie',
};
const DISCOUNT_COLORS: Record<string, string> = {
  percentage: 'offer-card--orange', flat: 'offer-card--green',
  bogo: 'offer-card--rose', freebie: 'offer-card--yellow',
};

function DiscountBadge({ offer }: { offer: Offer }) {
  switch (offer.discountType) {
    case 'percentage': return <>{offer.discountValue}%<span className="offer-card__badge-unit">OFF</span></>;
    case 'flat': return <>₹{offer.discountValue}<span className="offer-card__badge-unit">OFF</span></>;
    case 'bogo': return <>BUY 1<span className="offer-card__badge-unit">GET 1</span></>;
    case 'freebie': return <>FREE<span className="offer-card__badge-unit">ITEM</span></>;
    default: return null;
  }
}

function formatCountdown(days: number): string {
  if (days <= 0) return 'Ends today';
  if (days === 1) return 'Ends tomorrow';
  if (days <= 7) return `Ends in ${days}d`;
  if (days <= 30) return `${days} days left`;
  return `Valid till ${days}d+`;
}

export default function OfferCard({ offer }: { offer: Offer }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useStore();
  const icon = DISCOUNT_ICONS[offer.discountType] || '🏷️';
  const colorClass = DISCOUNT_COLORS[offer.discountType] || '';
  const restaurant = typeof offer.restaurant === 'object' ? offer.restaurant : null;

  const daysLeft = useMemo(
    () => Math.ceil((new Date(offer.validTill).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    [offer.validTill]
  );
  const urgency = daysLeft <= 3;
  const moderate = daysLeft > 3 && daysLeft <= 7;

  const redemptionPct = offer.maxRedemptions
    ? Math.min(100, Math.round((offer.redemptionCount / offer.maxRedemptions) * 100))
    : null;
  const soldOut = offer.maxRedemptions ? offer.redemptionCount >= offer.maxRedemptions : false;

  const [redeeming, setRedeeming] = useState(false);

  const go = () => router.push(`/deals/${offer._id}`);

  const handleClaim = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      showToast('Please login to claim deals', 'error');
      router.push('/login');
      return;
    }
    if (soldOut) {
      showToast('This deal is fully claimed', 'error');
      return;
    }
    setRedeeming(true);
    try {
      await redeemOffer(offer._id);
      showToast('Deal claimed successfully!', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to claim deal', 'error');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <article
      className={`offer-card ${colorClass}`}
      role="link"
      tabIndex={0}
      aria-label={`${offer.title} at ${restaurant?.name || 'restaurant'}, ${DISCOUNT_LABELS[offer.discountType]}`}
      onClick={go}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      }}
    >
      <div className="offer-card__top-bar" aria-hidden="true" />
      <div className="offer-card__header">
        <div className="offer-card__icon-wrap" aria-hidden="true">
          <span className="offer-card__icon-emoji">{icon}</span>
        </div>
        <div className="offer-card__info">
          <div className="offer-card__restaurant">{restaurant?.name || 'Restaurant'}</div>
          <h3 className="offer-card__title">{offer.title}</h3>
        </div>
        <div className="offer-card__badge" aria-hidden="true">
          <DiscountBadge offer={offer} />
        </div>
      </div>

      <div className="offer-card__body">
        <p className="offer-card__description">{offer.description}</p>
        <div className="offer-card__details">
          <span className="offer-card__tag">{DISCOUNT_LABELS[offer.discountType]}</span>
          {urgency && (
            <span className="offer-card__tag offer-card__tag--urgent">
              <span aria-hidden="true">⏰</span> {formatCountdown(daysLeft)}
            </span>
          )}
          {moderate && (
            <span className="offer-card__tag">
              <span aria-hidden="true">🗓️</span> {formatCountdown(daysLeft)}
            </span>
          )}
          {soldOut && (
            <span className="offer-card__tag offer-card__tag--urgent">Sold out</span>
          )}
        </div>

        {redemptionPct !== null && !soldOut && (
          <div className="offer-card__progress" aria-label={`${redemptionPct}% claimed`}>
            <div className="offer-card__progress-bar">
              <div
                className="offer-card__progress-fill"
                style={{ width: `${redemptionPct}%` }}
              />
            </div>
            <span className="offer-card__progress-label">
              {offer.redemptionCount}/{offer.maxRedemptions} claimed
            </span>
          </div>
        )}
      </div>

      <div className="offer-card__footer">
        <div className="offer-card__stats">
          <span className="offer-card__stat" title="Views">
            <span aria-hidden="true">👁</span> {offer.viewCount}
          </span>
          <span className="offer-card__stat" title="Claims">
            <span aria-hidden="true">🔥</span> {offer.redemptionCount}
          </span>
        </div>
        <button
          type="button"
          className="offer-card__claim-btn"
          onClick={handleClaim}
          disabled={redeeming || soldOut}
          aria-busy={redeeming}
        >
          {soldOut ? 'Sold Out' : redeeming ? 'Claiming…' : 'Claim Deal'}
        </button>
      </div>
    </article>
  );
}
