import * as React from 'react';
import {
  useFormContext,
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/core/lib/utils';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  label?: string;
  description?: string;
  className?: string;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  className,
  name,
  control,
  render,
  ...rest
}: FormFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          {label && (
            <label
              htmlFor={name}
              className="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {/* Pass aria-invalid so Input styles apply the error ring */}
          <div aria-invalid={!!fieldState.error}>
            {render({ field, fieldState, formState: formContext?.formState ?? ({} as never) })}
          </div>
          {description && !fieldState.error && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          {fieldState.error && (
            <p className="text-destructive text-xs">{fieldState.error.message}</p>
          )}
        </div>
      )}
      {...rest}
    />
  );
}
