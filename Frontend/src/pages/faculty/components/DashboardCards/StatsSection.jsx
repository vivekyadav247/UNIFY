// components/FacultyDashboardCards/StatsSection.jsx
import { Users, FileText, Plane, Bell } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Students Assigned"
        value="156"
        icon={<Users className="text-white" />}
        color="bg-blue-500"
      />

      <StatCard
        title="Pending Assignments"
        value="12"
        icon={<FileText className="text-white" />}
        color="bg-orange-500"
      />

      <StatCard
        title="Pending Leave Approvals"
        value="5"
        icon={<Plane className="text-white" />}
        color="bg-purple-500"
      />

      <StatCard
        title="Notifications"
        value="8"
        icon={<Bell className="text-white" />}
        color="bg-red-500"
      />
    </div>
  );
}
