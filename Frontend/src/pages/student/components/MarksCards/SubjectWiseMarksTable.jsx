import React from "react";

export default function SubjectWiseMarksTable({ subjects, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700" 
        : "bg-white border border-gray-200"
    } overflow-x-auto`}>
      
      <table className="w-full">
        <thead>
          <tr className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
            <th className={`px-4 py-4 text-left font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Subject
            </th>
            <th className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Internal
            </th>
            <th className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              External
            </th>
            <th className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Total
            </th>
            <th className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Grade
            </th>
            <th className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Credits
            </th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr 
              key={index} 
              className={`transition-colors duration-300 ${
                darkMode 
                  ? "border-b border-gray-600 hover:bg-gray-700/30" 
                  : "border-b border-gray-200 hover:bg-slate-50"
              }`}
            >
              <td className={`px-4 py-4 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                {subject.name}
              </td>
              <td className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                {subject.internal}
              </td>
              <td className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                {subject.external}
              </td>
              <td className={`px-4 py-4 text-center font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {subject.total}
              </td>
              <td className={`px-4 py-4 text-center`}>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  subject.grade === "A+"
                    ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                    : subject.grade === "A"
                    ? darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"
                    : darkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {subject.grade}
                </span>
              </td>
              <td className={`px-4 py-4 text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {subject.credits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}