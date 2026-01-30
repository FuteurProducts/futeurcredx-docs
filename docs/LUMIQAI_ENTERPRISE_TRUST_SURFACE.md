# LumiqAI Enterprise Dashboard: Trust Surface Analysis

This document captures all trust, audit, and reliability signals visible in the enterprise dashboard UI.

---

## 1. Audit Signals

### 1.1 Timestamps Visible in UI

| Component | Timestamp Display | Format | Location |
|-----------|-------------------|--------|----------|
| DataLineageFooter | "Updated X ago" | Relative (mins/hours/days) | Bottom of data-bound pages |
| Audit Logs Table | Full timestamp | "MMM DD, HH:MM:SS" | Settings > Audit Logs |
| Access Events | Relative time | "Xm ago", "Xh ago" | Risk > Audit Controls |
| Permission Changes | Relative time | "Xm ago", "Xh ago" | Risk > Audit Controls |
| Report History | Completed timestamp | Formatted date | Reports tab |
| Score History | Pull timestamp | Date format | Credit Intelligence |
| Webhook Deliveries | Delivery timestamp | Formatted date | Partner Portal > Webhooks |
| Model Governance | Deployed date | Date format | Risk > Model Governance |
| Model Governance | Last validated date | Date format | Risk > Model Governance |
| Model Governance | Next validation due | Date format | Risk > Model Governance |
| Data Sources | Last sync time | Relative time | Data Lineage Panel |

### 1.2 Event Histories Visible

| Event Log | Location | Fields Shown | Searchable | Exportable |
|-----------|----------|--------------|------------|------------|
| Audit Logs | Settings > Audit Logs | User, Action, Resource, Timestamp, IP | Yes | Yes (CSV) |
| Access Events | Risk > Audit Controls | User, Action, Resource, Sensitivity, IP, Time | Filterable by sensitivity | Not shown |
| Permission Changes | Risk > Audit Controls | User, Changed By, Permission, Change Type, Time | No | Not shown |
| Activity Feed | Overview | Type, Title, Description, Business, Timestamp | No | Not shown |
| Webhook Deliveries | Partner Portal | Event, Status, Response Code, Attempts | No | Not shown |
| Report History | Reports | Report Type, Status, Created, Completed | Searchable | Downloadable artifacts |

### 1.3 Log/Trace Categories

| Category | Tab Shown | Purpose |
|----------|-----------|---------|
| Access Logs | Settings > Audit Logs | Track who accessed what |
| Change Logs | Settings > Audit Logs | Track data modifications |
| Export Logs | Settings > Audit Logs | Track data exports |
| Sensitive Access | Risk > Audit Controls | PII and high-sensitivity access |
| Permission Changes | Risk > Audit Controls | Role and permission modifications |

### 1.4 Audit Action Types Displayed

| Action Type | Color Code | Category |
|-------------|------------|----------|
| `user.created` | Green | Change |
| `user.deleted` | Red | Change |
| `api_key.created` | Blue | Change |
| `api_key.revoked` | Amber | Change |
| `settings.updated` | Purple | Change |
| `report.exported` | Cyan | Export |
| `customer.viewed` | Gray | Access |
| `role.updated` | Indigo | Change |
| `view` | Blue | Access |
| `export` | Amber | Access |
| `modify` | Violet | Access |
| `delete` | Rose | Access |

---

## 2. Data Freshness Signals

### 2.1 Last Updated Indicators

| Location | Component | Format | Color Coding |
|----------|-----------|--------|--------------|
| Data-bound pages footer | DataLineageFooter | "Updated X ago" | Green (<1h), Yellow (1-24h), Red (>24h) |
| Portfolio KPI Tiles | Individual tiles | "Updated X ago" | Text only (gray) |
| API Usage Card | Header badge | "Last 30 days" | Static label |
| Data Freshness Card | Progress ring | Percentage fresh | Green (>90%), Amber (70-90%), Red (<70%) |
| Data Sources Grid | Per-source row | "Last sync: X" | Status dot (green/amber/red) |
| Credit Scores | Pull timestamp | "Pulled at" | No color |

### 2.2 Refresh Controls

| Location | Control Type | Behavior |
|----------|--------------|----------|
| DataLineageFooter | Refresh button | Click to refetch data from BFF |
| Data Freshness Card | "Refresh All" button | Triggers batch data refresh |
| Customer Dossier | Pull Score button | Triggers bureau score pull |
| Score History | Refresh icon | Refetches score list |
| Report status | Polling | Auto-polls until complete/failed |

### 2.3 Staleness Warnings

| Indicator | Component | Threshold | Visual Treatment |
|-----------|-----------|-----------|------------------|
| Clock icon color | DataLineageFooter | 1h / 24h | Green → Yellow → Red |
| Freshness ring | Data Freshness Card | 90% / 70% | Progress color change |
| Status dot | Data Sources Grid | Connection status | Green (connected), Amber (degraded), Red (disconnected) |
| Critical count | Data Freshness Card | >7 days old | Red box with count |
| Stale count | Data Freshness Card | 1-7 days old | Amber box with count |

### 2.4 Data Freshness Breakdown (Data Freshness Card)

| Category | Threshold | Icon | Color |
|----------|-----------|------|-------|
| Fresh | <24 hours | CheckCircle | Green |
| Stale | 1-7 days | Clock | Amber |
| Critical | >7 days | AlertCircle | Red |

---

## 3. Confidence & Explainability Signals

### 3.1 Tooltips

| Component | Tooltip Content | Trigger |
|-----------|-----------------|---------|
| Portfolio KPI Tiles | Definition of metric + data source | Hover on info icon |
| Relationship Health Score | Composite calculation explanation | Hover on info icon |
| Score Distribution buckets | Count and percentage | Chart hover |
| Risk Drivers | Driver description + affected accounts | Hover on row |
| Signal Drift status | Signal health explanation | Hover on status badge |
| Feature Importance bars | Trend and category | Hover on bar |
| Model status indicators | Model health explanation | Hover on status |

### 3.2 Confidence Scores Displayed

| Metric | Location | Format | Range |
|--------|----------|--------|-------|
| AI Accuracy | Underwriting Metrics | Percentage | 0-100% |
| Model Outcome Variance | Model Governance | Percentage deviation | +/- % |
| Signal Drift Score | Signal Drift Monitor | Decimal vs threshold | 0-1 |
| Data Coverage | Data Lineage Panel | Percentage | 0-100% |
| Reconciliation Status | Data Lineage Panel | OK/Warning/Error | Enum |

### 3.3 Explanatory Text Present

| Location | Explanation Type | Content |
|----------|------------------|---------|
| Model Governance Header | Compliance reference | "SR 11-7 compliant model risk management" |
| Audit Controls Header | Compliance reference | "FFIEC-compliant access monitoring" |
| Executive Risk Summary | Context | "CRO-level portfolio health overview" |
| Feature Drift section | Explanation | "(Top drifting signals)" |
| Score Migration Matrix | Summary stats | Upgraded %, Downgraded %, Stable % |
| Deterioration Drivers | Description | "Model explainability at portfolio level" |
| Data Lineage Panel | Context | "Source coverage, freshness, and provenance" |

### 3.4 Model Explainability Elements

| Element | Component | Information Shown |
|---------|-----------|-------------------|
| Feature Importance | Analytics (Signals) | Feature name, importance %, category, trend |
| Risk Drivers | Risk Intelligence | Driver name, impact %, affected count, trend |
| Deterioration Drivers | Executive Risk Summary | Driver name, impact %, accounts, trend direction |
| Outcome Monitoring | Model Governance | Expected vs Actual with variance |
| Feature Drift | Model Governance | Drift score vs threshold with status |

---

## 4. Security & Access Signals

### 4.1 Role Indicators

| Indicator | Location | Format |
|-----------|----------|--------|
| Role selection | Roles Panel | List with active highlight |
| Permission matrix | Roles Panel | Check/X icons per role per permission |
| User role badge | Users table | Role name in column |
| Role labels displayed | Roles Panel | super_admin, admin, developer, risk_analyst, relationship_manager, readonly |

### 4.2 Permission Cues

| Cue | Component | Behavior |
|-----|-----------|----------|
| CheckCircle icon | Roles Panel matrix | Permission granted (green) |
| XCircle icon | Roles Panel matrix | Permission denied (gray) |
| GRANT badge | Permission Changes | Green badge for new permission |
| REVOKE badge | Permission Changes | Red badge for removed permission |
| MODIFY badge | Permission Changes | Blue badge for changed permission |
| SENSITIVE tag | Access Events | Red badge for high-sensitivity access |

### 4.3 Restricted Action Indicators

| Indicator | Location | Meaning |
|-----------|----------|---------|
| Disabled Save button | Roles Panel | No unsaved changes |
| API Key revoked status | API Keys table | Key no longer valid |
| Webhook inactive status | Webhooks list | Subscription disabled |
| MFA badge | Audit Controls | "MFA ON" (green) or "MFA OFF" (red) |
| SSO badge | Audit Controls | "SSO Enabled" (green) or "SSO Disabled" (gray) |
| IP Address logged | Audit logs, Access events | Source IP for access tracing |

### 4.4 Session Security Signals

| Signal | Component | Behavior |
|--------|-----------|----------|
| Session expiring warning | SessionTimeoutWarning modal | Modal with countdown |
| Minutes remaining | SessionTimeoutWarning | Numeric countdown |
| Extend Session button | SessionTimeoutWarning | Refreshes session token |
| Log Out button | SessionTimeoutWarning | Explicit logout action |

### 4.5 Access Control Statistics (Visible)

| Statistic | Location | Purpose |
|-----------|----------|---------|
| Access Events (24h) | Audit Controls | Total access count |
| Exports (24h) | Audit Controls | Data export tracking |
| Sensitive Data Access | Audit Controls | High-risk access count (amber) |
| Permission Changes | Audit Controls | Role modification count |

### 4.6 API Security Signals

| Signal | Component | Information |
|--------|-----------|-------------|
| Key prefix display | API Keys table | First characters of key (e.g., "lum_...") |
| Environment badge | API Keys table | Production vs Sandbox |
| Scopes list | API Keys table | Permissions granted to key |
| Rate limit display | API Keys table | Requests per minute |
| Expires at | API Keys table | Expiration date |
| Last used | API Keys table | Last activity timestamp |
| Revoked status | API Keys table | Whether key is active |

---

## 5. Data Source & Lineage Signals

### 5.1 Data Source Attribution

| Component | Sources Displayed | Format |
|-----------|-------------------|--------|
| DataLineageFooter | Data source names | Comma-separated list |
| Portfolio KPI Tiles | Individual source | "Source: [name]" in tooltip |
| Data Lineage Panel | Full source grid | Name, type, coverage, freshness, status |

### 5.2 Source Health Indicators

| Status | Visual | Color | Meaning |
|--------|--------|-------|---------|
| Connected | Dot | Green | Source operational |
| Degraded | Dot | Amber | Source with issues |
| Disconnected | Dot | Red | Source unavailable |

### 5.3 Source Metrics Displayed

| Metric | Format | Purpose |
|--------|--------|---------|
| Coverage % | Percentage | Data completeness |
| Median Age | Duration | Data freshness |
| Record Count | Number (K/M) | Volume indicator |
| Error Rate % | Percentage | Reliability indicator |
| Last Sync | Relative time | Recency |

### 5.4 Reconciliation Status

| Status | Color | Icon |
|--------|-------|------|
| OK | Green | CheckCircle |
| Warning | Amber | AlertCircle |
| Error | Red | AlertCircle |

---

## 6. Missing Field Transparency

| Signal | Component | Information |
|--------|-----------|-------------|
| Missing field list | Data Lineage Panel | Field name, missing %, impact level, affected models |
| Impact level indicator | Data Lineage Panel | Color bar (red=high, amber=medium, blue=low) |
| Affected models | Data Lineage Panel | List of models impacted |

---

## Summary: Enterprise Trust Signals Present vs Missing

### Trust Signals Present

| Category | Signals Available |
|----------|-------------------|
| **Audit Trail** | Comprehensive audit logs with user, action, resource, timestamp, IP address; categorized by access/change/export |
| **Data Freshness** | Color-coded freshness indicators, relative timestamps, refresh controls, freshness percentages |
| **Session Security** | Timeout warnings, session extension, MFA status, SSO status |
| **Role Visibility** | Permission matrix, role labels, grant/revoke tracking |
| **Data Lineage** | Source attribution, coverage metrics, reconciliation status |
| **Model Governance** | SR 11-7 reference, validation dates, drift monitoring, outcome monitoring |
| **Access Monitoring** | Sensitivity filtering, IP logging, export tracking |
| **API Security** | Key prefixes, environment separation, scope display, rate limits |

### Trust Signals Missing or Incomplete

| Category | Missing Signal | Impact |
|----------|----------------|--------|
| **Audit Completeness** | No signature/hash verification on audit entries | Audit trail mutability concern |
| **Audit Retention** | No visible retention policy or purge schedule | Compliance uncertainty |
| **Data Freshness** | No SLA indicators for expected refresh times | User expectation gap |
| **Data Freshness** | No historical freshness trend | No visibility into degradation patterns |
| **Confidence** | No confidence intervals on predictive metrics | Precision ambiguity |
| **Confidence** | No model version displayed on scores | Model lineage gap |
| **Confidence** | No statistical significance on feature importance | Explainability depth |
| **Security** | No visible session duration/timeout configuration | User awareness gap |
| **Security** | No IP allowlist visibility in user-facing UI | Access restriction transparency |
| **Security** | No certificate/mTLS indicators | API security depth |
| **Data Lineage** | No consent reference visible | Regulatory transparency |
| **Data Lineage** | No transformation chain visible | Data provenance depth |
| **Model Governance** | No model version comparison UI | Version management |
| **Model Governance** | No champion/challenger status | Model lifecycle visibility |
| **Compliance** | No compliance certification badges visible | Trust assertion gap |
| **Compliance** | No SOC 2 / FFIEC attestation display | External validation missing |
| **Error Context** | No correlation IDs for support escalation | Debugging friction |
| **Error Context** | No retry count visibility for failed operations | Operation transparency |

### Trust Signal Maturity Assessment

| Tier | Category | Assessment |
|------|----------|------------|
| **Strong** | Audit logging structure | Well-organized with action types, filtering, export |
| **Strong** | Data freshness visualization | Color-coded, multiple granularity levels |
| **Strong** | Role-based access visibility | Clear permission matrix with visual indicators |
| **Moderate** | Model governance | Dates and drift shown, but no version comparison |
| **Moderate** | Data lineage | Sources shown, but no transformation visibility |
| **Moderate** | Session security | Timeout warning exists, but no configuration visibility |
| **Weak** | Compliance certification | No visible attestations or badges |
| **Weak** | Confidence quantification | No intervals or significance indicators |
| **Weak** | Error traceability | No correlation IDs or retry visibility |
