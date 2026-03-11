import ReportStatCard from "./ReportStatCard";
import { Users, TrendingUp, Award, FileText } from "lucide-react";

export default function ReportStats({ darkMode, dashboardData }) {
  const totalStudents = dashboardData?.totalStudents || 0;
  const avgAttendance = dashboardData?.averageAttendance || 0;
  const passRate = dashboardData?.passPercentage || 0;
  const reportsGenerated = dashboardData?.totalReports || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ReportStatCard
        title="Total Students"
        value={totalStudents.toString()}
        note="Across all years"
        color="bg-blue-500"
        icon={<Users />}
        darkMode={darkMode}
      />
      <ReportStatCard
        title="Avg Attendance"
        value={`${avgAttendance.toFixed(1)}%`}
        note="Current semester"
        color="bg-green-500"
        icon={<TrendingUp />}
        darkMode={darkMode}
      />
      <ReportStatCard
        title="Pass Rate"
        value={`${passRate}%`}
        note="Last semester"
        color="bg-purple-500"
        icon={<Award />}
        darkMode={darkMode}
      />
      <ReportStatCard
        title="Reports Generated"
        value={reportsGenerated.toString()}
        note="This month"
        color="bg-orange-500"
        icon={<FileText />}
        darkMode={darkMode}
      />
    </div>
  );
}
