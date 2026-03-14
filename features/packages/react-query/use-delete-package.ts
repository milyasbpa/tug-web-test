'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  getAdminPackagesControllerFindAllQueryKey,
  useAdminPackagesControllerRemove,
} from '@/core/api/generated/admin-packages/admin-packages';
import { handleApiError } from '@/core/lib/errors';
import { usePackagesStore } from '@/features/packages/store/packages.store';

// ── useDeletePackage ───────────────────────────────────────────────────────────
// Anti-corruption layer wrapping useAdminPackagesControllerRemove.
// onSuccess: invalidate packages list query + success toast + closeDeleteDialog()
// onError: error toast via handleApiError
export function useDeletePackage() {
  const t = useTranslations('packages');
  const queryClient = useQueryClient();
  const closeDeleteDialog = usePackagesStore((s) => s.closeDeleteDialog);

  return useAdminPackagesControllerRemove({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminPackagesControllerFindAllQueryKey(),
        });
        toast.success(t('toast.deleted'));
        closeDeleteDialog();
      },
      onError: (error) => {
        toast.error(handleApiError(error).message);
      },
    },
  });
}
