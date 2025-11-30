import React from "react";

/**
 * A simple summary (blue box) with paragraph
 */
export default function SummaryCard({ text = "Excellent performance with consistent improvement throughout the semester. Strongest in Data Structures and Computer Networks. Keep up the good work!" }) {
  return (
    <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
      <h3 className="text-lg font-semibold mb-2">Performance Summary</h3>
      <p className="text-slate-700">{text}</p>
    </div>
  );
}
