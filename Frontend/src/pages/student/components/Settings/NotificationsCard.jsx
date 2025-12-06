export default function NotificationsCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mt-6">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>

      <div className="flex justify-between items-center py-3 border-b">
        <span>Email Notifications</span>
        <input type="checkbox" className="toggle-checkbox" />
      </div>

      <div className="flex justify-between items-center py-3 border-b">
        <span>Push Notifications</span>
        <input type="checkbox" className="toggle-checkbox" />
      </div>

      <div className="flex justify-between items-center py-3">
        <span>Weekly Reports</span>
        <input type="checkbox" className="toggle-checkbox" />
      </div>

      <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Save Preferences
      </button>
    </div>
  );
}
