/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Users
  USERS: {
    GET_ALL: "/api/users",
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    CREATE: "/api/users",
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    DELETE_MULTIPLE: "/api/users",
  },

  // User Groups
  USER_GROUPS: {
    GET_ALL: "/api/user_groups",
    GET_BY_ID: (id: string) => `/api/user_groups/${id}`,
    CREATE: "/api/user_groups",
    UPDATE: "/api/user_groups",
    DELETE: (id: string) => `/api/user_groups/${id}`,
  },

  // Permissions
  PERMISSIONS: {
    GET_ALL: "/api/permissions",
    GET_BY_ID: (id: string) => `/api/permissions/${id}`,
    CREATE: "/api/permissions",
    UPDATE: "/api/permissions",
    DELETE: (id: string) => `/api/permissions/${id}`,
  },

  // Group Permissions
  GROUP_PERMISSIONS: {
    GET_ALL: "/api/group_permissions",
    GET_BY_GROUP: (groupId: string) =>
      `/api/group_permissions/group/${groupId}`,
    GET_BY_PERMISSION: (permissionId: string) =>
      `/api/group_permissions/permission/${permissionId}`,
    CREATE: "/api/group_permissions",
    DELETE: "/api/group_permissions",
    DELETE_BY_GROUP: (groupId: string) =>
      `/api/group_permissions/group/${groupId}`,
    DELETE_BY_PERMISSION: (permissionId: string) =>
      `/api/group_permissions/permission/${permissionId}`,
  },

  // Health Check
  HEALTH: "/health",
};
