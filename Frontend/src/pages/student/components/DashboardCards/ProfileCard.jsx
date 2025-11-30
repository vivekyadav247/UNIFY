
export default function ProfileCard({ student }) {
  const data = student || {
    name: "Sujal Bhawsar",
    email: "xyz@gmail.com",
    course: "B.Tech CSE",
    roll: "23CS45",
    avatar: "https://i.pravatar.cc/150?img=32",
  };

  return (
    <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-800 flex items-center justify-between">

      {/* LEFT SIDE — PROPER VERTICAL ARRANGEMENT */}
      <div className="flex flex-col space-y-1">
        
        {/* Name */}
        <h2 className="font-semibold text-2xl text-gray-800 dark:text-white">
          {data.name}
        </h2>

        {/* Email */}
        <p className="text-gray-600 dark:text-gray-300">
          {data.email}
        </p>

        {/* Course */}
        <p className="text-gray-700 dark:text-gray-400 text-sm">
          {data.course}
        </p>

        {/* Enrollment / Roll */}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Enrollment No: {data.roll}
        </p>
      </div>

      {/* RIGHT — AVATAR */}
      <img
        src={data.avatar}
        className="w-24 h-24 rounded-full object-cover border-2 border-purple-500 shadow"
      />
    </div>
  );
}
