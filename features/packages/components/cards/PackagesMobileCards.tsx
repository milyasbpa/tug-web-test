'use client';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { Button } from '@/core/components/button';
import { EmptyState } from '@/core/components/empty_state';
import { Skeleton } from '@/core/components/skeleton';
import { formatDuration, formatPrice } from '@/features/packages/utils/packages.utils';

interface Labels {
  edit: string;
  delete: string;
  emptyTitle: string;
  emptyDescription: string;
}

interface Props {
  packages: PackageResponseDto[];
  isLoading: boolean;
  skeletonRows?: number;
  onEdit: (pkg: PackageResponseDto) => void;
  onDelete: (pkg: PackageResponseDto) => void;
  labels: Labels;
}

export function PackagesMobileCards({
  packages,
  isLoading,
  skeletonRows = 5,
  onEdit,
  onDelete,
  labels,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {isLoading ? (
        Array.from({ length: skeletonRows }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4" aria-label="loading-row">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))
      ) : packages.length === 0 ? (
        <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        packages.map((pkg) => (
          <div key={pkg.id} className="space-y-2 rounded-lg border p-4">
            <p className="font-semibold">{pkg.name}</p>
            <p className="text-muted-foreground line-clamp-2 text-sm">{pkg.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>{formatPrice(pkg.price)}</span>
              <span>{formatDuration(pkg.durationMinutes)}</span>
              <span className="text-muted-foreground">
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                  new Date(pkg.createdAt),
                )}
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(pkg)}
                aria-label={`${labels.edit} ${pkg.name}`}
              >
                {labels.edit}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(pkg)}
                aria-label={`${labels.delete} ${pkg.name}`}
              >
                {labels.delete}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
