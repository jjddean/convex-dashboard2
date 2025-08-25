export default function ManualActionsPage() {
  const actions = [
    { name: 'Override Quote', description: 'Manually adjust quote calculation for edge cases' },
    { name: 'Retry Payment', description: 'Retry failed payment webhook processing' },
    { name: 'Force Sync', description: 'Force synchronization with carrier APIs' },
    { name: 'Reset User', description: 'Reset user account state and permissions' },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manual Actions</h1>
        <p className="text-gray-600">Administrative tools for handling exceptions and edge cases.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{action.description}</p>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
              Execute
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Actions</h2>
        <div className="space-y-3">
          {[
            { action: 'Override Quote', user: 'admin@company.com', time: '2 hours ago', result: 'Success' },
            { action: 'Retry Payment', user: 'admin@company.com', time: '1 day ago', result: 'Success' },
          ].map((r, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-sm">{r.action}</div>
                <div className="text-xs text-gray-500">by {r.user} • {r.time}</div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{r.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}