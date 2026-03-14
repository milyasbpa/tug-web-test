'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ─── Variants ─────────────────────────────────────────────────────────────────

const radioVariants = cva(
  [
    'aspect-square shrink-0 rounded-full border-2 transition-colors duration-150 outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // inactive
    'border-border bg-background',
    // active
    'data-[state=checked]:border-brand data-[state=checked]:bg-background',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'size-4',
        default: 'size-5',
        lg: 'size-6',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

const indicatorVariants = cva('rounded-full bg-brand transition-transform duration-150', {
  variants: {
    size: {
      sm: 'size-1.5',
      default: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: { size: 'default' },
});

// ─── RadioItem ────────────────────────────────────────────────────────────────

export interface RadioItemProps
  extends
    Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'>,
    VariantProps<typeof radioVariants> {
  /** Optional label rendered to the right of the radio */
  label?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

export function RadioItem({ size, label, className, wrapperClassName, ...props }: RadioItemProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 select-none',
        props.disabled && 'cursor-not-allowed opacity-50',
        wrapperClassName,
      )}
    >
      <RadioGroupPrimitive.Item
        data-slot="radio"
        className={cn(radioVariants({ size }), 'flex items-center justify-center', className)}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className={indicatorVariants({ size })} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      {label && <span className="text-foreground text-sm leading-none font-medium">{label}</span>}
    </label>
  );
}

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  /** Layout direction. Defaults to "vertical". */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * RadioGroup — wraps radix-ui RadioGroup with project styling.
 *
 * ```tsx
 * <RadioGroup defaultValue="a">
 *   <RadioItem value="a" label="Option A" />
 *   <RadioItem value="b" label="Option B" />
 * </RadioGroup>
 * ```
 */
export function RadioGroup({ className, orientation = 'vertical', ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4',
        className,
      )}
      {...props}
    />
  );
}
