import { UUID } from "./common.ts";

export interface User {
  id: UUID;
  username: string;
  created_at: string;
  user_group_id?: UUID;
}

export interface UserFormData {
  username: string;
  password?: string;
  user_group_id?: UUID;
}

export interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  prev_page: number | null;
  next_page: number | null;
}

export interface UserListResponse {
  data: User[];
  pagination: PaginationInfo;
}
