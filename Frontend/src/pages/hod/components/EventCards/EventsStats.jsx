import StatCard from "./StatCard";

export default function EventsStats({ darkMode, stats }) {
  const upcomingCount = stats?.upcoming || 0;
  const thisMonthCount = stats?.thisMonth || 0;
  const totalAttendees = stats?.totalAttendees || 0;
  const yearTotal = stats?.yearTotal || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Upcoming Events"
        value={upcomingCount.toString()}
        darkMode={darkMode}
      />
      <StatCard
        title="This Month"
        value={thisMonthCount.toString()}
        darkMode={darkMode}
      />
      <StatCard
        title="Total Attendees"
        value={totalAttendees.toLocaleString()}
        darkMode={darkMode}
      />
      <StatCard
        title="Events This Year"
        value={yearTotal.toString()}
        darkMode={darkMode}
      />
    </div>
  );
}
