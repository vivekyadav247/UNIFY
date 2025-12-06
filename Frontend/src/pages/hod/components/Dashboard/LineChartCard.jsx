// components/dashboard/LineChartCard.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function LineChartCard({ title, labels, dataSet }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h3 className="font-semibold mb-4">{title}</h3>

      <Line
        data={{
          labels,
          datasets: [
            {
              data: dataSet,
              borderWidth: 3,
              tension: 0.4
            }
          ]
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 100 },
            x: { grid: { display: false } }
          }
        }}
      />
    </div>
  );
}
