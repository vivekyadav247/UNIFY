import EventCard from "./EventCard";

export default function UpcomingEventsGrid({ events, darkMode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.length === 0 ? (
        <div
          className={`col-span-2 text-center py-8 rounded-xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-400"
              : "bg-white border-gray-200 text-gray-500"
          }`}
        >
          No upcoming events found
        </div>
      ) : (
        events.map((event, index) => (
          <EventCard key={index} event={event} darkMode={darkMode} />
        ))
      )}
    </div>
  );
}
