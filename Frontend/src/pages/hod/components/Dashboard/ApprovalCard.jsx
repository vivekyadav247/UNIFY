// components/dashboard/ApprovalCard.jsx

export default function ApprovalCard({
  title,
  by,
  date,
  onApprove,
  onReject
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border mb-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
          Pending
        </span>
      </div>

      <p className="text-gray-600 mt-1">{by}</p>
      <p className="text-gray-500 text-sm">{date}</p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onApprove}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
          Approve
        </button>

        <button
          onClick={onReject}
          className="border border-gray-400 px-4 py-2 rounded-lg w-full">
          Reject
        </button>
      </div>
    </div>
  );
}
