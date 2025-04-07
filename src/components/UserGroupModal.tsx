import React, { useState, useEffect } from "react";
import { UserGroup, UserGroupFormData } from "../types/userGroup.ts";
import { motion, AnimatePresence } from "npm:framer-motion@^11.0.8";

interface UserGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserGroupFormData) => void;
  group?: UserGroup | null;
  mode: "add" | "edit";
}

const UserGroupModal: React.FC<UserGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  group,
  mode,
}) => {
  const [formData, setFormData] = useState<UserGroupFormData>({
    group_name: "",
  });

  useEffect(() => {
    if (group && mode === "edit") {
      setFormData({
        group_name: group.group_name,
      });
    } else {
      setFormData({
        group_name: "",
      });
    }
  }, [group, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mb-6"
            >
              {mode === "add" ? "Add User Group" : "Edit User Group"}
            </motion.h2>
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <label
                  htmlFor="group_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="group_name"
                  value={formData.group_name}
                  onChange={(e) =>
                    setFormData({ ...formData, group_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end space-x-3"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  {mode === "add" ? "Add" : "Save"}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserGroupModal;
