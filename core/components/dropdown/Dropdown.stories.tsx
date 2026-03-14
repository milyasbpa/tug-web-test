import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Eye, LayoutGrid, Maximize2, SlidersHorizontal } from 'lucide-react';

import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/** Matches the design — "Custom" trigger with Visual Style, Aspect ratio, Resolution */
export const Default: Story = {
  args: {
    label: 'Custom',
    triggerIcon: <SlidersHorizontal />,
    items: [
      {
        id: 'visual-style',
        icon: <Eye />,
        label: 'Visual Style',
      },
      {
        id: 'aspect-ratio',
        icon: <Maximize2 />,
        label: 'Aspect ratio',
      },
      {
        id: 'resolution',
        icon: <LayoutGrid />,
        label: 'Resolution',
      },
    ],
  },
};

/** No trigger icon */
export const NoIcon: Story = {
  args: {
    label: 'Options',
    items: [
      { id: '1', label: 'Option A' },
      { id: '2', label: 'Option B' },
      { id: '3', label: 'Option C' },
    ],
  },
};
