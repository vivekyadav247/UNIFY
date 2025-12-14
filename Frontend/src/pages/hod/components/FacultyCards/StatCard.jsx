import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className="text-3xl font-semibold mt-2">{value}</h2>
    </div>
  );
}
