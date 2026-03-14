'use client';

import * as React from 'react';

import { FormLogin } from '../sections/form/Form.login';

// ── LoginContainer ─────────────────────────────────────────────────────────────
// Layout orchestrator only — zero state, zero props passed to sections.
// All behavior lives inside the sections themselves.
export function LoginContainer() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <FormLogin />
    </main>
  );
}
