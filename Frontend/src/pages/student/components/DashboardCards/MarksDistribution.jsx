import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MarksDistribution({ internal, external, darkMode }) {
  const labels = ["Math", "Physics", "DSA", "DBMS", "OS"];
  const textColor = darkMode ? "#e5e7eb" : "#1f2937";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";

  const data = {
    labels,
    datasets: [
      {
        label: "Internal",
        data: internal,
        backgroundColor: "#3b82f6",
        borderRadius: 4,
      },
      {
        label: "External",
        data: external,
        backgroundColor: "#10b981",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(31, 41, 55, 0.8)" : "rgba(0, 0, 0, 0.8)",
        titleColor: darkMode ? "#f3f4f6" : "#fff",
        bodyColor: darkMode ? "#e5e7eb" : "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
    },
  };

  return (
    <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800/30" : "bg-white"} transition-colors duration-300`}>
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Marks Distribution
      </h3>
      <Bar data={data} options={chartOptions} />
    </div>
  );
}
