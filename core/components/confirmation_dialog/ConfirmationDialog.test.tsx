import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmationDialog } from './ConfirmationDialog';

function renderDialog(overrides: Partial<Parameters<typeof ConfirmationDialog>[0]> = {}) {
  return render(
    <ConfirmationDialog open onOpenChange={vi.fn()} message="Are you sure?" {...overrides} />,
  );
}

describe('ConfirmationDialog', () => {
  it('renders the message when open', () => {
    renderDialog();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    renderDialog({ open: false });
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('renders default cancel and confirm labels', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('renders custom cancel and confirm labels', () => {
    renderDialog({ cancelLabel: 'Go back', confirmLabel: 'Yes, delete' });
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument();
  });

  it('calls onCancel and onOpenChange(false) when cancel is clicked', async () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    renderDialog({ onCancel, onOpenChange });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onConfirm and onOpenChange(false) when confirm is clicked', async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    renderDialog({ onConfirm, onOpenChange });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disables the confirm button when confirmDisabled is true', () => {
    renderDialog({ confirmDisabled: true });
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('does not call onConfirm when the confirm button is disabled', async () => {
    const onConfirm = vi.fn();
    renderDialog({ onConfirm, confirmDisabled: true });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
