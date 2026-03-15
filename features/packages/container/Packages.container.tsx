'use client';

import * as React from 'react';

import { DeleteDialogPackages } from '../sections/delete-dialog/DeleteDialog.packages';
import { FormModalPackages } from '../sections/form-modal/FormModal.packages';
import { TablePackages } from '../sections/table/Table.packages';

export function PackagesContainer() {
  return (
    <div className="space-y-6 p-6">
      <TablePackages />
      <FormModalPackages />
      <DeleteDialogPackages />
    </div>
  );
}
