'use client';

import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UsageHistoryEntry {
  /** Display date string, e.g. "Feb 12" */
  date: string;
  /** Product name, e.g. "Anti Aging Serum" */
  product: string;
  /** Credits label, e.g. "1 photoshoot" */
  credits: string;
  /** Optional URL to view the photoshoot */
  viewUrl?: string;
  /** Optional click handler for the View action */
  onView?: () => void;
}

export interface UsageHistoryGroup {
  /** Month + year label, e.g. "February 2026" */
  month: string;
  /** Summary label shown on the right, e.g. "3 photoshoots used" */
  summary: string;
  entries: UsageHistoryEntry[];
}

export interface UsageHistoryModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups?: UsageHistoryGroup[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface UsageTableProps {
  entries: UsageHistoryEntry[];
}

function UsageTable({ entries }: UsageTableProps) {
  return (
    <div className="border-border overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border bg-muted/40 border-b">
            <th className="text-muted-foreground px-4 py-2.5 text-left font-medium">Date</th>
            <th className="text-muted-foreground px-4 py-2.5 text-left font-medium">Product</th>
            <th className="text-muted-foreground px-4 py-2.5 text-left font-medium">Credits</th>
            <th className="text-muted-foreground px-4 py-2.5 text-right font-medium" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              className={cn(
                'text-foreground',
                index < entries.length - 1 && 'border-border border-b',
              )}
            >
              <td className="px-4 py-3 whitespace-nowrap">{entry.date}</td>
              <td className="px-4 py-3">{entry.product}</td>
              <td className="px-4 py-3 whitespace-nowrap">{entry.credits}</td>
              <td className="px-4 py-3 text-right">
                {(entry.viewUrl || entry.onView) && (
                  <a
                    href={entry.viewUrl ?? '#'}
                    onClick={
                      entry.onView
                        ? (e) => {
                            if (!entry.viewUrl) e.preventDefault();
                            entry.onView?.();
                          }
                        : undefined
                    }
                    className="text-brand underline-offset-2 hover:underline"
                  >
                    [View]
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UsageHistoryModal({ open, onOpenChange, groups = [] }: UsageHistoryModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
            'bg-background max-h-[90vh] overflow-hidden rounded-2xl shadow-xl',
            'flex flex-col',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          {/* Header */}
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <DialogPrimitive.Title className="text-foreground text-lg font-semibold">
              Usage History
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring rounded-md p-1 transition-colors focus:outline-none focus-visible:ring-2">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {groups.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No usage history yet.
              </p>
            ) : (
              <div className="space-y-6">
                {groups.map((group, gi) => (
                  <div key={gi} className="space-y-3">
                    {/* Month header */}
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium">{group.month}</span>
                      <span className="text-muted-foreground text-sm">{group.summary}</span>
                    </div>

                    {/* Table */}
                    <UsageTable entries={group.entries} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
