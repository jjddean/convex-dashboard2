# Action Plan — World‑Class Freight Operations App

This is the single source of truth for what we will build, in what order, and how we will verify it. Keep discussions minimal; update this file as decisions change. Linked docs: PRODUCTION_PLAN.md (deploy), OPERATIONS_MANUAL.md (ops/SOPs).

## Objectives & Success Metrics
- Bookable quotes with transparent pricing and SLAs
- Paperwork automation (generate, sign, store)
- Live tracking with inline maps and history
- Billing and settlements (client payment, carrier settlement)
- Admin analytics and alerts
- SLOs: p95 page < 1.5s; API error rate < 0.5%; uptime ≥ 99.9%

## Architecture
- Next.js app (convex-dashboard) — single public app for now
- Convex for DB + realtime; Clerk for auth; Stripe for payments; DocuSign for signatures
- Tracking: our Convex tracking model + external data sources; map front-end via Leaflet; OpenRouteService (ORS) for geocoding/routes
- Automation: n8n (optional) for carrier pings/notifications
- Observability: Vercel + Convex logs; client analytics; Slack/email alerts

## Environments & Flags
- Feature flags: FEATURE_USE_MOCKS (dev only), FEATURE_TRACKING_ROUTES, FEATURE_DOCUSIGN
- Secrets: see PRODUCTION_PLAN.md
- Access control: Admin role for privileged routes (/api/admin/*)

## Data Model (high level)
- users {externalId, role}
- quotes {quoteId, userId, request, quotes[], status}
- bookings {bookingId, quoteId, carrierQuoteId, status, details}
- shipments {shipmentId, userId, status, currentLocation{city,state,country,coordinates}, estimatedDelivery, carrier, trackingNumber, shipmentDetails, lastUpdated}
- trackingEvents {shipmentId->shipments._id, timestamp, status, location, description}
- documents {shipmentId|bookingId, type, fileRef, signedAt, signer}

## Workstreams (phases)

### Phase 0 — Foundations (Now)
- [ ] Lock admin endpoints (RBAC via Clerk) and rate-limit public APIs
- [ ] Complete inline map on User Shipments page; markers for currentLocation
- [ ] Tracking API dev fallback seeded; production returns 404 if truly missing
- [ ] Admin stats endpoint and dashboard blocks
- [ ] Basic tests: Convex queries/mutations unit tests; Next route smoke tests

### Phase 1 — Quotes & Booking (MVP completion)
- [ ] Quote form validation + instant quote logic (mock fallback → live ReachShip)
- [ ] Convert quote → booking; enforce validity window
- [ ] Booking details: pickup/delivery, special instructions; booking status updates
- [ ] Email confirmations and dashboard visibility
- [ ] Tests: createQuote, listMyQuotes, createBooking, getBooking

### Phase 2 — Documents & E‑Sign
- [ ] Document templates (invoice, BOL/AWB, packing list)
- [ ] Generate PDFs (server) and store in Convex storage
- [ ] DocuSign integration: envelope create, status webhook; store signed docs
- [ ] UI: Documents tab per booking/shipment; download links
- [ ] Tests: document generation deterministic snapshots; webhook handler

### Phase 3 — Payments & Settlement
- [ ] Stripe live mode; charge on booking or milestone
- [ ] Reconciliation table: client charge, carrier cost, margin
- [ ] Carrier settlement export (CSV/Xero/QuickBooks)
- [ ] Refund/adjustment flows; fraud checks
- [ ] Tests: payment intents, webhook signature verification, idempotency

### Phase 4 — Shipments & Tracking (World‑class)
- [ ] Inline map visible by default on /user/shipments
- [ ] “Refresh & Focus” to center selected shipment
- [ ] History timeline with event statuses
- [ ] Optional: ORS routes between origin/destination; cache geocodes/routes in Convex to respect rate limits
- [ ] Notifications: email/SMS on status changes; SLA breach alerts
- [ ] Tests: tracking endpoint, events ordering, map props (component tests)

### Phase 5 — Admin & Analytics
- [ ] Admin overview dashboard with shipments, quotes, bookings KPIs
- [ ] Filter by date/lane/customer; export CSV
- [ ] Incident log and post‑mortem tracker (Convex table + UI)
- [ ] Tests: stats API, role checks, exports

### Phase 6 — Hardening & Compliance
- [ ] GDPR: data minimization, right to delete, DPA reviews
- [ ] Sanctions screening step in quote/booking
- [ ] Audit logs (auth, sensitive actions)
- [ ] Security headers, rate limiting, input sanitization
- [ ] Backups/restore and disaster recovery runbook

## UX Standards (keep it premium)
- Dashboard hero: summary stats, quick actions
- Shipments: inline map + card layout; history timeline; clear ETA
- Accessibility: keyboard/focus states, color contrast, alt text
- Performance: lazy load heavy charts/maps; cache server responses

## Testing Strategy
- Unit tests for Convex functions and utility libs
- Integration tests: Next routes with mocked Clerk/Convex
- Component tests for critical UI (shipments cards/map)
- E2E smoke (Playwright) for quote → booking → tracking

## Observability & Alerts
- Error tracking: surface Convex/Next errors to Slack
- Synthetic probes for critical routes (/api/health, /api/shipments/:id/tracking)
- SLO dashboards (error rate, latency, success counts)

## Release Plan
- Deploy to Vercel with PRODUCTION_PLAN.md steps
- Feature flags to roll out: tracking routes, DocuSign
- Rollback: Vercel previous deployment; Convex previous version

## Decision Log
- Map provider: Leaflet (basemap OSM); ORS for routing (geocode/route cached)
- Single app for now (convex-dashboard). Consolidation later if needed

Update this plan as you execute. Each checkbox should be traceable to a PR and a short validation note.

