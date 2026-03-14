'use client';

import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

export type StepStatus = 'completed' | 'current' | 'upcoming';

export interface StepItem {
  label: string;
  /** Override auto-derived status */
  status?: StepStatus;
}

// ── Context ──────────────────────────────────────────────────────────────────

interface StepperContextValue {
  activeStep: number;
  steps: StepItem[];
}

const StepperContext = React.createContext<StepperContextValue>({
  activeStep: 0,
  steps: [],
});

// ── Stepper (root) ───────────────────────────────────────────────────────────

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0-based index of the currently active step */
  activeStep?: number;
  steps: StepItem[];
}

export function Stepper({ activeStep = 0, steps, className, ...props }: StepperProps) {
  return (
    <StepperContext.Provider value={{ activeStep, steps }}>
      <div
        data-slot="stepper"
        role="list"
        className={cn('flex items-center', className)}
        {...props}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          const status: StepStatus =
            step.status ??
            (index < activeStep ? 'completed' : index === activeStep ? 'current' : 'upcoming');

          return (
            <React.Fragment key={index}>
              <StepItem index={index} status={status} label={step.label} />
              {!isLast && <StepConnector completed={status === 'completed'} />}
            </React.Fragment>
          );
        })}
      </div>
    </StepperContext.Provider>
  );
}

// ── StepConnector ─────────────────────────────────────────────────────────────

function StepConnector({ completed }: { completed: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'mx-3 h-px w-10 shrink-0 transition-colors duration-300',
        completed ? 'bg-foreground' : 'bg-border',
      )}
    />
  );
}

// ── StepItem ──────────────────────────────────────────────────────────────────

interface StepItemProps {
  index: number;
  status: StepStatus;
  label: string;
}

function StepItem({ index, status, label }: StepItemProps) {
  return (
    <div role="listitem" data-status={status} className="flex items-center gap-2">
      <StepIndicator index={index} status={status} />
      <span
        className={cn(
          'text-sm font-medium whitespace-nowrap transition-colors duration-200',
          status === 'completed' || status === 'current'
            ? 'text-foreground'
            : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ── StepIndicator ─────────────────────────────────────────────────────────────

function StepIndicator({ index, status }: { index: number; status: StepStatus }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-200',
        status === 'completed' && 'border-foreground bg-foreground text-background',
        status === 'current' && 'border-foreground bg-background text-foreground',
        status === 'upcoming' && 'border-muted-foreground/40 bg-background text-muted-foreground',
      )}
    >
      {status === 'completed' ? <Check className="size-3.5 stroke-3" /> : <span>{index + 1}</span>}
    </div>
  );
}
