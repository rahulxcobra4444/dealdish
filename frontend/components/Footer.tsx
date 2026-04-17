import Link from 'next/link';

const PRODUCT_LINKS = [
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Deals', href: '/deals' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Become a Partner', href: '/register?role=owner' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Refunds', href: '/refunds' },
];

const SOCIALS = [
  { label: 'Instagram', icon: '📸', href: 'https://instagram.com' },
  { label: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
  { label: 'Facebook', icon: '📘', href: 'https://facebook.com' },
  { label: 'LinkedIn', icon: '💼', href: 'https://linkedin.com' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="header__logo" aria-label="DealDish home">
              <div className="header__logo-icon" aria-hidden="true">🍽</div>
              Deal<span>Dish</span>
            </Link>
            <p className="footer__brand-desc">
              Discover incredible deals at 500+ verified restaurants. From fine dining to street food — every meal is a deal.
            </p>
            <ul className="footer__socials" aria-label="Social links">
              {SOCIALS.map(s => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social-link"
                    aria-label={s.label}
                  >
                    <span aria-hidden="true">{s.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer__column-title">Product</h3>
            <ul className="footer__links">
              {PRODUCT_LINKS.map(l => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer__column-title">Company</h3>
            <ul className="footer__links">
              {COMPANY_LINKS.map(l => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer__column-title">Legal</h3>
            <ul className="footer__links">
              {LEGAL_LINKS.map(l => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} DealDish. Crafted in Siliguri by Project Circle.</p>
          <p>Made with <span aria-hidden="true">🧡</span> for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}
