'use client';

import { X, Mail } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';
import { cn } from '@/core/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface EmailVerificationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** New email address to verify — shown bolded in the description */
  email?: string;
  /** Override modal title */
  title?: string;
  /** Override description. If omitted, a default is generated using `email`. */
  description?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Send verification button label */
  sendLabel?: string;
  /** Called when Cancel is clicked */
  onCancel?: () => void;
  /** Called when Send verification is clicked */
  onSend?: () => void;
  className?: string;
}

// ─── EmailVerificationModal ───────────────────────────────────────────────────

/**
 * EmailVerificationModal — informs the user that a verification link will be
 * sent to their new email address before the change takes effect.
 *
 * ```tsx
 * <EmailVerificationModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   email="denny@google.com"
 *   onSend={handleSendVerification}
 * />
 * ```
 */
export function EmailVerificationModal({
  open,
  onOpenChange,
  email,
  title = 'Verify your new email',
  description,
  cancelLabel = 'Cancel',
  sendLabel = 'Send verification',
  onCancel,
  onSend,
  className,
}: EmailVerificationModalProps) {
  function handleCancel() {
    onCancel?.();
    onOpenChange?.(false);
  }

  function handleSend() {
    onSend?.();
    onOpenChange?.(false);
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
            'bg-background w-full max-w-md rounded-3xl px-8 pt-6 pb-8 shadow-xl outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'flex flex-col items-center gap-6 duration-200',
            className,
          )}
        >
          {/* Close button */}
          <div className="flex w-full justify-end">
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

          {/* Mail icon */}
          <div className="border-foreground flex items-center justify-center rounded-2xl border-2 p-5">
            <Mail className="size-16 stroke-[1.5]" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2 text-center">
            <DialogPrimitive.Title className="text-foreground text-2xl font-semibold">
              {title}
            </DialogPrimitive.Title>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description ?? (
                <>
                  We&apos;ll send a verification link to your new email address
                  {email && (
                    <>
                      {' '}
                      (<span className="text-foreground font-semibold">{email}</span>)
                    </>
                  )}
                  . Your email will only be updated after you confirm.
                </>
              )}
            </p>
          </div>

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
            <Button variant="primary" size="lg" className="flex-1 rounded-xl" onClick={handleSend}>
              {sendLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
