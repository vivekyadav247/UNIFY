import { CalendarDays, Clock, MapPin, Users, MoreVertical } from "lucide-react";

export default function EventCard({ event, darkMode }) {
  return (
    <div
      className={`border rounded-2xl p-6 relative transition-colors ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              darkMode ? "bg-blue-900/30" : "bg-blue-100"
            }`}
          >
            <CalendarDays className="text-blue-500" />
          </div>
          <div>
            <h3
              className={`font-semibold text-lg ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {event.title}
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full ${event.tagColor}`}
            >
              {event.type}
            </span>
          </div>
        </div>
        <MoreVertical
          className={`cursor-pointer ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        />
      </div>

      {/* Description */}
      <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        {event.description}
      </p>

      {/* Details */}
      <div
        className={`mt-4 space-y-2 text-sm ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
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

      <hr
        className={`my-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      />

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
        View Details
      </button>
    </div>
  );
}
