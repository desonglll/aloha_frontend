import api from "./api.ts";
import { API_ENDPOINTS } from "../config/api.config.ts";
import type {
  UserPermission,
  CreateUserPermissionFormData,
  ApiResponse,
} from "../types/models.ts";

interface UserPermissionsParams {
  page?: number;
  size?: number;
  userId?: string;
  permissionId?: string;
}

/**
 * Get all user permissions with pagination and optional filtering
 */
export const getAllUserPermissions = (
  params?: UserPermissionsParams
): Promise<ApiResponse<UserPermission[]>> => {
  if (params?.userId) {
    return api.get(API_ENDPOINTS.USER_PERMISSIONS.GET_BY_USER(params.userId));
  } else if (params?.permissionId) {
    return api.get(
      API_ENDPOINTS.USER_PERMISSIONS.GET_BY_PERMISSION(params.permissionId)
    );
  } else {
    return api.get(API_ENDPOINTS.USER_PERMISSIONS.GET_ALL, {
      params: { page: params?.page, size: params?.size },
    });
  }
};

/**
 * Get user permissions by user ID
 */
export const getUserPermissionsByUserId = (
  userId: string
): Promise<ApiResponse<UserPermission[]>> => {
  return api.get(API_ENDPOINTS.USER_PERMISSIONS.GET_BY_USER(userId));
};

/**
 * Get user permissions by permission ID
 */
export const getUserPermissionsByPermissionId = (
  permissionId: string
): Promise<ApiResponse<UserPermission[]>> => {
  return api.get(
    API_ENDPOINTS.USER_PERMISSIONS.GET_BY_PERMISSION(permissionId)
  );
};

/**
 * Create new user permission
 */
export const createUserPermission = (
  userPermissionData: CreateUserPermissionFormData
): Promise<UserPermission> => {
  return api.post(API_ENDPOINTS.USER_PERMISSIONS.CREATE, userPermissionData);
};

/**
 * Delete user permission
 */
export const deleteUserPermission = (
  userId: string,
  permissionId: string
): Promise<UserPermission> => {
  const data: CreateUserPermissionFormData = {
    user_id: userId,
    permission_id: permissionId,
  };
  return api.delete(API_ENDPOINTS.USER_PERMISSIONS.DELETE, {
    data,
  });
};

/**
 * Delete all permissions for a user
 */
export const deleteUserPermissionsByUserId = (
  userId: string
): Promise<UserPermission[]> => {
  return api.delete(API_ENDPOINTS.USER_PERMISSIONS.DELETE_BY_USER(userId));
};

/**
 * Delete all users for a permission
 */
export const deleteUserPermissionsByPermissionId = (
  permissionId: string
): Promise<UserPermission[]> => {
  return api.delete(
    API_ENDPOINTS.USER_PERMISSIONS.DELETE_BY_PERMISSION(permissionId)
  );
};
