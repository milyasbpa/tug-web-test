'use client';

import { Sparkles } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';
import { Logo } from '@/core/components/logo/Logo';
import {
  ProfileDropdown,
  type ProfileDropdownUser,
  type ProfileDropdownQuota,
} from '@/core/components/profile_dropdown/ProfileDropdown';
import { MenuTabs, type TabItem } from '@/core/components/tab_menu/TabMenu';
import { cn } from '@/core/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavbarVariant = 'authenticated' | 'guest';

interface NavbarBaseProps {
  /** Controls which set of actions is shown. Defaults to "authenticated". */
  variant?: NavbarVariant;
  className?: string;
}

interface NavbarAuthenticatedProps extends NavbarBaseProps {
  variant?: 'authenticated';
  /** Tab items passed to MenuTabs. */
  tabs: TabItem[];
  /** Currently active tab value */
  activeTab?: string;
  /** Fired when the active tab changes */
  onTabChange?: (value: string) => void;
  /** Fired when the Create button is clicked */
  onCreateClick?: () => void;
  /** User data for the ProfileDropdown */
  user: ProfileDropdownUser;
  /** Quota info shown in the ProfileDropdown panel */
  quota?: ProfileDropdownQuota;
  onUsageHistory?: () => void;
  onPlanBilling?: () => void;
  onSettings?: () => void;
  onLogOut?: () => void;
}

interface NavbarGuestProps extends NavbarBaseProps {
  variant: 'guest';
  /** Fired when the Login button is clicked */
  onLoginClick?: () => void;
  /** Fired when the Sign up button is clicked */
  onSignUpClick?: () => void;
}

export type NavbarProps = NavbarAuthenticatedProps | NavbarGuestProps;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Top navigation bar with two variants:
 *
 * - `variant="authenticated"` (default) — Logo · Tabs · Create + ProfileDropdown
 * - `variant="guest"` — Logo · Login + Sign up
 *
 * ```tsx
 * // Authenticated
 * <Navbar
 *   user={{ name: 'Denny Satria', email: 'denny@google.com' }}
 *   quota={{ remaining: 10, renewDate: 'January 13th 2026' }}
 *   onCreateClick={handleCreate}
 *   onLogOut={handleLogOut}
 * />
 *
 * // Guest
 * <Navbar
 *   variant="guest"
 *   onLoginClick={handleLogin}
 *   onSignUpClick={handleSignUp}
 * />
 * ```
 */
const headerClass = cn(
  'sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background px-6',
);

export function Navbar(props: NavbarProps) {
  if (props.variant === 'guest') {
    const { className, onLoginClick, onSignUpClick } = props;

    return (
      <header className={cn(headerClass, className)}>
        {/* ── Left: Logo ────────────────────────────────────────────────────── */}
        <Logo className="h-6.25 w-auto" />

        {/* ── Spacer ────────────────────────────────────────────────────────── */}
        <span aria-hidden />

        {/* ── Right: Login + Sign up ────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="default" onClick={onLoginClick}>
            Login
          </Button>
          <Button variant="outline" size="default" onClick={onSignUpClick}>
            Sign up
          </Button>
        </div>
      </header>
    );
  }

  const {
    className,
    tabs,
    activeTab,
    onTabChange,
    onCreateClick,
    user,
    quota,
    onUsageHistory,
    onPlanBilling,
    onSettings,
    onLogOut,
  } = props;

  return (
    <header className={cn(headerClass, className)}>
      {/* ── Left: Logo ──────────────────────────────────────────────────────── */}
      <Logo className="h-6.25 w-auto" />

      {/* ── Center: Tabs ────────────────────────────────────────────────────── */}
      <MenuTabs tabs={tabs} defaultValue={activeTab} onChange={onTabChange} />

      {/* ── Right: Create + Profile ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="default" onClick={onCreateClick}>
          <Sparkles />
          Create
        </Button>

        <ProfileDropdown
          user={user}
          quota={quota}
          onUsageHistory={onUsageHistory}
          onPlanBilling={onPlanBilling}
          onSettings={onSettings}
          onLogOut={onLogOut}
        />
      </div>
    </header>
  );
}
