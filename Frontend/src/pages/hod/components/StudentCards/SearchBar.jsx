import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder }) {
  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 shadow-sm">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full outline-none"
        />
      </div>
    </div>
  );
}
