/**
 * Query Key Factory — Pattern Template
 *
 * Copy dan sesuaikan pattern ini di setiap feature:
 *   features/[feature]/api/[feature].keys.ts
 *
 * Jangan taruh semua keys di sini — file ini hanya referensi pattern,
 * bukan registry global. Keys per-feature hidup dekat dengan hooks-nya.
 *
 * @example
 *   // features/user/api/user.keys.ts
 *   export const userKeys = createQueryKeys('users');
 *
 *   // usage in hook
 *   queryKey: userKeys.detail(userId)
 */

type KeyTuple = readonly unknown[];

export function createQueryKeys(entity: string) {
  return {
    /** ['entity'] — invalidate everything for this entity */
    all: [entity] as const,

    /** ['entity', 'list'] — list queries */
    lists: (): KeyTuple => [entity, 'list'] as const,

    /** ['entity', 'list', filters] — filtered list queries */
    list: (filters?: Record<string, unknown>): KeyTuple => [entity, 'list', filters] as const,

    /** ['entity', 'detail', id] — single item query */
    detail: (id: string | number): KeyTuple => [entity, 'detail', id] as const,
  };
}

// ─── Example (remove or replace when building features) ────────────────────
// export const exampleKeys = createQueryKeys('example');
//
// Usage:
//   queryKey: exampleKeys.all           → ['example']
//   queryKey: exampleKeys.lists()       → ['example', 'list']
//   queryKey: exampleKeys.list({page})  → ['example', 'list', {page}]
//   queryKey: exampleKeys.detail(id)    → ['example', 'detail', id]
