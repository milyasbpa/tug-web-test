'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ── Re-export primitives unchanged ──────────────────────────────────────────

const Tab = TabsPrimitive.Root;
Tab.displayName = 'Tab';

const TabContent = TabsPrimitive.Content;
TabContent.displayName = 'TabContent';

// ── TabList ──────────────────────────────────────────────────────────────────
// Horizontal strip with a bottom border line.

function TabList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tab-list"
      className={cn('flex items-end gap-6', className)}
      {...props}
    />
  );
}

// ── TabTrigger ────────────────────────────────────────────────────────────────
// Each tab item: gray by default, bold black + underline when active.

function TabTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tab-trigger"
      className={cn(
        // base
        '-mb-px border-b-2 border-transparent',
        'text-muted-foreground pb-3 text-sm whitespace-nowrap',
        'cursor-pointer transition-colors duration-150 select-none',
        'focus-visible:outline-ring/50 outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
        // active state
        'data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold',
        className,
      )}
      {...props}
    />
  );
}

export { Tab, TabList, TabTrigger, TabContent };
