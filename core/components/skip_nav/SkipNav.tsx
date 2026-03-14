import { cn } from '@/core/lib/utils';

interface SkipNavLinkProps {
  /** ID of the main content element to skip to. Defaults to "main-content". */
  contentId?: string;
  className?: string;
}

/**
 * SkipNavLink — renders a visually hidden link that becomes visible on keyboard focus.
 * Allows keyboard/screen reader users to skip past the navbar directly to main content.
 *
 * Usage:
 *   1. Place <SkipNavLink /> as the FIRST child inside <body> (before <Navbar />).
 *   2. Add id="main-content" to your <main> element.
 *
 * WCAG 2.1 Level A — Success Criterion 2.4.1 (Bypass Blocks).
 */
export function SkipNavLink({ contentId = 'main-content', className }: SkipNavLinkProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        // Hidden by default — only shown when focused via keyboard Tab
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
