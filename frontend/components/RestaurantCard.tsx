'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ToastProvider';
import { useHydrated } from '@/lib/useHydrated';
import { toggleBookmark as apiToggleBookmark } from '@/lib/api/user.api';
import { formatAddress } from '@/lib/api/restaurant.api';
import type { Restaurant } from '@/lib/api/restaurant.api';

const PRICE_SYMBOL: Record<Restaurant['priceRange'], string> = {
  budget: '₹',
  mid: '₹₹',
  premium: '₹₹₹',
};

const PRICE_LABEL: Record<Restaurant['priceRange'], string> = {
  budget: 'Budget friendly',
  mid: 'Mid-range',
  premium: 'Premium',
};

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();
  const { isBookmarked, isLoggedIn } = useStore();
  const { showToast } = useToast();
  const hydrated = useHydrated();

  const bookmarked = hydrated && isBookmarked(restaurant._id);
  const img = restaurant.coverImage || '/assets/hero.jpg';
  const rating = Number(restaurant.rating || 0);
  const ratingText = rating > 0 ? rating.toFixed(1) : 'New';
  const priceSymbol = PRICE_SYMBOL[restaurant.priceRange] || '₹₹';
  const priceLabel = PRICE_LABEL[restaurant.priceRange] || 'Mid-range';

  const go = () => router.push(`/restaurants/${restaurant.slug}`);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      showToast('Please login to bookmark', 'error');
      router.push('/login');
      return;
    }
    try {
      const added = await apiToggleBookmark(restaurant._id);
      showToast(added ? 'Restaurant bookmarked!' : 'Bookmark removed', added ? 'success' : 'info');
    } catch {
      showToast('Failed to update bookmark', 'error');
    }
  };

  return (
    <article
      className="restaurant-card"
      role="link"
      tabIndex={0}
      aria-label={`${restaurant.name}, ${priceLabel}, rating ${ratingText}`}
      onClick={go}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      }}
    >
      <div className="restaurant-card__image">
        <Image
          src={img}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        <div className="restaurant-card__image-overlay" aria-hidden="true" />
        <div className="restaurant-card__badge">
          {restaurant.isVerified && (
            <span className="restaurant-card__badge-item badge--verified">✓ Verified</span>
          )}
          <span
            className="restaurant-card__badge-item badge--price"
            title={priceLabel}
          >
            {priceSymbol}
          </span>
        </div>
        <button
          type="button"
          className={`restaurant-card__bookmark${bookmarked ? ' restaurant-card__bookmark--active' : ''}`}
          onClick={handleBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? `Remove ${restaurant.name} from bookmarks` : `Bookmark ${restaurant.name}`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <span aria-hidden="true">{bookmarked ? '♥' : '♡'}</span>
        </button>
      </div>

      <div className="restaurant-card__body">
        <div className="restaurant-card__cuisines">
          {restaurant.cuisine.slice(0, 3).map(c => (
            <span key={c} className="restaurant-card__cuisine">{c}</span>
          ))}
        </div>
        <h3 className="restaurant-card__name">{restaurant.name}</h3>
        <p className="restaurant-card__description">{restaurant.description}</p>

        <div className="restaurant-card__footer">
          <div className="restaurant-card__rating" aria-label={`Rating ${ratingText} from ${restaurant.reviewCount} reviews`}>
            <span className="restaurant-card__rating-star" aria-hidden="true">⭐</span>
            <span className="restaurant-card__rating-value">{ratingText}</span>
            {restaurant.reviewCount > 0 && (
              <span className="restaurant-card__rating-count">({restaurant.reviewCount})</span>
            )}
          </div>
          <div className="restaurant-card__meta">
            <span className="restaurant-card__meta-item" title={formatAddress(restaurant.address)}>
              <span aria-hidden="true">📍</span> {restaurant.address?.city || 'Nearby'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
