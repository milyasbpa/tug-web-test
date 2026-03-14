'use client';

import { History, CreditCard, SlidersHorizontal, LogOut, ListChecks } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import * as React from 'react';

import { Avatar } from '@/core/components/avatar/Avatar';
import { cn } from '@/core/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileDropdownUser {
  name: string;
  email: string;
  /** Avatar image URL — shows initials if omitted */
  avatarSrc?: string;
}

export interface ProfileDropdownQuota {
  /** e.g. 10 */
  remaining: number;
  /** e.g. "January 13th 2026" */
  renewDate: string;
}

export interface ProfileDropdownProps {
  user: ProfileDropdownUser;
  quota?: ProfileDropdownQuota;
  onUsageHistory?: () => void;
  onPlanBilling?: () => void;
  onSettings?: () => void;
  onLogOut?: () => void;
  /** Extra class on the root */
  className?: string;
}

// ─── Shared classes ───────────────────────────────────────────────────────────

const contentCls =
  'z-50 min-w-[280px] overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg' +
  ' data-[state=open]:animate-in data-[state=closed]:animate-out' +
  ' data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' +
  ' data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95' +
  ' data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2';

const itemCls =
  'relative flex w-full cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors' +
  ' focus:bg-accent focus:text-accent-foreground' +
  ' data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

// ─── ProfileDropdown ──────────────────────────────────────────────────────────

/**
 * Profile dropdown — avatar trigger that opens a panel with user info,
 * quota badge, and navigation items.
 *
 * ```tsx
 * <ProfileDropdown
 *   user={{ name: 'Denny Satria', email: 'denny@google.com' }}
 *   quota={{ remaining: 10, renewDate: 'January 13th 2026' }}
 *   onLogOut={handleLogOut}
 * />
 * ```
 */
export function ProfileDropdown({
  user,
  quota,
  onUsageHistory,
  onPlanBilling,
  onSettings,
  onLogOut,
  className,
}: ProfileDropdownProps) {
  return (
    <DropdownMenuPrimitive.Root>
      {/* ── Trigger ── */}
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          suppressHydrationWarning
          className={cn(
            'focus-visible:ring-ring/50 rounded-full focus-visible:ring-2 focus-visible:outline-none',
            className,
          )}
        >
          <Avatar
            name={user.name}
            src={user.avatarSrc}
            size="sm"
            // Remove pointer-events so the button handles interaction
            className="pointer-events-none"
          />
        </button>
      </DropdownMenuPrimitive.Trigger>

      {/* ── Content ── */}
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content align="end" sideOffset={8} className={contentCls}>
          {/* ── User info ── */}
          <div className="flex items-center gap-3 px-4 py-4">
            <Avatar name={user.name} src={user.avatarSrc} size="sm" />
            <div className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-sm font-semibold">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
          </div>

          {/* ── Quota badge ── */}
          {quota && (
            <div className="px-3 pb-3">
              <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 px-3 py-2.5 dark:bg-blue-950/40">
                <ListChecks className="mt-0.5 size-4 shrink-0 text-blue-500" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    {quota.remaining} Photoshoots remaining
                  </span>
                  <span className="text-muted-foreground text-xs">Renew at {quota.renewDate}</span>
                </div>
              </div>
            </div>
          )}

          <DropdownMenuPrimitive.Separator className="bg-border mx-3 my-1 h-px" />

          {/* ── Menu items ── */}
          <div className="p-2">
            <DropdownMenuPrimitive.Item className={itemCls} onSelect={onUsageHistory}>
              <History className="text-muted-foreground size-4 shrink-0" />
              Usage History
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item className={itemCls} onSelect={onPlanBilling}>
              <CreditCard className="text-muted-foreground size-4 shrink-0" />
              Plan &amp; Billing
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item className={itemCls} onSelect={onSettings}>
              <SlidersHorizontal className="text-muted-foreground size-4 shrink-0" />
              Settings
            </DropdownMenuPrimitive.Item>
          </div>

          <DropdownMenuPrimitive.Separator className="bg-border mx-3 my-1 h-px" />

          <div className="p-2">
            <DropdownMenuPrimitive.Item
              className={cn(itemCls, 'text-destructive focus:text-destructive')}
              onSelect={onLogOut}
            >
              <LogOut className="size-4 shrink-0" />
              Log out
            </DropdownMenuPrimitive.Item>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
