import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton className="h-10 w-64" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="size-12 rounded-full" />,
};

/** Card-shaped loading placeholder */
export const Card: Story = {
  render: () => (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  ),
};

/** Table row loading placeholders */
export const TableRows: Story = {
  render: () => (
    <div className="w-full space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  ),
};
