# Business Operations Manual (Part 1)

## Digital Freight Brokerage Platform

**Company:** Operation Freight
**Market Position:** World-class digital freight intermediary competing with Freightos, Flexport, Searates, and Hapag Lloyd
**Business Model:** Asset-light digital brokerage with premium service delivery
**Geographic Scope:** UK-based operations serving worldwide markets

---

## Executive Summary

Operation Freight operates as a premium digital freight brokerage platform, connecting shippers with carriers through advanced technology and exceptional service delivery. Our mission is to revolutionize freight logistics through digital-first operations, automated processes, and world-class customer experience.

### Strategic Positioning
- **Digital-First Approach:** Leverage cutting-edge technology stack for operational excellence
- **Asset-Light Model:** Focus on coordination and service delivery without physical asset ownership
- **Premium Service:** Deliver enterprise-grade reliability and transparency
- **Global Reach:** Serve complex international routes with specialized expertise

---

## Core Business Principles

### 1. Digital Excellence
- Automate all standard processes through our technology platform
- Maintain real-time visibility across all operations
- Deliver instant quotes and seamless booking experiences
- Provide comprehensive digital documentation and tracking

### 2. Asset-Light Operations
- Coordinate logistics without owning physical assets
- Maintain clearly defined liability through robust contracts
- Focus resources on technology and service delivery
- Scale operations through digital efficiency

### 3. Compliance by Design
- Implement GDPR compliance across all data handling
- Conduct mandatory sanctions screening for all transactions
- Maintain audit trails for regulatory compliance
- Ensure data security and privacy protection

### 4. Premium Service Standards
- Establish clear Service Level Agreements (SLAs)
- Provide proactive communication and problem resolution
- Deliver transparent pricing and margin structures
- Maintain high customer satisfaction scores

---

## Service Portfolio & Revenue Model

### Core Services (MVP)

#### Instant Quote & Booking Engine
- **Standard Lanes:** UK–EU, UK–US, UK–Asia with instant pricing
- **Complex Routes:** Manual quoting for specialized or high-risk corridors
- **Multi-Modal Options:** Sea, air, and road freight solutions
- **Real-Time Rates:** Integration with carrier APIs for current pricing

#### Digital Documentation Suite
- Commercial invoices and packing lists
- Bills of Lading and Air Waybills
- Export/import declarations
- Insurance certificates and customs documentation
- Digital signature integration via DocuSign

#### Shipment Tracking & Management
- Real-time tracking through carrier APIs
- Proactive status updates and notifications
- Exception management and resolution
- Customer portal access for self-service

#### Payment Processing & Invoicing
- Automated billing through Clerk and Stripe integration
- Multiple payment methods and currencies
- Transparent fee structures
- Automated reconciliation and reporting

### Revenue Streams

#### Primary Revenue
- **Commission-Based Pricing:** Markup on carrier rates (10-25% depending on complexity)
- **Premium Service Fees:** Additional charges for complex routes and advisory services
- **Value-Added Services:** Insurance, customs clearance, and specialized handling

#### Secondary Revenue
- **API Access Subscriptions:** For high-volume clients requiring system integration
- **Monthly Retainers:** For enterprise clients with guaranteed volume commitments
- **Consulting Services:** Route optimization and supply chain advisory

---

## Standard Operating Procedures (SOPs)

### SOP 1: Standard Quote-to-Book Process

**Objective:** Process standard lane quotes efficiently with minimal manual intervention

**Process Flow:**
1. **Quote Request:** Client submits request via platform form
2. **Rate Lookup:** System queries Convex database for cached rates
3. **Carrier Integration:** If rates unavailable, trigger n8n automation for carrier API calls
4. **Quote Presentation:** Display options with ETA, insurance recommendations, and T&Cs
5. **Booking Confirmation:** Client accepts quote and provides payment via Stripe
6. **Shipment Creation:** Generate shipment record in Convex with unique tracking ID
7. **Documentation:** Auto-generate required shipping documents
8. **Carrier Dispatch:** Send booking confirmation and instructions to carrier
9. **Tracking Activation:** Provide client with tracking link and dashboard access

**SLA:** Quote delivery within 15 minutes for standard lanes

### SOP 2: Complex Route Manual Quoting

**Objective:** Handle non-standard and high-risk routes with specialized attention

**Process Flow:**
1. **Request Logging:** Log complex quote request in manual processing queue
2. **Assignment:** Operations coordinator assigned within 2 business hours
3. **Carrier Outreach:** Contact pre-vetted specialized carriers for quotes
4. **Risk Assessment:** Prepare detailed route memo including:
   - Geopolitical risk factors
   - Transit route analysis
   - Insurance requirements
   - Expected lead times and potential delays
5. **Client Presentation:** Deliver comprehensive quote with risk disclaimers
6. **Enhanced Payment Terms:** Require minimum 50% upfront payment

**SLA:** Quote delivery within 24 hours for complex routes

### SOP 3: Carrier Vetting & Onboarding

**Objective:** Maintain high-quality carrier network through rigorous vetting

**Vetting Requirements:**
- Company registration and business licenses
- Current insurance certificates (minimum coverage levels)
- Equipment photos and maintenance records
- Customer references and performance history
- Financial stability assessment
- Sanctions list screening

**Performance Metrics:**
- Reliability rating (1-5 scale)
- Lane competency tags
- Service quality scores
- Incident history tracking

**Database Management:**
- Store all carrier data in Convex with secure access controls
- Maintain contact information and SLA agreements
- Track negotiated base rates and contract terms
- Schedule annual re-vetting and performance reviews

### SOP 4: Document Management & E-Signatures

**Objective:** Streamline document creation, management, and signing processes

**Document Templates:**
- Standardized templates for all shipping documents
- Customizable fields for shipment-specific information
- Compliance-checked formats for different jurisdictions
- Version control and audit trails

**E-Signature Workflow:**
- DocuSign integration for all contract signing
- Automated routing to appropriate signatories
- Secure storage in Convex with access controls
- Notification system for pending signatures

### SOP 5: Payment Processing & Settlement

**Objective:** Ensure efficient cash flow and accurate financial reconciliation

**Client Payment Process:**
- Automated invoicing through Clerk billing system
- Multiple payment methods via Stripe integration
- Deposit requirements for new clients
- Credit terms for established customers

**Carrier Settlement:**
- Net payment terms (typically 30 days)
- Automated calculation of commission retention
- Integration with accounting systems (Xero/QuickBooks)
- Dispute resolution procedures

---

## High-Risk & Complex Route Protocols

### Pre-Engagement Requirements
- Mandatory sanctions screening using automated tools
- Written risk acknowledgment from client
- Enhanced due diligence on all parties
- Specialized insurance requirements

### Enhanced Security Measures
- Encrypted communication channels for sensitive information
- Secure document handling and storage
- Real-time threat monitoring and assessment
- Emergency response protocols

### Financial Protection
- Minimum 50% upfront payment requirement
- Enhanced insurance coverage mandates
- Escrow arrangements for high-value shipments
- Force majeure and liability limitation clauses

### Escalation Procedures
1. **Level 1:** Operations Coordinator (routine issues)
2. **Level 2:** Operations Manager (service disruptions)
3. **Level 3:** Operations Director (major incidents)
4. **Level 4:** Executive Team (crisis situations)

---

## Compliance & Legal Framework

### Business Structure
- **Current:** Sole trader registration with HMRC
- **Future:** Limited company incorporation when revenue justifies
- **Banking:** Dedicated business accounts with major UK banks
- **Accounting:** Professional bookkeeping and annual accounts

### Insurance Coverage
- **Professional Indemnity:** Minimum £1M coverage for errors and omissions
- **Public Liability:** £2M coverage for general business operations
- **Cyber Liability:** Coverage for data breaches and cyber incidents
- **Cargo Insurance:** Partnerships with specialized marine insurers

### Legal Documentation
- **Client Terms & Conditions:** Comprehensive T&Cs covering all services
- **Carrier Agreements:** Standardized contracts with liability definitions
- **Privacy Policy:** GDPR-compliant data handling procedures
- **Service Level Agreements:** Clear performance commitments

### Regulatory Compliance
- **GDPR:** Full compliance with data protection regulations
- **Sanctions Screening:** Automated screening against UK/EU/US sanctions lists
- **Export Controls:** Compliance with dual-use goods regulations
- **Anti-Money Laundering:** KYC procedures and suspicious activity reporting

---

## Technology Architecture & Integrations

### Primary Technology Stack
- **Frontend Platform:** Next.js 15 with React Server Components
- **Authentication & Billing:** Clerk for user management and Stripe integration
- **Database & Real-time:** Convex for serverless backend and real-time sync
- **UI Framework:** Tailwind CSS with shadcn/ui component library
- **Payment Processing:** Stripe for secure payment handling
- **Document Management:** DocuSign for e-signatures and digital workflows
- **Process Automation:** n8n for API integrations and workflow automation

### Integration Priorities
1. **Clerk ↔ Convex:** User profile synchronization and authentication
2. **Stripe Integration:** Checkout flows, invoicing, and payment tracking
3. **Carrier APIs:** Rate fetching and tracking updates via n8n workflows
4. **Document Automation:** Template generation and signature workflows

### Operational Data Management
- **Rate Cards:** Cached carrier rates in Convex with automated updates
- **Carrier Database:** Comprehensive carrier profiles with performance metrics
- **Client Management:** CRM functionality with booking history and preferences
- **Compliance Tracking:** Audit trails and regulatory reporting capabilities

---

## Organizational Structure & Responsibilities

### Core Roles

#### Founder / Operations Director
- **Strategic Leadership:** Business strategy and market positioning
- **Carrier Relations:** Key carrier partnerships and contract negotiations
- **Escalation Management:** High-level issue resolution and crisis management
- **Compliance Oversight:** Regulatory compliance and risk management

#### Operations Coordinator
- **Quote Management:** Manual quote processing and carrier coordination
- **Shipment Dispatch:** Booking confirmations and carrier instructions
- **Client Communication:** Proactive updates and issue resolution
- **Documentation:** Shipping document preparation and management

#### Sales & Growth Manager
- **Lead Generation:** Digital marketing and business development
- **Partnership Development:** Strategic alliances and channel partnerships
- **Client Onboarding:** New customer acquisition and relationship management
- **Market Analysis:** Competitive intelligence and pricing strategy

#### Technology & Automation Specialist
- **Platform Maintenance:** System monitoring and performance optimization
- **Integration Management:** API connections and workflow automation
- **Data Analytics:** Performance reporting and business intelligence
- **Security Management:** Cybersecurity and data protection

---
