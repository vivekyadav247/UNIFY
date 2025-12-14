
import EventCard from "./EventCard";

export default function UpcomingEventsGrid({ events }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
}
