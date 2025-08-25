'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function UserPaymentsPage() {
  const payments = useQuery(api.paymentAttempts.listMyPayments, {})
  const isLoading = payments === undefined
  const list = payments ?? []

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Review invoices, transactions, and balances.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="px-6 py-8" colSpan={5}>Loading…</td></tr>
              ) : list.length === 0 ? (
                <tr><td className="px-6 py-8" colSpan={5}>No payments</td></tr>
              ) : (
                list.map((p: any) => (
                  <tr key={p._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{p.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{p.totals?.grand_total?.amount_formatted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{p.invoice_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{p.payment_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}