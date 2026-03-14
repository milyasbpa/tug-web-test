import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { type ReactElement } from 'react';

/**
 * Custom render that wraps UI with all providers needed for testing.
 * - Creates a fresh QueryClient per test (retry disabled to avoid hanging tests)
 * - Wraps with NextIntlClientProvider using locale "en" and empty messages
 *   (add specific messages as needed via the `messages` option)
 *
 * Usage:
 *   import { renderWithProviders } from '@/core/testing/utils';
 *   renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <NextIntlClientProvider locale="en" messages={{}}>
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
    ),
    ...options,
  });
}
