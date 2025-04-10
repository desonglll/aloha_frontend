import { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiUsers, FiShield } from "react-icons/fi";
import Card from "../components/ui/Card.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import Button from "../components/ui/Button.tsx";
import Modal from "../components/ui/Modal.tsx";
import AddUserGroupForm from "../components/forms/AddUserGroupForm.tsx";
import EditUserGroupForm from "../components/forms/EditUserGroupForm.tsx";
import ManageGroupPermissionsForm from "../components/forms/ManageGroupPermissionsForm.tsx";
import type { UserGroup, Pagination } from "../types/models.ts";
import {
  getAllUserGroups,
  deleteUserGroup,
} from "../services/userGroupService.ts";

const UserGroups = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  const fetchUserGroups = useCallback(async (page = 1, size = 10) => {
    try {
      setIsLoading(true);
      const response = await getAllUserGroups(page, size);
      setUserGroups(response.data);

      setPagination(
        response.pagination || { page, size, total: response.data.length }
      );
    } catch (error) {
      console.error("Failed to fetch user groups:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserGroups(pagination.page || 1, pagination.size || 10);
  }, [pagination.page, pagination.size, fetchUserGroups]);

  const handlePageChange = (page: number) => {
    fetchUserGroups(page, pagination.size || 10);
  };

  const handlePageSizeChange = (size: number) => {
    fetchUserGroups(1, size);
  };

  const handleDeleteUserGroup = async (userGroupId: string) => {
    if (
      globalThis.confirm("Are you sure you want to delete this user group?")
    ) {
      try {
        await deleteUserGroup(userGroupId);
        fetchUserGroups(pagination.page || 1, pagination.size || 10);
      } catch (error) {
        console.error("Failed to delete user group:", error);
      }
    }
  };

  const handleAddGroup = () => {
    setIsAddModalOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleManagePermissions = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsPermissionsModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchUserGroups(pagination.page || 1, pagination.size || 10);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedGroup(null);
    fetchUserGroups(pagination.page || 1, pagination.size || 10);
  };

  const handlePermissionsSuccess = () => {
    setIsPermissionsModalOpen(false);
    setSelectedGroup(null);
    fetchUserGroups(pagination.page || 1, pagination.size || 10);
  };

  const columns = [
    {
      header: "Group Name",
      accessor: "group_name" as keyof UserGroup,
    },
    {
      header: "Created At",
      accessor: (userGroup: UserGroup) => userGroup.created_at,
    },
    {
      header: "Users",
      accessor: () => (
        <div className="flex items-center text-blue-600 hover:text-blue-800">
          <FiUsers className="mr-1" size={16} />
          <span>View</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Groups</h1>
        <Button
          variant="primary"
          size="md"
          icon={<FiPlus />}
          onClick={handleAddGroup}
        >
          Add Group
        </Button>
      </div>

      <Card>
        <DataTable<UserGroup>
          columns={columns}
          data={userGroups}
          keyField="id"
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          emptyState={
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No user groups found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new user group.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  icon={<FiPlus />}
                  onClick={handleAddGroup}
                >
                  Add Group
                </Button>
              </div>
            </div>
          }
          actions={(userGroup) => (
            <div className="flex space-x-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                icon={<FiShield />}
                aria-label="Manage permissions"
                onClick={() => handleManagePermissions(userGroup)}
              >
                Permissions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<FiEdit2 />}
                aria-label="Edit user group"
                onClick={() => handleEditGroup(userGroup)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<FiTrash2 />}
                aria-label="Delete user group"
                onClick={() => handleDeleteUserGroup(userGroup.id)}
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
        title="Add New User Group"
      >
        <AddUserGroupForm
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {selectedGroup && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGroup(null);
          }}
          title="Edit User Group"
        >
          <EditUserGroupForm
            userGroup={selectedGroup}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedGroup(null);
            }}
          />
        </Modal>
      )}

      {selectedGroup && (
        <Modal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setSelectedGroup(null);
          }}
          title="Manage Group Permissions"
          size="lg"
        >
          <ManageGroupPermissionsForm
            userGroup={selectedGroup}
            onSuccess={handlePermissionsSuccess}
            onCancel={() => {
              setIsPermissionsModalOpen(false);
              setSelectedGroup(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserGroups;
