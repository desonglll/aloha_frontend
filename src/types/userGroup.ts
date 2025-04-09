export interface UserGroup {
  id: string;
  group_name: string;
  created_at: number[];
}

export interface UserGroupFormData {
  group_name: string;
}

export interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  prev_page: string | null;
  next_page: string | null;
}

export interface UserGroupResponse {
  pagination: PaginationInfo;
  data: UserGroup[];
}
