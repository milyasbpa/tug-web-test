import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { FormField } from './FormField';

function TestForm({
  label,
  description,
  defaultValue = '',
  required = false,
}: {
  label?: string;
  description?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const methods = useForm<{ email: string }>({ defaultValues: { email: defaultValue } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>
        <FormField
          name="email"
          control={methods.control}
          label={label}
          description={description}
          rules={required ? { required: 'Email is required' } : undefined}
          render={({ field }) => (
            <input data-testid="email-input" placeholder="Enter email" {...field} />
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe('FormField', () => {
  it('renders the wrapped input', () => {
    render(<TestForm />);
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<TestForm label="Email address" />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('does not render a label when omitted', () => {
    render(<TestForm />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders the description when provided and there is no error', () => {
    render(<TestForm description="We will never share your email." />);
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
  });

  it('shows a validation error message after submitting an empty required field', async () => {
    render(<TestForm required />);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('hides the description when a validation error is shown', async () => {
    render(<TestForm required description="Helpful hint" />);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
    });
  });

  it('clears the error once the user provides valid input', async () => {
    render(<TestForm required />);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('email-input'), 'user@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});
