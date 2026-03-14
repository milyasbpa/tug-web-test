import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/core/components/button/Button';

import { SettingsModal, type NotificationSetting } from './SettingsModal';

const meta: Meta<typeof SettingsModal> = {
  title: 'Components/SettingsModal',
  component: SettingsModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SettingsModal>;

function ModalDemo(props: Partial<React.ComponentProps<typeof SettingsModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <SettingsModal {...props} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const AllOff: Story = {
  render: () => (
    <ModalDemo
      notifications={[
        { id: 'photoshoot_completed', label: 'Photoshoot completed', enabled: false },
        { id: 'credit_low', label: 'Credit low', enabled: false },
        { id: 'credit_empty', label: 'Credit empty', enabled: false },
        { id: 'new_features', label: 'New features', enabled: false },
        { id: 'promotions_offers', label: 'Promotions & offers', enabled: false },
      ]}
    />
  ),
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: 'photoshoot_completed', label: 'Photoshoot completed', enabled: true },
    { id: 'credit_low', label: 'Credit low', enabled: true },
    { id: 'credit_empty', label: 'Credit empty', enabled: false },
    { id: 'new_features', label: 'New features', enabled: true },
    { id: 'promotions_offers', label: 'Promotions & offers', enabled: false },
  ]);

  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open settings (controlled)
      </Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        notifications={notifications}
        onNotificationChange={(id, enabled) =>
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, enabled } : n)))
        }
        helpLinks={[
          { id: 'video_guides', label: 'Video guides', href: 'https://example.com' },
          { id: 'privacy', label: 'Privacy', href: 'https://example.com/privacy' },
          { id: 'terms', label: 'Terms of Service', href: 'https://example.com/terms' },
          {
            id: 'get_support',
            label: 'Get Support',
            onClick: () => console.log('Support clicked'),
          },
        ]}
      />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
