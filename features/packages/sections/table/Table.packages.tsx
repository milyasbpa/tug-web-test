'use client';

import {
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
const DEFAULT_SORTING: SortingState = [{ id: 'createdAt', desc: true }];

export function TablePackages() {
  const t = useTranslations('packages');
  const columns = usePackagesColumns();
  const openCreateModal = usePackagesStore((s) => s.openCreateModal);
  const openEditModal = usePackagesStore((s) => s.openEditModal);
  const openDeleteDialog = usePackagesStore((s) => s.openDeleteDialog);

  // ── Server-side params ──────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  // Debounce search input → reset to page 1 when value settles
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Derived API sort params from TanStack sorting state
  const sortBy = sorting[0]?.id as SortByValue | undefined;
  const sortOrder: SortOrderValue = sorting[0]?.desc ? 'desc' : 'asc';

  // Common filter/sort params shared between pagination (desktop) and infinite (mobile) queries
  const filterParams: AdminPackagesControllerFindAllV1Params = {
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(sortBy ? { sortBy } : {}),
    sortOrder,
  };

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const { packages, meta, isLoading } = useAdminPackages({ page, ...filterParams });

  const {
    packages: mobilePackages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMobileLoading,
  } = useAdminPackagesInfinite(filterParams);

  // ── Sort handler ────────────────────────────────────────────────────────────
  // When TanStack clears sorting (3rd click), reset to DEFAULT_SORTING instead of staying stuck
  const handleSortingChange = (updater: Updater<SortingState>) => {
    setSorting((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next.length > 0 ? next : DEFAULT_SORTING;
    });
    setPage(1);
  };

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

  // ── Pagination display ──────────────────────────────────────────────────────
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
        aria-label={t('table.search')}
      />

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
          onPageChange: setPage,
          onLimitChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
          labels: {
            rowsPerPage: t('pagination.rowsPerPage'),
            prev: t('pagination.prev'),
            next: t('pagination.next'),
          },
        }}
      />

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
    </div>
  );
}
