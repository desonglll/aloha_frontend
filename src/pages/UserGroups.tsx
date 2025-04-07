import React, { useState, useEffect } from "react";
import {
  UserGroup,
  UserGroupFormData,
  PaginationInfo,
} from "../types/userGroup.ts";
import UserGroupModal from "../components/UserGroupModal.tsx";
import { userGroupService } from "../services/userGroupService.ts";
import { motion, AnimatePresence } from "npm:framer-motion@^11.0.8";
import Pagination from "../components/Pagination.tsx";

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

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50, 100];

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

  // Simple fade animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-2xl font-bold text-gray-900"
            >
              User Groups
            </motion.h1>
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Add User Group
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4 p-4 bg-red-100 text-red-700 rounded-md overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full"
              ></motion.div>
            </div>
          ) : (
            <>
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
                    <AnimatePresence>
                      {userGroups.map((group) => (
                        <motion.tr
                          key={group.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {group.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {group.group_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(group.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleEdit(group)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(group.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4">
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
        </motion.div>
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
    </div>
  );
};

export default UserGroups;
