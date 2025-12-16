
import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
BarElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
} from "chart.js";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


export default function AttendanceChart() {
const data = {
labels: ["Bob", "David", "Frank", "Henry"],
datasets: [
{
label: "Attendance %",
data: [95, 78, 88, 92],
backgroundColor: "#10b981",
borderRadius: 8,
},
],
};


return (
<div className="bg-white rounded-xl p-5 shadow">
<h3 className="font-semibold mb-3">Student Attendance Analysis</h3>
<Bar data={data} />
</div>
);
}