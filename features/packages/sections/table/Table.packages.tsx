'use client';

import {
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useDebounceValue, useMediaQuery } from 'usehooks-ts';

import type { AdminPackagesControllerFindAllV1Params } from '@/core/api/generated/nestjsStarter.schemas';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { DEFAULT_LIMIT } from '@/core/lib/constants';
import { PackagesMobileCards } from '@/features/packages/components/cards';
import { PackagesDesktopTable } from '@/features/packages/components/table';
import { useAdminPackages } from '@/features/packages/react-query/use-admin-packages';
import { useAdminPackagesInfinite } from '@/features/packages/react-query/use-admin-packages-infinite';
import { usePackagesColumns } from '@/features/packages/react-table/use-packages-columns';
import { usePackagesStore } from '@/features/packages/store/packages.store';

type SortByValue = NonNullable<AdminPackagesControllerFindAllV1Params['sortBy']>;
type SortOrderValue = NonNullable<AdminPackagesControllerFindAllV1Params['sortOrder']>;

const SKELETON_ROWS = 5;
const DEFAULT_SORT_BY: SortByValue = 'createdAt';
const DEFAULT_SORT_ORDER: SortOrderValue = 'desc';
const DEFAULT_SORTING: SortingState = [{ id: DEFAULT_SORT_BY, desc: true }];

// Params that equal their default are removed from the URL to keep it clean
const PARAM_DEFAULTS: Record<string, string> = {
  page: '1',
  limit: String(DEFAULT_LIMIT),
  sortBy: DEFAULT_SORT_BY,
  sortOrder: DEFAULT_SORT_ORDER,
  search: '',
};

export function TablePackages() {
  const t = useTranslations('packages');
  const columns = usePackagesColumns();
  const openCreateModal = usePackagesStore((s) => s.openCreateModal);
  const openEditModal = usePackagesStore((s) => s.openEditModal);
  const openDeleteDialog = usePackagesStore((s) => s.openDeleteDialog);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Responsive ──────────────────────────────────────────────────────────────
  // isMounted avoids SSR hydration mismatch — render nothing until client knows screen size
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // ── URL state helpers ───────────────────────────────────────────────────────
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT));
  const sortBy = (searchParams.get('sortBy') ?? DEFAULT_SORT_BY) as SortByValue;
  const sortOrder = (searchParams.get('sortOrder') ?? DEFAULT_SORT_ORDER) as SortOrderValue;

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === PARAM_DEFAULTS[key]) params.delete(key);
      else params.set(key, value);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  // ── Search input ────────────────────────────────────────────────────────────
  // Keep local state for the input, debounce before writing to URL
  const [inputSearch, setInputSearch] = useState(() => searchParams.get('search') ?? '');
  const [debouncedSearch] = useDebounceValue(inputSearch, 400);

  const isFirstSearchRender = useRef(true);
  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    updateParams({ search: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // ── Derived sort state for TanStack ────────────────────────────────────────
  const sorting: SortingState = [{ id: sortBy, desc: sortOrder === 'desc' }];

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    const resolved = next.length > 0 ? next[0] : DEFAULT_SORTING[0];
    updateParams({
      sortBy: resolved.id,
      sortOrder: resolved.desc ? 'desc' : 'asc',
      page: '1',
    });
  };

  // ── Filter params ───────────────────────────────────────────────────────────
  const apiSearch = searchParams.get('search') ?? '';
  const filterParams: AdminPackagesControllerFindAllV1Params = {
    limit,
    ...(apiSearch ? { search: apiSearch } : {}),
    sortBy,
    sortOrder,
  };

  // ── Data hooks — only fetch the active view ─────────────────────────────────
  const { packages, meta, isLoading } = useAdminPackages(
    { page, ...filterParams },
    { enabled: isMounted && isDesktop },
  );

  const {
    packages: mobilePackages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMobileLoading,
  } = useAdminPackagesInfinite(filterParams, { enabled: isMounted && !isDesktop });

  // ── TanStack table (core model only — sorting/filtering are server-side) ────
  const table = useReactTable({
    data: packages,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
  });

  const rows = table.getRowModel().rows;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <Button variant="default" onClick={openCreateModal}>
          <Plus className="size-4" />
          {t('addPackage')}
        </Button>
      </div>

      <Input
        placeholder={t('table.search')}
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        className="max-w-sm"
        aria-label={t('table.search')}
      />

      {/* Render only the active view after mount to avoid double fetching */}
      {isMounted && isDesktop ? (
        <PackagesDesktopTable
          headerGroups={table.getHeaderGroups()}
          rows={rows}
          isLoading={isLoading}
          columnCount={columns.length}
          skeletonRows={SKELETON_ROWS}
          emptyTitle={t('empty.title')}
          emptyDescription={t('empty.description')}
          pagination={{
            page,
            totalPages,
            total,
            limit,
            onPageChange: (p) => updateParams({ page: String(p) }),
            onLimitChange: (newLimit) => updateParams({ limit: String(newLimit), page: '1' }),
            labels: {
              rowsPerPage: t('pagination.rowsPerPage'),
              prev: t('pagination.prev'),
              next: t('pagination.next'),
            },
          }}
        />
      ) : isMounted ? (
        <PackagesMobileCards
          packages={mobilePackages}
          isLoading={isMobileLoading}
          skeletonRows={SKELETON_ROWS}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          onLoadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          labels={{
            edit: t('editPackage'),
            delete: t('deletePackage'),
            emptyTitle: t('empty.title'),
            emptyDescription: t('empty.description'),
            loadingMore: t('pagination.loadingMore'),
          }}
        />
      ) : null}
    </div>
  );
}
