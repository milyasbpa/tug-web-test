'use client';

import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/core/components/button';
import { EmptyState } from '@/core/components/empty_state';
import { Input } from '@/core/components/input';
import { Skeleton } from '@/core/components/skeleton';
import { cn } from '@/core/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<TData> {
  /** Unique column key — also used as object accessor if `getValue` is omitted */
  key: string;
  /** Column header label */
  header: string;
  /** Custom cell renderer */
  render?: (row: TData, index: number) => React.ReactNode;
  /** Custom sort value extractor — defaults to `row[key]` */
  getSortValue?: (row: TData) => string | number | boolean | null | undefined;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Column header / cell className */
  className?: string;
  /** Column header className */
  headerClassName?: string;
}

export interface TableProps<TData> {
  /** Column definitions */
  columns: ColumnDef<TData>[];
  /** Row data */
  data: TData[];
  /** Key extractor for rows — defaults to index */
  keyExtractor?: (row: TData, index: number) => string | number;
  /** Show search input above the table */
  searchable?: boolean;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Client-side search filter — receives each row and the query string */
  onFilter?: (row: TData, query: string) => boolean;
  /** Rows per page (0 = no pagination) */
  pageSize?: number;
  /** Show loading skeletons instead of rows */
  loading?: boolean;
  /** Number of skeleton rows shown when loading=true */
  loadingRows?: number;
  /** Message shown when data is empty */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  /** Extra className on the wrapper div */
  className?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function defaultFilter<TData>(row: TData, query: string): boolean {
  return JSON.stringify(row).toLowerCase().includes(query.toLowerCase());
}

function sortData<TData>(
  data: TData[],
  column: ColumnDef<TData> | undefined,
  direction: SortDirection,
): TData[] {
  if (!column || !direction) return data;
  return [...data].sort((a, b) => {
    const va = column.getSortValue
      ? column.getSortValue(a)
      : (a as Record<string, unknown>)[column.key];
    const vb = column.getSortValue
      ? column.getSortValue(b)
      : (b as Record<string, unknown>)[column.key];
    if (va == null) return 1;
    if (vb == null) return -1;
    const cmp = String(va).localeCompare(String(vb), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    return direction === 'asc' ? cmp : -cmp;
  });
}

// ── SortIcon ──────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === 'asc') return <ChevronUp className="size-3.5 shrink-0" />;
  if (direction === 'desc') return <ChevronDown className="size-3.5 shrink-0" />;
  return <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" />;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export function Table<TData>({
  columns,
  data,
  keyExtractor,
  searchable = false,
  searchPlaceholder = 'Search…',
  onFilter,
  pageSize = 10,
  loading = false,
  loadingRows = 5,
  emptyTitle = 'No results',
  emptyDescription,
  emptyIcon,
  className,
}: TableProps<TData>) {
  const [query, setQuery] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);

  // Reset page when query changes
  React.useEffect(() => setPage(1), [query]);

  // Filter
  const filterFn = onFilter ?? defaultFilter<TData>;
  const filtered = React.useMemo(
    () => (query ? data.filter((row) => filterFn(row, query)) : data),
    [data, query, filterFn],
  );

  // Sort
  const sortColumn = columns.find((c) => c.key === sortKey);
  const sorted = React.useMemo(
    () => sortData(filtered, sortColumn, sortDir),
    [filtered, sortColumn, sortDir],
  );

  // Paginate
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, totalPages);
  const paged =
    pageSize > 0 ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize) : sorted;

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Search */}
      {searchable && (
        <Input
          leftElement={<Search />}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
      )}

      {/* Table */}
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/50 border-b">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-muted-foreground px-4 py-3 text-left font-medium',
                    col.sortable && 'hover:text-foreground cursor-pointer select-none',
                    col.headerClassName,
                  )}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && <SortIcon direction={sortKey === col.key ? sortDir : null} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: loadingRows }).map((_, i) => (
                  <tr key={i} className="border-border border-b last:border-0">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <Skeleton className="h-4 w-full max-w-[160px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : paged.map((row, i) => (
                  <tr
                    key={keyExtractor ? keyExtractor(row, i) : i}
                    className="border-border hover:bg-muted/30 border-b transition-colors last:border-0"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('text-foreground px-4 py-3', col.className)}>
                        {col.render
                          ? col.render(row, i)
                          : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Empty state */}
        {!loading && paged.length === 0 && (
          <EmptyState
            {...(emptyIcon ? { icon: emptyIcon } : {})}
            title={emptyTitle}
            {...(emptyDescription ? { description: emptyDescription } : {})}
            className="rounded-none border-0"
          />
        )}
      </div>

      {/* Pagination */}
      {pageSize > 0 && totalPages > 1 && (
        <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
          <span>
            {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            {' · '}page {safePage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
