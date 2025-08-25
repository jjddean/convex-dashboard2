import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

// Lazy import DocuSign CJS entry to avoid bundling in edge
function loadDocusign(): {
  ApiClient: any
  EnvelopesApi: any
} {
  const req = (eval('require') as any)
  const ApiClient = req('docusign-esign/src/ApiClient')
  const EnvelopesApi = req('docusign-esign/src/api/EnvelopesApi')
  return { ApiClient, EnvelopesApi }
}

async function getJwtToken() {
  const { ApiClient } = loadDocusign()
  const dsApiClient = new ApiClient()
  dsApiClient.setOAuthBasePath(process.env.DOCUSIGN_OAUTH_BASE_URL!.replace('https://', ''))
  const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY!.replace(/\n/g, '\n'))
  const results: any = await dsApiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY!,
    process.env.DOCUSIGN_USER_ID!,
    ['signature', 'impersonation'],
    privateKey,
    3600
  )
  return results.body.access_token as string
}

export async function POST(request: NextRequest) {
  try {
    const { getToken } = await auth()
    const token = await getToken({ template: 'convex' })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentId, envelopeId } = await request.json()

    const accessToken = await getJwtToken()
    const { ApiClient, EnvelopesApi } = loadDocusign()

    const apiClient = new ApiClient()
    apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!)
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken)

    const envelopesApi = new EnvelopesApi(apiClient)

    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!
    const envelope = await envelopesApi.getEnvelope(accountId, envelopeId)
    const recipients = await envelopesApi.listRecipients(accountId, envelopeId)

    await fetchMutation(
      api.documents.setDocusignEnvelope,
      {
        documentId,
        envelopeId,
        status: envelope.status!,
        recipients: recipients.signers?.map((signer: any) => ({
          email: signer.email,
          name: signer.name,
          role: signer.roleName,
          recipientId: signer.recipientId,
          status: signer.status,
        })) || [],
      },
      { token }
    )

    return NextResponse.json({
      success: true,
      envelopeStatus: envelope.status,
      recipients: recipients.signers?.map((s: any) => ({ email: s.email, name: s.name, status: s.status })) || [],
    })
  } catch (error) {
    console.error('DocuSign status check error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}

