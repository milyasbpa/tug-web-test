import { describe, expect, it } from 'vitest';

import { formatDuration, formatPrice } from './packages.utils';

describe('formatPrice', () => {
  it('formats a whole number to USD string', () => {
    expect(formatPrice(120)).toBe('$120.00');
  });

  it('formats a decimal price correctly', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('formats zero to $0.00', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats large price with comma separator', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatPrice(1.555)).toBe('$1.56');
  });
});

describe('formatDuration', () => {
  it('formats 60 minutes', () => {
    expect(formatDuration(60)).toBe('60 min');
  });

  it('formats 120 minutes', () => {
    expect(formatDuration(120)).toBe('120 min');
  });

  it('formats 45 minutes', () => {
    expect(formatDuration(45)).toBe('45 min');
  });

  it('formats 0 minutes', () => {
    expect(formatDuration(0)).toBe('0 min');
  });

  it('formats 1 minute', () => {
    expect(formatDuration(1)).toBe('1 min');
  });
});
