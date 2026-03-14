import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/core/components/button/Button';

import { SubscriptionPlanModal } from './SubscriptionPlanModal';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=840&h=1360&fit=crop';

const meta: Meta<typeof SubscriptionPlanModal> = {
  title: 'Components/SubscriptionPlanModal',
  component: SubscriptionPlanModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SubscriptionPlanModal>;

// ── Controlled wrapper ─────────────────────────────────────────────────────────

function ModalDemo(props: Partial<React.ComponentProps<typeof SubscriptionPlanModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-muted/40 flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open plan modal
      </Button>
      <SubscriptionPlanModal
        {...props}
        open={open}
        onOpenChange={setOpen}
        heroImageUrl={props.heroImageUrl ?? HERO_IMAGE}
        onCtaClick={() => {
          console.log('CTA clicked');
          setOpen(false);
        }}
        onComparisonClick={() => console.log('See full comparison')}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const MonthlyDefault: Story = {
  render: () => <ModalDemo billingCycle="monthly" />,
};

export const StarterSelected: Story = {
  render: () => <ModalDemo selectedPlanId="starter" />,
};

export const EnterpriseSelected: Story = {
  render: () => <ModalDemo selectedPlanId="enterprise" />,
};

export const NoHeroImage: Story = {
  render: () => <ModalDemo heroImageUrl={undefined} />,
};
