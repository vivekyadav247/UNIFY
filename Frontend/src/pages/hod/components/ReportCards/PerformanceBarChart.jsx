import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function PerformanceBarChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Performance Distribution by Year</h3>
      <Bar
        data={{
          labels: ["1st", "2nd", "3rd", "4th"],
          datasets: [
            { label: "Excellent", data: [40, 50, 60, 70] },
            { label: "Good", data: [60, 55, 45, 35] },
            { label: "Average", data: [30, 25, 20, 15] },
          ],
        }}
      />
    </div>
  );
}
