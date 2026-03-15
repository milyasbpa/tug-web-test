'use client';

import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button, type ButtonProps } from '@/core/components/button/Button';
import { cn } from '@/core/lib/utils';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Main confirmation message shown in the dialog body */
  message: string;
  /** Label for the cancel button. Defaults to "Cancel" */
  cancelLabel?: string;
  /** Label for the confirm button. Defaults to "Continue" */
  confirmLabel?: string;
  /** Called when the user clicks the cancel button */
  onCancel?: () => void;
  /** Called when the user clicks the confirm button */
  onConfirm?: () => void;
  /** Disables the confirm button (e.g. while a mutation is in-flight) */
  confirmDisabled?: boolean;
  /** Variant for the confirm button. Defaults to "primary" */
  confirmVariant?: ButtonProps['variant'];
  className?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Continue',
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmVariant = 'primary',
  className,
}: ConfirmationDialogProps) {
  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  function handleConfirm() {
    onConfirm?.();
    onOpenChange(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2',
            'flex flex-col items-center gap-6 rounded-2xl border px-6 pt-6 pb-6 shadow-lg duration-200 outline-none',
            className,
          )}
        >
          {/* Message */}
          <p className="text-foreground text-center text-base leading-snug font-medium">
            {message}
          </p>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-xl"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={confirmVariant}
              size="lg"
              className="flex-1 rounded-xl"
              onClick={handleConfirm}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
