import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RowsPerPage } from './RowsPerPage';

const OPTIONS = [5, 10, 25, 50] as const;

describe('RowsPerPage', () => {
  it('renders the default label', () => {
    render(<RowsPerPage value={10} options={OPTIONS} onChange={vi.fn()} />);
    expect(screen.getByText('Rows per page')).toBeInTheDocument();
  });

  it('renders all options in the select', () => {
    render(<RowsPerPage value={10} options={OPTIONS} onChange={vi.fn()} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    for (const opt of OPTIONS) {
      expect(screen.getByRole('option', { name: String(opt) })).toBeInTheDocument();
    }
  });

  it('shows the current value as selected', () => {
    render(<RowsPerPage value={25} options={OPTIONS} onChange={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveValue('25');
  });

  it('calls onChange with the new numeric value on change', async () => {
    const onChange = vi.fn();
    render(<RowsPerPage value={10} options={OPTIONS} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), '25');
    expect(onChange).toHaveBeenCalledWith(25);
  });

  it('disables the select when disabled prop is true', () => {
    render(<RowsPerPage value={10} options={OPTIONS} onChange={vi.fn()} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders a custom label when provided', () => {
    render(<RowsPerPage value={10} options={OPTIONS} onChange={vi.fn()} label="Items per page" />);
    expect(screen.getByText('Items per page')).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <RowsPerPage value={10} options={OPTIONS} onChange={vi.fn()} className="my-class" />,
    );
    expect(container.firstChild).toHaveClass('my-class');
  });
});
