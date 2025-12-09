import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiSun, FiMoon } from "react-icons/fi";

const Navbar = ({ darkMode }) => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  };

  const handleProfileClick = () => {
    navigate("/student/profile");
  };

  return (
    <nav
      className={`
        fixed top-0 left-72 right-0 h-16 shadow-sm flex items-center justify-between px-6 border-b
        transition-colors duration-300 z-50
        ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }
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
            ${
              darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }
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
        <div className="relative cursor-pointer group">
          <div
            className={`
              p-2 rounded-lg transition-all duration-300
              ${
                darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <FiBell
              className={`
                text-xl transition-colors duration-300
                ${
                  darkMode
                    ? "text-gray-300 group-hover:text-gray-100"
                    : "text-gray-700 group-hover:text-gray-900"
                }
              `}
            />
          </div>

          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              {notifications}
            </span>
          )}
        </div>

        {/* Profile */}
        <div
          onClick={handleProfileClick}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
            transition-all duration-300
            ${
              darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
            }
          `}
        >
          <img
            src="https://ui-avatars.com/api/?name=Sakshi&background=3b82f6&color=fff"
            alt="profile"
            className={`
              w-9 h-9 rounded-full
              transition-colors duration-300
              ${
                darkMode
                  ? "border border-gray-600"
                  : "border border-gray-300"
              }
            `}
          />
          <span
            className={`
              font-medium text-sm transition-colors duration-300
              ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-900"
              }
            `}
          >
            Sakshi
          </span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
