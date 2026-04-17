'use client';
import { useState, useEffect, useCallback } from 'react';
import RestaurantCard from '@/components/RestaurantCard';
import { getRestaurants, searchRestaurants } from '@/lib/api/restaurant.api';
import type { Restaurant } from '@/lib/api/restaurant.api';

const CUISINES = ['Indian', 'Chinese', 'Italian', 'Japanese', 'Mexican', 'Thai', 'Korean', 'French', 'American'];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { restaurants: data } = await getRestaurants({ cuisine: cuisine || undefined });
      setRestaurants(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  }, [cuisine]);

  const fetchSearch = useCallback(async (q: string) => {
    setLoading(true);
    setError('');
    try {
      const { restaurants: data } = await searchRestaurants(q);
      setRestaurants(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch on cuisine change
  useEffect(() => {
    if (!search) fetchRestaurants();
  }, [cuisine, fetchRestaurants, search]);

  // debounce search
  useEffect(() => {
    if (!search) { fetchRestaurants(); return; }
    const timer = setTimeout(() => fetchSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search, fetchSearch, fetchRestaurants]);

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 32px)', minHeight: '80vh' }}>
      <div className="container">
        <div className="section__header" style={{ marginBottom: '24px' }}>
          <div>
            <div className="section__tag">Explore</div>
            <h1 className="section__title">
              {cuisine ? `${cuisine} Restaurants` : search ? `Results for "${search}"` : 'All Restaurants'}
            </h1>
            <p className="section__subtitle">{loading ? 'Loading...' : `${restaurants.length} restaurants found`}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div className="search-bar" style={{ maxWidth: '360px', flex: 1 }}>
            <span className="search-bar__icon">🔍</span>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search restaurants..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCuisine(''); }}
            />
          </div>
        </div>

        <div className="cuisine-chips" style={{ marginBottom: '32px' }}>
          <button
            className={`cuisine-chip${!cuisine ? ' cuisine-chip--active' : ''}`}
            onClick={() => { setCuisine(''); setSearch(''); }}
          >All</button>
          {CUISINES.map(c => (
            <button key={c}
              className={`cuisine-chip${cuisine === c ? ' cuisine-chip--active' : ''}`}
              onClick={() => { setCuisine(c); setSearch(''); }}
            >{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-state__icon">⏳</div>
            <h2 className="empty-state__title">Loading Restaurants...</h2>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <h2 className="empty-state__title">Something went wrong</h2>
            <p className="empty-state__text">{error}</p>
            <button className="btn btn--primary" onClick={fetchRestaurants}>Try Again</button>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🍽️</div>
            <h2 className="empty-state__title">No Restaurants Found</h2>
            <p className="empty-state__text">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
          </div>
        )}
      </div>
    </main>
  );
}