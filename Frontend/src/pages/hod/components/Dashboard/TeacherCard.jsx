// components/dashboard/TeacherCard.jsx

export default function TeacherCard({
  name,
  students,
  reports,
  attendance
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <div className="flex justify-between">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          Active
        </span>
      </div>

      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <p><strong>Students:</strong> {students}</p>
        <p><strong>Reports:</strong> {reports}</p>
        <p><strong>Attendance:</strong> {attendance}%</p>
      </div>
    </div>
  );
}
