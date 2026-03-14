// ── Package utilities ──────────────────────────────────────────────────────────

/**
 * Format a price number to USD currency string.
 * e.g. 99.99 → "$99.99"
 * e.g. 120   → "$120.00"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Format duration in minutes to a human-readable string.
 * Uses "X min" consistently for clarity in wellness context.
 * e.g. 60  → "60 min"
 * e.g. 120 → "120 min"
 */
export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}
