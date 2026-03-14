'use client';

import { Compass, FolderKanban } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { BillingPlanModal } from '@/core/components/billing_plan_modal/BillingPlanModal';
import { Navbar } from '@/core/components/navbar/Navbar';
import { SettingsModal } from '@/core/components/settings_modal/SettingsModal';
import { type TabItem } from '@/core/components/tab_menu/TabMenu';
import { UsageHistoryModal } from '@/core/components/usage_history_modal/UsageHistoryModal';
import { useRouter, usePathname } from '@/core/i18n/navigation';

// ── Dummy data ────────────────────────────────────────────────────────────────

const DUMMY_USAGE_HISTORY = [
  {
    month: 'February 2026',
    summary: '3 photoshoots used',
    entries: [
      { date: 'Feb 20', product: 'Anti Aging Serum', credits: '1 photoshoot' },
      { date: 'Feb 14', product: 'Vanilla Perfume', credits: '1 photoshoot' },
      { date: 'Feb 05', product: 'Moisturizer Cream', credits: '1 photoshoot' },
    ],
  },
  {
    month: 'January 2026',
    summary: '2 photoshoots used',
    entries: [
      { date: 'Jan 28', product: 'Face Wash Foam', credits: '1 photoshoot' },
      { date: 'Jan 13', product: 'Acme Night Serum', credits: '1 photoshoot' },
    ],
  },
];

// ── Tab structure (icons only — labels come from i18n) ─────────────────────
//
// Exported for stories that render <Navbar> or <MenuTabs> directly and need a
// tabs prop. Stories use the withNextIntl decorator so translations are live,
// but args are resolved at definition time — static English labels are fine.

export const NAV_TABS: TabItem[] = [
  { value: 'explore', label: 'Explore', icon: Compass },
  { value: 'projects', label: 'Projects', icon: FolderKanban },
];

// ── NavbarModule ──────────────────────────────────────────────────────────────
//
// Smart wrapper around <Navbar> that owns the open/close state for all
// profile-dropdown modals. Drop it in any page with zero props.
//
// <NavbarModule />

export interface NavigationModuleProps {
  defaultUsageHistoryOpen?: boolean;
  onUsageHistoryOpenChange?: (open: boolean) => void;
  defaultBillingOpen?: boolean;
  onBillingOpenChange?: (open: boolean) => void;
  defaultSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
}

export function NavigationModule({
  defaultUsageHistoryOpen = false,
  onUsageHistoryOpenChange,
  defaultBillingOpen = false,
  onBillingOpenChange,
  defaultSettingsOpen = false,
  onSettingsOpenChange,
}: NavigationModuleProps = {}) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();

  // Derive active tab from current pathname segment.
  // Returns undefined when on home ('/') so no tab is highlighted.
  const activeTab = pathname.split('/').filter(Boolean)[0];

  const navTabs: TabItem[] = [
    { value: 'explore', label: t('menu.explore'), icon: Compass },
    { value: 'projects', label: t('menu.projects'), icon: FolderKanban },
  ];

  const handleTabChange = (value: string) => {
    router.push(`/${value}`);
  };

  const [usageHistoryOpen, setUsageHistoryOpen] = React.useState(defaultUsageHistoryOpen);
  const [billingOpen, setBillingOpen] = React.useState(defaultBillingOpen);
  const [settingsOpen, setSettingsOpen] = React.useState(defaultSettingsOpen);

  const handleUsageHistoryChange = (open: boolean) => {
    setUsageHistoryOpen(open);
    onUsageHistoryOpenChange?.(open);
  };

  const handleBillingChange = (open: boolean) => {
    setBillingOpen(open);
    onBillingOpenChange?.(open);
  };

  const handleSettingsChange = (open: boolean) => {
    setSettingsOpen(open);
    onSettingsOpenChange?.(open);
  };

  return (
    <>
      <Navbar
        tabs={navTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreateClick={() => console.log('Create clicked')}
        user={{
          name: 'Denny Satria',
          email: 'denny@example.com',
        }}
        quota={{
          remaining: 10,
          renewDate: 'January 13th 2026',
        }}
        onUsageHistory={() => handleUsageHistoryChange(true)}
        onPlanBilling={() => handleBillingChange(true)}
        onSettings={() => handleSettingsChange(true)}
        onLogOut={() => console.log('Log out')}
      />

      <UsageHistoryModal
        open={usageHistoryOpen}
        onOpenChange={handleUsageHistoryChange}
        groups={DUMMY_USAGE_HISTORY}
      />

      <BillingPlanModal
        open={billingOpen}
        onOpenChange={handleBillingChange}
        planName="Starter"
        planPrice="$15/mo"
        nextBillAmount="Rp1,920,000"
        nextBillDate="Feb 20, 2026"
        cardLastFour="4242"
        onSeeBillingDetails={() => console.log('See billing details')}
        onManageSubscription={() => console.log('Manage subscription')}
        onPricingPage={() => console.log('Pricing page')}
      />

      <SettingsModal open={settingsOpen} onOpenChange={handleSettingsChange} />
    </>
  );
}
