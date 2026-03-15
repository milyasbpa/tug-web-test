import fs from 'fs';
import path from 'path';

import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fall back to defaultLocale if the locale is missing or invalid
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const localeDir = path.resolve(process.cwd(), `core/i18n/json/${locale}`);
  const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'));

  const messages: Record<string, unknown> = {};
  for (const file of files) {
    const namespace = file.replace('.json', '');
    const raw = fs.readFileSync(path.join(localeDir, file), 'utf-8');
    messages[namespace] = JSON.parse(raw);
  }

  return { locale, messages };
});
