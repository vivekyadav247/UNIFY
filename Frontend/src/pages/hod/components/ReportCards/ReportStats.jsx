
import ReportStatCard from "./ReportStatCard";
import { Users, TrendingUp, Award, FileText } from "lucide-react";

export default function ReportStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ReportStatCard title="Total Students" value="485" note="Across all years" color="bg-blue-500" icon={<Users />} />
      <ReportStatCard title="Avg Attendance" value="84%" note="+3% from last month" color="bg-green-500" icon={<TrendingUp />} />
      <ReportStatCard title="Pass Rate" value="92%" note="Last semester" color="bg-purple-500" icon={<Award />} />
      <ReportStatCard title="Reports Generated" value="24" note="This month" color="bg-orange-500" icon={<FileText />} />
    </div>
  );
}
