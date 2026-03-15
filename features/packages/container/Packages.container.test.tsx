import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import packagesMessages from '@/core/i18n/json/en/packages.json';
import { usePackagesStore } from '@/features/packages/store/packages.store';

const mockReplace = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/en/packages',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('usehooks-ts', () => ({
  useMediaQuery: () => true,
  useDebounceValue: (value: string) => [value],
}));

const mockUseAdminPackages = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-admin-packages', () => ({
  useAdminPackages: mockUseAdminPackages,
}));

vi.mock('@/features/packages/react-query/use-admin-packages-infinite', () => ({
  useAdminPackagesInfinite: () => ({
    packages: [],
    meta: null,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    isError: false,
  }),
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

import { PackagesContainer } from './Packages.container';

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

describe('PackagesContainer (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePackagesStore.setState({ modalMode: null, selectedPackage: null, isDeleteOpen: false });
    mockUseAdminPackages.mockReturnValue({
      packages: mockPackages,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    usePackagesStore.setState({ modalMode: null, selectedPackage: null, isDeleteOpen: false });
  });

  it('renders all three sections without error', () => {
    renderContainer();
    expect(screen.getAllByText('Deep Tissue Massage').length).toBeGreaterThan(0);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clicking Edit in TablePackages opens FormModalPackages with pre-filled data', async () => {
    renderContainer();

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]!);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(packagesMessages.editPackage)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Deep Tissue Massage')).toBeInTheDocument();
  });

  it('clicking Delete in TablePackages opens DeleteDialogPackages with package name', async () => {
    renderContainer();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]!);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Deep Tissue Massage/i)).toBeInTheDocument();
  });

  it('clicking Add Package in TablePackages opens FormModalPackages in create mode', async () => {
    renderContainer();

    await userEvent.click(screen.getByRole('button', { name: /add package/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: packagesMessages.addPackage })).toBeInTheDocument();
    expect(screen.getByLabelText(packagesMessages.form.name)).toHaveValue('');
  });
});
