// components/dashboard/BarChartCard.jsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function BarChartCard({ title, labels, values }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h3 className="font-semibold mb-4">{title}</h3>

      <Bar
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: "#377DFF"
            }
          ]
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 100 }
          }
        }}
      />
    </div>
  );
}
