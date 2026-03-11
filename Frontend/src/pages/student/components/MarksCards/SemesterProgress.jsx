
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

export default function SemesterProgress({
  labels = ["Internal 1", "Internal 2", "Internal 3", "Prelims"],
  values = [88, 90, 92, 91],
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Average %",
        data: values,
        borderColor: "#1e90ff",
        backgroundColor: "rgba(30,144,255,0.07)",
        tension: 0.25,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // IMPORTANT for custom height
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Semester Progress</h3>

      {/* chart ko small banaya height ke through */}
      <div className="h-48">  {/* 48 = 192px (small size) */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
