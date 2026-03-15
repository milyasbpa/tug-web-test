'use client';

import * as React from 'react';

import { cn } from '@/core/lib/utils';

export interface RowsPerPageProps {
  value: number;
  options: readonly number[];
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function RowsPerPage({
  value,
  options,
  onChange,
  label = 'Rows per page',
  disabled = false,
  className,
}: RowsPerPageProps) {
  return (
    <div className={cn('text-muted-foreground flex items-center gap-2 text-sm', className)}>
      <span>{label}</span>
      <select
        className="border-input bg-background rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
