import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    activeStep: { control: { type: 'number', min: 0, max: 3 } },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const STEPS = [{ label: 'Upload Product' }, { label: 'Review' }, { label: 'Publish' }];

/** Matches the design — step 1 completed, step 2 active */
export const Default: Story = {
  args: {
    steps: [{ label: 'Upload Product' }, { label: 'Review' }],
    activeStep: 1,
  },
};

/** Step 1 active (just started) */
export const FirstStep: Story = {
  args: {
    steps: STEPS,
    activeStep: 0,
  },
};

/** Step 2 active */
export const SecondStep: Story = {
  args: {
    steps: STEPS,
    activeStep: 1,
  },
};

/** All steps completed */
export const AllCompleted: Story = {
  args: {
    steps: STEPS,
    activeStep: 3,
  },
};

/** Many steps */
export const FourSteps: Story = {
  args: {
    steps: [
      { label: 'Upload Product' },
      { label: 'Review' },
      { label: 'Preview' },
      { label: 'Publish' },
    ],
    activeStep: 2,
  },
};
