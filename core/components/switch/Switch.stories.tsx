import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
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
type Story = StoryObj<typeof Switch>;

/** Active (checked) state — matches design */
export const Checked: Story = {
  args: { defaultChecked: true },
};

/** Inactive (unchecked) state */
export const Unchecked: Story = {
  args: { defaultChecked: false },
};

/** Both states side by side */
export const BothStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch defaultChecked />
      <Switch />
    </div>
  ),
};

/** With a label */
export const WithLabel: Story = {
  args: {
    defaultChecked: true,
    label: 'Enable notifications',
  },
};

/** All three sizes */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch size="sm" defaultChecked label="Small" />
      <Switch size="default" defaultChecked label="Default" />
      <Switch size="lg" defaultChecked label="Large" />
    </div>
  ),
};

/** Disabled states */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch defaultChecked disabled label="Checked & disabled" />
      <Switch disabled label="Unchecked & disabled" />
    </div>
  ),
};

function ControlledSwitch() {
  const [checked, setChecked] = React.useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} label={checked ? 'On' : 'Off'} />;
}

/** Controlled example */
export const Controlled: Story = {
  render: () => <ControlledSwitch />,
};
