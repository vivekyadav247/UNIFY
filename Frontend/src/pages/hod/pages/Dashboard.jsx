
import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

import StatCard from "../components/DashboardCards/StatsCard";
import GraphCard from "../components/DashboardCards/GraphCard";
import TGActivityCard from "../components/DashboardCards/TGActivityCard";
import ApprovalCard from "../components/DashboardCards/ApprovalCard";
import AnnouncementCard from "../components/DashboardCards/AnnouncementCard";
import QuickActionsCard from "../components/DashboardCards/QuickActionCard";

import AttendanceChart from "../components/DashboardCards/AttendanceChart";
import PerformanceChart from "../components/DashboardCards/PerformanceChart";

export default function HodDashboard() {
  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Dr. Sarah Johnson</p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Students"
          value="485"
          change="+12 this month"
          changeColor="text-green-600"
          icon={<FiUsers size={26} />}
          iconBg="bg-blue-600"
        />

        <StatCard
          title="Faculty Members"
          value="32"
          change="+2 this month"
          changeColor="text-green-600"
          icon={<FiUserCheck size={26} />}
          iconBg="bg-green-600"
        />

        <StatCard
          title="Avg Attendance"
          value="84%"
          change="+3% from last month"
          changeColor="text-green-600"
          icon={<FiTrendingUp size={26} />}
          iconBg="bg-purple-600"
        />

        <StatCard
          title="Pending Tasks"
          value="8"
          change="3 urgent"
          changeColor="text-red-600"
          icon={<FiAlertCircle size={26} />}
          iconBg="bg-red-600"
        />
      </div>

      {/* GRAPH SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Attendance Chart */}
        <GraphCard title="Department Attendance Trend">
          <AttendanceChart />
        </GraphCard>

        {/* Performance Chart */}
        <GraphCard title="Average Performance by Year">
          <PerformanceChart />
        </GraphCard>

      </div>

      {/* TG ACTIVITY + APPROVALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TG ACTIVITY */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Teacher Guardian Activity</h3>

          <TGActivityCard name="Prof. Michael Chen" students="25" reports="18" attendance="92%" />
          <TGActivityCard name="Dr. Sarah Miller" students="28" reports="22" attendance="88%" />
          <TGActivityCard name="Prof. James Wilson" students="23" reports="20" attendance="95%" />
        </div>

        {/* APPROVALS */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>

          <ApprovalCard title="Leave Request" name="Prof. Michael Chen" date="Jan 15-17" />
          <ApprovalCard title="Report Submission" name="Dr. Sarah Miller" date="Jan 10" />
          <ApprovalCard title="Budget Request" name="Prof. James Wilson" date="Jan 12" />
        </div>

      </div>

      {/* ANNOUNCEMENTS + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Announcements */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Department Announcements</h3>

          <AnnouncementCard
            color="bg-blue-50"
            heading="Faculty Meeting - Jan 20, 2025"
            text="All faculty members are requested to attend the monthly review meeting at 3 PM."
          />

          <AnnouncementCard
            color="bg-green-50"
            heading="Exam Schedule Released"
            text="End semester examination schedule has been published on the portal."
          />
        </div>

        {/* Quick Actions */}
        <QuickActionsCard />

        <div></div>
      </div>

    </div>
  );
}
