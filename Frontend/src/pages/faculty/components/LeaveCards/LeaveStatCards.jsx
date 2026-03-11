export default function LeaveStatCards() {
  const stats = [
    { title: "Pending Leaves", value: 5, color: "bg-orange-500" },
    { title: "Approved", value: 18, color: "bg-green-500" },
    { title: "Rejected", value: 2, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 flex justify-between items-center shadow"
        >
          <div>
            <p className="text-gray-500">{item.title}</p>
            <h2 className="text-3xl font-semibold">{item.value}</h2>
          </div>

          <div
            className={`${item.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-lg`}
          >
            ●
          </div>
        </div>
      ))}
    </div>
  );
}
