# FreightOps – Professional SaaS Freight Forwarding Platform Prompt

## Overview
We are building **FreightOps**, a next-generation digital freight forwarding platform designed to **compete with Flexport, Freightos, and Hapag-Lloyd's digital tools**.  
The platform must be **enterprise-grade**, **scalable**, and **AI-enhanced**, while still operating lean for early-stage deployment.

## Tech Stack
- **Frontend:** React + Tailwind CSS  
- **Backend & Database:** Convex  
- **Auth:** Clerk  
- **Payments:** Stripe  
- **Shipping APIs:** Easyship, ReachShip  
- **Automation:** n8n (webhooks, task automation, workflow triggers)  
- **Deployment:** Vercel (separate apps for Client Dashboard & Admin Dashboard)  

## Core Modules
1. **Authentication & Access Control**
   - Clerk-powered login/registration (email, OAuth).
   - Role-based access: *Client*, *Admin*, *Operations Staff*.  
   - Secure session handling across both dashboards.  

2. **Client Dashboard**
   - **Shipment Management**: Create, track, and update shipments.  
   - **Quoting Engine**: API-driven instant freight quotes (Easyship, ReachShip).  
   - **Documents Center**: Upload/download compliance docs (Convex storage).  
   - **Payments**: Stripe checkout for freight charges, deposits, extras.  
   - **Metrics & Analytics**: Cost breakdowns, delivery estimates, shipment KPIs.  

3. **Admin Dashboard**
   - **Client Management**: Approve, onboard, and monitor clients.  
   - **Shipment Oversight**: View/edit all shipments, assign carriers.  
   - **Billing & Invoicing**: Stripe integration for payments, refunds, adjustments.  
   - **Automation Triggers**: n8n workflows for alerts, compliance, document routing.  
   - **Reports & Insights**: Generate and export operational + financial reports.  

4. **AI-Powered Coordinator**
   - AI assistant embedded in dashboards (Convex function calls).  
   - Can **trigger actions**: generate quotes, prep customs documents, alert clients.  
   - Predictive shipment risk scoring (delays, congestion, weather).  
   - Smart routing suggestions.  

## Design & UX
- Clean, professional UI with **MSN-style translucent panels** (modern corporate aesthetic).  
- Consistent branding across dashboards (client/admin).  
- Grid layouts, soft shadows, rounded edges for **refined feel**.  
- Responsive design for desktop + mobile.  

## Competitive Positioning
- **Flexport** = tech-driven freight forwarder → we match core digital features but leaner.  
- **Freightos** = booking marketplace → we differentiate with client dashboards + brokerage layer.  
- **Hapag-Lloyd** = carrier-led digital platform → we remain carrier-agnostic, API-integrated.  

## Deliverables for Development
- Finalize Convex schema for:
  - Users (Clerk IDs, roles)
  - Shipments
  - Documents
  - Payments
  - Automation triggers  
- Complete front-end integration with Convex functions.  
- Ensure Clerk + Stripe work seamlessly across client/admin apps.  
- Deploy working dashboards on Vercel with environment variables correctly configured.  

---
**Goal:** Deliver a freight forwarding SaaS platform that operates at the **same professional standard as Flexport, Freightos, and Hapag-Lloyd’s digital platforms**, but deployable lean with Convex + modern web stack.
