import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/core/components/button/Button';

import { BillingPlanModal } from './BillingPlanModal';

const meta: Meta<typeof BillingPlanModal> = {
  title: 'Components/BillingPlanModal',
  component: BillingPlanModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BillingPlanModal>;

function ModalDemo(props: Partial<React.ComponentProps<typeof BillingPlanModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Plan &amp; Billing
      </Button>
      <BillingPlanModal
        {...props}
        open={open}
        onOpenChange={setOpen}
        onManageSubscription={() => console.log('Manage subscription')}
        onSeeBillingDetails={() => console.log('See billing details')}
        onPricingPage={() => console.log('Pricing page')}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ModalDemo
      planName="Starter"
      planPrice="$15/mo"
      nextBillAmount="Rp1,920,000"
      nextBillDate="Feb 20, 2026"
      cardLastFour="8334"
    />
  ),
};

export const Professional: Story = {
  render: () => (
    <ModalDemo
      planName="Professional"
      planPrice="$39/mo"
      nextBillAmount="$39.00"
      nextBillDate="Mar 1, 2026"
      cardLastFour="4242"
    />
  ),
};

export const NoBillingInfo: Story = {
  render: () => <ModalDemo planName="Enterprise" planPrice="Contact sales" />,
};
