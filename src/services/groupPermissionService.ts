import api from "./api.ts";
import {API_ENDPOINTS} from "../config/api.config.ts";
import type {
    GroupPermission,
    CreateGroupPermissionFormData,
    ApiResponse,
} from "../types/models.ts";

interface GroupPermissionsParams {
    page?: number;
    size?: number;
    groupId?: string;
    permissionId?: string;
}

/**
 * Get all group permissions with pagination and optional filtering
 */
export const getAllGroupPermissions = (
    params?: GroupPermissionsParams
): Promise<ApiResponse<GroupPermission[]>> => {
    if (params?.groupId) {
        return api.get(
            API_ENDPOINTS.GROUP_PERMISSIONS.GET_BY_GROUP(params.groupId)
        );
    }
    if (params?.permissionId) {
        return api.get(
            API_ENDPOINTS.GROUP_PERMISSIONS.GET_BY_PERMISSION(params.permissionId)
        );
    }
    return api.get(API_ENDPOINTS.GROUP_PERMISSIONS.GET_ALL, {
        params: {page: params?.page, size: params?.size},
    });
};

/**
 * Get group permissions by group ID
 */
export const getGroupPermissionsByGroupId = (
    groupId: string
): Promise<ApiResponse<GroupPermission[]>> => {
    return api.get(API_ENDPOINTS.GROUP_PERMISSIONS.GET_BY_GROUP(groupId));
};

/**
 * Get group permissions by permission ID
 */
export const getGroupPermissionsByPermissionId = (
    permissionId: string
): Promise<ApiResponse<GroupPermission[]>> => {
    return api.get(
        API_ENDPOINTS.GROUP_PERMISSIONS.GET_BY_PERMISSION(permissionId)
    );
};

/**
 * Create new group permission
 */
export const createGroupPermission = (
    groupPermissionData: CreateGroupPermissionFormData
): Promise<GroupPermission> => {
    return api.post(API_ENDPOINTS.GROUP_PERMISSIONS.CREATE, groupPermissionData);
};

/**
 * Delete group permission
 */
export const deleteGroupPermission = (
    groupId: string,
    permissionId: string
): Promise<GroupPermission> => {
    const data: CreateGroupPermissionFormData = {
        group_id: groupId,
        permission_id: permissionId,
    };
    return api.delete(API_ENDPOINTS.GROUP_PERMISSIONS.DELETE, {
        data,
    });
};

/**
 * Delete all permissions for a group
 */
export const deleteGroupPermissionsByGroupId = (
    groupId: string
): Promise<GroupPermission[]> => {
    return api.delete(API_ENDPOINTS.GROUP_PERMISSIONS.DELETE_BY_GROUP(groupId));
};

/**
 * Delete all groups for a permission
 */
export const deleteGroupPermissionsByPermissionId = (
    permissionId: string
): Promise<GroupPermission[]> => {
    return api.delete(
        API_ENDPOINTS.GROUP_PERMISSIONS.DELETE_BY_PERMISSION(permissionId)
    );
};
