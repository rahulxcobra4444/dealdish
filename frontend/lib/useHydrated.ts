import { useStore } from '@/lib/store';

/**
 * Returns true only after Zustand has rehydrated from localStorage.
 * Use this to prevent SSR/client hydration mismatches when rendering
 * anything that depends on auth state or bookmarks.
 */
export function useHydrated(): boolean {
  return useStore(s => s._hasHydrated);
}
