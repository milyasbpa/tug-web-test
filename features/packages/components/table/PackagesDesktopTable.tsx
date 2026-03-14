'use client';

import { flexRender, type HeaderGroup, type Row } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { EmptyState } from '@/core/components/empty_state';
import { Skeleton } from '@/core/components/skeleton';

interface Props {
  headerGroups: HeaderGroup<PackageResponseDto>[];
  rows: Row<PackageResponseDto>[];
  isLoading: boolean;
  columnCount: number;
  skeletonRows?: number;
  emptyTitle: string;
  emptyDescription: string;
}

export function PackagesDesktopTable({
  headerGroups,
  rows,
  isLoading,
  columnCount,
  skeletonRows = 5,
  emptyTitle,
  emptyDescription,
}: Props) {
  return (
    <div className="hidden rounded-md border md:block">
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
  );
}
