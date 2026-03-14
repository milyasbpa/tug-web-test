import { describe, expect, it } from 'vitest';

import { packageFormSchema } from './form-modal.packages.schema';

const validData = {
  name: 'Deep Tissue Massage',
  description: 'A therapeutic massage targeting deep muscle layers.',
  price: 120,
  durationMinutes: 60,
};

describe('packageFormSchema', () => {
  it('errors when name is empty', () => {
    const result = packageFormSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name is required');
    }
  });

  it('errors when price is 0', () => {
    const result = packageFormSchema.safeParse({ ...validData, price: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Price must be greater than 0');
    }
  });

  it('errors when price is negative', () => {
    const result = packageFormSchema.safeParse({ ...validData, price: -10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Price must be greater than 0');
    }
  });

  it('errors when durationMinutes is not an integer', () => {
    const result = packageFormSchema.safeParse({ ...validData, durationMinutes: 45.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Duration must be a whole number');
    }
  });

  it('succeeds when all data is valid', () => {
    const result = packageFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });
});
