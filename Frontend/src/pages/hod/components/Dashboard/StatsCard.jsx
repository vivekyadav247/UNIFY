// components/dashboard/StatsCard.jsx
import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon,
  change,
  isPositive
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-xl text-white text-lg"
             style={{ backgroundColor: "#377DFF" }}>
          {icon}
        </div>
        <h3 className="text-gray-700 font-semibold">{title}</h3>
      </div>

      <p className="text-3xl font-bold">{value}</p>

      <p className={`mt-2 text-sm font-medium flex items-center gap-1
        ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        {change}
      </p>
    </div>
  );
}
