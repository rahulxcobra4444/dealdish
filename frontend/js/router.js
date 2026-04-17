// ─── DealDish Client-Side Router ───

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.appEl = document.getElementById('app');

    window.addEventListener('popstate', () => this.resolve());
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
  }

  on(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    if (path === this.currentRoute) return;
    window.history.pushState(null, '', path);
    this.resolve();
  }

  resolve() {
    // Normalize path: treat /index.html or /client/index.html as root '/'
    let path = window.location.pathname || '/';
    if (path.endsWith('index.html')) {
      path = '/';
    }
    let handler = null;
    let params = {};

    // Exact match first
    if (this.routes[path]) {
      handler = this.routes[path];
    } else {
      // Parameterized route match
      for (const [pattern, h] of Object.entries(this.routes)) {
        const regex = new RegExp('^' + pattern.replace(/:\w+/g, '([^/]+)') + '$');
        const match = path.match(regex);
        if (match) {
          handler = h;
          const paramNames = [...pattern.matchAll(/:(\w+)/g)].map(m => m[1]);
          paramNames.forEach((name, i) => {
            params[name] = match[i + 1];
          });
          break;
        }
      }
    }

    if (handler) {
      this.currentRoute = path;
      window.scrollTo({ top: 0, behavior: 'instant' });
      handler(params);
    } else {
      this.render404();
    }
  }

  render404() {
    this.appEl.innerHTML = `
      <div class="empty-state" style="padding-top:calc(var(--header-height) + 80px)">
        <div class="empty-state__icon">🍽️</div>
        <h2 class="empty-state__title">Page Not Found</h2>
        <p class="empty-state__text">This dish isn't on the menu. Let's get you back to the good stuff.</p>
        <a href="/" data-link class="btn btn--primary">Back to Home</a>
      </div>
    `;
  }
}

export default new Router();
