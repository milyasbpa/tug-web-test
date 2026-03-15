import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a div element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('applies the default animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('merges custom className with defaults', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />);
    expect(container.firstChild).toHaveClass('animate-pulse', 'h-10', 'w-full');
  });

  it('forwards additional HTML props', () => {
    const { container } = render(<Skeleton aria-label="loading" data-testid="skel" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-label', 'loading');
    expect(el).toHaveAttribute('data-testid', 'skel');
  });
});
