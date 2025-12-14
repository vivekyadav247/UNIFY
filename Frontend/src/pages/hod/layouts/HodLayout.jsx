import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMoon, FiSun, FiBell } from "react-icons/fi";
import Sidebar from "../components/Sidebar/Sidebar";

export default function HodLayout() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>

      {/* SIDEBAR */}
      <Sidebar darkMode={darkMode} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <header
          className={`
            p-6 flex items-center justify-between border-b
            transition-colors duration-300
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }
          `}
        >
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Welcome Back
            </h2>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Head of Deparment Dashboard
            </p>
          </div>

          <div className={`flex items-center gap-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <div onClick={toggleTheme} className="cursor-pointer hover:text-blue-500 transition-colors">
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </div>

            <div className="relative cursor-pointer">
              <FiBell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                4
              </span>
            </div>

            <img
              src="https://ui-avatars.com/api/?name=hod&background=2563eb&color=fff"
              className="w-10 h-10 rounded-full shadow border"
              alt="avatar"
            />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ darkMode }} />
        </main>
      </div>
    </div>
  );
}

