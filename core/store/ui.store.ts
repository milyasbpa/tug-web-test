import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Global UI store — sidebar, modals, theme state, etc.
 *
 * Principles:
 * - This store is only for global UI state needed across many components
 * - State with limited scope (e.g. a single form wizard) → use React Context instead
 * - Data from API → TanStack Query, not Zustand
 *
 * To add a per-feature store:
 *   features/[feature]/store/[feature].store.ts
 *   export const useFeatureStore = create<FeatureStore>()(devtools(..., { name: 'FeatureStore' }));
 *
 * For state that needs to persist to localStorage, add the persist middleware:
 *   import { persist } from 'zustand/middleware';
 *   create<Store>()(devtools(persist((set) => ({ ... }), { name: 'store-key' })))
 */

interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    { name: 'UIStore' },
  ),
);
