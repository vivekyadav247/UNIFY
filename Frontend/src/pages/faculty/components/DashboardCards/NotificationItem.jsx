// components/FacultyDashboardCards/NotificationItem.jsx
export default function NotificationItem({ icon, text, time, badge }) {
  return (
    <div className="flex justify-between items-center bg-slate-50 rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100">
          {icon}
        </div>

        <div>
          <p className="font-medium">{text}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>

      {badge && (
        <span className="px-3 py-1 rounded-full text-sm bg-black text-white">
          {badge}
        </span>
      )}
    </div>
  );
}
