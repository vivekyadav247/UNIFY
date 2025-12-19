import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiCheckSquare,
  FiBookOpen,
  FiLogOut,
  FiSettings,
  FiBarChart2,
  FiCalendar,
  FiBell,
  FiPieChart,
  FiUser,
} from "react-icons/fi";

const Sidebar = ({ darkMode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/faculty/dashboard" },
    {
      name: "Attendance",
      icon: <FiCheckSquare />,
      path: "/faculty/attendance",
    },
    { name: "Assignments", icon: <FiBookOpen />, path: "/faculty/assignments" },
    {
      name: "Leave Request",
      icon: <FiLogOut />,
      path: "/faculty/leave-management",
    },
    {
      name: "Announcements",
      icon: <FiBell />,
      path: "/faculty/announcements",
    },
    { name: "Schedule", icon: <FiCalendar />, path: "/faculty/schedule" },
    { name: "Profile", icon: <FiUser />, path: "/faculty/profile" },
    { name: "Settings", icon: <FiSettings />, path: "/faculty/settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div
      className={`h-screen w-72 border-r flex flex-col ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      {/* BRAND */}
      <div className="px-6 py-8 border-b">
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Uni<span className="text-blue-500">fy</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">FACULTY PANEL</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive
                  ? darkMode
                    ? "bg-blue-900/40 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

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
  );
};

export default Sidebar;
