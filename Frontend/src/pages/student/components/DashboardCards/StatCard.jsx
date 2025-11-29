
import React from "react";

export default function StatCard({ title, value, note }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <h4 className="text-3xl font-bold mt-2">{value}</h4>
      {note && <p className="text-sm text-green-600 mt-1">{note}</p>}
    </div>
  );
}
