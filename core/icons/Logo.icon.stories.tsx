import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LogoIcon } from './Logo.icon';

const meta: Meta<typeof LogoIcon> = {
  title: 'Icons/Logo',
  component: LogoIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 128, step: 4 } },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof LogoIcon>;

/** Default brand color */
export const Default: Story = {
  args: {
    size: 16,
    color: '#0D9488',
  },
};

/** Larger size */
export const Large: Story = {
  args: {
    size: 64,
    color: '#0D9488',
  },
};

/** Inherits color from parent text */
export const InheritColor: Story = {
  args: {
    size: 32,
    color: 'currentColor',
  },
  decorators: [
    (Story) => (
      <div className="text-blue-500">
        <Story />
      </div>
    ),
  ],
};

/** Dark background */
export const OnDark: Story = {
  args: {
    size: 32,
    color: '#ffffff',
  },
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-gray-900 p-6">
        <Story />
      </div>
    ),
  ],
};
