import React from "react";

export default function FeedbackTabs({ active, setActive }) {
  const tabs = [
    { key: "all", label: "All" },
    { key: "academic", label: "Academic" },
    { key: "mentorship", label: "Mentorship" },
    { key: "behavioral", label: "Behavioral" },
  ];

  return (
    <div className="flex gap-3 mt-6 mb-4">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          className={`px-4 py-2 rounded-lg text-sm ${
            active === t.key ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
