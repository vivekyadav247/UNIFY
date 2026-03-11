import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function PerformanceBarChart({
  darkMode,
  performanceData = { labels: [], excellent: [], good: [], average: [] },
}) {
  return (
    <div
      className={`rounded-xl p-6 shadow ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Performance Distribution by Year
      </h3>
      <Bar
        data={{
          labels: performanceData.labels || [],
          datasets: [
            {
              label: "Excellent",
              data: performanceData.excellent || [],
              backgroundColor: darkMode ? "#34D399" : "#10B981",
            },
            {
              label: "Good",
              data: performanceData.good || [],
              backgroundColor: darkMode ? "#60A5FA" : "#3B82F6",
            },
            {
              label: "Average",
              data: performanceData.average || [],
              backgroundColor: darkMode ? "#FBBF24" : "#F59E0B",
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: { color: darkMode ? "#E5E7EB" : "#374151" },
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
  );
}
