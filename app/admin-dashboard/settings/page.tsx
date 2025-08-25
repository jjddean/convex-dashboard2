export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage application configuration. We will wire this to Convex and environment variables.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Branding</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Logo, colors, theme</div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Edit</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Clerk configuration and role mappings</div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Edit</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Payments</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Stripe keys and billing options</div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Edit</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Shipping Providers</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>ReachShip, EasyShip, Shippo keys and settings</div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )
}