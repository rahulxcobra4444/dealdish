// ─── Restaurant Detail Page ───
import { renderHeader, initHeaderEvents, RESTAURANT_IMAGES } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderOfferCard } from '../components/OfferCard.js';
import { showToast } from '../components/Toast.js';
import { getRestaurantById, getOffersByRestaurant, mockReviews } from '../mockData.js';
import Store from '../store.js';
import Router from '../router.js';

export function renderRestaurantDetailPage({ id }) {
  const app = document.getElementById('app');
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    app.innerHTML = `
      ${renderHeader()}
      <div class="empty-state" style="padding-top:calc(var(--header-height) + 80px)">
        <div class="empty-state__icon">🍽️</div>
        <h2 class="empty-state__title">Restaurant Not Found</h2>
        <p class="empty-state__text">This restaurant may have been removed or doesn't exist.</p>
        <a href="/restaurants" data-link class="btn btn--primary">Browse Restaurants</a>
      </div>
      ${renderFooter()}
    `;
    initHeaderEvents();
    return;
  }

  const offers = getOffersByRestaurant(id);
  const reviews = mockReviews.filter(r => r.restaurant === id);
  const img = RESTAURANT_IMAGES[id] || 'assets/hero.jpg';
  const isBookmarked = Store.isBookmarked(id);

  app.innerHTML = `
    ${renderHeader()}

    <main style="padding-top: var(--header-height); min-height: 80vh;">
      <!-- Hero Banner -->
      <div style="position:relative;height:360px;overflow:hidden;" id="restaurant-hero">
        <img src="${img}" alt="${restaurant.name}" 
             style="width:100%;height:100%;object-fit:cover;filter:brightness(0.4);" id="restaurant-hero-img">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,var(--bg-base) 100%);"></div>
        <div class="container" style="position:absolute;bottom:40px;left:0;right:0;">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;">
            <div>
              <div style="display:flex;gap:8px;margin-bottom:12px;">
                ${restaurant.isVerified ? '<span class="restaurant-card__badge-item badge--verified">✓ Verified</span>' : ''}
                <span class="restaurant-card__badge-item badge--price">${restaurant.priceRange}</span>
                ${restaurant.cuisine.map(c => `<span class="restaurant-card__badge-item" style="background:var(--bg-glass);color:var(--text-primary);border:1px solid var(--border-subtle);backdrop-filter:blur(8px);">${c}</span>`).join('')}
              </div>
              <h1 style="font-family:var(--font-display);font-size:2.5rem;font-weight:800;letter-spacing:-1px;margin-bottom:8px;" id="restaurant-detail-name">${restaurant.name}</h1>
              <div style="display:flex;align-items:center;gap:16px;color:var(--text-secondary);font-size:0.875rem;">
                <span>⭐ ${restaurant.rating} (${restaurant.reviewCount} reviews)</span>
                <span>📍 ${restaurant.address.street}, ${restaurant.address.city}</span>
                <span>🕐 ${restaurant.openingHours}</span>
              </div>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="btn btn--secondary" id="detail-bookmark-btn" data-bookmark-detail="${id}">
                ${isBookmarked ? '♥ Bookmarked' : '♡ Bookmark'}
              </button>
              <button class="btn btn--primary" id="detail-call-btn">📞 Call Now</button>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding-top:40px;padding-bottom:80px;">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:48px;">
          <!-- Left Column -->
          <div>
            <!-- About -->
            <div style="margin-bottom:48px;" id="restaurant-about">
              <h2 style="font-family:var(--font-display);font-weight:700;font-size:1.3rem;margin-bottom:12px;">About</h2>
              <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;">${restaurant.description}</p>
            </div>

            <!-- Active Deals -->
            ${offers.length > 0 ? `
              <div style="margin-bottom:48px;" id="restaurant-deals">
                <h2 style="font-family:var(--font-display);font-weight:700;font-size:1.3rem;margin-bottom:20px;">
                  Active Deals <span style="color:var(--primary-400);font-size:0.9rem;">(${offers.length})</span>
                </h2>
                <div class="offers-grid" id="restaurant-offers-grid">
                  ${offers.map(o => renderOfferCard({ ...o, restaurantData: restaurant })).join('')}
                </div>
              </div>
            ` : `
              <div class="empty-state" style="padding:40px 0;" id="no-deals">
                <div class="empty-state__icon">🏷️</div>
                <h2 class="empty-state__title">No Active Deals</h2>
                <p class="empty-state__text">Check back soon for new offers from this restaurant.</p>
              </div>
            `}

            <!-- Reviews -->
            ${reviews.length > 0 ? `
              <div id="restaurant-reviews">
                <h2 style="font-family:var(--font-display);font-weight:700;font-size:1.3rem;margin-bottom:20px;">
                  Reviews <span style="color:var(--text-muted);font-size:0.9rem;">(${reviews.length})</span>
                </h2>
                ${reviews.map(rv => `
                  <div style="padding:20px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);margin-bottom:12px;" id="review-${rv.id}">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                      <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:var(--gradient-warm);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.8rem;">
                          ${rv.user.charAt(0).toUpperCase()}
                        </div>
                        <span style="font-weight:600;font-size:0.875rem;">User</span>
                      </div>
                      <div style="display:flex;gap:2px;">
                        ${'⭐'.repeat(rv.rating)}
                      </div>
                    </div>
                    <p style="color:var(--text-secondary);font-size:0.875rem;line-height:1.6;">${rv.comment}</p>
                    <p style="color:var(--text-muted);font-size:0.75rem;margin-top:8px;">${rv.createdAt}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Right Sidebar -->
          <div>
            <div style="position:sticky;top:calc(var(--header-height) + 24px);">
              <div style="padding:24px;background:var(--bg-surface);border:1px solid var(--border-default);border-radius:var(--radius-lg);" id="restaurant-info-card">
                <h3 style="font-family:var(--font-display);font-weight:700;margin-bottom:20px;">Restaurant Info</h3>
                
                <div style="margin-bottom:16px;">
                  <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Address</div>
                  <div style="font-size:0.875rem;color:var(--text-secondary);">${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.zipCode}</div>
                </div>

                <div style="margin-bottom:16px;">
                  <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Phone</div>
                  <div style="font-size:0.875rem;color:var(--primary-400);font-weight:500;">${restaurant.phone}</div>
                </div>

                <div style="margin-bottom:16px;">
                  <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Hours</div>
                  <div style="font-size:0.875rem;color:var(--text-secondary);">${restaurant.openingHours}</div>
                </div>

                <div style="margin-bottom:16px;">
                  <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Cuisine</div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${restaurant.cuisine.map(c => `<span style="padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border-subtle);">${c}</span>`).join('')}
                  </div>
                </div>

                <div style="margin-bottom:20px;">
                  <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Price Range</div>
                  <div style="font-size:1rem;color:var(--primary-400);font-weight:700;letter-spacing:1px;">${restaurant.priceRange}</div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:20px;border-top:1px solid var(--border-subtle);">
                  <div style="text-align:center;">
                    <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--primary-400);">${restaurant.rating}</div>
                    <div style="font-size:0.6875rem;color:var(--text-muted);">Rating</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--text-primary);">${restaurant.reviewCount}</div>
                    <div style="font-size:0.6875rem;color:var(--text-muted);">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initHeaderEvents();
  initDetailPageEvents(id);
}

function initDetailPageEvents(id) {
  // Bookmark
  const bookmarkBtn = document.getElementById('detail-bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const added = Store.toggleBookmark(id);
      bookmarkBtn.innerHTML = added ? '♥ Bookmarked' : '♡ Bookmark';
      showToast(added ? 'Restaurant bookmarked!' : 'Bookmark removed', added ? 'success' : 'info');
    });
  }

  // Call button
  const callBtn = document.getElementById('detail-call-btn');
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      showToast('Opening dialer...', 'info');
    });
  }

  // Claim buttons
  document.querySelectorAll('[data-claim]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Deal claimed! Show the code at the restaurant.', 'success');
    });
  });
}
