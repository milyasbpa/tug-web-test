import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import packagesMessages from '@/core/i18n/json/en/packages.json';

const mockMutateCreate = vi.hoisted(() => vi.fn());
const mockMutateUpdate = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-create-package', () => ({
  useCreatePackage: () => ({ mutate: mockMutateCreate, isPending: false }),
}));

vi.mock('@/features/packages/react-query/use-update-package', () => ({
  useUpdatePackage: () => ({ mutate: mockMutateUpdate, isPending: false }),
}));

let mockModalMode: 'create' | 'edit' | null = null;
let mockSelectedPackage: PackageResponseDto | null = null;
const mockCloseModal = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/store/packages.store', () => ({
  usePackagesStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
      modalMode: mockModalMode,
      selectedPackage: mockSelectedPackage,
      closeModal: mockCloseModal,
    };
    return selector(state);
  },
}));

import { FormModalPackages } from './FormModal.packages';

function renderModal() {
  return render(
    <NextIntlClientProvider locale="en" messages={{ packages: packagesMessages }}>
      <FormModalPackages />
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

describe('FormModalPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockModalMode = null;
    mockSelectedPackage = null;
  });

  it('does not render dialog content when modalMode is null', () => {
    renderModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders "Add Package" title in create mode', () => {
    mockModalMode = 'create';
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(packagesMessages.addPackage)).toBeInTheDocument();
  });

  it('renders "Edit Package" title and pre-fills fields in edit mode', () => {
    mockModalMode = 'edit';
    mockSelectedPackage = mockPackage;
    renderModal();
    expect(screen.getByText(packagesMessages.editPackage)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPackage.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPackage.description)).toBeInTheDocument();
  });

  it('shows validation error when name is empty on submit', async () => {
    mockModalMode = 'create';
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('shows validation error when price is 0', async () => {
    mockModalMode = 'create';
    renderModal();

    await userEvent.type(screen.getByLabelText(packagesMessages.form.name), 'Test Package');
    await userEvent.type(screen.getByLabelText(packagesMessages.form.description), 'A description');
    await userEvent.type(screen.getByLabelText(packagesMessages.form.price), '0');
    await userEvent.type(screen.getByLabelText(packagesMessages.form.durationMinutes), '30');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText('Price must be greater than 0')).toBeInTheDocument();
  });

  it('calls createPackage.mutate with form values in create mode', async () => {
    mockModalMode = 'create';
    renderModal();

    await userEvent.type(screen.getByLabelText(packagesMessages.form.name), 'Relaxation Package');
    await userEvent.type(
      screen.getByLabelText(packagesMessages.form.description),
      'Full body relax',
    );
    await userEvent.type(screen.getByLabelText(packagesMessages.form.price), '85');
    await userEvent.type(screen.getByLabelText(packagesMessages.form.durationMinutes), '45');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockMutateCreate).toHaveBeenCalledWith({
        data: {
          name: 'Relaxation Package',
          description: 'Full body relax',
          price: 85,
          durationMinutes: 45,
        },
      });
    });
  });

  it('calls updatePackage.mutate with id and form values in edit mode', async () => {
    mockModalMode = 'edit';
    mockSelectedPackage = mockPackage;
    renderModal();

    const nameInput = screen.getByDisplayValue(mockPackage.name);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Massage');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockMutateUpdate).toHaveBeenCalledWith({
        id: mockPackage.id,
        data: expect.objectContaining({ name: 'Updated Massage' }),
      });
    });
  });
});
