'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  getAdminPackagesControllerFindAllV1QueryKey,
  useAdminPackagesControllerCreateV1,
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

  return useAdminPackagesControllerCreateV1({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminPackagesControllerFindAllV1QueryKey(),
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
