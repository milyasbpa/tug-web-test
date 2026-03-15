'use client';

import { flexRender, type HeaderGroup, type Row } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { EmptyState } from '@/core/components/empty_state';
import { Pagination } from '@/core/components/pagination';
import { PaginationInfo } from '@/core/components/pagination_info';
import { RowsPerPage } from '@/core/components/rows_per_page';
import { Skeleton } from '@/core/components/skeleton';
import { LIMIT_OPTIONS } from '@/core/lib/constants';

interface PaginationLabels {
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
  const from = pagination
    ? pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1
    : 0;
  const to = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <div>
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
          <RowsPerPage
            value={pagination.limit}
            options={LIMIT_OPTIONS}
            onChange={pagination.onLimitChange}
            label={pagination.labels.rowsPerPage}
            disabled={isLoading}
          />

          {/* Showing X–Y of Z */}
          <PaginationInfo from={from} to={to} total={pagination.total} />

          {/* Page number pagination */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            isLoading={isLoading}
            labels={{ prev: pagination.labels.prev, next: pagination.labels.next }}
          />
        </div>
      )}
    </div>
  );
}
