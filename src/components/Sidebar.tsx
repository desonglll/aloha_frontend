import { Link, useLocation, useNavigate } from "react-router";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiLock,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { logout, getCurrentUser } from "../services/authService";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface UserInfo {
  user_id: string | null;
  username: string | null;
  user_group_id: string | null;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    user_id: null,
    username: null,
    user_group_id: null,
  });

  useEffect(() => {
    // Get user info from localStorage
    const currentUser = getCurrentUser();
    setUserInfo(currentUser);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "Users", path: "/users", icon: FiUsers },
    { name: "User Groups", path: "/user-groups", icon: FiUserCheck },
    { name: "Permissions", path: "/permissions", icon: FiLock },
    { name: "Tweets", path: "/tweets", icon: FiMessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get first letter of username for avatar
  const getInitial = () => {
    return userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "A";
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
          onKeyUp={(e) => e.key === "Escape" && toggleSidebar()}
          onKeyDown={(e) => e.key === "Escape" && toggleSidebar()}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-xl font-semibold text-blue-600">Aloha</span>
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 md:hidden"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-md rounded-full transition-colors ${
                    isActive(item.path)
                      ? "font-bold bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 mr-3 ${
                      isActive(item.path) ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {getInitial()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userInfo.username || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo.user_id ? `ID: ${userInfo.user_id}` : "Not logged in"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
