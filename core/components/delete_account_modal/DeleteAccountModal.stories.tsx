import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/core/components/button/Button';

import { DeleteAccountModal } from './DeleteAccountModal';

const meta: Meta<typeof DeleteAccountModal> = {
  title: 'Components/DeleteAccountModal',
  component: DeleteAccountModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteAccountModal>;

function ModalDemo(props: Partial<React.ComponentProps<typeof DeleteAccountModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <DeleteAccountModal
        {...props}
        open={open}
        onOpenChange={setOpen}
        onCancel={() => {
          console.log('Cancelled');
          setOpen(false);
        }}
        onDelete={() => {
          console.log('Account deleted');
          setOpen(false);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalDemo confirmationEmail="denny@palmcode.com" />,
};

export const NoConfirmationInput: Story = {
  render: () => <ModalDemo />,
};

export const CustomEmail: Story = {
  render: () => <ModalDemo confirmationEmail="user@example.com" />,
};
