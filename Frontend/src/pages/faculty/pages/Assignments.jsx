import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { facultyAPI } from "../../../services/api";
import { FiPlus, FiEye, FiEdit, FiUpload, FiFile } from "react-icons/fi";

export default function Assignments() {
  const { darkMode, faculty } = useOutletContext();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: "",
    branch: "",
    section: "",
    totalMarks: 100,
  });

  useEffect(() => {
    fetchAssignments();
    fetchFacultyClasses();
  }, []);

  const fetchFacultyClasses = async () => {
    try {
      const response = await facultyAPI.getFacultyClasses();
      if (response.classes && response.classes.length > 0) {
        setClasses(response.classes);

        // Extract unique values
        const uniqueBranches = [
          ...new Set(response.classes.map((c) => c.branch)),
        ];
        const uniqueSections = [
          ...new Set(response.classes.map((c) => c.section)),
        ];
        const uniqueSubjects = [
          ...new Set(
            response.classes.map((c) => ({
              id: c.subjectId,
              name: c.subjectName,
              code: c.subjectCode,
            }))
          ),
        ];

        setBranches(uniqueBranches);
        setSections(uniqueSections);
        setSubjects(uniqueSubjects);

        // Auto-select first values
        setFormData((prev) => ({
          ...prev,
          branch: uniqueBranches[0] || "",
          section: uniqueSections[0] || "",
          subject: uniqueSubjects[0]?.id || "",
        }));
      }
    } catch (error) {
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await facultyAPI.getAssignments();
      setAssignments(response.assignments || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert(
          "Invalid file type. Please upload PDF, Word, Excel, PowerPoint, text or image files only."
        );
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("dueDate", formData.dueDate);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("branch", formData.branch);
      formDataToSend.append("section", formData.section);
      formDataToSend.append("totalMarks", formData.totalMarks);

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      await facultyAPI.createAssignment(formDataToSend);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        subject: formData.subject,
        branch: formData.branch,
        section: formData.section,
        totalMarks: 100,
      });
      setSelectedFile(null);
      fetchAssignments();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create assignment");
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assignments</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus /> Create Assignment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`rounded-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <div className="text-sm opacity-75">Total Assignments</div>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </div>
          <div
            className={`rounded-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <div className="text-sm opacity-75">Active</div>
            <div className="text-2xl font-bold">
              {
                assignments.filter((a) => new Date(a.dueDate) >= new Date())
                  .length
              }
            </div>
          </div>
          <div
            className={`rounded-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <div className="text-sm opacity-75">Expired</div>
            <div className="text-2xl font-bold">
              {
                assignments.filter((a) => new Date(a.dueDate) < new Date())
                  .length
              }
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div
              className={`text-center py-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No assignments created yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } border-b`}
                >
                  <tr>
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Subject</th>
                    <th className="text-left py-3 px-4">Class</th>
                    <th className="text-left py-3 px-4">Due Date</th>
                    <th className="text-left py-3 px-4">Marks</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr
                      key={assignment._id}
                      className={`border-b ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td className="py-3 px-4">{assignment.title}</td>
                      <td className="py-3 px-4">{assignment.subject}</td>
                      <td className="py-3 px-4">
                        {assignment.branch} - {assignment.section}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{assignment.totalMarks}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            new Date(assignment.dueDate) >= new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {new Date(assignment.dueDate) >= new Date()
                            ? "Active"
                            : "Expired"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-700 mr-3">
                          <FiEye size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <FiEdit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">Create Assignment</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white border border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white border border-gray-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject, idx) => (
                        <option key={idx} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      required
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Branch
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                      }
                      required
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Section
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                      required
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, totalMarks: e.target.value })
                      }
                      required
                      min="1"
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Attach File (Optional)
                    <span className="text-xs text-gray-500 ml-2">
                      (PDF, Word, Excel, PowerPoint, Images)
                    </span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      darkMode
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FiUpload
                        className={`text-3xl mb-2 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {selectedFile
                          ? selectedFile.name
                          : "Click to upload or drag and drop"}
                      </span>
                    </label>
                    {selectedFile && (
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <FiFile className="text-blue-600" />
                        <span className="text-sm font-medium">
                          {selectedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-red-600 hover:text-red-700 text-xs ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedFile(null);
                    }}
                    className={`px-6 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-gray-500 hover:bg-gray-600"
                    } text-white`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
