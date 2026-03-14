'use client';

import { X, CreditCard } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';
import { cn } from '@/core/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BillingPlanModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Current plan name, e.g. "Starter" */
  planName?: string;
  /** Displayed price string, e.g. "$15/mo" */
  planPrice?: string;
  /** Next bill amount string, e.g. "Rp1,920,000" */
  nextBillAmount?: string;
  /** Next bill date string, e.g. "Feb 20, 2026" */
  nextBillDate?: string;
  /** Last 4 digits of the card on file */
  cardLastFour?: string;
  /** Called when "See billing details" is clicked */
  onSeeBillingDetails?: () => void;
  /** Called when "Manage Subscription" button is clicked */
  onManageSubscription?: () => void;
  /** Called when "Pricing page" link is clicked */
  onPricingPage?: () => void;
  className?: string;
}

// ─── BillingPlanModal ─────────────────────────────────────────────────────────

/**
 * BillingPlanModal — shows the current plan, next billing info and a
 * Manage Subscription CTA.
 *
 * ```tsx
 * <BillingPlanModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   planName="Starter"
 *   planPrice="$15/mo"
 *   nextBillAmount="Rp1,920,000"
 *   nextBillDate="Feb 20, 2026"
 *   cardLastFour="8334"
 *   onManageSubscription={handleManage}
 * />
 * ```
 */
export function BillingPlanModal({
  open,
  onOpenChange,
  planName = 'Starter',
  planPrice = '$15/mo',
  nextBillAmount,
  nextBillDate,
  cardLastFour,
  onSeeBillingDetails,
  onManageSubscription,
  onPricingPage,
  className,
}: BillingPlanModalProps) {
  const showBillingInfo = nextBillAmount || nextBillDate || cardLastFour;

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
            'bg-background w-full max-w-sm rounded-3xl px-7 pt-6 pb-7 shadow-xl outline-none',
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
              Plan &amp; Billing
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

          {/* ── Current plan ── */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Your plan</p>
            <p className="text-foreground text-2xl leading-tight font-semibold">{planName}</p>
            <p className="text-muted-foreground text-sm">{planPrice}</p>
          </div>

          {/* ── Billing info box ── */}
          {showBillingInfo && (
            <div className="flex flex-col gap-2 rounded-xl bg-blue-50 px-4 py-3">
              <div className="flex gap-3">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-blue-500" />
                <p className="text-foreground text-sm leading-relaxed">
                  {nextBillAmount && nextBillDate && cardLastFour ? (
                    <>
                      Your next bill of <span className="font-medium">{nextBillAmount}</span> will
                      be charged on <span className="font-bold">{nextBillDate}</span> to your card
                      ending in <span className="font-medium">•••• {cardLastFour}</span>.
                    </>
                  ) : (
                    <>
                      {nextBillAmount && (
                        <>
                          Your next bill of <span className="font-medium">{nextBillAmount}</span>.
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
              {onSeeBillingDetails && (
                <button
                  type="button"
                  onClick={onSeeBillingDetails}
                  className="text-foreground w-fit pl-7 text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  See billing details
                </button>
              )}
            </div>
          )}

          {/* ── Manage Subscription CTA ── */}
          <Button
            variant="primary"
            size="lg"
            onClick={onManageSubscription}
            className="w-full rounded-xl text-base"
          >
            Manage Subscription
          </Button>

          {/* ── Pricing page link ── */}
          <p className="text-muted-foreground text-center text-sm">
            View all plans &amp; features on the{' '}
            <button
              type="button"
              onClick={onPricingPage}
              className="text-foreground font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              Pricing page.
            </button>
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
