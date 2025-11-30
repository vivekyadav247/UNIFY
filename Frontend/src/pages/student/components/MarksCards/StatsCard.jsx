import React from "react";

/**
 * Renders the 4 top stat cards (overall %, total marks, highest score, class rank)
 * Accepts `stats` prop:
 * {
 *   overall: "82.2%",
 *   total: "737 / 900",
 *   highest: "88.7% (DSA)",
 *   rank: "8 / 120"
 * }
 */
export default function StatsCard({ stats = {} }) {
  const data = {
    overall: stats.overall ?? "82.2%",
    total: stats.total ?? "737 / 900",
    highest: stats.highest ?? "88.7% (DSA)",
    rank: stats.rank ?? "8 / 120",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="rounded-xl p-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow">
        <p className="text-sm opacity-90">Overall Percentage</p>
        <div className="mt-6 text-3xl font-bold">{data.overall}</div>
        <p className="text-sm mt-2 opacity-80">Grade: A</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <p className="text-sm text-slate-500">Total Marks</p>
        <div className="mt-4 text-2xl font-semibold">{data.total}</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <p className="text-sm text-slate-500">Highest Score</p>
        <div className="mt-4 text-2xl font-semibold">{data.highest}</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <p className="text-sm text-slate-500">Class Rank</p>
        <div className="mt-4 text-2xl font-semibold">{data.rank}</div>
      </div>
    </div>
  );
}
