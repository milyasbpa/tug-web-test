import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * POST /api/auth/session
 *
 * Called after a successful login to set auth cookies:
 * - `access_token`  — regular cookie (readable by JS and middleware for route protection)
 * - `refresh_token` — httpOnly cookie (only readable server-side, prevents XSS theft)
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { accessToken: string; refreshToken: string };

  if (!body.accessToken || !body.refreshToken) {
    return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
  }

  const cookieStore = await cookies();

  // Access token — readable by JS (for store rehydration on page load)
  cookieStore.set('access_token', body.accessToken, {
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
    secure: IS_PRODUCTION,
    maxAge: 60 * 15, // 15 minutes — should match backend token expiry
  });

  // Refresh token — httpOnly to prevent XSS access
  cookieStore.set('refresh_token', body.refreshToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: IS_PRODUCTION,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/auth/session
 *
 * Called on logout to clear both auth cookies.
 */
export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return NextResponse.json({ ok: true });
}
