// ─── DealDish Header Component ───
import Store from '../store.js';
import Router from '../router.js';

const RESTAURANT_IMAGES = {
  r1: 'assets/indian.jpg', r2: 'assets/japanese.jpg', r3: 'assets/italian.jpg',
  r4: 'assets/thai.jpg', r5: 'assets/korean.jpg', r6: 'assets/mexican.jpg',
  r7: 'assets/chinese.jpg', r8: 'assets/french.jpg', r9: 'assets/burger.jpg',
};

export { RESTAURANT_IMAGES };

export function renderHeader() {
  const isHome = window.location.pathname === '/' || window.location.pathname === '';
  const isLoggedIn = Store.isLoggedIn;
  const theme = Store.get('theme');

  return `
    <header class="header ${isHome ? 'header--transparent' : 'header--solid'}" id="main-header">
      <div class="header__inner">
        <a href="/" data-link class="header__logo" id="logo-link">
          <div class="header__logo-icon">🍽</div>
          Deal<span>Dish</span>
        </a>

        <nav class="header__nav" id="main-nav">
          <a href="/" data-link class="header__nav-link ${window.location.pathname === '/' ? 'header__nav-link--active' : ''}" id="nav-home">Home</a>
          <a href="/restaurants" data-link class="header__nav-link ${window.location.pathname === '/restaurants' ? 'header__nav-link--active' : ''}" id="nav-restaurants">Restaurants</a>
          <a href="/deals" data-link class="header__nav-link ${window.location.pathname === '/deals' ? 'header__nav-link--active' : ''}" id="nav-deals">Deals</a>
        </nav>

        <div class="header__actions">
          <button class="header__theme-toggle" id="theme-toggle" title="Toggle theme">
            ${theme === 'dark' ? '☀️' : '🌙'}
          </button>
          ${isLoggedIn
            ? `<button class="btn btn--secondary btn--sm" id="logout-btn">Logout</button>`
            : `<a href="/login" data-link class="btn btn--ghost btn--sm" id="login-link">Sign In</a>
               <a href="/register" data-link class="btn btn--primary btn--sm" id="register-link">Get Started</a>`
          }
          <button class="header__mobile-toggle" id="mobile-menu-toggle" aria-label="Menu">
            ☰
          </button>
        </div>
      </div>
    </header>

    <div class="mobile-menu" id="mobile-menu">
      <div class="mobile-menu__header">
        <div class="header__logo">
          <div class="header__logo-icon">🍽</div>
          Deal<span>Dish</span>
        </div>
        <button class="btn btn--icon btn--ghost" id="mobile-menu-close">✕</button>
      </div>
      <nav class="mobile-menu__links">
        <a href="/" data-link class="mobile-menu__link" id="mobile-nav-home">Home</a>
        <a href="/restaurants" data-link class="mobile-menu__link" id="mobile-nav-restaurants">Restaurants</a>
        <a href="/deals" data-link class="mobile-menu__link" id="mobile-nav-deals">Deals</a>
        ${isLoggedIn
          ? `<button class="mobile-menu__link" id="mobile-logout">Logout</button>`
          : `<a href="/login" data-link class="mobile-menu__link" id="mobile-login">Sign In</a>
             <a href="/register" data-link class="mobile-menu__link" id="mobile-register">Get Started</a>`
        }
      </nav>
    </div>
  `;
}

export function initHeaderEvents() {
  // Scroll effect
  const header = document.getElementById('main-header');
  if (header && window.location.pathname === '/') {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.remove('header--transparent');
        header.classList.add('header--solid');
      } else {
        header.classList.add('header--transparent');
        header.classList.remove('header--solid');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const newTheme = Store.get('theme') === 'dark' ? 'light' : 'dark';
      Store.set('theme', newTheme);
      // Re-render header to update icon
      const headerContainer = document.querySelector('.header');
      if (headerContainer) {
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Store.logout();
      Router.navigate('/');
    });
  }
  const mobileLogout = document.getElementById('mobile-logout');
  if (mobileLogout) {
    mobileLogout.addEventListener('click', () => {
      Store.logout();
      closeMobileMenu();
      Router.navigate('/');
    });
  }

  // Mobile menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('mobile-menu--open');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('mobile-menu--open');
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu on navigation
  document.querySelectorAll('.mobile-menu__link[data-link]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
