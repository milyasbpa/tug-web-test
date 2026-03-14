import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Set env vars before any module is loaded (env.ts runs schema.parse at module init time)
process.env.NEXT_PUBLIC_API_URL ??= 'http://localhost';
process.env.NEXT_PUBLIC_APP_ENV ??= 'development';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['core/**', 'features/**'],
      exclude: ['core/api/generated/**', '**/*.stories.tsx'],
    },
    projects: [
      // --- Project 1: Storybook visual tests (existing) ---
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, 'core/storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['core/storybook/vitest.setup.ts'],
        },
      },
      // --- Project 2: Unit & Integration tests (new) ---
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(dirname),
          },
        },
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['core/testing/setup.ts'],
          include: ['**/*.{test,spec}.{ts,tsx}'],
          exclude: ['node_modules', '.next', 'core/storybook'],
          env: {
            NEXT_PUBLIC_API_URL: 'http://localhost',
            NEXT_PUBLIC_APP_ENV: 'development',
          },
        },
      },
    ],
  },
});
