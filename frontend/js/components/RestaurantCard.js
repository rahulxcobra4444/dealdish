// ─── Restaurant Card Component ───
import Store from '../store.js';
import { RESTAURANT_IMAGES } from './Header.js';

export function renderRestaurantCard(restaurant) {
  const img = RESTAURANT_IMAGES[restaurant.id] || 'assets/hero.jpg';
  const isBookmarked = Store.isBookmarked(restaurant.id);

  return `
    <article class="restaurant-card" data-restaurant-id="${restaurant.id}" id="restaurant-card-${restaurant.id}">
      <div class="restaurant-card__image">
        <img src="${img}" alt="${restaurant.name}" loading="lazy">
        <div class="restaurant-card__image-overlay"></div>
        <div class="restaurant-card__badge">
          ${restaurant.activeOfferCount > 0 ? `<span class="restaurant-card__badge-item badge--offers">${restaurant.activeOfferCount} ${restaurant.activeOfferCount === 1 ? 'Deal' : 'Deals'}</span>` : ''}
          ${restaurant.isVerified ? '<span class="restaurant-card__badge-item badge--verified">✓ Verified</span>' : ''}
          <span class="restaurant-card__badge-item badge--price">${restaurant.priceRange}</span>
        </div>
        <button class="restaurant-card__bookmark ${isBookmarked ? 'restaurant-card__bookmark--active' : ''}" 
                data-bookmark="${restaurant.id}" 
                id="bookmark-btn-${restaurant.id}"
                title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}">
          ${isBookmarked ? '♥' : '♡'}
        </button>
      </div>
      <div class="restaurant-card__body">
        <div class="restaurant-card__cuisines">
          ${restaurant.cuisine.map(c => `<span class="restaurant-card__cuisine">${c}</span>`).join('')}
        </div>
        <h3 class="restaurant-card__name">${restaurant.name}</h3>
        <p class="restaurant-card__description">${restaurant.description}</p>
        <div class="restaurant-card__footer">
          <div class="restaurant-card__rating">
            <span class="restaurant-card__rating-star">⭐</span>
            <span class="restaurant-card__rating-value">${restaurant.rating}</span>
            <span class="restaurant-card__rating-count">(${restaurant.reviewCount})</span>
          </div>
          <div class="restaurant-card__meta">
            <span class="restaurant-card__meta-item">📍 ${restaurant.address.city}</span>
            <span class="restaurant-card__meta-item">🕐 ${restaurant.openingHours.split(' - ')[0]}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}
