import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function SubjectPerformanceChart({
  darkMode,
  subjectData = [],
}) {
  return (
    <div
      className={`rounded-xl p-4 shadow h-[300px] ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Title */}
      <h3
        className={`font-semibold text-sm mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Subject-wise Average Performance
      </h3>

      {/* Chart Wrapper */}
      <div className="h-[240px]">
        <Bar
          data={{
            labels: subjectData.map((item) => item.subject || item.label) || [],
            datasets: [
              {
                label: "Average Score",
                data: subjectData.map((item) => item.score || item.value) || [],
                backgroundColor: darkMode ? "#60A5FA" : "#3B82F6",
              },
            ],
          }}
          options={{
            indexAxis: "y",
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                ticks: { color: darkMode ? "#9CA3AF" : "#6B7280" },
                grid: { color: darkMode ? "#374151" : "#E5E7EB" },
              },
              y: {
                ticks: { color: darkMode ? "#9CA3AF" : "#6B7280" },
                grid: { color: darkMode ? "#374151" : "#E5E7EB" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
