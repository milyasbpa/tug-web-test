import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';

import { PackagesDesktopTable } from './PackagesDesktopTable';

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

const columns: ColumnDef<PackageResponseDto>[] = [
  { accessorKey: 'name', header: () => 'Name', enableSorting: true },
  { accessorKey: 'description', header: () => 'Description' },
  { accessorKey: 'price', header: () => 'Price', enableSorting: true },
  { accessorKey: 'durationMinutes', header: () => 'Duration' },
];

function TableWrapper({ data, isLoading }: { data: PackageResponseDto[]; isLoading: boolean }) {
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
      emptyTitle="No packages found"
      emptyDescription="Create your first wellness package to get started."
    />
  );
}

const meta: Meta = {
  title: 'Features/Packages/PackagesDesktopTable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const WithData: Story = {
  render: () => <TableWrapper data={mockPackages} isLoading={false} />,
};

export const Loading: Story = {
  render: () => <TableWrapper data={[]} isLoading={true} />,
};

export const Empty: Story = {
  render: () => <TableWrapper data={[]} isLoading={false} />,
};
