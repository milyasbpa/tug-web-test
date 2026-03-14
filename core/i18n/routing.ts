import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  // Default locale (en) uses no prefix → /blog, /about
  // Non-default locales use a prefix → /de/blog, /de/about
  // /en/blog will be redirected to /blog
  localePrefix: 'as-needed',
});
