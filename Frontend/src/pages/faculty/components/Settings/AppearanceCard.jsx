export default function AppearanceCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mt-6">
      <h2 className="text-lg font-semibold mb-4">Appearance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Theme</label>
          <select className="w-full p-2 border rounded-lg mt-1">
            <option>System</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Language</label>
          <select className="w-full p-2 border rounded-lg mt-1">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>
    </div>
  );
}
