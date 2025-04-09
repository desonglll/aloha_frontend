import React, { useState, useEffect } from "react";
import { UserGroup } from "../types/userGroup.ts";
import { Permission } from "../types/permission.ts";
import {
  GroupPermission,
  GroupPermissionFormData,
} from "../types/groupPermission.ts";
import GroupPermissionModal from "../components/GroupPermissionModal.tsx";
import {
  groupPermissionService,
  userGroupService,
  permissionService,
} from "../services/apiService.ts";
import Layout from "../components/Layout.tsx";

const GroupPermissions: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupPermissions, setGroupPermissions] = useState<GroupPermission[]>(
    []
  );
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserGroups();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupPermissions(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchUserGroups = async () => {
    try {
      setIsLoading(true);
      const response = await userGroupService.fetchUserGroups(1, 100);
      setUserGroups(response.data);
      if (response.data.length > 0 && !selectedGroup) {
        setSelectedGroup(response.data[0]);
      }
    } catch (err) {
      setError("Failed to fetch user groups. Please try again later.");
      console.error("Error fetching user groups:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionService.fetchPermissions(1, 100);
      setPermissions(response.data);
    } catch (err) {
      setError("Failed to fetch permissions. Please try again later.");
      console.error("Error fetching permissions:", err);
    }
  };

  const fetchGroupPermissions = async (groupId: string) => {
    try {
      setIsLoading(true);
      const response =
        await groupPermissionService.fetchGroupPermissionsByGroupId(groupId);
      setGroupPermissions(response);
    } catch (err) {
      setError("Failed to fetch group permissions. Please try again later.");
      console.error("Error fetching group permissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGroupPermission = () => {
    setIsModalOpen(true);
  };

  const handleDeleteGroupPermission = async (
    groupPermission: GroupPermission
  ) => {
    if (
      window.confirm(
        "Are you sure you want to remove this permission from the group?"
      )
    ) {
      try {
        await groupPermissionService.deleteGroupPermission({
          group_id: groupPermission.group_id,
          permission_id: groupPermission.permission_id,
        });
        if (selectedGroup) {
          fetchGroupPermissions(selectedGroup.id);
        }
      } catch (err) {
        setError("Failed to delete group permission. Please try again later.");
        console.error("Error deleting group permission:", err);
      }
    }
  };

  const handleModalSubmit = async (formData: GroupPermissionFormData) => {
    try {
      await groupPermissionService.createGroupPermission(formData);
      setIsModalOpen(false);

      // If a new group_id is selected in the modal, update the selectedGroup
      if (formData.group_id !== selectedGroup?.id) {
        const newSelectedGroup = userGroups.find(
          (group) => group.id === formData.group_id
        );
        if (newSelectedGroup) {
          setSelectedGroup(newSelectedGroup);
        }
      } else {
        // Otherwise, just refresh the permissions for the current selected group
        fetchGroupPermissions(selectedGroup?.id);
      }
    } catch (err) {
      setError("Failed to assign permission to group. Please try again later.");
      console.error("Error assigning permission:", err);
    }
  };

  const getPermissionName = (permissionId: string): string => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.name : "Unknown Permission";
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Group Permissions</h1>
          <button
            type="button"
            onClick={handleAddGroupPermission}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Assign Permission
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 transition-all duration-300 ease-in-out">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Group Selection */}
        <div className="px-6 py-4">
          <label
            htmlFor="userGroup"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select User Group
          </label>
          <select
            id="userGroup"
            value={selectedGroup?.id || ""}
            onChange={(e) => {
              const groupId = e.target.value;
              const group = userGroups.find((g) => g.id === groupId);
              setSelectedGroup(group || null);
            }}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {userGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupPermissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {selectedGroup
                          ? `No permissions assigned to ${selectedGroup.group_name}. Assign your first one!`
                          : "Please select a user group"}
                      </td>
                    </tr>
                  ) : (
                    groupPermissions.map((gp) => (
                      <tr
                        key={`${gp.group_id}-${gp.permission_id}`}
                        className="transition-all duration-300 ease-in-out hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {getPermissionName(gp.permission_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {gp.permission_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteGroupPermission(gp)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-300 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <GroupPermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        userGroups={userGroups}
        permissions={permissions}
        selectedGroupId={selectedGroup?.id}
      />
    </Layout>
  );
};

export default GroupPermissions;
