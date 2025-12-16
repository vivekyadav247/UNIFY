// AttendanceCards/StatCard.jsx
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function StatCard({ title, value, type }) {
  const config = {
    present: { icon: <CheckCircle className="text-white" />, color: "bg-green-500" },
    absent: { icon: <XCircle className="text-white" />, color: "bg-red-500" },
    average: { icon: <TrendingUp className="text-white" />, color: "bg-blue-500" }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config[type].color}`}>
        {config[type].icon}
      </div>
    </div>
  );
}
