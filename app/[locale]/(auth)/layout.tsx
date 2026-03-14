// Auth layout — intentionally minimal: no navbar, no sidebar.
// Login and other auth pages render directly inside a centered container.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">{children}</div>
  );
}
