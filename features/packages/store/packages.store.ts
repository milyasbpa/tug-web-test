import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

type ModalMode = 'create' | 'edit' | null;

interface PackagesStore {
  selectedPackage: PackageResponseDto | null;
  modalMode: ModalMode;
  isDeleteOpen: boolean;

  openCreateModal: () => void;
  openEditModal: (pkg: PackageResponseDto) => void;
  closeModal: () => void;
  openDeleteDialog: (pkg: PackageResponseDto) => void;
  closeDeleteDialog: () => void;
}

export const usePackagesStore = create<PackagesStore>()(
  devtools(
    (set) => ({
      selectedPackage: null,
      modalMode: null,
      isDeleteOpen: false,

      openCreateModal: () =>
        set({ modalMode: 'create', selectedPackage: null }, false, 'openCreateModal'),

      openEditModal: (pkg) =>
        set({ modalMode: 'edit', selectedPackage: pkg }, false, 'openEditModal'),

      closeModal: () => set({ modalMode: null, selectedPackage: null }, false, 'closeModal'),

      openDeleteDialog: (pkg) =>
        set({ isDeleteOpen: true, selectedPackage: pkg }, false, 'openDeleteDialog'),

      closeDeleteDialog: () =>
        set({ isDeleteOpen: false, selectedPackage: null }, false, 'closeDeleteDialog'),
    }),
    { name: 'PackagesStore' },
  ),
);
