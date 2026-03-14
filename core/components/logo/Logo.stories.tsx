import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: {
    textColor: 'currentColor',
    iconColor: '#0D9488',
  },
  argTypes: {
    textColor: { control: 'color' },
    iconColor: { control: 'color' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

/** Default — inherits text color from parent */
export const Default: Story = {};

/** Explicit dark wordmark — fixed black text */
export const Dark: Story = {
  args: {
    textColor: '#000000',
  },
};

/** Light wordmark — for use on dark backgrounds */
export const Light: Story = {
  args: {
    textColor: '#ffffff',
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-gray-900 p-6">
        <Story />
      </div>
    ),
  ],
};

/** Scaled up via className */
export const Large: Story = {
  args: {
    className: 'w-48',
  },
};
