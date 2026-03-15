'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/components/button';
import { FormField } from '@/core/components/form_field';
import { Input } from '@/core/components/input';
import { cn } from '@/core/lib/utils';
import { useCreatePackage } from '@/features/packages/react-query/use-create-package';
import { useUpdatePackage } from '@/features/packages/react-query/use-update-package';
import { usePackagesStore } from '@/features/packages/store/packages.store';

import { packageFormSchema, type PackageFormValues } from './form-modal.packages.schema';

export function FormModalPackages() {
  const t = useTranslations('packages');

  const modalMode = usePackagesStore((s) => s.modalMode);
  const selectedPackage = usePackagesStore((s) => s.selectedPackage);
  const closeModal = usePackagesStore((s) => s.closeModal);

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();

  const isPending = createPackage.isPending || updatePackage.isPending;

  const { control, handleSubmit, reset } = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: { name: '', description: '' } as PackageFormValues,
  });

  React.useEffect(() => {
    if (modalMode === 'edit' && selectedPackage) {
      reset({
        name: selectedPackage.name,
        description: selectedPackage.description,
        price: selectedPackage.price,
        durationMinutes: selectedPackage.durationMinutes,
      });
    } else if (modalMode === 'create') {
      reset({ name: '', description: '' } as PackageFormValues);
    }
  }, [modalMode, selectedPackage, reset]);

  const open = modalMode === 'create' || modalMode === 'edit';
  const isEditMode = modalMode === 'edit';

  function onSubmit(values: PackageFormValues) {
    if (isEditMode && selectedPackage) {
      updatePackage.mutate({ id: selectedPackage.id, data: values });
    } else {
      createPackage.mutate({ data: values });
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && closeModal()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
            'flex flex-col gap-6 rounded-2xl border p-6 shadow-lg duration-200 outline-none',
          )}
        >
          {/* Header */}
          <DialogPrimitive.Title className="text-foreground text-lg font-semibold">
            {isEditMode ? t('editPackage') : t('addPackage')}
          </DialogPrimitive.Title>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name */}
            <FormField
              name="name"
              control={control}
              label={t('form.name')}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder={t('form.namePlaceholder')}
                  aria-invalid={!!fieldState.error}
                  disabled={isPending}
                />
              )}
            />

            {/* Description */}
            <FormField
              name="description"
              control={control}
              label={t('form.description')}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="description"
                  placeholder={t('form.descriptionPlaceholder')}
                  aria-invalid={!!fieldState.error}
                  disabled={isPending}
                />
              )}
            />

            {/* Price */}
            <FormField
              name="price"
              control={control}
              label={t('form.price')}
              render={({ field, fieldState }) => (
                <Input
                  id="price"
                  type="number"
                  value={
                    field.value === undefined || isNaN(field.value as number) ? '' : field.value
                  }
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={!!fieldState.error}
                  disabled={isPending}
                />
              )}
            />

            {/* Duration */}
            <FormField
              name="durationMinutes"
              control={control}
              label={t('form.durationMinutes')}
              render={({ field, fieldState }) => (
                <Input
                  id="durationMinutes"
                  type="number"
                  value={
                    field.value === undefined || isNaN(field.value as number) ? '' : field.value
                  }
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={!!fieldState.error}
                  disabled={isPending}
                />
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 rounded-xl"
                onClick={closeModal}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 rounded-xl"
                disabled={isPending}
                aria-label={isPending ? t('form.saving') : t('form.save')}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t('form.saving')}
                  </>
                ) : (
                  t('form.save')
                )}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
