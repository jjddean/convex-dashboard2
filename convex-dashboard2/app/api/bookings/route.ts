import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/convex/_generated/api'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined

    const result = await fetchMutation(
      api.bookings.createBooking,
      {
        quoteId: body.quoteId,
        carrierQuoteId: body.carrierQuoteId,
        customerDetails: body.customerDetails,
        pickupDetails: body.pickupDetails,
        deliveryDetails: body.deliveryDetails,
        specialInstructions: body.specialInstructions,
      },
      { token }
    )

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || undefined

    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined

    const bookings = await fetchQuery(
      api.bookings.listMyBookings,
      {},
      { token }
    )

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}