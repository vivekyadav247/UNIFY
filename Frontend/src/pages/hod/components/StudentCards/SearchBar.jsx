import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder, onSearch, darkMode }) {
  return (
    <div className="w-full max-w-lg">
      <div
        className={`flex items-center gap-3 border rounded-xl px-4 py-2 shadow-sm transition-colors ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <Search
          size={18}
          className={darkMode ? "text-gray-500" : "text-gray-400"}
        />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className={`w-full outline-none bg-transparent ${
            darkMode
              ? "text-white placeholder-gray-500"
              : "text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>
    </div>
  );
}
