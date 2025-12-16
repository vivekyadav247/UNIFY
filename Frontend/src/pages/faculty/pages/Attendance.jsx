
// pages/faculty/pages/Attendance.jsx
import { useState, useMemo } from "react";
import StatsSection from "../components/AttendanceCards/StatsSection";
import { FilterCard } from "../components/AttendanceCards/FilterCard";
import AttendanceTable from "../components/AttendanceCards/AttendanceTable";
import QuickActions from "../components/AttendanceCards/QuickActions";

export default function Attendance() {
  const [date, setDate] = useState("");
  const [section, setSection] = useState("CS-3A");

  const [students, setStudents] = useState([
    { id:"CS001", name:"Alice Johnson", present:true, absent:false, leave:false },
    { id:"CS002", name:"Bob Smith", present:true, absent:false, leave:false },
    { id:"CS003", name:"Carol Williams", present:true, absent:false, leave:false },
    { id:"CS004", name:"David Brown", present:false, absent:true, leave:false }
  ]);

  const present = useMemo(()=>students.filter(s=>s.present).length,[students]);
  const absent = useMemo(()=>students.filter(s=>s.absent).length,[students]);
  const average = Math.round((present / students.length) * 100);

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">Attendance Management</h1>

      <StatsSection present={present} absent={absent} average={average} />
      <FilterCard date={date} setDate={setDate} section={section} setSection={setSection} />
      <AttendanceTable students={students} setStudents={setStudents} />
      <QuickActions setStudents={setStudents} />
    </div>
  );
}
