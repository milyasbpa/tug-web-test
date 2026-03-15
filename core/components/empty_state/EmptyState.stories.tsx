import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Package } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';

import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No packages found',
    description: 'Create your first wellness package to get started.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Package />,
    title: 'No packages found',
    description: 'Create your first wellness package to get started.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <Package />,
    title: 'No packages found',
    description: 'Create your first wellness package to get started.',
    action: <Button variant="primary">Create package</Button>,
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Nothing to show here.',
  },
};
