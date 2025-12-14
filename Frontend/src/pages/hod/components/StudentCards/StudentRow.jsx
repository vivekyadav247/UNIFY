import React from "react";

export default function StudentRow({
  name,
  id,
  branch,
  email,
  phone,
  gender,
  attendance,
  status
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColor =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <tr className="border-b hover:bg-gray-50">
      {/* NAME + AVATAR */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">{branch}</p>
          </div>
        </div>
      </td>

      <td className="px-3">{id}</td>

      <td className="px-3">{branch}</td>

      {/* CONTACT */}
      <td className="px-3">
        <p>{email}</p>
        <p className="text-sm text-gray-500">{phone}</p>
      </td>

      <td className="px-3">{gender}</td>
      <td className="px-3">{attendance}</td>

      <td className="px-3">
        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
          {status}
        </span>
      </td>

      <td className="px-3 text-xl cursor-pointer">⋮</td>
    </tr>
  );
}
