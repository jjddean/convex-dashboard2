"use client"

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerDescription } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>()
  const doc = useQuery(api.documents.getDocument, { documentId: params.id as any })

  const [sendOpen, setSendOpen] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [sending, setSending] = useState(false)

  async function sendForSignature() {
    if (!doc) return
    setSending(true)
    try {
      const res = await fetch('/api/docusign/envelope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: (doc as any)._id,
          recipientEmail,
          recipientName,
          documentType: (doc as any).type,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Failed to send envelope (${res.status})`)
      setSendOpen(false)
      setRecipientEmail('')
      setRecipientName('')
      alert('✅ Envelope sent successfully!\nEnvelope ID: ' + data.envelopeId)
    } catch (e: any) {
      alert('❌ Error sending envelope: ' + e.message)
    } finally {
      setSending(false)
    }
  }

  async function refreshStatus() {
    if (!doc || !(doc as any).docusign?.envelopeId) return
    try {
      const res = await fetch('/api/docusign/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: (doc as any)._id, envelopeId: (doc as any).docusign.envelopeId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to refresh status')
      alert(`Status updated: ${data.envelopeStatus}`)
    } catch (e: any) {
      alert('Failed to refresh status: ' + e.message)
    }
  }

  if (doc === undefined) return <div className="p-6">Loading…</div>
  if (!doc) return <div className="p-6">Not found</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Document {doc.documentData.documentNumber}</h1>
        <div className="flex items-center gap-2">
          {(doc as any).docusign?.envelopeId && (
            <Button variant="outline" onClick={refreshStatus}>Refresh status</Button>
          )}
          <Button asChild variant="outline">
            <Link href="/user/documents">Back to Documents</Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div><strong>Type:</strong> {doc.type}</div>
            <div><strong>Status:</strong> {doc.docusign?.status ? `${doc.status} (${doc.docusign.status})` : doc.status}</div>
            <div><strong>Issue Date:</strong> {new Date(doc.documentData.issueDate).toLocaleDateString()}</div>
          </div>
          <div>
            <Button onClick={() => setSendOpen(true)}>Send for e-signature</Button>
          </div>
        </div>
        <div><strong>Shipper:</strong> {doc.documentData.parties.shipper.name}</div>
        <div><strong>Consignee:</strong> {doc.documentData.parties.consignee.name}</div>
        {doc.docusign?.envelopeId && (
          <div className="pt-2">
            <div><strong>Envelope ID:</strong> {doc.docusign.envelopeId}</div>
            <div className="text-sm text-muted-foreground">Last updated: {doc.docusign.lastUpdated ? new Date(doc.docusign.lastUpdated).toLocaleString() : '—'}</div>
          </div>
        )}
      </div>

      <Drawer open={sendOpen} onOpenChange={setSendOpen}>
        <DrawerContent className="max-w-[480px]">
          <DrawerHeader>
            <DrawerTitle>Send for e‑signature</DrawerTitle>
            <DrawerDescription>Enter the signer details for this document.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-3">
            <Label>Recipient name</Label>
            <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Full name" />
            <Label>Recipient email</Label>
            <Input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <DrawerFooter>
            <Button onClick={sendForSignature} disabled={sending || !recipientEmail || !recipientName}>Send</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}