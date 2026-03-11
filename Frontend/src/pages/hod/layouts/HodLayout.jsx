import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiBell } from "react-icons/fi";
import Sidebar from "../components/Sidebar/Sidebar";
import NotificationDropdown from "../../../components/NotificationDropdown/NotificationDropdown";
import { hodAPI } from "../../../services/api";

export default function HodLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [hod, setHod] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchHodProfile = async () => {
      try {
        const response = await hodAPI.getProfile();

        // Backend returns { message, hod } not { success, data }
        if (response.hod) {
          setHod(response.hod);

          // Save user info for socket connection
          localStorage.setItem("userRole", "hod");
          localStorage.setItem("userDepartment", response.hod.department);
          localStorage.setItem("userId", response.hod._id);
        } else {
          navigate("/signin");
        }
      } catch (error) {
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchHodProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HOD dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* SIDEBAR */}
      <Sidebar darkMode={darkMode} />

      {/* MAIN AREA */}
      <div className="ml-72 flex-1 flex flex-col">
        {/* NAVBAR */}
        <header
          className={`
            fixed top-0 left-72 right-0 p-6 flex items-center justify-between border-b
            transition-colors duration-300 z-30
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }
          `}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome Back, {hod?.name || "HOD"}
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {hod?.department || "Department"} - Head of Department
            </p>
          </div>

          <div
            className={`flex items-center gap-6 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div
              onClick={toggleTheme}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </div>

            <NotificationDropdown darkMode={darkMode} />

            <img
              src={`https://ui-avatars.com/api/?name=${
                hod?.name || "HOD"
              }&background=2563eb&color=fff`}
              className="w-10 h-10 rounded-full shadow border"
              alt="avatar"
            />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto mt-24">
          <Outlet context={{ darkMode, hod }} />
        </main>
      </div>
    </div>
  );
}
