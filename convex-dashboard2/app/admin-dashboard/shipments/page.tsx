'use client'

import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'

export default function ShipmentsPage() {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile() // Move hook to top level

  const shipments = useQuery(api.shipments.listShipments, { search })
  const isLoading = shipments === undefined
  const list = shipments ?? []

  const stats = useMemo(() => {
    const total = list.length
    const inTransit = list.filter(s => s.status === 'in_transit').length
    const delivered = list.filter(s => s.status === 'delivered').length
    const pending = list.filter(s => s.status === 'pending').length
    return { total, inTransit, delivered, pending }
  }, [list])

  const statusBadge = (status: string) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    switch (status) {
      case 'in_transit':
        return <span className={`${base} bg-blue-100 text-blue-800`}>In Transit</span>
      case 'delivered':
        return <span className={`${base} bg-green-100 text-green-800`}>Delivered</span>
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
      case 'exception':
        return <span className={`${base} bg-red-100 text-red-800`}>Exception</span>
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        <p className="text-gray-600">Track and manage shipments across carriers and lanes</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Total Shipments</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">In Transit</div>
          <div className="mt-2 text-2xl font-bold">{stats.inTransit}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Delivered</div>
          <div className="mt-2 text-2xl font-bold">{stats.delivered}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="mt-2 text-2xl font-bold">{stats.pending}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, status, location, or carrier"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Export</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading shipments…</td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No shipments found</td>
                </tr>
              ) : (
                list.map((sh: any) => (
                  <tr key={sh._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-600">
                      <Drawer direction={isMobile ? 'bottom' : 'right'}>
                        <DrawerTrigger asChild>
                          <Button variant="link" className="text-foreground w-fit px-0 text-left underline-offset-2 hover:underline">
                            {sh.shipmentId}
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="max-w-[520px]">
                          <DrawerHeader className="gap-1">
                            <DrawerTitle>Shipment {sh.shipmentId}</DrawerTitle>
                            <DrawerDescription>
                              {sh.shipmentDetails?.origin} → {sh.shipmentDetails?.destination} · {sh.status}
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 text-sm">
                            <section className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[11px] text-muted-foreground">Carrier</div>
                                <div className="text-sm">{sh.carrier ?? '-'}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-muted-foreground">Tracking #</div>
                                <div className="text-sm">{sh.trackingNumber ?? '-'}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-muted-foreground">Service</div>
                                <div className="text-sm">{sh.service ?? '-'}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-muted-foreground">Last Updated</div>
                                <div className="text-sm">{sh.lastUpdated ? new Date(sh.lastUpdated).toLocaleString() : '-'}</div>
                              </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sh.shipmentDetails?.origin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sh.shipmentDetails?.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{statusBadge(sh.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sh.carrier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sh.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(sh.lastUpdated).toLocaleString()}</td>
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