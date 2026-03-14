import { ProtectedNavbar } from '@/core/components/protected_navbar/ProtectedNavbar';

/**
 * Layout for authenticated/protected pages.
 * Renders a persistent navbar above all protected route content.
 * Route group `(protected)` has no effect on the URL structure.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ProtectedNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
