import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { Button } from '@/core/components/button/Button';

import { ConfirmationDialog } from './ConfirmationDialog';

const meta: Meta<typeof ConfirmationDialog> = {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

function DialogDemo({
  message,
  cancelLabel,
  confirmLabel,
}: {
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        message={message}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <DialogDemo
      message="Applying this style will replace your existing style."
      cancelLabel="Cancel"
      confirmLabel="Continue"
    />
  ),
};

export const DeleteConfirmation: Story = {
  render: () => (
    <DialogDemo
      message="Are you sure you want to delete this item? This action cannot be undone."
      cancelLabel="Cancel"
      confirmLabel="Delete"
    />
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <DialogDemo
      message="This will permanently remove the product and all its generated images."
      cancelLabel="Go back"
      confirmLabel="Yes, remove"
    />
  ),
};
