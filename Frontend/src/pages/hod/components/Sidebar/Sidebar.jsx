import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiBook,
  FiMessageSquare,
  FiLogOut,
  FiSettings,
  FiUserCheck,
  FiFileText,
  FiClock,
  FiBell,
} from "react-icons/fi";
import NotificationDropdown from "../../../../components/NotificationDropdown/NotificationDropdown";

const Sidebar = ({ darkMode }) => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/hod/dashboard" },
    { name: "Faculty", icon: <FiUserCheck />, path: "/hod/faculty" },
    {
      name: "Faculty Leaves",
      icon: <FiFileText />,
      path: "/hod/faculty-leaves",
    },
    {
      name: "Faculty Attendance",
      icon: <FiCheckSquare />,
      path: "/hod/faculty-attendance",
    },
    { name: "Schedule", icon: <FiClock />, path: "/hod/schedule-management" },
    { name: "Semesters", icon: <FiBook />, path: "/hod/semesters" },
    { name: "Students", icon: <FiUsers />, path: "/hod/students" },
    { name: "Announcements", icon: <FiBell />, path: "/hod/announcements" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div
      className={`
        h-screen w-72 border-r flex flex-col shadow-lg fixed left-0 top-0
        transition-colors duration-300 z-40
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
      `}
    >
      {/* BRAND SECTION */}
      <div
        className={`
          px-6 py-8 border-b
          transition-colors duration-300
          ${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }
        `}
      >
        <h1
          className={`
            text-2xl font-bold
            ${darkMode ? "text-white" : "text-gray-900"}
          `}
        >
          Uni<span className="text-blue-500">fy</span>
        </h1>
        <p
          className={`
            text-[12px] font-medium tracking-wide mt-1
            transition-colors duration-300
            ${darkMode ? "text-gray-400" : "text-gray-600"}
          `}
        >
          HOD GUARDIAN
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              group flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium
              transition-all duration-300
              
              ${
                isActive
                  ? darkMode
                    ? "bg-blue-900/40 text-blue-300 border border-blue-800/50"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
              `
            }
          >
            <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="tracking-wide flex-1">{item.name}</span>
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-4 px-4">
          <div
            className={`
              h-px
              transition-colors duration-300
              ${darkMode ? "bg-gray-700/50" : "bg-gray-200"}
            `}
          ></div>
        </div>

        {/* TG MANAGEMENT */}
        <NavLink
          to="/hod/tg-management"
          className={({ isActive }) =>
            `
            group flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium
            transition-all duration-300
            
            ${
              isActive
                ? darkMode
                  ? "bg-blue-900/40 text-blue-300 border border-blue-800/50"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }
          `
          }
        >
          <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
            <FiUsers />
          </span>
          <span className="tracking-wide flex-1">TG Management</span>
        </NavLink>

        {/* SETTINGS */}
        <NavLink
          to="/hod/settings"
          className={({ isActive }) =>
            `
            group flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium
            transition-all duration-300
            
            ${
              isActive
                ? darkMode
                  ? "bg-blue-900/40 text-blue-300 border border-blue-800/50"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }
          `
          }
        >
          <span className="text-lg flex-shrink-0">
            <FiSettings />
          </span>
          <span className="tracking-wide flex-1">Settings</span>
        </NavLink>
      </nav>

      {/* USER INFO SECTION */}
      <div
        className={`
          px-3 py-4 border-t
          transition-colors duration-300
          ${
            darkMode
              ? "bg-gray-800/30 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }
        `}
      >
        <div
          className={`
            px-4 py-3 rounded-lg border mb-4
            transition-colors duration-300
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-200"
            }
          `}
        >
          <div className="flex-1 min-w-0">
            <p
              className={`
                text-xs font-medium
                transition-colors duration-300
                ${darkMode ? "text-gray-400" : "text-gray-600"}
              `}
            >
              Logged in as
            </p>
            <p
              className={`
                text-sm font-semibold mt-1 truncate
                transition-colors duration-300
                ${darkMode ? "text-white" : "text-gray-900"}
              `}
            >
              {localStorage.getItem("username") || "HOD"}
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3
            rounded-lg transition-all duration-300 font-medium text-[14px]
            ${
              darkMode
                ? "bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-700/50"
                : "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300"
            }
          `}
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
