import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

import { PackagesDesktopTable } from './PackagesDesktopTable';

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

const columns: ColumnDef<PackageResponseDto>[] = [
  { accessorKey: 'name', header: () => 'Name' },
  { accessorKey: 'price', header: () => 'Price' },
];

function TestWrapper({
  data = mockPackages,
  isLoading = false,
}: {
  data?: PackageResponseDto[];
  isLoading?: boolean;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PackagesDesktopTable
      headerGroups={table.getHeaderGroups()}
      rows={table.getRowModel().rows}
      isLoading={isLoading}
      columnCount={columns.length}
      skeletonRows={3}
      emptyTitle="No packages"
      emptyDescription="No packages found."
    />
  );
}

describe('PackagesDesktopTable', () => {
  it('renders column headers', () => {
    render(<TestWrapper />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders a row for each package', () => {
    render(<TestWrapper />);
    expect(screen.getByText('Deep Tissue Massage')).toBeInTheDocument();
    expect(screen.getByText('Hot Stone Therapy')).toBeInTheDocument();
  });

  it('renders skeleton rows while loading', () => {
    render(<TestWrapper isLoading />);
    expect(screen.getAllByLabelText('loading-row')).toHaveLength(3);
    expect(screen.queryByText('Deep Tissue Massage')).not.toBeInTheDocument();
  });

  it('renders empty state when data is empty', () => {
    render(<TestWrapper data={[]} />);
    expect(screen.getByText('No packages')).toBeInTheDocument();
  });
});
