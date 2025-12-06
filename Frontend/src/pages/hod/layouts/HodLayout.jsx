
import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  BarChart2,
  ClipboardList,
  Settings,
  Bell,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

import ProfileCard from "../../student/components/DashboardCards/ProfileCard";

export default function HodLayout({
  currentTheme,
  toggleTheme,
  notifications,
  setNotifications,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(currentTheme === "dark");
  const [showProfile, setShowProfile] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const profileBtnRef = useRef();
  const profileCardRef = useRef();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const hod = {
    name: "Dr. A. Sharma",
    role: "Head of Department",
    avatar: "https://ui-avatars.com/api/?name=A+S&background=6366F1&color=fff",
  };

  // Theme
  useEffect(() => {
    setDarkMode(currentTheme === "dark");
  }, [currentTheme]);

  // Page Title Map
  useEffect(() => {
    const map = {
      "/hod/dashboard": "Dashboard",
      "/hod/faculty": "Faculty",
      "/hod/students": "Students",
      "/hod/attendance": "Attendance",
      "/hod/reports": "Reports",
      "/hod/events": "Events",
      "/hod/settings": "Settings",
    };

    setPageTitle(map[location.pathname] || "Dashboard");
  }, [location.pathname]);

  // Theme Attribute
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  // Close profile card
  useEffect(() => {
    function handleClick(e) {
      const isBtn = profileBtnRef.current?.contains(e.target);
      const isCard = profileCardRef.current?.contains(e.target);
      if (!isBtn && !isCard) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ⭐ HOD MENU (from your screenshot)
  const menu = [
    { to: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "faculty", icon: <Users size={20} />, label: "Faculty" },
    { to: "students", icon: <BookOpen size={20} />, label: "Students" },
    { to: "attendance", icon: <ClipboardList size={20} />, label: "Attendance" },
    { to: "reports", icon: <BarChart2 size={20} />, label: "Reports" },
    { to: "events", icon: <Calendar size={20} />, label: "Events" },
  ];

  return (
    <div className="flex min-h-screen">

      {/* ⭐ SIDEBAR EXACT LIKE YOUR IMAGE */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm p-6 flex flex-col z-40">

        {/* UNIFY Brand (Gradient like your screenshot) */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-10">
          UNIFY
        </h1>

        {/* Menu */}
        <nav className="flex flex-col gap-2 text-[15px] font-medium">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={`/hod/${item.to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          {/* Settings (bottom group in screenshot) */}
          <NavLink
            to="/hod/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all mt-6 ${
                isActive
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-64 bg-gray-100">

        {/* NAVBAR */}
        <header className="fixed top-0 right-0 left-64 p-4 bg-white border-b shadow-sm flex items-center justify-between z-30">
          <div>
            <h2 className="text-xl font-semibold">{pageTitle}</h2>
            <p className="text-sm text-gray-500">Welcome back to Unify</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <div onClick={toggleTheme} className="cursor-pointer">
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </div>

            {/* Notifications */}
            <div className="relative cursor-pointer" onClick={() => setNotifications(0)}>
              <Bell size={22} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </div>

            {/* Profile Button */}
            <div ref={profileBtnRef} className="cursor-pointer">
              <img
                onClick={() => setShowProfile(!showProfile)}
                src={hod.avatar}
                className="w-10 h-10 rounded-full border shadow-md"
              />
            </div>
          </div>
        </header>

        {/* MAIN PAGES */}
        <main className="p-6 mt-20">
          {showProfile && (
            <div
              ref={profileCardRef}
              className="mb-6 bg-white border rounded-lg shadow"
            >
              <div className="max-w-6xl mx-auto p-8">
                <ProfileCard student={hod} />
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
