import { UUID } from "./common.ts";

export interface Permission {
  id: UUID;
  name: string;
  description: string | null;
  created_at: number[];
}

export interface PermissionFormData {
  name: string;
  description?: string;
}

export interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  prev_page: string | null;
  next_page: string | null;
}

export interface PermissionListResponse {
  data: Permission[];
  pagination: PaginationInfo;
}
