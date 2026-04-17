// ─── Restaurants Page ───
import { renderHeader, initHeaderEvents } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderRestaurantCard } from '../components/RestaurantCard.js';
import { showToast } from '../components/Toast.js';
import { mockRestaurants, filterRestaurants, CUISINES } from '../mockData.js';
import Store from '../store.js';
import Router from '../router.js';

export function renderRestaurantsPage() {
  const app = document.getElementById('app');
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search') || '';
  const cuisineFilter = params.get('cuisine') || '';

  const filteredRestaurants = filterRestaurants({
    search: searchQuery,
    cuisine: cuisineFilter,
  });

  app.innerHTML = `
    ${renderHeader()}

    <main style="padding-top: calc(var(--header-height) + 32px); min-height: 80vh;">
      <div class="container">
        <div class="section__header" style="margin-bottom:24px;">
          <div>
            <div class="section__tag">Explore</div>
            <h1 class="section__title" id="restaurants-page-title">
              ${cuisineFilter ? `${cuisineFilter} Restaurants` : searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
            </h1>
            <p class="section__subtitle">${filteredRestaurants.length} restaurants found</p>
          </div>
        </div>

        <!-- Filters -->
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px;" id="restaurant-filters">
          <div class="search-bar" style="max-width:360px;flex:1;">
            <span class="search-bar__icon">🔍</span>
            <input type="text" class="search-bar__input" placeholder="Search restaurants..." 
                   id="restaurant-search-input" value="${searchQuery}" autocomplete="off">
          </div>

          <div class="cuisine-chips" style="margin-bottom:0;padding-bottom:0;">
            <button class="cuisine-chip ${!cuisineFilter ? 'cuisine-chip--active' : ''}" data-cuisine="" id="filter-all">All</button>
            ${CUISINES.map(c => `
              <button class="cuisine-chip ${cuisineFilter === c ? 'cuisine-chip--active' : ''}" 
                      data-cuisine="${c}" 
                      id="filter-${c.toLowerCase()}">${c}</button>
            `).join('')}
          </div>
        </div>

        <!-- Results -->
        ${filteredRestaurants.length > 0
          ? `<div class="restaurant-grid animate-fadeInUp" id="restaurants-grid">
              ${filteredRestaurants.map(r => renderRestaurantCard(r)).join('')}
            </div>`
          : `<div class="empty-state" id="no-restaurants">
              <div class="empty-state__icon">🔍</div>
              <h2 class="empty-state__title">No Restaurants Found</h2>
              <p class="empty-state__text">Try a different search or browse all cuisines.</p>
              <button class="btn btn--primary" id="clear-filters-btn">Clear Filters</button>
            </div>`
        }
      </div>
    </main>

    ${renderFooter()}
  `;

  initHeaderEvents();
  initRestaurantsPageEvents();
}

function initRestaurantsPageEvents() {
  // Search
  const searchInput = document.getElementById('restaurant-search-input');
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = searchInput.value.trim();
        const params = new URLSearchParams(window.location.search);
        if (q) params.set('search', q);
        else params.delete('search');
        const newUrl = `/restaurants${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState(null, '', newUrl);
        renderRestaurantsPage();
      }, 400);
    });
  }

  // Cuisine filter chips
  document.querySelectorAll('[data-cuisine]').forEach(chip => {
    chip.addEventListener('click', () => {
      const cuisine = chip.dataset.cuisine;
      const params = new URLSearchParams(window.location.search);
      if (cuisine) params.set('cuisine', cuisine);
      else params.delete('cuisine');
      params.delete('search');
      const newUrl = `/restaurants${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState(null, '', newUrl);
      renderRestaurantsPage();
    });
  });

  // Clear filters
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Router.navigate('/restaurants');
    });
  }

  // Bookmark buttons
  document.querySelectorAll('[data-bookmark]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.bookmark;
      const added = Store.toggleBookmark(id);
      btn.classList.toggle('restaurant-card__bookmark--active', added);
      btn.textContent = added ? '♥' : '♡';
      showToast(added ? 'Restaurant bookmarked!' : 'Bookmark removed', added ? 'success' : 'info');
    });
  });

  // Card clicks
  document.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-bookmark]')) return;
      Router.navigate(`/restaurant/${card.dataset.restaurantId}`);
    });
  });
}
