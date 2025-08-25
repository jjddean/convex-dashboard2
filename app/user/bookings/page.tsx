'use client'

import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'

export default function UserBookingsPage() {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile() // Move hook to top level
  const bookings = useQuery(api.bookings.listMyBookings, {})
  const isLoading = bookings === undefined
  const list = (bookings ?? []).filter((b) => {
    const s = search.toLowerCase()
    return (
      !s ||
      b.bookingId.toLowerCase().includes(s) ||
      b.quoteId.toLowerCase().includes(s) ||
      b.status.toLowerCase().includes(s) ||
      b.customerDetails.name.toLowerCase().includes(s)
    )
  })

  const RowField = ({ label, value }: { label: string; value: any }) => (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm">{value ?? '-'}</div>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">View and manage your bookings.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, quote or customer"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quote ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pickup</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="px-6 py-8" colSpan={5}>Loading…</td></tr>
              ) : list.length === 0 ? (
                <tr><td className="px-6 py-8" colSpan={5}>No bookings</td></tr>
              ) : (
                list.map((b: any) => {
                  return (
                    <tr key={b._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono text-sm">
                        <Drawer direction={isMobile ? 'bottom' : 'right'}>
                          <DrawerTrigger asChild>
                            <Button variant="link" className="text-foreground w-fit px-0 text-left underline-offset-2 hover:underline">
                              {b.bookingId}
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent className="max-w-[520px]">
                            <DrawerHeader className="gap-1">
                              <DrawerTitle>Booking {b.bookingId}</DrawerTitle>
                              <DrawerDescription>
                                Quote {b.quoteId} · {b.status}
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 text-sm">
                              <section className="grid grid-cols-2 gap-3">
                                <RowField label="Status" value={b.status} />
                                <RowField label="Quote ID" value={b.quoteId} />
                                <RowField label="Pickup" value={b.pickupDetails?.address} />
                                <RowField label="Delivery" value={b.deliveryDetails?.address} />
                                <RowField label="Customer" value={b.customerDetails?.name} />
                                <RowField label="Company" value={b.customerDetails?.company} />
                              </section>
                            </div>
                            <DrawerFooter>
                              <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </td>
                      <td className="px-6 py-4">{b.quoteId}</td>
                      <td className="px-6 py-4">{b.status}</td>
                      <td className="px-6 py-4">{b.pickupDetails.address}</td>
                      <td className="px-6 py-4">{b.deliveryDetails.address}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}