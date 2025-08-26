"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { HeroHeader } from "./header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Sparkle, Ship, Plane, Truck, Package, MapPin, CheckCircle, Search } from "lucide-react"

export default function HeroSection() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [form, setForm] = React.useState({
    origin: "",
    destination: "",
    serviceType: "ocean",
    urgency: "standard",
    name: "",
    email: "",
    phone: "",
  })
  const [tracking, setTracking] = React.useState("")

  async function onSubmitQuote() {
    try {
      // Minimal payload matching Convex validation shape
      const payload = {
        origin: form.origin || "",
        destination: form.destination || "",
        serviceType: form.serviceType || "ocean",
        cargoType: "general",
        weight: "1",
        dimensions: { length: "1", width: "1", height: "1" },
        value: "0",
        incoterms: "EXW",
        urgency: form.urgency || "standard",
        additionalServices: [],
        contactInfo: {
          name: form.name || "",
          email: form.email || "",
          phone: form.phone || "",
          company: "",
        },
      }

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to create quote")
      }
      toast.success("Quote created")
      setOpen(false)
      router.push("/user/quotes")
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || "Failed to create quote")
    }
  }

  function goTrack() {
    if (!tracking.trim()) return toast.error("Enter a tracking number")
    router.push(`/user/shipments?track=${encodeURIComponent(tracking.trim())}`)
  }

  return (
    <div>
      <HeroHeader />
      <main>
        <section>
          <div className="py-20 md:py-36">
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
              <div>
                <Link
                  href="#"
                  className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150"
                >
                  <div
                    aria-hidden
                    className="border-background bg-gradient-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
                  >
                    <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25" />
                    <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25" />
                    <Sparkle className="size-3 fill-background stroke-background drop-shadow" />
                  </div>
                  <span className="font-medium">Introducing AI Agents</span>
                </Link>
                <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                  Streamlined global logistics with intelligent quotes, digital documentation, and real-time tracking.
                </h1>
                <p className="text-muted-foreground mx-auto my-6 max-w-xl text-balance text-xl">
                  Get carrier-matched pricing instantly, generate compliant docs, and track every milestone in one place.
                </p>

                <div className="flex items-center justify-center gap-3 flex-col sm:flex-row">
                  <Button onClick={() => setOpen(true)} size="lg">
                    <span className="text-nowrap">Get Instant Quote</span>
                  </Button>
                  <div className="flex items-center gap-2 bg-background/70 backdrop-blur-md border rounded-full px-2 py-1">
                    <Input
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      placeholder="Enter tracking number..."
                      className="border-0 bg-transparent focus-visible:ring-0 w-56"
                    />
                    <Button variant="secondary" size="sm" onClick={goTrack}>
                      <Search className="mr-1 h-4 w-4" /> Track
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 mx-auto max-w-5xl px-6">
                <div className="mt-12 md:mt-16">
                  <div className="bg-background rounded-lg relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                    <Image
                      src="/hero-section-main-app-dark.png"
                      alt="app screen"
                      width={2880}
                      height={1842}
                      priority
                    />
                    <div className="pointer-events-none absolute inset-0 z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quote Wizard */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="center" className="w-full max-w-2xl p-0">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Package className="size-5" /> Request Freight Quote
            </SheetTitle>
            <SheetDescription>
              Answer a few questions and get matched with the best carriers.
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 md:px-6 pb-6">
            {/* Stepper */}
            <div className="mt-2">
              <div className="bg-muted h-2 w-full rounded-full">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Route</span>
                <span>Details</span>
                <span>Contact</span>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2 auto-rows-fr">
                  <div className="grid gap-2 h-full">
                    <Label htmlFor="origin" className="flex items-center gap-2">
                      <MapPin className="size-4" /> Origin
                    </Label>
                    <Input
                      id="origin"
                      placeholder="e.g. London, UK"
                      value={form.origin}
                      onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2 h-full">
                    <Label htmlFor="destination" className="flex items-center gap-2">
                      <MapPin className="size-4" /> Destination
                    </Label>
                    <Input
                      id="destination"
                      placeholder="e.g. Hamburg, DE"
                      value={form.destination}
                      onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2 h-full">
                    <Label className="flex items-center gap-2">
                      <Package className="size-4" /> Service
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        className="w-full justify-center"
                        variant={form.serviceType === "ocean" ? "default" : "outline"}
                        onClick={() => setForm((f) => ({ ...f, serviceType: "ocean" }))}
                      >
                        <Ship className="mr-2 size-4" /> Ocean
                      </Button>
                      <Button
                        className="w-full justify-center"
                        variant={form.serviceType === "air" ? "default" : "outline"}
                        onClick={() => setForm((f) => ({ ...f, serviceType: "air" }))}
                      >
                        <Plane className="mr-2 size-4" /> Air
                      </Button>
                      <Button
                        className="w-full justify-center"
                        variant={form.serviceType === "road" ? "default" : "outline"}
                        onClick={() => setForm((f) => ({ ...f, serviceType: "road" }))}
                      >
                        <Truck className="mr-2 size-4" /> Road
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2 h-full">
                    <Label>Urgency</Label>
                    <ToggleGroup
                      type="single"
                      value={form.urgency}
                      onValueChange={(v) => v && setForm((f) => ({ ...f, urgency: v }))}
                      className="grid grid-cols-3 gap-2"
                    >
                      <ToggleGroupItem value="standard" className="w-full justify-center">
                        Standard
                      </ToggleGroupItem>
                      <ToggleGroupItem value="express" className="w-full justify-center">
                        Express
                      </ToggleGroupItem>
                      <ToggleGroupItem value="urgent" className="w-full justify-center">
                        Urgent
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        Contact Name
                      </Label>
                      <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        Email
                      </Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      Phone
                    </Label>
                    <Input id="phone" type="tel" placeholder="+44 1234 567890" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="size-4 text-primary" /> Summary
                    </CardTitle>
                    <CardDescription>Review before submitting</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm grid gap-2">
                    <div className="flex items-center justify-between">
                      <span>Route</span>
                      <span className="text-muted-foreground">
                        {form.origin || "—"} → {form.destination || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Service</span>
                      <span className="text-muted-foreground">{form.serviceType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Urgency</span>
                      <span className="text-muted-foreground">{form.urgency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Contact</span>
                      <span className="text-muted-foreground">
                        {form.name || "—"} • {form.email || "—"} • {form.phone || "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between">
                <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</Button>
                ) : (
                  <Button onClick={onSubmitQuote}>Submit</Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

