import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/convex/_generated/api'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const useMocks = process.env.FEATURE_USE_MOCKS === 'true'
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 150))
    const mockTracking = {
      shipmentId: id,
      status: 'in_transit',
      currentLocation: {
        city: 'Chicago',
        state: 'IL',
        country: 'US',
        coordinates: {
          lat: 41.8781,
          lng: -87.6298
        }
      },
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'FedEx',
      trackingNumber: 'FX123456789012',
      service: 'FedEx Express',
      events: [
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'picked_up',
          location: 'New York, NY, US',
          description: 'Package picked up'
        },
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          location: 'Philadelphia, PA, US',
          description: 'In transit to destination'
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          location: 'Chicago, IL, US',
          description: 'Arrived at sorting facility'
        },
        {
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          location: 'Chicago, IL, US',
          description: 'Out for delivery'
        }
      ],
      shipmentDetails: {
        weight: '5.2 lbs',
        dimensions: '12" x 8" x 6"',
        origin: 'New York, NY',
        destination: 'Los Angeles, CA',
        value: '$250.00'
      },
      lastUpdated: new Date().toISOString()
    }
    if (useMocks) {
      try {
        const { getToken } = await auth()
        const token = (await getToken({ template: 'convex' })) ?? undefined
        await fetchMutation(
          api.shipments.upsertShipment,
          { shipmentId: id, tracking: mockTracking as any },
          { token }
        )
        const data = await fetchQuery(
          api.shipments.getShipment,
          { shipmentId: id },
          { token }
        )
        return NextResponse.json(data ?? mockTracking)
      } catch (e) {
        console.error('Mock upsert failed, returning mock only:', e)
        return NextResponse.json(mockTracking)
      }
    }
    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined
    const data = await fetchQuery(
      api.shipments.getShipment,
      { shipmentId: id },
      { token }
    )

    // In development, if not found, seed and return mock once for convenience
    if (!data && process.env.NODE_ENV !== 'production') {
      try {
        await fetchMutation(
          api.shipments.upsertShipment,
          { shipmentId: id, tracking: mockTracking as any },
          { token }
        )
        const seeded = await fetchQuery(
          api.shipments.getShipment,
          { shipmentId: id },
          { token }
        )
        return NextResponse.json(seeded ?? mockTracking)
      } catch (e) {
        console.warn('Dev seed failed, returning mock only:', e)
        return NextResponse.json(mockTracking)
      }
    }

    return NextResponse.json(data ?? { error: 'Not found' })
  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve tracking information' },
      { status: 500 }
    )
  }
}