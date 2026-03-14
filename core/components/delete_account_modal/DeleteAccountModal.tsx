'use client';

import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';
import { Input } from '@/core/components/input/Input';
import { cn } from '@/core/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DeleteAccountModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * The email address the user must type to confirm deletion.
   * If omitted the confirmation input is hidden and Delete is always enabled.
   */
  confirmationEmail?: string;
  /** Override the warning subtitle */
  warningText?: string;
  /** Override the cancel button label */
  cancelLabel?: string;
  /** Override the delete button label */
  deleteLabel?: string;
  /** Called when the user clicks Cancel */
  onCancel?: () => void;
  /** Called when the user clicks Delete (only fires when input matches) */
  onDelete?: () => void;
  className?: string;
}

// ─── DeleteAccountModal ───────────────────────────────────────────────────────

/**
 * DeleteAccountModal — destructive confirmation dialog that requires the user
 * to type their email address before the Delete button becomes active.
 *
 * ```tsx
 * <DeleteAccountModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   confirmationEmail="denny@palmcode.com"
 *   onDelete={handleDeleteAccount}
 * />
 * ```
 */
export function DeleteAccountModal({
  open,
  onOpenChange,
  confirmationEmail,
  warningText = 'This will permanently delete your account and all its content.',
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  onCancel,
  onDelete,
  className,
}: DeleteAccountModalProps) {
  const [inputValue, setInputValue] = React.useState('');

  const isConfirmed = confirmationEmail ? inputValue.trim() === confirmationEmail.trim() : true;

  function handleCancel() {
    setInputValue('');
    onCancel?.();
    onOpenChange?.(false);
  }

  function handleDelete() {
    if (!isConfirmed) return;
    onDelete?.();
    onOpenChange?.(false);
    setInputValue('');
  }

  // Reset input when dialog closes
  function handleOpenChange(next: boolean) {
    if (!next) setInputValue('');
    onOpenChange?.(next);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'bg-background w-full max-w-sm rounded-2xl border px-6 pt-6 pb-6 shadow-lg outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'flex flex-col gap-5 duration-200',
            className,
          )}
        >
          {/* ── Heading ── */}
          <div className="flex flex-col gap-1.5">
            <DialogPrimitive.Title className="text-foreground text-base leading-snug font-semibold">
              Are you sure you want to delete your account?
            </DialogPrimitive.Title>
            <p className="text-destructive text-sm leading-snug">{warningText}</p>
          </div>

          {/* ── Confirmation input ── */}
          {confirmationEmail && (
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-sm">
                Type <span className="text-foreground font-medium">{confirmationEmail}</span> to
                confirm.
              </label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={confirmationEmail}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-xl"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              disabled={!isConfirmed}
              className="flex-1 rounded-xl"
              onClick={handleDelete}
            >
              {deleteLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
