import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Validate env vars at build time — fails fast if required vars are missing
import './core/lib/env';

const withNextIntl = createNextIntlPlugin('./core/i18n/request.ts');

// ---------------------------------------------------------------------------
// Security headers — applied to all routes
// Tighten the CSP per-project once you know the exact third-party origins.
// ---------------------------------------------------------------------------
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-eval' required by Next.js dev mode HMR + some RSC internals.
  // Remove in production if possible and replace with a nonce-based approach.
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  // 'unsafe-inline' required for Tailwind CSS-in-JS and next-themes class injection.
  "style-src 'self' 'unsafe-inline'",
  // Allow self-hosted fonts (next/font) and data URIs for icons/avatars.
  "font-src 'self'",
  "img-src 'self' data: blob: https:",
  // Restrict connections to same origin; extend for your API domain per-project.
  `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? ''}`.trim(),
  "media-src 'self'",
  // Block all plugins (Flash, etc.)
  "object-src 'none'",
  // Prevent this page from being embedded in iframes on other origins.
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  // Enable DNS prefetch for performance
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Legacy XSS filter (still useful for older browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Prevent clickjacking via iframes
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control how much referrer info is sent
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable access to sensitive browser APIs not needed by the app
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS for 2 years (preload-ready)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Content Security Policy
  { key: 'Content-Security-Policy', value: cspDirectives },
];

const nextConfig: NextConfig = {
  // Produce a self-contained output in .next/standalone — required by Dockerfile.
  // Only the files needed to run the app are included; node_modules are deduplicated.
  // Trade-off: public/ and .next/static/ must be copied manually (handled in Dockerfile).
  output: 'standalone',

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
