'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

export const RESTAURANT_IMAGES: Record<string, string> = {
  r1: '/assets/indian.jpg',
  r2: '/assets/japanese.jpg',
  r3: '/assets/italian.jpg',
  r4: '/assets/thai.jpg',
  r5: '/assets/korean.jpg',
  r6: '/assets/mexican.jpg',
  r7: '/assets/chinese.jpg',
  r8: '/assets/french.jpg',
  r9: '/assets/burger.jpg',
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, theme, logout, setTheme } = useStore();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const headerClass = `header ${isHome && !scrolled ? 'header--transparent' : 'header--solid'}`;

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`header__nav-link${pathname === href ? ' header__nav-link--active' : ''}`}
    >
      {label}
    </Link>
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header className={headerClass} id="main-header">
        <div className="header__inner">
          <Link href="/" className="header__logo">
            <div className="header__logo-icon">🍽</div>
            Deal<span>Dish</span>
          </Link>

          <nav className="header__nav">
            {navLink('/', 'Home')}
            {navLink('/restaurants', 'Restaurants')}
            {navLink('/deals', 'Deals')}
          </nav>

          <div className="header__actions">
            <button
              className="header__theme-toggle"
              title="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              suppressHydrationWarning
            >
              {hydrated ? (theme === 'dark' ? '☀️' : '🌙') : '☀️'}
            </button>

            {hydrated && token ? (
              <>
                <button className="btn btn--secondary btn--sm" onClick={handleLogout} suppressHydrationWarning>
                  Logout
                </button>
              </>
            ) : hydrated ? (
              <>
                <Link href="/login" className="btn btn--ghost btn--sm">Sign In</Link>
                <Link href="/register" className="btn btn--primary btn--sm">Get Started</Link>
              </>
            ) : null}

            <button
              className="header__mobile-toggle"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              suppressHydrationWarning
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' mobile-menu--open' : ''}`}>
        <div className="mobile-menu__header">
          <div className="header__logo">
            <div className="header__logo-icon">🍽</div>
            Deal<span>Dish</span>
          </div>
          <button className="btn btn--icon btn--ghost" onClick={() => setMobileOpen(false)} suppressHydrationWarning>✕</button>
        </div>
        <nav className="mobile-menu__links">
          <Link href="/" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/restaurants" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>Restaurants</Link>
          <Link href="/deals" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>Deals</Link>
          {hydrated && token ? (
            <>
              <button className="mobile-menu__link" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                Logout
              </button>
            </>
          ) : hydrated ? (
            <>
              <Link href="/login" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/register" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          ) : null}
        </nav>
      </div>
    </>
  );
}
