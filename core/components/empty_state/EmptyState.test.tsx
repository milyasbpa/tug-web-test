import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<EmptyState title="Empty" description="Try adjusting your filters." />);
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('does not render a description element when description is omitted', () => {
    render(<EmptyState title="Empty" />);
    const paragraphs = screen.getAllByRole('paragraph');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent('Empty');
  });

  it('renders the icon when provided', () => {
    render(<EmptyState title="Empty" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders the action when provided', () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />);
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(<EmptyState title="X" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
