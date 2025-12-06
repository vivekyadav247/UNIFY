import React from "react";

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 w-full">
      <p className="text-gray-600 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}
