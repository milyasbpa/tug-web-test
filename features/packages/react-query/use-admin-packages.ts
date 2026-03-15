// ── useAdminPackages ───────────────────────────────────────────────────────────
// Anti-corruption layer wrapping the generated useAdminPackagesControllerFindAll.
//
// ⚠️  Response shape from backend:
//   { success, data: { data: PackageResponseDto[], meta: { total, page, limit, totalPages } } }
//   i.e. double-nested — response.data?.data is the array.
//
// Accepts optional AdminPackagesControllerFindAllParams (page, limit, search, sortBy, sortOrder)
// and passes them directly to the generated hook for server-side pagination/filtering.
//
// This wrapper unwraps the nesting so sections only deal with a clean interface.

import { useAdminPackagesControllerFindAllV1 } from '@/core/api/generated/admin-packages/admin-packages';
import type {
  AdminPackagesControllerFindAllV1Params,
  PackageResponseDto,
} from '@/core/api/generated/nestjsStarter.schemas';

export interface PackagesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseAdminPackagesResult {
  packages: PackageResponseDto[];
  meta: PackagesMeta | null;
  isLoading: boolean;
  isError: boolean;
}

export function useAdminPackages(
  params?: AdminPackagesControllerFindAllV1Params,
): UseAdminPackagesResult {
  const { data: response, isLoading, isError } = useAdminPackagesControllerFindAllV1(params);

  const packages: PackageResponseDto[] = response?.data?.data ?? [];

  const rawMeta = response?.data?.meta;
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
    isLoading,
    isError,
  };
}
