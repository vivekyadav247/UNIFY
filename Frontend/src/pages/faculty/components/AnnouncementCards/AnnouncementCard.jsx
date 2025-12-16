// src/pages/faculty/components/Announcements/AnnouncementCard.jsx

const priorityStyles = {
  high: "border-l-4 border-red-500 bg-red-50 text-red-600",
  medium: "border-l-4 border-orange-500 bg-orange-50 text-orange-600",
  low: "border-l-4 border-blue-500 bg-blue-50 text-blue-600"
};

export default function AnnouncementCard({ data }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow mb-6 ${priorityStyles[data.priority]}`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {data.title}
        </h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium">
          {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)} Priority
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        👤 {data.author} &nbsp; | &nbsp; 📅 Valid: {data.validFrom} to {data.validTo}
      </p>

      <p className="text-gray-700 mb-4">
        {data.description}
      </p>

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
          View Details
        </button>
        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
          Edit
        </button>
        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
          Delete
        </button>
      </div>
    </div>
  );
}
