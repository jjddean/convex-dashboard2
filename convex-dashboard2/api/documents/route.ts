import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/convex/_generated/api'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined

    const docId = await fetchMutation(
      api.documents.createDocument,
      {
        type: body.type,
        bookingId: body.bookingId,
        shipmentId: body.shipmentId,
        documentData: body.documentData,
        status: body.status,
      },
      { token }
    )

    return NextResponse.json({ success: true, documentId: docId })
  } catch (error) {
    console.error('Documents API error:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || undefined
    const bookingId = searchParams.get('bookingId') || undefined
    const shipmentId = searchParams.get('shipmentId') || undefined

    const { getToken } = await auth()
    const token = (await getToken({ template: 'convex' })) ?? undefined

    const docs = await fetchQuery(
      api.documents.listMyDocuments,
      { type: type ?? undefined, bookingId: bookingId ?? undefined, shipmentId: shipmentId ?? undefined },
      { token }
    )

    return NextResponse.json({ documents: docs })
  } catch (error) {
    console.error('Documents API error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}