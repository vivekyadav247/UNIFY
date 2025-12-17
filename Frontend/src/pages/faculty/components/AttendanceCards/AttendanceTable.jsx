// AttendanceCards/AttendanceTable.jsx
export default function AttendanceTable({ students, setStudents }) {
  const mark = (id, type) => {
    setStudents(students.map(s =>
      s.id === id
        ? { ...s, present: type==="present", absent: type==="absent", leave: type==="leave" }
        : s
    ));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="font-semibold mb-4">Mark Attendance</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Student ID</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Leave</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-b">
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td><input type="checkbox" checked={s.present} onChange={()=>mark(s.id,"present")} /></td>
              <td><input type="checkbox" checked={s.absent} onChange={()=>mark(s.id,"absent")} /></td>
              <td><input type="checkbox" checked={s.leave} onChange={()=>mark(s.id,"leave")} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
