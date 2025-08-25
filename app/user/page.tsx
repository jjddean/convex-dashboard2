"use client";
import ChatBar from "@/components/assistant/chat-bar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ShipmentMapWrapper from "@/components/tracking/ShipmentMapWrapper";
import TrackingProgress from "@/components/tracking/TrackingProgress";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useRouter } from "next/navigation";

export default function UserHome() {
  const shipments = useQuery(api.shipments.listShipments, { onlyMine: true }) as any[] | undefined;
  const list = shipments ?? [];
  const active = list.filter((s: any) => s.status !== "delivered").length;
  const first = list[0] as any | undefined;
  const firstRoute = first?.shipmentDetails?.origin && first?.shipmentDetails?.destination
    ? { origin: first.shipmentDetails.origin, dest: first.shipmentDetails.destination }
    : undefined;
  const router = useRouter();
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-muted-foreground">Your shipments, payments, and compliance in one place.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Active Shipments</div>
          <div className="mt-2 text-2xl font-bold">{active ?? 0}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Outstanding Balance</div>
          <div className="mt-2 text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="text-sm text-muted-foreground">Compliance Tasks</div>
          <div className="mt-2 text-2xl font-bold">—</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card text-card-foreground p-4">
        <div className="mb-3 text-sm font-medium">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickQuoteDrawer onDone={() => router.push("/user/quotes")} />
          <Button variant="secondary" onClick={() => router.push("/user/shipments")}>Shipments</Button>
          <Button variant="secondary" onClick={() => router.push("/user/documents")}>Documents</Button>
          <Button variant="secondary" onClick={() => router.push("/user/payments")}>Payments</Button>
        </div>
      </div>

      {list.length > 0 ? (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="p-4">
            <div className="text-sm mb-2">In-Progress Shipment</div>
            <TrackingProgress status={first?.status} events={(first as any)?.events} />
          </div>
          <ShipmentMapWrapper shipments={list} height={300} route={firstRoute} />
        </div>
      ) : null}

      <ChatBar />
    </div>
  )
}

function QuickQuoteDrawer({ onDone }: { onDone?: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [weight, setWeight] = React.useState("")
  const [length, setLength] = React.useState("")
  const [width, setWidth] = React.useState("")
  const [height, setHeight] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  async function submit() {
    try {
      setSubmitting(true)
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          serviceType: 'ocean',
          cargoType: 'general',
          weight,
          dimensions: { length, width, height },
          value: '',
          incoterms: 'EXW',
          urgency: 'standard',
          additionalServices: [],
          contactInfo: { name: '', email: '', phone: '', company: '' },
        }),
      })
      if (!res.ok) throw new Error('Quote failed')
      setOpen(false)
      onDone?.()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Quick Quote</Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-[520px]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>Quick Quote</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="origin">Origin</Label>
            <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="City, Country" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City, Country" />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg" />
          </div>
          <div>
            <Label htmlFor="length">Length</Label>
            <Input id="length" value={length} onChange={(e) => setLength(e.target.value)} placeholder="cm" />
          </div>
          <div>
            <Label htmlFor="width">Width</Label>
            <Input id="width" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="cm" />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="cm" />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={submit} disabled={submitting}>{submitting ? 'Submitting…' : 'Create Quote'}</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}