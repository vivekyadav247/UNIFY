
// HOD Sidebar (screenshot style)
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiCheckSquare,
  FiCalendar,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function HODSidebar({ onLogout }) {
  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/hod/dashboard" },
    { name: "Faculty", icon: <FiUsers />, path: "/hod/faculty" },
    { name: "Students", icon: <FiBook />, path: "/hod/students" },
    { name: "Attendance", icon: <FiCheckSquare />, path: "/hod/attendance" },
    { name: "Reports", icon: <FiBarChart2 />, path: "/hod/reports" },
    { name: "Events", icon: <FiCalendar />, path: "/hod/events" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-md flex flex-col">
      
      {/* LOGO */}
      <div className="p-6 text-3xl font-extrabold bg-gradient-to-r 
          from-purple-600 to-blue-600 text-transparent bg-clip-text">
        UNIFY
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 mt-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition
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

      {/* SETTINGS + LOGOUT */}
      <div className="p-4 border-t">
        <NavLink
          to="/hod/settings"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <FiSettings className="text-lg" /> Settings
        </NavLink>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full mt-2"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </aside>
  );
}
