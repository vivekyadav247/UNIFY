// AttendanceCards/QuickActions.jsx
export default function QuickActions({ setStudents }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="font-semibold mb-4">Quick Actions</h2>

      <div className="flex gap-4">
        <button
          className="border px-4 py-2 rounded-lg"
          onClick={() =>
            setStudents(prev => prev.map(s => ({ ...s, present:true, absent:false, leave:false })))
          }
        >
          Mark All Present
        </button>

        <button
          className="border px-4 py-2 rounded-lg"
          onClick={() =>
            setStudents(prev => prev.map(s => ({ ...s, present:false, absent:true, leave:false })))
          }
        >
          Mark All Absent
        </button>

        <button
          className="border px-4 py-2 rounded-lg"
          onClick={() =>
            setStudents(prev => prev.map(s => ({ ...s, present:false, absent:false, leave:false })))
          }
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
