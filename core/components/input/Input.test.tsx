import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders a plain input', () => {
    render(<Input placeholder="Search…" />);
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders left element inside a wrapper', () => {
    render(<Input leftElement={<span data-testid="left-icon" />} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox').closest('div')).toBeInTheDocument();
  });

  it('renders right element inside a wrapper', () => {
    render(<Input rightElement={<span data-testid="right-icon" />} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<Input className="extra-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('extra-class');
  });

  it('passes down type and other native props', () => {
    render(<Input type="number" min={0} max={100} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });
});
