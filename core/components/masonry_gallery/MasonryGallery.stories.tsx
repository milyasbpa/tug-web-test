import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MasonryGallery, type MasonryItem } from './MasonryGallery';

const meta: Meta<typeof MasonryGallery> = {
  title: 'Components/MasonryGallery',
  component: MasonryGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    columns: { control: { type: 'select' }, options: [2, 3, 4, 5, 6] },
    gap: { control: { type: 'select' }, options: [2, 3, 4, 6] },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MasonryGallery>;

// Unsplash images with varied aspect ratios to showcase masonry effect
const ITEMS: MasonryItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
    alt: 'Perfume bottle',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop',
    alt: 'Fashion model',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&auto=format&fit=crop',
    alt: 'Fragrance product',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&auto=format&fit=crop',
    alt: 'Fashion portrait',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&auto=format&fit=crop',
    alt: 'Luxury perfume',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop',
    alt: 'Fashion editorial',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop',
    alt: 'Skincare product',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop',
    alt: 'Beauty portrait',
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&auto=format&fit=crop',
    alt: 'Floral fragrance',
  },
  {
    id: '10',
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop',
    alt: 'Fashion model editorial',
  },
  {
    id: '11',
    src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop',
    alt: 'Makeup products',
  },
  {
    id: '12',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
    alt: 'Portrait',
  },
];

/** Matches the design — 5 columns masonry layout */
export const Default: Story = {
  args: {
    items: ITEMS,
    columns: 5,
    gap: 3,
    rounded: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};

export const ThreeColumns: Story = {
  args: {
    items: ITEMS,
    columns: 3,
    gap: 3,
    rounded: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};

export const FourColumns: Story = {
  args: {
    items: ITEMS,
    columns: 4,
    gap: 4,
    rounded: 'xl',
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};

/** Clickable items */
export const Clickable: Story = {
  args: {
    items: ITEMS.map((item) => ({
      ...item,
      onClick: (i) => alert(`Clicked: ${i.alt}`),
    })),
    columns: 5,
    gap: 3,
    rounded: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};
