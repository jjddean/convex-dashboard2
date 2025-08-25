export default function LogsPage() {
  const logs = [
    { id: 1, time: '2025-08-11 20:05:12', level: 'INFO', message: 'User signed in', context: 'clerk' },
    { id: 2, time: '2025-08-11 20:06:03', level: 'WARN', message: 'Rate limit approaching for Shippo', context: 'shippo' },
    { id: 3, time: '2025-08-11 20:08:29', level: 'ERROR', message: 'Payment webhook signature invalid', context: 'clerk/payments' },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
        <p className="text-gray-600">System and integration logs. We will stream from Convex soon.</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Recent Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{l.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${l.level === 'ERROR' ? 'bg-red-100 text-red-700' : l.level === 'WARN' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{l.level}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{l.context}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}