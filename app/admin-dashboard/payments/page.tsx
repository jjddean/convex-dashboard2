export default function PaymentsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Invoices</h1>
        <p className="text-gray-600">View invoices, process payments, and override quotes</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="text-gray-700">
          This section will integrate with Stripe and internal billing.
        </div>
      </div>
    </div>
  )
}