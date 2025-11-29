import React from "react";
import { FiBell, FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6 border-b">

      {/* SEARCH BAR */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-80">
        <FiSearch className="text-gray-600 text-lg mr-2" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none w-full"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <FiBell className="text-2xl text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="/assets/user.png"
            alt="profile"
            className="w-10 h-10 rounded-full border"
          />
          <span className="font-medium">Sakshi</span>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
 