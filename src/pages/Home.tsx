import { useEffect, useState, useCallback } from "react";
import type { ComponentType } from "react";
import { FiUsers, FiUserCheck, FiLock, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router";
import Card from "../components/ui/Card.tsx";
import React from "react";

// Stats card component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend = 0,
  linkTo,
}: {
  title: string;
  value: number;
  icon: ComponentType<{ size?: number }>;
  trend?: number;
  linkTo: string;
}) => (
  <Link to={linkTo} className="block transition-transform hover:scale-105">
    <Card className="h-full">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {trend !== 0 && (
          <div
            className={`ml-auto ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            <div className="flex items-center">
              <FiTrendingUp
                className={trend < 0 ? "transform rotate-180" : ""}
              />
              <span className="ml-1 text-sm font-medium">
                {Math.abs(trend)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  </Link>
);

const Home = () => {
  const [stats, setStats] = useState({
    users: 0,
    groups: 0,
    permissions: 0,
  });

  const fetchStats = useCallback(async () => {
    // This would typically fetch data from an API
    // For demo purposes, set some example values
    setStats({
      users: 128,
      groups: 12,
      permissions: 36,
    });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome to the Aloha platform administration dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={FiUsers}
          trend={8}
          linkTo="/users"
        />
        <StatCard
          title="User Groups"
          value={stats.groups}
          icon={FiUserCheck}
          trend={-3}
          linkTo="/user-groups"
        />
        <StatCard
          title="Permissions"
          value={stats.permissions}
          icon={FiLock}
          trend={12}
          linkTo="/permissions"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Recent Activity">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  JS
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  John Smith added a new user
                </p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  AM
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Alice Miller modified permissions
                </p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  RJ
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Robert Johnson created a new group
                </p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="System Status">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  CPU Usage
                </span>
                <span className="text-sm font-medium text-gray-700">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "28%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Memory Usage
                </span>
                <span className="text-sm font-medium text-gray-700">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "62%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Disk Space
                </span>
                <span className="text-sm font-medium text-gray-700">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <span className="text-sm text-gray-700">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
