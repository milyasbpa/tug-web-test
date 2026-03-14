import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import packagesMessages from '@/core/i18n/json/en/packages.json';

// ── Module mocks ──────────────────────────────────────────────────────────────
const mockUseAdminPackages = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-admin-packages', () => ({
  useAdminPackages: mockUseAdminPackages,
}));

const mockOpenCreateModal = vi.hoisted(() => vi.fn());
const mockOpenEditModal = vi.hoisted(() => vi.fn());
const mockOpenDeleteDialog = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/store/packages.store', () => ({
  usePackagesStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
      openCreateModal: mockOpenCreateModal,
      openEditModal: mockOpenEditModal,
      openDeleteDialog: mockOpenDeleteDialog,
      selectedPackage: null,
      modalMode: null,
      isDeleteOpen: false,
    };
    return selector(state);
  },
}));

import { TablePackages } from './Table.packages';

// ── Helpers ───────────────────────────────────────────────────────────────────
function renderTable() {
  return render(
    <NextIntlClientProvider locale="en" messages={{ packages: packagesMessages }}>
      <TablePackages />
    </NextIntlClientProvider>,
  );
}

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
  {
    id: '1a2b3c4d-0000-0000-0000-000000000003',
    name: 'Aromatherapy Session',
    description: 'Essential oil diffusion.',
    price: 95,
    durationMinutes: 45,
    createdAt: '2025-03-01T14:00:00.000Z',
    updatedAt: '2025-03-01T14:00:00.000Z',
  },
];

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('TablePackages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminPackages.mockReturnValue({
      packages: mockPackages,
      meta: { total: 3, page: 1, limit: 10, totalPages: 1 },
      isLoading: false,
      isError: false,
    });
  });

  // ── Column headers ──────────────────────────────────────────────────────────
  describe('column headers', () => {
    it('renders all expected column headers', () => {
      renderTable();
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /price/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /duration/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /created at/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
    });
  });

  // ── Loading state ───────────────────────────────────────────────────────────
  describe('loading state', () => {
    it('renders skeleton rows and no data rows when loading', () => {
      mockUseAdminPackages.mockReturnValue({
        packages: [],
        meta: null,
        isLoading: true,
        isError: false,
      });
      renderTable();

      expect(screen.getAllByRole('row', { name: /loading-row/i })).toHaveLength(5);
      // No real data cells with package names
      expect(screen.queryByText('Deep Tissue Massage')).not.toBeInTheDocument();
    });
  });

  // ── Empty state ─────────────────────────────────────────────────────────────
  describe('empty state', () => {
    it('renders empty state component when packages array is empty', () => {
      mockUseAdminPackages.mockReturnValue({
        packages: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
        isLoading: false,
        isError: false,
      });
      renderTable();

      expect(screen.getAllByText('No packages yet').length).toBeGreaterThan(0);
      expect(
        screen.getAllByText('Add your first wellness package to get started.').length,
      ).toBeGreaterThan(0);
    });
  });

  // ── Data rows ───────────────────────────────────────────────────────────────
  describe('with data', () => {
    it('renders one row per package', () => {
      renderTable();
      // 1 header row + 3 data rows = 4 rows total
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('renders package names in rows', () => {
      renderTable();
      // Each name appears in both desktop table and mobile cards
      expect(screen.getAllByText('Deep Tissue Massage').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Hot Stone Therapy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Aromatherapy Session').length).toBeGreaterThan(0);
    });

    it('formats price using formatPrice', () => {
      renderTable();
      expect(screen.getAllByText('$120.00').length).toBeGreaterThan(0);
    });

    it('formats duration using formatDuration', () => {
      renderTable();
      expect(screen.getAllByText('60 min').length).toBeGreaterThan(0);
    });
  });

  // ── Edit action ─────────────────────────────────────────────────────────────
  describe('edit action', () => {
    it('calls openEditModal with the correct package when Edit is clicked', async () => {
      renderTable();
      const user = userEvent.setup();

      // Name appears in both desktop table and mobile cards — click the first
      await user.click(screen.getAllByRole('button', { name: /edit deep tissue massage/i })[0]);

      expect(mockOpenEditModal).toHaveBeenCalledOnce();
      expect(mockOpenEditModal).toHaveBeenCalledWith(mockPackages[0]);
    });
  });

  // ── Delete action ───────────────────────────────────────────────────────────
  describe('delete action', () => {
    it('calls openDeleteDialog with the correct package when Delete is clicked', async () => {
      renderTable();
      const user = userEvent.setup();

      // Name appears in both desktop table and mobile cards — click the first
      await user.click(screen.getAllByRole('button', { name: /delete hot stone therapy/i })[0]);

      expect(mockOpenDeleteDialog).toHaveBeenCalledOnce();
      expect(mockOpenDeleteDialog).toHaveBeenCalledWith(mockPackages[1]);
    });
  });

  // ── Add Package ─────────────────────────────────────────────────────────────
  describe('add package button', () => {
    it('calls openCreateModal when "Add Package" is clicked', async () => {
      renderTable();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /add package/i }));

      expect(mockOpenCreateModal).toHaveBeenCalledOnce();
    });
  });

  // ── Search / filter ─────────────────────────────────────────────────────────
  describe('search filter', () => {
    it('filters rows when user types in the search input', async () => {
      renderTable();
      const user = userEvent.setup();

      // Initially 3 data rows + 1 header = 4 rows
      expect(screen.getAllByRole('row')).toHaveLength(4);

      await user.type(screen.getByRole('textbox', { name: /search/i }), 'Hot Stone');

      // After filter: only the matching row + header = 2 rows in the desktop table (mobile cards use divs)
      expect(screen.getAllByRole('row')).toHaveLength(2);
      expect(screen.getAllByText('Hot Stone Therapy').length).toBeGreaterThan(0);
      expect(screen.queryByText('Deep Tissue Massage')).not.toBeInTheDocument();
    });
  });
});
