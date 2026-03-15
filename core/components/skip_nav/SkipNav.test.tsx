import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SkipNavLink } from './SkipNav';

describe('SkipNavLink', () => {
  it('renders a link with text "Skip to main content"', () => {
    render(<SkipNavLink />);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument();
  });

  it('points to the default #main-content anchor', () => {
    render(<SkipNavLink />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#main-content');
  });

  it('points to a custom contentId when provided', () => {
    render(<SkipNavLink contentId="content" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#content');
  });

  it('applies the sr-only class so it is visually hidden by default', () => {
    render(<SkipNavLink />);
    expect(screen.getByRole('link')).toHaveClass('sr-only');
  });

  it('accepts a custom className', () => {
    render(<SkipNavLink className="extra-class" />);
    expect(screen.getByRole('link')).toHaveClass('extra-class');
  });
});
