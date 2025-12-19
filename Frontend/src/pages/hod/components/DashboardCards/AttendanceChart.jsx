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

export default function AttendanceChart({ darkMode, attendanceData = [] }) {
  const data = {
    labels: attendanceData.map((item) => item.day || item.label) || [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ],
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map((item) => item.percentage || item.value) || [],

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
    <div
      className={`p-5 rounded-2xl shadow-lg transition-all ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2
        className={`font-semibold mb-4 text-lg ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Weekly Attendance
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
