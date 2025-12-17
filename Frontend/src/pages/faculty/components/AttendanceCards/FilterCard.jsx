// AttendanceCards/FilterCard.jsx
import { Download } from "lucide-react";

export function FilterCard({ date, setDate, section, setSection }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow flex flex-col md:flex-row gap-6 items-center justify-between">
      <div>
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block mt-1 px-4 py-2 rounded-lg bg-gray-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Section</label>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="block mt-1 px-4 py-2 rounded-lg bg-gray-100"
        >
          <option>CS-3A</option>
          <option>CS-3B</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button className="border px-4 py-2 rounded-lg flex gap-2 items-center">
          <Download size={18} /> Export PDF
        </button>
        <button className="border px-4 py-2 rounded-lg flex gap-2 items-center">
          <Download size={18} /> Export Excel
        </button>
      </div>
    </div>
  );
}
