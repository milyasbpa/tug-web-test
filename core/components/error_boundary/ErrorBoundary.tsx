'use client';

import React from 'react';

import { ErrorState } from '@/core/components/error_state';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Generic React error boundary for client components.
 * Next.js error.tsx only catches errors in Server Components and async boundaries.
 * This component catches errors inside client-side component trees ('use client').
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeClientComponent />
 *   </ErrorBoundary>
 *
 *   // With custom fallback:
 *   <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *     <SomeClientComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);

    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Something went wrong"
          description={
            process.env.NODE_ENV === 'development'
              ? (this.state.error?.message ?? 'An unexpected error occurred')
              : 'An unexpected error occurred'
          }
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
