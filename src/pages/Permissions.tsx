import { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Card from "../components/ui/Card.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import Button from "../components/ui/Button.tsx";
import Modal from "../components/ui/Modal.tsx";
import AddPermissionForm from "../components/forms/AddPermissionForm.tsx";
import EditPermissionForm from "../components/forms/EditPermissionForm.tsx";
import type { Permission, Pagination } from "../types/models.ts";
import {
  getAllPermissions,
  deletePermission,
} from "../services/permissionService.ts";

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const fetchPermissions = useCallback(async (page = 1, size = 10) => {
    try {
      setIsLoading(true);
      const response = await getAllPermissions(page, size);
      setPermissions(response.data);

      setPagination(
        response.pagination || { page, size, total: response.data.length }
      );
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions(pagination.page || 1, pagination.size || 10);
  }, [pagination.page, pagination.size, fetchPermissions]);

  const handlePageChange = (page: number) => {
    fetchPermissions(page, pagination.size || 10);
  };

  const handlePageSizeChange = (size: number) => {
    fetchPermissions(1, size);
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (
      globalThis.confirm("Are you sure you want to delete this permission?")
    ) {
      try {
        await deletePermission(permissionId);
        fetchPermissions(pagination.page || 1, pagination.size || 10);
      } catch (error) {
        console.error("Failed to delete permission:", error);
      }
    }
  };

  const handleAddPermission = () => {
    setIsAddModalOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchPermissions(pagination.page || 1, pagination.size || 10);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedPermission(null);
    fetchPermissions(pagination.page || 1, pagination.size || 10);
  };

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof Permission,
    },
    {
      header: "Description",
      accessor: (permission: Permission) => permission.description || "-",
    },
    {
      header: "Created At",
      accessor: (permission: Permission) => permission.created_at,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
        <Button
          variant="primary"
          size="md"
          icon={<FiPlus />}
          onClick={handleAddPermission}
        >
          Add Permission
        </Button>
      </div>

      <Card>
        <DataTable<Permission>
          columns={columns}
          data={permissions}
          keyField="id"
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          emptyState={
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No permissions found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new permission.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  icon={<FiPlus />}
                  onClick={handleAddPermission}
                >
                  Add Permission
                </Button>
              </div>
            </div>
          }
          actions={(permission) => (
            <div className="flex space-x-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                icon={<FiEdit2 />}
                aria-label="Edit permission"
                onClick={() => handleEditPermission(permission)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<FiTrash2 />}
                aria-label="Delete permission"
                onClick={() => handleDeletePermission(permission.id)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </Card>

      {/* Add Permission Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Permission"
      >
        <AddPermissionForm
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Permission Modal */}
      {selectedPermission && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPermission(null);
          }}
          title="Edit Permission"
        >
          <EditPermissionForm
            permission={selectedPermission}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedPermission(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Permissions;
