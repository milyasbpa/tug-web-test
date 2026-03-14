import type { Decorator } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

// Add or remove namespace imports as new namespaces are added to core/i18n/json/.
import enCommon from '../../i18n/json/en/common.json';
import enHome from '../../i18n/json/en/home.json';

const messages = {
  common: enCommon,
  home: enHome,
};

export const withNextIntl: Decorator = (Story) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);
