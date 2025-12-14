
import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

import ProfileCard from "../components/DashboardCards/ProfileCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

export default function StudentLayout({
  currentTheme,
  toggleTheme,
  notifications,
  setNotifications,
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileBtnRef = useRef();
  const profileCardRef = useRef();

  // Fake student data
  const student = {
    name: "Sakshi Bhadoriya",
    roll: "STU2025",
    email: "sakshi.bhadoriya@example.com",
    course: "B.Sc. Computer Science",
    avatar: "https://ui-avatars.com/api/?name=S+B&background=3b82f6&color=fff",
  };

  // Apply Theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
      {/* SIDEBAR COMPONENT */}
      <Sidebar darkMode={darkMode} />

      {/* MAIN AREA */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
        }`}
      >
        {/* NAVBAR COMPONENT */}
        <Navbar darkMode={darkMode} />

        {/* ROUTES OUTLET WITH TOP PADDING */}
        <main className="pt-20 p-6 flex-1 overflow-y-auto">
          <Outlet context={{ darkMode }} />
        </main>
      </div>
    </div>
  );
}