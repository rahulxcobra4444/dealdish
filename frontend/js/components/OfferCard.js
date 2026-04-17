// ─── Offer Card Component ───
import { getRestaurantById } from '../mockData.js';

const DISCOUNT_ICONS = {
  percentage: '🏷️',
  flat: '💰',
  bogo: '🎁',
  freebie: '🎉',
};

const DISCOUNT_LABELS = {
  percentage: 'Percentage Off',
  flat: 'Flat Discount',
  bogo: 'Buy 1 Get 1',
  freebie: 'Freebie',
};

const DISCOUNT_COLORS = {
  percentage: 'offer-card--orange',
  flat: 'offer-card--green',
  bogo: 'offer-card--rose',
  freebie: 'offer-card--yellow',
};

export function renderOfferCard(offer) {
  const restaurant = offer.restaurantData || getRestaurantById(offer.restaurant);
  const icon = DISCOUNT_ICONS[offer.discountType] || '🏷️';
  const colorClass = DISCOUNT_COLORS[offer.discountType] || '';

  let discountDisplay = '';
  switch (offer.discountType) {
    case 'percentage': discountDisplay = `${offer.discountValue}%<span class="offer-card__badge-unit">OFF</span>`; break;
    case 'flat': discountDisplay = `₹${offer.discountValue}<span class="offer-card__badge-unit">OFF</span>`; break;
    case 'bogo': discountDisplay = `BUY 1<span class="offer-card__badge-unit">GET 1</span>`; break;
    case 'freebie': discountDisplay = `FREE<span class="offer-card__badge-unit">ITEM</span>`; break;
  }

  const validTo = new Date(offer.validTo);
  const daysLeft = Math.ceil((validTo - new Date()) / (1000 * 60 * 60 * 24));
  const urgency = daysLeft <= 7;

  return `
    <div class="offer-card ${colorClass}" data-offer-id="${offer.id}" id="offer-card-${offer.id}">
      <div class="offer-card__top-bar"></div>
      <div class="offer-card__header">
        <div class="offer-card__icon-wrap">
          <span class="offer-card__icon-emoji">${icon}</span>
        </div>
        <div class="offer-card__info">
          <div class="offer-card__restaurant">${restaurant ? restaurant.name : 'Restaurant'}</div>
          <h3 class="offer-card__title">${offer.title}</h3>
        </div>
        <div class="offer-card__badge">${discountDisplay}</div>
      </div>
      <div class="offer-card__body">
        <p class="offer-card__description">${offer.description}</p>
        <div class="offer-card__details">
          <span class="offer-card__tag">${DISCOUNT_LABELS[offer.discountType]}</span>
          ${offer.minOrderValue > 0 ? `<span class="offer-card__tag">Min ₹${offer.minOrderValue}</span>` : ''}
          ${offer.code ? `<span class="offer-card__code">${offer.code}</span>` : ''}
          ${urgency ? `<span class="offer-card__tag offer-card__tag--urgent">⏰ Ends in ${daysLeft}d</span>` : ''}
        </div>
      </div>
      <div class="offer-card__footer">
        <div class="offer-card__stats">
          <span class="offer-card__stat">👁 ${(offer.views / 1000).toFixed(1)}k views</span>
          <span class="offer-card__stat">🔥 ${offer.claims} claimed</span>
        </div>
        <button class="offer-card__claim-btn" id="claim-btn-${offer.id}" data-claim="${offer.id}">
          Claim Deal
        </button>
      </div>
    </div>
  `;
}

