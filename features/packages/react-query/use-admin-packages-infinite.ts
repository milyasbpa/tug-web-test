// ── useAdminPackagesInfinite ───────────────────────────────────────────────────
// Infinite-scroll variant of useAdminPackages, built on TanStack's useInfiniteQuery.
//
// Used by PackagesMobileCards to auto-load the next page when the scroll sentinel
// becomes visible via IntersectionObserver (see PackagesMobileCards.tsx).
//
// Accepts the same filter/sort params as useAdminPackages (limit, search, sortBy,
// sortOrder) — page is managed internally as the pageParam.

import { useInfiniteQuery } from '@tanstack/react-query';

import { adminPackagesControllerFindAllV1 } from '@/core/api/generated/admin-packages/admin-packages';
import type {
  AdminPackagesControllerFindAllV1Params,
  PackageResponseDto,
} from '@/core/api/generated/nestjsStarter.schemas';

import type { PackagesMeta } from './use-admin-packages';

type InfiniteParams = Omit<AdminPackagesControllerFindAllV1Params, 'page'>;

export interface UseAdminPackagesInfiniteResult {
  packages: PackageResponseDto[];
  meta: PackagesMeta | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function useAdminPackagesInfinite(params?: InfiniteParams): UseAdminPackagesInfiniteResult {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['/api/admin/packages/infinite', params],
      queryFn: ({ pageParam, signal }) =>
        adminPackagesControllerFindAllV1({ ...params, page: pageParam as number }, signal),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const meta = lastPage.data?.meta;
        const page = meta?.page ?? 0;
        const totalPages = meta?.totalPages ?? 0;
        if (page > 0 && page < totalPages) return page + 1;
        return undefined;
      },
    });

  const packages: PackageResponseDto[] = data?.pages.flatMap((p) => p.data?.data ?? []) ?? [];

  const rawMeta = data?.pages.at(-1)?.data?.meta;
  const meta: PackagesMeta | null = rawMeta
    ? {
        total: rawMeta.total ?? 0,
        page: rawMeta.page ?? 1,
        limit: rawMeta.limit ?? 10,
        totalPages: rawMeta.totalPages ?? 0,
      }
    : null;

  return {
    packages,
    meta,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
    isError,
  };
}
