export default function UserCompliancePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Compliance</h1>
        <p className="text-muted-foreground">Manage KYC, document uploads, and trade compliance tasks.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Document Templates</h2>
          <p className="text-muted-foreground">Download templates for commonly required shipping documents:</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <a className="rounded-md border px-4 py-3 hover:bg-muted/50 flex items-center gap-2" href="/templates/commercial-invoice.pdf" download>
            <img src="/file.svg" alt="doc" className="size-4" />
            <span>Commercial Invoice</span>
          </a>
          <a className="rounded-md border px-4 py-3 hover:bg-muted/50 flex items-center gap-2" href="/templates/bill-of-lading.pdf" download>
            <img src="/file.svg" alt="doc" className="size-4" />
            <span>Bill of Lading</span>
          </a>
          <a className="rounded-md border px-4 py-3 hover:bg-muted/50 flex items-center gap-2" href="/templates/certificate-of-origin.pdf" download>
            <img src="/window.svg" alt="doc" className="size-4" />
            <span>Certificate of Origin</span>
          </a>
          <a className="rounded-md border px-4 py-3 hover:bg-muted/50 flex items-center gap-2" href="/templates/dangerous-goods-declaration.pdf" download>
            <span className="text-amber-600">⚠️</span>
            <span>Dangerous Goods</span>
          </a>
        </div>
      </div>
      <p>Coming soon: KYC/KYB checklist, sanctions screening results, and document expiry reminders.</p>
    </div>
  )
}