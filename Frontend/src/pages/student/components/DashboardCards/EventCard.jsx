import React from "react";

export default function EventCard({ events, darkMode }) {
  return (
    <div className={`p-6 rounded-xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700" 
        : "bg-white border border-gray-200"
    } shadow`}>
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Upcoming Events & Notices
      </h3>

      <div className="space-y-3">
        {events.map((e, index) => (
          <div key={index} className={`p-3 rounded-lg transition-colors duration-300 ${
            darkMode 
              ? "bg-gray-700/30 border border-gray-600" 
              : "bg-slate-50 border border-gray-200"
          }`}>
            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{e.title}</p>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-slate-500"}`}>{e.date}</p>
          </div>
        ))}
      </div>

      <button className={`w-full mt-6 py-3 rounded transition-all duration-300 font-medium ${
        darkMode 
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}>
        Apply for Leave
      </button>
    </div>
  );
}
