import React, { useEffect, useState } from "react";
import { userGroupService } from "../services/userGroupService.ts";

const HealthCheck: React.FC = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const healthy = await userGroupService.healthCheck();
      setIsHealthy(healthy);
    } catch (error) {
      console.error("Health check failed:", error);
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center p-2 rounded-md shadow-md ${
          isHealthy === null
            ? "bg-gray-100"
            : isHealthy
            ? "bg-green-100"
            : "bg-red-100"
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            isHealthy === null
              ? "bg-gray-400"
              : isHealthy
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm font-medium">
          {isChecking
            ? "Checking API..."
            : isHealthy === null
            ? "API Status Unknown"
            : isHealthy
            ? "API Available"
            : "API Unavailable"}
        </span>
        <button
          type="button"
          onClick={checkHealth}
          className="ml-2 text-xs text-blue-600 hover:text-blue-800"
          disabled={isChecking}
        >
          {isChecking ? "Checking..." : "Check"}
        </button>
      </div>
    </div>
  );
};

export default HealthCheck;
