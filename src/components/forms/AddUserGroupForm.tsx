import type React from "react";
import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import type { CreateUserGroupFormData } from "../../types/models";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { createUserGroup } from "../../services/userGroupService";

interface AddUserGroupFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddUserGroupForm: React.FC<AddUserGroupFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateUserGroupFormData>({
    group_name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.group_name.trim()) {
      newErrors.group_name = "Group name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await createUserGroup(formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to create user group:", error);
      setErrors({ submit: "Failed to create user group. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="group_name"
        name="group_name"
        label="Group Name"
        value={formData.group_name}
        onChange={handleChange}
        error={errors.group_name}
        placeholder="Enter group name"
        required
      />

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
          Save Group
        </Button>
      </div>
    </form>
  );
};

export default AddUserGroupForm;
