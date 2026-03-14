import { z } from 'zod';

// TODO: Step 5 — Implement full schemas
// Colocated with FormModal.packages.tsx (schema lives where it's used)

export const createPackageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  durationMinutes: z.coerce.number().int().positive('Duration must be a positive integer'),
});

export const updatePackageSchema = createPackageSchema.partial();

export type CreatePackageFormValues = z.infer<typeof createPackageSchema>;
export type UpdatePackageFormValues = z.infer<typeof updatePackageSchema>;
