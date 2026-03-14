import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

// ── Module mocks ──────────────────────────────────────────────────────────────
// Mutation hooks are mocked so stories render without a backend.
const mockMutateCreate = vi.hoisted(() => vi.fn());
const mockMutateUpdate = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-create-package', () => ({
  useCreatePackage: () => ({ mutate: mockMutateCreate, isPending: false }),
}));

vi.mock('@/features/packages/react-query/use-update-package', () => ({
  useUpdatePackage: () => ({ mutate: mockMutateUpdate, isPending: false }),
}));

// Must import after vi.mock so mocks are registered first.
import { usePackagesStore } from '@/features/packages/store/packages.store';

import { FormModalPackages } from './FormModal.packages';

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockPackage: PackageResponseDto = {
  id: '1a2b3c4d-0000-0000-0000-000000000001',
  name: 'Deep Tissue Massage',
  description: 'A therapeutic massage that targets deep muscle layers.',
  price: 120,
  durationMinutes: 60,
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
};

// ── Meta ──────────────────────────────────────────────────────────────────────
const meta: Meta<typeof FormModalPackages> = {
  title: 'Features/Packages/FormModalPackages',
  component: FormModalPackages,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FormModalPackages>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Create mode — blank form for adding a new package. */
export const CreateMode: Story = {
  beforeEach() {
    usePackagesStore.setState({ modalMode: 'create', selectedPackage: null });
  },
};

/** Edit mode — form pre-filled with the selected package data. */
export const EditMode: Story = {
  beforeEach() {
    usePackagesStore.setState({ modalMode: 'edit', selectedPackage: mockPackage });
  },
};

/** Loading state — save button shows spinner while mutation is in-flight. */
export const Loading: Story = {
  beforeEach() {
    vi.mock('@/features/packages/react-query/use-create-package', () => ({
      useCreatePackage: () => ({ mutate: mockMutateCreate, isPending: true }),
    }));
    usePackagesStore.setState({ modalMode: 'create', selectedPackage: null });
  },
};
