'use client';

import { flexRender, type HeaderGroup, type Row } from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown } from 'lucide-react';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { Button } from '@/core/components/button';
import { EmptyState } from '@/core/components/empty_state';
import { Skeleton } from '@/core/components/skeleton';

const LIMIT_OPTIONS = [10, 25, 50] as const;

interface PaginationLabels {
  showingText: string;
  rowsPerPage: string;
  prev: string;
  next: string;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  labels: PaginationLabels;
}

interface Props {
  headerGroups: HeaderGroup<PackageResponseDto>[];
  rows: Row<PackageResponseDto>[];
  isLoading: boolean;
  columnCount: number;
  skeletonRows?: number;
  emptyTitle: string;
  emptyDescription: string;
  pagination?: PaginationProps;
}

export function PackagesDesktopTable({
  headerGroups,
  rows,
  isLoading,
  columnCount,
  skeletonRows = 5,
  emptyTitle,
  emptyDescription,
  pagination,
}: Props) {
  return (
    <div className="hidden md:block">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-muted/50 border-b">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wide uppercase"
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={canSort ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-muted-foreground/60">
                              {sorted === 'asc' ? (
                                <ChevronUp className="size-3.5" />
                              ) : sorted === 'desc' ? (
                                <ChevronDown className="size-3.5" />
                              ) : (
                                <ChevronsUpDown className="size-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b" aria-label="loading-row">
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-10">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 border-b last:border-0">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Rows per page */}
          <div className="text-muted-foreground flex items-center gap-2">
            <span>{pagination.labels.rowsPerPage}</span>
            <select
              className="border-input bg-background rounded-md border px-2 py-1 text-sm"
              value={pagination.limit}
              onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
              aria-label={pagination.labels.rowsPerPage}
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Showing X–Y of Z */}
          <span className="text-muted-foreground">{pagination.labels.showingText}</span>

          {/* Prev / Next */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
              aria-label={pagination.labels.prev}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">{pagination.labels.prev}</span>
            </Button>
            <span className="text-muted-foreground px-1">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              aria-label={pagination.labels.next}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">{pagination.labels.next}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
