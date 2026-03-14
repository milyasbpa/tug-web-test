'use client';

import { useEffect } from 'react';

// TODO: Integrate with Sentry in Step 11 — Sentry.captureException(error)
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Error Boundary]', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-muted-foreground text-6xl font-bold">500</p>
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        An unexpected error occurred. Please try again or contact support if the issue persists.
      </p>
      {error.digest && (
        <p className="text-muted-foreground font-mono text-xs">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-md px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </main>
  );
}
