'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive up-to-2-char initials from a display name. */
function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full select-none ring-2 ring-border ring-offset-1 ring-offset-background',
  {
    variants: {
      size: {
        xs: 'size-6 text-[10px]',
        sm: 'size-8 text-xs',
        default: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-lg',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AvatarProps
  extends
    Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, 'size'>,
    VariantProps<typeof avatarVariants> {
  /** URL of the avatar image. */
  src?: string;
  /** Alt text for the image (also used to derive initials). */
  alt?: string;
  /** Display name used to generate initials when no image is available. */
  name?: string;
  /** Explicit initials override. Falls back to deriving from `name`. */
  initials?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Avatar — displays a user photo or falls back to initials.
 *
 * ```tsx
 * <Avatar src="/photo.jpg" alt="John Doe" name="John Doe" />
 * <Avatar name="Dan Smith" />          // shows "DS"
 * <Avatar initials="JD" size="lg" />
 * ```
 */
export function Avatar({
  src,
  alt,
  name,
  initials,
  size = 'default',
  className,
  ...props
}: AvatarProps) {
  const fallbackText = initials ?? getInitials(name ?? alt);

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          data-slot="avatar-image"
          src={src}
          alt={alt ?? name ?? 'avatar'}
          className="aspect-square size-full"
        />
      )}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className="bg-background text-foreground flex size-full items-center justify-center rounded-full font-medium"
      >
        {fallbackText}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
