export const API_BASE_URL = 'http://localhost:8080/api/v1';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;

  const config: RequestInit = {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      if (requireAuth) {
        // Redirect to login is handled by the caller or auth context
        throw new Error('Unauthorized');
      }
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function createProject(data: {
  name: string;
  description: string;
  additionalInformation?: { projectId?: string };
  repositories?: string[];
  index: number;
}): Promise<void> {
  await apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProjectIndex(
  uuid: string,
  index: number
): Promise<void> {
  await apiFetch(`/projects/${uuid}/index`, {
    method: 'PATCH',
    body: JSON.stringify({ index }),
  });
}

export async function deleteProject(uuid: string): Promise<void> {
  await apiFetch(`/projects/${uuid}`, {
    method: 'DELETE',
  });
}

export async function updateProject(
  uuid: string,
  data: { name?: string; description?: string }
): Promise<void> {
  await apiFetch(`/projects/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

