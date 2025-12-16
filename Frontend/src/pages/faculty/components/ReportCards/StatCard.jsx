
import { FiFileText, FiCheckCircle, FiUsers, FiTrendingUp } from "react-icons/fi";


const iconMap = {
assignments: <FiFileText />,
leave: <FiCheckCircle />,
students: <FiUsers />,
performance: <FiTrendingUp />,
};


export default function StatCard({ title, value, type, color }) {
return (
<div className="bg-white rounded-2xl p-6 shadow-md flex justify-between items-center">
<div>
<p className="text-gray-500 text-sm">{title}</p>
<h2 className="text-3xl font-bold mt-2">{value}</h2>
</div>
<div className={`w-12 h-12 flex items-center justify-center rounded-xl text-white text-xl ${color}`}>
{iconMap[type]}
</div>
</div>
);
}