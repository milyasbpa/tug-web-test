import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { User } from '@/core/api/generated/starterKitAPIDocumentation.schemas';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  /**
   * True once we've attempted to restore session from cookie on app load.
   * Use this to avoid rendering protected UI before hydration completes.
   */
  isHydrated: boolean;

  /**
   * Called after successful login OR when restoring from cookie.
   * `user` may be null when restoring — only the token is known at that point.
   */
  setAuth: (user: User | null, accessToken: string) => void;

  /** Called on logout or when refresh token is expired. */
  clearAuth: () => void;

  /** Mark hydration as done regardless of whether a token was found. */
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isHydrated: false,

      setAuth: (user, accessToken) => set({ user, accessToken }),

      clearAuth: () => set({ user: null, accessToken: null }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    { name: 'AuthStore' },
  ),
);
