import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

const mockMutateDelete = vi.hoisted(() => vi.fn());

vi.mock('@/features/packages/react-query/use-delete-package', () => ({
  useDeletePackage: () => ({ mutate: mockMutateDelete, isPending: false }),
}));

import { usePackagesStore } from '@/features/packages/store/packages.store';

import { DeleteDialogPackages } from './DeleteDialog.packages';

const mockPackage: PackageResponseDto = {
  id: '1a2b3c4d-0000-0000-0000-000000000001',
  name: 'Deep Tissue Massage',
  description: 'A therapeutic massage that targets deep muscle layers.',
  price: 120,
  durationMinutes: 60,
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
};

const meta: Meta<typeof DeleteDialogPackages> = {
  title: 'Features/Packages/DeleteDialogPackages',
  component: DeleteDialogPackages,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteDialogPackages>;

/**
 * Default delete confirmation — dialog open with the package name interpolated
 * into the message.
 */
export const Default: Story = {
  beforeEach() {
    usePackagesStore.setState({ isDeleteOpen: true, selectedPackage: mockPackage });
  },
};

/**
 * Loading state — confirm button disabled while the delete mutation is in-flight.
 */
export const Loading: Story = {
  beforeEach() {
    vi.mock('@/features/packages/react-query/use-delete-package', () => ({
      useDeletePackage: () => ({ mutate: mockMutateDelete, isPending: true }),
    }));
    usePackagesStore.setState({ isDeleteOpen: true, selectedPackage: mockPackage });
  },
};
