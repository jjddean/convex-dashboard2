'use client'

import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

function formatCurrency(amount: number, currency: string = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export default function UserQuotesPage() {
  const [search, setSearch] = useState('')
  const quotes = useQuery(api.quotes.listMyQuotes, {}) as any[] | undefined
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
        <h1 className="text-2xl font-bold">Quotes</h1>
        <p className="text-muted-foreground">Search, review, and manage your quotes.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Total Quotes</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="mt-2 text-2xl font-bold">{stats.completed}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="mt-2 text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Avg. Best Price</div>
          <div className="mt-2 text-2xl font-bold">{stats.avgBest ? formatCurrency(stats.avgBest) : '-'}</div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, route, carrier, or status"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quote ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Best Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Carriers</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">No quotes found</td>
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
    <tr className="hover:bg-muted/30">
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
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

              <div className="mt-2 font-medium">Carrier Quotes</div>
              <div className="divide-y rounded-md border">
                {(q.quotes ?? []).map((qq: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{qq.carrierName}</div>
                      <div className="text-muted-foreground text-xs">{qq.serviceType} · {qq.transitTime} · valid until {new Date(qq.validUntil).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(qq.price?.amount ?? 0, qq.price?.currency ?? 'USD')}</div>
                      <div className="text-[11px] text-muted-foreground">Base {formatCurrency(qq.price?.breakdown?.baseRate ?? 0, qq.price?.currency ?? 'USD')}, Fuel {formatCurrency(qq.price?.breakdown?.fuelSurcharge ?? 0, qq.price?.currency ?? 'USD')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <ConvertToBookingButton quote={q} />
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{q.origin}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{q.destination}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{q.serviceType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{best != null ? formatCurrency(best) : '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{carriers}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{q.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{created}</td>
    </tr>
  )
}

function Field({ label, value }: { label: string, value: any }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm">{value ?? '-'}</div>
    </div>
  )
}


function bestCarrierQuote(quote: any) {
  const arr = (quote.quotes ?? [])
  if (!arr.length) return null
  return arr.reduce((min: any, q: any) => (q.price?.amount < (min?.price?.amount ?? Infinity) ? q : min), arr[0])
}

function ConvertToBookingButton({ quote }: { quote: any }) {
  const createBooking = useMutation(api.bookings.createBooking)
  const upsertShipment = useMutation(api.shipments.upsertShipment)
  const [loading, setLoading] = useState(false)

  async function onClick() {
    try {
      setLoading(true)
      const best = bestCarrierQuote(quote)
      if (!best) {
        toast.error('No carrier quotes available to convert')
        return
      }
      const contact = quote.contactInfo ?? { name: 'N/A', email: 'noreply@example.com', phone: '', company: '' }
      const bookingRes = await createBooking({
        quoteId: quote.quoteId,
        carrierQuoteId: best.carrierId,
        customerDetails: {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
        },
        pickupDetails: {
          address: quote.origin,
          date: new Date().toISOString(),
          timeWindow: '09:00-17:00',
          contactPerson: contact.name,
          contactPhone: contact.phone,
        },
        deliveryDetails: {
          address: quote.destination,
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          timeWindow: '09:00-17:00',
          contactPerson: contact.name,
          contactPhone: contact.phone,
        },
        specialInstructions: undefined,
      })

      // Create a new shipment linked by using bookingId as shipmentId
      const shipmentId = bookingRes?.bookingId ?? `SHP-${Date.now()}`
      await upsertShipment({
        shipmentId,
        tracking: {
          status: 'pending',
          currentLocation: {
            city: quote.origin || 'Origin',
            state: '',
            country: '',
            coordinates: { lat: 0, lng: 0 },
          },
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          carrier: best.carrierName ?? best.carrierId,
          trackingNumber: `TBA-${shipmentId}`,
          service: best.serviceType ?? quote.serviceType,
          shipmentDetails: {
            weight: quote.weight ?? '',
            dimensions: `${quote.dimensions?.length ?? ''}x${quote.dimensions?.width ?? ''}x${quote.dimensions?.height ?? ''}`,
            origin: quote.origin ?? '',
            destination: quote.destination ?? '',
            value: quote.value ?? '',
          },
          events: [
            {
              timestamp: new Date().toISOString(),
              status: 'Shipment created',
              location: quote.origin ?? 'Origin',
              description: `Booking ${shipmentId} confirmed with ${best.carrierName ?? best.carrierId}`,
            },
          ],
        },
      })

      toast.success('Converted to booking and created shipment')
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to convert to booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? 'Converting…' : 'Convert to Booking'}
    </Button>
  )
}