import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  UserGroup,
  CreateUserGroupFormData,
  ApiResponse,
} from "../types/models";

/**
 * Get all user groups with optional pagination and sorting
 */
export const getAllUserGroups = async (
  page?: number,
  size?: number,
  sort?: string,
  order?: "asc" | "desc"
): Promise<ApiResponse<UserGroup[]>> => {
  const params = { page, size, sort, order };
  return api.get(API_ENDPOINTS.USER_GROUPS.GET_ALL, { params });
};

/**
 * Get user group by ID
 */
export const getUserGroupById = async (id: string): Promise<UserGroup> => {
  return api.get(API_ENDPOINTS.USER_GROUPS.GET_BY_ID(id));
};

/**
 * Create new user group
 */
export const createUserGroup = async (
  groupData: CreateUserGroupFormData
): Promise<UserGroup> => {
  return api.post(API_ENDPOINTS.USER_GROUPS.CREATE, groupData);
};

/**
 * Update existing user group
 */
export const updateUserGroup = async (
  userGroup: UserGroup
): Promise<UserGroup> => {
  return api.put(API_ENDPOINTS.USER_GROUPS.UPDATE, userGroup);
};

/**
 * Delete user group
 */
export const deleteUserGroup = async (id: string): Promise<UserGroup> => {
  return api.delete(API_ENDPOINTS.USER_GROUPS.DELETE(id));
};
