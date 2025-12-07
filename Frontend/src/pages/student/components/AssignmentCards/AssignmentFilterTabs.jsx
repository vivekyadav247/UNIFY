import React from "react";

export default function AssignmentFilterTabs({ activeTab, setActiveTab, darkMode }) {
  const tabs = [
    { id: "all", label: "All Assignments", count: 12 },
    { id: "pending", label: "Pending", count: 3 },
    { id: "submitted", label: "Submitted", count: 8 },
    { id: "overdue", label: "Overdue", count: 1 },
  ];

  return (
    <div className={`p-4 rounded-2xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700" 
        : "bg-white border border-gray-200"
    }`}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 font-medium ${
              activeTab === tab.id
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : darkMode
                ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                : "bg-slate-100 text-gray-700 hover:bg-slate-200"
            }`}
          >
            {tab.label} <span className="text-xs ml-2">({tab.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}