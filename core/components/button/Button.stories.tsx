import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkles, Plus, Wand2, Heart } from 'lucide-react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Create',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Default — teal pill, matches the design screenshot */
export const Primary: Story = {
  args: {
    children: (
      <>
        <Sparkles />
        Create
      </>
    ),
  },
};

export const PrimaryLarge: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <Sparkles />
        Create
      </>
    ),
  },
};

export const PrimarySmall: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <Sparkles />
        Create
      </>
    ),
  },
};

export const PrimaryCustomIcon: Story = {
  args: {
    children: (
      <>
        <Plus /> New post
      </>
    ),
  },
};

export const PrimaryMagicWand: Story = {
  args: {
    children: (
      <>
        <Wand2 /> Generate
      </>
    ),
  },
};

export const PrimaryNoIcon: Story = {
  args: { children: 'Publish' },
};

export const PrimaryDisabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Sparkles /> Create
      </>
    ),
  },
};

/** All sizes at a glance */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" size="xs">
        <Sparkles /> Create
      </Button>
      <Button variant="primary" size="sm">
        <Sparkles /> Create
      </Button>
      <Button variant="primary" size="default">
        <Sparkles /> Create
      </Button>
      <Button variant="primary" size="lg">
        <Sparkles /> Create
      </Button>
      <Button variant="primary" size="xl">
        <Sparkles /> Create
      </Button>
    </div>
  ),
};

export const Default: Story = {
  args: { variant: 'default', children: 'Button' },
};

/** Outline pill — matches the "Save this style" design */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Heart />
        Save this style
      </>
    ),
  },
};

export const OutlineSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline" size="sm">
        <Heart /> Save
      </Button>
      <Button variant="outline" size="default">
        <Heart /> Save this style
      </Button>
      <Button variant="outline" size="lg">
        <Heart /> Save this style
      </Button>
    </div>
  ),
};
