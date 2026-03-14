'use client';

import { X, UserRound } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';
import { Input } from '@/core/components/input/Input';
import { cn } from '@/core/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AccountSettingsValues {
  firstName: string;
  lastName: string;
  email: string;
  /** Base64 or URL of the profile picture */
  avatarUrl?: string;
}

export interface AccountSettingsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Initial (saved) field values */
  initialValues?: Partial<AccountSettingsValues>;
  /** Called with updated values when the user clicks Save changes */
  onSave?: (values: AccountSettingsValues) => void;
  /** Called when the user clicks the "Delete account" link */
  onDeleteAccount?: () => void;
  className?: string;
}

// ─── AccountSettingsModal ─────────────────────────────────────────────────────

/**
 * AccountSettingsModal — edit profile picture, name, email.
 * Save/Clear buttons appear only when a field has been changed.
 *
 * ```tsx
 * <AccountSettingsModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   initialValues={{ firstName: 'Denny', lastName: 'Satria', email: 'denny@palmcode.com' }}
 *   onSave={handleSave}
 *   onDeleteAccount={() => setDeleteOpen(true)}
 * />
 * ```
 */
export function AccountSettingsModal({
  open,
  onOpenChange,
  initialValues = {},
  onSave,
  onDeleteAccount,
  className,
}: AccountSettingsModalProps) {
  const defaults: AccountSettingsValues = {
    firstName: initialValues.firstName ?? '',
    lastName: initialValues.lastName ?? '',
    email: initialValues.email ?? '',
    avatarUrl: initialValues.avatarUrl,
  };

  const [values, setValues] = React.useState<AccountSettingsValues>(defaults);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  // Reset when dialog opens
  React.useEffect(() => {
    if (open) {
      setValues({
        firstName: initialValues.firstName ?? '',
        lastName: initialValues.lastName ?? '',
        email: initialValues.email ?? '',
        avatarUrl: initialValues.avatarUrl,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isDirty =
    values.firstName !== (initialValues.firstName ?? '') ||
    values.lastName !== (initialValues.lastName ?? '') ||
    values.email !== (initialValues.email ?? '') ||
    values.avatarUrl !== initialValues.avatarUrl;

  function handleField<K extends keyof AccountSettingsValues>(
    key: K,
    val: AccountSettingsValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleClear() {
    setValues(defaults);
  }

  function handleSave() {
    onSave?.(values);
    onOpenChange?.(false);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleField('avatarUrl', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
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
            'bg-background w-full max-w-lg rounded-3xl px-8 pt-6 pb-8 shadow-xl outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'flex flex-col gap-6 duration-200',
            className,
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-foreground text-xl font-semibold">
              Account settings
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

          {/* ── Profile picture ── */}
          <div className="flex flex-col gap-2">
            <label className="text-foreground text-sm font-medium">Profile Picture</label>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="bg-secondary flex size-28 items-center justify-center overflow-hidden rounded-2xl transition-opacity hover:opacity-80"
            >
              {values.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.avatarUrl} alt="Profile" className="size-full object-cover" />
              ) : (
                <UserRound className="text-muted-foreground size-10 stroke-[1.25]" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* ── Name row ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-medium">First name</label>
              <Input
                value={values.firstName}
                onChange={(e) => handleField('firstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-medium">Last name</label>
              <Input
                value={values.lastName}
                onChange={(e) => handleField('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          {/* ── Email ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">email</label>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => handleField('email', e.target.value)}
              placeholder="email"
            />
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            {isDirty ? (
              <>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleClear}
                  className="rounded-xl px-5"
                >
                  Clear changes
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  onClick={handleSave}
                  className="rounded-xl px-5"
                >
                  Save changes
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="default" disabled className="rounded-xl px-5">
                Save changes
              </Button>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="border-border border-t" />

          {/* ── Delete account section ── */}
          <div className="flex flex-col gap-1.5">
            <p className="text-foreground text-sm font-semibold">Delete account</p>
            <p className="text-muted-foreground text-sm">
              This will permanently delete your account and all its content.
            </p>
            <button
              type="button"
              onClick={onDeleteAccount}
              className="text-destructive w-fit text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              Delete account
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
