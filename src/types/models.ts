/**
 * Data models based on API specification
 */

// User models
export interface User {
  id: string;
  username: string;
  created_at?: string;
  user_group_id?: string | null;
}

export interface CreateUserFormData {
  username: string;
  password: string;
  user_group_id?: string | null;
}

export interface UpdateUserFormData {
  username: string;
  password?: string | null;
  user_group_id?: string | null;
}

// User Group models
export interface UserGroup {
  id: string;
  group_name: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateUserGroupFormData {
  group_name: string;
}

// Permission models
export interface Permission {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface CreatePermissionFormData {
  name: string;
  description?: string | null;
}

// Group Permission models
export interface GroupPermission {
  group_id: string;
  permission_id: string;
  created_at?: string;
}

export interface CreateGroupPermissionFormData {
  group_id: string;
  permission_id: string;
}

// Pagination model
export interface Pagination {
  total?: number | null;
  page?: number | null;
  size?: number | null;
  prev_page?: string | null;
  next_page?: string | null;
}

// Response wrappers
export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination | null;
}

// API Error models
export interface DatabaseError {
  DatabaseError: string;
}

export type AlohaError = DatabaseError;
