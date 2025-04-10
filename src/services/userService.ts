import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  User,
  CreateUserFormData,
  UpdateUserFormData,
  ApiResponse,
} from "../types/models";

/**
 * Get all users with optional pagination and sorting
 */
export const getAllUsers = async (
  page?: number,
  size?: number,
  sort?: string,
  order?: "asc" | "desc"
): Promise<ApiResponse<User[]>> => {
  const params = { page, size, sort, order };
  return api.get(API_ENDPOINTS.USERS.GET_ALL, { params });
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  return api.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
};

/**
 * Create new user
 */
export const createUser = async (
  userData: CreateUserFormData
): Promise<User> => {
  return api.post(API_ENDPOINTS.USERS.CREATE, userData);
};

/**
 * Update existing user
 */
export const updateUser = async (
  userData: UpdateUserFormData
): Promise<User> => {
  return api.put(API_ENDPOINTS.USERS.UPDATE, userData);
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<User> => {
  return api.delete(API_ENDPOINTS.USERS.DELETE(id));
};

/**
 * Delete multiple users
 */
export const deleteMultipleUsers = async (
  userIds: string[]
): Promise<number> => {
  return api.delete(API_ENDPOINTS.USERS.DELETE_MULTIPLE, { data: userIds });
};
