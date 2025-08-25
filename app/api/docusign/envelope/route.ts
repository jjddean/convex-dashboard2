// Module scope (imports at top of file)
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { api } from '@/convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

// Dynamically load DocuSign CommonJS modules only (bypass AMD/UMD entry)
function loadDocusign(): {
  ApiClient: any
  EnvelopesApi: any
  Document: any
  Signer: any
  Tabs: any
  SignHere: any
  Recipients: any
  EnvelopeDefinition: any
} {
  // Use eval to avoid Webpack static analysis and force Node to load CJS at runtime
  const req = (eval('require') as any)
  const ApiClient = req('docusign-esign/src/ApiClient')
  const EnvelopesApi = req('docusign-esign/src/api/EnvelopesApi')
  const Document = req('docusign-esign/src/model/Document')
  const Signer = req('docusign-esign/src/model/Signer')
  const Tabs = req('docusign-esign/src/model/Tabs')
  const SignHere = req('docusign-esign/src/model/SignHere')
  const Recipients = req('docusign-esign/src/model/Recipients')
  const EnvelopeDefinition = req('docusign-esign/src/model/EnvelopeDefinition')

  return {
    ApiClient,
    EnvelopesApi,
    Document,
    Signer,
    Tabs,
    SignHere,
    Recipients,
    EnvelopeDefinition,
  }
}

async function getJwtToken() {
  const docusign = loadDocusign()
  const dsApiClient = new docusign.ApiClient()
  dsApiClient.setOAuthBasePath(process.env.DOCUSIGN_OAUTH_BASE_URL!.replace('https://', ''))

  const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY!.replace(/\\n/g, '\n'))

  const results = await dsApiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY!,
    process.env.DOCUSIGN_USER_ID!,
    ['signature', 'impersonation'],
    privateKey,
    3600
  ) as any

  const accessToken = results.body.access_token
  const expiresIn = results.body.expires_in
  return { accessToken, expiresIn }
}

export async function GET() {
  try {
    const docusign = loadDocusign()
    const apiClient = new docusign.ApiClient()
    apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!)
    return NextResponse.json({ message: 'Success' })
  } catch (error) {
    console.error('DocuSign envelope GET test error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getToken } = await auth()
    const token = await getToken({ template: 'convex' })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { documentId, recipientEmail, recipientName, documentType, recipients } = body

    const { accessToken } = await getJwtToken()

    const basePath = process.env.DOCUSIGN_BASE_PATH!
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!

    const docusign = loadDocusign()
    const apiClient = new docusign.ApiClient()
    apiClient.setBasePath(basePath)
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken)

    const envelopesApi = new docusign.EnvelopesApi(apiClient)

    // Load a PDF from public/templates based on documentType
    const fileMap: Record<string, string> = {
      bill_of_lading: 'bill-of-lading.pdf',
      air_waybill: 'bill-of-lading.pdf',
      commercial_invoice: 'commercial-invoice.pdf',
      certificate_of_origin: 'certificate-of-origin.pdf',
      dangerous_goods_declaration: 'dangerous-goods-declaration.pdf',
    }

    const filename = fileMap[documentType] || 'commercial-invoice.pdf'
    const filePath = path.join(process.cwd(), 'public', 'templates', filename)
    const fileBytes = await readFile(filePath)

    // Construct document and recipient
    const doc = new docusign.Document()
    doc.documentBase64 = fileBytes.toString('base64')
    doc.name = filename
    doc.fileExtension = 'pdf'
    doc.documentId = '1'

    // Build recipients list (admin + user defaults if none provided)
    const inputRecipients: Array<{ email: string; name?: string }> = Array.isArray(recipients)
      ? recipients
      : [
          recipientEmail && recipientName ? { email: recipientEmail, name: recipientName } : null,
          { email: 'jkdproductivity@gmail.com', name: 'Admin' },
          { email: 'info@1marketlive.online', name: 'Customer' },
        ].filter(Boolean) as any

    // Deduplicate by email (case-insensitive)
    const seen = new Set<string>()
    const normalized = inputRecipients.filter(r => {
      const e = r.email?.toLowerCase()
      if (!e || seen.has(e)) return false
      seen.add(e)
      return true
    })

    // Place a SignHere tab at specific coordinates on page 1 (for first signer)
    const signHere = new docusign.SignHere()
    ;(signHere as any).documentId = '1'
    ;(signHere as any).pageNumber = '1'
    ;(signHere as any).xPosition = '100'
    ;(signHere as any).yPosition = '150'

    const tabs = new docusign.Tabs()
    tabs.signHereTabs = [signHere]

    // Create DocuSign signers
    const signers = normalized.map((r, i) => {
      const s = new docusign.Signer()
      s.email = r.email
      s.name = r.name || r.email
      s.recipientId = String(i + 1)
      s.routingOrder = String(i + 1)
      if (i === 0) s.tabs = tabs
      return s
    })

    const dsRecipients = new docusign.Recipients()
    dsRecipients.signers = signers

    const envelopeDefinition = new docusign.EnvelopeDefinition()
    envelopeDefinition.emailSubject = 'Please sign this document'
    envelopeDefinition.documents = [doc]
    envelopeDefinition.recipients = dsRecipients
    envelopeDefinition.status = 'sent'

    const results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition })

    await fetchMutation(
      api.documents.setDocusignEnvelope,
      {
        documentId,
        envelopeId: results.envelopeId,
        status: results.status,
        recipients: normalized.map(r => ({ email: r.email, name: r.name || r.email })),
      },
      { token }
    )

    return NextResponse.json({ success: true, envelopeId: results.envelopeId, status: results.status })
  } catch (error: any) {
    const dsErrorText = error?.response?.text
    const dsErrorBody = (() => { try { return dsErrorText ? JSON.parse(dsErrorText) : null } catch { return dsErrorText } })()
    console.error('DocuSign send envelope error:', dsErrorBody || error)

    // Surface meaningful error info to the client
    const message = dsErrorBody?.error_description || dsErrorBody?.message || error?.message || 'Failed to send envelope'
    return NextResponse.json({ error: message, details: dsErrorBody || null }, { status: 500 })
  }
}