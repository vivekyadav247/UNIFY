import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { studentAPI } from "../../../services/api";

import ProfileCard from "../components/DashboardCards/ProfileCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

export default function StudentLayout({
  currentTheme,
  toggleTheme,
  notifications,
  setNotifications,
}) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileBtnRef = useRef();
  const profileCardRef = useRef();

  // Fetch student profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentAPI.getProfile();
        if (res.student) {
          setStudent(res.student);
        }
      } catch (err) {
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

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
        <Navbar
          darkMode={darkMode}
          student={student}
          notifications={notifications}
        />

        {/* ROUTES OUTLET WITH TOP PADDING */}
        <main className="pt-20 p-6 flex-1 overflow-y-auto">
          <Outlet context={{ darkMode, student }} />
        </main>
      </div>
    </div>
  );
}
