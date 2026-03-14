import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/core/lib/routes';

// app/ is a routing manifest only — no logic, no state, no styling.
export default async function RootPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('access_token');

  redirect(isAuthenticated ? ROUTES.PACKAGES : ROUTES.LOGIN);
}
