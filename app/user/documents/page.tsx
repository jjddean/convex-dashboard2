'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FileText, FileBadge, FileWarning } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerTrigger, DrawerDescription } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UserDocumentsPage() {
  const [type, setType] = useState<string>('all')
  const docs = useQuery(api.documents.listMyDocuments, { type: type === 'all' ? undefined : type })
  const isLoading = docs === undefined
  const list = docs ?? []
  const [sendOpen, setSendOpen] = useState(false)
  const [sendDoc, setSendDoc] = useState<any>(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [sending, setSending] = useState(false)
  // Document detail modal state
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  function openDocumentDetail(doc: any) {
    setSelectedDoc(doc)
    setDetailOpen(true)
  }

  async function sendForSignature() {
    if (!sendDoc) return
    setSending(true)
    try {
      console.log('Sending DocuSign envelope...', { documentId: sendDoc._id, documentType: sendDoc.type })
      
      const res = await fetch('/api/docusign/envelope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: sendDoc._id,
          recipientEmail,
          recipientName,
          documentType: sendDoc.type
        })
      })
      
      const data = await res.json()
      console.log('DocuSign response:', data)
      
      if (!res.ok) {
        const errorMsg = data.error || `Failed to send envelope (${res.status})`
        console.error('DocuSign error:', errorMsg, data)
        throw new Error(errorMsg)
      }
      
      setSendOpen(false)
      setRecipientEmail('')
      setRecipientName('')
      alert('✅ Envelope sent successfully!\nEnvelope ID: ' + data.envelopeId + '\n\nCheck the recipient\'s email for the signing link.')
    } catch (e: any) {
      console.error('Send for signature error:', e)
      alert('❌ Error sending envelope: ' + e.message)
    } finally {
      setSending(false)
    }
  }

  async function refreshStatus(doc: any) {
    if (!doc.docusign?.envelopeId) return
    try {
      const res = await fetch('/api/docusign/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc._id, envelopeId: doc.docusign.envelopeId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to refresh status')
      alert(`Status updated: ${data.envelopeStatus}`)
    } catch (e: any) {
      alert('Failed to refresh status: ' + e.message)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground">Create and manage Bills of Lading, AWBs, and Invoices.</p>
      </div>

      {/* Create Document */}
      <CreateDocumentDrawer />

      {/* Document Templates */}
      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Document Templates</h2>
          <p className="text-sm text-muted-foreground">Download templates for commonly required shipping documents:</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/templates/commercial-invoice.pdf" download>
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Commercial Invoice</span>
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/templates/bill-of-lading.pdf" download>
              <span className="inline-flex items-center gap-2">
                <FileBadge className="h-4 w-4" />
                <span>Bill of Lading</span>
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/templates/certificate-of-origin.pdf" download>
              <span className="inline-flex items-center gap-2">
                <FileBadge className="h-4 w-4" />
                <span>Certificate of Origin</span>
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/templates/dangerous-goods-declaration.pdf" download>
              <span className="inline-flex items-center gap-2">
                <FileWarning className="h-4 w-4" />
                <span>Dangerous Goods</span>
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex items-center gap-3">
          <label className="text-sm">Filter by type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-2 py-1 border rounded-md bg-background">
            <option value="all">All</option>
            <option value="bill_of_lading">Bill of Lading</option>
            <option value="air_waybill">Air Waybill</option>
            <option value="commercial_invoice">Commercial Invoice</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="px-6 py-8" colSpan={5}>Loading…</td></tr>
              ) : list.length === 0 ? (
                <tr><td className="px-6 py-8" colSpan={5}>No documents</td></tr>
              ) : (
                list.map((d: any) => (
                  <tr key={d._id} className="border-b last:border-0">
                    <td className="px-6 py-4">{d.type}</td>
                    <td className="px-6 py-4 font-medium">
                      <button
                        onClick={() => openDocumentDetail(d)}
                        className="text-primary underline hover:no-underline cursor-pointer"
                      >
                        {d.documentData.documentNumber}
                      </button>
                    </td>
                    <td className="px-6 py-4">{d.docusign?.status ? `${d.status} (${d.docusign.status})` : d.status}</td>
                    <td className="px-6 py-4">{new Date(d.documentData.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => { setSendDoc(d); setSendOpen(true); }}>
                          Send for e-signature
                        </Button>
                        {d.docusign?.envelopeId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => refreshStatus(d)}
                            title="Refresh DocuSign status"
                          >
                            Refresh status
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="min-w-[400px] sm:max-w-md p-0">
          <SheetHeader>
            <SheetTitle>Document {selectedDoc?.documentData?.documentNumber}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6 space-y-4">
            {selectedDoc && (
              <>
                {/* top summary */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div><strong>Type:</strong> {selectedDoc.type}</div>
                      <div><strong>Status:</strong> {selectedDoc.docusign?.status ? `${selectedDoc.status} (${selectedDoc.docusign.status})` : selectedDoc.status}</div>
                      <div><strong>Issue Date:</strong> {new Date(selectedDoc.documentData.issueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <Button onClick={() => { setSendDoc(selectedDoc); setSendOpen(true); setDetailOpen(false); }}>
                        Send for e-signature
                      </Button>
                    </div>
                  </div>
                  <div><strong>Shipper:</strong> {selectedDoc.documentData.parties.shipper.name}</div>
                  <div><strong>Consignee:</strong> {selectedDoc.documentData.parties.consignee.name}</div>
                  {selectedDoc.docusign?.envelopeId && (
                    <div className="pt-2">
                      <div><strong>Envelope ID:</strong> {selectedDoc.docusign.envelopeId}</div>
                      <div className="text-sm text-muted-foreground">Last updated: {selectedDoc.docusign.lastUpdated ? new Date(selectedDoc.docusign.lastUpdated).toLocaleString() : '—'}</div>
                    </div>
                  )}
                </div>

                {/* Cargo Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Cargo Details</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Description:</strong> {selectedDoc.documentData.cargoDetails.description}</div>
                    <div><strong>Weight:</strong> {selectedDoc.documentData.cargoDetails.weight}</div>
                    <div><strong>Dimensions:</strong> {selectedDoc.documentData.cargoDetails.dimensions}</div>
                    <div><strong>Value:</strong> {selectedDoc.documentData.cargoDetails.value}</div>
                  </div>
                </div>

                {/* Route Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Route Details</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Origin:</strong> {selectedDoc.documentData.routeDetails.origin}</div>
                    <div><strong>Destination:</strong> {selectedDoc.documentData.routeDetails.destination}</div>
                  </div>
                </div>

                {/* Terms */}
                {selectedDoc.documentData.terms && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Terms</h3>
                    <div className="text-sm">{selectedDoc.documentData.terms}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Send for e-signature drawer */}
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

function CreateDocumentDrawer() {
  const [open, setOpen] = useState(false)
  const [docType, setDocType] = useState<'bill_of_lading' | 'air_waybill' | 'commercial_invoice'>('bill_of_lading')
  const [documentNumber, setDocumentNumber] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [shipper, setShipper] = useState('')
  const [shipperAddress, setShipperAddress] = useState('')
  const [shipperContact, setShipperContact] = useState('')
  const [consignee, setConsignee] = useState('')
  const [consigneeAddress, setConsigneeAddress] = useState('')
  const [consigneeContact, setConsigneeContact] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [value, setValue] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [terms, setTerms] = useState('')
  const create = useMutation(api.documents.createDocument)
  const [submitting, setSubmitting] = useState(false)

  async function onCreate() {
    setSubmitting(true)
    try {
      const dims = dimensions.replace(/cm/gi, '').replace(/\s+/g, '').split(/[xX]/)
      await create({
        type: docType,
        documentData: {
          documentNumber,
          issueDate,
          parties: {
            shipper: { name: shipper, address: shipperAddress, contact: shipperContact },
            consignee: { name: consignee, address: consigneeAddress, contact: consigneeContact },
            carrier: undefined,
          },
          cargoDetails: {
            description,
            weight,
            dimensions: dimensions,
            value,
            hsCode: undefined,
          },
          routeDetails: {
            origin,
            destination,
            portOfLoading: undefined,
            portOfDischarge: undefined,
          },
          terms,
        },
        status: 'draft',
      })
      setOpen(false)
      // reset
      setDocumentNumber(''); setIssueDate(''); setShipper(''); setShipperAddress(''); setShipperContact('');
      setConsignee(''); setConsigneeAddress(''); setConsigneeContact(''); setDescription(''); setWeight(''); setDimensions(''); setValue(''); setOrigin(''); setDestination(''); setTerms('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create Document</Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-[720px]">
        <DrawerHeader>
          <DrawerTitle>Create Document</DrawerTitle>
          <DrawerDescription>Generate Bill of Lading, AWB, or Commercial Invoice</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">Type
              <select value={docType} onChange={(e) => setDocType(e.target.value as any)} className="mt-1 w-full px-2 py-1 border rounded-md bg-background">
                <option value="bill_of_lading">Bill of Lading</option>
                <option value="air_waybill">Air Waybill</option>
                <option value="commercial_invoice">Commercial Invoice</option>
              </select>
            </label>
            <label className="text-sm">Document Number
              <Input value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} placeholder="e.g. BL123456" />
            </label>
            <label className="text-sm">Issue Date
              <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </label>
            <label className="text-sm">Shipper
              <Input value={shipper} onChange={(e) => setShipper(e.target.value)} placeholder="Company name" />
            </label>
            <label className="text-sm">Shipper Address
              <Input value={shipperAddress} onChange={(e) => setShipperAddress(e.target.value)} placeholder="Full address" />
            </label>
            <label className="text-sm">Shipper Contact
              <Input value={shipperContact} onChange={(e) => setShipperContact(e.target.value)} placeholder="Phone/Email" />
            </label>
            <label className="text-sm">Consignee
              <Input value={consignee} onChange={(e) => setConsignee(e.target.value)} placeholder="Company name" />
            </label>
            <label className="text-sm">Consignee Address
              <Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} placeholder="Full address" />
            </label>
            <label className="text-sm">Consignee Contact
              <Input value={consigneeContact} onChange={(e) => setConsigneeContact(e.target.value)} placeholder="Phone/Email" />
            </label>
            <label className="text-sm">Description
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Goods description" />
            </label>
            <label className="text-sm">Weight
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="1000 kg" />
            </label>
            <label className="text-sm">Dimensions
              <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="e.g. 120x80x100 cm" />
            </label>
            <label className="text-sm">Value
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="$50,000" />
            </label>
            <label className="text-sm">Origin
              <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="City, Country" />
            </label>
            <label className="text-sm">Destination
              <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City, Country" />
            </label>
            <label className="text-sm col-span-1 md:col-span-2">Terms
              <Input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Incoterms, notes, etc." />
            </label>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={onCreate} disabled={submitting || !documentNumber || !issueDate || !shipper || !consignee}>Create</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}