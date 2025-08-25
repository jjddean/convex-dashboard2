import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Disabled in production' }, { status: 403 })
    }
    console.log('DocuSign Debug - Starting auth check...')
    
    // Check if we have auth
    const { getToken } = await auth()
    const token = await getToken({ template: 'convex' })
    
    console.log('DocuSign Debug - Token received:', !!token)
    
    if (!token) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'No Convex token available',
        authStatus: 'failed'
      }, { status: 401 })
    }

    // Check environment variables
    const requiredEnvs = [
      'DOCUSIGN_OAUTH_BASE_URL',
      'DOCUSIGN_PRIVATE_KEY',
      'DOCUSIGN_INTEGRATION_KEY',
      'DOCUSIGN_USER_ID',
      'DOCUSIGN_BASE_PATH',
      'DOCUSIGN_ACCOUNT_ID'
    ]

    const envStatus: Record<string, boolean> = {}
    const missingEnvs: string[] = []

    for (const env of requiredEnvs) {
      const value = process.env[env]
      envStatus[env] = !!value
      if (!value) {
        missingEnvs.push(env)
      }
    }

    console.log('DocuSign Debug - Environment check:', envStatus)

    return NextResponse.json({
      success: true,
      authStatus: 'authenticated',
      tokenExists: !!token,
      environment: envStatus,
      missingEnvironmentVariables: missingEnvs,
      docusignReady: missingEnvs.length === 0
    })

  } catch (error: any) {
    console.error('DocuSign Debug Error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error.message 
    }, { status: 500 })
  }
}