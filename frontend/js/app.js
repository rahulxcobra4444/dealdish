// ─── DealDish Main App Entry ───
import Router from './router.js';
import { renderHomePage } from './pages/Home.js';
import { renderRestaurantsPage } from './pages/Restaurants.js';
import { renderRestaurantDetailPage } from './pages/RestaurantDetail.js';
import { renderDealsPage } from './pages/Deals.js';
import { renderLoginPage, renderRegisterPage } from './pages/Auth.js';

// ─── Register Routes ───
Router
  .on('/', () => renderHomePage())
  .on('/restaurants', () => renderRestaurantsPage())
  .on('/restaurant/:id', (params) => renderRestaurantDetailPage(params))
  .on('/deals', () => renderDealsPage())
  .on('/login', () => renderLoginPage())
  .on('/register', () => renderRegisterPage());

// ─── Initialize ───
Router.resolve();

// ─── Scroll-reveal: fires whenever a .reveal element enters the viewport ───
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
