import axios from 'axios';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';

    // Maintains proper stack trace in V8 (Node.js / Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/** Converts unknown errors into a typed AppError. */
export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ?? error.message;

    if (status === 400) return new AppError(message, 'BAD_REQUEST', 400);
    if (status === 401) return new AppError('Unauthorized', 'UNAUTHORIZED', 401);
    if (status === 403) return new AppError('Forbidden', 'FORBIDDEN', 403);
    if (status === 404) return new AppError(message, 'NOT_FOUND', 404);
    if (status === 409) return new AppError(message, 'CONFLICT', 409);
    if (status === 422) return new AppError(message, 'UNPROCESSABLE', 422);
    if (status === 429) return new AppError('Too many requests', 'RATE_LIMITED', 429);
    if (status != null && status >= 500)
      return new AppError('Server error, please try again later', 'SERVER_ERROR', status);

    return new AppError(message, 'NETWORK_ERROR', 0);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new AppError('Something went wrong', 'UNKNOWN_ERROR', 500);
}
