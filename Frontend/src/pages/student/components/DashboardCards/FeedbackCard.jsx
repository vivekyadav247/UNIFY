import React from "react";

export default function FeedbackCard({ items, darkMode }) {
  return (
    <div
      className={`p-6 rounded-xl transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700"
          : "bg-white border border-gray-200"
      } shadow`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Feedback from Teacher Guardian
      </h3>

      <div className="space-y-4">
        {items.map((f, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {f.by}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  {f.date}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded transition-colors duration-300 ${
                  darkMode
                    ? "bg-blue-900/50 text-blue-300"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {f.tag}
              </span>
            </div>

            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
