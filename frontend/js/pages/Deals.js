// ─── Deals Page ───
import { renderHeader, initHeaderEvents } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderOfferCard } from '../components/OfferCard.js';
import { showToast } from '../components/Toast.js';
import { filterOffers } from '../mockData.js';
import Router from '../router.js';

export function renderDealsPage() {
  const app = document.getElementById('app');
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'popular';

  const allOffers = filterOffers({ category: category || undefined, sort });

  const categories = [
    { key: '', label: 'All Deals', icon: '🔥' },
    { key: 'food', label: 'Food', icon: '🍔' },
    { key: 'drinks', label: 'Drinks', icon: '🍹' },
    { key: 'combo', label: 'Combos', icon: '🎯' },
    { key: 'special', label: 'Specials', icon: '⭐' },
  ];

  const sortOptions = [
    { key: 'popular', label: 'Most Popular' },
    { key: 'discount', label: 'Highest Discount' },
    { key: 'newest', label: 'Newest First' },
  ];

  app.innerHTML = `
    ${renderHeader()}

    <main style="padding-top: calc(var(--header-height) + 32px); min-height: 80vh;">
      <div class="container">
        <div class="section__header" style="margin-bottom:24px;">
          <div>
            <div class="section__tag">Deals & Offers</div>
            <h1 class="section__title" id="deals-page-title">
              ${category ? categories.find(c => c.key === category)?.icon + ' ' + categories.find(c => c.key === category)?.label + ' Deals' : '🔥 All Deals'}
            </h1>
            <p class="section__subtitle">${allOffers.length} active offers across top restaurants</p>
          </div>
        </div>

        <!-- Filters Row -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:32px;" id="deals-filters">
          <div class="cuisine-chips" style="margin-bottom:0;padding-bottom:0;">
            ${categories.map(c => `
              <button class="cuisine-chip ${category === c.key ? 'cuisine-chip--active' : ''}" 
                      data-deal-category="${c.key}" 
                      id="deal-cat-${c.key || 'all'}">${c.icon} ${c.label}</button>
            `).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:0.8125rem;color:var(--text-muted);">Sort:</span>
            <select class="form-select" style="width:auto;padding:8px 32px 8px 12px;font-size:0.8125rem;border-radius:var(--radius-full);" id="deals-sort">
              ${sortOptions.map(s => `<option value="${s.key}" ${sort === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Deals Grid -->
        ${allOffers.length > 0
          ? `<div class="offers-grid animate-fadeInUp" id="deals-grid">
              ${allOffers.map(o => renderOfferCard(o)).join('')}
            </div>`
          : `<div class="empty-state" id="no-deals">
              <div class="empty-state__icon">🏷️</div>
              <h2 class="empty-state__title">No Deals Found</h2>
              <p class="empty-state__text">Try a different category or check back later.</p>
              <button class="btn btn--primary" id="clear-deal-filters">Show All Deals</button>
            </div>`
        }
      </div>
    </main>

    ${renderFooter()}
  `;

  initHeaderEvents();
  initDealsPageEvents();
}

function initDealsPageEvents() {
  // Category filter
  document.querySelectorAll('[data-deal-category]').forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.dealCategory;
      const params = new URLSearchParams(window.location.search);
      if (cat) params.set('category', cat);
      else params.delete('category');
      const newUrl = `/deals${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState(null, '', newUrl);
      renderDealsPage();
    });
  });

  // Sort
  const sortSelect = document.getElementById('deals-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const params = new URLSearchParams(window.location.search);
      params.set('sort', sortSelect.value);
      const newUrl = `/deals?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
      renderDealsPage();
    });
  }

  // Clear filters
  const clearBtn = document.getElementById('clear-deal-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Router.navigate('/deals');
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
