
import { CalendarDays, Clock, MapPin, Users, MoreVertical } from "lucide-react";

export default function EventCard({ event }) {
  return (
    <div className="bg-white border rounded-2xl p-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <CalendarDays className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <span
              className={`text-xs px-3 py-1 rounded-full ${event.tagColor}`}
            >
              {event.type}
            </span>
          </div>
        </div>
        <MoreVertical className="text-gray-400 cursor-pointer" />
      </div>

      {/* Description */}
      <p className="text-gray-600 mt-4">{event.description}</p>

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} /> {event.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} /> {event.time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} /> {event.location}
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} /> {event.attendees} expected attendees
        </div>
      </div>

      <hr className="my-4" />

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
        View Details
      </button>
    </div>
  );
}
