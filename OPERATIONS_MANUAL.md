# Operations Manual — Digital Freight Brokerage (UK-based, Worldwide)

 **Stage:** Low-Compliance, No-Capital / No-Code Focus
 **Positioning:** Top-tier digital intermediary with specialist capability for complex and challenging routes

 ---

 ## 1 — Executive Summary

 Operate as a premium digital intermediary: connect shippers to carriers, coordinate end-to-end logistics from your MarketLive app, and deliver exceptional client experience through automation and proactive problem solving. No owned assets, minimal licensing initially, lean insurance and contracts, emphasis on trust, speed, and transparent margins.

 ---

 ## 2 — Core Principles

 * **Asset-light:** Coordinate, don’t own. Keep liability defined in contracts.
 * **Digital first:** Automate quoting, documentation, tracking, and billing through existing stack (MarketLive, Convex, Clerk, Stripe).
 * **Compliance by design:** GDPR + basic sanctions screening for every transaction.
 * **Premium service:** Clear SLAs, clean templates, proactive communication.

 ---

 ## 3 — Services & Revenue Model

 **Services (MVP):**

 * Instant quotes + booking for common lanes (UK–EU, UK–US, UK–Asia). Manual quoting for complex routes.
 * Digital documentation: generate/combine commercial invoice, Bill of Lading, Air Waybill, packing list, export declarations.
 * Tracking: API + manual updates.
 * Payment processing & invoicing via Clerk + Stripe.

 **Revenue:**

 * Commission per shipment (markup on carrier rate).
 * Premium fees for complex shipments and advisory.
 * Optional subscription for API/portal access or monthly retainer for high-volume clients.

 ---

 ## 4 — SOPs (Standard Operating Procedures)

 ### 4.1 Quote → Book (Standard Lane)

 1. Client requests quote via MarketLive form.
 2. System queries rate table (Convex DB). If missing, trigger n8n flow to request manual quote from carrier(s).
 3. Present options with ETA, insurance suggestion, and T\&Cs.
 4. Client accepts → capture payment (deposit policy) via Clerk/Stripe.
 5. Create shipment record in Convex, generate documents, send carrier order.
 6. Push tracking link to client dashboard + scheduled updates.

 ### 4.2 Manual Quote (Complex or Non-standard)

 1. Log into “Manual Quote” board (Airtable or internal Convex table).
 2. Ops assigns coordinator within 2 business hours.
 3. Coordinator contacts vetted carriers and gathers quotes.
 4. Prepare route memo: hazards, transit route, insurance recommendation, expected lead times.
 5. Present to client with disclaimer and payment terms.

 ### 4.3 Carrier Vetting

 1. Gather company registration, insurance certificates, references, recent equipment photos.
 2. Check reviews, memberships, sanctions lists.
 3. Assign reliability rating and lane competency tags.
 4. Add to Convex database with contact, SLA, and negotiated base rates. Re-vet annually or after incident.

 ### 4.4 Documentation & Signatures

 * Use templates for core shipping docs.
 * Signatures via DocuSign/PandaDoc. Store signed docs in Convex storage.
 * Include specific clauses for complex shipments.

 ### 4.5 Payments & Carrier Settlement

 * Client pays platform (Clerk/Stripe). Platform keeps commission, pays carrier net.
 * New clients: require deposit or full payment.
 * Reconciliation automated via Convex → accounting tool (Xero/QuickBooks).

 ---

 ## 5 — Complex Route Protocol

 * **Pre-engagement:** Mandatory sanctions screening + written acknowledgement.
 * **Higher upfront payment:** Minimum 50% before movement.
 * **Insurance:** Require additional coverage where available.
 * **Communication:** Encrypted channels for sensitive info.
 * **Escalation:** Defined 4-step escalation tree.
 * **Documentation:** Attach detailed route memo to booking and contract.

 ---

 ## 6 — Compliance & Legal

 * Business registration: sole trader → Ltd when revenue justifies.
 * Insurance: Professional Indemnity + Public Liability.
 * Contracts: standard client T\&Cs + carrier agreements. Include payment terms, liability cap, force majeure, sanctions compliance.
 * GDPR: Data minimisation, encrypted storage, access logs, DPA with providers (Convex, Clerk).
 * Sanctions: implement screening workflow.

 ---

 ## 7 — Technology & Integrations

 Primary stack:

 * **Frontend:** MarketLive React app.
 * **Auth & Billing:** Clerk.
 * **DB & Real-time:** Convex.
 * **Payments:** Stripe (via Clerk).
 * **Automation:** n8n for API connectors (carrier APIs, tracking, notifications).
 * **Operational tables:** Airtable or Convex tables for rate cards, carrier lists.
 * **Docs & signing:** Google Docs + PandaDoc/DocuSign.

 Integration priorities:

 1. Clerk ↔ Convex profile sync.
 2. Stripe checkout & invoicing.
 3. n8n flows for tracking updates → MarketLive dashboard.
 4. Airtable (carrier matrix) ↔ Convex rate cache.

 ---

 ## 8 — Roles & Responsibilities

 * **Founder / Ops Lead:** strategy, carrier relationships, escalation.
 * **Coordinator:** quoting, dispatch, client updates.
 * **Sales / Growth:** marketing, partnerships, lead qualification.
 * **Tech/Automation:** maintain n8n flows, Convex schema, dashboard features.
 * **Legal/Compliance:** contract review, sanctions advice.

 ---

 ## 9 — KPIs

 Track in Convex + dashboard:

 * Active shippers.
 * Shipments booked.
 * Gross profit margin per shipment.
 * Carrier network size.
 * CSAT/NPS score.
 * Incident rate.

 ---

 ## 10 — Incident & Escalation Playbook

 1. Detect: alerts (tracking failure, customs hold) → Coordinator notified.
 2. Triage: Coordinator assesses within 1 hour.
 3. Action: contingency plan (alternate carrier, broker contact).
 4. Escalate: Ops Lead + client call within 2 hours if High severity.
 5. Log: Incident in Convex; post-mortem within 72 hours.

 ---

 ## 11 — Onboarding Checklists

 **Client:**

 * KYC, billing info, company reg.
 * Signed T\&Cs.
 * Trade references.
 * Deposit paid.

 **Carrier:**

 * Company doc

---

## 12 — Product & App Plan (Authoritative)

This section defines the app pages, core functions, and verification criteria. Treat it as the contract for delivery.

### 12.1 User Portal Pages (client-facing)
- Dashboard (/user):
  - Components: KPI tiles (quotes/bookings/shipments), alerts, recent activity
  - Map: optional overview of user shipments (in-transit markers)
  - Data: api.quotes.listMyQuotes, api.bookings.listMyBookings, api.shipments.listShipments
- Quotes (/user/quotes): list + stats, filters; quote details page (/user/quotes/[id])
  - Actions: request quote, view options, convert to booking
  - Convex: quotes.createQuote, quotes.listMyQuotes, quotes.getQuote
- Bookings (/user/bookings): list; details (/user/bookings/[id])
  - Actions: view/modify details, status, documents
  - Convex: bookings.listMyBookings, bookings.getBooking, bookings.updateBookingStatus
- Shipments (/user/shipments):
  - Inline map (Leaflet/OSM) with currentLocation markers
  - Card layout per shipment with status, ETA, progress bar, history timeline
  - Actions: Refresh & Focus (calls /api/shipments/:id/tracking)
  - Convex: shipments.listShipments, shipments.getShipment; API route to fetch/seed tracking
- Documents (/user/documents): generated docs per booking/shipment; download links
  - Convex storage refs; DocuSign envelope status when enabled
- Billing (/user/billing): invoices, payments, methods
  - Stripe integration (charges, invoices)
- Support (/user/support): contact, incidents, SLA view

### 12.2 Admin Portal Pages
- Overview (/admin-dashboard): KPI tiles, trends, alerts, global shipments map
  - API: /api/admin/stats (role-restricted)
- Quotes (/admin-dashboard/quotes): list, filters, assignment, status
  - Convex: quotes.listQuotes, quotes.getQuote
- Bookings (/admin-dashboard/bookings): list, details, status, documents
  - Convex: bookings (list all), getBooking, updateBookingStatus
- Shipments (/admin-dashboard/shipments): list, status controls, manual updates, incidents
  - Convex: shipments.listShipments (all), getShipment, upsertShipment
- Carriers (/admin-dashboard/carriers): vetting, documents, lanes, ratings
- Rates (/admin-dashboard/rates): matrix editor and sync (Airtable/Convex)
- Users (/admin-dashboard/users): roles, accounts, orgs
- Settings (/admin-dashboard/settings): feature flags, integration keys

### 12.3 Core APIs & Functions (Convex/Next)
- Quotes: createQuote, listQuotes, listMyQuotes, getQuote
- Bookings: createBooking, listBookings (admin), listMyBookings, getBooking, updateBookingStatus
- Shipments: upsertShipment, getShipment, listShipments (filter by userId when onlyMine)
- Tracking route: GET /api/shipments/[id]/tracking
  - Dev: seed mock if missing; Prod: return data or 404; optionally poll carriers via n8n
- Admin stats: GET /api/admin/stats (admin only)
- Webhooks: Stripe payments, DocuSign envelopes

### 12.4 Tracking & Map Standards
- Basemap: Leaflet + OpenStreetMap tiles (switchable to MapTiler if traffic > free tier)
- Routing/Geocoding: OpenRouteService (ORS) using env key; cache results in Convex
- UI: Inline map on /user/shipments; markers for currentLocation; card timelines below
- Perf: lazy load map; avoid excessive re-renders; debounce focus; browser budget < 50ms long tasks

### 12.5 Compliance & Security (must-have before production)
- GDPR: data minimization; right to delete; DPA with processors (Clerk, Convex, Stripe, DocuSign)
- Sanctions: screening step in quote/booking for counterparty and route
- AuthZ: Clerk RBAC; admin routes locked; rate limiting on public APIs
- Audit: log sensitive actions to Convex table

### 12.6 Verification & KPIs
- E2E: Quote → Booking → Shipment → Tracking → Documents → Payment
- SLOs: p95 page < 1.5s; 24h API error rate < 0.5%; uptime ≥ 99.9%
- Ops: incident MTTR < 4h; on-time delivery metric captured per shipment

### 12.7 Phased Roadmap (execution order)
1) Foundations: authZ, stats, inline map, basic tests
2) Quotes/Booking MVP: convert to booking; email confirmations
3) Documents & E‑Sign: generate, sign, store
4) Payments & Settlement: Stripe live, reconciliation, exports
5) Tracking Excellence: ORS routes, notifications, SLA alerts
6) Admin Analytics & Hardening: filters, exports, audit, backups
