import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiBell } from "react-icons/fi";
import Sidebar from "../components/Sidebar/Sidebar";
import { facultyAPI } from "../../../services/api";

export default function FacultyLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const toggleTheme = () => setDarkMode(!darkMode);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      try {
        const response = await facultyAPI.getProfile();
        if (response.faculty) {
          setFaculty(response.faculty);
        } else {
          navigate("/signin");
        }
      } catch (error) {
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyProfile();
  }, [navigate]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} h-screen`}>
      {loading ? (
        <div
          className={`flex items-center justify-center h-screen ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="text-center">
            <div
              className={`animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4 ${
                darkMode ? "border-blue-400" : "border-blue-600"
              }`}
            ></div>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Loading faculty dashboard...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* SIDEBAR (STATIC) */}
          <div className="fixed left-0 top-0 h-screen w-72 z-40">
            <Sidebar darkMode={darkMode} />
          </div>

          {/* MAIN AREA */}
          <div className="ml-72 h-screen flex flex-col">
            {/* NAVBAR (STATIC) */}
            <header
              className={`fixed top-0 left-72 right-0 z-30 p-6 flex items-center justify-between border-b
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Welcome Back, {faculty?.name || "Faculty"}
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {faculty?.department || "Department"}
                </p>
              </div>

              <div
                className={`flex items-center gap-6 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div onClick={toggleTheme} className="cursor-pointer">
                  {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
                </div>

                <div className="relative" ref={notificationRef}>
                  <div
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="cursor-pointer relative"
                  >
                    <FiBell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div
                      className={`absolute right-0 mt-3 w-80 rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div
                        className={`p-4 border-b ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <h3
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Notifications
                        </h3>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          You have {unreadCount} unread notifications
                        </p>
                      </div>

                      <div
                        className={`divide-y ${
                          darkMode ? "divide-gray-700" : "divide-gray-100"
                        }`}
                      >
                        {notifications.length === 0 ? (
                          <div
                            className={`p-4 text-center text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-4 cursor-pointer transition ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-50"
                              } ${
                                !notif.read
                                  ? darkMode
                                    ? "bg-blue-900/30"
                                    : "bg-blue-50"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4
                                  className={`text-sm font-medium ${
                                    !notif.read
                                      ? darkMode
                                        ? "text-blue-400"
                                        : "text-blue-700"
                                      : darkMode
                                      ? "text-gray-200"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {notif.title}
                                </h4>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p
                                className={`text-xs mb-1 ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {notif.message}
                              </p>
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {notif.time}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div
                          className={`p-3 border-t ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <img
                  src={`https://ui-avatars.com/api/?name=${
                    faculty?.name || "Faculty"
                  }&background=2563eb&color=fff`}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              </div>
            </header>

            {/* PAGE CONTENT (ONLY THIS SCROLLS) */}
            <main className="mt-[88px] p-6 flex-1 overflow-y-auto">
              <Outlet context={{ darkMode, faculty }} />
            </main>
          </div>
        </>
      )}
    </div>
  );
}
