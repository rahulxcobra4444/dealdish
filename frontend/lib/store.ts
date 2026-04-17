'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'admin';
  avatar?: string;
  referralCode?: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  bookmarks: string[];
  theme: 'dark' | 'light';
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  toggleBookmark: (restaurantId: string) => boolean;
  isBookmarked: (restaurantId: string) => boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  isLoggedIn: () => boolean;
  isOwner: () => boolean;
  isAdmin: () => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      bookmarks: [],
      theme: 'dark',
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (user) => set({ user }),
      toggleBookmark: (id) => {
        const { bookmarks } = get();
        const added = !bookmarks.includes(id);
        set({ bookmarks: added ? [...bookmarks, id] : bookmarks.filter(b => b !== id) });
        return added;
      },
      isBookmarked: (id) => get().bookmarks.includes(id),
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      isLoggedIn: () => get().user !== null && get().token !== null,
      isOwner: () => get().user?.role === 'owner',
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'dealdish-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        bookmarks: state.bookmarks,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
