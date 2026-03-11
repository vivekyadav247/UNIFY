
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceDistributionChart({ distribution }) {
  const { present, absent } = distribution;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Attendance Distribution
      </h2>

      <div className="flex items-center gap-6">

        {/* Donut Chart */}
        <div className="w-48 h-48">
          <Doughnut
            data={{
              labels: ["Present", "Absent"],
              datasets: [
                {
                  data: [present, absent],
                  backgroundColor: ["#22C55E", "#EF4444"],
                  hoverOffset: 6,
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              cutout: "70%",
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        {/* Side Labels */}
        <div className="space-y-3">
          <p className="text-green-600 font-medium">Present: {present}%</p>
          <p className="text-red-500 font-medium">Absent: {absent}%</p>
        </div>

      </div>

    </div>
  );
}
