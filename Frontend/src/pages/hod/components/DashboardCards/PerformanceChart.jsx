import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PerformanceChart({ darkMode, performanceData = [] }) {
  const data = {
    labels: performanceData.map((item) => item.semester || item.label) || [
      "Sem1",
      "Sem2",
      "Sem3",
      "Sem4",
    ],
    datasets: [
      {
        label: "Avg Score",
        data: performanceData.map((item) => item.score || item.value) || [],
        borderColor: "rgb(99,102,241)", // Indigo-500
        backgroundColor: "rgba(99,102,241,0.2)", // soft fill
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(99,102,241)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6B7280", // gray-500
        },
        grid: {
          color: "rgba(156,163,175,0.25)", // gray-400/25%
        },
      },
      x: {
        ticks: {
          color: "#6B7280",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className={`p-5 rounded-xl shadow-md transition-all ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`font-semibold mb-3 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Academic Performance
      </h2>
      <Line data={data} options={options} />
    </div>
  );
}
