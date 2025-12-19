import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function PassFailPieChart({
  darkMode,
  passFailData = { pass: 0, fail: 0 },
}) {
  return (
    <div
      className={`rounded-xl p-4 shadow h-[300px] flex flex-col items-center ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Title */}
      <h3
        className={`font-semibold text-sm mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Department Pass/Fail Rate
      </h3>

      {/* Chart Wrapper */}
      <div className="h-[230px] w-full flex items-center justify-center">
        <Pie
          data={{
            labels: ["Pass", "Fail"],
            datasets: [
              {
                data: [passFailData.pass || 0, passFailData.fail || 0],
                backgroundColor: [
                  darkMode ? "#34D399" : "#10B981",
                  darkMode ? "#F87171" : "#EF4444",
                ],
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 10,
                  color: darkMode ? "#E5E7EB" : "#374151",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
