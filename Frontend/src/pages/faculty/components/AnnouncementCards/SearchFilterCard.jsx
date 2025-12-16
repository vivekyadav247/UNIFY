// src/pages/faculty/components/Announcements/SearchFilterCard.jsx

export default function SearchFilterCard({ search, setSearch, priority, setPriority }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-6 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search announcements..."
        className="w-full md:w-1/2 px-4 py-3 bg-gray-100 rounded-xl outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="w-full md:w-1/2 px-4 py-3 bg-gray-100 rounded-xl outline-none"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="all">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>
    </div>
  );
}
