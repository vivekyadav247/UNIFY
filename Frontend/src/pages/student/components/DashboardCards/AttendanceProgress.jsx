import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

export default function AttendanceProgress({ percent, trend, darkMode }) {
  const textColor = darkMode ? "#e5e7eb" : "#1f2937";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";

  const donut = {
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: ["#1e90ff", darkMode ? "#1e3a8a" : "#e0f0ff"],
        cutout: "75%",
      },
    ],
  };

  const line = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        data: trend,
        borderColor: "#1e90ff",
        backgroundColor: "rgba(30, 144, 255, 0.1)",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#1e90ff",
        pointBorderColor: darkMode ? "#1f2937" : "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: false,
      tooltip: {
        backgroundColor: darkMode ? "rgba(31, 41, 55, 0.8)" : "rgba(0, 0, 0, 0.8)",
        titleColor: darkMode ? "#f3f4f6" : "#fff",
        bodyColor: darkMode ? "#e5e7eb" : "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
      <h3 className={`text-lg font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Attendance Trend
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DOUGHNUT CHART */}
        <div className="flex justify-center lg:col-span-1">
          <div className="relative w-48 h-48">
            <Doughnut data={donut} options={{ plugins: { legend: false } }} />
            <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {percent}%
            </div>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="lg:col-span-2 h-64 overflow-hidden">
          <Line data={line} options={chartOptions} />
        </div>

      </div>
    </div>
  );
}
