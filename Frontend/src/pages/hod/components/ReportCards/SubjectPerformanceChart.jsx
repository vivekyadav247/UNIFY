
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function SubjectPerformanceChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow h-[300px]">
      {/* Title */}
      <h3 className="font-semibold text-sm mb-2">
        Subject-wise Average Performance
      </h3>

      {/* Chart Wrapper */}
      <div className="h-[240px]">
        <Bar
          data={{
            labels: ["Math", "Physics", "DS", "DBMS", "OS", "CN"],
            datasets: [
              {
                label: "Average Score",
                data: [75, 80, 85, 78, 82, 88],
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
          }}
        />
      </div>
    </div>
  );
}
