'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { PackagesMobileCards } from '@/features/packages/components/cards';
import { PackagesDesktopTable } from '@/features/packages/components/table';
import { useAdminPackages } from '@/features/packages/react-query/use-admin-packages';
import { usePackagesColumns } from '@/features/packages/react-table/use-packages-columns';
import { usePackagesStore } from '@/features/packages/store/packages.store';

const SKELETON_ROWS = 5;

export function TablePackages() {
  const t = useTranslations('packages');
  const { packages, isLoading } = useAdminPackages();
  const columns = usePackagesColumns();
  const openCreateModal = usePackagesStore((s) => s.openCreateModal);
  const openEditModal = usePackagesStore((s) => s.openEditModal);
  const openDeleteDialog = usePackagesStore((s) => s.openDeleteDialog);

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

  const rows = table.getRowModel().rows;

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
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
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
      />

      <PackagesMobileCards
        packages={rows.map((r) => r.original)}
        isLoading={isLoading}
        skeletonRows={SKELETON_ROWS}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
        labels={{
          edit: t('editPackage'),
          delete: t('deletePackage'),
          emptyTitle: t('empty.title'),
          emptyDescription: t('empty.description'),
        }}
      />
    </div>
  );
}
