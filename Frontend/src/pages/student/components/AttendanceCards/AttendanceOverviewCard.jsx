import React from "react";
import { CheckCircle, XCircle, BookOpen, TrendingUp } from "lucide-react";

export default function AttendanceOverviewCard({ data }) {
  return (
    <div className="space-y-4">
      
      {/* Main Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance Overview</h2>
        <p className="text-gray-500 text-sm">Track your attendance across all subjects</p>
      </div>

      {/* --- 4 Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1. OVERALL ATTENDANCE */}
        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <p className="text-sm opacity-90">Overall Attendance</p>
          <h1 className="text-4xl font-bold mt-2">{data.overall}%</h1>
          <p className="flex items-center gap-2 text-sm mt-3">
            <TrendingUp size={18} /> Above target
          </p>
        </div>

        {/* 2. TOTAL CLASSES */}
        <div className="bg-white border p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Total Classes</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            {data.totalClasses}
          </h1>
        </div>

        {/* 3. CLASSES ATTENDED */}
        <div className="bg-white border p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Classes Attended</p>
          <h1 className="text-4xl font-bold text-green-600 mt-2">
            {data.attended}
          </h1>
        </div>

        {/* 4. CLASSES MISSED */}
        <div className="bg-white border p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Classes Missed</p>
          <h1 className="text-4xl font-bold text-red-600 mt-2">
            {data.missed}
          </h1>
        </div>

      </div>
    </div>
  );
}
