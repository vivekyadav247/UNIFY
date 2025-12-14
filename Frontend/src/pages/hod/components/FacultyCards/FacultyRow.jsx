
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
  status = ""
}) {
  const statusColor =
    status === "Active"
      ? "bg-green-100 text-green-700"
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
    <tr className="border-b">
      <td className="py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {initials || "?"}
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">{dept}</p>
          </div>
        </div>
      </td>

      <td className="px-2">{id}</td>

      <td className="px-2">
        <p className="flex items-center gap-1">{email}</p>
        <p className="text-sm text-gray-500">{phone}</p>
      </td>

      <td className="px-2">{designation}</td>
      <td className="px-2">{exp}</td>
      <td className="px-2">{students}</td>

      <td className="px-2">
        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
          {status}
        </span>
      </td>

      <td className="px-2 text-xl text-gray-500">⋮</td>
    </tr>
  );
}
