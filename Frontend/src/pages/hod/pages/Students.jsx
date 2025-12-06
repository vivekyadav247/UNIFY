
import React from "react";
import AttendanceOverviewCard from "../../student/components/AttendanceCards/AttendanceOverviewCard";
import MonthlyAttendanceChart from "../../student/components/AttendanceCards/MonthlyAttendanceChart";
import AttendanceDistributionChart from "../../student/components/AttendanceCards/AttendanceDistributionChart";
import SubjectWiseAttendanceList from "../../student/components/AttendanceCards/SubjectWiseAttendanceList";
import RecentAttendanceLog from "../../student/components/AttendanceCards/RecentAttendanceLog";

export default function Attendance() {

  // --- MOCK DATA (YE BADME BACKEND SE AA JAYEGA) ---
  const attendanceData = {
    overall: 88,
    totalClasses: 276,
    attended: 243,
    missed: 33,

    trend: [80, 85, 78, 90, 88, 87],  // line graph

    distribution: {
      present: 88,
      absent: 12,
    },

    subjects: [
      { name: "Mathematics", present: 42, absent: 6, total: 48 },
      { name: "Physics", present: 38, absent: 7, total: 45 },
      { name: "DBMS", present: 36, absent: 8, total: 44 },
      { name: "Operating Systems", present: 40, absent: 5, total: 45 },
      { name: "Computer Networks", present: 42, absent: 4, total: 46 },
    ],

    logs: [
      {
        date: "Saturday, January 18, 2025",
        entries: [
          { subject: "Mathematics", status: "Present" },
          { subject: "Data Structures", status: "Present" },
          { subject: "DBMS", status: "Absent" },
        ]
      },
      {
        date: "Friday, January 17, 2025",
        entries: [
          { subject: "Physics", status: "Present" },
          { subject: "Operating Systems", status: "Present" },
          { subject: "Computer Networks", status: "Present" },
        ]
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">

      {/* --- TOP OVERVIEW CARDS --- */}
      <AttendanceOverviewCard data={attendanceData} />

      {/* --- CHARTS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyAttendanceChart trend={attendanceData.trend} />
        <AttendanceDistributionChart distribution={attendanceData.distribution} />
      </div>

      {/* --- SUBJECT WISE DETAILS --- */}
      <SubjectWiseAttendanceList subjects={attendanceData.subjects} />

      {/* --- RECENT LOGS SECTION --- */}
      <RecentAttendanceLog logs={attendanceData.logs} />
    </div>
  );
}
