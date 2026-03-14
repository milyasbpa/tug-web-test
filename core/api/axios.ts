import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

import { useAuthStore } from '@/features/auth/store/auth.store';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Auth Interceptor ────────────────────────────────────────────────────────
// Reads token directly from Zustand store — works outside React components via .getState()
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Logging Interceptor (dev only) ─────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  axiosInstance.interceptors.request.use((config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '');
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[API] ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    (error: AxiosError) => {
      console.error(`[API] Error ${error.response?.status} ${error.config?.url}`, error.message);
      return Promise.reject(error);
    },
  );
}

// ─── Error Interceptor ───────────────────────────────────────────────────────
// Handles 401 with automatic token refresh + request queue to avoid race conditions.

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // ── 401 → attempt token refresh, then retry ──────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue concurrent 401s until the in-flight refresh resolves
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return axiosInstance(originalRequest);
          })
          .catch((err: unknown) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Route Handler reads httpOnly refresh_token cookie — client JS can't do this directly
        const res = await fetch('/api/auth/token-refresh', { method: 'POST' });

        if (!res.ok) throw new Error('Refresh failed');

        const { accessToken } = (await res.json()) as { accessToken: string };

        // Update Zustand store with new token
        useAuthStore.getState().setAuth(useAuthStore.getState().user, accessToken);

        // Retry original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh token expired — clear auth and redirect to login
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      console.warn('[API] 403 Forbidden — insufficient permissions');
    }

    if (status && status >= 500) {
      console.error('[API] Server error', status, error.config?.url);
    }

    return Promise.reject(error);
  },
);

/**
 * Orval mutator — called by every generated hook.
 * Unwraps `data` from the Axios response automatically.
 */
export const axiosInstanceMutator = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance(config).then(({ data }) => data as T);
