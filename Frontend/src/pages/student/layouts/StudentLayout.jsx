import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import ProfileCard from "../components/DashboardCards/ProfileCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

export default function StudentLayout({
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

  // Fake student data
  const student = {
    name: "Sakshi Bhadoriya",
    roll: "STU2025",
    email: "sakshi.bhadoriya@example.com",
    course: "B.Sc. Computer Science",
    avatar: "https://ui-avatars.com/api/?name=S+B&background=3b82f6&color=fff",
  };

  // Update page title based on location
  useEffect(() => {
    const pathMap = {
      "/student/dashboard": "Dashboard",
      "/student/attendance": "Attendance",
      "/student/marks": "Marks",
      "/student/assignments": "Assignments",
      "/student/feedback": "Feedback",
      "/student/settings": "Settings",
    };

    const title = pathMap[location.pathname] || "Dashboard";
    setPageTitle(title);
  }, [location.pathname]);

  // Apply data-theme attribute so our CSS variables in `index.css` apply correctly
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
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

      {/* SIDEBAR COMPONENT */}
      <Sidebar darkMode={darkMode} handleLogout={handleLogout} />

      {/* MAIN AREA - Adjusted for fixed sidebar */}
      <div
        className={`flex-1 flex flex-col ml-64 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
        }`}
      >
        {/* NAVBAR COMPONENT */}
        <Navbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          notifications={notifications}
          setNotifications={setNotifications}
          onProfileToggle={() => setShowProfile((s) => !s)}
        />

        {/* NAVBAR + PAGE HEADER (keeps page title visible) */}
        <header
          className={`fixed top-0 right-0 left-64 p-4 border-b shadow-sm flex items-center justify-between z-30 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2 className="text-xl font-semibold">{pageTitle}</h2>
            <p className="text-sm text-slate-500">Welcome back To Unify</p>
          </div>

          <div className="flex items-center gap-6">
            <div onClick={toggleTheme} className="cursor-pointer">
              {darkMode ? "🌞" : "🌙"}
            </div>

            <div className="relative cursor-pointer" onClick={() => setNotifications(0)}>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </div>

            <div ref={profileBtnRef} className="cursor-pointer">
              <img
                onClick={() => setShowProfile(!showProfile)}
                src={student.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full border shadow-md"
              />
            </div>
          </div>
        </header>

        {/* ROUTES OUTLET - Adjusted for fixed navbar and sidebar */}
        <main className="p-6 mt-20">
          {showProfile && (
            <div
              ref={profileCardRef}
              className={`mb-6 border-b ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="max-w-6xl mx-auto p-8">
                <ProfileCard student={student} />
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import ProfileCard from "../components/DashboardCards/ProfileCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

export default function StudentLayout({
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

  // Fake student data
  const student = {
    name: "Sakshi Bhadoriya",
    roll: "STU2025",
    email: "sakshi.bhadoriya@example.com",
    course: "B.Sc. Computer Science",
    avatar: "https://ui-avatars.com/api/?name=S+B&background=3b82f6&color=fff",
  };

  // Update page title based on location
  useEffect(() => {
    const pathMap = {
      "/student/dashboard": "Dashboard",
      "/student/attendance": "Attendance",
      "/student/marks": "Marks",
      "/student/assignments": "Assignments",
      "/student/feedback": "Feedback",
      "/student/settings": "Settings",
    };

    const title = pathMap[location.pathname] || "Dashboard";
    setPageTitle(title);
  }, [location.pathname]);

  // Apply data-theme attribute so our CSS variables in `index.css` apply correctly
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
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

      {/* SIDEBAR COMPONENT */}
      <Sidebar darkMode={darkMode} handleLogout={handleLogout} />

      {/* MAIN AREA - Adjusted for fixed sidebar */}
      <div
        className={`flex-1 flex flex-col ml-64 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
        }`}
      >
        {/* NAVBAR COMPONENT */}
        <Navbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          notifications={notifications}
          setNotifications={setNotifications}
          onProfileToggle={() => setShowProfile((s) => !s)}
        />

        {/* NAVBAR + PAGE HEADER (keeps page title visible) */}
        <header
          className={`fixed top-0 right-0 left-64 p-4 border-b shadow-sm flex items-center justify-between z-30 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2 className="text-xl font-semibold">{pageTitle}</h2>
            <p className="text-sm text-slate-500">Welcome back To Unify</p>
          </div>

          <div className="flex items-center gap-6">
            <div onClick={toggleTheme} className="cursor-pointer">
              {darkMode ? "🌞" : "🌙"}
            </div>

            <div className="relative cursor-pointer" onClick={() => setNotifications(0)}>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </div>

            <div ref={profileBtnRef} className="cursor-pointer">
              <img
                onClick={() => setShowProfile(!showProfile)}
                src={student.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full border shadow-md"
              />
            </div>
          </div>
        </header>

        {/* ROUTES OUTLET - Adjusted for fixed navbar and sidebar */}
        <main className="p-6 mt-20">
          {showProfile && (
            <div
              ref={profileCardRef}
              className={`mb-6 border-b ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="max-w-6xl mx-auto p-8">
                <ProfileCard student={student} />
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}

