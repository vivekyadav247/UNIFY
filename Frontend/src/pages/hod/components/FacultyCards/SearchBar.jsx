import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ placeholder, onSearch, darkMode }) {
  return (
    <div
      className={`border rounded-xl flex items-center gap-3 p-3 transition-colors ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      <FiSearch
        className={darkMode ? "text-gray-500" : "text-gray-400"}
        size={20}
      />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className={`bg-transparent outline-none w-full ${
          darkMode
            ? "text-white placeholder-gray-500"
            : "text-gray-600 placeholder-gray-400"
        }`}
      />
    </div>
  );
}
