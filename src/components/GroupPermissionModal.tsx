import React, { useState, useEffect } from "react";
import { UserGroup } from "../types/userGroup.ts";
import { Permission } from "../types/permission.ts";
import { GroupPermissionFormData } from "../types/groupPermission.ts";
import { motion } from "framer-motion";

interface GroupPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GroupPermissionFormData) => void;
  userGroups: UserGroup[];
  permissions: Permission[];
  selectedGroupId?: string;
}

const GroupPermissionModal: React.FC<GroupPermissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userGroups,
  permissions,
  selectedGroupId,
}) => {
  const [formData, setFormData] = useState<GroupPermissionFormData>({
    group_id: "",
    permission_id: "",
  });

  useEffect(() => {
    if (selectedGroupId) {
      setFormData((prev) => ({
        ...prev,
        group_id: selectedGroupId,
      }));
    } else if (userGroups.length > 0) {
      setFormData((prev) => ({
        ...prev,
        group_id: userGroups[0].id,
      }));
    }
  }, [selectedGroupId, userGroups, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Assign Permission to User Group
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="group_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User Group *
            </label>
            <select
              id="group_id"
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a user group</option>
              {userGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="permission_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Permission *
            </label>
            <select
              id="permission_id"
              name="permission_id"
              value={formData.permission_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a permission</option>
              {permissions.map((permission) => (
                <option key={permission.id} value={permission.id}>
                  {permission.name}{" "}
                  {permission.description ? `- ${permission.description}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Assign
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GroupPermissionModal;
