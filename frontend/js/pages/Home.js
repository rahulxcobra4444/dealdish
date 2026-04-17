// ─── Home Page ───
import { renderHeader, initHeaderEvents, RESTAURANT_IMAGES } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderRestaurantCard } from '../components/RestaurantCard.js';
import { renderOfferCard } from '../components/OfferCard.js';
import { showToast } from '../components/Toast.js';
import { mockRestaurants, filterOffers, CUISINES } from '../mockData.js';
import Store from '../store.js';
import Router from '../router.js';
import { initScrollReveal } from '../app.js';

export function renderHomePage() {
  const app = document.getElementById('app');
  const topOffers = filterOffers({ sort: 'popular' }).slice(0, 6);
  const topRestaurants = mockRestaurants.filter(r => r.isActive).sort((a, b) => b.rating - a.rating).slice(0, 6);

  app.innerHTML = `
    ${renderHeader()}

    <!-- ═══ HERO ═══ -->
    <section class="hero" id="hero-section">
      <div class="hero__bg">
        <img src="assets/hero.jpg" alt="Premium dining experience" id="hero-bg-image">
      </div>
      <div class="hero__overlay"></div>
      <div class="hero__particles" id="hero-particles"></div>
      <div class="hero__content">
        <div class="hero__badge" id="hero-badge">
          <span class="hero__badge-dot"></span>
          Mumbai's #1 Restaurant Deals Platform
        </div>
        <h1 class="hero__title" id="hero-title">
          Discover <span class="hero__title-highlight">Incredible Deals</span> at Top Restaurants
        </h1>
        <p class="hero__subtitle" id="hero-subtitle">
          Save up to 50% on dining at 500+ verified restaurants. From fine dining to street food — 
          every meal is a deal.
        </p>

        <div class="hero__search" id="hero-search">
          <div class="search-bar" id="search-bar">
            <span class="search-bar__icon">🔍</span>
            <input type="text" 
                   class="search-bar__input" 
                   placeholder="Search restaurants, cuisines, or deals..." 
                   id="hero-search-input"
                   autocomplete="off">
            <button class="search-bar__btn" id="hero-search-btn">Search</button>
          </div>
        </div>

        <div class="hero__stats" id="hero-stats">
          <div class="hero__stat">
            <div class="hero__stat-value" id="stat-restaurants">500<span>+</span></div>
            <div class="hero__stat-label">Restaurants</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-value" id="stat-deals">1,200<span>+</span></div>
            <div class="hero__stat-label">Active Deals</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-value" id="stat-saved">₹2.5<span>Cr</span></div>
            <div class="hero__stat-label">Saved by Users</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-value" id="stat-users">50<span>K+</span></div>
            <div class="hero__stat-label">Happy Foodies</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TRENDING DEALS ═══ -->
    <section class="section" id="trending-section">
      <div class="container">
        <div class="section__header">
          <div>
            <div class="section__tag">Trending Now</div>
            <h2 class="section__title" id="trending-title">Today's Hottest Deals</h2>
            <p class="section__subtitle">Curated picks from the most popular restaurants</p>
          </div>
          <a href="/deals" data-link class="btn btn--secondary" id="view-all-deals">
            View All Deals →
          </a>
        </div>

        <div class="offers-grid" id="trending-grid">
          ${topOffers.map(o => renderOfferCard(o)).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="section" style="background: var(--bg-surface);" id="how-it-works-section">
      <div class="container">
        <div class="section__header" style="justify-content:center;">
          <div style="text-align:center;">
            <div class="section__tag" style="justify-content:center;">How It Works</div>
            <h2 class="section__title" id="hiw-title">Start Saving in 3 Simple Steps</h2>
            <p class="section__subtitle" style="margin:8px auto 0;">No hidden fees, no catch — just great food at great prices.</p>
          </div>
        </div>

        <div class="steps-grid" id="steps-grid">
          <div class="step-card reveal" id="step-1">
            <div class="step-card__icon-emoji">🍽️</div>
            <div class="step-card__number">01</div>
            <h3 class="step-card__title">Browse Restaurants</h3>
            <p class="step-card__desc">Explore our curated collection of top-rated restaurants near you, filtered by cuisine, rating, and offers.</p>
          </div>
          <div class="step-card reveal" id="step-2">
            <div class="step-card__icon-emoji">🏷️</div>
            <div class="step-card__number">02</div>
            <h3 class="step-card__title">Find Your Deal</h3>
            <p class="step-card__desc">Pick from hundreds of exclusive deals — percentage discounts, BOGO offers, freebies, and combo specials.</p>
          </div>
          <div class="step-card reveal" id="step-3">
            <div class="step-card__icon-emoji">💸</div>
            <div class="step-card__number">03</div>
            <h3 class="step-card__title">Dine & Save</h3>
            <p class="step-card__desc">Show the deal code at the restaurant or apply during online ordering. Enjoy your meal and pocket the savings!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TOP RESTAURANTS ═══ -->
    <section class="section" id="top-restaurants-section" style="background: linear-gradient(rgba(10, 10, 12, 0.9), rgba(10, 10, 12, 0.9)), url('assets/italian.jpg') center/cover no-repeat fixed;">
      <div class="container">
        <div class="section__header">
          <div>
            <div class="section__tag">Top Rated</div>
            <h2 class="section__title" id="top-restaurants-title">Top Restaurants</h2>
            <p class="section__subtitle">The highest rated dining experiences in your city</p>
          </div>
          <a href="/restaurants" data-link class="btn btn--secondary" id="view-all-restaurants">
            Explore All →
          </a>
        </div>

        <div class="restaurant-grid" id="top-restaurants-grid">
          ${topRestaurants.map(r => renderRestaurantCard(r)).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ CUISINE CATEGORIES ═══ -->
    <section class="section" style="background: var(--bg-surface);" id="cuisines-section">
      <div class="container">
        <div class="section__header" style="justify-content:center;">
          <div style="text-align:center;">
            <div class="section__tag" style="justify-content:center;">Explore by Cuisine</div>
            <h2 class="section__title" id="cuisines-title">What Are You Craving?</h2>
          </div>
        </div>
        <div class="cuisine-chips" style="justify-content:center;flex-wrap:wrap;" id="cuisine-chips">
          ${['🇮🇳 Indian', '🇨🇳 Chinese', '🇮🇹 Italian', '🇯🇵 Japanese', '🇲🇽 Mexican', '🇹🇭 Thai', '🌍 Mediterranean', '🇺🇸 American', '🇰🇷 Korean', '🇫🇷 French'].map(c => {
            const name = c.split(' ').slice(1).join(' ');
            return `<button class="cuisine-chip" data-cuisine-filter="${name}" id="cuisine-chip-${name.toLowerCase()}">${c}</button>`;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ CTA / NEWSLETTER ═══ -->
    <section class="cta-section" id="cta-section">
      <div class="container">
        <div class="cta-section__inner" id="cta-inner">
          <div class="cta-section__glow"></div>
          <h2 class="cta-section__title" id="cta-title">Never Miss a Deal 🍽️</h2>
          <p class="cta-section__text">Join 50,000+ foodies who receive weekly curated deals straight to their inbox.</p>
          <div class="cta-section__form" id="newsletter-form">
            <input type="email" class="cta-section__input" placeholder="Enter your email" id="newsletter-email">
            <button class="btn btn--primary" id="newsletter-submit">Subscribe</button>
          </div>
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;

  initHeaderEvents();
  initHomePageEvents();
  addParticles();
  initScrollReveal();
}

function initHomePageEvents() {
  // Search
  const searchInput = document.getElementById('hero-search-input');
  const searchBtn = document.getElementById('hero-search-btn');
  if (searchBtn && searchInput) {
    const doSearch = () => {
      const q = searchInput.value.trim();
      if (q) Router.navigate(`/restaurants?search=${encodeURIComponent(q)}`);
    };
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
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

  // Restaurant card clicks -> navigate
  document.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-bookmark]')) return;
      Router.navigate(`/restaurant/${card.dataset.restaurantId}`);
    });
  });

  // Offer card clicks
  document.querySelectorAll('.offer-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-claim]')) return;
      const rid = card.querySelector('.offer-card__restaurant')?.textContent;
      // Navigate to deals page
      Router.navigate('/deals');
    });
  });

  // Claim button clicks
  document.querySelectorAll('[data-claim]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Deal claimed! Show the code at the restaurant.', 'success');
    });
  });

  // Cuisine chips -> navigate to restaurants with filter
  document.querySelectorAll('[data-cuisine-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      Router.navigate(`/restaurants?cuisine=${encodeURIComponent(chip.dataset.cuisineFilter)}`);
    });
  });

  // Newsletter
  const nlSubmit = document.getElementById('newsletter-submit');
  const nlEmail = document.getElementById('newsletter-email');
  if (nlSubmit) {
    nlSubmit.addEventListener('click', () => {
      if (nlEmail.value.includes('@')) {
        showToast('Subscribed! Welcome to the DealDish family 🎉', 'success');
        nlEmail.value = '';
      } else {
        showToast('Please enter a valid email', 'error');
      }
    });
  }
}

function addParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'hero__particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 5 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}
