import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Require auth
    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Disable this endpoint when mocks are off in production (encourage explicit UI flow)
    if (process.env.NODE_ENV === 'production' && process.env.FEATURE_USE_MOCKS !== 'true') {
      return NextResponse.json({ error: 'Disabled in production. Use UI: /user/quotes → Convert to Booking.' }, { status: 403 })
    }

    const result = await fetchMutation(
      api.quotes.createInstantQuoteAndBooking,
      { request: body },
      { token }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Instant quote+booking API error:', error)
    return NextResponse.json({ error: 'Failed to process instant quote and booking' }, { status: 500 })
  }
}