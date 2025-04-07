// API Configuration
export const API_CONFIG = {
  baseURL: "http://localhost:8080",
  endpoints: {
    userGroups: "/user_groups",
    userGroup: "/user_group",
    healthCheck: "/health_check",
    users: "/users",
    user: "/user",
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
