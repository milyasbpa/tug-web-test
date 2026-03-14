// Re-export locale-aware navigation helpers from next-intl.
// Always import Link, useRouter, usePathname, redirect from this file
// instead of directly from 'next/navigation' — so the locale is handled automatically.

import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export const { Link, useRouter, usePathname, redirect, getPathname } = createNavigation(routing);
