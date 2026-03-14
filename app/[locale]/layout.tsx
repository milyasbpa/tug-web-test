import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Toaster } from 'sonner';

import { AuthHydrator } from '@/core/components/providers/AuthHydrator';
import { QueryProvider } from '@/core/components/providers/QueryProvider';
import { SkipNavLink } from '@/core/components/skip_nav/SkipNav';
import { routing } from '@/core/i18n/routing';
import { ThemeProvider } from '@/core/providers/ThemeProvider';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    // Per-page: export const metadata = { title: 'Dashboard' } → 'Dashboard | Starter Kit'
    template: '%s | Starter Kit',
    default: 'Starter Kit',
  },
  description: 'A production-ready Next.js starter kit.',
  // Replace with your production domain. Set NEXT_PUBLIC_APP_URL in .env.production.
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Starter Kit',
    // title, description, images are inherited from title/description above
  },
  twitter: {
    card: 'summary_large_image',
    // title and description are inherited from above
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* SkipNavLink must be the first focusable element — WCAG 2.4.1 */}
        <SkipNavLink />
        <ThemeProvider>
          <NextIntlClientProvider>
            <QueryProvider>
              <AuthHydrator />
              <main id="main-content">{children}</main>
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
