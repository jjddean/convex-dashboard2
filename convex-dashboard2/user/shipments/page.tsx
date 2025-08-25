'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSearchParams } from 'next/navigation'
import ShipmentMapWrapper from '@/components/tracking/ShipmentMapWrapper';
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import TrackingProgress from '@/components/tracking/TrackingProgress'

function ShipmentsInner() {
  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const t = searchParams.get('track')
    if (t) setSearch(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shipments = useQuery(api.shipments.listShipments, { search, onlyMine: true })
  const isLoading = shipments === undefined
  const list = shipments ?? []

  const [trackingIdLoading, setTrackingIdLoading] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [histories, setHistories] = useState<Record<string, any | null>>({})
  const focusedShipment = useMemo(() => list.find((s: any) => s.shipmentId === focusedId) ?? list[0] ?? null, [list, focusedId])
  const isMobile = useIsMobile()

  const stats = useMemo(() => {
    const total = list.length
    const inTransit = list.filter((s: any) => s.status === 'in_transit').length
    const delivered = list.filter((s: any) => s.status === 'delivered').length
    const pending = list.filter((s: any) => s.status === 'pending').length
    return { total, inTransit, delivered, pending }
  }, [list])

  const ensureHistory = async (shipmentId: string) => {
    if (histories[shipmentId]) return histories[shipmentId]
    const res = await fetch(`/api/shipments/${encodeURIComponent(shipmentId)}/tracking`, { method: 'GET' })
    const data = await res.json().catch(() => null)
    setHistories((h) => ({ ...h, [shipmentId]: data }))
    return data
  }

  const trackNow = async (shipmentId: string) => {
    try {
      setTrackingIdLoading(shipmentId)
      const res = await fetch(`/api/shipments/${encodeURIComponent(shipmentId)}/tracking`, { method: 'GET' })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e?.error || 'Failed to track shipment')
      }
      await ensureHistory(shipmentId)
    } catch (err) {
      console.error('Track now failed:', err)
    } finally {
      setTrackingIdLoading(null)
    }

  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Shipments</h1>
        <p className="text-muted-foreground">Track your shipments.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, status or location"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Total Shipments</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">In Transit</div>
          <div className="mt-2 text-2xl font-bold">{stats.inTransit}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Delivered</div>
          <div className="mt-2 text-2xl font-bold">{stats.delivered}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="mt-2 text-2xl font-bold">{stats.pending}</div>
        </div>
      </div>
      <div className="rounded-lg border bg-card overflow-hidden mt-4">
        <ShipmentMapWrapper
          shipments={list}
          focusedId={focusedId}
          height={360}
          route={focusedShipment?.shipmentDetails?.origin && focusedShipment?.shipmentDetails?.destination ? { origin: focusedShipment.shipmentDetails.origin, dest: focusedShipment.shipmentDetails.destination } : undefined}
        />
      </div>
      {focusedShipment ? (
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm mb-2">Tracking Progress</div>
          <TrackingProgress status={focusedShipment?.status} events={histories[focusedShipment.shipmentId]?.events} />
        </div>
      ) : null}
      <div className="rounded-lg border bg-card text-card-foreground overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Shipment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ETA</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="px-6 py-8" colSpan={6}>Loading…</td></tr>
              ) : list.length === 0 ? (
                <tr><td className="px-6 py-8" colSpan={6}>No shipments</td></tr>
              ) : (
                list.map((sh: any) => {
                  const tr = histories[sh.shipmentId]
                  const eta = tr?.estimatedDelivery ? new Date(tr.estimatedDelivery).toLocaleString() : '—'
                  return (
                    <React.Fragment key={sh._id}>
                      <tr className="hover:bg-muted/30">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
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
                                    <div className="text-sm">{tr?.carrier ?? '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-[11px] text-muted-foreground">Tracking #</div>
                                    <div className="text-sm">{tr?.trackingNumber ?? '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-[11px] text-muted-foreground">Service</div>
                                    <div className="text-sm">{tr?.service ?? '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-[11px] text-muted-foreground">ETA</div>
                                    <div className="text-sm">{eta}</div>
                                  </div>
                                  <div>
                                    <div className="text-[11px] text-muted-foreground">Current</div>
                                    <div className="text-sm">{`${tr?.currentLocation?.city ?? ''}${tr?.currentLocation?.country ? ', ' + tr?.currentLocation?.country : ''}`}</div>
                                  </div>
                                  <div>
                                    <div className="text-[11px] text-muted-foreground">Last Updated</div>
                                    <div className="text-sm">{tr?.lastUpdated ? new Date(tr.lastUpdated).toLocaleString() : '-'}</div>
                                  </div>
                                </section>
                                {tr?.events?.length ? (
                                  <div>
                                    <div className="mt-2 font-medium">Tracking History</div>
                                    <div className="divide-y rounded-md border">
                                      {tr.events.map((e: any, idx: number) => (
                                        <div key={idx} className="p-3 flex items-start justify-between gap-3">
                                          <div>
                                            <div className="font-medium capitalize">{e.status?.replace('_',' ')}</div>
                                            <div className="text-muted-foreground text-xs">{e.location}</div>
                                          </div>
                                          <div className="text-muted-foreground text-xs whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{sh.shipmentDetails?.origin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{sh.shipmentDetails?.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{sh.status?.replace('_',' ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{eta}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setFocusedId(sh.shipmentId); trackNow(sh.shipmentId) }}
                              disabled={trackingIdLoading === sh.shipmentId}
                              className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {trackingIdLoading === sh.shipmentId ? 'Updating…' : 'Refresh & Focus'}
                            </button>
                            <button
                              onClick={() => { setFocusedId(sh.shipmentId); ensureHistory(sh.shipmentId) }}
                              className="px-3 py-1.5 rounded-md border"
                            >
                              View History
                            </button>
                          </div>
                        </td>
                      </tr>
                      {histories[sh.shipmentId]?.events?.length ? (
                        <tr>
                          <td colSpan={6} className="px-6 pb-6">
                            <div className="mt-2 text-xs text-muted-foreground">Tracking History</div>
                            <div className="mt-2 space-y-2">
                              {histories[sh.shipmentId].events.map((e: any, i: number) => (
                                <div key={i} className="flex items-start justify-between text-sm">
                                  <div>
                                    <div className="font-medium capitalize">{e.status?.replace('_',' ')}</div>
                                    <div className="text-muted-foreground">{e.location}</div>
                                    <div className="text-muted-foreground text-xs">{e.description}</div>
                                  </div>
                                  <div className="text-muted-foreground text-xs whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
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

export default function UserShipmentsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading shipments…</div>}>
      <ShipmentsInner />
    </Suspense>
  )
}

