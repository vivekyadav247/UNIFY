
import ReportStats from "../components/ReportCards/ReportStats";
import GenerateReportForm from "../components/ReportCards/GenerateReportForm";
import AttendanceLineChart from "../components/ReportCards/AttendanceLineChart";
import PerformanceBarChart from "../components/ReportCards/PerformanceBarChart";
import SubjectPerformanceChart from "../components/ReportCards/SubjectPerformanceChart";
import PassFailPieChart from "../components/ReportCards/PassFailPieChart";
import RecentReportsCard from "../components/ReportCards/RecentReportsCard";

export default function Reports() {
  return (
    <div className="p-6 space-y-8">
      <ReportStats />

      <GenerateReportForm />

      {/* TOP CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceLineChart />
        <PerformanceBarChart />
      </div>

      {/* SUBJECT + PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceChart />
        <PassFailPieChart />
      </div>

      {/* 🔽 SUBJECT-WISE KE NICHE */}
      <RecentReportsCard />
    </div>
  );
}
