import * as React from 'react';

import { cn } from '@/core/lib/utils';

const inputBase =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

export interface InputProps extends React.ComponentProps<'input'> {
  /** Icon or element shown on the left side inside the input */
  leftElement?: React.ReactNode;
  /** Icon or element shown on the right side inside the input */
  rightElement?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftElement, rightElement, wrapperClassName, ...props }, ref) => {
    if (!leftElement && !rightElement) {
      return (
        <input
          data-slot="input"
          ref={ref}
          className={cn(
            inputBase,
            'border-border h-12 rounded-xl px-4 text-sm shadow-none',
            'focus-visible:border-ring focus-visible:ring-0',
            className,
          )}
          {...props}
        />
      );
    }

    return (
      <div className={cn('relative flex items-center', wrapperClassName)}>
        {leftElement && (
          <span className="text-muted-foreground pointer-events-none absolute left-4 flex shrink-0 items-center [&_svg]:size-4">
            {leftElement}
          </span>
        )}
        <input
          data-slot="input"
          ref={ref}
          className={cn(
            inputBase,
            'border-border h-12 rounded-xl px-4 text-sm shadow-none',
            'focus-visible:border-ring focus-visible:ring-0',
            leftElement && 'pl-10',
            rightElement && 'pr-10',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <span className="text-muted-foreground absolute right-4 flex shrink-0 items-center [&_svg]:size-4">
            {rightElement}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
