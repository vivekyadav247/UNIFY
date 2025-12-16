export default function AssignmentFilterCard({
  section,
  setSection,
  status,
  setStatus
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow grid grid-cols-1 md:grid-cols-2 gap-4">
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="border rounded-lg p-3"
      >
        <option>All Sections</option>
        <option>CS-3A</option>
        <option>CS-3B</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-lg p-3"
      >
        <option>All Status</option>
        <option>Submitted</option>
        <option>Pending</option>
        <option>Graded</option>
      </select>
    </div>
  );
}
