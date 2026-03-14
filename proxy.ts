import createMiddleware from 'next-intl/middleware';

import { routing } from './core/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except Next.js internals and static files
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
