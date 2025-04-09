// API Configuration
export const API_CONFIG = {
  baseURL: "http://localhost:8080/api",
  endpoints: {
    // User Groups
    userGroups: "/user_groups",
    userGroup: "/user_groups",
    // Users
    users: "/users",
    user: "/users",
    // Permissions
    permissions: "/permissions",
    permission: "/permissions",
    // Group Permissions
    groupPermissions: "/group_permissions",
    groupPermissionsByGroup: "/group_permissions/group",
    groupPermissionsByPermission: "/group_permissions/permission",
    // Health Check
    healthCheck: "/health_check",
  },
};

// Helper function to build full URL
export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | undefined>
): string => {
  const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

// Generic fetch helper with error handling
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
  }

  // Check if response has content
  const contentType = response.headers.get("content-type");
  const isHealthCheck = url.includes(API_CONFIG.endpoints.healthCheck);

  // If it's a health check or empty response, return empty object
  if (
    isHealthCheck ||
    !contentType ||
    contentType.indexOf("application/json") === -1
  ) {
    return {} as T;
  }

  // For responses with content length of 0, return empty object
  const contentLength = response.headers.get("content-length");
  if (contentLength === "0") {
    return {} as T;
  }

  // Try to parse JSON for all other responses
  return (await response.json()) as T;
}

// Base HTTP methods
export const api = {
  get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    return fetchApi<T>(buildUrl(endpoint, params));
  },

  post<T, U>(endpoint: string, data: U): Promise<T> {
    return fetchApi<T>(buildUrl(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  put<T, U>(endpoint: string, data: U): Promise<T> {
    return fetchApi<T>(buildUrl(endpoint), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string, data?: T): Promise<T> {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetchApi<T>(buildUrl(endpoint), options);
  },
};
