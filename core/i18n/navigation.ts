// Locale-aware navigation helpers — always import from here instead of 'next/navigation'
import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export const { Link, useRouter, usePathname, redirect, getPathname } = createNavigation(routing);
