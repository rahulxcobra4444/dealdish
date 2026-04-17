// ─── Auth Pages (Login & Register) ───
import { renderHeader, initHeaderEvents } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { showToast } from '../components/Toast.js';
import { mockUsers } from '../mockData.js';
import Store from '../store.js';
import Router from '../router.js';

export function renderLoginPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${renderHeader()}

    <div class="auth-page" id="login-page">
      <div class="auth-card animate-scaleIn" id="login-card">
        <div style="text-align:center;margin-bottom:8px;">
          <div class="header__logo" style="justify-content:center;margin-bottom:16px;">
            <div class="header__logo-icon">🍽</div>
            Deal<span>Dish</span>
          </div>
        </div>
        <h1 class="auth-card__title" id="login-title">Welcome Back</h1>
        <p class="auth-card__subtitle">Sign in to access your deals and bookmarks</p>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Email</label>
            <input type="email" class="form-input" id="login-email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input type="password" class="form-input" id="login-password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn--primary btn--xl" style="width:100%;margin-top:8px;" id="login-submit">
            Sign In
          </button>
        </form>

        <div style="margin:24px 0;text-align:center;position:relative;">
          <div style="border-top:1px solid var(--border-subtle);"></div>
          <span style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--bg-surface);padding:0 12px;font-size:0.75rem;color:var(--text-muted);">
            Demo Accounts
          </span>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;" id="demo-accounts">
          ${mockUsers.map(u => `
            <button class="btn btn--secondary btn--sm" style="justify-content:flex-start;" data-demo-email="${u.email}" id="demo-${u.role}">
              <span style="font-size:0.75rem;padding:2px 8px;border-radius:var(--radius-full);background:var(--bg-elevated);color:var(--text-muted);">${u.role.replace('_', ' ')}</span>
              ${u.name} — ${u.email}
            </button>
          `).join('')}
        </div>

        <div class="auth-card__footer" id="login-footer">
          Don't have an account? <a href="/register" data-link>Create one</a>
        </div>
      </div>
    </div>

    ${renderFooter()}
  `;

  initHeaderEvents();

  // Form submit
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    // Demo login
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      Store.login(user, 'demo_token_' + user.id);
      showToast(`Welcome back, ${user.name}!`, 'success');
      Router.navigate('/');
    } else {
      showToast('Invalid credentials. Try a demo account.', 'error');
    }
  });

  // Demo account buttons
  document.querySelectorAll('[data-demo-email]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-email').value = btn.dataset.demoEmail;
      document.getElementById('login-password').value = 'demo123';
    });
  });
}

export function renderRegisterPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${renderHeader()}

    <div class="auth-page" id="register-page">
      <div class="auth-card animate-scaleIn" id="register-card">
        <div style="text-align:center;margin-bottom:8px;">
          <div class="header__logo" style="justify-content:center;margin-bottom:16px;">
            <div class="header__logo-icon">🍽</div>
            Deal<span>Dish</span>
          </div>
        </div>
        <h1 class="auth-card__title" id="register-title">Create Account</h1>
        <p class="auth-card__subtitle">Join 50K+ foodies saving on every meal</p>

        <form id="register-form">
          <div class="form-group">
            <label class="form-label" for="register-name">Full Name</label>
            <input type="text" class="form-input" id="register-name" placeholder="John Doe" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="register-email">Email</label>
            <input type="email" class="form-input" id="register-email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="register-password">Password</label>
            <input type="password" class="form-input" id="register-password" placeholder="At least 6 characters" required minlength="6">
          </div>
          <div class="form-group">
            <label class="form-label" for="register-role">I am a</label>
            <select class="form-select" id="register-role">
              <option value="user">Foodie (looking for deals)</option>
              <option value="restaurant_owner">Restaurant Owner</option>
            </select>
          </div>

          <button type="submit" class="btn btn--primary btn--xl" style="width:100%;margin-top:8px;" id="register-submit">
            Create Account
          </button>
        </form>

        <div class="auth-card__footer" id="register-footer">
          Already have an account? <a href="/login" data-link>Sign in</a>
        </div>
      </div>
    </div>

    ${renderFooter()}
  `;

  initHeaderEvents();

  // Form submit
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    // Simulate registration
    const newUser = { id: 'u_new', name, email, role, avatar: '' };
    Store.login(newUser, 'demo_token_new');
    showToast(`Welcome aboard, ${name}! 🎉`, 'success');
    Router.navigate('/');
  });
}
