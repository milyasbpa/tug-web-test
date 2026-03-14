'use client';

// Example usage of useTranslations() in a CLIENT component.
// useTranslations() can only be used in client components ('use client').

import { useTranslations } from 'next-intl';

import { useRouter, usePathname } from '@/core/i18n/navigation';
import { routing } from '@/core/i18n/routing';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(locale: string) {
    router.replace(pathname, { locale });
  }

  return (
    <div className="flex gap-2">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className="hover:bg-muted rounded border px-3 py-1 text-sm font-medium uppercase transition-colors"
        >
          {locale}
        </button>
      ))}
    </div>
  );
}

export function HomeHeroClient() {
  // Use the 'home' namespace — TypeScript will autocomplete available keys
  const t = useTranslations('home');

  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </section>
  );
}
