import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('returns null when totalPages <= 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders prev and next buttons', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('calls onPageChange with page - 1 when previous is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page + 1 when next is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with specific page when a page button is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders all page numbers when totalPages <= 7', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: `Page ${i}` })).toBeInTheDocument();
    }
  });

  it('renders ellipsis spans for large page ranges', () => {
    const { container } = render(<Pagination page={5} totalPages={20} onPageChange={vi.fn()} />);
    const ellipsisSpans = container.querySelectorAll('span[aria-hidden]');
    expect(ellipsisSpans.length).toBeGreaterThan(0);
  });

  it('disables all interactive buttons when isLoading is true', () => {
    render(<Pagination page={3} totalPages={10} onPageChange={vi.fn()} isLoading />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('accepts custom prev/next labels', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        onPageChange={vi.fn()}
        labels={{ prev: 'Back', next: 'Forward' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument();
  });
});
