import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { AuthControllerRefreshV1200 } from '@/core/api/generated/nestjsStarter.schemas';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * POST /api/auth/token-refresh
 *
 * Called by the axios interceptor when a 401 is received.
 * Reads the httpOnly `refresh_token` cookie (inaccessible to client JS),
 * calls the backend to get a new access token, and sets a new `access_token` cookie.
 *
 * Why a Route Handler instead of calling the backend directly from the interceptor?
 * The refresh token is stored in an httpOnly cookie — client JS cannot read it.
 * This Route Handler acts as a server-side bridge.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh token is invalid/expired — clear all cookies
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
    }

    const { data } = (await response.json()) as AuthControllerRefreshV1200;
    const accessToken = data?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Invalid refresh response' }, { status: 500 });
    }

    // Set new access_token cookie
    cookieStore.set('access_token', accessToken, {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      secure: IS_PRODUCTION,
      maxAge: 60 * 15, // 15 minutes
    });

    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
