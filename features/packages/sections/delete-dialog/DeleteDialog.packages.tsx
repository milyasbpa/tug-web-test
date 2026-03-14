'use client';

import { useTranslations } from 'next-intl';

import { ConfirmationDialog } from '@/core/components/confirmation_dialog';
import { useDeletePackage } from '@/features/packages/react-query/use-delete-package';
import { usePackagesStore } from '@/features/packages/store/packages.store';

// ── DeleteDialogPackages ───────────────────────────────────────────────────────
// Controlled entirely by Zustand (usePackagesStore).
// Renders a ConfirmationDialog to confirm package deletion.
// No props from container — behaviour driven purely by store state.
export function DeleteDialogPackages() {
  const t = useTranslations('packages');

  const isDeleteOpen = usePackagesStore((s) => s.isDeleteOpen);
  const selectedPackage = usePackagesStore((s) => s.selectedPackage);
  const closeDeleteDialog = usePackagesStore((s) => s.closeDeleteDialog);

  const { mutate, isPending } = useDeletePackage();

  function handleConfirm() {
    if (!selectedPackage) return;
    mutate({ id: selectedPackage.id });
  }

  return (
    <ConfirmationDialog
      open={isDeleteOpen}
      onOpenChange={(open) => !open && closeDeleteDialog()}
      message={t('delete.description', { name: selectedPackage?.name ?? '' })}
      confirmLabel={t('delete.confirm')}
      cancelLabel={t('delete.cancel')}
      onConfirm={handleConfirm}
      onCancel={closeDeleteDialog}
      confirmDisabled={isPending}
    />
  );
}
