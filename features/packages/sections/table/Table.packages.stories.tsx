import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

// ── Module mock ───────────────────────────────────────────────────────────────
// useAdminPackages is mocked so stories render without a backend.
// vi.hoisted ensures the fn reference is available inside the vi.mock factory.
const mockUseAdminPackages = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    packages: [],
    meta: null,
    isLoading: false,
    isError: false,
  }),
);

vi.mock('@/features/packages/react-query/use-admin-packages', () => ({
  useAdminPackages: mockUseAdminPackages,
}));

// Must import after vi.mock
import { TablePackages } from './Table.packages';

// ── Mock data ─────────────────────────────────────────────────────────────────
export const mockPackages: PackageResponseDto[] = [
  {
    id: '1a2b3c4d-0000-0000-0000-000000000001',
    name: 'Deep Tissue Massage',
    description: 'A therapeutic massage that targets deep muscle layers.',
    price: 120,
    durationMinutes: 60,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: '1a2b3c4d-0000-0000-0000-000000000002',
    name: 'Hot Stone Therapy',
    description: 'Heated basalt stones placed on key points for deep relaxation.',
    price: 150,
    durationMinutes: 90,
    createdAt: '2025-02-10T09:30:00.000Z',
    updatedAt: '2025-02-10T09:30:00.000Z',
  },
  {
    id: '1a2b3c4d-0000-0000-0000-000000000003',
    name: 'Aromatherapy Session',
    description: 'Essential oil diffusion combined with a gentle full-body massage.',
    price: 95,
    durationMinutes: 45,
    createdAt: '2025-03-01T14:00:00.000Z',
    updatedAt: '2025-03-01T14:00:00.000Z',
  },
  {
    id: '1a2b3c4d-0000-0000-0000-000000000004',
    name: 'Couples Retreat',
    description: 'Side-by-side massage experience designed for two people.',
    price: 220,
    durationMinutes: 120,
    createdAt: '2025-03-10T11:00:00.000Z',
    updatedAt: '2025-03-10T11:00:00.000Z',
  },
  {
    id: '1a2b3c4d-0000-0000-0000-000000000005',
    name: 'Express Back Relief',
    description: 'Focused 30-minute session targeting back and shoulder tension.',
    price: 55,
    durationMinutes: 30,
    createdAt: '2025-03-20T08:00:00.000Z',
    updatedAt: '2025-03-20T08:00:00.000Z',
  },
];

// ── Meta ──────────────────────────────────────────────────────────────────────
const meta: Meta<typeof TablePackages> = {
  title: 'Features/Packages/TablePackages',
  component: TablePackages,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof TablePackages>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Fully rendered table with 5 mock packages. */
export const WithData: Story = {
  beforeEach() {
    mockUseAdminPackages.mockReturnValue({
      packages: mockPackages,
      meta: { total: 5, page: 1, limit: 10, totalPages: 1 },
      isLoading: false,
      isError: false,
    });
  },
};

/** Loading state — skeleton rows replace data rows while fetch is in-flight. */
export const Loading: Story = {
  beforeEach() {
    mockUseAdminPackages.mockReturnValue({
      packages: [],
      meta: null,
      isLoading: true,
      isError: false,
    });
  },
};

/** Empty state — no packages exist yet. */
export const Empty: Story = {
  beforeEach() {
    mockUseAdminPackages.mockReturnValue({
      packages: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      isLoading: false,
      isError: false,
    });
  },
};

/** Pre-filled search — demonstrates the global filter in action. */
export const WithSearch: Story = {
  beforeEach() {
    mockUseAdminPackages.mockReturnValue({
      packages: mockPackages,
      meta: { total: 5, page: 1, limit: 10, totalPages: 1 },
      isLoading: false,
      isError: false,
    });
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: /search/i });
    await userEvent.type(input, 'massage');
  },
};
