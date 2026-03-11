import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { facultyAPI } from "../../../services/api";
import { FiCheck, FiX, FiClock, FiSave } from "react-icons/fi";

export default function Attendance() {
  const { darkMode, faculty } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFacultyClasses();
  }, []);

  const fetchFacultyClasses = async () => {
    setLoading(true);
    try {
      const response = await facultyAPI.getFacultyClasses();
      if (response.classes && response.classes.length > 0) {
        setClasses(response.classes);

        // Extract unique branches, sections, academic years
        const uniqueBranches = [
          ...new Set(response.classes.map((c) => c.branch)),
        ];
        const uniqueSections = [
          ...new Set(response.classes.map((c) => c.section)),
        ];
        const uniqueYears = [
          ...new Set(response.classes.map((c) => c.academicYear)),
        ];

        setBranches(uniqueBranches);
        setSections(uniqueSections);
        setAcademicYears(uniqueYears);

        // Auto-select first values
        setSelectedBranch(uniqueBranches[0]);
        setSelectedSection(uniqueSections[0]);
        setSelectedAcademicYear(uniqueYears[0]);
      } else {
        setMessage({
          type: "error",
          text: "No classes assigned to you",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to fetch classes",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update available subjects when branch/section/year changes
  useEffect(() => {
    if (selectedBranch && selectedSection && selectedAcademicYear) {
      const filteredSubjects = classes.filter(
        (c) =>
          c.branch === selectedBranch &&
          c.section === selectedSection &&
          c.academicYear === selectedAcademicYear
      );
      setSubjects(filteredSubjects);

      if (filteredSubjects.length > 0) {
        setSelectedSubject(filteredSubjects[0].subjectId);
      }
    }
  }, [selectedBranch, selectedSection, selectedAcademicYear, classes]);

  // Fetch students when subject is selected
  useEffect(() => {
    if (
      selectedSubject &&
      selectedBranch &&
      selectedSection &&
      selectedAcademicYear
    ) {
      fetchStudents();
    }
  }, [selectedSubject]);

  const fetchStudents = async () => {
    if (!selectedSubject || !faculty?.department) return;

    setLoading(true);
    setStudents([]);

    try {
      const params = {
        department: faculty.department,
        branch: selectedBranch,
        academicYear: selectedAcademicYear,
        section: selectedSection,
        subjectId: selectedSubject,
      };

      const response = await facultyAPI.getStudentsForAttendance(params);

      if (response.students) {
        setStudents(
          response.students.map((s) => ({
            ...s,
            status: s.currentStatus || (s.isOnLeave ? "leave" : "present"),
            isAutoLeave: s.isOnLeave, // Mark if leave is auto-applied
          }))
        );
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to fetch students",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === studentId ? { ...s, status } : s))
    );
  };

  const handleMarkAll = (status) => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: s.isAutoLeave ? "leave" : status }))
    );
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !faculty?.department) {
      setMessage({ type: "error", text: "Please select all filters" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const attendanceData = {
        subjectId: selectedSubject,
        department: faculty.department,
        branch: selectedBranch,
        academicYear: selectedAcademicYear,
        section: selectedSection,
        date,
        records: students.map((s) => ({
          studentId: s._id,
          status: s.status,
        })),
      };

      await facultyAPI.takeAttendance(attendanceData);
      setMessage({
        type: "success",
        text: "Attendance submitted successfully!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to submit attendance",
      });
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === "present").length;
    const absent = students.filter((s) => s.status === "absent").length;
    const leave = students.filter((s) => s.status === "leave").length;
    const percentage =
      students.length > 0 ? ((present / students.length) * 100).toFixed(1) : 0;
    return { present, absent, leave, percentage };
  }, [students]);

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Attendance Management</h1>

        {/* Message */}
        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className={`rounded-lg p-4 ${
              darkMode
                ? "bg-green-900/30 border border-green-700"
                : "bg-green-100"
            }`}
          >
            <div className="text-sm opacity-75">Present</div>
            <div className="text-2xl font-bold">{stats.present}</div>
          </div>
          <div
            className={`rounded-lg p-4 ${
              darkMode ? "bg-red-900/30 border border-red-700" : "bg-red-100"
            }`}
          >
            <div className="text-sm opacity-75">Absent</div>
            <div className="text-2xl font-bold">{stats.absent}</div>
          </div>
          <div
            className={`rounded-lg p-4 ${
              darkMode
                ? "bg-yellow-900/30 border border-yellow-700"
                : "bg-yellow-100"
            }`}
          >
            <div className="text-sm opacity-75">On Leave</div>
            <div className="text-2xl font-bold">{stats.leave}</div>
          </div>
          <div
            className={`rounded-lg p-4 ${
              darkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-100"
            }`}
          >
            <div className="text-sm opacity-75">Attendance %</div>
            <div className="text-2xl font-bold">{stats.percentage}%</div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`rounded-xl shadow-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Select Class Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Department - Auto-filled */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <input
                type="text"
                value={faculty?.department || ""}
                disabled
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-400"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                } cursor-not-allowed`}
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Academic Year
              </label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {subjects.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleMarkAll("present")}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <FiCheck /> Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll("absent")}
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <FiX /> Mark All Absent
            </button>
          </div>
        </div>

        {/* Students List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div
            className={`rounded-xl shadow-lg p-8 text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              No students found for selected class
            </p>
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Enrollment No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {students.map((student, index) => (
                    <tr
                      key={student._id}
                      className={
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{student.enrollmentNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student.profilePic ||
                              `https://ui-avatars.com/api/?name=${student.name}&background=2563eb&color=fff`
                            }
                            alt={student.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <span>{student.name}</span>
                            {student.isAutoLeave && (
                              <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                                TG Approved Leave
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(student._id, "present")
                            }
                            disabled={student.isAutoLeave}
                            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                              student.status === "present"
                                ? "bg-green-500 text-white"
                                : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } ${
                              student.isAutoLeave
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FiCheck size={16} /> Present
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student._id, "absent")
                            }
                            disabled={student.isAutoLeave}
                            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                              student.status === "absent"
                                ? "bg-red-500 text-white"
                                : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } ${
                              student.isAutoLeave
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FiX size={16} /> Absent
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student._id, "leave")
                            }
                            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                              student.status === "leave"
                                ? "bg-yellow-500 text-white"
                                : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            <FiClock size={16} /> Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-semibold"
            >
              <FiSave size={20} />
              {saving ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
