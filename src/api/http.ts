import type { ErrorDetails } from './types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://foodtruck-api.fly.dev/api/v1';

export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly details: ErrorDetails = {},
    message = code,
  ) {
    super(message);
  }
}

/** One HTTP call, without any session handling. */
export async function send<T>(method: string, path: string, opts: { body?: unknown; token?: string } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    });
  } catch {
    throw new ApiError('NETWORK', 0);
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.code ?? 'INTERNAL_ERROR', response.status, data?.details, data?.message);
  }
  return data as T;
}
