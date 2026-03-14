'use client';

import { X, CircleCheck } from 'lucide-react';
import Image from 'next/image';
import { Dialog as DialogPrimitive, RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';
import { cn } from '@/core/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanPrice {
  /** Full price before discount, e.g. "$49" — shown with strikethrough */
  original?: string;
  /** Effective price, e.g. "$39/mo" */
  effective: string;
}

export interface SubscriptionPlan {
  id: string;
  /** Plan name */
  name: string;
  /** Optional badge displayed next to the name, e.g. a ⭐ emoji */
  badge?: React.ReactNode;
  /** Pricing per billing cycle */
  pricing: Partial<Record<BillingCycle, PlanPrice>>;
  /** Feature list shown in the detail panel when this plan is selected */
  features?: string[];
  /** Short description shown in the detail panel */
  description?: string;
  /** Heading shown in the detail panel */
  detailTitle?: string;
}

export interface SubscriptionPlanModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Plans to display */
  plans?: SubscriptionPlan[];
  /** Currently selected plan id */
  selectedPlanId?: string;
  onPlanChange?: (planId: string) => void;
  /** Billing cycle */
  billingCycle?: BillingCycle;
  onBillingCycleChange?: (cycle: BillingCycle) => void;
  /** Label for the monthly toggle option */
  monthlyLabel?: string;
  /** Label for the yearly toggle option */
  yearlyLabel?: string;
  /** Yearly discount badge label, e.g. "25% off" */
  yearlyDiscountLabel?: string;
  /** CTA button label */
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** "See full plan comparison" link  */
  onComparisonClick?: () => void;
  /** Right-panel image URL */
  heroImageUrl?: string;
  /** Testimonial quote on the right panel */
  testimonialQuote?: string;
  /** Testimonial attribution */
  testimonialAuthor?: string;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    pricing: {
      monthly: { original: '$19', effective: '$19/mo' },
      yearly: { original: '$19', effective: '$15/mo' },
    },
    detailTitle: 'Perfect for testing',
    description: 'Get product-ready images in minutes',
    features: [
      '10 photoshoots monthly',
      '250 AI-generated images',
      'Basic refine',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    badge: '⭐',
    pricing: {
      monthly: { original: '$49', effective: '$49/mo' },
      yearly: { original: '$49', effective: '$39/mo' },
    },
    detailTitle: 'Perfect for testing',
    description: 'Get product-ready images in minutes',
    features: [
      '50 photoshoots monthly',
      '1250 AI-generated images',
      'Unlimited refine',
      'Priority email + live chat support',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    pricing: {
      monthly: { effective: 'Contact sales' },
      yearly: { effective: 'Contact sales' },
    },
    detailTitle: 'Built for scale',
    description: 'Custom volumes and dedicated support',
    features: [
      'Unlimited photoshoots',
      'Unlimited AI-generated images',
      'Unlimited refine',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface BillingToggleProps {
  value: BillingCycle;
  onChange: (v: BillingCycle) => void;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlyDiscountLabel?: string;
}

function BillingToggle({
  value,
  onChange,
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  yearlyDiscountLabel = '25% off',
}: BillingToggleProps) {
  const options: { cycle: BillingCycle; label: string }[] = [
    { cycle: 'monthly', label: monthlyLabel },
    { cycle: 'yearly', label: yearlyLabel },
  ];

  return (
    <div className="bg-secondary inline-flex rounded-full p-1 text-sm font-medium">
      {options.map(({ cycle, label }) => {
        const isActive = value === cycle;
        const showBadge = cycle === 'yearly' && yearlyDiscountLabel;

        return (
          <button
            key={cycle}
            type="button"
            onClick={() => onChange(cycle)}
            className={cn(
              'relative inline-flex items-center justify-center rounded-full px-5 py-1.5 transition-colors duration-150',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            {showBadge && (
              <span className="bg-brand text-brand-foreground absolute -top-2.5 -right-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-semibold">
                {yearlyDiscountLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface PlanRowProps {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  isSelected: boolean;
}

function PlanRow({ plan, cycle, isSelected }: PlanRowProps) {
  const pricing = plan.pricing[cycle];

  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      {/* Radio circle */}
      <RadioGroupPrimitive.Item
        value={plan.id}
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 outline-none',
          'focus-visible:ring-ring/50 focus-visible:ring-2',
          isSelected ? 'border-brand bg-background' : 'border-border bg-background',
        )}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="bg-brand size-2 rounded-full" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      {/* Name + badge */}
      <span className="text-foreground flex flex-1 items-center gap-1.5 text-sm font-medium">
        {plan.name}
        {plan.badge && <span className="text-base leading-none">{plan.badge}</span>}
      </span>

      {/* Pricing */}
      {pricing && (
        <span className="flex items-baseline gap-1.5 text-sm">
          {pricing.original && (
            <span className="text-muted-foreground line-through">{pricing.original}</span>
          )}
          <span className="text-foreground font-medium">{pricing.effective}</span>
        </span>
      )}
    </label>
  );
}

interface PlanDetailProps {
  plan: SubscriptionPlan;
  onComparisonClick?: () => void;
}

function PlanDetail({ plan, onComparisonClick }: PlanDetailProps) {
  return (
    <div className="border-border bg-background rounded-xl border p-4">
      {plan.detailTitle && (
        <p className="text-foreground mb-0.5 text-sm font-semibold">{plan.detailTitle}</p>
      )}
      {plan.description && <p className="text-muted-foreground mb-3 text-sm">{plan.description}</p>}
      {plan.features && plan.features.length > 0 && (
        <ul className="flex flex-col gap-2">
          {plan.features.map((feat, i) => (
            <li key={i} className="text-foreground flex items-center gap-2 font-mono text-sm">
              <CircleCheck className="text-brand size-4 shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
      )}
      {onComparisonClick && (
        <button
          type="button"
          onClick={onComparisonClick}
          className="text-foreground mt-4 text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
        >
          See full plan comparison
        </button>
      )}
    </div>
  );
}

// ─── SubscriptionPlanModal ────────────────────────────────────────────────────

/**
 * SubscriptionPlanModal — split-panel plan selection dialog.
 *
 * ```tsx
 * <SubscriptionPlanModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   heroImageUrl="/promo/hero.jpg"
 *   onCtaClick={handleSubscribe}
 * />
 * ```
 */
export function SubscriptionPlanModal({
  open,
  onOpenChange,
  plans = DEFAULT_PLANS,
  selectedPlanId,
  onPlanChange,
  billingCycle = 'yearly',
  onBillingCycleChange,
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  yearlyDiscountLabel = '25% off',
  ctaLabel = 'Get started',
  onCtaClick,
  onComparisonClick,
  heroImageUrl,
  testimonialQuote = 'Finally, my product images look cohesive across 200 SKUs. No more inconsistent lighting or messy backgrounds.',
  testimonialAuthor = 'Jake Morrison, Creative Director Byredo',
}: SubscriptionPlanModalProps) {
  const [internalCycle, setInternalCycle] = React.useState<BillingCycle>(billingCycle);
  const [internalPlanId, setInternalPlanId] = React.useState<string>(
    selectedPlanId ?? plans[1]?.id ?? plans[0]?.id ?? '',
  );

  const cycle = billingCycle ?? internalCycle;
  const activePlanId = selectedPlanId ?? internalPlanId;
  const activePlan = plans.find((p) => p.id === activePlanId) ?? plans[0];

  function handleCycleChange(c: BillingCycle) {
    setInternalCycle(c);
    onBillingCycleChange?.(c);
  }

  function handlePlanChange(id: string) {
    setInternalPlanId(id);
    onPlanChange?.(id);
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
            'bg-background flex h-170 w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          {/* ── Left panel ── */}
          <div className="flex w-90 shrink-0 flex-col overflow-y-auto">
            {/* Close button */}
            <div className="flex items-start px-6 pt-5">
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="border-border bg-background text-muted-foreground hover:bg-accent flex size-8 items-center justify-center rounded-full border transition-colors"
                >
                  <X className="size-4" />
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Billing toggle */}
            <div className="flex justify-center px-6 py-5">
              <BillingToggle
                value={cycle}
                onChange={handleCycleChange}
                monthlyLabel={monthlyLabel}
                yearlyLabel={yearlyLabel}
                yearlyDiscountLabel={yearlyDiscountLabel}
              />
            </div>

            {/* Plan list */}
            <div className="px-6">
              <div className="border-border overflow-hidden rounded-xl border">
                <RadioGroupPrimitive.Root
                  value={activePlanId}
                  onValueChange={handlePlanChange}
                  className="divide-border divide-y"
                >
                  {plans.map((plan) => (
                    <div key={plan.id} className="px-4 py-3.5">
                      <PlanRow plan={plan} cycle={cycle} isSelected={plan.id === activePlanId} />
                    </div>
                  ))}
                </RadioGroupPrimitive.Root>
              </div>
            </div>

            {/* Plan detail */}
            {activePlan && (
              <div className="px-6 pt-4">
                <PlanDetail plan={activePlan} onComparisonClick={onComparisonClick} />
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* CTA */}
            <div className="px-6 pt-4 pb-6">
              <Button
                variant="primary"
                size="lg"
                onClick={onCtaClick}
                className="w-full rounded-xl text-base"
              >
                {ctaLabel}
              </Button>
            </div>
          </div>

          {/* ── Right panel — hero image with testimonial ── */}
          <div className="relative flex-1 overflow-hidden">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt="Subscription hero"
                fill
                className="object-cover"
                sizes="420px"
              />
            ) : (
              <div className="bg-muted size-full" />
            )}

            {/* Testimonial overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-8 pt-20 pb-8">
              {testimonialQuote && (
                <p className="mb-3 text-center text-lg leading-snug font-semibold text-white">
                  {testimonialQuote}
                </p>
              )}
              {testimonialAuthor && (
                <p className="text-center text-sm text-white/70">{testimonialAuthor}</p>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
