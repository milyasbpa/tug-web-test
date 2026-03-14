import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search, X } from 'lucide-react';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-120">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

/** Matches the design — clean pill input with placeholder text */
export const Default: Story = {
  args: {
    placeholder: 'Anti Serum',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftElement: <Search />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search products...',
    leftElement: <Search />,
    rightElement: <X />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Anti Serum',
    disabled: true,
  },
};
