'use client';

import * as React from 'react';

import { DeleteDialogPackages } from '../sections/delete-dialog/DeleteDialog.packages';
import { FormModalPackages } from '../sections/form-modal/FormModal.packages';
import { TablePackages } from '../sections/table/Table.packages';

// ── PackagesContainer ──────────────────────────────────────────────────────────
// Layout orchestrator only — zero state, zero props passed to sections.
// Sections communicate via packages.store.ts (Zustand), not via container props.
export function PackagesContainer() {
  return (
    <div className="space-y-6 p-6">
      <TablePackages />
      <FormModalPackages />
      <DeleteDialogPackages />
    </div>
  );
}
