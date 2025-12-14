
export default function ApprovalCard({ title, name, date }) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 mb-4 flex justify-between items-center">
      {/* Left side: title + name + date */}
      <div className="space-y-1">
        <p className="font-semibold text-lg">{title}</p>
        <p className="text-base text-gray-700">{name}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      {/* Right side: buttons */}
      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">
          Approve
        </button>
        <button className="border px-5 py-2 rounded-md hover:bg-gray-100 transition">
          Reject
        </button>
      </div>
    </div>
  );
}
