import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, FileText, Plane, BookOpen } from "lucide-react";
import StatCard from "./StatCard";
import { facultyAPI } from "../../../../services/api";

export default function StatsSection() {
  const { darkMode } = useOutletContext();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingAssignments: 0,
    pendingLeaves: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await facultyAPI.getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-32 animate-pulse rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon={<Users className="text-white" />}
        color="bg-blue-500"
        darkMode={darkMode}
      />

      <StatCard
        title="Active Assignments"
        value={stats.pendingAssignments}
        icon={<FileText className="text-white" />}
        color="bg-orange-500"
        darkMode={darkMode}
      />

      <StatCard
        title="Pending Leave Requests"
        value={stats.pendingLeaves}
        icon={<Plane className="text-white" />}
        color="bg-purple-500"
        darkMode={darkMode}
      />

      <StatCard
        title="Total Classes"
        value={stats.totalClasses}
        icon={<BookOpen className="text-white" />}
        color="bg-green-500"
        darkMode={darkMode}
      />
    </div>
  );
}
