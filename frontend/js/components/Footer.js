// ─── DealDish Footer Component ───

export function renderFooter() {
  return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <div class="header__logo" style="margin-bottom: 0;">
              <div class="header__logo-icon">🍽</div>
              Deal<span>Dish</span>
            </div>
            <p class="footer__brand-desc">
              Discover exclusive restaurant deals in your city. Save on every meal with 
              curated offers from the best restaurants around you.
            </p>
            <div class="footer__socials">
              <a href="#" class="footer__social-link" aria-label="Twitter" id="social-twitter">𝕏</a>
              <a href="#" class="footer__social-link" aria-label="Instagram" id="social-instagram">📷</a>
              <a href="#" class="footer__social-link" aria-label="Facebook" id="social-facebook">f</a>
              <a href="#" class="footer__social-link" aria-label="LinkedIn" id="social-linkedin">in</a>
            </div>
          </div>

          <div>
            <h4 class="footer__column-title">Explore</h4>
            <ul class="footer__links">
              <li><a href="/restaurants" data-link id="footer-restaurants">All Restaurants</a></li>
              <li><a href="/deals" data-link id="footer-deals">Today's Deals</a></li>
              <li><a href="#" id="footer-cuisines">Cuisines</a></li>
              <li><a href="#" id="footer-nearby">Near Me</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer__column-title">For Owners</h4>
            <ul class="footer__links">
              <li><a href="/register" data-link id="footer-list">List Your Restaurant</a></li>
              <li><a href="#" id="footer-dashboard">Owner Dashboard</a></li>
              <li><a href="#" id="footer-analytics">Analytics</a></li>
              <li><a href="#" id="footer-pricing">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer__column-title">Company</h4>
            <ul class="footer__links">
              <li><a href="#" id="footer-about">About Us</a></li>
              <li><a href="#" id="footer-blog">Blog</a></li>
              <li><a href="#" id="footer-careers">Careers</a></li>
              <li><a href="#" id="footer-contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <p>&copy; ${new Date().getFullYear()} DealDish. All rights reserved.</p>
          <div style="display:flex;gap:20px;">
            <a href="#" id="footer-privacy">Privacy Policy</a>
            <a href="#" id="footer-terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
