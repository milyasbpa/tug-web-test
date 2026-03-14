'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ─── Variants ─────────────────────────────────────────────────────────────────

const switchVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=unchecked]:bg-border',
    'data-[state=checked]:bg-brand',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        default: 'h-6 w-11',
        lg: 'h-7 w-13',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

const thumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-white shadow-sm',
    'transition-transform duration-200',
    'data-[state=unchecked]:translate-x-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'size-4 data-[state=checked]:translate-x-4',
        default: 'size-5 data-[state=checked]:translate-x-5',
        lg: 'size-6 data-[state=checked]:translate-x-6',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends
    Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, 'children'>,
    VariantProps<typeof switchVariants> {
  /** Optional label rendered to the right of the switch */
  label?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Switch — a styled toggle built on radix-ui Switch primitive.
 *
 * ```tsx
 * <Switch defaultChecked />
 * <Switch checked={enabled} onCheckedChange={setEnabled} label="Enable notifications" />
 * ```
 */
export function Switch({ size, label, className, wrapperClassName, id, ...props }: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  return (
    <div className={cn('flex items-center gap-2.5', wrapperClassName)}>
      <SwitchPrimitive.Root
        data-slot="switch"
        id={switchId}
        className={cn(switchVariants({ size }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
      </SwitchPrimitive.Root>

      {label && (
        <label
          htmlFor={switchId}
          className={cn(
            'text-foreground cursor-pointer text-sm leading-none font-medium select-none',
            props.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
