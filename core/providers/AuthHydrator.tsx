'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/features/login/store/auth.store';

/**
 * AuthHydrator — client component that restores the auth session from cookie on page load.
 *
 * Place this once inside the root layout (inside QueryProvider).
 * It reads the `access_token` regular cookie (set by /api/auth/session after login)
 * and rehydrates the Zustand AuthStore so axios interceptors have a valid token.
 *
 * The `user` object is not restored here (cookie only holds the token).
 * Fetch the user profile lazily via a separate query hook if needed.
 */
export function AuthHydrator() {
  const { setAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
    const token = match?.[1] ? decodeURIComponent(match[1]) : null;

    if (token) {
      setAuth(null, token);
    }

    setHydrated();
  }, [setAuth, setHydrated]);

  return null;
}
