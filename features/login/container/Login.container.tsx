'use client';

import * as React from 'react';

import { FormLogin } from '../sections/form/Form.login';

export function LoginContainer() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <FormLogin />
    </main>
  );
}
