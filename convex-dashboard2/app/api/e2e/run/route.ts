import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const req = body.request || body || {}

    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined

    // 1) Create instant quote and booking in one go
    const result: any = await fetchMutation(
      api.quotes.createInstantQuoteAndBooking,
      { request: req },
      { token }
    )

    const quoteId: string = result?.quoteId
    const bookingId: string | undefined = result?.booking?.bookingId

    // 2) Load the quote to pick the best carrier
    let best: any = null
    if (quoteId) {
      const quoteDoc: any = await fetchQuery(
        api.quotes.getQuote,
        { quoteId },
        { token }
      )
      if (quoteDoc?.quotes?.length) {
        best = quoteDoc.quotes.reduce((min: any, q: any) => (
          (q?.price?.amount ?? Infinity) < (min?.price?.amount ?? Infinity) ? q : min
        ), quoteDoc.quotes[0])
      }
    }

    // 3) Upsert a shipment linked to the booking
    const shipmentId = bookingId || `SHP-${Date.now()}`
    const tracking = {
      status: 'pending',
      currentLocation: {
        city: req.origin || 'Origin',
        state: '',
        country: '',
        coordinates: { lat: 0, lng: 0 },
      },
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: best?.carrierName || best?.carrierId || 'Carrier',
      trackingNumber: `TBA-${shipmentId}`,
      service: best?.serviceType || req.serviceType || 'standard',
      shipmentDetails: {
        weight: String(req.weight ?? ''),
        dimensions: `${req?.dimensions?.length ?? ''}x${req?.dimensions?.width ?? ''}x${req?.dimensions?.height ?? ''}`,
        origin: String(req.origin ?? ''),
        destination: String(req.destination ?? ''),
        value: String(req.value ?? ''),
      },
      events: [
        {
          timestamp: new Date().toISOString(),
          status: 'Shipment created',
          location: String(req.origin ?? 'Origin'),
          description: `Booking ${shipmentId} created` ,
        },
      ],
    }

    const shipmentDocId = await fetchMutation(
      api.shipments.upsertShipment,
      { shipmentId, tracking } as any,
      { token }
    )

    return NextResponse.json({ ok: true, quoteId, bookingId, shipmentId, shipmentDocId })
  } catch (error) {
    console.error('E2E run error:', error)
    return NextResponse.json({ error: 'E2E failed' }, { status: 500 })
  }
}


