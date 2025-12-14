import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-5 border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-1">{value}</h2>
    </div>
  );
}
