
import { Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
} from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);


export default function TaskDistribution() {
const data = {
labels: ["Assignments Graded", "Pending", "Leave Approved", "Leave Pending"],
datasets: [
{
data: [38, 12, 18, 5],
backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"],
},
],
};


return (
<div className="bg-white rounded-xl p-5 shadow">
<h3 className="font-semibold mb-3">Task Distribution</h3>
<Pie data={data} />
</div>
);
}