import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

import { PackagesMobileCards } from './PackagesMobileCards';

const mockPackages: PackageResponseDto[] = [
  {
    id: '1',
    name: 'Deep Tissue Massage',
    description: 'A therapeutic massage targeting deep muscle layers.',
    price: 120,
    durationMinutes: 60,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'Hot Stone Therapy',
    description: 'Heated basalt stones placed on key points for deep relaxation.',
    price: 150,
    durationMinutes: 90,
    createdAt: '2025-02-10T09:30:00.000Z',
    updatedAt: '2025-02-10T09:30:00.000Z',
  },
  {
    id: '3',
    name: 'Aromatherapy Session',
    description: 'Essential oil diffusion combined with a gentle full-body massage.',
    price: 95,
    durationMinutes: 45,
    createdAt: '2025-03-01T14:00:00.000Z',
    updatedAt: '2025-03-01T14:00:00.000Z',
  },
];

const defaultLabels = {
  edit: 'Edit',
  delete: 'Delete',
  emptyTitle: 'No packages found',
  emptyDescription: 'Create your first wellness package to get started.',
};

const meta: Meta<typeof PackagesMobileCards> = {
  title: 'Features/Packages/PackagesMobileCards',
  component: PackagesMobileCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    viewport: { defaultViewport: 'sm' },
  },
  args: {
    packages: mockPackages,
    isLoading: false,
    skeletonRows: 3,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    labels: defaultLabels,
  },
};

export default meta;
type Story = StoryObj<typeof PackagesMobileCards>;

export const WithData: Story = {};

export const Loading: Story = {
  args: { isLoading: true, packages: [] },
};

export const Empty: Story = {
  args: { packages: [] },
};
