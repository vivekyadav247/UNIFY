import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ReportStats from "../components/ReportCards/ReportStats";
import GenerateReportForm from "../components/ReportCards/GenerateReportForm";
import AttendanceLineChart from "../components/ReportCards/AttendanceLineChart";
import PerformanceBarChart from "../components/ReportCards/PerformanceBarChart";
import SubjectPerformanceChart from "../components/ReportCards/SubjectPerformanceChart";
import PassFailPieChart from "../components/ReportCards/PassFailPieChart";
import RecentReportsCard from "../components/ReportCards/RecentReportsCard";
import { hodAPI } from "../../../services/api";

export default function Reports() {
  const { darkMode } = useOutletContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await hodAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 space-y-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <ReportStats darkMode={darkMode} dashboardData={dashboardData} />

      <GenerateReportForm darkMode={darkMode} />

      {/* TOP CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceLineChart darkMode={darkMode} />
        <PerformanceBarChart darkMode={darkMode} />
      </div>

      {/* SUBJECT + PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceChart darkMode={darkMode} />
        <PassFailPieChart darkMode={darkMode} />
      </div>

      <RecentReportsCard darkMode={darkMode} />
    </div>
  );
}
