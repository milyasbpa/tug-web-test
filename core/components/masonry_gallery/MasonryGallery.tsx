import * as React from 'react';

import { cn } from '@/core/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MasonryItem {
  id: string;
  src: string;
  alt?: string;
  /** Optional click handler per item */
  onClick?: (item: MasonryItem) => void;
}

// ── MasonryGallery ────────────────────────────────────────────────────────────

export interface MasonryGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MasonryItem[];
  /**
   * Number of columns.
   * Pass a Tailwind-style responsive object or a fixed number.
   * Defaults to 5.
   */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Gap between items in Tailwind spacing units. Defaults to 3 (12px). */
  gap?: 2 | 3 | 4 | 6;
  /** Border radius applied to each image. Defaults to "lg". */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const columnsClass: Record<NonNullable<MasonryGalleryProps['columns']>, string> = {
  2: 'columns-2',
  3: 'columns-3',
  4: 'columns-4',
  5: 'columns-5',
  6: 'columns-6',
};

const gapClass: Record<NonNullable<MasonryGalleryProps['gap']>, string> = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
};

/** Vertical spacing between items in the same column */
const mbClass: Record<NonNullable<MasonryGalleryProps['gap']>, string> = {
  2: 'mb-2',
  3: 'mb-3',
  4: 'mb-4',
  6: 'mb-6',
};

const roundedClass: Record<NonNullable<MasonryGalleryProps['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export function MasonryGallery({
  items,
  columns = 5,
  gap = 3,
  rounded = 'lg',
  className,
  ...props
}: MasonryGalleryProps) {
  return (
    <div
      data-slot="masonry-gallery"
      className={cn(columnsClass[columns], gapClass[gap], 'w-full', className)}
      {...props}
    >
      {items.map((item) => (
        <MasonryItem key={item.id} item={item} rounded={rounded} gap={gap} />
      ))}
    </div>
  );
}

// ── MasonryItem ───────────────────────────────────────────────────────────────

interface MasonryItemProps {
  item: MasonryItem;
  rounded: NonNullable<MasonryGalleryProps['rounded']>;
  gap: NonNullable<MasonryGalleryProps['gap']>;
}

function MasonryItem({ item, rounded, gap }: MasonryItemProps) {
  const Tag = item.onClick ? 'button' : 'div';

  return (
    // `break-inside-avoid` prevents an image from being split across columns
    <div className={cn('break-inside-avoid', mbClass[gap])}>
      <Tag
        {...(item.onClick
          ? {
              type: 'button' as const,
              onClick: () => item.onClick?.(item),
              'aria-label': item.alt ?? 'Gallery image',
            }
          : {})}
        className={cn(
          'block w-full overflow-hidden',
          roundedClass[rounded],
          item.onClick &&
            'focus-visible:ring-ring/50 cursor-pointer transition-opacity duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none',
        )}
      >
        <img
          src={item.src}
          alt={item.alt ?? ''}
          className={cn('w-full object-cover', roundedClass[rounded])}
          // Let the image's natural aspect ratio determine its height
          style={{ display: 'block' }}
          loading="lazy"
        />
      </Tag>
    </div>
  );
}
