import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMoon, FiSun, FiBell } from "react-icons/fi";
import Sidebar from "../components/Sidebar/Sidebar";

export default function FacultyLayout() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} h-screen`}>
      
      {/* SIDEBAR (STATIC) */}
      <div className="fixed left-0 top-0 h-screen w-72 z-40">
        <Sidebar darkMode={darkMode} />
      </div>

      {/* MAIN AREA */}
      <div className="ml-72 h-screen flex flex-col">
        
        {/* NAVBAR (STATIC) */}
        <header
          className={`fixed top-0 left-72 right-0 z-30 p-6 flex items-center justify-between border-b
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Welcome Back
            </h2>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Faculty
            </p>
          </div>

          <div className={`flex items-center gap-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <div onClick={toggleTheme} className="cursor-pointer">
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </div>

            <div className="relative cursor-pointer">
              <FiBell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                4
              </span>
            </div>

            <img
              src="https://ui-avatars.com/api/?name=Faculty&background=2563eb&color=fff"
              className="w-10 h-10 rounded-full"
              alt="avatar"
            />
          </div>
        </header>

        {/* PAGE CONTENT (ONLY THIS SCROLLS) */}
        <main className="mt-[88px] p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
