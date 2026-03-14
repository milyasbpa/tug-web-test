import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Dan Smith',
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    src: { control: 'text' },
    name: { control: 'text' },
    initials: { control: 'text' },
    alt: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/** Default — shows initials derived from the name prop */
export const Default: Story = {};

/** Explicit initials override */
export const WithInitials: Story = {
  args: {
    initials: 'DS',
    name: undefined,
  },
};

/** With a real photo — falls back to initials if the image fails to load */
export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    name: 'Dan Smith',
    alt: 'Dan Smith',
  },
};

/** Broken image src — fallback initials are shown */
export const BrokenImage: Story = {
  args: {
    src: 'https://this-url-does-not-exist.xyz/photo.jpg',
    name: 'Dan Smith',
  },
};

/** No name or initials — shows "?" as fallback */
export const NoName: Story = {
  args: {
    name: undefined,
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeXS: Story = {
  args: { size: 'xs', name: 'Dan Smith' },
};

export const SizeSM: Story = {
  args: { size: 'sm', name: 'Dan Smith' },
};

export const SizeLG: Story = {
  args: { size: 'lg', name: 'Dan Smith' },
};

export const SizeXL: Story = {
  args: { size: 'xl', name: 'Dan Smith' },
};

/** All sizes side by side */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Dan Smith" size="xs" />
      <Avatar name="Dan Smith" size="sm" />
      <Avatar name="Dan Smith" size="default" />
      <Avatar name="Dan Smith" size="lg" />
      <Avatar name="Dan Smith" size="xl" />
    </div>
  ),
};

/** With images at all sizes */
export const AllSizesWithImage: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar src="https://i.pravatar.cc/150?img=12" name="Dan Smith" size="xs" />
      <Avatar src="https://i.pravatar.cc/150?img=12" name="Dan Smith" size="sm" />
      <Avatar src="https://i.pravatar.cc/150?img=12" name="Dan Smith" size="default" />
      <Avatar src="https://i.pravatar.cc/150?img=12" name="Dan Smith" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=12" name="Dan Smith" size="xl" />
    </div>
  ),
};
