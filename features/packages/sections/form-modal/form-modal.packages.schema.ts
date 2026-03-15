import { z } from 'zod';

export const packageFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  price: z.number({ error: 'Price must be a number' }).positive('Price must be greater than 0'),
  durationMinutes: z
    .number({ error: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .positive('Duration must be greater than 0'),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;
