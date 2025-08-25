import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'
import { getRatesFromReachShip } from '@/lib/reachship'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Require auth
    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Hard-disable mocks in production
    if (process.env.NODE_ENV === 'production' && process.env.FEATURE_USE_MOCKS === 'true') {
      return NextResponse.json({ error: 'Mocks are disabled in production' }, { status: 503 })
    }

    // Use ReachShip-backed rates with safe fallback to mocks
    try {
      const rateResult = await getRatesFromReachShip({
        origin: body.origin,
        destination: body.destination,
        parcel: body.dimensions && body.weight
          ? {
              length: Number(body.dimensions?.length ?? 0),
              width: Number(body.dimensions?.width ?? 0),
              height: Number(body.dimensions?.height ?? 0),
              weight: Number(body.weight ?? 0),
            }
          : body.parcel,
        serviceType: body.serviceType,
      })

      const normalizedQuotes = rateResult.rates.map(r => ({
        carrierId: r.carrierId,
        carrierName: r.carrierName,
        serviceType: body.serviceType ?? r.service,
        transitTime: r.transitTime,
        price: {
          amount: r.amount,
          currency: r.currency,
          breakdown: { baseRate: r.amount, fuelSurcharge: 0, securityFee: 0, documentation: 0 },
        },
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }))

      const quotePayload = {
        quoteId: `QT-${Date.now()}`,
        status: rateResult.status,
        quotes: normalizedQuotes,
        requestDetails: {
          origin: body.origin,
          destination: body.destination,
          cargoType: body.cargoType,
          weight: body.weight,
          dimensions: body.dimensions,
          value: body.value,
          incoterms: body.incoterms,
          urgency: body.urgency,
          additionalServices: body.additionalServices,
          contactInfo: body.contactInfo,
        },
        timestamp: new Date().toISOString(),
      }

      const docId = await fetchMutation(
        api.quotes.createQuote,
        {
          request: {
            origin: body.origin,
            destination: body.destination,
            serviceType: body.serviceType,
            cargoType: body.cargoType,
            weight: body.weight,
            dimensions: body.dimensions,
            value: body.value,
            incoterms: body.incoterms,
            urgency: body.urgency,
            additionalServices: body.additionalServices || [],
            contactInfo: body.contactInfo,
          },
          response: {
            quoteId: quotePayload.quoteId,
            status: quotePayload.status,
            quotes: quotePayload.quotes,
          },
        },
        { token }
      )

      return NextResponse.json({ ...quotePayload, convexId: docId })
    } catch (e) {
      console.error('Quote API - live rates failed:', e)
      return NextResponse.json(
        { error: 'Failed to retrieve live rates' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    )
  }
}