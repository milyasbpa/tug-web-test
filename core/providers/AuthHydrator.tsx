'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/features/login/store/auth.store';

// Restores the access token from cookie into the Zustand store on page load.
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
