
export default function ProfileCard({ student }) {
  const data = student || {
    name: "Sujal Bhawsar",
    email: "xyz@gmail.com",
    course: "B.Tech CSE",
    roll: "23CS45",
    avatar: "https://i.pravatar.cc/150?img=32",
  };

  return (
    <div className="p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 flex items-center justify-between gap-6">

      {/* LEFT SIDE — PROFILE DETAILS */}
      <div className="flex-1">
        <h2 className="font-semibold text-3xl text-gray-800 dark:text-white">
          {data.name}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {data.email}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <div className="text-xs text-gray-500">Course</div>
            <div className="font-medium">{data.course}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Enrollment</div>
            <div className="font-medium">{data.roll}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div className="font-medium">Active</div>
          </div>
        </div>
      </div>

      {/* RIGHT — AVATAR + ACTIONS */}
      <div className="flex flex-col items-center gap-4">
        <img
          src={data.avatar}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border-2 border-purple-500 shadow"
        />

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Edit</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm">View</button>
        </div>
      </div>
    </div>
  );
}
