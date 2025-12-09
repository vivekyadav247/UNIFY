export default function ProfileCard({ student, darkMode }) {
  const data = student || {
    name: "Sujal Bhawsar",
    email: "xyz@gmail.com",
    course: "B.Tech CSE",
    roll: "23CS45",
    avatar: "https://i.pravatar.cc/150?img=32",
  };

  return (
    <div className={`p-6 rounded-xl transition-colors duration-300 flex items-center justify-between ${
      darkMode ? "bg-gray-800/50 border border-gray-700 shadow-lg" : "bg-white border border-gray-200 shadow"
    }`}>

      <div className="flex-1">
        <h2 className={`font-semibold text-2xl ${darkMode ? "text-white" : "text-gray-800"}`}>
          {data.name}
        </h2>

        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{data.email}</p>

        <div className="mt-3 flex gap-4 text-sm text-gray-600">
          <div>
            <div className="text-xs text-gray-500">Course</div>
            <div className="font-medium">{data.course}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Roll</div>
            <div className="font-medium">{data.roll}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <img
          src={data.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-purple-500 shadow"
        />
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Edit</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">View</button>
        </div>
      </div>
    </div>
  );
}
