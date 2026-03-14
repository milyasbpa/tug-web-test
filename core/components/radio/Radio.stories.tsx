import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { RadioGroup, RadioItem } from './Radio';

const meta: Meta<typeof RadioItem> = {
  title: 'Components/Radio',
  component: RadioItem,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioItem>;

// ─── Single item states ───────────────────────────────────────────────────────

/** Active (checked) state */
export const Checked: Story = {
  render: (args) => (
    <RadioGroup defaultValue="item">
      <RadioItem {...args} value="item" />
    </RadioGroup>
  ),
  args: { size: 'default' },
};

/** Inactive (unchecked) state */
export const Unchecked: Story = {
  render: (args) => (
    <RadioGroup value="">
      <RadioItem {...args} value="item" />
    </RadioGroup>
  ),
  args: { size: 'default' },
};

/** Both states stacked — active on top, inactive below (matches design) */
export const BothStates: Story = {
  render: () => (
    <RadioGroup defaultValue="active">
      <RadioItem value="active" />
      <RadioItem value="inactive" />
    </RadioGroup>
  ),
};

// ─── With labels ──────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: (args) => (
    <RadioGroup defaultValue="a">
      <RadioItem {...args} value="a" label="Option A" />
      <RadioItem {...args} value="b" label="Option B" />
      <RadioItem {...args} value="c" label="Option C" />
    </RadioGroup>
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <RadioGroup defaultValue="sm" orientation="horizontal" className="items-center">
      <RadioItem value="sm" size="sm" label="Small" />
      <RadioItem value="default" size="default" label="Default" />
      <RadioItem value="lg" size="lg" label="Large" />
    </RadioGroup>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <RadioItem value="a" label="Checked & disabled" disabled />
      <RadioItem value="b" label="Unchecked & disabled" disabled />
    </RadioGroup>
  ),
};

// ─── Horizontal ───────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="a" orientation="horizontal">
      <RadioItem value="a" label="Alpha" />
      <RadioItem value="b" label="Beta" />
      <RadioItem value="c" label="Gamma" />
    </RadioGroup>
  ),
};
