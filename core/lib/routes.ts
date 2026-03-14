/**
 * Centralized route constants.
 *
 * Usage:
 *   import { ROUTES } from '@/core/lib/routes';
 *   router.push(ROUTES.DASHBOARD);
 *   router.push(ROUTES.PROFILE('john'));
 *
 * Why: Avoid hardcoded strings scattered across the codebase.
 * Renaming a route = change it here only.
 */
export const ROUTES = {
  // Public
  HOME: '/',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',

  // Dynamic
  PROFILE: (username: string) => `/profile/${username}`,
} as const;
