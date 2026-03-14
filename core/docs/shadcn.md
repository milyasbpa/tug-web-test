# shadcn/ui Setup

## Overview

This project uses [shadcn/ui](https://ui.shadcn.com/) with the **new-york** style and **neutral** base color, configured for Next.js App Router with Tailwind CSS v4 and TypeScript.

## Installation

shadcn was initialized with:

```bash
npx shadcn@latest init -d -y
```

The `-d` flag uses default settings (new-york style) and `-y` skips all prompts.

## Configuration

**`components.json`** — shadcn's config file at the project root:

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/core/components",
    "utils": "@/core/lib/utils",
    "ui": "@/core/components/ui",
    "lib": "@/core/lib",
    "hooks": "@/hooks"
  }
}
```

All shadcn output is directed to `core/` instead of the default root-level folders:

| Purpose                          | Path                  |
| -------------------------------- | --------------------- |
| UI components (shadcn generated) | `core/components/ui/` |
| Custom components                | `core/components/`    |
| `cn()` utility                   | `core/lib/utils.ts`   |
| Hooks                            | `hooks/`              |

## Core Dependencies

| Package                    | Version  | Purpose                                  |
| -------------------------- | -------- | ---------------------------------------- |
| `clsx`                     | ^2.1.1   | Conditional class names                  |
| `tailwind-merge`           | ^3.5.0   | Merge Tailwind classes without conflicts |
| `class-variance-authority` | ^0.7.1   | Variant-based component styling          |
| `lucide-react`             | ^0.574.0 | Icon library (default for shadcn)        |

## Adding Components

To add a shadcn component, run:

```bash
npx shadcn@latest add <component-name>
```

Examples:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
```

The component will be generated at `core/components/ui/<component-name>.tsx` automatically, because of the alias config in `components.json`.

## Using the `cn()` Utility

The `cn()` helper merges Tailwind classes safely. Always import from `@/core/lib/utils`:

```ts
import { cn } from '@/core/lib/utils';

<div className={cn('base-class', isActive && 'active-class', className)} />
```

## CSS Variables

shadcn injects CSS design tokens into `app/globals.css`. These tokens power the color system and are available as Tailwind classes:

| Token                | Tailwind class               | Description          |
| -------------------- | ---------------------------- | -------------------- |
| `--background`       | `bg-background`              | Page background      |
| `--foreground`       | `text-foreground`            | Primary text         |
| `--primary`          | `bg-primary`                 | Primary brand color  |
| `--muted`            | `bg-muted`                   | Subtle backgrounds   |
| `--muted-foreground` | `text-muted-foreground`      | Subdued text         |
| `--border`           | `border-border`              | Default border color |
| `--radius`           | `rounded-lg` (`--radius-lg`) | Base border radius   |

Dark mode is supported via the `.dark` class on the `html` element.

## Custom Components

Custom components built on top of shadcn primitives live in `core/components/`. They follow the same conventions as shadcn components:

- Use `cn()` for class merging
- Accept a `className` prop for external overrides
- Use shadcn CSS variables for colors

| Component  | Path                        | Description                             |
| ---------- | --------------------------- | --------------------------------------- |
| `MenuTabs` | `core/components/tab_menu/` | Segmented tab control with icon + label |
