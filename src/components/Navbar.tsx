import { useState } from "react";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Search bar - center on large screens, full width on mobile */}
        <div className="w-full max-w-lg hidden md:block mx-auto">
          <div className="relative text-gray-500 focus-within:text-blue-600">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch size={18} />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="View notifications"
          >
            <FiBell size={20} />
            <span className="absolute top-0 right-0 block h-4 w-4 bg-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* Mobile search button */}
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 py-2 md:hidden">
        <div className="relative text-gray-500 focus-within:text-blue-600">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch size={18} />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search..."
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
