import { describe, expect, it } from 'vitest';

import { loginSchema } from './form.login.schema';

describe('loginSchema', () => {
  describe('email', () => {
    it('rejects empty email', () => {
      const result = loginSchema.safeParse({ email: '', password: 'password123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Please enter a valid email address');
      }
    });

    it('rejects invalid email format', () => {
      const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Please enter a valid email address');
      }
    });

    it('rejects email without domain', () => {
      const result = loginSchema.safeParse({ email: 'user@', password: 'password123' });
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    it('rejects password shorter than 8 characters', () => {
      const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Password must be at least 8 characters');
      }
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('valid data', () => {
    it('accepts valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'admin@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('parse() succeeds without throwing for valid data', () => {
      expect(() =>
        loginSchema.parse({ email: 'admin@example.com', password: 'password123' }),
      ).not.toThrow();
    });

    it('accepts exactly 8-character password', () => {
      const result = loginSchema.safeParse({ email: 'user@example.com', password: '12345678' });
      expect(result.success).toBe(true);
    });
  });
});
