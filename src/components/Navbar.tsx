import React from "react";
import { Link, useLocation } from "npm:react-router-dom@^6.22.1";

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-blue-700 text-white"
      : "text-blue-200 hover:bg-blue-600 hover:text-white";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-500 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Aloha Admin
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>
            <Link
              to="/user-groups"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/user-groups"
              )}`}
            >
              User Groups
            </Link>
            <Link
              to="/users"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/users"
              )}`}
            >
              Users
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
