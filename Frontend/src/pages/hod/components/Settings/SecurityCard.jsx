export default function SecurityCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mt-6">
      <h2 className="text-lg font-semibold mb-4">Security</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="password"
          placeholder="Current password"
          className="p-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="New password"
          className="p-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="p-2 border rounded-lg"
        />
      </div>

      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Change Password
      </button>

      <hr className="my-6" />

      <div>
        <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Enable 2FA
        </button>
      </div>
    </div>
  );
}
