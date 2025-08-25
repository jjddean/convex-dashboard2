import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getRatesFromReachShip } from '@/lib/reachship'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Shape expected from client: { origin, destination, parcel: { weight, length, width, height }, serviceType? }
    if (!body?.origin || !body?.destination || !body?.parcel) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Simulate slight latency for UI loading states
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 150))

    // Gate with auth for provider usage
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await getRatesFromReachShip({
      origin: body.origin,
      destination: body.destination,
      parcel: body.parcel,
      serviceType: body.serviceType,
    })

    return NextResponse.json({
      requestId: result.requestId,
      status: result.status,
      rates: result.rates.map(r => ({
        carrier: r.carrierName,
        service: r.service,
        transitTime: r.transitTime,
        rate: { amount: r.amount, currency: r.currency },
        deliveryDate: r.deliveryDate,
      })),
      origin: body.origin,
      destination: body.destination,
      parcel: body.parcel,
      timestamp: new Date().toISOString(),
      disclaimer: 'Rates are estimates and may vary based on actual package dimensions and delivery requirements.'
    })
  } catch (error) {
    console.error('Rates API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve shipping rates' },
      { status: 500 }
    )
  }
}