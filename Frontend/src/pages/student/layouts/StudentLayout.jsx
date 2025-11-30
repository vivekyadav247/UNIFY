
import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  MessageCircle,
  Settings,
  Bell,
  Moon,
  Sun,
  BookOpen,
} from "lucide-react";

// ✅ Correct Path (based on your folder structure)
import ProfileCard from "../components/DashboardCards/ProfileCard";

export default function StudentLayout({
  currentTheme,
  toggleTheme,
  notifications,
  setNotifications,
}) {
  const [darkMode, setDarkMode] = useState(currentTheme === "dark");
  const [showProfile, setShowProfile] = useState(false);

  const profileBtnRef = useRef();
  const profileCardRef = useRef();

  // Fake student data (same as your code)
  const student = {
    name: "Sakshi Bhadoriya",
    roll: "STU2025",
    email: "sakshi.bhadoriya@example.com",
    course: "B.Sc. Computer Science",
    avatar: "https://ui-avatars.com/api/?name=S+B&background=3b82f6&color=fff",
  };

  // Apply Theme
  useEffect(() => {
    setDarkMode(currentTheme === "dark");
  }, [currentTheme]);

  useEffect(() => {
    document.documentElement.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // Close dropdown card on outside click
  useEffect(() => {
    function handleClick(e) {
      const isBtn = profileBtnRef.current?.contains(e.target);
      const isCard = profileCardRef.current?.contains(e.target);

      if (!isBtn && !isCard) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside
        className={`w-64 border-r p-6 shadow-sm flex flex-col ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        }`}
      >
        <h1 className="text-2xl font-bold mb-8">Unify</h1>

        <nav className="flex flex-col gap-2 text-[15px] font-medium">
          {[
            { to: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
            { to: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
            { to: "marks", icon: <ClipboardList size={20} />, label: "Marks" },
            { to: "assignments", icon: <BookOpen size={20} />, label: "Assignments" },
            { to: "feedback", icon: <MessageCircle size={20} />, label: "Feedback" },
            { to: "settings", icon: <Settings size={20} />, label: "Settings" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={`/student/${item.to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? darkMode
                      ? "bg-blue-900 text-blue-200"
                      : "bg-blue-100 text-blue-700"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
        }`}
      >

        {/* NAVBAR */}
        <header
          className={`p-4 border-b shadow-sm flex items-center justify-between ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <p className="text-sm text-slate-500">Welcome back To Unify</p>
          </div>

          <div className="flex items-center gap-6">

            {/* Theme Switch */}
            <div onClick={toggleTheme} className="cursor-pointer">
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </div>

            {/* Notifications */}
            <div className="relative cursor-pointer" onClick={() => setNotifications(0)}>
              <Bell size={22} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </div>

            {/* Profile Button */}
            <div ref={profileBtnRef} className="cursor-pointer">
              <img
                onClick={() => setShowProfile(!showProfile)}
                src={student.avatar}
                className="w-10 h-10 rounded-full border shadow-md"
              />
            </div>
          </div>
        </header>

        {/* PROFILE CARD BELOW NAVBAR */}
        {showProfile && (
          <div
            ref={profileCardRef}
            className={`border-b ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="max-w-5xl mx-auto p-6">
              <ProfileCard student={student} />
            </div>
          </div>
        )}

        {/* ROUTES OUTLET */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
