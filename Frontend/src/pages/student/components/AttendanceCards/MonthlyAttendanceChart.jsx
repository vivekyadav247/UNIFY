
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function MonthlyAttendanceChart({ trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Monthly Attendance Trend
      </h2>

      <Line
        data={{
          labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
          datasets: [
            {
              label: "Attendance %",
              data: trend,
              borderColor: "#3B82F6",
              backgroundColor: "#3B82F6",
              borderWidth: 3,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "#3B82F6",
            },

            {
              label: "Required (75%)",
              data: [75, 75, 75, 75, 75, 75],
              borderColor: "#EF4444",
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        }}

        options={{
          plugins: { legend: { position: "bottom" } },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: { stepSize: 25 },
              grid: { color: "#e5e7eb" },
            },
            x: {
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
}
