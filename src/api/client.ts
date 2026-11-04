import type { ErrorDetails, Menu, Resource } from "./types";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://foodtruck-api.fly.dev/api/v1";

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

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("NETWORK", 0);
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      data?.code ?? "INTERNAL_ERROR",
      response.status,
      data?.details,
      data?.message,
    );
  }
  return data as T;
}

export const api = {
  menu: () => request<Menu>("GET", "/menu"),
  create: <T>(resource: Resource, body: object) =>
    request<T>("POST", `/${resource}`, body),
  update: <T>(resource: Resource, id: string, body: object) =>
    request<T>("PATCH", `/${resource}/${id}`, body),
  archive: (resource: Resource, id: string) =>
    request<void>("DELETE", `/${resource}/${id}`),
  restore: <T>(resource: Resource, id: string) =>
    request<T>("POST", `/${resource}/${id}/restore`),
};
