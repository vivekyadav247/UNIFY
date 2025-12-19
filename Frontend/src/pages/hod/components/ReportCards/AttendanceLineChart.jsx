import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function AttendanceLineChart({ darkMode, attendanceData = [] }) {
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
        Attendance Trend (6 Months)
      </h3>
      <Line
        data={{
          labels: attendanceData.map((item) => item.month || item.label) || [],
          datasets: [
            {
              label: "Attendance %",
              data:
                attendanceData.map((item) => item.percentage || item.value) ||
                [],
              borderColor: darkMode ? "#60A5FA" : "#3B82F6",
              backgroundColor: darkMode
                ? "rgba(96, 165, 250, 0.1)"
                : "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                color: darkMode ? "#E5E7EB" : "#374151",
              },
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
