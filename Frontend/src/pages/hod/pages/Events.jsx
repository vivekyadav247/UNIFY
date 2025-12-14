
import EventsStats from "../components/EventCards/EventsStats";
import UpcomingEventsGrid from "../components/EventCards/UpcomingEventsGrid";
import PastEventsList from "../components/EventCards/PastEventsList";

export default function Events() {
  // 🔥 UPCOMING EVENTS – ORDER CONTROLS UI
  const upcomingEvents = [
    // ROW 1 – LEFT
    {
      title: "Mid-Sem Examination",
      type: "exam",
      tagColor: "bg-red-100 text-red-600",
      description: "Mid semester examinations for all semesters",
      date: "Monday, February 3, 2025",
      time: "9:00 AM - 1:00 PM",
      location: "All Examination Halls",
      attendees: 480,
    },

    // ROW 1 – RIGHT
    {
      title: "Internal Assessment Test",
      type: "test",
      tagColor: "bg-orange-100 text-orange-600",
      description: "Internal assessment test for core subjects",
      date: "Friday, February 7, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Respective Classrooms",
      attendees: 420,
    },

    // ROW 2 – LEFT
    {
      title: "Faculty Meeting",
      type: "meeting",
      tagColor: "bg-purple-100 text-purple-600",
      description: "Monthly department faculty meeting",
      date: "Wednesday, January 22, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "Conference Room A",
      attendees: 32,
    },

    // ROW 2 – RIGHT
    {
      title: "Parent-Teacher Meeting",
      type: "meeting",
      tagColor: "bg-purple-100 text-purple-600",
      description: "Semester progress discussion with parents",
      date: "Tuesday, January 28, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "CS Department",
      attendees: 200,
    },

    // ROW 3 – LEFT
    {
      title: "Workshop: AI & Machine Learning",
      type: "workshop",
      tagColor: "bg-green-100 text-green-600",
      description: "Hands-on workshop on ML fundamentals",
      date: "Monday, February 10, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Lab 3",
      attendees: 60,
    },
  ];

  // 🔹 PAST EVENTS
  const pastEvents = [
    {
      title: "Alumni Meet 2025",
      date: "January 10, 2025",
      type: "event",
      attended: 150,
    },
    {
      title: "Hackathon 24 Hours",
      date: "December 15, 2024",
      type: "event",
      attended: 80,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* STATS CARDS */}
      <EventsStats />

      {/* UPCOMING EVENTS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <UpcomingEventsGrid events={upcomingEvents} />
      </div>

      {/* PAST EVENTS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Past Events</h2>
        <PastEventsList events={pastEvents} />
      </div>
    </div>
  );
}
