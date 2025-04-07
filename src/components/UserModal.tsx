import React, { useState, useEffect } from "react";
import { User, UserFormData } from "../types/user.ts";
import { UserGroup } from "../types/userGroup.ts";
import { userGroupService } from "../services/userGroupService.ts";
import { motion, AnimatePresence } from "npm:framer-motion@^11.0.8";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
  mode: "add" | "edit";
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    user_group_id: undefined,
  });
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user groups for the dropdown
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        const response = await userGroupService.fetchUserGroups(1, 100);
        setUserGroups(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user groups"
        );
        console.error("Error fetching user groups:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserGroups();
    }
  }, [isOpen]);

  // Pre-fill form data when editing an existing user
  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        username: user.username,
        // Password is not included when editing to avoid overwriting the existing hashed password
        password: "",
        user_group_id: user.user_group_id,
      });
    } else {
      // Reset form when adding a new user
      setFormData({
        username: "",
        password: "",
        user_group_id: undefined,
      });
    }
  }, [user, mode, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "user_group_id" && value ? value : value || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For edit mode, only include the password if it was changed
    const dataToSubmit: UserFormData = {
      ...formData,
      password:
        mode === "edit" &&
        (!formData.password || formData.password.trim() === "")
          ? undefined
          : formData.password,
      user_group_id:
        formData.user_group_id === "" ? undefined : formData.user_group_id,
    };

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {mode === "add" ? "Add User" : "Edit User"}
              </h2>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {mode === "add"
                      ? "Password"
                      : "New Password (leave blank to keep current)"}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    required={mode === "add"}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="user_group_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    User Group
                  </label>
                  <select
                    id="user_group_id"
                    name="user_group_id"
                    value={formData.user_group_id || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    {userGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.group_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    {mode === "add" ? "Add" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserModal;
