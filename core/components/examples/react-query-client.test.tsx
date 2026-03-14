import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/core/testing/msw/server';

import { ReactQueryClientExample } from './react-query-client';

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('ReactQueryClientExample', () => {
  it('displays a loading state initially', () => {
    render(<ReactQueryClientExample />, { wrapper });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays guide card items from the API', async () => {
    render(<ReactQueryClientExample />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('guide-1')).toBeInTheDocument();
      expect(screen.getByText('guide-2')).toBeInTheDocument();
    });
  });

  it('displays an error state when the API fails', async () => {
    server.use(
      http.get('http://localhost/api/home/guide-cards', () => {
        return HttpResponse.error();
      }),
    );

    render(<ReactQueryClientExample />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Failed to load.')).toBeInTheDocument();
    });
  });
});
