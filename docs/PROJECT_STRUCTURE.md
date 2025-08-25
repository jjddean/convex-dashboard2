# Project Structure (Single App)

This repo uses a single Next.js app: convex-dashboard.

- Framework: Next.js 15, React 18, shadcn/ui
- Auth & Billing: Clerk (auth), Stripe (payments)
- Backend: Convex (serverless DB + functions)
- Docs: /convex-dashboard/docs
- Public assets: /convex-dashboard/public

## Key paths
- app/(landing): marketing + quote wizard
- app/user: authenticated area
  - quotes: list and details, convert to booking
  - bookings: created from quotes, then to shipments
  - shipments: listing + tracking
- app/admin-dashboard: admin panels (charts currently disabled)
- app/api: Next.js route handlers (e.g., /api/quotes)
- convex/: Convex schema and functions
- lib/: integrations and helpers (e.g., reachship)
- components/: shared UI

## Development
- Start dev: npm run dev (in convex-dashboard)
- Convex dev: npx convex dev --once (usually auto-run by app)
- Environment: .env.local in convex-dashboard

## Notes
- operation-freight is deprecated; only convex-dashboard is active
- Charts using Recharts are disabled pending fix
