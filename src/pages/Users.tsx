import React, { useState, useEffect } from "react";
import { User, UserFormData, PaginationInfo } from "../types/user.ts";
import UserModal from "../components/UserModal.tsx";
import { userService } from "../services/userService.ts";
import { motion, AnimatePresence } from "npm:framer-motion@^11.0.8";
import { userGroupService } from "../services/userGroupService.ts";
import { UserGroup } from "../types/userGroup.ts";
import Pagination from "../components/Pagination.tsx";

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userGroups, setUserGroups] = useState<Record<string, UserGroup>>({});
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

  // Fetch users from API
  const fetchUsers = async (page: number, size: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.fetchUsers(page, size);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user groups to display names instead of IDs
  const fetchUserGroups = async () => {
    try {
      const response = await userGroupService.fetchUserGroups(1, 100);
      const groupMap: Record<string, UserGroup> = {};
      response.data.forEach((group) => {
        groupMap[group.id] = group;
      });
      setUserGroups(groupMap);
    } catch (err) {
      console.error("Error fetching user groups:", err);
    }
  };

  // Load data when page or size changes
  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Load user groups on component mount
  useEffect(() => {
    fetchUserGroups();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        // Refresh the data after deletion
        fetchUsers(currentPage, itemsPerPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleAdd = async (data: UserFormData) => {
    try {
      await userService.createUser(data);
      setShowAddModal(false);
      // Refresh the data after adding
      fetchUsers(currentPage, itemsPerPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
      console.error("Error adding user:", err);
    }
  };

  const handleEditSubmit = async (data: UserFormData) => {
    if (selectedUser) {
      try {
        await userService.updateUser(selectedUser.id, data);
        setShowEditModal(false);
        setSelectedUser(null);
        // Refresh the data after updating
        fetchUsers(currentPage, itemsPerPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update user");
        console.error("Error updating user:", err);
      }
    }
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Calculate total pages from pagination info
  const totalPages = Math.ceil(pagination.total / pagination.size);

  // Simple fade animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Get user group name by ID
  const getUserGroupName = (groupId?: string) => {
    if (!groupId) return "None";
    return userGroups[groupId]?.group_name || "Unknown Group";
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
              Users
            </motion.h1>
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Add User
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
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Group
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
                      {users.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getUserGroupName(user.user_group_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user.id)}
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
      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        mode="add"
      />

      {/* Edit Modal */}
      <UserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditSubmit}
        user={selectedUser}
        mode="edit"
      />
    </div>
  );
};

export default Users;
