import React from "react";

export default function FacultyRow({
  name = "",
  dept = "",
  id = "",
  email = "",
  phone = "",
  designation = "",
  exp = "",
  students = "",
  status = "",
  darkMode = false,
}) {
  const statusColor =
    status === "Active"
      ? darkMode
        ? "bg-green-900/30 text-green-400"
        : "bg-green-100 text-green-700"
      : darkMode
      ? "bg-yellow-900/30 text-yellow-400"
      : "bg-yellow-100 text-yellow-700";

  const safeName = name || "";
  const initials = safeName
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  return (
    <tr
      className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <td className="py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {initials || "?"}
          </div>
          <div>
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {name}
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {dept}
            </p>
          </div>
        </div>
      </td>

      <td className={`px-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {id}
      </td>

      <td className="px-2">
        <p
          className={`flex items-center gap-1 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {email}
        </p>
        <p
          className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          {phone}
        </p>
      </td>

      <td className={`px-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {designation}
      </td>
      <td className={`px-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {exp}
      </td>
      <td className={`px-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {students}
      </td>

      <td className="px-2">
        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
          {status}
        </span>
      </td>

      <td
        className={`px-2 text-xl cursor-pointer ${
          darkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        ⋮
      </td>
    </tr>
  );
}
