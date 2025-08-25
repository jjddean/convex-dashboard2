'use client'

import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useIsMobile } from '@/hooks/use-mobile'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

function formatCurrency(amount: number, currency: string = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export default function QuotesPage() {
  const [search, setSearch] = useState('')
  const quotes = useQuery(api.quotes.listQuotes, {}) as any[] | undefined
  const isLoading = quotes === undefined
  const list = (quotes ?? []).map((q: any) => ({ ...q }))

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return list
    return list.filter((q: any) => {
      const fields = [
        q.quoteId,
        q.origin,
        q.destination,
        q.serviceType,
        q.status,
        ...(q.quotes?.map((x: any) => x.carrierName) ?? []),
      ]
      return fields.some((f: any) => (f || '').toString().toLowerCase().includes(s))
    })
  }, [list, search])

  const stats = useMemo(() => {
    const total = list.length
    const completed = list.filter((q: any) => q.status === 'completed').length
    const pending = list.filter((q: any) => q.status !== 'completed').length
    const bestPrices = list
      .map((q: any) => Math.min(...(q.quotes?.map((x: any) => x.price?.amount ?? Infinity) ?? [Infinity])))
      .filter((n: number) => Number.isFinite(n))
    const avgBest = bestPrices.length
      ? Math.round((bestPrices.reduce((a: number, b: number) => a + b, 0) / bestPrices.length) * 100) / 100
      : 0
    return { total, completed, pending, avgBest }
  }, [list])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
        <p className="text-gray-600">Search, review, and manage freight quotes saved from the API.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Total Quotes</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="mt-2 text-2xl font-bold">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="mt-2 text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Avg. Best Price</div>
          <div className="mt-2 text-2xl font-bold">{stats.avgBest ? formatCurrency(stats.avgBest) : '-'}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, route, carrier, or status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carriers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">Loading quotes…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">No quotes found</td>
                </tr>
              ) : (
                filtered.map((q: any) => (
                  <QuoteRow key={q._id} q={q} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function QuoteRow({ q }: { q: any }) {
  const isMobile = useIsMobile()
  const best = useMemo(() => {
    const arr = q.quotes?.map((x: any) => x.price?.amount ?? Infinity) ?? []
    const min = Math.min(...(arr.length ? arr : [Infinity]))
    return Number.isFinite(min) ? min : null
  }, [q])

  const created = q.createdAt ? new Date(q.createdAt).toLocaleString() : '-'
  const carriers = (q.quotes?.length ?? 0)

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-600">
        <Drawer direction={isMobile ? 'bottom' : 'right'}>
          <DrawerTrigger asChild>
            <Button variant="link" className="text-foreground w-fit px-0 text-left underline-offset-2 hover:underline">
              {q.quoteId}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-[520px]">
            <DrawerHeader className="gap-1">
              <DrawerTitle>Quote {q.quoteId}</DrawerTitle>
              <DrawerDescription>
                {q.origin} → {q.destination} · {q.serviceType}
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 text-sm">
              <section className="grid grid-cols-2 gap-3">
                <Field label="Origin" value={q.origin} />
                <Field label="Destination" value={q.destination} />
                <Field label="Service" value={q.serviceType} />
                <Field label="Cargo" value={q.cargoType} />
                <Field label="Weight" value={q.weight} />
                <Field label="Dimensions" value={`${q.dimensions?.length}×${q.dimensions?.width}×${q.dimensions?.height}`} />
                <Field label="Value" value={q.value} />
                <Field label="Incoterms" value={q.incoterms} />
                <Field label="Urgency" value={q.urgency} />
                <Field label="Status" value={q.status} />
              </section>

              <div className="mt-2 font-medium text-gray-900">Carrier Quotes</div>
              <div className="divide-y rounded-md border">
                {(q.quotes ?? []).map((qq: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">{qq.carrierName}</div>
                      <div className="text-gray-600 text-xs">{qq.serviceType} · {qq.transitTime} · valid until {new Date(qq.validUntil).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(qq.price?.amount ?? 0, qq.price?.currency ?? 'USD')}</div>
                      <div className="text-[11px] text-gray-500">Base {formatCurrency(qq.price?.breakdown?.baseRate ?? 0, qq.price?.currency ?? 'USD')}, Fuel {formatCurrency(qq.price?.breakdown?.fuelSurcharge ?? 0, qq.price?.currency ?? 'USD')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <Button>Select Best</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.origin}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.destination}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.serviceType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{best != null ? formatCurrency(best) : '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{carriers}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{created}</td>
    </tr>
  )
}

function Field({ label, value }: { label: string, value: any }) {
  return (
    <div>
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value ?? '-'}</div>
    </div>
  )
}