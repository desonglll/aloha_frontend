import { useEffect, useState, useCallback } from "react";
import React from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import AddUserForm from "../components/forms/AddUserForm";
import EditUserForm from "../components/forms/EditUserForm";
import type { User, Pagination } from "../types/models";
import { getAllUsers, deleteUser } from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async (page = 1, size = 10) => {
    try {
      setIsLoading(true);
      const response = await getAllUsers(page, size);
      setUsers(response.data);
      setPagination(
        response.pagination || { page, size, total: response.data.length }
      );
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(pagination.page || 1, pagination.size || 10);
  }, [pagination.page, pagination.size, fetchUsers]);

  const handlePageChange = (page: number) => {
    fetchUsers(page, pagination.size || 10);
  };

  const handlePageSizeChange = (size: number) => {
    fetchUsers(1, size);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchUsers(pagination.page || 1, pagination.size || 10);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchUsers(pagination.page || 1, pagination.size || 10);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    fetchUsers(pagination.page || 1, pagination.size || 10);
  };

  const columns = [
    {
      header: "Username",
      accessor: "username" as keyof User,
    },
    {
      header: "Created At",
      accessor: (user: User) =>
        user.created_at ? new Date(user.created_at).toLocaleString() : "-",
    },
    {
      header: "Group",
      accessor: (user: User) => user.user_group_id || "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button
          variant="primary"
          size="md"
          icon={<FiPlus />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </div>

      <Card>
        <DataTable<User>
          columns={columns}
          data={users}
          keyField="id"
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          emptyState={
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new user.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  icon={<FiPlus />}
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </div>
            </div>
          }
          actions={(user) => (
            <div className="flex space-x-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                icon={<FiEdit2 />}
                aria-label="Edit user"
                onClick={() => handleEditUser(user)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<FiTrash2 />}
                aria-label="Delete user"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        <AddUserForm
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title="Edit User"
        >
          <EditUserForm
            user={selectedUser}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Users;
