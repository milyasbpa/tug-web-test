import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/core/components/button/Button';

import { EmailVerificationModal } from './EmailVerificationModal';

const meta: Meta<typeof EmailVerificationModal> = {
  title: 'Components/EmailVerificationModal',
  component: EmailVerificationModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof EmailVerificationModal>;

function ModalDemo(props: Partial<React.ComponentProps<typeof EmailVerificationModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <EmailVerificationModal
        {...props}
        open={open}
        onOpenChange={setOpen}
        onCancel={() => {
          console.log('Cancelled');
          setOpen(false);
        }}
        onSend={() => {
          console.log('Verification sent');
          setOpen(false);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalDemo email="denny@google.com" />,
};

export const NoEmail: Story = {
  render: () => <ModalDemo />,
};

export const CustomContent: Story = {
  render: () => (
    <ModalDemo
      email="user@company.com"
      title="Confirm your email change"
      sendLabel="Confirm & send"
    />
  ),
};
