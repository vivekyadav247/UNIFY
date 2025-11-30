import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * props:
 *  labels: ["Math","Physics",...]
 *  internal: [..]
 *  external: [..]
 */
export default function SubjectBarChart({
  labels = ["Physics","Data","DBMS","Operating","Computer"],
  internal = [45, 38, 42, 43, 44],
  external = [88, 79, 90, 80, 82],
}) {
  const data = {
    labels,
    datasets: [
      { label: "External %", data: external, backgroundColor: "#10B981" },
      { label: "Internal %", data: internal, backgroundColor: "#3B82F6" },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "bottom" }, tooltip: { mode: "index", intersect: false } },
    scales: {
      y: { beginAtZero: true, max: 100 },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
