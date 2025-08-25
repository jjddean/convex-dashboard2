import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin-dashboard(.*)'])
const isUserRoute = createRouteMatcher(['/user(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) || isUserRoute(req)) {
    await auth.protect()
  }

  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth()
    const claims = sessionClaims as any
    const role = claims?.publicMetadata?.role || claims?.metadata?.role
    // Build allowlist of admin emails from env
    const allowlist = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    // Collect possible emails from session claims
    const emails = new Set<string>()
    if (typeof claims?.email === 'string') emails.add(claims.email.toLowerCase())
    if (typeof claims?.email_address === 'string') emails.add(claims.email_address.toLowerCase())
    if (Array.isArray(claims?.email_addresses)) {
      for (const e of claims.email_addresses) {
        if (typeof e === 'string') emails.add(e.toLowerCase())
        else if (typeof e?.email_address === 'string') emails.add(e.email_address.toLowerCase())
      }
    }
    const isAllowlistedAdmin = allowlist.length > 0 && Array.from(emails).some((e) => allowlist.includes(e))

    console.log('ADMIN ROUTE CHECK:', { 
      role, 
      allowlist, 
      emails: Array.from(emails), 
      isAllowlistedAdmin,
      publicMetadata: claims?.publicMetadata,
      metadata: claims?.metadata
    })

    if (role !== 'admin' && !isAllowlistedAdmin) {
      console.log('REDIRECTING TO USER - not admin')
      const url = new URL('/user', req.url)
      return NextResponse.redirect(url)
    }
  }

  // If an admin hits /user, redirect them to /admin-dashboard
  if (isUserRoute(req)) {
    const { sessionClaims } = await auth()
    const claims = sessionClaims as any
    const role = claims?.publicMetadata?.role || claims?.metadata?.role
    const allowlist = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const emails = new Set<string>()
    if (typeof claims?.email === 'string') emails.add(claims.email.toLowerCase())
    if (typeof claims?.email_address === 'string') emails.add(claims.email_address.toLowerCase())
    if (Array.isArray(claims?.email_addresses)) {
      for (const e of claims.email_addresses) {
        if (typeof e === 'string') emails.add(e.toLowerCase())
        else if (typeof e?.email_address === 'string') emails.add(e.email_address.toLowerCase())
      }
    }
    const isAllowlistedAdmin = allowlist.length > 0 && Array.from(emails).some((e) => allowlist.includes(e))

    console.log('USER ROUTE CHECK:', {
      path: req.nextUrl.pathname,
      role,
      allowlist,
      emails: Array.from(emails),
      isAllowlistedAdmin,
      publicMetadata: claims?.publicMetadata,
      metadata: claims?.metadata,
    })

    // Redirect admin users to admin dashboard
    if (role === 'admin' || isAllowlistedAdmin) {
      console.log('REDIRECTING TO ADMIN DASHBOARD - user is admin')
      const url = new URL('/admin-dashboard', req.url)
      return NextResponse.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}