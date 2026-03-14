'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/core/components/button';
import { EmptyState } from '@/core/components/empty_state';
import { Input } from '@/core/components/input';
import { Skeleton } from '@/core/components/skeleton';
import { useAdminPackages } from '@/features/packages/react-query/use-admin-packages';
import { usePackagesColumns } from '@/features/packages/react-table/use-packages-columns';
import { usePackagesStore } from '@/features/packages/store/packages.store';

// Render N placeholder rows while data is loading
const SKELETON_ROWS = 5;

// ── TablePackages ──────────────────────────────────────────────────────────────
// Self-contained section: fetches packages, renders TanStack table with
// client-side search + sort, triggers Zustand store for modal/dialog flows.
// No props from container — all communication via usePackagesStore.
export function TablePackages() {
  const t = useTranslations('packages');
  const { packages, isLoading } = useAdminPackages();
  const columns = usePackagesColumns();
  const openCreateModal = usePackagesStore((s) => s.openCreateModal);

  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: packages,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <Button variant="default" onClick={openCreateModal}>
          <Plus className="size-4" />
          {t('addPackage')}
        </Button>
      </div>

      {/* ── Search ── */}
      <Input
        placeholder={t('table.search')}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
        aria-label={t('table.search')}
      />

      {/* ── Table ── */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
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
              // Loading skeleton rows
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="border-b" aria-label="loading-row">
                  {Array.from({ length: columns.length }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="px-4 py-10">
                  <EmptyState title={t('empty.title')} description={t('empty.description')} />
                </td>
              </tr>
            ) : (
              // Data rows
              table.getRowModel().rows.map((row) => (
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
    </div>
  );
}
