import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * props:
 *  labels: ["Mathematics","Physics",...]
 *  values: [..] (percent)
 */
export default function RadarChart({
  labels = ["Mathematics","Physics","Data","DBMS","Operating","Computer"],
  values = [78, 70, 88, 82, 85, 90],
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Performance",
        data: values,
        backgroundColor: "rgba(59,130,246,0.25)",
        borderColor: "#3B82F6",
        pointBackgroundColor: "#3B82F6",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { stepSize: 25 }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Performance Radar</h3>
      <Radar data={data} options={options} />
    </div>
  );
}
