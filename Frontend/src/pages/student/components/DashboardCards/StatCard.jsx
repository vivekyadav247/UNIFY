import React from "react";

export default function StatCard({ title, value, note, darkMode }) {
  return (
    <div
      className={`p-5 rounded-xl transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700"
          : "bg-white border border-gray-200"
      } shadow`}
    >
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-slate-500"}`}>
        {title}
      </p>
      <h4
        className={`text-3xl font-bold mt-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </h4>
      {note && (
        <p className="text-sm text-green-500 mt-1" style={{ color: darkMode ? '#4ade80' : '#16a34a' }}>
          {note}
        </p>
      )}
    </div>
  );
}
