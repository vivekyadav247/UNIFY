
// src/pages/student/components/Cards/Chart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Chart({ data: customData }) {
  const data = customData || {
    labels: ["Week1", "Week2", "Week3", "Week4"],
    datasets: [
      { label: "Attendance %", data: [92, 90, 88, 94], borderColor: "#3b82f6", tension: 0.4 }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
      <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
      <div className="h-64">
        <Line data={data} />
      </div>
    </div>
  );
}
