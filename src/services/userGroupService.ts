import {
  UserGroup,
  UserGroupFormData,
  UserGroupResponse,
} from "../types/userGroup.ts";
import { API_CONFIG, buildUrl } from "../config/api.ts";

export const userGroupService = {
  // Fetch user groups with pagination
  async fetchUserGroups(
    page: number = 1,
    size: number = 10
  ): Promise<UserGroupResponse> {
    const url = buildUrl(API_CONFIG.endpoints.userGroups, { page, size });
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch user groups: ${response.statusText}`);
    }

    return await response.json();
  },

  // Get a single user group by ID
  async getUserGroup(id: string): Promise<UserGroup> {
    const url = buildUrl(`${API_CONFIG.endpoints.userGroup}/${id}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch user group: ${response.statusText}`);
    }

    return await response.json();
  },

  // Create a new user group
  async createUserGroup(data: UserGroupFormData): Promise<UserGroup> {
    const url = buildUrl(API_CONFIG.endpoints.userGroup);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user group: ${response.statusText}`);
    }

    return await response.json();
  },

  // Update an existing user group
  async updateUserGroup(
    id: string,
    data: UserGroupFormData
  ): Promise<UserGroup> {
    const url = buildUrl(`${API_CONFIG.endpoints.userGroup}/${id}`);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user group: ${response.statusText}`);
    }

    return await response.json();
  },

  // Delete a user group
  async deleteUserGroup(id: string): Promise<void> {
    const url = buildUrl(`${API_CONFIG.endpoints.userGroup}/${id}`);
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user group: ${response.statusText}`);
    }
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const url = buildUrl(API_CONFIG.endpoints.healthCheck);
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },
};
