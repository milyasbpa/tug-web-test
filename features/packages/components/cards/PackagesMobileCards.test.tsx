import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

import { PackagesMobileCards } from './PackagesMobileCards';

const mockPackages: PackageResponseDto[] = [
  {
    id: '1',
    name: 'Deep Tissue Massage',
    description: 'Targets deep muscle layers.',
    price: 120,
    durationMinutes: 60,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'Hot Stone Therapy',
    description: 'Heated basalt stones for relaxation.',
    price: 150,
    durationMinutes: 90,
    createdAt: '2025-02-10T09:30:00.000Z',
    updatedAt: '2025-02-10T09:30:00.000Z',
  },
];

const defaultLabels = {
  edit: 'Edit',
  delete: 'Delete',
  emptyTitle: 'No packages',
  emptyDescription: 'No packages found.',
};

function renderCards(overrides?: Partial<React.ComponentProps<typeof PackagesMobileCards>>) {
  const props = {
    packages: mockPackages,
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    labels: defaultLabels,
    ...overrides,
  };
  return { ...render(<PackagesMobileCards {...props} />), props };
}

describe('PackagesMobileCards', () => {
  it('renders a card for each package', () => {
    renderCards();
    expect(screen.getByText('Deep Tissue Massage')).toBeInTheDocument();
    expect(screen.getByText('Hot Stone Therapy')).toBeInTheDocument();
  });

  it('renders formatted price and duration', () => {
    renderCards();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
  });

  it('renders skeleton rows while loading', () => {
    renderCards({ isLoading: true, skeletonRows: 3 });
    expect(screen.getAllByLabelText('loading-row')).toHaveLength(3);
  });

  it('renders empty state when packages list is empty', () => {
    renderCards({ packages: [] });
    expect(screen.getByText('No packages')).toBeInTheDocument();
  });

  it('calls onEdit with the correct package when Edit is clicked', async () => {
    const user = userEvent.setup();
    const { props } = renderCards();
    await user.click(screen.getByLabelText(`Edit ${mockPackages[0].name}`));
    expect(props.onEdit).toHaveBeenCalledWith(mockPackages[0]);
  });

  it('calls onDelete with the correct package when Delete is clicked', async () => {
    const user = userEvent.setup();
    const { props } = renderCards();
    await user.click(screen.getByLabelText(`Delete ${mockPackages[0].name}`));
    expect(props.onDelete).toHaveBeenCalledWith(mockPackages[0]);
  });
});
