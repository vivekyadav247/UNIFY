import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { tgAPI } from "../../../services/api";
import { showError, showSuccess } from "../../../utils/notifications";
import {
  FiLoader,
  FiAlertCircle,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiEdit2,
  FiX,
  FiSave,
} from "react-icons/fi";

export default function Marks() {
  const { darkMode } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sgpaInputs, setSgpaInputs] = useState([]);
  const [cgpaInput, setCgpaInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tgAPI.getMarks();
      setStudents(data.students || []);
      setStatistics(data.statistics || {});
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch marks";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);

    // Initialize SGPA inputs for 8 semesters
    const currentSem = student.semesterNumber || 1;
    const sgpas = [];
    for (let i = 1; i <= 8; i++) {
      sgpas.push({
        semester: i,
        value: student.sgpa?.[i - 1]?.toString() || "",
        disabled: i > currentSem, // Disable future semesters
      });
    }
    setSgpaInputs(sgpas);
    setCgpaInput(student.cgpa?.toString() || "");
    setShowModal(true);
  };

  const handleSgpaChange = (index, value) => {
    // Allow empty, or valid number between 0-10
    if (
      value === "" ||
      (!isNaN(parseFloat(value)) &&
        parseFloat(value) >= 0 &&
        parseFloat(value) <= 10)
    ) {
      const updated = [...sgpaInputs];
      updated[index].value = value;
      setSgpaInputs(updated);

      // Auto-calculate CGPA
      const validSgpas = updated
        .filter((s) => s.value !== "" && !isNaN(parseFloat(s.value)))
        .map((s) => parseFloat(s.value));

      if (validSgpas.length > 0) {
        const avgCgpa =
          validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length;
        setCgpaInput(avgCgpa.toFixed(2));
      }
    }
  };

  const handleSaveMarks = async () => {
    if (!selectedStudent) return;

    try {
      setSaving(true);

      // Save each SGPA that has a value
      for (const sgpa of sgpaInputs) {
        if (sgpa.value !== "" && !sgpa.disabled) {
          await tgAPI.updateStudentSGPA(selectedStudent._id, {
            semester: sgpa.semester,
            sgpa: parseFloat(sgpa.value),
          });
        }
      }

      // Save CGPA if manually changed
      if (cgpaInput !== "") {
        await tgAPI.updateStudentCGPA(selectedStudent._id, {
          cgpa: parseFloat(cgpaInput),
        });
      }

      showSuccess("Marks saved successfully!");
      setShowModal(false);
      fetchMarks(); // Refresh data
    } catch (err) {
      showError(err.response?.data?.error || "Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      !filter ||
      s.name?.toLowerCase().includes(filter.toLowerCase()) ||
      s.enrollmentNumber?.toLowerCase().includes(filter.toLowerCase())
  );

  const getCGPAColor = (cgpa, isDark) => {
    if (cgpa >= 8.5)
      return isDark
        ? "bg-green-900/50 text-green-300"
        : "bg-green-100 text-green-800";
    if (cgpa >= 7.0)
      return isDark
        ? "bg-blue-900/50 text-blue-300"
        : "bg-blue-100 text-blue-800";
    if (cgpa >= 5.0)
      return isDark
        ? "bg-yellow-900/50 text-yellow-300"
        : "bg-yellow-100 text-yellow-800";
    return isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FiBarChart2 /> Marks & CGPA Management
          </h1>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            View and update student marks, SGPA, and CGPA
          </p>
        </div>
      </div>

      {error && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            darkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-100 border border-red-400"
          }`}
        >
          <FiAlertCircle className="text-red-500" />
          <span className={darkMode ? "text-red-300" : "text-red-700"}>
            {error}
          </span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40"
              : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Students
              </p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {statistics.totalStudents || students.length || 0}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-blue-700/40" : "bg-blue-200"
              }`}
            >
              <FiUsers
                className={`text-2xl ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40"
              : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Average CGPA
              </p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {statistics.avgCGPA || "0.00"}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-green-700/40" : "bg-green-200"
              }`}
            >
              <FiBarChart2
                className={`text-2xl ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Highest CGPA
              </p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {statistics.highestCGPA || "0.00"}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-purple-700/40" : "bg-purple-200"
              }`}
            >
              <FiTrendingUp
                className={`text-2xl ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/40"
              : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Lowest CGPA
              </p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {statistics.lowestCGPA || "0.00"}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-orange-700/40" : "bg-orange-200"
              }`}
            >
              <FiTrendingDown
                className={`text-2xl ${
                  darkMode ? "text-orange-300" : "text-orange-600"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search student by name or enrollment number..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FiBarChart2
            className={`text-5xl mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-300"
            }`}
          />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {filter
              ? "No students found matching your search"
              : "No student marks available"}
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    #
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Student
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Enrollment
                  </th>
                  <th
                    className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Semester
                  </th>
                  <th
                    className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    CGPA
                  </th>
                  <th
                    className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    SGPAs
                  </th>
                  <th
                    className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student._id}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {student.name?.charAt(0) || "?"}
                        </div>
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {student.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {student.enrollmentNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Sem {student.semesterNumber || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full font-bold text-sm ${getCGPAColor(
                          student.cgpa || 0,
                          darkMode
                        )}`}
                      >
                        {student.cgpa?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {student.sgpa?.length > 0 ? (
                          student.sgpa.slice(0, 4).map((s, i) => (
                            <span
                              key={i}
                              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                darkMode
                                  ? "bg-blue-900/40 text-blue-300"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              S{i + 1}: {s?.toFixed(1)}
                            </span>
                          ))
                        ) : (
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            No SGPA
                          </span>
                        )}
                        {student.sgpa?.length > 4 && (
                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            +{student.sgpa.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openEditModal(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <FiEdit2 className="text-sm" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {selectedStudent.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedStudent.name}
                    </h2>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedStudent.enrollmentNumber} • Semester{" "}
                      {selectedStudent.semesterNumber || 1}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* SGPA Grid */}
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Semester-wise SGPA
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {sgpaInputs.map((sgpa, index) => (
                    <div
                      key={sgpa.semester}
                      className={`p-4 rounded-xl border ${
                        sgpa.disabled
                          ? darkMode
                            ? "bg-gray-700/30 border-gray-700 opacity-50"
                            : "bg-gray-100 border-gray-200 opacity-50"
                          : darkMode
                          ? "bg-gray-700/50 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Semester {sgpa.semester}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="0.00"
                        value={sgpa.value}
                        onChange={(e) =>
                          handleSgpaChange(index, e.target.value)
                        }
                        disabled={sgpa.disabled}
                        className={`w-full px-3 py-2 rounded-lg border text-center font-semibold transition-all ${
                          sgpa.disabled
                            ? darkMode
                              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                              : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                            : darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CGPA */}
              <div
                className={`p-5 rounded-xl border ${
                  darkMode
                    ? "bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/40"
                    : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Cumulative CGPA
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Auto-calculated from SGPAs (can be manually adjusted)
                    </p>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpaInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (
                          val === "" ||
                          (parseFloat(val) >= 0 && parseFloat(val) <= 10)
                        ) {
                          setCgpaInput(val);
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-center text-2xl font-bold transition-all ${
                        darkMode
                          ? "bg-gray-800 border-gray-600 text-green-400 focus:border-green-500"
                          : "bg-white border-gray-300 text-green-600 focus:border-green-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 border-t flex items-center justify-end gap-3 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setShowModal(false)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMarks}
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                {saving ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
