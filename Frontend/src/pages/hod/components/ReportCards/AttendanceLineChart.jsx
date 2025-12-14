import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function AttendanceLineChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Attendance Trend (6 Months)</h3>
      <Line
        data={{
          labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
          datasets: [
            {
              label: "Attendance %",
              data: [78, 82, 76, 85, 88, 84],
              borderWidth: 2,
            },
          ],
        }}
      />
    </div>
  );
}
