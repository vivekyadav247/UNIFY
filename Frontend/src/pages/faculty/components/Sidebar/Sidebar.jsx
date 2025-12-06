import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiCheckSquare,
  FiBarChart2,
  FiMessageSquare,
  FiLogOut,
  FiSettings
} from "react-icons/fi";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/student/dashboard" },
    { name: "Assignments", icon: <FiBook />, path: "/student/assignments" },
    { name: "Attendance", icon: <FiCheckSquare />, path: "/student/attendance" },
    { name: "Marks", icon: <FiBarChart2 />, path: "/student/marks" },
    { name: "Feedback", icon: <FiMessageSquare />, path: "/student/feedback" },
  ];

  return (
    <div className="w-64 bg-white shadow-xl border-r flex flex-col">

      {/* LOGO */}
      <div className="p-6 text-3xl font-extrabold bg-gradient-to-r 
            from-purple-600 to-blue-600 text-transparent bg-clip-text">
        UNIFY
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm rounded-lg font-medium transition
              ${
                isActive
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER BUTTONS */}
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left">
          <FiSettings className="text-lg" /> Settings
        </button>

        <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full text-left mt-2">
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
