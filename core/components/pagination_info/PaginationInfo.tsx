'use client';

import * as React from 'react';

import { cn } from '@/core/lib/utils';

export interface PaginationInfoProps {
  /** First item index on the current page (1-based). Pass 0 when there are no results. */
  from: number;
  /** Last item index on the current page (1-based). */
  to: number;
  /** Total number of items across all pages. */
  total: number;
  /**
   * Override the rendered text — useful for i18n.
   * If omitted, falls back to the default English template.
   */
  label?: string;
  className?: string;
}

export function PaginationInfo({ from, to, total, label, className }: PaginationInfoProps) {
  const text = label ?? `Showing ${from}–${to} of ${total}`;

  return (
    <span className={cn('text-muted-foreground text-sm tabular-nums', className)}>{text}</span>
  );
}
