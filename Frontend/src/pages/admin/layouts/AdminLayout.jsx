import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiGrid,
  FiCalendar,
  FiLayers,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
    } finally {
      localStorage.clear();
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { name: "HOD Management", icon: <FiUsers />, path: "/admin/hods" },
    { name: "Departments", icon: <FiGrid />, path: "/admin/departments" },
    { name: "Courses", icon: <FiBookOpen />, path: "/admin/courses" },
    { name: "Branches", icon: <FiLayers />, path: "/admin/branches" },
    { name: "Sections", icon: <FiGrid />, path: "/admin/sections" },
    {
      name: "Academic Years",
      icon: <FiCalendar />,
      path: "/admin/academic-years",
    },
    {
      name: "Semesters",
      icon: <FiLayers />,
      path: "/admin/semesters",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700/50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiLogOut className="text-xl" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
