import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiBell, FiSearch, FiSun, FiMoon, FiX } from "react-icons/fi";
import { studentAPI } from "../../../../services/api";

const Navbar = ({ darkMode, notifications: passedNotifications = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const { enrollmentNumber } = useParams();

  useEffect(() => {
    // Fetch student profile for name and enrollment number
    const fetchStudent = async () => {
      try {
        const res = await studentAPI.getProfile();
        if (res.student) {
          setStudent(res.student);
        }
      } catch (err) {}
    };
    fetchStudent();
  }, []);

  useEffect(() => {
    // Update notifications from parent
    if (passedNotifications && passedNotifications.length > 0) {
      setNotifications(passedNotifications);
    }
  }, [passedNotifications]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  };

  const handleProfileClick = () => {
    navigate(`/${enrollmentNumber}/settings`);
  };

  const clearNotification = (index) => {
    const updated = notifications.filter((_, i) => i !== index);
    setNotifications(updated);
  };

  return (
    <nav
      className={`
        fixed top-0 left-72 right-0 h-16 shadow-sm flex items-center justify-between px-6 border-b
        transition-colors duration-300 z-50
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* SEARCH BAR */}
      <div
        className={`
          flex items-center px-4 py-2 rounded-lg w-80
          transition-colors duration-300
          ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-gray-100 border border-gray-200"
          }
        `}
      >
        <FiSearch
          className={`
            text-lg mr-2
            transition-colors duration-300
            ${darkMode ? "text-gray-400" : "text-gray-600"}
          `}
        />
        <input
          type="text"
          placeholder="Search anything..."
          className={`
            bg-transparent outline-none w-full text-sm
            transition-colors duration-300
            placeholder-gray-500
            ${
              darkMode
                ? "text-white placeholder-gray-500"
                : "text-gray-900 placeholder-gray-500"
            }
          `}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-8">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }
          `}
        >
          {darkMode ? (
            <FiSun className="text-xl" />
          ) : (
            <FiMoon className="text-xl" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              p-2 rounded-lg transition-all duration-300 cursor-pointer
              ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
            `}
          >
            <FiBell
              className={`
                text-xl transition-colors duration-300
                ${
                  darkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-700 hover:text-gray-900"
                }
              `}
            />
          </div>

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              {notifications.length}
            </span>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className={`
                absolute right-0 top-12 w-80 rounded-lg shadow-xl border
                max-h-96 overflow-y-auto z-50
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }
              `}
            >
              {notifications.length === 0 ? (
                <div className="p-4 text-center">
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    No notifications
                  </p>
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    key={index}
                    className={`
                      p-4 border-b flex justify-between items-start gap-3 transition-colors
                      hover:bg-gray-50 dark:hover:bg-gray-700/50
                      ${darkMode ? "border-gray-700" : "border-gray-200"}
                    `}
                  >
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-sm ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {notif.title || "Notification"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {notif.message || notif.description}
                      </p>
                      {notif.time && (
                        <p
                          className={`text-xs mt-2 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {notif.time}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => clearNotification(index)}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          onClick={handleProfileClick}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
            transition-all duration-300
            ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
          `}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${
              student?.name || "Student"
            }&background=3b82f6&color=fff`}
            alt="profile"
            className={`
              w-9 h-9 rounded-full
              transition-colors duration-300
              ${darkMode ? "border border-gray-600" : "border border-gray-300"}
            `}
          />
          <span
            className={`
              font-medium text-sm transition-colors duration-300
              ${darkMode ? "text-gray-200" : "text-gray-900"}
            `}
          >
            {student?.name || "Student"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
