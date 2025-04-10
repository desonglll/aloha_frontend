import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  Permission,
  CreatePermissionFormData,
  ApiResponse,
} from "../types/models";

/**
 * Get all permissions with optional pagination and sorting
 */
export const getAllPermissions = async (
  page?: number,
  size?: number,
  sort?: string,
  order?: "asc" | "desc"
): Promise<ApiResponse<Permission[]>> => {
  const params = { page, size, sort, order };
  return api.get(API_ENDPOINTS.PERMISSIONS.GET_ALL, { params });
};

/**
 * Get permission by ID
 */
export const getPermissionById = async (id: string): Promise<Permission> => {
  return api.get(API_ENDPOINTS.PERMISSIONS.GET_BY_ID(id));
};

/**
 * Create new permission
 */
export const createPermission = async (
  permissionData: CreatePermissionFormData
): Promise<Permission> => {
  return api.post(API_ENDPOINTS.PERMISSIONS.CREATE, permissionData);
};

/**
 * Update existing permission
 */
export const updatePermission = async (
  permission: Permission
): Promise<Permission> => {
  return api.put(API_ENDPOINTS.PERMISSIONS.UPDATE, permission);
};

/**
 * Delete permission
 */
export const deletePermission = async (id: string): Promise<Permission> => {
  return api.delete(API_ENDPOINTS.PERMISSIONS.DELETE(id));
};
