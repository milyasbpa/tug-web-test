import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GalleriesHome } from './Galleries.home';

const meta: Meta<typeof GalleriesHome> = {
  title: 'Pages/Home/sections/Galleries',
  component: GalleriesHome,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    viewport: {
      defaultViewport: 'xl',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalleriesHome>;

export const Default: Story = {};
