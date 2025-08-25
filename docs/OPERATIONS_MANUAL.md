# Operations Manual — Single App (convex-dashboard)

This is the primary high-level doc for how the app runs day-to-day.

## 1) Quote to Booking to Shipment
- Quote wizard (landing) submits to /api/quotes
- Quote appears under /user/quotes; you can Convert to Booking
- Booking appears under /user/bookings; you can Create Shipment
- Shipment appears under /user/shipments; you can Track now

## 2) Admin
- /admin-dashboard for operational overview (charts temporarily disabled)
- Use Convex dashboard for function logs and data

## 3) Integrations
- Auth: Clerk
- Payments: Stripe
- Backend: Convex
- E-sign: DocuSign (partial)
- Carrier rates: ReachShip (fallbacks enabled)

## 4) Environments & Running
- Dev server: npm run dev (in convex-dashboard)
- Convex: npx convex dev --once (usually auto-run)
- Environment: .env.local

## 5) File map
- app/(landing): hero + quote modal
- app/user/quotes, bookings, shipments
- app/api/quotes: quote handler with ReachShip + mock fallback
- convex/: schema + server functions
- lib/reachship.ts: rate utilities
- components/ui: shared shadcn components

## 6) Known limitations
- Charts disabled until Recharts issue is addressed
- Some docs are legacy; this manual is the main source

## 7) Next steps
- Pin or replace charts to re-enable admin graphs
- Finish DocuSign and payment tracking polish
- Keep only this manual + Project Structure in docs for clarity
