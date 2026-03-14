import { z } from 'zod';

// Colocated with Form.login.tsx — schema lives where it's used (Architecture Rule #5)
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
