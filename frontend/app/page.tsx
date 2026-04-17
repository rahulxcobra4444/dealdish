'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RestaurantCard from '@/components/RestaurantCard';
import OfferCard from '@/components/OfferCard';
import { useToast } from '@/components/ToastProvider';
import { getRestaurants } from '@/lib/api/restaurant.api';
import { getOffers } from '@/lib/api/offer.api';
import type { Restaurant } from '@/lib/api/restaurant.api';
import type { Offer } from '@/lib/api/offer.api';

const CUISINES_WITH_FLAGS = [
  { flag: '🇮🇳', name: 'Indian' }, { flag: '🇨🇳', name: 'Chinese' },
  { flag: '🇮🇹', name: 'Italian' }, { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇲🇽', name: 'Mexican' }, { flag: '🇹🇭', name: 'Thai' },
  { flag: '🌍', name: 'Mediterranean' }, { flag: '🇺🇸', name: 'American' },
  { flag: '🇰🇷', name: 'Korean' }, { flag: '🇫🇷', name: 'French' },
];

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const particlesRef = useRef<HTMLDivElement>(null);

  const [topOffers, setTopOffers] = useState<Offer[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    getOffers({ limit: 6 }).then(({ offers }) => setTopOffers(offers)).catch(() => {});
    getRestaurants({ limit: 6 }).then(({ restaurants }) => setTopRestaurants(restaurants)).catch(() => {});
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      const size = (2 + Math.random() * 4) + 'px';
      p.style.width = size;
      p.style.height = size;
      container.appendChild(p);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('reveal--visible');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleNewsletter = () => {
    if (email.includes('@')) {
      showToast('Subscribed! Welcome to the DealDish family 🎉', 'success');
      setEmail('');
    } else {
      showToast('Please enter a valid email', 'error');
    }
  };

  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero__bg">
          <Image src="/assets/hero.jpg" alt="Premium dining experience" fill style={{ objectFit: 'cover', filter: 'brightness(0.35) contrast(1.1)' }} priority />
        </div>
        <div className="hero__overlay" />
        <div className="hero__particles" ref={particlesRef} />
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Mumbai&apos;s #1 Restaurant Deals Platform
          </div>
          <h1 className="hero__title">
            Discover <span className="hero__title-highlight">Incredible Deals</span> at Top Restaurants
          </h1>
          <p className="hero__subtitle">
            Save up to 50% on dining at 500+ verified restaurants. From fine dining to street food —
            every meal is a deal.
          </p>

          <div className="hero__search">
            <div className="search-bar">
              <span className="search-bar__icon">🔍</span>
              <input
                type="text"
                className="search-bar__input"
                placeholder="Search restaurants, cuisines, or deals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                autoComplete="off"
              />
              <button className="search-bar__btn" onClick={handleSearch}>Search</button>
            </div>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <div className="hero__stat-value">500<span>+</span></div>
              <div className="hero__stat-label">Restaurants</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">1,200<span>+</span></div>
              <div className="hero__stat-label">Active Deals</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">₹2.5<span>Cr</span></div>
              <div className="hero__stat-label">Saved by Users</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">50<span>K+</span></div>
              <div className="hero__stat-label">Happy Foodies</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRENDING DEALS ═══ */}
      {topOffers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__header">
              <div>
                <div className="section__tag">Trending Now</div>
                <h2 className="section__title">Today&apos;s Hottest Deals</h2>
                <p className="section__subtitle">Curated picks from the most popular restaurants</p>
              </div>
              <Link href="/deals" className="btn btn--secondary">View All Deals →</Link>
            </div>
            <div className="offers-grid">
              {topOffers.map(o => <OfferCard key={o._id} offer={o} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section__header" style={{ justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="section__tag" style={{ justifyContent: 'center' }}>How It Works</div>
              <h2 className="section__title">Start Saving in 3 Simple Steps</h2>
              <p className="section__subtitle" style={{ margin: '8px auto 0' }}>
                No hidden fees, no catch — just great food at great prices.
              </p>
            </div>
          </div>
          <div className="steps-grid">
            {[
              { emoji: '🍽️', num: '01', title: 'Browse Restaurants', desc: 'Explore our curated collection of top-rated restaurants near you, filtered by cuisine, rating, and offers.' },
              { emoji: '🏷️', num: '02', title: 'Find Your Deal', desc: 'Pick from hundreds of exclusive deals — percentage discounts, BOGO offers, freebies, and combo specials.' },
              { emoji: '💸', num: '03', title: 'Dine & Save', desc: 'Show the deal code at the restaurant or apply during online ordering. Enjoy your meal and pocket the savings!' },
            ].map(step => (
              <div key={step.num} className="step-card reveal">
                <div className="step-card__icon-emoji">{step.emoji}</div>
                <div className="step-card__number">{step.num}</div>
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP RESTAURANTS ═══ */}
      {topRestaurants.length > 0 && (
        <section className="section" style={{ background: "linear-gradient(rgba(10,10,12,0.9),rgba(10,10,12,0.9)), url('/assets/italian.jpg') center/cover no-repeat fixed" }}>
          <div className="container">
            <div className="section__header">
              <div>
                <div className="section__tag">Top Rated</div>
                <h2 className="section__title">Top Restaurants</h2>
                <p className="section__subtitle">The highest rated dining experiences in your city</p>
              </div>
              <Link href="/restaurants" className="btn btn--secondary">Explore All →</Link>
            </div>
            <div className="restaurant-grid">
              {topRestaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CUISINE CATEGORIES ═══ */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section__header" style={{ justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="section__tag" style={{ justifyContent: 'center' }}>Explore by Cuisine</div>
              <h2 className="section__title">What Are You Craving?</h2>
            </div>
          </div>
          <div className="cuisine-chips" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {CUISINES_WITH_FLAGS.map(({ flag, name }) => (
              <button
                key={name}
                className="cuisine-chip"
                onClick={() => router.push(`/restaurants?cuisine=${encodeURIComponent(name)}`)}
              >
                {flag} {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA / NEWSLETTER ═══ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-section__inner">
            <div className="cta-section__glow" />
            <h2 className="cta-section__title">Never Miss a Deal 🍽️</h2>
            <p className="cta-section__text">
              Join 50,000+ foodies who receive weekly curated deals straight to their inbox.
            </p>
            <div className="cta-section__form">
              <input
                type="email"
                className="cta-section__input"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="btn btn--primary" onClick={handleNewsletter}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
