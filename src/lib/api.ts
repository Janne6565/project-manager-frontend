import type { LoginResponse } from "@/types/auth.ts";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth-token.ts";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

// Auth endpoints must never trigger the silent-refresh recursion: /auth/token
// IS the refresh, and a failed /auth/login should surface its own 401.
function isAuthBootstrapEndpoint(endpoint: string): boolean {
  return (
    endpoint.startsWith("/auth/login") || endpoint.startsWith("/auth/token")
  );
}

// One silent refresh against the httpOnly refresh cookie. Stores the rotated
// access token on success; clears it on failure so the caller falls through to
// the "Unauthorized" path.
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      clearAccessToken();
      return false;
    }
    const data: LoginResponse = await response.json();
    setAccessToken(data.token);
    return true;
  } catch {
    clearAccessToken();
    return false;
  }
}

async function doFetch<T>(
  endpoint: string,
  fetchOptions: RequestInit,
  requireAuth: boolean,
  retried: boolean,
): Promise<T> {
  const token = getAccessToken();

  const config: RequestInit = {
    ...fetchOptions,
    // credentials: "include" so the httpOnly refresh cookie flows to /auth/*.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (
      response.status === 401 &&
      !isAuthBootstrapEndpoint(endpoint) &&
      !retried
    ) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return doFetch<T>(endpoint, fetchOptions, requireAuth, true);
      }
    }
    if (response.status === 403 || response.status === 401) {
      if (requireAuth) {
        // Redirect to login is handled by the caller or auth context
        throw new Error("Unauthorized");
      }
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;
  return doFetch<T>(endpoint, fetchOptions, requireAuth, false);
}

export async function createProject(data: {
  name: string;
  description?: string;
  descriptionEn?: string;
  descriptionDe?: string;
  additionalInformation?: { projectId?: string };
  repositories?: string[];
  index: number;
}): Promise<void> {
  await apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProjectIndex(
  uuid: string,
  index: number,
): Promise<void> {
  await apiFetch(`/projects/${uuid}/index`, {
    method: "PATCH",
    body: JSON.stringify({ index }),
  });
}

export async function deleteProject(uuid: string): Promise<void> {
  await apiFetch(`/projects/${uuid}`, {
    method: "DELETE",
  });
}

export async function updateProject(
  uuid: string,
  data: {
    name?: string;
    description?: string;
    descriptionEn?: string;
    descriptionDe?: string;
    repositories?: string[];
    additionalInformation?: { projectId?: string; [key: string]: unknown };
    index?: number;
    isVisible?: boolean;
  },
): Promise<void> {
  await apiFetch(`/projects/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function toggleProjectVisibility(uuid: string): Promise<void> {
  await apiFetch(`/projects/${uuid}/visibility`, {
    method: "PATCH",
  });
}

export async function listApiKeys(): Promise<
  import("@/types/apiKey").ApiKey[]
> {
  return apiFetch("/admin/api-keys");
}

export async function generateApiKey(
  name: string,
): Promise<import("@/types/apiKey").GeneratedApiKey> {
  return apiFetch("/admin/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function revokeApiKey(id: string): Promise<void> {
  await apiFetch(`/admin/api-keys/${id}`, { method: "DELETE" });
}
