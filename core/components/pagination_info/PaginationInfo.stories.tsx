import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PaginationInfo } from './PaginationInfo';

const meta: Meta<typeof PaginationInfo> = {
  title: 'Components/PaginationInfo',
  component: PaginationInfo,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    from: 1,
    to: 10,
    total: 147,
  },
};

export default meta;
type Story = StoryObj<typeof PaginationInfo>;

export const Default: Story = {};

export const LastPage: Story = {
  args: {
    from: 141,
    to: 147,
    total: 147,
  },
};

export const NoResults: Story = {
  args: {
    from: 0,
    to: 0,
    total: 0,
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Items 1 to 10 of 147',
  },
};
