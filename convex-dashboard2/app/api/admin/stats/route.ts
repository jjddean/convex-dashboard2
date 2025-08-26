import { NextResponse, NextRequest } from 'next/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { auth } from '@clerk/nextjs/server'

function isAllowlistedAdmin(claims: any): boolean {
  const allowlist = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (allowlist.length === 0) return false
  const emails = new Set<string>()
  if (typeof claims?.email === 'string') emails.add(claims.email.toLowerCase())
  if (typeof claims?.email_address === 'string') emails.add(claims.email_address.toLowerCase())
  if (Array.isArray(claims?.email_addresses)) {
    for (const e of claims.email_addresses) {
      if (typeof e === 'string') emails.add(e.toLowerCase())
      else if (typeof e?.email_address === 'string') emails.add(e.email_address.toLowerCase())
    }
  }
  return Array.from(emails).some((e) => allowlist.includes(e))
}

export async function GET(request: NextRequest) {
  try {
    const { sessionClaims, getToken } = await auth()
    const claims: any = sessionClaims
    const role = claims?.publicMetadata?.role || claims?.metadata?.role
    const adminOk = role === 'admin' || isAllowlistedAdmin(claims)
    if (!adminOk) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const token = (await getToken({ template: 'convex' })) ?? undefined

    const [quotes, bookings, shipments] = await Promise.all([
      fetchQuery(api.quotes.listQuotes, {}, { token }).catch(() => [] as any[]),
      fetchQuery(api.bookings.listBookings, {}, { token }).catch(() => [] as any[]),
      fetchQuery(api.shipments.listShipments, {}, { token }).catch(() => [] as any[]),
    ])

    const stats = {
      totals: { quotes: quotes.length, bookings: bookings.length, shipments: shipments.length },
    }

    return NextResponse.json(stats)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 })
  }
}

