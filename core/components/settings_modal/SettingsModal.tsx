'use client';

import { X, ArrowUpRight } from 'lucide-react';
import { Dialog as DialogPrimitive, Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

export interface HelpLink {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SettingsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Notification toggle items */
  notifications?: NotificationSetting[];
  /** Called whenever a toggle changes */
  onNotificationChange?: (id: string, enabled: boolean) => void;
  /** Help & Support link items */
  helpLinks?: HelpLink[];
  className?: string;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
  { id: 'photoshoot_completed', label: 'Photoshoot completed', enabled: true },
  { id: 'credit_low', label: 'Credit low', enabled: true },
  { id: 'credit_empty', label: 'Credit empty', enabled: true },
  { id: 'new_features', label: 'New features', enabled: true },
  { id: 'promotions_offers', label: 'Promotions & offers', enabled: true },
];

const DEFAULT_HELP_LINKS: HelpLink[] = [
  { id: 'video_guides', label: 'Video guides' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'terms', label: 'Terms of Service' },
  { id: 'get_support', label: 'Get Support' },
];

// ─── SettingsModal ────────────────────────────────────────────────────────────

/**
 * SettingsModal — notification toggles and help & support links.
 *
 * ```tsx
 * <SettingsModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   notifications={notifications}
 *   onNotificationChange={(id, enabled) => updateNotification(id, enabled)}
 * />
 * ```
 */
export function SettingsModal({
  open,
  onOpenChange,
  notifications: notificationsProp,
  onNotificationChange,
  helpLinks = DEFAULT_HELP_LINKS,
  className,
}: SettingsModalProps) {
  // internal state used when caller doesn't manage notifications externally
  const [internalNotifications, setInternalNotifications] = React.useState<NotificationSetting[]>(
    notificationsProp ?? DEFAULT_NOTIFICATIONS,
  );

  // Sync when prop changes
  React.useEffect(() => {
    if (notificationsProp) setInternalNotifications(notificationsProp);
  }, [notificationsProp]);

  const notifications = notificationsProp ?? internalNotifications;

  function handleToggle(id: string, enabled: boolean) {
    if (!notificationsProp) {
      setInternalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, enabled } : n)));
    }
    onNotificationChange?.(id, enabled);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

        {/* Content */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'bg-background w-full max-w-md rounded-3xl px-7 pt-6 pb-8 shadow-xl outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'flex flex-col gap-7 duration-200',
            className,
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-foreground text-xl font-semibold">
              Settings
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="text-muted-foreground hover:bg-accent flex size-8 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* ── Notifications ── */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-foreground text-base font-semibold">Notifications</h2>
              <p className="text-muted-foreground text-sm">
                Choose how and when you want to be notified
              </p>
            </div>

            <ul className="flex flex-col gap-1">
              {notifications.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2">
                  <span className="text-foreground text-sm">{item.label}</span>
                  <SwitchPrimitive.Root
                    checked={item.enabled}
                    onCheckedChange={(checked) => handleToggle(item.id, checked)}
                    className={cn(
                      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
                      'transition-colors duration-200',
                      'focus-visible:ring-ring/50 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      'data-[state=unchecked]:bg-border data-[state=checked]:bg-brand',
                    )}
                  >
                    <SwitchPrimitive.Thumb
                      className={cn(
                        'pointer-events-none block size-5 rounded-full bg-white shadow-sm',
                        'transition-transform duration-200',
                        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                      )}
                    />
                  </SwitchPrimitive.Root>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Help & Support ── */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-foreground text-base font-semibold">Help &amp; Support</h2>
              <p className="text-muted-foreground text-sm">Get help or reach out to our team</p>
            </div>

            <ul className="flex flex-col gap-1">
              {helpLinks.map((link) => {
                const Tag = link.href ? 'a' : 'button';
                const extraProps = link.href
                  ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                  : { type: 'button' as const, onClick: link.onClick };

                return (
                  <li key={link.id}>
                    <Tag
                      {...(extraProps as React.AnchorHTMLAttributes<HTMLAnchorElement> &
                        React.ButtonHTMLAttributes<HTMLButtonElement>)}
                      className="text-foreground flex w-full items-center justify-between py-2 text-sm transition-opacity hover:opacity-70"
                    >
                      {link.label}
                      <ArrowUpRight className="text-muted-foreground size-4" />
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </section>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
