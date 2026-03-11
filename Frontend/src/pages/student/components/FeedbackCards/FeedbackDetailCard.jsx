import React from "react";
import { FiUser, FiCalendar, FiTag, FiStar } from "react-icons/fi";

export default function FeedbackDetailCard({ feedback, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700 hover:border-gray-600" 
        : "bg-white border border-gray-200 hover:border-gray-300"
    }`}>
      
      <div className="space-y-4">
        
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-full ${darkMode ? "bg-purple-900/30" : "bg-purple-100"}`}>
                <FiUser className={`${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {feedback.from}
                </h3>
              </div>
            </div>
          </div>

          {/* RATING */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`text-lg ${
                  i < feedback.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* TITLE */}
        <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          {feedback.title}
        </h4>

        {/* METADATA */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {new Date(feedback.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FiTag className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors duration-300 ${
              feedback.category === "Academic"
                ? darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"
                : feedback.category === "Mentorship"
                ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                : darkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"
            }`}>
              {feedback.category}
            </span>
          </div>
        </div>

        {/* MESSAGE */}
        <p className={`text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {feedback.message}
        </p>
      </div>
    </div>
  );
}