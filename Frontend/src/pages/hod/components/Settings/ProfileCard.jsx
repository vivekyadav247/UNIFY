import { useState } from "react";

export default function ProfileCard() {
  const [fullName, setFullName] = useState("Emma Williams");
  const [email, setEmail] = useState("emma.w@college.edu");
  const [phone, setPhone] = useState("+1 234-567-8900");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold">
          EW
        </div>

        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Change Photo
        </button>
        <span className="text-sm text-gray-500">JPG, PNG, GIF. Max 2MB</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            className="w-full p-2 border rounded-lg mt-1 bg-gray-100"
            value={fullName}
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">User ID</label>
          <input
            className="w-full p-2 border rounded-lg mt-1 bg-gray-100"
            value="CS21B045"
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="w-full p-2 border rounded-lg mt-1 bg-gray-100"
            value={email}
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            className="w-full p-2 border rounded-lg mt-1 bg-gray-100"
            value={phone}
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Year</label>
          <input
            className="w-full p-2 border rounded-lg mt-1 bg-gray-100"
            value="3rd Year"
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Teacher Guardian</label>
          <input
            className="w-full p-2 border rounded-lg mt-1 bg-gray-100"
            value="Prof. Michael Chen"
            readOnly
          />
        </div>
      </div>

      <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Save Changes
      </button>
    </div>
  );
}
