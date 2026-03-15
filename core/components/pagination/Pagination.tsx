'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

import { Button } from '../button/Button';

function generatePages(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  const rangeStart = Math.max(2, page - 1);
  const rangeEnd = Math.min(totalPages - 1, page + 1);

  if (rangeStart > 2) pages.push('...');

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) pages.push('...');

  pages.push(totalPages);

  return pages;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  labels?: {
    prev?: string;
    next?: string;
  };
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  labels = {},
  className,
}: PaginationProps) {
  const { prev = 'Previous', next = 'Next' } = labels;

  if (totalPages <= 1) return null;

  const pages = generatePages(page, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('flex items-center gap-1', className)}
    >
      {/* Previous */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isLoading}
        aria-label={prev}
        className="gap-1 px-2"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">{prev}</span>
      </Button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="text-muted-foreground flex size-8 items-center justify-center text-sm"
            aria-hidden
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
            disabled={isLoading}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className="size-8 p-0"
          >
            {p}
          </Button>
        ),
      )}

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || isLoading}
        aria-label={next}
        className="gap-1 px-2"
      >
        <span className="hidden sm:inline">{next}</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
