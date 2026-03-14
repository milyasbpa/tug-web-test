import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/core/components/button/Button';

import { AccountSettingsModal } from './AccountSettingsModal';

const meta: Meta<typeof AccountSettingsModal> = {
  title: 'Components/AccountSettingsModal',
  component: AccountSettingsModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccountSettingsModal>;

function ModalDemo(props: Partial<React.ComponentProps<typeof AccountSettingsModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open account settings
      </Button>
      <AccountSettingsModal
        {...props}
        open={open}
        onOpenChange={setOpen}
        onSave={(values) => {
          console.log('Saved', values);
          setOpen(false);
        }}
        onDeleteAccount={() => console.log('Delete account clicked')}
      />
    </div>
  );
}

export const WithData: Story = {
  render: () => (
    <ModalDemo
      initialValues={{
        firstName: 'Denny',
        lastName: 'Satria',
        email: 'denny@palmcode.com',
      }}
    />
  ),
};

export const Empty: Story = {
  render: () => <ModalDemo />,
};
