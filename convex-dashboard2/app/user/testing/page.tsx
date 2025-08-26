'use client'

import { useState } from 'react'

export default function ServiceTestingPage() {
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [loadingDocument, setLoadingDocument] = useState(false)
  const [loadingTracking, setLoadingTracking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function triggerInstantQuoteBooking() {
    setLoadingQuote(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/instant-quote-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'London, UK',
          destination: 'Hamburg, DE',
          serviceType: 'air',
          cargoType: 'general',
          weight: '120 kg',
          dimensions: { length: '120', width: '80', height: '100' },
          value: '£5000',
          incoterms: 'DAP',
          urgency: 'standard',
          additionalServices: ['insurance'],
          contactInfo: { name: 'Jane Doe', email: 'jane@example.com', phone: '+44 20 1234 5678', company: 'ACME Ltd' },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Request failed')
      setResult(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoadingQuote(false)
    }
  }

  async function createMockDocument() {
    setLoadingDocument(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bill_of_lading',
          documentData: {
            documentNumber: 'BOL-' + Date.now(),
            issueDate: new Date().toISOString(),
            parties: {
              shipper: { name: 'ACME Ltd', address: '1 High St, London', contact: 'Jane Doe' },
              consignee: { name: 'Global GmbH', address: '2 Main Str, Hamburg', contact: 'Hans Müller' },
              carrier: { name: 'DHL', address: 'Bonn, DE', contact: 'Support' },
            },
            cargoDetails: {
              description: 'Electronics',
              weight: '120 kg',
              dimensions: '120x80x100 cm',
              value: '£5000',
            },
            routeDetails: {
              origin: 'London, UK',
              destination: 'Hamburg, DE',
              portOfLoading: 'LHR',
              portOfDischarge: 'HAM',
            },
            terms: 'FOB',
          },
          status: 'issued',
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Request failed')
      setResult(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoadingDocument(false)
    }
  }

  async function simulateTrackingUpdate() {
    setLoadingTracking(true)
    setError(null)
    setResult(null)
    try {
      const shipmentId = 'SH-' + Date.now()
      const res = await fetch(`/api/shipments/${shipmentId}/tracking`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Request failed')
      setResult(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoadingTracking(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Service Testing</h1>
        <p className="text-muted-foreground">Run end-to-end tests for Quotes & Bookings, Digital Docs, and Real-Time Tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground p-6 space-y-3">
          <h2 className="font-semibold">Quote & Booking</h2>
          <p className="text-sm text-muted-foreground">Instant quote for UK lanes and auto-book.</p>
          <button onClick={triggerInstantQuoteBooking} disabled={loadingQuote} className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">
            {loadingQuote ? 'Running…' : 'Run Instant Quote + Booking'}
          </button>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6 space-y-3">
          <h2 className="font-semibold">Digital Documentation</h2>
          <p className="text-sm text-muted-foreground">Create a Bill of Lading with sample data.</p>
          <button onClick={createMockDocument} disabled={loadingDocument} className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">
            {loadingDocument ? 'Running…' : 'Create Document'}
          </button>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6 space-y-3">
          <h2 className="font-semibold">Real-Time Tracking</h2>
          <p className="text-sm text-muted-foreground">Simulate live carrier tracking update.</p>
          <button onClick={simulateTrackingUpdate} disabled={loadingTracking} className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">
            {loadingTracking ? 'Running…' : 'Simulate Tracking'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <h3 className="font-semibold mb-2">Result</h3>
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : result ? (
          <pre className="text-sm whitespace-pre-wrap break-all">{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <div className="text-muted-foreground">Run a test to see results here.</div>
        )}
      </div>
    </div>
  )
}