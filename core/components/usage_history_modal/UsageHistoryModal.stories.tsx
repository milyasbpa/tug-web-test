import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { UsageHistoryModal } from './UsageHistoryModal';

const SAMPLE_GROUPS = [
  {
    month: 'February 2026',
    summary: '3 photoshoots used',
    entries: [
      {
        date: 'Feb 12',
        product: 'Anti Aging Serum',
        credits: '1 photoshoot',
        onView: () => console.log('view Feb 12'),
      },
      {
        date: 'Feb 10',
        product: 'Vitamin C Drops',
        credits: '1 photoshoot',
        onView: () => console.log('view Feb 10'),
      },
      {
        date: 'Feb 8',
        product: 'Night Cream',
        credits: '1 photoshoot',
        onView: () => console.log('view Feb 8'),
      },
    ],
  },
  {
    month: 'January 2026',
    summary: '3 photoshoots used',
    entries: [
      {
        date: 'Jan 12',
        product: 'Anti Aging Serum',
        credits: '1 photoshoot',
        onView: () => console.log('view Jan 12'),
      },
      {
        date: 'Jan 10',
        product: 'Vitamin C Drops',
        credits: '1 photoshoot',
        onView: () => console.log('view Jan 10'),
      },
      {
        date: 'Jan 8',
        product: 'Night Cream',
        credits: '1 photoshoot',
        onView: () => console.log('view Jan 8'),
      },
    ],
  },
];

const meta: Meta<typeof UsageHistoryModal> = {
  title: 'Components/UsageHistoryModal',
  component: UsageHistoryModal,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    onOpenChange: (open) => console.log('onOpenChange', open),
  },
};

export default meta;

type Story = StoryObj<typeof UsageHistoryModal>;

export const Default: Story = {
  args: {
    groups: SAMPLE_GROUPS,
  },
};

export const SingleMonth: Story = {
  args: {
    groups: [SAMPLE_GROUPS[0]],
  },
};

export const NoHistory: Story = {
  args: {
    groups: [],
  },
};

export const ManyMonths: Story = {
  args: {
    groups: [
      ...SAMPLE_GROUPS,
      {
        month: 'December 2025',
        summary: '5 photoshoots used',
        entries: [
          { date: 'Dec 28', product: 'Eye Cream', credits: '1 photoshoot', onView: () => {} },
          { date: 'Dec 20', product: 'Face Wash', credits: '1 photoshoot', onView: () => {} },
          { date: 'Dec 15', product: 'Toner', credits: '1 photoshoot', onView: () => {} },
          { date: 'Dec 10', product: 'Moisturizer', credits: '1 photoshoot', onView: () => {} },
          { date: 'Dec 5', product: 'Sunscreen SPF 50', credits: '1 photoshoot', onView: () => {} },
        ],
      },
    ],
  },
};
