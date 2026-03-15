'use client';

import { useEffect } from 'react';

/**
 * NumberInputGuard — disables scroll-wheel behaviour on <input type="number"> globally.
 * Mounted once at the root layout level.
 */
export function NumberInputGuard() {
  useEffect(() => {
    function handleWheel(this: HTMLInputElement) {
      this.blur();
    }

    function onFocus(e: FocusEvent) {
      const el = e.target as HTMLElement;
      if (el instanceof HTMLInputElement && el.type === 'number') {
        el.addEventListener('wheel', handleWheel);
      }
    }

    function onBlur(e: FocusEvent) {
      const el = e.target as HTMLElement;
      if (el instanceof HTMLInputElement && el.type === 'number') {
        el.removeEventListener('wheel', handleWheel);
      }
    }

    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
    return () => {
      document.removeEventListener('focus', onFocus, true);
      document.removeEventListener('blur', onBlur, true);
    };
  }, []);

  return null;
}
