import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: 'rounded-md bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'rounded-md bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        secondary: 'rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'rounded-md hover:bg-accent hover:text-accent-foreground',
        link: 'rounded-md text-primary underline-offset-4 hover:underline',
        primary: 'rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 active:scale-[0.98]',
        outline:
          'rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-6 gap-1 px-2 text-xs',
        sm: 'h-8 gap-1.5 px-3',
        lg: 'h-10 px-6',
        xl: 'h-12 px-8 text-base',
        icon: 'size-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
