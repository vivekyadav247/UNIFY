
import React from "react";
import { CalendarDays, Star } from "lucide-react";

export default function FeedbackCard({
  initials,
  name,
  role,
  date,
  course,
  rating,
  tag,
  message
}) {
  const tagColors = {
    academic: "bg-blue-100 text-blue-600",
    mentorship: "bg-purple-100 text-purple-600",
    behavioral: "bg-green-100 text-green-600"
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-4">
      {/* Top Section */}
      <div className="flex items-start gap-4">
        {/* Profile Circle */}
        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-500 text-sm">{role}</p>

          <div className="flex items-center text-sm text-gray-500 mt-1">
            <CalendarDays size={16} className="mr-1" />
            {date}
            {course && (
              <>
                <span className="mx-2">•</span> {course}
              </>
            )}
          </div>
        </div>

        {/* Tag */}
        {tag && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${tagColors[tag]}`}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Rating */}
      {rating && (
        <div className="flex gap-1 mt-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      )}

      {/* Message */}
      <p className="mt-3 text-gray-700 leading-relaxed">{message}</p>
    </div>
  );
}
