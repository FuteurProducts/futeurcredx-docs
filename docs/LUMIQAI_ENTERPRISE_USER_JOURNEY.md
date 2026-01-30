# LumiqAI Enterprise Dashboard: User Journey Map

This document describes the end-to-end journey of an enterprise user using the dashboard.

---

## 1. Authentication Journey

### 1.1 Login Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Landing Page  │────▶│   Login Page    │────▶│    Dashboard    │
│   (/)           │     │   (/login)      │     │   (/dashboard)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │  Forgot Password│
                        │ (/forgot-pass)  │
                        └─────────────────┘
```

| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | Navigate to `/login` | Display login form with email/password fields |
| 2 | Enter credentials | Validate input format |
| 3 | Click "Login" | Attempt authentication via AuthContext |
| 4a | Success | Redirect to `/dashboard` |
| 4b | Failure | Display error message in red banner |
| 5 | (If needed) Click "Forgot password?" | Navigate to password recovery (dead end - not fully implemented) |

### 1.2 Session Management

| Event | Location | User Experience |
|-------|----------|-----------------|
| Session active | Dashboard | Normal operation |
| Session expiring | Modal overlay | SessionTimeoutWarning with countdown |
| Session extended | Modal | Button click refreshes token |
| Session expired | Any page | Redirect to login |

---

## 2. Dashboard Overview Journey

### 2.1 Initial Landing (Post-Login)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Dashboard                                │
│  ┌──────────┐  ┌─────────────────────────────────────────────┐  │
│  │ Sidebar  │  │              Main Content Area               │  │
│  │          │  │                                             │  │
│  │ Overview │◀─┤  Default: Partner Dashboard Overview        │  │
│  │ Credit   │  │  - API Health Monitor                       │  │
│  │ Under... │  │  - Tabs: Overview | Intelligence | Dev | Activity │
│  │ Risk     │  │  - KPI Cards                                │  │
│  │ Customer │  │  - Charts                                   │  │
│  │ ...      │  │                                             │  │
│  └──────────┘  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

| Step | User Action | Result |
|------|-------------|--------|
| 1 | Arrive at dashboard | Overview tab loads by default |
| 2 | See API Health Monitor | Green "All Systems Operational" indicator |
| 3 | Browse KPI cards | Funnel metrics, conversion rates displayed |
| 4 | Click sub-tabs | Switch between Overview/Intelligence/Developer/Activity |

### 2.2 Navigation Structure

| Sidebar Tab | Route Parameter | Primary Purpose |
|-------------|-----------------|-----------------|
| Dashboard | `?tab=overview` | High-level KPIs, API health |
| Credit Intelligence | `?tab=credit-intel` | Portfolio score distribution, bureau status |
| Underwriting | `?tab=underwriting` | Application pipeline, AI decisioning |
| Risk | `?tab=risk` | EWS alerts, concentration analysis |
| Customer | `?tab=customer` | SMB relationship management |
| API Console | `?tab=api-keys` | Key management, connection catalog |
| Partner Portal | `?tab=partner-portal` | Webhooks, compliance, SLA |
| Analytics | `?tab=analytics` | Portfolio analytics, signal drift |
| Products | `?tab=products` | Product catalog (stub) |
| Users | `?tab=users` | User administration |
| Reports | `?tab=reports` | Report generation, history |
| Settings | `?tab=settings` | Platform configuration |

---

## 3. Investigation Journeys

### 3.1 Customer Investigation Flow

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Customer   │────▶│  Select from    │────▶│  Engagement     │
│  Tab        │     │  List Table     │     │  Panel          │
└─────────────┘     └─────────────────┘     └─────────────────┘
       │                    │                       │
       │                    │                       ▼
       │                    │               ┌─────────────────┐
       │                    │               │  Customer       │
       │                    └──────────────▶│  Dossier Modal  │
       │                                    └─────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   PREREQUISITE                               │
│  User MUST select a portfolio first via PortfolioSelector   │
│  Otherwise: 422 error → "Portfolio Required" message        │
└─────────────────────────────────────────────────────────────┘
```

| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | Navigate to Customer tab | Check for portfolio selection |
| 2a | No portfolio → Error | Show "Select a portfolio to view customers" |
| 2b | Portfolio selected | Fetch customer list from BFF |
| 3 | Click row in list | Populate Engagement Panel with customer details |
| 4 | Click "View Details" | Open Customer Dossier modal |
| 5 | Review RHS, products, history | Static display of relationship health |
| 6 | Close modal | Return to list view |

**Decision Points:**
- Filter by segment, region, relationship stage
- Sort by any column header
- Search by business name

**Dead Ends:**
- "Assign RM" button (UI only, no backend)
- "Add to Campaign" button (UI only)
- Add Note function (logs to console only)

### 3.2 Credit Intelligence Investigation Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Credit Intel   │────▶│  Score          │────▶│  Entity         │
│  Tab            │     │  Distribution   │     │  Selection      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Multi-Bureau   │
                        │  Status         │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Pull Score     │
                        │  Action         │
                        └─────────────────┘
```

| Step | User Action | Result |
|------|-------------|--------|
| 1 | View score distribution chart | See portfolio bucketed by score ranges |
| 2 | Check bureau status | D&B, Experian, Equifax health indicators |
| 3 | Select entity from list | View individual score details |
| 4 | Click "Pull Score" | Trigger bureau data refresh (emits audit event) |

**Decision Points:**
- Choose bureau source (D&B, Experian, Equifax)
- Filter by risk tier

**Dead Ends:**
- Historical score comparison (display only, no drill-down)

### 3.3 Risk Investigation Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Risk Tab       │────▶│  Executive      │────▶│  EWS Work       │
│                 │     │  Summary        │     │  Queue          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                       │
                                                       ▼
                        ┌──────────────────────────────────────────┐
                        │              Queue Actions               │
                        │  • Assign                                │
                        │  • Add Note                              │
                        │  • View Entity                           │
                        │  • Dismiss / Resolve                     │
                        └──────────────────────────────────────────┘
```

| Step | User Action | Result |
|------|-------------|--------|
| 1 | View Executive Summary | CRO-level risk KPIs |
| 2 | Filter EWS queue | By severity: critical/high/medium/low |
| 3 | Expand queue item | See signals, recommended action |
| 4 | Click "View Entity" | Navigate to entity details |
| 5 | Click "Resolve" | Mark alert as resolved |

**Decision Points:**
- Filter by severity
- Search by business name
- Toggle between Queue and Indicators tabs

**Dead Ends:**
- Assign to specific user (logs to console)
- Add Note (logs to console)
- Model Governance changes (display only)

---

## 4. Action Journeys

### 4.1 API Key Management

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  API Console    │────▶│  Generate New   │────▶│  Copy Key       │
│  Tab            │     │  Key            │     │  (One-Time)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Revoke Key     │
                        └─────────────────┘
```

| Step | User Action | Result |
|------|-------------|--------|
| 1 | Enter key name | Enable "Generate" button |
| 2 | Click "Generate" | API call to create key |
| 3 | Copy displayed key | One-time visibility, then masked |
| 4 | Click "Revoke" on existing | Remove key from active list |

**Complete Flow:** This is a fully functional end-to-end flow.

### 4.2 Webhook Configuration

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Partner Portal │────▶│  Webhooks Tab   │────▶│  Add Endpoint   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  • Enter URL    │
                        │  • Select Events│
                        │  • Set Retries  │
                        │  • Create       │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Test / Pause   │
                        │  / Delete       │
                        └─────────────────┘
```

| Step | User Action | Result |
|------|-------------|--------|
| 1 | Click "Add Endpoint" | Open configuration form |
| 2 | Enter HTTPS URL | Validation on HTTPS requirement |
| 3 | Select events | Multi-select from 12 event types |
| 4 | Choose retry policy | 3, 5, or 10 retries |
| 5 | Click "Create Webhook" | Add to endpoints list |
| 6 | Click "Test" | Send test event, toast confirmation |
| 7 | Click Pause/Play | Toggle active status |

**Complete Flow:** This is a fully functional end-to-end flow (mock data).

### 4.3 Report Generation

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Reports Tab    │────▶│  Select Report  │────▶│  Configure      │
│                 │     │  Template       │     │  Parameters     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                       │
                                                       ▼
                                                ┌─────────────────┐
                                                │  Generate       │
                                                │  (Processing)   │
                                                └─────────────────┘
                                                       │
                                                       ▼
                                                ┌─────────────────┐
                                                │  Download       │
                                                │  (PDF/XLSX/CSV) │
                                                └─────────────────┘
```

| Step | User Action | Result |
|------|-------------|--------|
| 1 | Browse report library | Select from templates |
| 2 | Configure parameters | Date range, portfolio, format |
| 3 | Click "Generate" | Job queued, status: pending |
| 4 | Wait for processing | Polling updates status |
| 5 | Click "Download" | Retrieve completed report |

**Partial Flow:** UI complete but backend not wired.

---

## 5. Monitoring Journeys

### 5.1 Portfolio Health Monitoring

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Overview       │────▶│  KPI Cards      │────▶│  Drill-down     │
│  Tab            │     │  (Top Row)      │     │  (Click KPI)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Charts         │
                        │  (Hover/Zoom)   │
                        └─────────────────┘
```

| Monitoring Signal | Location | Update Frequency |
|-------------------|----------|------------------|
| API Health | ApiHealthMonitor | Real-time |
| Score Distribution | Credit Intelligence | On-demand refresh |
| EWS Alerts | Risk Tab | SLA timers update |
| Data Freshness | DataLineageFooter | Color-coded by age |

### 5.2 System Health Monitoring

```
┌─────────────────────────────────────────────────────────────────┐
│                     Header (Persistent)                          │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │ Environment   │  │  Docs Link     │  │  User Account      │  │
│  │ Toggle        │  │                │  │  Dropdown          │  │
│  │ (Sandbox/Prod)│  │                │  │                    │  │
│  └───────────────┘  └────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

| Signal | Component | Status Indicator |
|--------|-----------|------------------|
| Environment | ConnectedEnvironmentToggle | Badge: "Sandbox" or "Production" |
| API Status | Header badge | Green dot + "Operational" |
| User session | Avatar dropdown | Sign out option |

---

## 6. Decision Points Summary

### 6.1 Mandatory Decisions

| Decision | Location | Impact if Skipped |
|----------|----------|-------------------|
| Select Portfolio | Any data page | 422 error, PortfolioSelector displayed |
| Accept Session Extension | Timeout modal | Session terminates |

### 6.2 Optional Decisions

| Decision | Location | Default Behavior |
|----------|----------|------------------|
| Filter by segment | Customer tab | All segments shown |
| Sort order | Any table | Default column, descending |
| Time window | Global controls | 30 days |
| View mode (table/cards) | Underwriting | Table view |
| Report format | Report config | PDF |

---

## 7. Dead Ends and Unclear Transitions

### 7.1 Non-Functional Actions (UI Only)

| Action | Location | Current State |
|--------|----------|---------------|
| "Assign RM" | Customer list bulk actions | Logs to console |
| "Add to Campaign" | Customer list bulk actions | Logs to console |
| "Add Note" | Customer dossier, EWS queue | Logs to console |
| "Assign" (EWS) | EWS queue item | UI only, no backend |
| "Resolve"/"Dismiss" (EWS) | EWS queue item | UI only, no backend |
| "Re-authenticate" | Data Sources panel | UI only |
| "Sync Now" | Data Sources panel | UI only |
| Stress scenario runner | Risk tab | Display only |

### 7.2 Incomplete Navigation Paths

| Path | Issue |
|------|-------|
| Forgot Password → Recovery | No complete recovery flow visible |
| KPI card → Drill-down | Click opens tooltip, not separate view |
| Score bucket → Entity list | No entity-level navigation from chart |
| Alert → Full entity view | "View Entity" logs but doesn't navigate |
| Report download → Open file | Download not wired to backend |

### 7.3 Missing Feedback Loops

| Action | Expected Feedback | Current State |
|--------|-------------------|---------------|
| Bulk export selected | Progress indicator | None |
| Report generation | Email notification | Not implemented |
| EWS resolution | Confirmation toast | None |
| Webhook test | Success/failure details | Toast only |

### 7.4 Unclear State Transitions

| Transition | Ambiguity |
|------------|-----------|
| Customer prospect → new | No visible conversion action |
| Application review → approved | Decision UI present but not wired |
| Alert acknowledged → resolved | SLA timer stops but no confirmation |
| Report processing → ready | No notification, requires refresh |

---

## Summary: Journey Completeness

### Fully Functional Journeys

| Journey | Status | Notes |
|---------|--------|-------|
| Login → Dashboard | ✓ Complete | Auth via Supabase |
| API Key Management | ✓ Complete | Create, revoke, view usage |
| Navigation between tabs | ✓ Complete | URL-synced tab state |
| Environment toggle | ✓ Complete | Sandbox/Production switch |
| Session timeout handling | ✓ Complete | Warning modal with extension |
| Sidebar collapse/expand | ✓ Complete | Responsive, remembers state |

### Partially Functional Journeys

| Journey | Status | Gap |
|---------|--------|-----|
| Customer investigation | ◐ Partial | Dossier actions log only |
| Credit score viewing | ◐ Partial | Pull score not wired |
| EWS alert handling | ◐ Partial | Resolve/dismiss log only |
| Report generation | ◐ Partial | Download not functional |
| Webhook management | ◐ Partial | Mock data, no persistence |
| Settings configuration | ◐ Partial | Display only, no save |

### Display-Only Journeys (No Backend)

| Journey | Status |
|---------|--------|
| Analytics pillar deep-dives | ○ Display only |
| Risk model governance | ○ Display only |
| Stress scenario simulation | ○ Display only |
| User role management | ○ Display only |
| Audit log search | ○ Display only |
| Data source management | ○ Display only |

### Journey Maturity Matrix

| Stage | Count | Examples |
|-------|-------|----------|
| **Production-Ready** | 5 | Login, Navigation, API Keys, Environment Toggle, Session |
| **Demo-Ready** | 8 | Customer list, Score view, EWS display, Reports, Webhooks, Settings panels |
| **Scaffold Only** | 4 | Products, Analytics drill-down, Stress testing, Role management |

### Critical Path Gaps

1. **No action feedback loops** - Most actions log to console without user confirmation
2. **No persistence for config changes** - Settings, preferences not saved
3. **No cross-page navigation** - Clicking entity in one view doesn't open in another
4. **No notification system** - Report completion, alert escalation have no push notifications
5. **No undo/cancel patterns** - Actions are immediate with no rollback option
