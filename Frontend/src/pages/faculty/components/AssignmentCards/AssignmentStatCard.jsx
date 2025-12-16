import { Clock, CheckCircle, FileText } from "lucide-react";

const iconMap = {
  pending: { icon: Clock, color: "bg-orange-500" },
  submitted: { icon: CheckCircle, color: "bg-blue-500" },
  graded: { icon: FileText, color: "bg-green-500" }
};

export default function AssignmentStatCard({ title, value, type }) {
  const Icon = iconMap[type].icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconMap[type].color}`}
      >
        <Icon className="text-white" />
      </div>
    </div>
  );
}
