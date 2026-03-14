import { z } from 'zod';

const envSchema = z.object({
  // Public — exposed to browser
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  /** Production domain for metadataBase + robots.txt. Set in .env.production. */
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Server-only
  DATABASE_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
