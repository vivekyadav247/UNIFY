import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBook,
  FiCheckCircle,
} from "react-icons/fi";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dropdown options
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [formData, setFormData] = useState({
    subjectCode: "",
    name: "",
    course: "",
    department: "",
    branch: "",
    section: "",
    semesterNumber: "",
    academicYear: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSubjects(subjects);
    } else {
      const filtered = subjects.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.subjectCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subject.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [searchTerm, subjects]);

  const fetchDropdownOptions = async () => {
    try {
      const [deptRes, courseRes, branchRes, sectionRes, yearRes] =
        await Promise.all([
          fetch("http://localhost:3000/api/admin/departments", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/admin/courses", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/admin/branches", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/admin/sections", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/admin/academic-years", {
            credentials: "include",
          }),
        ]);

      if (deptRes.ok) {
        const data = await deptRes.json();
        setDepartments(data.departments || []);
      }
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourses(data.courses || []);
      }
      if (branchRes.ok) {
        const data = await branchRes.json();
        setBranches(data.branches || []);
      }
      if (sectionRes.ok) {
        const data = await sectionRes.json();
        setSections(data.sections || []);
      }
      if (yearRes.ok) {
        const data = await yearRes.json();
        setAcademicYears(data.academicYears || []);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown options:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/subjects", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch subjects");

      const data = await response.json();
      setSubjects(data.subjects || []);
      setFilteredSubjects(data.subjects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedSubject(null);
    setFormData({
      subjectCode: "",
      name: "",
      course: "",
      department: "",
      branch: "",
      section: "",
      semesterNumber: "",
      academicYear: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (subject) => {
    setModalMode("edit");
    setSelectedSubject(subject);
    setFormData({
      subjectCode: subject.subjectCode,
      name: subject.name,
      course: subject.course,
      department: subject.department,
      branch: subject.branch || "",
      section: subject.section || "",
      semesterNumber: subject.semesterNumber,
      academicYear: subject.academicYear,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/subject/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete subject");

      setSuccess("Subject deleted successfully");
      fetchSubjects();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        modalMode === "create"
          ? "http://localhost:3000/api/admin/subject"
          : `http://localhost:3000/api/admin/subject/${selectedSubject._id}`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save subject");
      }

      setSuccess(
        `Subject ${modalMode === "create" ? "created" : "updated"} successfully`
      );
      setShowModal(false);
      fetchSubjects();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
            <FiBook className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subject Management
            </h1>
            <p className="text-gray-600">
              Manage subjects for different departments and courses
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <FiCheckCircle />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCreateClick}
            className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FiPlus />
            Add New Subject
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading subjects...
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No subjects found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Subject Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Semester
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubjects.map((subject) => (
                  <tr
                    key={subject._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-teal-600">
                      {subject.subjectCode}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{subject.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {subject.department}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {subject.course}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {subject.branch || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-sm font-medium">
                        Sem {subject.semesterNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(subject)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create" ? "Add New Subject" : "Edit Subject"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleInputChange}
                    disabled={modalMode === "edit"}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 uppercase"
                    placeholder="e.g., CSE301"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Data Structures"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Branch (Optional)</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Section (Optional)</option>
                    {sections.map((section) => (
                      <option key={section._id} value={section.name}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester Number *
                  </label>
                  <input
                    type="number"
                    name="semesterNumber"
                    value={formData.semesterNumber}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year._id} value={year.year}>
                        {year.year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {modalMode === "create" ? "Create Subject" : "Update Subject"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
