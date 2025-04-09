import { User, UserFormData, UserListResponse } from "../types/user.ts";
import {
  UserGroup,
  UserGroupFormData,
  UserGroupResponse,
} from "../types/userGroup.ts";
import {
  Permission,
  PermissionFormData,
  PermissionListResponse,
} from "../types/permission.ts";
import {
  GroupPermission,
  GroupPermissionFormData,
  GroupPermissionListResponse,
} from "../types/groupPermission.ts";
import { UUID } from "../types/common.ts";
import { API_CONFIG, api } from "../config/api.ts";

// User API Services
export const userService = {
  fetchUsers: (page: number, size: number): Promise<UserListResponse> => {
    return api.get<UserListResponse>(API_CONFIG.endpoints.users, {
      page,
      size,
    });
  },

  fetchUserById: (id: UUID): Promise<User> => {
    return api.get<User>(`${API_CONFIG.endpoints.user}/${id}`);
  },

  createUser: (user: UserFormData): Promise<User> => {
    return api.post<User, UserFormData>(API_CONFIG.endpoints.users, user);
  },

  updateUser: (id: UUID, user: UserFormData): Promise<User> => {
    return api.put<User, UserFormData>(
      `${API_CONFIG.endpoints.user}/${id}`,
      user
    );
  },

  deleteUser: (id: UUID): Promise<User> => {
    return api.delete<User>(`${API_CONFIG.endpoints.user}/${id}`);
  },
};

// User Group API Services
export const userGroupService = {
  fetchUserGroups: (
    page: number = 1,
    size: number = 10
  ): Promise<UserGroupResponse> => {
    return api.get<UserGroupResponse>(API_CONFIG.endpoints.userGroups, {
      page,
      size,
    });
  },

  getUserGroup: (id: UUID): Promise<UserGroup> => {
    return api.get<UserGroup>(`${API_CONFIG.endpoints.userGroup}/${id}`);
  },

  createUserGroup: (data: UserGroupFormData): Promise<UserGroup> => {
    return api.post<UserGroup, UserGroupFormData>(
      API_CONFIG.endpoints.userGroups,
      data
    );
  },

  updateUserGroup: (id: UUID, data: UserGroupFormData): Promise<UserGroup> => {
    return api.put<UserGroup, UserGroupFormData>(
      `${API_CONFIG.endpoints.userGroup}/${id}`,
      data
    );
  },

  deleteUserGroup: (id: UUID): Promise<void> => {
    return api.delete<void>(`${API_CONFIG.endpoints.userGroup}/${id}`);
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.healthCheck}`
      );
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },
};

// Permission API Services
export const permissionService = {
  fetchPermissions: (
    page: number,
    size: number
  ): Promise<PermissionListResponse> => {
    return api.get<PermissionListResponse>(API_CONFIG.endpoints.permissions, {
      page,
      size,
    });
  },

  fetchPermissionById: (id: UUID): Promise<Permission> => {
    return api.get<Permission>(`${API_CONFIG.endpoints.permission}/${id}`);
  },

  createPermission: (permission: PermissionFormData): Promise<Permission> => {
    return api.post<Permission, PermissionFormData>(
      API_CONFIG.endpoints.permissions,
      permission
    );
  },

  updatePermission: (id: UUID, permission: Permission): Promise<Permission> => {
    return api.put<Permission, Permission>(API_CONFIG.endpoints.permissions, {
      ...permission,
      id,
    });
  },

  deletePermission: (id: UUID): Promise<Permission> => {
    return api.delete<Permission>(`${API_CONFIG.endpoints.permission}/${id}`);
  },
};

// Group Permission API Services
export const groupPermissionService = {
  fetchGroupPermissions: (
    page: number,
    size: number
  ): Promise<GroupPermissionListResponse> => {
    return api.get<GroupPermissionListResponse>(
      API_CONFIG.endpoints.groupPermissions,
      { page, size }
    );
  },

  fetchGroupPermissionsByGroupId: (
    groupId: UUID
  ): Promise<GroupPermission[]> => {
    return api.get<GroupPermission[]>(
      `${API_CONFIG.endpoints.groupPermissionsByGroup}/${groupId}`
    );
  },

  fetchGroupPermissionsByPermissionId: (
    permissionId: UUID
  ): Promise<GroupPermission[]> => {
    return api.get<GroupPermission[]>(
      `${API_CONFIG.endpoints.groupPermissionsByPermission}/${permissionId}`
    );
  },

  createGroupPermission: (
    groupPermission: GroupPermissionFormData
  ): Promise<GroupPermission> => {
    return api.post<GroupPermission, GroupPermissionFormData>(
      API_CONFIG.endpoints.groupPermissions,
      groupPermission
    );
  },

  deleteGroupPermission: (
    groupPermission: GroupPermissionFormData
  ): Promise<GroupPermission> => {
    return api.delete<GroupPermission>(
      API_CONFIG.endpoints.groupPermissions,
      groupPermission
    );
  },

  deleteGroupPermissionsByGroupId: (
    groupId: UUID
  ): Promise<GroupPermission[]> => {
    return api.delete<GroupPermission[]>(
      `${API_CONFIG.endpoints.groupPermissionsByGroup}/${groupId}`
    );
  },

  deleteGroupPermissionsByPermissionId: (
    permissionId: UUID
  ): Promise<GroupPermission[]> => {
    return api.delete<GroupPermission[]>(
      `${API_CONFIG.endpoints.groupPermissionsByPermission}/${permissionId}`
    );
  },
};
