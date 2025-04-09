import React, { useState, useEffect } from "react";
import {
  Permission,
  PermissionFormData,
  PaginationInfo,
} from "../types/permission.ts";
import PermissionModal from "../components/PermissionModal.tsx";
import { permissionService } from "../services/apiService.ts";
import Layout from "../components/Layout.tsx";

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    total: 0,
    prev_page: null,
    next_page: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const pageSizeOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    fetchPermissions();
  }, [pagination.page, itemsPerPage]);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await permissionService.fetchPermissions(
        pagination.page,
        itemsPerPage
      );
      setPermissions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError("Failed to fetch permissions. Please try again later.");
      console.error("Error fetching permissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPermission = () => {
    setSelectedPermission(null);
    setIsModalOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const handleDeletePermission = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      try {
        await permissionService.deletePermission(id);
        fetchPermissions();
      } catch (err) {
        setError("Failed to delete permission. Please try again later.");
        console.error("Error deleting permission:", err);
      }
    }
  };

  const handleModalSubmit = async (formData: PermissionFormData) => {
    try {
      if (selectedPermission) {
        await permissionService.updatePermission(selectedPermission.id, {
          ...selectedPermission,
          name: formData.name,
          description: formData.description || null,
        });
      } else {
        await permissionService.createPermission(formData);
      }
      setIsModalOpen(false);
      fetchPermissions();
    } catch (err) {
      setError("Failed to save permission. Please try again later.");
      console.error("Error saving permission:", err);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev: PaginationInfo) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setPagination((prev: PaginationInfo) => ({ ...prev, page: 1 }));
  };

  const formatDateTime = (dateArray: number[]) => {
    if (!dateArray || dateArray.length < 6) return "N/A";
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second
    ).toLocaleString();
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Permissions</h1>
          <button
            type="button"
            onClick={handleAddPermission}
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
            Add Permission
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
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
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
                  {permissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No permissions found. Create your first one!
                      </td>
                    </tr>
                  ) : (
                    permissions.map((permission) => (
                      <tr
                        key={permission.id}
                        className="transition-all duration-300 ease-in-out hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {permission.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(permission.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => handleEditPermission(permission)}
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
                              onClick={() =>
                                handleDeletePermission(permission.id)
                              }
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-700 ml-2">entries</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.prev_page}
                    className={`px-3 py-1 rounded ${
                      pagination.prev_page
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of{" "}
                    {Math.ceil(pagination.total / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.next_page}
                    className={`px-3 py-1 rounded ${
                      pagination.next_page
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <PermissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPermission(null);
        }}
        onSubmit={handleModalSubmit}
        permission={selectedPermission}
        mode={selectedPermission ? "edit" : "add"}
      />
    </Layout>
  );
};

export default Permissions;
