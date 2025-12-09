import React from "react";

export default function FeedbackCategoryFilter({ categories, activeCategory, setActiveCategory, darkMode }) {
  return (
    <div className={`p-4 rounded-2xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700" 
        : "bg-white border border-gray-200"
    }`}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 font-medium ${
              activeCategory === category.id
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : darkMode
                ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                : "bg-slate-100 text-gray-700 hover:bg-slate-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}