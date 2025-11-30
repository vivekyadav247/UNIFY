
import React from "react";
import ProfileCard from "../components/DashboardCards/ProfileCard";
import StatCard from "../components/DashboardCards/StatCard";
import AttendanceProgress from "../components/DashboardCards/AttendanceProgress";
import MarksDistribution from "../components/DashboardCards/MarksDistribution";
import AssignmentCardList from "../components/DashboardCards/AssignmentCardList";
import EventCard from "../components/DashboardCards/EventCard";
import FeedbackCard from "../components/DashboardCards/FeedbackCard";

export default function Dashboard() {
  // MOCK data (backend will replace later)
  const stats = {
    attendance: 88,
    avgMarks: 82.2,
    pending: 2,
    events: 3,
  };

  const marksData = {
    internal: [40, 35, 45, 42, 44],
    external: [85, 80, 90, 72, 80],
  };

  const assignments = [
    { title: "Binary Tree Implementation", subject: "Data Structures", due: "Jan 20", status: "pending" },
    { title: "SQL Query Assignment", subject: "DBMS", due: "Jan 22", status: "pending" },
    { title: "Process Scheduling", subject: "OS", due: "Jan 18", status: "submitted" },
  ];

  const events = [
    { title: "Mid-Semester Exam", date: "Jan 25, 2025" },
    { title: "Tech Fest 2025", date: "Feb 5-7, 2025" },
    { title: "Faculty Meeting", date: "Jan 22, 2025" },
  ];

  const feedback = [
    { by: "Prof. Michael Chen", tag: "Academic", text: "Excellent performance in Data Structures. Keep up the good work!", date: "Jan 15, 2025" },
    { by: "Prof. Michael Chen", tag: "Mentorship", text: "Please focus more on time management for productivity.", date: "Jan 10, 2025" },
  ];

  return (
    <div className="space-y-6">

      
      
      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall Attendance" value={stats.attendance + "%"} note="+2% this month" />
        <StatCard title="Average Marks" value={stats.avgMarks + "%"} note="+3.5% improvement" />
        <StatCard title="Pending Assignments" value={stats.pending} />
        <StatCard title="Upcoming Events" value={stats.events} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceProgress percent={stats.attendance} trend={[90, 92, 88, 94, 90, 88]} />
        <MarksDistribution internal={marksData.internal} external={marksData.external} />
      </div>

      {/* ASSIGNMENTS + EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssignmentCardList items={assignments} />
        <EventCard events={events} />
      </div>

      {/* FEEDBACK */}
      <FeedbackCard items={feedback} />

    </div>
  );
}
