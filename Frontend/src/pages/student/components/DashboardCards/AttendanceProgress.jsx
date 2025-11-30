
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

export default function AttendanceProgress({ percent, trend }) {
  const donut = {
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: ["#1e90ff", "#e0f0ff"],
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
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Attendance Progress</h3>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        
        <div className="relative w-40 h-40">
          <Doughnut data={donut} options={{ plugins: { legend: false } }} />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {percent}%
          </div>
        </div>

        <div className="flex-1">
          <Line
            data={line}
            options={{
              plugins: { legend: false },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>

      </div>
    </div>
  );
}
