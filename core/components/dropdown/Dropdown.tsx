'use client';

import { ChevronDown } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DropdownItemDef {
  /** Unique key */
  id: string;
  /** Icon rendered to the left of the label */
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface DropdownProps {
  /** Text shown on the trigger button */
  label: string;
  /** Icon shown to the left of the label on the trigger */
  triggerIcon?: React.ReactNode;
  /** Menu items */
  items: DropdownItemDef[];
  /** Extra class names for the trigger button */
  className?: string;
}

// ── Dropdown ──────────────────────────────────────────────────────────────────

export function Dropdown({ label, triggerIcon, items, className }: DropdownProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            // Pill trigger — matches design: border, light bg, rounded-full
            'border-border bg-background text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium',
            'hover:bg-accent transition-colors duration-150',
            'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
            // Remove default Radix focus outline on the trigger
            'data-[state=open]:bg-accent',
            className,
          )}
        >
          {triggerIcon && (
            <span className="text-muted-foreground shrink-0 [&_svg]:size-4">{triggerIcon}</span>
          )}
          <span>{label}</span>
          <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={4}
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-45 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md"
        >
          {items.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.id}
              onClick={item.onClick}
              className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 gap-2.5 rounded-sm px-2 py-1.5 py-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              {item.icon && (
                <span className="text-muted-foreground shrink-0 [&_svg]:size-4">{item.icon}</span>
              )}
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
