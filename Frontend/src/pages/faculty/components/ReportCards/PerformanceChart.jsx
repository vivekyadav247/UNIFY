
import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
LineElement,
PointElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
} from "chart.js";


ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);


export default function PerformanceChart() {
const data = {
labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"],
datasets: [
{
label: "Performance",
data: [7.2, 7.5, 7.8, 8.1, 8.0],
borderColor: "#3b82f6",
backgroundColor: "rgba(59,130,246,0.1)",
tension: 0.4,
fill: true,
},
],
};


return (
<div className="bg-white rounded-xl p-5 shadow">
<h3 className="font-semibold mb-3">Student Performance Trend</h3>
<Line data={data} />
</div>
);
}




// =======