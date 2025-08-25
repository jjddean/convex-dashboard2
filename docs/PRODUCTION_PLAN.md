# Production Plan — convex-dashboard

This plan outlines how to take the consolidated app to production.

## 1) Environment & Secrets
- Clerk: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- Convex: CONVEX_DEPLOYMENT, CONVEX_SITE_URL
- Stripe: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (if using webhooks)
- DocuSign: DOCUSIGN_* (if enabling e-sign)
- Feature flags: FEATURE_USE_MOCKS=false in production

## 2) Build & Deploy
- Vercel (recommended):
  - Project root: convex-dashboard
  - Build command: npm run build
  - Install command: npm ci
  - Output: .next
  - Env variables: set all of the above in Vercel Project Settings
- Convex: convex deploy (or via Vercel Convex integration)

## 3) Data & Schema
- Run convex migrations automatically during deploy
- Ensure indexes exist: quotes.byQuoteId, quotes.byUserId, bookings.byBookingId, bookings.byUserId, shipments.byShipmentId, shipments.byUserId, trackingEvents.byShipmentId, users.byExternalId

## 4) Auth & Users
- Enable Clerk OAuth providers you need
- Map Clerk users to Convex users table on first sign-in
- Verify api routes use Clerk server auth.getToken({ template: 'convex' })

## 5) Integrations
- Carrier rates: switch ReachShip to live keys; keep mock fallback for resilience
- Stripe: enable live mode and test checkout/charges
- DocuSign: switch from sandbox to production account and update templates

## 6) Observability & Ops
- Convex Dashboard: monitor logs and function errors
- Vercel Analytics & Logs: track API/edge usage
- Alerts: optional Slack/email for 5xx rate or function failures

## 7) Post-Launch
- Re-enable Admin charts (pin or swap Recharts)
- Harden error handling and user messages
- Iterate on quote → booking → shipment flows

## Rollback
- Use Vercel deployments to rollback
- Convex: deploy previous version if function changes break

