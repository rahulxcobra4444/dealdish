// ─── DealDish State Management ───
const Store = {
  _state: {
    user: JSON.parse(localStorage.getItem('dd_user') || 'null'),
    token: localStorage.getItem('dd_token') || null,
    bookmarks: JSON.parse(localStorage.getItem('dd_bookmarks') || '[]'),
    theme: localStorage.getItem('dd_theme') || 'dark',
  },
  _listeners: [],

  get(key) {
    return this._state[key];
  },

  set(key, value) {
    this._state[key] = value;
    if (['user', 'bookmarks'].includes(key)) {
      localStorage.setItem(`dd_${key}`, JSON.stringify(value));
    }
    if (key === 'token') {
      if (value) localStorage.setItem('dd_token', value);
      else localStorage.removeItem('dd_token');
    }
    if (key === 'theme') {
      localStorage.setItem('dd_theme', value);
      document.documentElement.setAttribute('data-theme', value);
    }
    this._listeners.forEach(fn => fn(key, value));
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  },

  get isLoggedIn() {
    return !!this._state.user && !!this._state.token;
  },

  get isOwner() {
    return this._state.user?.role === 'restaurant_owner';
  },

  get isAdmin() {
    return this._state.user?.role === 'admin';
  },

  login(user, token) {
    this.set('user', user);
    this.set('token', token);
  },

  logout() {
    this.set('user', null);
    this.set('token', null);
    this.set('bookmarks', []);
  },

  toggleBookmark(restaurantId) {
    const bookmarks = [...this._state.bookmarks];
    const idx = bookmarks.indexOf(restaurantId);
    if (idx > -1) bookmarks.splice(idx, 1);
    else bookmarks.push(restaurantId);
    this.set('bookmarks', bookmarks);
    return idx === -1; // returns true if added
  },

  isBookmarked(restaurantId) {
    return this._state.bookmarks.includes(restaurantId);
  }
};

// Init theme
document.documentElement.setAttribute('data-theme', Store.get('theme'));

export default Store;
