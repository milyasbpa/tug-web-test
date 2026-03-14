import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn (classnames utility)', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolves Tailwind conflicts (last one wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz');
  });
});
