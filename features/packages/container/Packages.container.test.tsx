import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import packagesMessages from '@/core/i18n/json/en/packages.json';
import { usePackagesStore } from '@/features/packages/store/packages.store';

// ── Module mocks ──────────────────────────────────────────────────────────────
// Mock all API hooks so no backend is needed.
// The Zustand store is NOT mocked — integration tests rely on the real store
// to verify cross-section communication.

const mockUseAdminPackages = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-admin-packages', () => ({
  useAdminPackages: mockUseAdminPackages,
}));

vi.mock('@/features/packages/react-query/use-create-package', () => ({
  useCreatePackage: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/features/packages/react-query/use-update-package', () => ({
  useUpdatePackage: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/features/packages/react-query/use-delete-package', () => ({
  useDeletePackage: () => ({ mutate: vi.fn(), isPending: false }),
}));

// Must import after vi.mock
import { PackagesContainer } from './Packages.container';

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockPackages: PackageResponseDto[] = [
  {
    id: '1a2b3c4d-0000-0000-0000-000000000001',
    name: 'Deep Tissue Massage',
    description: 'Targets deep muscle layers.',
    price: 120,
    durationMinutes: 60,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: '1a2b3c4d-0000-0000-0000-000000000002',
    name: 'Hot Stone Therapy',
    description: 'Heated basalt stones for deep relaxation.',
    price: 150,
    durationMinutes: 90,
    createdAt: '2025-02-10T09:30:00.000Z',
    updatedAt: '2025-02-10T09:30:00.000Z',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function renderContainer() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={{ packages: packagesMessages }}>
        <PackagesContainer />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('PackagesContainer (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to clean state before each test
    usePackagesStore.setState({ modalMode: null, selectedPackage: null, isDeleteOpen: false });
    mockUseAdminPackages.mockReturnValue({
      packages: mockPackages,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    // Clean up store after each test to prevent state leakage
    usePackagesStore.setState({ modalMode: null, selectedPackage: null, isDeleteOpen: false });
  });

  // ── Mount ───────────────────────────────────────────────────────────────────
  it('renders all three sections without error', () => {
    renderContainer();
    // Table section: package data visible in desktop table and/or mobile cards
    expect(screen.getAllByText('Deep Tissue Massage').length).toBeGreaterThan(0);
    // FormModal + DeleteDialog are mounted but hidden (modalMode null / isDeleteOpen false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ── Table → FormModal (Edit) ─────────────────────────────────────────────────
  it('clicking Edit in TablePackages opens FormModalPackages with pre-filled data', async () => {
    renderContainer();

    // Click the Edit action button on the first row
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]!);

    // FormModalPackages should now be visible with edit title
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    // Scope edit title check to the dialog to avoid matching mobile card buttons
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(packagesMessages.editPackage)).toBeInTheDocument();
    // First package's name should be pre-filled in the form
    expect(screen.getByDisplayValue('Deep Tissue Massage')).toBeInTheDocument();
  });

  // ── Table → DeleteDialog ──────────────────────────────────────────────────────
  it('clicking Delete in TablePackages opens DeleteDialogPackages with package name', async () => {
    renderContainer();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]!);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    // Package name should be interpolated into the delete message
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Deep Tissue Massage/i)).toBeInTheDocument();
  });

  // ── Table → FormModal (Create) ────────────────────────────────────────────────
  it('clicking Add Package in TablePackages opens FormModalPackages in create mode', async () => {
    renderContainer();

    await userEvent.click(screen.getByRole('button', { name: /add package/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    // Dialog heading should say "Add Package" (table button also has this text,
    // so scope to the heading role to avoid ambiguity)
    expect(screen.getByRole('heading', { name: packagesMessages.addPackage })).toBeInTheDocument();
    // Name field should be empty (create mode)
    expect(screen.getByLabelText(packagesMessages.form.name)).toHaveValue('');
  });
});
