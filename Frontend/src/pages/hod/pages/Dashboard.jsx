
// pages/hod/HODDashboard.jsx

import StatsCard from "../components/Dashboard/StatsCard";
import LineChartCard from "../components/Dashboard/LineChartCard";
import BarChartCard from "../components/Dashboard/BarChartCard";
import TeacherCard from "../components/Dashboard/TeacherCard";
import ApprovalCard from "../components/Dashboard/ApprovalCard";

import { Users, UserCheck, TrendingUp, AlertCircle } from "lucide-react";

export default function HODDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="text-gray-600 mb-6">Welcome back, Dr. Sarah Johnson</p>

      {/* TOP STATS */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="485"
          icon={<Users />}
          change="+12 this month"
          isPositive={true}
        />
        <StatsCard
          title="Faculty Members"
          value="32"
          icon={<UserCheck />}
          change="+2 this month"
          isPositive={true}
        />
        <StatsCard
          title="Avg Attendance"
          value="84%"
          icon={<TrendingUp />}
          change="+3% from last month"
          isPositive={true}
        />
        <StatsCard
          title="Pending Tasks"
          value="8"
          icon={<AlertCircle />}
          change="3 urgent"
          isPositive={false}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <LineChartCard
          title="Department Attendance Trend"
          labels={["Aug","Sep","Oct","Nov","Dec","Jan"]}
          dataSet={[78, 82, 76, 85, 88, 83]}
        />
        <BarChartCard
          title="Average Performance by Year"
          labels={["1st","2nd","3rd","4th"]}
          values={[74, 81, 85, 90]}
        />
      </div>

      {/* TEACHERS + APPROVALS */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <TeacherCard name="Prof. Michael Chen" students={25} reports={18} attendance={92} />
          <TeacherCard name="Dr. Sarah Miller" students={28} reports={22} attendance={88} />
          <TeacherCard name="Prof. James Wilson" students={23} reports={20} attendance={95} />
        </div>

        <div>
          <ApprovalCard title="Leave Request" by="Prof. Michael Chen" date="Jan 15–17" />
          <ApprovalCard title="Report Submission" by="Dr. Sarah Miller" date="Jan 10" />
          <ApprovalCard title="Budget Request" by="Prof. James Wilson" date="Jan 12" />
        </div>
      </div>
    </div>
  );
}
