import { User, UserFormData, UserListResponse } from "../types/user.ts";
import { UUID } from "../types/common.ts";
import { API_CONFIG, buildUrl } from "../config/api.ts";

export const userService = {
  async fetchUsers(page: number, size: number): Promise<UserListResponse> {
    const response = await fetch(
      buildUrl(API_CONFIG.endpoints.users, { page, size }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return await response.json();
  },

  async fetchUserById(id: UUID): Promise<User> {
    const response = await fetch(
      buildUrl(`${API_CONFIG.endpoints.user}/${id}`),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  },

  async createUser(user: UserFormData): Promise<User> {
    const response = await fetch(buildUrl(API_CONFIG.endpoints.user), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return await response.json();
  },

  async updateUser(id: UUID, user: UserFormData): Promise<User> {
    const response = await fetch(
      buildUrl(`${API_CONFIG.endpoints.user}/${id}`),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return await response.json();
  },

  async deleteUser(id: UUID): Promise<User> {
    const response = await fetch(
      buildUrl(`${API_CONFIG.endpoints.user}/${id}`),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }

    return await response.json();
  },
};
