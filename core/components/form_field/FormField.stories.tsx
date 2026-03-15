import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/core/components/button/Button';
import { Input } from '@/core/components/input/Input';

import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormField>;

function DefaultStory() {
  const methods = useForm({ defaultValues: { email: '' } });
  return (
    <FormProvider {...methods}>
      <form className="space-y-4">
        <FormField
          name="email"
          control={methods.control}
          label="Email address"
          render={({ field }) => <Input type="email" placeholder="you@example.com" {...field} />}
        />
      </form>
    </FormProvider>
  );
}

function WithDescriptionStory() {
  const methods = useForm({ defaultValues: { email: '' } });
  return (
    <FormProvider {...methods}>
      <form className="space-y-4">
        <FormField
          name="email"
          control={methods.control}
          label="Email address"
          description="We will never share your email with anyone."
          render={({ field }) => <Input type="email" placeholder="you@example.com" {...field} />}
        />
      </form>
    </FormProvider>
  );
}

function WithErrorStory() {
  const methods = useForm({
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})} className="space-y-4">
        <FormField
          name="email"
          control={methods.control}
          label="Email address"
          rules={{ required: 'Email is required' }}
          render={({ field }) => <Input type="email" placeholder="you@example.com" {...field} />}
        />
        <Button type="submit" variant="primary" className="w-full">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export const Default: Story = { render: () => <DefaultStory /> };

export const WithDescription: Story = { render: () => <WithDescriptionStory /> };

/** Submit the form without filling in the field to see the validation error */
export const WithValidation: Story = { render: () => <WithErrorStory /> };
