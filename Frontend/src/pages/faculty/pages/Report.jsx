
import StatCard from "../components/ReportCards/StatCard";
import PerformanceChart from "../components/ReportCards/PerformanceChart";
import AttendanceChart from "../components/ReportCards/AttendanceChart";
import TaskDistribution from "../components/ReportCards/TaskDistribution";
import FeedbackCard from "../components/ReportCards/FeedbackCard";

export default function Report() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Average Attendance" value="87%" />
        <StatCard title="Assignment Submission" value="92%" />
        <StatCard title="Student Engagement" value="High" />
        <StatCard title="Overall Performance" value="A" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerformanceChart />
        <AttendanceChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskDistribution />
        <FeedbackCard />
      </div>
    </div>
  );
}
