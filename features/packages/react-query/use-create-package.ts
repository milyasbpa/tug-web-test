'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  getAdminPackagesControllerFindAllQueryKey,
  useAdminPackagesControllerCreate,
} from '@/core/api/generated/admin-packages/admin-packages';
import { handleApiError } from '@/core/lib/errors';
import { usePackagesStore } from '@/features/packages/store/packages.store';

// ── useCreatePackage ───────────────────────────────────────────────────────────
// Anti-corruption layer wrapping useAdminPackagesControllerCreate.
// onSuccess: invalidate packages list query + success toast + closeModal()
// onError: error toast via handleApiError
export function useCreatePackage() {
  const t = useTranslations('packages');
  const queryClient = useQueryClient();
  const closeModal = usePackagesStore((s) => s.closeModal);

  return useAdminPackagesControllerCreate({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminPackagesControllerFindAllQueryKey(),
        });
        toast.success(t('toast.created'));
        closeModal();
      },
      onError: (error) => {
        toast.error(handleApiError(error).message);
      },
    },
  });
}
