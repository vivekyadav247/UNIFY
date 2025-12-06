export default function DangerZoneCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mt-6 border-red-300">
      <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>

      <div className="mb-6">
        <h3 className="font-semibold">Export Account Data</h3>
        <p className="text-gray-600 text-sm mb-2">
          Download your account data in JSON format
        </p>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Export Data
        </button>
      </div>

      <div>
        <h3 className="font-semibold">Deactivate Account</h3>
        <p className="text-gray-600 text-sm mb-2">
          Temporarily deactivate your account
        </p>
        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
