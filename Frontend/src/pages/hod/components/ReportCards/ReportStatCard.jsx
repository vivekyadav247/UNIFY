
export default function ReportStatCard({ title, value, note, color, icon }) {
  return (
    <div className={`${color} text-white rounded-xl p-6 space-y-4`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="opacity-80">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-90">{note}</p>
    </div>
  );
}
