
import WeeklyTimetable from "../components/ScheduleCards/WeeklyTimetableCard";
import UpcomingEvents from "../components/ScheduleCards/UpcomingEventsCard";
import CounselingSessions from "../components/ScheduleCards/CounselingSessionsCard";
import ExtraClasses from "../components/ScheduleCards/ExtraClassesCard";

export default function Schedule() {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold">Schedule & Timetable</h1>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyTimetable />
        </div>
        <UpcomingEvents />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CounselingSessions />
        <ExtraClasses />
      </div>
    </div>
  );
}
