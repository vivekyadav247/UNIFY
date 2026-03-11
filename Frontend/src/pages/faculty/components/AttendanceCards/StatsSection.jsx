// AttendanceCards/StatsSection.jsx
import StatCard from "./StatCard";

export default function StatsSection({ present, absent, average }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Present" value={present} type="present" />
      <StatCard title="Total Absent" value={absent} type="absent" />
      <StatCard title="Average Attendance" value={`${average}%`} type="average" />
    </div>
  );
}
