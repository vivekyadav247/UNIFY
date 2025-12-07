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
      darkMode 
        ? "bg-gray-800/50 border border-gray-700 shadow-lg" 
        : "bg-white border border-gray-200 shadow"
    }`}>

      {/* LEFT SIDE — PROPER VERTICAL ARRANGEMENT */}
      <div className="flex flex-col space-y-1">
        
        {/* Name */}
        <h2 className={`font-semibold text-2xl ${darkMode ? "text-white" : "text-gray-800"}`}>
          {data.name}
        </h2>

        {/* Email */}
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          {data.email}
        </p>

        {/* Course */}
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
          {data.course}
        </p>

        {/* Enrollment / Roll */}
        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
          Enrollment No: {data.roll}
        </p>
      </div>

      {/* RIGHT — AVATAR */}
      <img
        src={data.avatar}
        className={`w-24 h-24 rounded-full object-cover border-2 border-purple-500 shadow transition-all duration-300 ${
          darkMode ? "ring-2 ring-purple-500/50" : ""
        }`}
      />
    </div>
  );
}
