# Testing Setup: Unit & Integration Tests (Vitest + Testing Library + MSW)

## Current State

Vitest is already installed in this project, but the current `vitest.config.ts` is **only** configured
for Storybook component tests running in a real browser (Playwright/Chromium). There is no setup yet for:

- Unit tests (pure functions, hooks, utils)
- Integration tests (components + React Query + mocked API)

---

## Todo List

- [x] **1. Install dependencies**

  Install the required testing libraries:

  ```bash
  npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom msw
  ```

  | Package                       | Purpose                                                         |
  | ----------------------------- | --------------------------------------------------------------- |
  | `@testing-library/react`      | Render & query React components in a test environment           |
  | `@testing-library/user-event` | Simulate real user interactions (click, type, etc.)             |
  | `@testing-library/jest-dom`   | Custom matchers: `toBeInTheDocument()`, `toHaveValue()`, etc.   |
  | `jsdom`                       | DOM simulation in Node (environment for unit/integration tests) |
  | `msw`                         | Mock Service Worker — intercept API calls in integration tests  |

---

- [x] **2. Create the test setup file**

  Create `core/testing/setup.ts` to:
  - Import `@testing-library/jest-dom` so custom matchers are available in all tests
  - Set up & tear down the MSW server around each test suite

  ```ts
  // core/testing/setup.ts
  import '@testing-library/jest-dom';
  import { afterAll, afterEach, beforeAll } from 'vitest';
  import { server } from './msw/server';

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  ```

---

- [x] **3. Create MSW server & handlers**

  Create the `core/testing/msw/` folder containing:

  **`core/testing/msw/handlers.ts`** — mock API route definitions:

  ```ts
  import { http, HttpResponse } from 'msw';

  export const handlers = [
    http.get('/api/subscription/plans', () => {
      return HttpResponse.json([
        { id: 'free', name: 'Free', price: 0 },
        { id: 'pro', name: 'Pro', price: 29 },
      ]);
    }),
  ];
  ```

  **`core/testing/msw/server.ts`** — MSW server for the Node environment:

  ```ts
  import { setupServer } from 'msw/node';
  import { handlers } from './handlers';

  export const server = setupServer(...handlers);
  ```

  Expected folder structure:

  ```
  core/testing/
  ├── setup.ts                  ← global setup (jest-dom + MSW lifecycle)
  └── msw/
      ├── handlers.ts           ← mock API route definitions
      └── server.ts             ← MSW Node server instance
  ```

---

- [x] **4. Update `vitest.config.ts`**

  Add a `unit` project alongside the existing `storybook` project.
  Both projects run independently with their own configuration:

  ```ts
  // vitest.config.ts
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';
  import { defineConfig } from 'vitest/config';
  import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
  import { playwright } from '@vitest/browser-playwright';
  import react from '@vitejs/plugin-react';

  const dirname =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

  export default defineConfig({
    test: {
      projects: [
        // --- Project 1: Storybook visual tests (existing) ---
        {
          extends: true,
          plugins: [storybookTest({ configDir: path.join(dirname, 'core/storybook') })],
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
          test: {
            name: 'unit',
            environment: 'jsdom',
            globals: true,
            setupFiles: ['core/testing/setup.ts'],
            include: ['**/*.{test,spec}.{ts,tsx}'],
            exclude: ['node_modules', '.next', 'core/storybook'],
            coverage: {
              provider: 'v8',
              reporter: ['text', 'lcov', 'html'],
              include: ['core/**', 'features/**'],
              exclude: ['core/api/generated/**', '**/*.stories.tsx'],
            },
          },
        },
      ],
    },
  });
  ```

  > **Note:** Install `@vitejs/plugin-react` if not already present:
  > `npm install -D @vitejs/plugin-react`

---

- [x] **5. Add scripts to `package.json`**

  ```json
  "test":            "vitest run --project unit",
  "test:watch":      "vitest --project unit",
  "test:coverage":   "vitest run --project unit --coverage",
  "test:storybook":  "vitest run --project storybook",
  "test:all":        "vitest run"
  ```

  | Script           | Purpose                                              |
  | ---------------- | ---------------------------------------------------- |
  | `test`           | Run all unit + integration tests (CI mode, no watch) |
  | `test:watch`     | Watch mode for local development                     |
  | `test:coverage`  | Generate coverage report (output to `coverage/`)     |
  | `test:storybook` | Run only the Storybook visual tests                  |
  | `test:all`       | Run all projects (unit + storybook) together         |

---

- [x] **6. Update `.gitignore`**

  Add the coverage output folder:

  ```
  # Test coverage
  coverage/
  ```

---

- [x] **7. Update `tsconfig.json`**

  Ensure jest-dom types are available project-wide. Add to `compilerOptions.types`:

  ```json
  {
    "compilerOptions": {
      "types": ["@testing-library/jest-dom"]
    }
  }
  ```

---

- [x] **8. Create a unit test example**

  Create `core/lib/utils.test.ts` as an example unit test for a pure function:

  ```ts
  import { describe, expect, it } from 'vitest';
  import { cn } from './utils';

  describe('cn (classnames utility)', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('resolves Tailwind conflicts (last one wins)', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('ignores falsy values', () => {
      expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz');
    });
  });
  ```

---

- [x] **9. Create an integration test example**

  Create `core/components/examples/react-query-client.test.tsx` as an example integration test
  that renders a component with React Query and a mocked API via MSW:

  ```tsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { render, screen, waitFor } from '@testing-library/react';
  import { http, HttpResponse } from 'msw';
  import { describe, expect, it } from 'vitest';
  import { server } from '@/core/testing/msw/server';
  import ReactQueryClientExample from './react-query-client';

  function wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  describe('ReactQueryClientExample', () => {
    it('displays the list of subscription plans from the API', async () => {
      render(<ReactQueryClientExample />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('Free')).toBeInTheDocument();
        expect(screen.getByText('Pro')).toBeInTheDocument();
      });
    });

    it('displays an error state when the API fails', async () => {
      server.use(
        http.get('/api/subscription/plans', () => {
          return HttpResponse.error();
        }),
      );

      render(<ReactQueryClientExample />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      });
    });
  });
  ```

---

## File Structure After Setup

```
core/
├── lib/
│   ├── utils.ts
│   └── utils.test.ts                    ← unit test example
├── testing/
│   ├── setup.ts                         ← global setup (jest-dom + MSW lifecycle)
│   └── msw/
│       ├── handlers.ts                  ← default mock API handlers
│       └── server.ts                    ← MSW Node server instance
└── components/
    └── examples/
        ├── react-query-client.tsx
        └── react-query-client.test.tsx  ← integration test example
vitest.config.ts                         ← updated: added 'unit' project
```

---

## File Naming & Location Conventions

| Test Type   | File Location                       | Example                              |
| ----------- | ----------------------------------- | ------------------------------------ |
| Unit        | Co-located with the file under test | `core/lib/utils.test.ts`             |
| Unit (hook) | Co-located with the hook            | `core/modules/auth/useAuth.test.ts`  |
| Integration | Co-located with the component       | `features/home/HomeSection.test.tsx` |
| MSW Handler | `core/testing/msw/handlers.ts`      | Add handlers per domain/feature      |

---

> This checklist was created before implementation. Update status `[ ]` → `[x]` as each step is completed.
