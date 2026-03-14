import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './core/i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Protected paths — checked after stripping any locale prefix.
 * Add routes here as the app grows (e.g. '/settings', '/billing').
 */
const PROTECTED_PATHS = ['/dashboard', '/settings', '/packages'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for matching (e.g. /de/dashboard → /dashboard)
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathnameWithoutLocale === path || pathnameWithoutLocale.startsWith(`${path}/`),
  );

  if (isProtected) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // Preserve the intended destination so the login page can redirect back after auth
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except:
  // - /api (Route Handlers)
  // - /_next (Next.js internals)
  // - static files with extensions
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
