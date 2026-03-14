'use client';

import { useEffect } from 'react';

// Scoped error boundary for the (dashboard) route group.
// Catches errors thrown inside dashboard pages without affecting the global layout.
// TODO: Integrate with Sentry in Step 11 — Sentry.captureException(error)
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error Boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        An error occurred while loading this page. Please try again.
      </p>
      {error.digest && (
        <p className="text-muted-foreground font-mono text-xs">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
