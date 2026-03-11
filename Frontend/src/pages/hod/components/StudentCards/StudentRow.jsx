import React from "react";

export default function StudentRow({
  name = "",
  id = "",
  branch = "",
  email = "",
  phone = "",
  gender = "",
  attendance = "",
  status = "",
  darkMode = false,
}) {
  const safeName = name || "";
  const initials = safeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColor =
    status === "Active"
      ? darkMode
        ? "bg-green-900/30 text-green-400"
        : "bg-green-100 text-green-700"
      : darkMode
      ? "bg-red-900/30 text-red-400"
      : "bg-red-100 text-red-700";

  return (
    <tr
      className={`border-b ${
        darkMode
          ? "border-gray-700 hover:bg-gray-700/50"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      {/* NAME + AVATAR */}
      <td className="px-3 py-4">
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
              {branch}
            </p>
          </div>
        </div>
      </td>

      <td className={`px-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {id}
      </td>

      <td className={`px-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {branch}
      </td>

      {/* CONTACT */}
      <td className="px-3">
        <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{email}</p>
        <p
          className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          {phone}
        </p>
      </td>

      <td className={`px-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {gender}
      </td>
      <td className={`px-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {attendance}
      </td>

      <td className="px-3">
        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
          {status}
        </span>
      </td>

      <td
        className={`px-3 text-xl cursor-pointer ${
          darkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        ⋮
      </td>
    </tr>
  );
}
