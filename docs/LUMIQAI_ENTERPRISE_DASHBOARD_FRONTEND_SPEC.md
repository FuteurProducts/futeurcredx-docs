# LumiqAI Enterprise Dashboard Frontend Specification

**Document Type:** Current State Documentation  
**Version:** 1.0  
**Generated:** January 2026  

---

## 1. Dashboard Overview (Enterprise Perspective)

### User Persona

The primary user of this dashboard is a **bank staff member**, **credit union analyst**, or **fintech partner** responsible for:

- Monitoring a portfolio of SMB (Small and Medium Business) customers
- Assessing credit risk and making lending decisions
- Managing API integrations and partner connections
- Generating compliance reports and audit trails

### Primary Goal When Logging In

The user logs in to gain **real-time visibility** into:

1. The health and status of connected SMB businesses
2. Credit intelligence and risk signals across the portfolio
3. API performance and integration stability
4. Underwriting pipeline and application status

### Decisions Enabled by This Dashboard

| Decision Type | Dashboard Support |
|---------------|-------------------|
| Credit approval/decline | Underwriting Assistant with AI recommendations |
| Portfolio risk exposure | Risk Intelligence with heatmaps and EWS queue |
| Customer relationship management | Customer page with RHS scoring and lifecycle pipeline |
| API capacity planning | Overview metrics showing request volumes and latency |
| Compliance reporting | Reports page with template library and audit metadata |

---

## 2. Navigation Structure

The sidebar navigation contains 12 primary items accessible from `/dashboard`:

| Position | Tab ID | Display Name | Icon | Purpose | Status |
|----------|--------|--------------|------|---------|--------|
| 1 | `overview` | Dashboard | Home icon | SMB Portfolio Overview with key metrics | Clickable |
| 2 | `credit-intel` | Credit Intelligence | Idea/lightbulb | Individual entity credit analysis | Clickable |
| 3 | `underwriting` | Underwriting | Document | Application queue and AI decisioning | Clickable |
| 4 | `risk` | Risk | Binoculars | Portfolio risk monitoring and EWS | Clickable |
| 5 | `customer` | Customer | Briefcase | Customer relationship management | Clickable |
| 6 | `api-keys` | API Console | Lock/Key | API key management and testing | Clickable |
| 7 | `partner-portal` | Partner Portal | Connection | Partner integration hub | Clickable |
| 8 | `analytics` | Analytics | Growth chart | Portfolio analytics and KPI tracking | Clickable |
| 9 | `products` | Products | File | Product catalog (minimal content) | Clickable |
| 10 | `users` | Users | Building | User management | Clickable |
| 11 | `reports` | Reports | Presentations | Report generation and library | Clickable |
| 12 | `settings` | Settings | Sliders | Platform configuration | Clickable |

**Additional UI Elements:**

- Sidebar collapse/expand toggle
- Environment toggle (Sandbox/Production) in header
- Portfolio selector dropdown (global context)
- User account menu with sign-out
- Notification bell icon

---

## 3. Page-by-Page Breakdown

### 3.1 Dashboard (Overview)

**Purpose:** Provide a high-level SMB portfolio overview for bank staff monitoring connected businesses.

**Primary KPIs Shown:**

| KPI | Value Displayed | Format |
|-----|-----------------|--------|
| Connected Businesses | 2,847,392 | Count with growth % |
| Active Connections | 2,712,458 | Count |
| New This Month | +23,847 | Count |
| Monthly Growth | 8.4% | Percentage |
| Disconnected | 12,847 | Count |
| Pending Reconnect | 3,291 | Count |

**Secondary Metrics:**

| Metric | Value | Format |
|--------|-------|--------|
| Total API Requests | 847,293,847 | Count |
| Success Rate | 99.87% | Percentage |
| Avg Latency | 142ms | Milliseconds |
| Error Count | 1,847 | Count |
| Rate Limit Hits | 23 | Count |
| Peak Hour | 2:00 PM EST | Time |
| Daily Average | 28,243,128 | Count |

**Charts/Tables/Cards Visible:**

1. **ConnectedBusinessesCard** - Grid showing total, active, new, disconnected, pending
2. **ApiUsageCard** - Request volume, success rate, latency metrics
3. **PortfolioHealthCard** - Risk segment distribution (Low/Medium/High/Critical)
4. **DataFreshnessCard** - Fresh/Stale/Critical account counts with refresh rate
5. **RecentActivityFeed** - Connection/disconnection/alert events with timestamps
6. **WebhookEventsCard** - Event delivery status with retry indicators
7. **IntegrationHealthCard** - Service status (Core API, Data Aggregation, Risk Engine, etc.)
8. **TopBusinessesTable** - Top 5 businesses by LumiqAI score with trends

**Filters Available:** None on this page (portfolio-scoped via global selector)

**Actions Available:**

- View all activity
- View all businesses
- Refresh status
- Refresh all data

---

### 3.2 Credit Intelligence

**Purpose:** Provide comprehensive credit analysis and fundability assessment for individual SMB entities.

**Primary KPIs Shown:**

| KPI | Value | Format |
|-----|-------|--------|
| LumiqAI Composite Fundability Score | 742 | Numeric (0-850) |
| Grade | A | Letter grade |

**Secondary Metrics (Factor Subscores):**

| Factor | Score | Status |
|--------|-------|--------|
| Tradelines | 87 | Normal |
| Payments | 92 | Normal |
| Registry Status | 95 | Normal |
| Identity Match | 88 | Normal |
| Banking Health | 78 | Substituted indicator |

**Charts/Tables/Cards Visible:**

1. **CreditScoreGauge** - Semi-circular gauge with color bands (red/yellow/pink/green)
2. **Balance Trend Chart** - Area chart showing 90-day balance history
3. **ACH Returns Chart** - Bar chart showing weekly return counts
4. **Volatility Meter** - Gradient bar with Stable/Moderate/Volatile indicator
5. **Score Explanation Panel** - Positive drivers and risk drivers lists
6. **Alert Rules Configuration** - Toggle switches for score change, filing, payment alerts
7. **Signal Substitution Table** - Shows data substitutions when primary sources unavailable

**Filters Available:**

- Alert category tabs (Rules/History)

**Actions Available:**

- Toggle alert rules on/off
- View alert history

---

### 3.3 Underwriting Assistant

**Purpose:** AI-powered application decisioning queue with detailed credit analysis.

**Primary KPIs Shown:**

| KPI | Value | Format |
|-----|-------|--------|
| Approved Today | 47 | Count |
| In Review | 12 | Count |
| Declined Today | 8 | Count |
| Avg Processing | 4.2 mins | Duration |
| AI Accuracy | 94.7% | Percentage |
| Human Override | 6.3% | Percentage |

**Charts/Tables/Cards Visible:**

1. **Application Queue Table** - Sortable list with company, amount, confidence, status
2. **Application Detail Panel** - Expanded view with:
   - Business information (EIN, industry, NAICS, address)
   - Owner information (name, ownership %, identity verification)
   - Credit subscores (tradelines, payments, banking, identity)
   - Banking metrics (30/90d balance, NSF, ACH returns, cash runway)
   - Tradeline details (vendors, oldest line, on-time %, DBT average)
   - Public records (UCC filings, liens, judgments, bankruptcies)
   - KYB verification status
   - Rule triggers with pass/fail/warning status
3. **AI Summary Card** - Narrative explanation of decision factors
4. **Positive/Risk Drivers** - Bulleted lists of contributing factors

**Filters Available:**

- Status filter (Approve/Review/Decline)
- Search by company name

**Actions Available:**

- Select application for detail view
- View rule triggers
- (Implied) Approve/Decline actions via buttons

---

### 3.4 Risk Intelligence

**Purpose:** Bank-grade portfolio risk monitoring following SR 11-7 and FFIEC standards.

**Primary KPIs Shown:**

| KPI | Value | Trend |
|-----|-------|-------|
| Portfolio Risk Score | 724 | -12 from last month |
| Expected Loss | 1.2% | +10 bps |
| Unexpected Loss | 0.8% | Stable |
| VaR Confidence | 99% | Meets target |
| Concentration Risk | Low | Within limits |
| Stress Test | Pass | All scenarios |

**Secondary Metrics (Deterioration Drivers):**

| Driver | Impact % | Affected Accounts |
|--------|----------|-------------------|
| Payment Behavior | 34% | 847 |
| Credit Utilization | 28% | 1,234 |
| Bureau Score Drops | 22% | 567 |
| Cash Flow Stress | 16% | 423 |

**Charts/Tables/Cards Visible:**

1. **RiskGlobalControls** - Portfolio filter, time window, risk lens toggles
2. **ExecutiveRiskSummary** - KPI cards with sparklines and trend charts
3. **RiskHeatmapMatrix** - Segment × Product risk grid with exposure values
4. **ConcentrationPanel** - Industry and geographic exposure limits
5. **EWSWorkQueue** - Early Warning System queue with severity, SLA timers
6. **ModelGovernancePanel** - Model version tracking, feature drift monitoring
7. **DataLineagePanel** - Data source coverage, freshness, error rates
8. **AuditControlsPanel** - Access events and permission changes log
9. **StressScenarioPanel** - Mild/Moderate/Severe recession scenarios with migration matrices

**Filters Available:**

- Product (LOC, Working Capital, Credit Card, SBA)
- Segment (Micro, Small, Mid-Market)
- Region
- Relationship Stage
- Risk Tier
- Time Window (7d, 30d, 90d, 12m)
- Risk Lenses (Credit, Cash Flow, Bureau, Fraud, Model Drift)

**Actions Available:**

- Refresh risk data
- Export risk report
- Acknowledge EWS alerts
- Assign EWS items
- Add notes to EWS items
- Resolve alerts
- Toggle EWS indicators
- View entity details from EWS
- Set concentration limits
- View concentration details

---

### 3.5 Customer

**Purpose:** Enterprise customer relationship management with health scoring.

**Primary KPIs Shown:**

| KPI | Value | Trend |
|-----|-------|-------|
| Average RHS (Relationship Health Score) | 74 | +2.3% |
| Growing Percentage | 28% | +4.1% |
| At-Risk Percentage | 12% | -1.8% |
| Cross-Sell Penetration | 42% | +3.2% |

**Secondary Metrics (Lifecycle Pipeline):**

| Stage | Count | Avg RHS | Avg Revenue | Products | Trend |
|-------|-------|---------|-------------|----------|-------|
| Prospect | 342 | 0 | $0 | 0 | +5.2% |
| New | 186 | 68 | $45K | 1.8 | +12.4% |
| Growing | 524 | 82 | $125K | 3.2 | +8.1% |
| Mature | 1,247 | 76 | $285K | 4.8 | +2.3% |
| At Risk | 89 | 48 | $95K | 2.1 | -15.2% |

**Charts/Tables/Cards Visible:**

1. **CustomerGlobalControls** - Multi-filter bar for product, segment, region, stage
2. **LifecyclePipeline** - Visual funnel showing stage progression
3. **RelationshipHealthSummary** - RHS metrics with trend chart and top opportunities
4. **CustomerListTable** - Paginated table with sorting, search, selection
5. **CustomerEngagementPanel** - RHS breakdown, product matrix, activity timeline
6. **NextBestActions** - AI recommendations with confidence scores and revenue impact
7. **PeerBenchmarking** - Metrics compared to industry peers with percentiles
8. **CustomerDossier** - Full-page modal with complete customer profile

**Filters Available:**

- Product
- Segment (Micro, Small, Mid-Market)
- Region
- Relationship Stage
- Time Window (30d, 90d, 12m)
- View Mode (Portfolio/Entity)
- Search query

**Actions Available:**

- Select customer for engagement panel
- View customer details (opens dossier)
- Sort table columns
- Paginate results
- Click lifecycle stage to filter
- Drilldown on health metrics
- Assign tasks from recommendations
- Dismiss recommendations
- View peer list
- Add notes to customer

---

### 3.6 API Console

**Purpose:** API key management, testing, and connection catalog.

**Primary KPIs Shown:**

| KPI | Value | Format |
|-----|-------|--------|
| Total Calls This Month | (Dynamic) | Count |
| Monthly Limit | 10,000 | Count |
| Plan | Free | Text |

**Charts/Tables/Cards Visible:**

1. **API Keys Table** - List of keys with name, prefix, created date, last used, status
2. **Key Stats** - Calls per key breakdown
3. **Connection Catalog** - Available integrations (Experian, D&B, Plaid, etc.)
4. **API Playground** (from Index page) - Interactive request builder

**Filters Available:**

- Environment (Development/Production)

**Actions Available:**

- Generate new API key
- Revoke API key
- Show/hide key value
- Copy key to clipboard

---

### 3.7 Partner Portal

**Purpose:** Integration hub for partners with credentials, testing, and compliance management.

**Components (7 Panels):**

1. **CredentialsPanel** - API key lifecycle management
2. **UsageAnalyticsPanel** - SLA and latency tracking
3. **WebhooksPanel** - Webhook configuration and delivery logs
4. **TestingPanel** - Sandbox/UAT environment controls
5. **CompliancePanel** - SOC 2/FFIEC compliance status
6. **SlaPanel** - Incident history and support contacts
7. **DocumentationPanel** - Interactive API reference

**Filters Available:**

- (Tab-based navigation between panels)

**Actions Available:**

- Switch between panels via tabs

---

### 3.8 Analytics

**Purpose:** Portfolio intelligence cockpit for performance, risk, and growth analysis.

**Primary KPIs (PortfolioKPITiles):**

| KPI | Value | Format | Trend |
|-----|-------|--------|-------|
| (Dynamic based on mode) | Various | Mixed | 90d trend |

**Analysis Modes:**

| Mode | Components Displayed |
|------|---------------------|
| Performance | KPI tiles, Score Distribution, Score Migration Matrix |
| Risk | Risk-focused KPIs, Risk Drivers Panel, Migration Matrix, Score Distribution |
| Growth | Product Penetration Table, Cross-Sell Funnel, Growth KPIs |
| Conversion | Application Funnel Chart, Cross-Sell Funnel |
| Signals | Feature Importance Chart, Signal Drift Monitor, Risk Drivers |

**Charts/Tables/Cards Visible:**

1. **AnalyticsGlobalControls** - Filters and mode selector
2. **PortfolioKPITiles** - Clickable metric cards with drilldown
3. **ScoreDistributionChart** - Histogram of portfolio scores
4. **ScoreMigrationMatrix** - Tier-to-tier movement heatmap
5. **RiskDriversPanel** - Ranked list of deterioration factors
6. **ProductPenetrationTable** - Product adoption by segment
7. **CrossSellFunnel** - Opportunity conversion pipeline
8. **ApplicationFunnelChart** - Application stage progression
9. **FeatureImportanceChart** - Model signal contribution bars
10. **SignalDriftMonitor** - Feature drift over time

**Filters Available:**

- Product
- Segment
- Geography
- Relationship Stage
- Time Window (7d, 30d, 90d, 180d, 12m)
- Analysis Mode (Performance, Risk, Growth, Conversion, Signals)

**Actions Available:**

- Change analysis mode
- Drill down on KPIs
- View clients by driver
- View opportunity details

---

### 3.9 Reports

**Purpose:** Enterprise report generation with governance metadata.

**Views:**

| View | Purpose |
|------|---------|
| Library | Browse and configure standard report templates |
| Custom | Build custom reports with metric selection |

**Charts/Tables/Cards Visible:**

1. **ReportsGlobalControls** - Filters and view toggle
2. **ReportLibraryPanel** - Template grid organized by category (Portfolio, Underwriting, Customer, Compliance, API)
3. **ReportConfigPanel** - Format selection (PDF/CSV/Excel), scheduling, scope
4. **ReportHistoryPanel** - Generated reports with status, download links
5. **ReportPreviewDrawer** - Side panel preview with governance metadata
6. **CustomReportBuilder** - Metric tree and canvas for custom report assembly

**Filters Available:**

- Product
- Segment
- Geography
- Relationship Stage
- Time Window
- Environment (Sandbox/Production)

**Actions Available:**

- Select report template
- Generate report
- Download report
- View report preview
- Refresh history
- Run custom report
- Save custom report as template

---

### 3.10 Settings

**Purpose:** Platform configuration hub with 17 settings sections.

**Settings Categories:**

| Category | Sections |
|----------|----------|
| Access & Users | Users, Roles, SSO |
| API & Security | API Keys, OAuth, IP Allowlist, Webhook Security |
| Data & Privacy | Data Sources, Retention, Consent, PII Masking |
| Risk & Models | Model Versions, Alert Thresholds |
| Integrations | Integrations Panel |
| Notifications | Notification preferences |
| Billing | Billing Panel |
| Audit | Audit Logs |

**Components per Section:**

- **UsersPanel** - User list with add/edit/remove
- **RolesPanel** - Permission matrix by role
- **SSOPanel** - SSO configuration
- **ApiKeysPanel** - Key management with create/revoke/rotate
- **OAuthPanel** - OAuth client configuration
- **IpAllowlistPanel** - IP whitelist management
- **WebhookSecurityPanel** - Webhook secret and validation settings
- **DataSourcesPanel** - Bureau and bank connections with sync status
- **RetentionPanel** - Data retention policies
- **ConsentPanel** - Customer consent tracking
- **PIIMaskingPanel** - PII field masking rules
- **ModelVersionsPanel** - Deployed model versions and validation dates
- **AlertThresholdsPanel** - Configurable alert thresholds
- **IntegrationsPanel** - Third-party integrations
- **NotificationsPanel** - Channel-based notification preferences
- **BillingPanel** - Subscription and usage billing
- **AuditLogsPanel** - Searchable audit event log with export

**Filters Available:**

- Environment toggle (Sandbox/Production)

**Actions Available:**

- Add/Edit/Remove users
- Save role permissions
- Create/Revoke/Rotate API keys
- Reauth/Sync data sources
- Save threshold configurations
- Export audit logs
- Upgrade subscription

---

### 3.11 Notifications

**Purpose:** Configure notification preferences across channels.

**Notification Types:**

| Type | Description | Default Email | Default SMS | Default Slack |
|------|-------------|---------------|-------------|---------------|
| API Alerts | Critical API errors and downtime | On | On | On |
| Usage Reports | Daily/weekly usage summaries | On | Off | On |
| Security Alerts | Suspicious activity and access attempts | On | On | On |
| Billing Notifications | Invoices and payment reminders | On | Off | Off |
| Product Updates | New features and API changes | On | Off | On |

**Frequency Options:**

- Immediate
- Daily Digest
- Weekly Summary
- Monthly Report

**Integration Status Display:**

- Email verified (green check)
- SMS enabled (green check)
- Slack connected (green check)

**Actions Available:**

- Toggle channel on/off per notification type
- Change frequency per notification type

---

### 3.12 Products (Minimal)

**Purpose:** Product catalog page.

**Current State:** Minimal implementation with placeholder content.

---

### 3.13 Users (Minimal)

**Purpose:** User management page.

**Current State:** Accessible via navigation, renders user-related content.

---

### 3.14 Index (Alternative Dashboard)

**Purpose:** Partner-focused dashboard with conversion metrics and developer tools.

**Primary KPIs:**

| KPI | Value | Trend |
|-----|-------|-------|
| Total Businesses | 25,000 | +5.2% |
| Businesses with Credit | 18,500 | +7.8% |
| Applications Started | 3,200 | +12.3% |
| Approved | 2,400 | +15.4% |
| Ineligible | 6,500 | -2.1% |

**Tabs:**

| Tab | Content |
|-----|---------|
| Overview | Funnel metrics, conversion chart, ROI calculator, smart alerts |
| Intelligence | Competitive intelligence panel |
| Developer | API playground, data flow visualization, developer hub |
| Activity | Webhook event stream, white-label preview, executive summary |

**Filters Available:** None (tab-based organization)

---

## 4. KPI & Metrics Inventory

| KPI Name | Location(s) | Measurement | Granularity | Data Source |
|----------|-------------|-------------|-------------|-------------|
| Connected Businesses | Dashboard Overview | SMB accounts via API | Real-time | Implied API |
| Active Connections | Dashboard Overview | OAuth-linked accounts | Real-time | Implied API |
| Monthly Growth | Dashboard Overview | MoM connection growth | Monthly | Implied calculation |
| Total API Requests | Dashboard Overview | Cumulative API calls | Real-time | API logs |
| Success Rate | Dashboard Overview | HTTP 2xx / total | Real-time | API logs |
| Avg Latency | Dashboard Overview | Mean response time | Real-time | API logs |
| Portfolio Risk Score | Risk | Composite score (0-1000) | Daily/On-demand | Risk Engine |
| Expected Loss | Risk | EL percentage | Daily | Risk Model |
| LumiqAI Score | Credit Intelligence, Underwriting | Composite fundability (0-850) | Per-entity | Score Engine |
| Relationship Health Score (RHS) | Customer | Engagement score (0-100) | Per-entity | Analytics |
| Application Conversion Rate | Index | Applications / eligible | Monthly | Application data |
| Approval Rate | Index, Underwriting | Approved / submitted | Daily | Application data |
| AI Accuracy | Underwriting | Correct predictions % | Rolling | Model monitoring |
| Human Override | Underwriting | Manual overrides % | Rolling | Audit logs |
| Delinquency Rate | Index, Risk | 30+ DPD % | Monthly | Portfolio data |
| Default Rate | Index, Risk | Written-off % | Monthly | Portfolio data |

---

## 5. API & System Visibility (Frontend Only)

### API Usage Indicators

| Element | Location | Data Shown |
|---------|----------|------------|
| API Status Badge | Dashboard Header | "All Systems Operational" with green pulse |
| Total Requests | Overview | 847,293,847 |
| Request Change | Overview | +12.3% |
| Success Rate | Overview | 99.87% |
| Error Count | Overview | 1,847 |
| Rate Limit Hits | Overview | 23 |
| Avg Latency | Overview | 142ms |
| Peak Hour | Overview | 2:00 PM EST |
| Daily Average | Overview | 28,243,128 |

### System Health Indicators

| Service | Status | Latency | Uptime | Location |
|---------|--------|---------|--------|----------|
| Core API | Operational | 45ms | 99.99% | IntegrationHealthCard |
| Data Aggregation | Operational | 234ms | 99.95% | IntegrationHealthCard |
| Risk Engine | Operational | 89ms | 99.97% | IntegrationHealthCard |
| Webhook Delivery | Degraded | 312ms | 98.7% | IntegrationHealthCard |
| Authentication | Operational | 28ms | 99.99% | IntegrationHealthCard |

### Webhook Delivery Metrics

| Metric | Value | Location |
|--------|-------|----------|
| Total Sent | 847,293 | WebhookEventsCard |
| Delivery Rate | 99.2% | WebhookEventsCard |
| Avg Response Time | 112ms | WebhookEventsCard |
| Failed Count | 847 | WebhookEventsCard |

### Data Source Health

| Source | Coverage | Freshness | Status | Location |
|--------|----------|-----------|--------|----------|
| Experian Business | 94% | < 24h | Connected | DataLineagePanel |
| D&B PAYDEX | 91% | < 48h | Connected | DataLineagePanel |
| Plaid Banking | 68% | Real-time | Connected | DataLineagePanel |
| QuickBooks | 42% | < 24h | Degraded | DataLineagePanel |

---

## 6. User Actions & Permissions (Visible Only)

### Actions Visible in UI

| Action | Location | Implied Permission |
|--------|----------|-------------------|
| Generate API Key | API Console, Settings | api_keys:create |
| Revoke API Key | API Console, Settings | api_keys:revoke |
| Rotate API Key | Settings | api_keys:rotate |
| View Customer Details | Customer | customers:read |
| Add Customer Note | Customer | customers:write |
| Approve Application | Underwriting | applications:approve |
| Decline Application | Underwriting | applications:decline |
| Acknowledge EWS Alert | Risk | ews:acknowledge |
| Assign EWS Item | Risk | ews:assign |
| Generate Report | Reports | reports:create |
| Download Report | Reports | reports:download |
| Export Audit Logs | Settings | audit:export |
| Add/Edit/Remove User | Settings | users:manage |
| Modify Role Permissions | Settings | roles:manage |
| Set Concentration Limits | Risk | limits:manage |
| Configure Alert Thresholds | Settings | alerts:manage |
| Sync Data Source | Settings | datasources:sync |

### Role-Based Access Implied

From the Settings → Roles panel, the following roles appear defined:

- Super Admin
- Admin
- Developer
- Risk Analyst
- Relationship Manager
- Read-only

### Approval/Review Flows Implied

1. **Application Decisioning:** Applications show "approve", "review", "decline" statuses with AI confidence scores. Human override percentage (6.3%) implies manual review workflow.

2. **EWS Work Queue:** Critical/High severity items have SLA timers and can be assigned, implying escalation workflow.

3. **Report Generation:** Reports have "pending" → "ready" status transition, implying async generation workflow.

---

## 7. Empty States & Placeholders

### Empty Tables/Lists

| Component | Empty State Message | Location |
|-----------|---------------------|----------|
| RecentActivityFeed | "No recent activity" with clock icon | Dashboard Overview |
| CustomerListTable | (Implied) Empty when no results | Customer |
| ApplicationQueue | (No explicit empty state visible) | Underwriting |

### Placeholder/Static Data Areas

| Area | Indicator | Location |
|------|-----------|----------|
| All metric values | Hardcoded mock data objects | All pages |
| Business names | "TechFlow Solutions", "Acme Corporation", etc. | Throughout |
| Scores/percentages | Static values in mock objects | Throughout |
| Timestamps | "2m ago", "5m ago", etc. | Activity feeds |

### "Coming Soon" Elements

No explicit "Coming Soon" labels were found in the current implementation.

### Mock Data Indicators

All pages use mock data defined in component files:

- `connectedBusinessesData` in FinlabOverview
- `mockCustomers` in Customer page
- `applications` array in UnderwritingAssistant
- `riskKPIs`, `ewsQueueItems` in Risk page
- `mockReportTemplates`, `mockGeneratedReports` in Reports page
- All `mock*` prefixed constants in Settings

---

## 8. Frontend Assumptions

### Backend Data Structures Assumed

| Structure | Assumed Fields | Used By |
|-----------|----------------|---------|
| SMB Entity | id, businessName, industry, naicsCode, segment, region, rhs, riskTier | Customer, Risk |
| Application | id, companyName, amount, confidence, status, subscores, ruleTriggers | Underwriting |
| Credit Score | score, grade, factors, subscores, drivers | Credit Intelligence |
| API Key | id, name, keyPrefix, createdAt, lastUsed, callsUsed, isActive | API Console |
| Report Job | id, name, format, status, generatedAt, downloadUrl, metadata | Reports |
| EWS Alert | id, severity, businessId, signals, slaTimer, recommendedAction | Risk |

### Data Relationships Implied

1. **Portfolio → SMB Entities:** One-to-many relationship with portfolio context scoping all queries
2. **Tenant → Portfolios:** Multi-tenant isolation with tenant ID in metadata
3. **SMB Entity → Credit Scores:** One-to-many with multiple score types/sources
4. **SMB Entity → Applications:** One-to-many application history
5. **User → Roles:** Many-to-many with tenant-scoped permissions
6. **Report → Data Sources:** Many-to-many for lineage tracking

### Workflows Expected But Not Implemented

| Workflow | Current State | Gap |
|----------|---------------|-----|
| Real API key generation | Calls `/api/v1/api-keys` | Backend may not exist |
| Live score refresh | Mock data only | No bureau API integration |
| Application submission | Read-only queue display | No POST workflow |
| Report download | Static downloadUrl | No file generation |
| EWS resolution | Console.log handlers | No persistence |
| User authentication | `DEV_BYPASS_AUTH = true` | Auth bypassed in dev |

---

## 9. Visual & Enterprise Readiness Notes

### Enterprise Cues Present

| Cue | Implementation | Location |
|-----|----------------|----------|
| Audit trail | AuditLogsPanel with user, action, timestamp, IP | Settings |
| Data lineage | DataLineagePanel with source, coverage, freshness | Risk |
| Compliance references | SOC 2, FFIEC, SR 11-7 mentioned | Risk, Partner Portal |
| Tenant identification | Tenant ID in metadata fields | Reports, Settings |
| SLA indicators | Timer displays on EWS items | Risk |
| Role-based UI | Roles panel with permission matrix | Settings |
| Environment isolation | Sandbox/Production toggle | Global header |
| Session management | Session timeout warning component | Shared |
| Error boundaries | BffErrorBoundary wrapping components | Customer, Risk |

### Missing Enterprise Signals

| Signal | Current State | Impact |
|--------|---------------|--------|
| Real-time timestamps | "2m ago" static text | No live freshness indicator |
| Confidence intervals | Shown on some metrics | Inconsistent across pages |
| Data freshness badges | Present on Overview | Not universal |
| Model version in predictions | Shown in AI explanations | Not all score displays |
| Consent references | ConsentPanel exists | No inline consent indicators |
| Export governance | No watermarks mentioned | Audit concern |
| Session duration display | SessionTimeoutWarning exists | Not visible in main UI |

### KPI Presentation Consistency

| Aspect | Status |
|--------|--------|
| Trend indicators | Consistent (up/down arrows with color) |
| Percentage formatting | Consistent (1 decimal place) |
| Currency formatting | Consistent ($X.XM, $XK) |
| Score formatting | Consistent (integer display) |
| Date formatting | Mixed ("2m ago" vs "2024-01-15") |
| Card styling | Consistent (rounded-2xl, border, shadow-lg) |
| Color palette | Consistent (green=good, orange=warning, red=bad, blue=primary) |

---

## Summary: Frontend Capabilities vs Implied Expectations

### What the Frontend Can Display

- Complete portfolio overview with 8 enterprise metric cards
- Individual credit intelligence with composite scores and factor breakdown
- Underwriting queue with AI-driven recommendations and 6 daily KPIs
- Risk monitoring across 9 specialized panels (EWS, heatmaps, stress tests)
- Customer management with RHS scoring, lifecycle pipeline, and peer benchmarking
- Analytics with 5 analysis modes and 10 visualization components
- Reports with template library, custom builder, and governance metadata
- Settings across 17 configuration sections
- Notifications with multi-channel preferences

### What the Frontend Expects From Backend

| Expectation | Readiness |
|-------------|-----------|
| BFF endpoints for CRUD operations | Partially implemented (9 edge functions) |
| Real-time portfolio metrics | Not connected (mock data) |
| Bureau data integrations | Not connected (requires credentials) |
| Score calculation engine | Not connected (mock scores) |
| Report generation service | Not connected (static files) |
| Webhook delivery system | Not connected (mock events) |
| Authentication/authorization | Bypassed in development mode |
| Audit event persistence | Edge function exists but not wired |

### Frontend-Backend Alignment Gap

The frontend presents a fully realized enterprise dashboard experience with bank-grade UX patterns, comprehensive filtering, and detailed drill-down capabilities. However, all data is currently served from static mock objects defined in component files. The BFF layer exists structurally but requires:

1. Database seeding with representative SMB data
2. Bureau API credentials for live score pulls
3. Authentication enforcement (disable DEV_BYPASS_AUTH)
4. Webhook infrastructure for real-time events
5. Report generation pipeline for downloadable artifacts

The visual and interactive layer is **pilot-ready** for demonstrations. The data layer requires integration work before production deployment.
