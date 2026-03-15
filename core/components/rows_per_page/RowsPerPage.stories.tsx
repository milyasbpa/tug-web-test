import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { useState } from 'react';

import { RowsPerPage } from './RowsPerPage';

const OPTIONS = [5, 10, 25, 50, 100] as const;

const meta: Meta<typeof RowsPerPage> = {
  title: 'Components/RowsPerPage',
  component: RowsPerPage,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof RowsPerPage>;

function StatefulRowsPerPage({ defaultValue = 10 }: { defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);
  return <RowsPerPage value={value} options={OPTIONS} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <StatefulRowsPerPage />,
};

export const CustomLabel: Story = {
  render: () => (
    <RowsPerPage value={10} options={OPTIONS} onChange={() => {}} label="Items per page" />
  ),
};

export const Disabled: Story = {
  render: () => <RowsPerPage value={25} options={OPTIONS} onChange={() => {}} disabled />,
};
