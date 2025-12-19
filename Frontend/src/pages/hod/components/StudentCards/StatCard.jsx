import React from "react";

export default function StatCard({ title, value, darkMode }) {
  return (
    <div
      className={`shadow-sm rounded-xl p-5 border transition-colors ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {title}
      </p>
      <h2
        className={`text-2xl font-semibold mt-1 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}
