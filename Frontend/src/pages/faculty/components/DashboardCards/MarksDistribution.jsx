
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function MarksDistribution({ internal, external }) {
  const labels = ["Math", "Physics", "DSA", "DBMS", "OS"];

  const data = {
    labels,
    datasets: [
      { label: "Internal", data: internal, backgroundColor: "#3b82f6" },
      { label: "External", data: external, backgroundColor: "#10b981" },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Marks Distribution</h3>
      <Bar data={data} />
    </div>
  );
}
