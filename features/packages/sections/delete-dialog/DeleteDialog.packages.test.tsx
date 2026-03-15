import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import packagesMessages from '@/core/i18n/json/en/packages.json';

const mockMutateDelete = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-delete-package', () => ({
  useDeletePackage: () => ({ mutate: mockMutateDelete, isPending: false }),
}));

let mockIsDeleteOpen = false;
let mockSelectedPackage: PackageResponseDto | null = null;
const mockCloseDeleteDialog = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/store/packages.store', () => ({
  usePackagesStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
      isDeleteOpen: mockIsDeleteOpen,
      selectedPackage: mockSelectedPackage,
      closeDeleteDialog: mockCloseDeleteDialog,
    };
    return selector(state);
  },
}));

import { DeleteDialogPackages } from './DeleteDialog.packages';

function renderDialog() {
  return render(
    <NextIntlClientProvider locale="en" messages={{ packages: packagesMessages }}>
      <DeleteDialogPackages />
    </NextIntlClientProvider>,
  );
}

const mockPackage: PackageResponseDto = {
  id: '1a2b3c4d-0000-0000-0000-000000000001',
  name: 'Deep Tissue Massage',
  description: 'A therapeutic massage.',
  price: 120,
  durationMinutes: 60,
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
};

describe('DeleteDialogPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDeleteOpen = false;
    mockSelectedPackage = null;
  });

  it('does not render dialog when isDeleteOpen is false', () => {
    renderDialog();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with package name in message when isDeleteOpen is true', () => {
    mockIsDeleteOpen = true;
    mockSelectedPackage = mockPackage;
    renderDialog();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Deep Tissue Massage/i)).toBeInTheDocument();
  });

  it('calls closeDeleteDialog when Cancel is clicked', async () => {
    mockIsDeleteOpen = true;
    mockSelectedPackage = mockPackage;
    renderDialog();

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockCloseDeleteDialog).toHaveBeenCalled();
  });

  it('calls useDeletePackage().mutate with the correct id when Delete is clicked', async () => {
    mockIsDeleteOpen = true;
    mockSelectedPackage = mockPackage;
    renderDialog();

    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(packagesMessages.delete.confirm, 'i') }),
    );

    await waitFor(() => {
      expect(mockMutateDelete).toHaveBeenCalledWith({ id: mockPackage.id });
    });
  });
});
