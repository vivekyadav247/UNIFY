import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import EventsStats from "../components/EventCards/EventsStats";
import UpcomingEventsGrid from "../components/EventCards/UpcomingEventsGrid";
import PastEventsList from "../components/EventCards/PastEventsList";
import { hodAPI } from "../../../services/api";

export default function Events() {
  const { darkMode } = useOutletContext();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [eventStats, setEventStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await hodAPI.getAnnouncements({
        limit: 20,
        sortBy: "createdAt",
        order: "desc",
      });

      if (response.success) {
        const now = new Date();
        const announcements = response.announcements || [];

        // Calculate stats
        const upcoming = announcements.filter(
          (ann) => new Date(ann.createdAt) >= now
        );
        const thisMonth = announcements.filter((ann) => {
          const date = new Date(ann.createdAt);
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        });

        setEventStats({
          upcoming: upcoming.length,
          thisMonth: thisMonth.length,
          totalAttendees: announcements.length * 50,
          yearTotal: announcements.length,
        });

        // Separate into upcoming and past events
        const upcomingList = upcoming.slice(0, 5).map((ann) => ({
          title: ann.title,
          type: ann.targetRole || "announcement",
          tagColor: getTagColor(ann.targetRole, darkMode),
          description: ann.content,
          date: new Date(ann.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: new Date(ann.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: ann.department || "Department",
          attendees: Math.floor(Math.random() * 300) + 100,
        }));

        const past = announcements
          .filter((ann) => new Date(ann.createdAt) < now)
          .slice(0, 10)
          .map((ann) => ({
            title: ann.title,
            date: new Date(ann.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            type: ann.targetRole || "event",
            attended: Math.floor(Math.random() * 200) + 50,
          }));

        setUpcomingEvents(upcomingList);
        setPastEvents(past);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const getTagColor = (role, isDark) => {
    switch (role) {
      case "faculty":
        return isDark
          ? "bg-purple-900/40 text-purple-300"
          : "bg-purple-100 text-purple-600";
      case "student":
        return isDark
          ? "bg-blue-900/40 text-blue-300"
          : "bg-blue-100 text-blue-600";
      case "tg":
        return isDark
          ? "bg-green-900/40 text-green-300"
          : "bg-green-100 text-green-600";
      default:
        return isDark
          ? "bg-orange-900/40 text-orange-300"
          : "bg-orange-100 text-orange-600";
    }
  };

  return (
    <div
      className={`p-6 space-y-8 min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* STATS CARDS */}
      <EventsStats darkMode={darkMode} stats={eventStats} />

      {/* UPCOMING EVENTS */}
      <div>
        <h2
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Upcoming Events
        </h2>
        <UpcomingEventsGrid events={upcomingEvents} darkMode={darkMode} />
      </div>

      {/* PAST EVENTS */}
      <div>
        <h2
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Past Events
        </h2>
        <PastEventsList events={pastEvents} darkMode={darkMode} />
      </div>
    </div>
  );
}
