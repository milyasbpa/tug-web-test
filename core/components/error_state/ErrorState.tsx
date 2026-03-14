import { AlertCircle } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-xl border p-10 text-center',
        className,
      )}
    >
      <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <AlertCircle className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
