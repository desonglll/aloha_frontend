import type React from "react";
import { useState, useEffect } from "react";
import { FiSave, FiX } from "react-icons/fi";
import type { CreateUserFormData, UserGroup } from "../../types/models";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { getAllUserGroups } from "../../services/userGroupService";
import { createUser } from "../../services/userService";

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: "",
    password: "",
    user_group_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await getAllUserGroups();
        setUserGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch user groups:", error);
      }
    };

    fetchUserGroups();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "user_group_id" ? value || null : value,
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

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await createUser(formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to create user:", error);
      setErrors({ submit: "Failed to create user. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="username"
        name="username"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="Enter username"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter password"
        required
      />

      <div>
        <label
          htmlFor="user_group_id"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          User Group
        </label>
        <select
          id="user_group_id"
          name="user_group_id"
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          value={formData.user_group_id || ""}
          onChange={handleChange}
        >
          <option value="">-- Select User Group --</option>
          {userGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.group_name}
            </option>
          ))}
        </select>
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
          Save User
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
