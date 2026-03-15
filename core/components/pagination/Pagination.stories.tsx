import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    page: 1,
    totalPages: 10,
    onPageChange: () => {},
    isLoading: false,
  },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    isLoading: { control: 'boolean' },
    onPageChange: { action: 'page changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

/** First page — Previous button disabled */
export const FirstPage: Story = {
  args: {
    page: 1,
    totalPages: 10,
  },
};

/** Middle page — ellipsis on both sides: < 1 ... 4 5 6 ... 10 > */
export const MiddlePage: Story = {
  args: {
    page: 5,
    totalPages: 10,
  },
};

/** Last page — Next button disabled */
export const LastPage: Story = {
  args: {
    page: 10,
    totalPages: 10,
  },
};

/** Few pages (≤ 7) — all page numbers shown without ellipsis */
export const FewPages: Story = {
  args: {
    page: 3,
    totalPages: 5,
  },
};

/** Two pages — minimal pagination */
export const TwoPages: Story = {
  args: {
    page: 1,
    totalPages: 2,
  },
};

/** Loading state — all buttons disabled */
export const Loading: Story = {
  args: {
    page: 3,
    totalPages: 10,
    isLoading: true,
  },
};

/** Custom prev/next labels */
export const CustomLabels: Story = {
  args: {
    page: 5,
    totalPages: 10,
    labels: { prev: 'Back', next: 'Forward' },
  },
};

/** Interactive — state controlled via React.useState */
function InteractiveDemo(args: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = React.useState(args.page);
  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination {...args} page={page} onPageChange={setPage} />
      <p className="text-muted-foreground text-sm">
        Current page: <strong>{page}</strong> / {args.totalPages}
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
  args: {
    page: 1,
    totalPages: 10,
  },
};
