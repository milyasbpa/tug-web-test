import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GuideCard } from './GuideCard';

const meta: Meta<typeof GuideCard> = {
  title: 'Components/GuideCard',
  component: GuideCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onPlay: () => console.log('play'),
  },
};

export default meta;
type Story = StoryObj<typeof GuideCard>;

/** Matches the design — thumbnail + title + bold description */
export const Default: Story = {
  args: {
    category: 'Guides',
    title: 'How to Create',
    description: 'Your First Photoshoot',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop',
    thumbnailAlt: 'Vacation sunscreen products on a striped towel',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  decorators: [
    (Story) => (
      <div className="w-95">
        <Story />
      </div>
    ),
  ],
};

/** No thumbnail — video plays directly from the placeholder */
export const NoThumbnail: Story = {
  args: {
    category: 'Guides',
    title: 'How to Create',
    description: 'Your First Photoshoot',
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  decorators: [
    (Story) => (
      <div className="w-95">
        <Story />
      </div>
    ),
  ],
};

/** Without title */
export const NoTitle: Story = {
  args: {
    category: 'Guides',
    description: 'Your First Photoshoot',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop',
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  decorators: [
    (Story) => (
      <div className="w-95">
        <Story />
      </div>
    ),
  ],
};

/** Different category */
export const TutorialCategory: Story = {
  args: {
    category: 'Tutorial',
    title: 'Step by Step',
    description: 'Editing Your Product Photos',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop',
  },
  decorators: [
    (Story) => (
      <div className="w-95">
        <Story />
      </div>
    ),
  ],
};
