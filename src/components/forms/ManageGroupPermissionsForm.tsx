import type React from "react";
import { useState, useEffect } from "react";
import { FiSave, FiX } from "react-icons/fi";
import type {
  Permission,
  UserGroup,
  CreateGroupPermissionFormData,
  GroupPermission,
} from "../../types/models";
import Button from "../ui/Button";
import { getAllPermissions } from "../../services/permissionService";
import {
  getAllGroupPermissions,
  createGroupPermission,
  deleteGroupPermission,
} from "../../services/groupPermissionService";

interface ManageGroupPermissionsFormProps {
  userGroup: UserGroup;
  onSuccess: () => void;
  onCancel: () => void;
}

const ManageGroupPermissionsForm: React.FC<ManageGroupPermissionsFormProps> = ({
  userGroup,
  onSuccess,
  onCancel,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all permissions
        const permissionsResponse = await getAllPermissions();
        setPermissions(permissionsResponse.data);

        // Fetch group's assigned permissions
        const groupPermissionsResponse = await getAllGroupPermissions({
          groupId: userGroup.id,
        });
        setAssignedPermissionIds(
          groupPermissionsResponse.data.map(
            (gp: GroupPermission) => gp.permission_id
          )
        );
      } catch (error) {
        console.error("Failed to fetch permissions data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userGroup.id]);

  const togglePermission = (permissionId: string) => {
    setAssignedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Get current assignments to determine changes
      const currentPermissions = await getAllGroupPermissions({
        groupId: userGroup.id,
      });
      const currentPermissionIds = currentPermissions.data.map(
        (gp: GroupPermission) => gp.permission_id
      );

      // Permissions to add (in new set but not in current)
      const permissionsToAdd = assignedPermissionIds.filter(
        (id) => !currentPermissionIds.includes(id)
      );

      // Permissions to remove (in current but not in new)
      const permissionsToRemove = currentPermissionIds.filter(
        (id) => !assignedPermissionIds.includes(id)
      );

      // Add new permissions
      const addPromises = permissionsToAdd.map((permissionId) => {
        const data: CreateGroupPermissionFormData = {
          group_id: userGroup.id,
          permission_id: permissionId,
        };
        return createGroupPermission(data);
      });

      // Remove permissions
      const removePromises = permissionsToRemove.map((permissionId) => {
        return deleteGroupPermission(userGroup.id, permissionId);
      });

      await Promise.all([...addPromises, ...removePromises]);
      onSuccess();
    } catch (error) {
      console.error("Failed to update permissions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-4 text-center">Loading permissions...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">
          Permissions for {userGroup.group_name}
        </h3>
        <p className="text-sm text-gray-500">
          Select the permissions that should be assigned to this group.
        </p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1 font-medium text-sm text-gray-700">
              Select
            </div>
            <div className="col-span-5 font-medium text-sm text-gray-700">
              Name
            </div>
            <div className="col-span-6 font-medium text-sm text-gray-700">
              Description
            </div>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {permissions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No permissions found.
            </div>
          ) : (
            permissions.map((permission) => (
              <div
                key={permission.id}
                className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={assignedPermissionIds.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      id={`permission-${permission.id}`}
                    />
                  </div>
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="col-span-5 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {permission.name}
                  </label>
                  <div className="col-span-6 text-sm text-gray-500">
                    {permission.description || "-"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          icon={<FiX />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          icon={<FiSave />}
        >
          Save Permissions
        </Button>
      </div>
    </form>
  );
};

export default ManageGroupPermissionsForm;
