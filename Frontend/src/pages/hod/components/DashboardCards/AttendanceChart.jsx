
import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AttendanceChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance %",
        data: [92, 88, 95, 90, 89],

        // Smooth pastel blue
        backgroundColor: "rgba(79, 70, 229, 0.6)", // Indigo-500 with transparency
        borderRadius: 10,
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
          color: "rgba(156, 163, 175, 0.25)", // gray-400/25%
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
    <div className="p-5 rounded-2xl shadow-lg bg-white text-gray-900 transition-all">
      <h2 className="font-semibold mb-4 text-lg text-gray-800">
        Weekly Attendance
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
