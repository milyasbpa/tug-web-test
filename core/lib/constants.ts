export const LIMIT_OPTIONS = [5, 10, 25, 50, 100] as const;
export type LimitOption = (typeof LIMIT_OPTIONS)[number];

export const DEFAULT_LIMIT: LimitOption = 10;
