import type { MetadataRoute } from 'next';

/**
 * robots.ts — generates /robots.txt at build time.
 *
 * Default: allow all crawlers on all routes.
 * Override `rules` per-project to disallow specific paths (e.g. /admin, /api).
 * Update `sitemap` URL to match your production domain.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Uncomment to block common paths that shouldn't be indexed:
        // disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
