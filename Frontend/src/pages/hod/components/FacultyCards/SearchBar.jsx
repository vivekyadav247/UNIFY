import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ placeholder }) {
  return (
    <div className="bg-gray-50 border rounded-xl flex items-center gap-3 p-3">
      <FiSearch className="text-gray-400" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-gray-600"
      />
    </div>
  );
}
