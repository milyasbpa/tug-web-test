'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components/button/Button';
import { Link, useRouter } from '@/core/i18n/navigation';
import { useAuthStore } from '@/features/login/store/auth.store';

/**
 * Minimal navbar for authenticated pages.
 * - Displays a link to /packages ("Wellness Packages")
 * - Shows the logged-in user's email
 * - Provides a logout button that clears session + Zustand store + redirects to /login
 */
export function ProtectedNavbar() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function handleLogout() {
    await fetch('/api/auth/session', { method: 'DELETE' });
    clearAuth();
    router.push('/login');
  }

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Navigation links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/packages"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            {t('links.wellnessPackages')}
          </Link>
        </nav>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-muted-foreground hidden text-sm sm:block">
              {t('user.loggedInAs')}{' '}
              <span className="text-foreground font-medium">{user.email}</span>
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
            aria-label={t('logout')}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
