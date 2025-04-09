import { UUID } from "./common.ts";

export interface GroupPermission {
  group_id: UUID;
  permission_id: UUID;
  created_at?: number[];
}

export interface GroupPermissionFormData {
  group_id: UUID;
  permission_id: UUID;
}

export interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  prev_page: string | null;
  next_page: string | null;
}

export interface GroupPermissionListResponse {
  data: GroupPermission[];
  pagination: PaginationInfo;
}
