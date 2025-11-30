
import React from "react";

export default function AssignmentCardList({ items }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Assignments</h3>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
          {items.filter(i => i.status === "pending").length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {items.map((a, index) => (
          <div
            key={index}
            className="bg-slate-50 p-4 rounded-xl border flex flex-col gap-3"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">{a.title}</h4>
                <p className="text-sm text-slate-500">{a.subject}</p>
                <p className="text-xs text-slate-400">Due: {a.due}</p>
              </div>

              <span
                className={`px-2 py-1 h-fit text-xs rounded ${
                  a.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {a.status}
              </span>
            </div>

            {a.status === "pending" ? (
              <button className="bg-blue-600 text-white py-2 rounded">
                Upload Assignment
              </button>
            ) : (
              <button className="border py-2 rounded">
                Download Submission
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
