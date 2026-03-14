# Storybook Setup

## Stack Context

|              | Version       |
| ------------ | ------------- |
| Node.js      | v22+          |
| Next.js      | 16.1.6        |
| React        | 19.2.3        |
| Tailwind CSS | v4            |
| TypeScript   | ^5            |
| Storybook    | 10.x (latest) |

---

## Steps

- [x] **1. Initialize Storybook**

Run the Storybook CLI initializer — it will auto-detect Next.js and install the right packages:

```bash
npx storybook@latest init
```

This will:

- Install `@storybook/nextjs-vite`, `storybook`, and supporting packages
- Create `.storybook/main.ts` and `.storybook/preview.ts`
- Add `storybook` and `build-storybook` scripts to `package.json`

> **Note:** The CLI will auto-detect Next.js + Vite and select `@storybook/nextjs-vite` as the framework automatically.

---

- [x] **2. Configure `core/storybook/main.ts`**

After initialization, **move** the generated `.storybook/` folder to `core/storybook/`:

```bash
mv .storybook core/storybook
```

Then tell Storybook where the config directory is by updating the scripts in `package.json`:

````json
"storybook": "storybook dev -p 6006 --config-dir core/storybook",
"build-storybook": "storybook build --config-dir core/storybook" to:

- Point `stories` to `core/components/**` (sibling folder, path is relative from `core/storybook/`)
- Configure the `@/*` path alias via `viteFinal` (framework uses Vite, not webpack)

```ts
import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx)', '../components/**/*.mdx'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../../public'],
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          // __dirname is core/storybook, go up two levels to reach project root
          '@': path.resolve(__dirname, '../../'),
        },
      },
    });
  },
};

export default config;
````

---

- [x] **3. Configure `core/storybook/preview.ts`**

Import `globals.css` so Tailwind v4 styles and shadcn CSS variables are available in all stories, and register global decorators:

```ts
import type { Preview } from '@storybook/nextjs-vite';
import '../../app/globals.css';
import { withNextIntl } from './decorators/withNextIntl';

const preview: Preview = {
  decorators: [withNextIntl],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
};

export default preview;
```

---

- [x] **4. Handle `next-intl` in Stories**

Components that use `useTranslations()` need to be wrapped with a mock i18n provider. Create `core/storybook/decorators/withNextIntl.tsx`:

```tsx
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import type { Decorator } from '@storybook/react';

// core/i18n/json/ files are committed to source control — edit them directly.
// Add or remove namespace imports here as new namespaces are added.
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
```

> **Note:** When a new namespace is added to `core/i18n/json/`, import it here and add it to `messages`.

---

- [x] **5. Verify Storybook Scripts in `package.json`**

Confirm the scripts include the `--config-dir` flag pointing to `core/storybook`:

```json
"storybook": "storybook dev -p 6006 --config-dir core/storybook",
"build-storybook": "storybook build --config-dir core/storybook"
```

---

- [x] **6. Write the First Story**

Create a story for `MenuTabs` at `core/components/tab_menu/TabMenu.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LayoutDashboard, Settings } from 'lucide-react';
import { MenuTabs } from './TabMenu';

const meta: Meta<typeof MenuTabs> = {
  title: 'Components/MenuTabs',
  component: MenuTabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuTabs>;

export const Default: Story = {};

export const CustomTabs: Story = {
  args: {
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { value: 'settings', label: 'Settings', icon: Settings },
    ],
    defaultValue: 'dashboard',
  },
};
```

---

- [x] **7. Update `.gitignore`**

`core/storybook/` should be committed. The CLI already adds `storybook-static` to `.gitignore` automatically — verify it exists:

```gitignore
storybook-static
*storybook.log
```

---

## Folder Structure After Setup

```
core/
├── storybook/
│   ├── main.ts
│   ├── preview.ts
│   ├── vitest.setup.ts
│   └── decorators/
│       └── withNextIntl.tsx
└── components/
    └── tab_menu/
        ├── TabMenu.tsx
        └── TabMenu.stories.tsx    ← stories co-located with component
```

---

## Running Storybook

```bash
# Start dev server (http://localhost:6006)
npm run storybook

# Build static storybook
npm run build-storybook
```

---

## Known Caveats

| Issue                     | Explanation                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `core/i18n/json/` missing | Ensure the JSON files are committed and present in `core/i18n/json/` — they are committed to source control, not generated at runtime          |
| Adding new namespaces     | When a new namespace is added, also import it in `core/storybook/decorators/withNextIntl.tsx`                                                  |
| Tailwind v4 + Storybook   | Tailwind v4 uses CSS imports instead of PostCSS config — importing `globals.css` in `preview.ts` is sufficient, no extra Tailwind addon needed |
| React 19 + Storybook 10   | Fully supported as of Storybook 10.x — no extra config required                                                                                |
| Path alias `@/*`          | Must be wired manually via `viteFinal` in `main.ts` (step 2) — framework is `nextjs-vite`, so use `viteFinal` not `webpackFinal`               |
