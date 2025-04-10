import React from "react";
import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import type { Permission } from "../../types/models";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { updatePermission } from "../../services/permissionService";

interface EditPermissionFormProps {
  permission: Permission;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPermissionForm: React.FC<EditPermissionFormProps> = ({
  permission,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    id: permission.id,
    name: permission.name,
    description: permission.description || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Permission name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await updatePermission({
        ...permission,
        name: formData.name,
        description: formData.description || null,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to update permission:", error);
      setErrors({ submit: "Failed to update permission. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Permission Name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter permission name"
        required
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter permission description (optional)"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {errors.submit && (
        <div className="text-sm text-red-600 mt-2">{errors.submit}</div>
      )}

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
          isLoading={isLoading}
          icon={<FiSave />}
        >
          Update Permission
        </Button>
      </div>
    </form>
  );
};

export default EditPermissionForm;
