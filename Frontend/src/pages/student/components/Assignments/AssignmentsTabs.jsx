
import React from "react";

/**
 * active: "pending" | "submitted"
 * setActive: function
 */
export default function AssignmentTabs({ active, setActive, counts = {} }) {
  const tabs = [
    { key: "pending", label: `Pending (${counts.pending ?? 0})` },
    { key: "submitted", label: `Submitted (${counts.submitted ?? 0})` },
  ];

  return (
    <div className="my-5">
      <div className="inline-flex bg-gray-100 p-1 rounded-full">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              active === t.key ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
