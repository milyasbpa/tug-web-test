'use client';

import { type LucideIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/core/lib/utils';

export interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface MenuTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function MenuTabs({ tabs, defaultValue, onChange, className }: MenuTabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? '');

  function handleSelect(value: string) {
    setActive(value);
    onChange?.(value);
  }

  return (
    <div className={cn('bg-muted inline-flex items-center gap-1 rounded-xl p-1', className)}>
      {tabs.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;

        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
