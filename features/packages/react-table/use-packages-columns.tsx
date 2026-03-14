'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { Button } from '@/core/components/button';
import { usePackagesStore } from '@/features/packages/store/packages.store';
import { formatDuration, formatPrice } from '@/features/packages/utils/packages.utils';

// ── usePackagesColumns ─────────────────────────────────────────────────────────
// Hook that returns TanStack column definitions for the packages table.
// Called inside the TablePackages component so hooks (useTranslations,
// usePackagesStore) are called in a valid React context.
export function usePackagesColumns(): ColumnDef<PackageResponseDto>[] {
  const t = useTranslations('packages');

  // Close over store actions so cell renderers don't need to call hooks themselves
  const openEditModal = usePackagesStore((s) => s.openEditModal);
  const openDeleteDialog = usePackagesStore((s) => s.openDeleteDialog);

  return [
    {
      accessorKey: 'name',
      header: () => t('table.name'),
    },
    {
      accessorKey: 'description',
      header: () => t('table.description'),
    },
    {
      accessorKey: 'price',
      header: () => t('table.price'),
      cell: ({ row }) => formatPrice(row.original.price),
    },
    {
      accessorKey: 'durationMinutes',
      header: () => t('table.duration'),
      cell: ({ row }) => formatDuration(row.original.durationMinutes),
    },
    {
      accessorKey: 'createdAt',
      header: () => t('table.createdAt'),
      cell: ({ row }) =>
        new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
          new Date(row.original.createdAt),
        ),
    },
    {
      id: 'actions',
      header: () => t('table.actions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(row.original)}
            aria-label={`Edit ${row.original.name}`}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => openDeleteDialog(row.original)}
            aria-label={`Delete ${row.original.name}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
}
