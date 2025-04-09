import React, { useState, useEffect } from "react";
import {
  UserGroup,
  UserGroupFormData,
  PaginationInfo,
} from "../types/userGroup.ts";
import UserGroupModal from "../components/UserGroupModal.tsx";
import { userGroupService } from "../services/apiService.ts";
import Pagination from "../components/Pagination.tsx";
import Layout from "../components/Layout.tsx";

const formatDateTime = (dateArray: number[]): string => {
  if (!dateArray || dateArray.length < 6) return "Invalid date";

  // SQLx OffsetDateTime format: [year, month, day, hour, minute, second, ...]
  const [year, month, day, hour, minute, second] = dateArray;

  // Create a Date object (month is 0-based in JavaScript)
  const date = new Date(year, month - 1, day, hour, minute, second);

  // Format the date
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const UserGroups: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    total: 0,
    prev_page: null,
    next_page: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user groups from API
  const fetchUserGroups = async (page: number, size: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userGroupService.fetchUserGroups(page, size);
      setUserGroups(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user groups"
      );
      console.error("Error fetching user groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data when page or size changes
  useEffect(() => {
    fetchUserGroups(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleEdit = (group: UserGroup) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (
      globalThis.confirm("Are you sure you want to delete this user group?")
    ) {
      try {
        await userGroupService.deleteUserGroup(id);
        // Refresh the data after deletion
        fetchUserGroups(currentPage, itemsPerPage);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete user group"
        );
        console.error("Error deleting user group:", err);
      }
    }
  };

  const handleAdd = async (data: UserGroupFormData) => {
    try {
      await userGroupService.createUserGroup(data);
      setShowAddModal(false);
      // Refresh the data after adding
      fetchUserGroups(currentPage, itemsPerPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user group");
      console.error("Error adding user group:", err);
    }
  };

  const handleEditSubmit = async (data: UserGroupFormData) => {
    if (selectedGroup) {
      try {
        await userGroupService.updateUserGroup(selectedGroup.id, data);
        setShowEditModal(false);
        setSelectedGroup(null);
        // Refresh the data after updating
        fetchUserGroups(currentPage, itemsPerPage);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update user group"
        );
        console.error("Error updating user group:", err);
      }
    }
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">User Groups</h1>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
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
            Add Group
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

        {/* Loading State */}
        {loading ? (
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
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userGroups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No user groups found. Create your first one!
                      </td>
                    </tr>
                  ) : (
                    userGroups.map((group) => (
                      <tr
                        key={group.id}
                        className="transition-all duration-300 ease-in-out hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {group.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {group.group_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(group.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(group)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(group.id)}
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
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(pagination.total / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handlePageSizeChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      <UserGroupModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        mode="add"
      />

      {/* Edit Modal */}
      <UserGroupModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedGroup(null);
        }}
        onSubmit={handleEditSubmit}
        group={selectedGroup}
        mode="edit"
      />
    </Layout>
  );
};

export default UserGroups;
