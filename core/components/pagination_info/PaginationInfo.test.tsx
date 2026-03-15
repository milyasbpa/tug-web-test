import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PaginationInfo } from './PaginationInfo';

describe('PaginationInfo', () => {
  it('renders the default template text', () => {
    render(<PaginationInfo from={1} to={10} total={50} />);
    expect(screen.getByText('Showing 1–10 of 50')).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<PaginationInfo from={1} to={10} total={50} label="Items 1 to 10 of 50" />);
    expect(screen.getByText('Items 1 to 10 of 50')).toBeInTheDocument();
    expect(screen.queryByText('Showing 1–10 of 50')).not.toBeInTheDocument();
  });

  it('applies a custom className', () => {
    render(<PaginationInfo from={1} to={5} total={20} className="custom-class" />);
    expect(screen.getByText('Showing 1–5 of 20')).toHaveClass('custom-class');
  });
});
