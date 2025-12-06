
import React from "react";

export default function EventCard({ events }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Upcoming Events & Notices</h3>

      <div className="space-y-3">
        {events.map((e, index) => (
          <div key={index} className="p-3 bg-slate-50 rounded-lg">
            <p className="font-medium">{e.title}</p>
            <p className="text-xs text-slate-500">{e.date}</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded">
        Apply for Leave
      </button>
    </div>
  );
}
