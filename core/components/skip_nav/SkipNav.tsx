import { cn } from '@/core/lib/utils';

interface SkipNavLinkProps {
  /** ID of the main content element to skip to. Defaults to "main-content". */
  contentId?: string;
  className?: string;
}

/** Visually hidden link that becomes visible on keyboard focus, for accessibility. */
export function SkipNavLink({ contentId = 'main-content', className }: SkipNavLinkProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
        'focus:inline-flex focus:items-center focus:rounded-md focus:px-4 focus:py-2',
        'focus:text-sm focus:font-medium',
        'focus:bg-background focus:text-foreground',
        'focus:ring-ring focus:ring-2 focus:outline-none',
        className,
      )}
    >
      Skip to main content
    </a>
  );
}
