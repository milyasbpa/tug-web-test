// Example usage of getTranslations() in a SERVER component.
// getTranslations() is async and can only be used in server components (no 'use client').

import { getTranslations } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';

export async function HomeHeroServer() {
  // Use the 'home' namespace — TypeScript will autocomplete available keys
  const t = await getTranslations('home');

  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </section>
  );
}

export async function CommonNavServer() {
  const t = await getTranslations('common');

  return (
    <nav>
      {/* Link from core/i18n/navigation is automatically locale-aware */}
      <Link href="/">{t('home')}</Link>
    </nav>
  );
}
