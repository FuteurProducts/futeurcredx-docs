# Shared Demo Data Exports — API Mapping Reference

**Last Updated**: 2026-02-12
**Purpose**: Comprehensive mapping of all demo data exports to BFF endpoint contracts for API integration.

---

## Table of Contents

1. [Customer Domain](#customer-domain)
2. [Customer Page Domain](#customer-page-domain)
3. [Credit Signals Domain](#credit-signals-domain)
4. [Risk Domain](#risk-domain)
5. [Underwriting Domain](#underwriting-domain)
6. [Fallback/Dashboard Domain](#fallbackdashboard-domain)
7. [Demo Data Registry](#demo-data-registry)
8. [Demo Data Store (Session State)](#demo-data-store-session-state)
9. [Type Transformations](#type-transformations)
10. [Integration Patterns](#integration-patterns)

---

## Customer Domain

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/customerDemoData.ts`

### Export: `CUSTOMER_DEMO_DATA`

**Type**: `CustomerDemoRecord[]`

**BFF Mapping**: `GET /api/v1/customers` (list endpoint)

**Record Count**: 41 businesses (biz-001 through biz-041)

**Type Shape**:

```typescript
interface CustomerDemoRecord {
  id: string;                // "biz-001"
  businessName: string;      // "Stellar Dynamics LLC"
  legalName: string;         // "Stellar Dynamics LLC"
  industry: string;          // "Technology Services"
  naicsCode: string;         // "541511"
  city: string;              // "Austin"
  state: string;             // "TX"
  annualRevenue: number;     // 3400000
  employeeCount: number;     // 42
  yearsInBusiness: number;   // 7
  riskTier: 'low' | 'medium' | 'high';
  segment: 'micro' | 'small' | 'mid-market';
  region: string;            // "Southwest"
  relationshipStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
  rhs: number;               // 82 (Relationship Health Score)
  rhsChange: number;         // 3
  products: string[];        // ['loc', 'cards', 'deposits']
  primaryProduct: string;    // "Line of Credit"
  assignedRM: string;        // "Sarah Mitchell"
  depositBalance: number;    // 429400
  totalExposure: number;     // 250000
  productCount: number;      // 3
  lastActivity: string;      // "2026-01-28" (ISO date string)
}
```

**Sample Record** (biz-001):

```json
{
  "id": "biz-001",
  "businessName": "Stellar Dynamics LLC",
  "legalName": "Stellar Dynamics LLC",
  "industry": "Technology Services",
  "naicsCode": "541511",
  "city": "Austin",
  "state": "TX",
  "annualRevenue": 3400000,
  "employeeCount": 42,
  "yearsInBusiness": 7,
  "riskTier": "low",
  "segment": "small",
  "region": "Southwest",
  "relationshipStage": "growing",
  "rhs": 82,
  "rhsChange": 3,
  "products": ["loc", "cards", "deposits"],
  "primaryProduct": "Line of Credit",
  "assignedRM": "Sarah Mitchell",
  "depositBalance": 429400,
  "totalExposure": 250000,
  "productCount": 3,
  "lastActivity": "2026-01-28"
}
```

**Distribution Targets** (design spec):
- **Segment**: ~10 micro, ~14 small, ~12 mid-market
- **Region**: 7-8 per region (Northeast, Southeast, Midwest, Southwest, West)
- **Stage**: 4 prospect, 7 new, 11 growing, 9 mature, 5 at-risk
- **Products**: Every product ID appears on ≥6 customers

**Product Filter IDs**: `loc`, `cards`, `sba`, `cre`, `equipment`, `auto`, `merchant`, `deposits`

**Transformation Logic**: None — direct API mapping

---

## Customer Page Domain

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/customerPageDemoData.ts`

### Export: `MOCK_CUSTOMERS`

**Type**: `CustomerEntity[]`

**BFF Mapping**: `GET /api/v1/customers/page-view` (lightweight UI view)

**Record Count**: 8 businesses (demo page subset)

**Type Shape**:

```typescript
interface CustomerEntity {
  id: string;
  businessName: string;
  industry: string;
  naicsCode: string;
  segment: 'micro' | 'small' | 'mid-market';
  region: string;
  branch: string;             // NEW: "NYC Downtown"
  rhs: number;
  rhsChange: number;
  primaryProduct: string;
  products: string[];         // Display names: ["Checking", "Savings", "LOC"]
  riskTier: 'low' | 'medium' | 'high';
  relationshipStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
  lastActivity: string;
  assignedRM: string;
  totalExposure: number;
  depositBalance: number;
  productCount: number;
}
```

**Key Differences from `CustomerDemoRecord`**:
- Adds `branch` field (branch location)
- `products` array uses display names (not filter IDs)
- No `legalName`, `city`, `state`, `annualRevenue`, `employeeCount`, `yearsInBusiness`

**Sample Record** (id: "1"):

```json
{
  "id": "1",
  "businessName": "Apex Construction LLC",
  "industry": "Construction",
  "naicsCode": "236220",
  "segment": "small",
  "region": "Northeast",
  "branch": "NYC Downtown",
  "rhs": 88,
  "rhsChange": 12,
  "primaryProduct": "LOC",
  "products": ["Checking", "Savings", "LOC", "Credit Card"],
  "riskTier": "low",
  "relationshipStage": "growing",
  "lastActivity": "2024-01-15",
  "assignedRM": "Sarah Chen",
  "totalExposure": 485000,
  "depositBalance": 485000,
  "productCount": 4
}
```

---

### Export: `MOCK_HEALTH_SUMMARY`

**Type**: Object (singleton)

**BFF Mapping**: `GET /api/v1/customers/health-summary`

**Shape**:

```typescript
{
  avgRHS: number;                  // 74
  rhsTrend: number;                // 2.3 (percentage change)
  growingPercentage: number;       // 28 (% of customers in "growing" stage)
  growingTrend: number;            // 4.1
  atRiskPercentage: number;        // 12
  atRiskTrend: number;             // -1.8
  crossSellPenetration: number;    // 42
  crossSellTrend: number;          // 3.2
  topOpportunities: Array<{
    id: string;
    businessName: string;
    opportunity: string;           // "LOC Expansion"
    estimatedValue: number;        // 2400000
  }>;
  rhsTrendData: Array<{
    date: string;                  // "Jul"
    value: number;                 // 68
  }>;
}
```

---

### Export: `MOCK_LIFECYCLE_STAGES`

**Type**: Array of lifecycle stage summaries

**BFF Mapping**: `GET /api/v1/customers/lifecycle-stages`

**Shape**:

```typescript
Array<{
  id: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
  label: string;
  count: number;
  avgRHS: number;
  avgRevenue: number;
  avgProductCount: number;
  trend: number;
}>
```

**Sample Entry**:

```json
{
  "id": "new",
  "label": "New",
  "count": 186,
  "avgRHS": 68,
  "avgRevenue": 45000,
  "avgProductCount": 1.8,
  "trend": 12.4
}
```

---

### Export: `MOCK_RECOMMENDATIONS`

**Type**: Array of next-best-action recommendations

**BFF Mapping**: `GET /api/v1/customers/{id}/recommendations`

**Shape**:

```typescript
Array<{
  id: string;
  type: 'loc-increase' | 'pre-qualify' | 'merchant-migration';
  title: string;
  description: string;
  rationale: string[];
  confidenceScore: number;        // 0-100
  riskAdjustedConfidence: number; // 0-100
  estimatedRevenueImpact: number;
  priority: 'high' | 'medium' | 'low';
  expiresIn?: string;             // "5 days" (optional)
}>
```

**Sample Entry**:

```json
{
  "id": "1",
  "type": "loc-increase",
  "title": "Increase Line of Credit by 60%",
  "description": "Based on strong cash flow and low utilization, recommend increasing LOC from $75K to $120K.",
  "rationale": [
    "Cash flow stability improved 23% YoY",
    "Current LOC utilization at 28% (well below 50% threshold)",
    "Deposit balance grew 15% last quarter"
  ],
  "confidenceScore": 92,
  "riskAdjustedConfidence": 87,
  "estimatedRevenueImpact": 45000,
  "priority": "high",
  "expiresIn": "5 days"
}
```

---

## Credit Signals Domain

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/creditSignalsData.ts`

**Architecture**: Signal-based credit intelligence (replaces composite score model)

### Export: `getBusinessSignalProfile(businessId, businessName?)`

**Type**: Function returning `BusinessSignalProfile`

**BFF Mapping**: `GET /api/v1/credit/signals/{businessId}`

**Pre-populated Business IDs**: `biz-001`, `biz-002`

**Fallback**: Returns `defaultProfile()` for unmapped IDs

**Type Shape**:

```typescript
interface BusinessSignalProfile {
  businessId: string;
  businessName: string;
  industry: string;
  signals: CreditSignal[];
  bureauIndicators: BureauIndicator[];
  productReadiness: ProductReadinessItem[];
  trajectoryEvents: TrajectoryEvent[];
}
```

---

### Type: `CreditSignal`

**BFF Field**: `signals` array

```typescript
interface CreditSignal {
  id: string;                     // "s1"
  name: string;                   // "Payment Behavior"
  category: string;               // "Trade Credit"
  status: 'strong' | 'stable' | 'weak';
  direction: 'improving' | 'stable' | 'worsening';
  detail: string;                 // "98.2% on-time across 12 active trade lines"
  source: string;                 // "D&B Trade Tape"
  lastUpdated: string;            // "2026-01-28T10:00:00Z"
}
```

**Sample Signal** (biz-001):

```json
{
  "id": "s1",
  "name": "Payment Behavior",
  "category": "Trade Credit",
  "status": "strong",
  "direction": "improving",
  "detail": "98.2% on-time across 12 active trade lines",
  "source": "D&B Trade Tape",
  "lastUpdated": "2026-01-28T10:00:00Z"
}
```

**Signal Categories**:
- Trade Credit
- Financial
- Banking
- Secured
- Personal Guarantor

---

### Type: `BureauIndicator`

**BFF Field**: `bureauIndicators` array

```typescript
interface BureauIndicator {
  id: string;
  name: string;                   // "D&B PAYDEX"
  provider: string;               // "Dun & Bradstreet"
  value: string;                  // "78 / 100"
  interpretation: string;         // "Above median for SIC 5411"
  asOfDate: string;               // "2026-01-15"
}
```

**Providers**: `Dun & Bradstreet`, `Experian`, `FICO / SBA`

---

### Type: `ProductReadinessItem`

**BFF Field**: `productReadiness` array

```typescript
interface ProductReadinessItem {
  productId: string;              // "loc"
  productName: string;            // "Business Line of Credit ($250K)"
  facilitySize: string;           // "$250,000"
  readiness: 'likely' | 'borderline' | 'unlikely';
  qualifyingSignal: string;       // "Strong cash flow, DSCR 1.8x"
  concern: string;                // "Guarantor FICO trending down"
}
```

**Product IDs**: `loc`, `sba`, `cre`, `equipment`, `cards`, `auto`

---

### Type: `TrajectoryEvent`

**BFF Field**: `trajectoryEvents` array (chronological activity log)

```typescript
interface TrajectoryEvent {
  id: string;
  date: string;                   // "2026-01-25" (ISO date)
  description: string;            // "New trade line opened — supplier credit $45K"
  sentiment: 'positive' | 'neutral' | 'negative';
  source: string;                 // "D&B Trade Tape"
}
```

---

### Export: `getAllProfiledBusinessIds()`

**Type**: Function returning `string[]`

**Returns**: `['biz-001', 'biz-002']`

**Usage**: Check if a business has explicit signal data before calling `getBusinessSignalProfile()`

---

## Risk Domain

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/riskDemoData.ts`

**Purpose**: Demo/mock data for Risk Intelligence tab (9 sections)

---

### Export: `INITIAL_PORTFOLIO_FILTER`

**Type**: `PortfolioFilter`

**BFF Mapping**: Default filter state for `POST /api/v1/risk/filter`

```typescript
interface PortfolioFilter {
  product: string[];
  segment: string[];
  region: string[];
  relationshipStage: string[];
  riskTier: string[];
}
```

**Default Value**: All arrays empty (`[]`)

---

### Export: `INITIAL_RISK_LENSES`

**Type**: `RiskLens[]`

**BFF Mapping**: Default lens configuration for risk view toggles

```typescript
interface RiskLens {
  id: 'credit' | 'cashflow' | 'bureau' | 'fraud' | 'model_drift';
  label: string;
  active: boolean;
}
```

**Default State**:
- `credit`: active
- `cashflow`: active
- `bureau`, `fraud`, `model_drift`: inactive

---

### Export: `RISK_KPIS`

**Type**: `RiskKPI[]`

**BFF Mapping**: `GET /api/v1/risk/kpis`

**Record Count**: 6 KPIs

```typescript
interface RiskKPI {
  id: string;                     // "portfolio_risk_score"
  label: string;                  // "Portfolio Risk Indicator"
  value: string | number;         // 724 or "1.2%"
  change: number;                 // -12
  changeLabel: string;            // "from 736 last month"
  trend: 'up' | 'down' | 'stable';
  trendIsGood: boolean;
  sparklineData?: Array<{         // Optional mini trend
    value: number;
  }>;
}
```

**Sample KPI**:

```json
{
  "id": "portfolio_risk_score",
  "label": "Portfolio Risk Indicator",
  "value": 724,
  "change": -12,
  "changeLabel": "from 736 last month",
  "trend": "down",
  "trendIsGood": false,
  "sparklineData": [
    { "value": 752 },
    { "value": 748 },
    { "value": 742 },
    { "value": 738 },
    { "value": 736 },
    { "value": 724 }
  ]
}
```

**KPI IDs**: `portfolio_risk_score`, `expected_loss`, `unexpected_loss`, `var_confidence`, `concentration_risk`, `stress_test`

---

### Export: `DETERIORATION_DRIVERS`

**Type**: `DeteriorationDriver[]`

**BFF Mapping**: `GET /api/v1/risk/deterioration-drivers`

```typescript
interface DeteriorationDriver {
  driver: string;                 // "Payment Behavior"
  impact: number;                 // 34 (percentage contribution)
  affectedAccounts: number;       // 847
  trend: 'up' | 'down' | 'stable';
}
```

---

### Export: `RISK_TREND_DATA`

**Type**: Object with 4 trend series

**BFF Mapping**: `GET /api/v1/risk/trends`

```typescript
{
  deteriorations: Array<{ date: string; value: number }>;
  delinquencies: Array<{ date: string; value: number }>;
  cashflowStress: Array<{ date: string; value: number }>;
  bureauDrops: Array<{ date: string; value: number }>;
}
```

---

### Export: `RISK_HEATMAPS`

**Type**: `HeatmapConfig[]`

**BFF Mapping**: `GET /api/v1/risk/heatmaps`

**Record Count**: 1 heatmap (segment × product)

```typescript
interface HeatmapConfig {
  id: string;                     // "segment_product"
  title: string;
  description: string;
  rows: string[];                 // ["Micro", "Small", "Mid-Market"]
  columns: string[];              // ["LOC", "Working Capital", "Credit Card", "SBA"]
  data: Array<{
    row: string;
    column: string;
    value: number;                // 4.2 (delinquency rate %)
    count: number;                // 1247 (account count)
    exposure: number;             // 12400000
    change: number;               // 0.3 (percentage point change)
  }>;
}
```

---

### Export: `CONCENTRATION_CATEGORIES`

**Type**: `ConcentrationCategory[]`

**BFF Mapping**: `GET /api/v1/risk/concentration`

```typescript
interface ConcentrationCategory {
  id: string;                     // "industry"
  title: string;
  icon: string;                   // Icon identifier
  totalExposure: number;          // 147200000
  totalLimit: number;             // 200000000
  items: Array<{
    id: string;
    name: string;                 // "Retail Trade"
    exposure: number;
    exposureLimit: number;
    utilizationPct: number;       // 91.2
    accountCount: number;
    riskScore: number;
    trend: number;
    breachStatus: 'ok' | 'warning' | 'breach';
    trendToBreachDays?: number;   // Optional: days until breach
  }>;
}
```

**Categories**: `industry`, `geography`

---

### Export: `EWS_INDICATORS`

**Type**: `EWSIndicator[]`

**BFF Mapping**: `GET /api/v1/risk/ews/indicators`

**Record Count**: 4 indicators

```typescript
interface EWSIndicator {
  id: string;
  name: string;                   // "Cash Flow Deterioration"
  description: string;
  threshold: string;              // "15% decline"
  enabled: boolean;
  precision: number;              // 0.82 (model metric)
  recall: number;                 // 0.76
}
```

---

### Export: `EWS_QUEUE_ITEMS`

**Type**: `EWSQueueItem[]`

**BFF Mapping**: `GET /api/v1/risk/ews/queue`

**Record Count**: 2 active alerts

```typescript
interface EWSQueueItem {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'assigned' | 'resolved';
  businessId: string;
  businessName: string;
  primaryDriver: string;          // "Payment Pattern Change"
  driverType: 'payment' | 'utilization' | 'cashflow' | 'bureau';
  signals: string[];              // ["3 late payments", "Utilization 78%"]
  recommendedAction: string;
  exposure: number;
  riskScore: number;
  riskChange: number;
  slaTimer: string;               // "2h remaining"
  slaDue: Date;
  slaBreached: boolean;
  createdAt: Date;
  notes: string[];
}
```

---

### Export: `RISK_MODELS`

**Type**: `ModelInfo[]`

**BFF Mapping**: `GET /api/v1/risk/models`

```typescript
interface ModelInfo {
  id: string;
  name: string;                   // "SMB Risk Indicator v3.2"
  version: string;
  deployedDate: string;
  lastValidationDate: string;
  nextValidationDue: string;
  status: 'ok' | 'warning' | 'error';
  type: 'credit_score' | 'pd' | 'ews';
}
```

---

### Export: `FEATURE_DRIFTS`

**Type**: `FeatureDrift[]`

**BFF Mapping**: `GET /api/v1/risk/models/drift`

```typescript
interface FeatureDrift {
  feature: string;                // "payment_history_ratio"
  driftScore: number;             // 0.12
  threshold: number;              // 0.15
  status: 'ok' | 'warning' | 'critical';
  trend: 'stable' | 'increasing' | 'decreasing';
}
```

---

### Export: `OUTCOME_MONITORING`

**Type**: `OutcomeMonitoring[]`

**BFF Mapping**: `GET /api/v1/risk/models/performance`

```typescript
interface OutcomeMonitoring {
  metric: string;                 // "Gini Coefficient"
  expected: number;               // 0.72
  actual: number;                 // 0.69
  variance: number;               // -0.03
  status: 'ok' | 'warning' | 'critical';
}
```

---

### Export: `RISK_DATA_SOURCES`

**Type**: `DataSource[]`

**BFF Mapping**: `GET /api/v1/risk/data-sources`

```typescript
interface DataSource {
  id: string;
  name: string;                   // "Experian Business"
  type: 'bureau' | 'bank' | 'accounting';
  coverage: number;               // 94 (percentage)
  freshness: string;              // "< 24h"
  medianAge: string;              // "18h"
  recordCount: number;
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  errorRate: number;              // 0.02 (2%)
}
```

---

### Export: `MISSING_FIELDS`

**Type**: `MissingField[]`

**BFF Mapping**: `GET /api/v1/risk/data-quality/missing-fields`

```typescript
interface MissingField {
  field: string;                  // "annual_revenue"
  missingPct: number;             // 12
  impactLevel: 'low' | 'medium' | 'high';
  affectedModels: string[];
}
```

---

### Export: `ACCESS_EVENTS`

**Type**: `AccessEvent[]`

**BFF Mapping**: `GET /api/v1/audit/access`

```typescript
interface AccessEvent {
  id: string;
  userId: string;
  userName: string;
  action: 'view' | 'export' | 'modify';
  resource: string;
  resourceType: 'entity' | 'report' | 'settings';
  timestamp: Date;
  ipAddress: string;
  sensitivityLevel: 'high' | 'medium' | 'low';
}
```

---

### Export: `PERMISSION_CHANGES`

**Type**: `PermissionChange[]`

**BFF Mapping**: `GET /api/v1/audit/permissions`

```typescript
interface PermissionChange {
  id: string;
  userId: string;
  userName: string;
  changedBy: string;
  changeType: 'grant' | 'revoke';
  permission: string;
  timestamp: Date;
}
```

---

### Export: `STRESS_SCENARIOS`

**Type**: `StressScenario[]`

**BFF Mapping**: `GET /api/v1/risk/stress/scenarios`

```typescript
interface StressScenario {
  id: string;                     // "mild_recession"
  name: string;
  type: 'recession' | 'rate_shock' | 'sector_shock';
  severity: 'mild' | 'moderate' | 'severe';
  assumptions: {
    rateChange?: number;          // 1.0 (percentage points)
    revenueDecline?: number;      // 10 (percentage)
    unemploymentIncrease?: number;// 2 (percentage points)
  };
}
```

---

### Export: `MIGRATION_MATRIX`

**Type**: `MigrationMatrix[]`

**BFF Mapping**: `GET /api/v1/risk/stress/migration`

```typescript
interface MigrationMatrix {
  fromTier: 'Low' | 'Medium' | 'High';
  toTier: 'Low' | 'Medium' | 'High';
  currentPct: number;             // 92
  stressedPct: number;            // 78
  delta: number;                  // -14
}
```

---

### Export: `STRESS_IMPACTS`

**Type**: `StressImpact[]`

**BFF Mapping**: `GET /api/v1/risk/stress/impacts`

```typescript
interface StressImpact {
  metric: string;                 // "Expected Loss"
  baseline: number;               // 1.2
  stressed: number;               // 3.8
  change: number;                 // 2.6
  unit: '%' | 'pts' | 'bps';
}
```

---

## Underwriting Domain

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/underwritingDemoData.ts`

**Purpose**: Underwriting Assistant case queue and decision data

---

### Export: `CASES`

**Type**: `CaseApplication[]`

**BFF Mapping**: `GET /api/v1/underwriting/cases`

**Record Count**: 5 cases (CASE-2026-001 through CASE-2026-005)

```typescript
interface CaseApplication {
  id: string;                     // "1"
  caseId: string;                 // "CASE-2026-001"
  companyName: string;
  amount: number;
  productType: string;
  caseStatus: 'pending_review' | 'in_review' | 'conditional' | 'approved' | 'declined';
  assignedAnalyst: string;
  daysInQueue: number;
  slaTarget: number;
  pdBand: string;                 // "PD 1.2-2.0% (Investment Grade Equivalent)"
  industry: string;
  naicsCode: string;
  established: string;            // "2017"
  yearsInBusiness: number;
  ownerName: string;
  ownership: number;              // 85 (percentage)
  address: string;
  tags?: string[];
  signals: SignalSummary[];
  policyChecks: PolicyCheck[];
  benchmarks: ComparativeBenchmark[];
  riskLevel: 'low' | 'moderate' | 'elevated';
  supportingFactors: string[];
  areasOfAttention: string[];
  suggestedNextSteps: string[];
}
```

---

### Type: `SignalSummary`

**BFF Field**: `signals` array

```typescript
interface SignalSummary {
  name: string;                   // "Payment Behavior"
  status: 'strong' | 'stable' | 'weak';
  direction: 'improving' | 'stable' | 'worsening';
  detail: string;                 // "98.2% on-time across 12 trade lines"
}
```

---

### Type: `PolicyCheck`

**BFF Field**: `policyChecks` array

```typescript
interface PolicyCheck {
  id: string;                     // "p1"
  name: string;                   // "Minimum Time in Business"
  result: 'pass' | 'review' | 'fail';
  value: string;                  // "7 years"
  threshold: string;              // "≥ 2 years"
  source: string;                 // "Secretary of State"
}
```

**Sample Policy Checks**:
- Minimum Time in Business
- Revenue Floor
- Owner FICO Floor
- Industry Exclusion
- Collateral Coverage
- UCC Filing Status
- OFAC/BSA Screening
- Debt-to-Income Ratio

---

### Type: `ComparativeBenchmark`

**BFF Field**: `benchmarks` array

```typescript
interface ComparativeBenchmark {
  label: string;                  // "Default Rate (12mo)"
  applicantValue: string;         // "0.0%"
  portfolioPeerAvg: string;       // "1.8%"
  industryPeerAvg: string;        // "2.1%"
}
```

---

### Export: `QUEUE_STATS`

**Type**: Array of stat objects

**BFF Mapping**: `GET /api/v1/underwriting/queue/stats`

```typescript
Array<{
  label: string;
  value: number | string;
  color: string;                  // Tailwind color class
}>
```

**Sample Stats**:
- Pending Review: 23
- In Review: 15
- Conditional: 8
- Approved (MTD): 47
- Declined (MTD): 12
- Avg Days to Decision: "3.8"

---

### Export: `RECOMMENDATION_LABELS`

**Type**: `Record<RecommendationAction, string>`

**BFF Mapping**: Constant labels for recommendation UI

```typescript
type RecommendationAction =
  | 'recommend_approval'
  | 'request_info'
  | 'flag_committee'
  | 'recommend_decline';

const RECOMMENDATION_LABELS = {
  recommend_approval: 'Recommended for Approval',
  request_info: 'Additional Information Requested',
  flag_committee: 'Flagged for Committee Review',
  recommend_decline: 'Decline Recommended',
};
```

---

## Fallback/Dashboard Domain

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/fallback/demoData.ts`

**Purpose**: Centralized demo data for LUMIQ AI Control Tower (dashboard index page)

**Architecture**: Multi-bank data wiring via `ACTIVE_BANK_ID`

---

### Export: `PILOT_CONFIG`

**Type**: Object (singleton)

**BFF Mapping**: `GET /api/v1/config/pilot`

```typescript
{
  bankName: string;               // "JPMorgan Chase" (from ACTIVE_BANK_NAME)
  bankId: string;                 // "CHASE-001"
  pilotStartDate: string;         // "2025-10-01"
  pilotEndDate: string;           // "2026-01-31"
  pilotDurationDays: number;      // 122
  environment: 'sandbox' as const;
}
```

**Bank Resolution Logic**: `BANK_CONFIGS[ACTIVE_BANK_ID] ?? BANK_CONFIGS.chase`

---

### Export: `PILOT_METRICS`

**Type**: Object (bank-specific)

**BFF Mapping**: `GET /api/v1/metrics/pilot`

**Bank Resolution**: `PILOT_METRICS_MAP[ACTIVE_BANK_ID]`

**Shape** (inferred from Chase/Citi/Santander/WF loaders):

```typescript
{
  businessCount: number;          // 6000000
  totalExposure: number;          // 650000000000 ($650B)
  apiCalls: number;               // 927000
  avgLatency: number;             // 138ms
  conversionRate: number;         // 25.0%
  approvalRate: number;           // 75.2%
  // ... additional bank-specific fields
}
```

---

### Export: `DEMO_BUSINESSES`

**Type**: `DemoBusinessEntity[]`

**BFF Mapping**: `GET /api/v1/businesses` (10-record core entity list)

**Bank Resolution**: `DEMO_BUSINESSES_MAP[ACTIVE_BANK_ID]`

**Record Count**: 10 businesses (biz-001 through biz-010)

```typescript
interface DemoBusinessEntity {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  naicsCode: string;
  city: string;
  state: string;
  annualRevenue: number;
  employeeCount: number;
  yearsInBusiness: number;
  lumiqScore: number;             // 82 (0-100 LUMIQ score)
  ownerFico: number;              // 742
  riskTier: 'low' | 'medium' | 'high';
  scoreTrend: 'up' | 'down' | 'stable';
  trendValue: number;             // 3 (change value)
  segment: 'micro' | 'small' | 'mid-market';
  hasActiveApplication: boolean;
  productType?: string;           // "Business Line of Credit"
  applicationAmount?: number;     // 250000
}
```

**Transformation**: `lumiqScore` is LUMIQ 0-100 score (distinct from bureau scores)

---

### Export: `API_TREND_DATA`

**Type**: Array of monthly trend points

**BFF Mapping**: `GET /api/v1/metrics/api-trends`

```typescript
Array<{
  month: string;                  // "Oct"
  calls: number;                  // 680000
  latency: number;                // 152ms
  successRate: number;            // 99.91
}>
```

---

### Export: `CONVERSION_TREND_DATA`

**Type**: Array of monthly conversion metrics

**BFF Mapping**: `GET /api/v1/metrics/conversion-trends`

```typescript
Array<{
  month: string;
  applications: number;
  approved: number;
  conversionRate: number;
  approvalRate: number;
}>
```

---

### Export: `SYSTEM_SERVICES`

**Type**: Array of service health statuses

**BFF Mapping**: `GET /api/v1/system/services`

```typescript
Array<{
  name: string;                   // "Core API"
  status: 'operational' | 'degraded' | 'down';
  latency: number;                // 45ms
  uptime: number;                 // 99.99
  lastCheck: string;              // "1m ago"
}>
```

---

### Export: `RECENT_ACTIVITIES`

**Type**: Array of activity feed items

**BFF Mapping**: `GET /api/v1/activity/recent`

```typescript
Array<{
  id: string;
  type: 'connection' | 'refresh' | 'alert' | 'success';
  title: string;
  description: string;
  businessName?: string;
  timestamp: string;
}>
```

---

### Export: `WEBHOOK_EVENTS`

**Type**: Array of webhook delivery events

**BFF Mapping**: `GET /api/v1/webhooks/events`

```typescript
Array<{
  id: string;
  eventType: string;              // "score.updated"
  status: 'delivered' | 'failed' | 'pending';
  endpoint: string;
  timestamp: string;
  responseTime: number;
}>
```

---

### Export: `WEBHOOK_STATS`

**Type**: Object (singleton)

**BFF Mapping**: `GET /api/v1/webhooks/stats`

```typescript
{
  totalSent: number;              // 48720
  deliveryRate: number;           // 99.7
  avgResponseTime: number;        // 104ms
  failedCount: number;            // 146
}
```

---

### Export: `EnrichedBusiness` (via `getEnrichedBusiness(id)`)

**Type**: Function returning `EnrichedBusiness | undefined`

**BFF Mapping**: `GET /api/v1/businesses/{id}`

**Pre-populated IDs**: `biz-001` through `biz-010`

**Type Shape**:

```typescript
interface EnrichedBusiness {
  id: string;
  rhs: number;                    // 82 (Relationship Health Score)
  rhsChange: number;              // 3
  rhsTrendData: number[];         // [75, 77, 78, 80, 82]
  phone: string;
  email: string;
  website: string;
  owners: DemoBusinessOwner[];
  creditScores: DemoCreditScore[];
  applications: DemoApplication[];
  prequalOffers: DemoPrequalOffer[];
  products: DemoProduct[];
  aiSignals: DemoAISignals;
  activityHistory: DemoActivityEvent[];
  depositBalance: number;
  totalExposure: number;
  relationshipStage: 'prospect' | 'onboarding' | 'active' | 'expansion';
  assignedRM: string;
}
```

**Key Nested Types**:

```typescript
interface DemoBusinessOwner {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  ownershipPct: number;
  ficoScore: number;
}

interface DemoCreditScore {
  source: 'experian_biz' | 'dun_bradstreet' | 'equifax_biz';
  score: number;                  // 780
  riskClass: 'low' | 'moderate' | 'high' | 'very_high';
  factors: string[];
  pulledAt: string;               // ISO timestamp
}

interface DemoApplication {
  id: string;
  appId: string;
  businessId: string;
  businessName: string;
  status: 'submitted' | 'under_review' | 'approved' | 'declined' | 'funded';
  productType: string;
  amount: number;
  submittedAt: string;
  aiRecommendation: 'approve' | 'review' | 'decline' | null;
  confidence: number | null;
  compositeScore: number;
  riskTier: 'low' | 'medium' | 'high';
}

interface DemoPrequalOffer {
  productType: string;
  amountMin: number;
  amountMax: number;
  rateRange: string;              // "7.5% – 9.2%"
  status: 'active' | 'expired' | 'accepted';
}

interface DemoProduct {
  name: string;
  type: string;                   // "deposit", "credit", "service"
  status: 'active' | 'pending' | 'closed';
  balance?: number;
  limit?: number;
  openedDate?: string;
}

interface DemoAISignals {
  tradelines: { score: number; status: 'pass' | 'warning' | 'fail' };
  payments: { score: number; status: 'pass' | 'warning' | 'fail' };
  bankingHealth: { score: number; status: 'pass' | 'warning' | 'fail' };
  identity: { score: number; status: 'pass' | 'warning' | 'fail' };
  positiveFactors: string[];
  riskFactors: string[];
  summary: string;
}

interface DemoActivityEvent {
  date: string;
  type: 'score_pull' | 'application' | 'approval' | 'prequal' | 'payment' | 'alert';
  description: string;
}
```

---

### Export: `formatNumber(n)`

**Type**: Utility function

**Purpose**: Format large numbers for display

**Logic**:
- `n >= 1_000_000` → `"X.XM"`
- `n >= 1_000` → `"X.XK"`
- Otherwise → `n.toString()`

---

### Export: `formatCurrency(n)`

**Type**: Utility function

**Purpose**: Format currency amounts

**Logic**:
- `n >= 1_000_000` → `"$X.XM"`
- `n >= 1_000` → `"$XK"` (no decimals)
- Otherwise → `"$n"`

---

## Demo Data Registry

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/demoDataRegistry.ts`

**Purpose**: Centralized registry mapping BFF service domains to demo data sources

**Architecture**: Single import point for `useBffQuery` integration

---

### Export: `demoRegistry`

**Type**: Const object with domain keys

**Usage Pattern**:

```typescript
const { data } = useBffQuery({
  queryFn: (pid) => campaignsService.list(pid),
  demoData: demoRegistry.campaigns.list,
});
```

**Structure**:

```typescript
export const demoRegistry = {
  overview: {
    pilotMetrics: PILOT_METRICS,
    pilotConfig: PILOT_CONFIG,
  },
  campaigns: {
    list: CAMPAIGNS,
    summary: CAMPAIGN_SUMMARY,
    conversionBySegment: CONVERSION_BY_SEGMENT,
  },
  products: {
    list: mockBankProducts,
  },
  underwriting: {
    queue: UNDERWRITING,
  },
  analytics: {
    portfolioKPIs: mockPortfolioKPIs,
    scoreDistribution: mockScoreDistribution,
    scoreMigration: mockScoreMigration,
    riskDrivers: mockRiskDrivers,
    productPenetration: mockProductPenetration,
    crossSellFunnel: mockCrossSellFunnel,
    applicationFunnel: mockApplicationFunnel,
    featureImportance: mockFeatureImportance,
    signalDrift: mockSignalDrift,
  },
  risk: {
    portfolio: PORTFOLIO,
    kpis: RISK_KPIS,
    tiers: RISK_TIERS,
    concentration: CONCENTRATION,
    ewsClusters: EWS_CLUSTERS,
    compliance: COMPLIANCE,
    segments: SEGMENTS,
    savedSegments: SAVED_SEGMENTS,
    sampleBusinesses: SAMPLE_BUSINESSES,
    filterOptions: FILTER_OPTIONS,
    initialFilter: INITIAL_PORTFOLIO_FILTER,
    initialLenses: INITIAL_RISK_LENSES,
  },
  customers: {
    list: CUSTOMER_DEMO_DATA,
    businesses: DEMO_BUSINESSES,
  },
  notifications: {
    list: DEMO_NOTIFICATIONS,
    summary: DEMO_NOTIFICATION_SUMMARY,
  },
  reports: {
    templates: mockReportTemplates,
    generated: mockGeneratedReports,
    metricTree: mockMetricTree,
  },
  portfolioSegments: {
    kpis: PORTFOLIO_KPIS,
    industrySegments: INDUSTRY_SEGMENTS,
    campaigns: PORTFOLIO_CAMPAIGNS,
    productEligibility: PRODUCT_ELIGIBILITY,
    geographicDistribution: GEOGRAPHIC_DISTRIBUTION,
    riskTierDistribution: RISK_TIER_DISTRIBUTION,
    concentrationMetrics: CONCENTRATION_METRICS,
    ewsAlertClusters: EWS_ALERT_CLUSTERS,
  },
  settings: {
    users: DEMO_PLATFORM_USERS,
  },
  store: demoDataStore,
} as const;
```

---

### Registry Domain: `notifications`

**Self-contained constants** (no external import)

**Exports**:
- `DEMO_NOTIFICATIONS` (array of 5 notification objects)
- `DEMO_NOTIFICATION_SUMMARY` (aggregate counts)

**Type**:

```typescript
Array<{
  id: string;
  type: 'alert' | 'system' | 'workflow' | 'report';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}>
```

---

### Registry Domain: `settings`

**Self-contained constants**

**Exports**:
- `DEMO_PLATFORM_USERS` (array of 5 user objects)

**Type**:

```typescript
Array<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'risk' | 'developer' | 'rm' | 'readonly';
  status: 'active' | 'invited' | 'suspended';
  lastLogin: string | null;
  createdAt: string;
}>
```

---

## Demo Data Store (Session State)

**File**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/demoDataStore.ts`

**Purpose**: Singleton module for mutable session state (not React context)

**Storage**: localStorage key `lumiq_demo_session`

---

### Architecture

**Singleton Pattern**:
- Module-level state (not React)
- Persists to localStorage
- Emits change events for React re-renders
- Accessed via `useDemoStore()` hook

**Session State Shape**:

```typescript
interface SessionOverrides {
  applicationStatuses: Record<string, DemoApplication['status']>;
  additionalScorePulls: Record<string, DemoCreditScore>;
}
```

---

### Export: `demoDataStore.getBusinesses()`

**Returns**: `EnrichedBusiness[]`

**Logic**: Merges `ENRICHED_BUSINESSES` with session overrides

**Transformation**: Application statuses are merged from `sessionOverrides.applicationStatuses`

---

### Export: `demoDataStore.getBusinessById(id)`

**Returns**: `EnrichedBusiness | undefined`

**Logic**: Same as `getBusinesses()` but single record

---

### Export: `demoDataStore.getApplications()`

**Returns**: `DemoApplication[]`

**Logic**: Flattens all applications from all businesses + applies status overrides

---

### Export: `demoDataStore.updateApplicationStatus(appId, newStatus)`

**Mutation**: Updates application status in session state

**Persistence**: Writes to localStorage → emits change event

**Valid Statuses**: `'submitted' | 'under_review' | 'approved' | 'declined' | 'funded'`

---

### Export: `demoDataStore.clearApplicationStatus(appId)`

**Mutation**: Removes override for single application

---

### Export: `demoDataStore.clearAllApplicationStatuses()`

**Mutation**: Clears all application status overrides

---

### Export: `demoDataStore.getApplicationStatusOverrides()`

**Returns**: `Record<string, DemoApplication['status']>`

**Purpose**: Expose current session overrides (read-only)

---

### Export: `demoDataStore.simulateScorePull(bizId)`

**Mutation**: Simulates a new bureau score pull

**Returns**: `DemoCreditScore`

**Logic**:
1. If `bizId` has existing `creditScores`, returns the first score with updated `pulledAt` timestamp
2. Otherwise, generates deterministic score from `DEMO_BUSINESSES[bizId].lumiqScore * 10`
3. Stores pull in `additionalScorePulls` keyed by `${bizId}_${timestamp}`
4. Persists to localStorage + emits change event

**Score Generation**:
- `lumiqScore * 10` → clamped to max 850
- Risk class: `>= 750` → low, `>= 650` → moderate, else high
- Factors: `["Score pulled via LUMIQ API", "Data aggregated from bureau sources"]`

---

### Export: `demoDataStore.reset()`

**Mutation**: Clears all session state + removes localStorage key

**Use Case**: Reset demo to initial state

---

### Export: `demoDataStore.subscribe(callback)`

**Returns**: Unsubscribe function `() => void`

**Purpose**: React hook integration (`useDemoStore` calls this)

**Pattern**:

```typescript
useEffect(() => {
  const unsubscribe = demoDataStore.subscribe(() => {
    forceUpdate();
  });
  return unsubscribe;
}, []);
```

---

## Type Transformations

### FICO → LUMIQ Score Conversion

**Source**: Owner FICO (personal credit, 300-850 range)

**Target**: LUMIQ Score (SMB composite, 0-100 range)

**Formula**: **Not explicitly defined** in demo data

**Inverse Relationship** (observed):
- High FICO (780) → High LUMIQ (91)
- Low FICO (648) → Low LUMIQ (42)

**Approximation** (linear mapping):

```typescript
function ficoToLumiq(fico: number): number {
  // FICO 300-850 → LUMIQ 0-100
  return Math.round(((fico - 300) / 550) * 100);
}

// Examples:
// FICO 750 → LUMIQ 82
// FICO 680 → LUMIQ 69
// FICO 600 → LUMIQ 55
```

**Note**: Actual LUMIQ score is **composite** (not just FICO-derived). Demo data uses fixed `lumiqScore` values.

---

### Bureau Score → Risk Class

**Source**: Bureau score (0-850 or 0-100 PAYDEX)

**Target**: Risk class enum

**Experian/Equifax/FICO (850 scale)**:

```typescript
function scoreToRiskClass(score: number): 'low' | 'moderate' | 'high' | 'very_high' {
  if (score >= 750) return 'low';
  if (score >= 650) return 'moderate';
  if (score >= 550) return 'high';
  return 'very_high';
}
```

**D&B PAYDEX (100 scale)**:

```typescript
function paydexToRiskClass(paydex: number): 'low' | 'moderate' | 'high' | 'very_high' {
  if (paydex >= 80) return 'low';
  if (paydex >= 70) return 'moderate';
  if (paydex >= 50) return 'high';
  return 'very_high';
}
```

---

### Risk Tier → Signal Status

**Source**: `riskTier: 'low' | 'medium' | 'high'`

**Target**: `SignalStatus: 'strong' | 'stable' | 'weak'`

**Mapping** (observed in demo data):

```typescript
const RISK_TO_SIGNAL: Record<RiskTier, SignalStatus> = {
  low: 'strong',
  medium: 'stable',
  high: 'weak',
};
```

---

### Date Formats

**Storage Format**: ISO 8601 strings (`"2026-01-28"` or `"2026-01-28T10:00:00Z"`)

**Display Formats**:
- Short date: `"2026-01-28"` → `"Jan 28, 2026"`
- Relative time: `"2026-01-28T10:00:00Z"` → `"2 hours ago"`
- Month abbreviation: `"Jan"`, `"Feb"`, etc.

**Transformation** (client-side):

```typescript
// ISO date string → Date object
const date = new Date("2026-01-28T10:00:00Z");

// Date object → display string
import { format, formatDistanceToNow } from 'date-fns';

const shortDate = format(date, 'MMM d, yyyy');  // "Jan 28, 2026"
const relativeTime = formatDistanceToNow(date, { addSuffix: true }); // "2 hours ago"
```

---

## Integration Patterns

### Pattern 1: Direct Registry Mapping

**Use Case**: Static data that doesn't require transformation

```typescript
import { demoRegistry } from '@/data/demoDataRegistry';

const { data } = useBffQuery({
  queryFn: (pid) => customersService.list(pid),
  demoData: demoRegistry.customers.list,
});
```

**BFF Endpoint**: `GET /api/v1/customers`

**Demo Data**: `CUSTOMER_DEMO_DATA` (41 records)

---

### Pattern 2: Function-Based Data

**Use Case**: Data that requires runtime lookup

```typescript
import { getBusinessSignalProfile } from '@/data/creditSignalsData';

const { data } = useBffQuery({
  queryFn: (pid, bizId) => creditsService.getSignals(pid, bizId),
  demoData: () => getBusinessSignalProfile(bizId),
});
```

**BFF Endpoint**: `GET /api/v1/credit/signals/{businessId}`

**Demo Data**: `getBusinessSignalProfile(businessId, businessName?)`

**Fallback**: Returns `defaultProfile()` for unmapped IDs

---

### Pattern 3: Session Store (Mutable)

**Use Case**: Data that changes during demo session (approvals, score pulls)

```typescript
import { demoDataStore } from '@/data/demoDataStore';

// Read
const businesses = demoDataStore.getBusinesses();

// Mutate
demoDataStore.updateApplicationStatus('app-001', 'approved');

// Listen for changes
useEffect(() => {
  const unsubscribe = demoDataStore.subscribe(() => {
    setData(demoDataStore.getBusinesses());
  });
  return unsubscribe;
}, []);
```

**Persistence**: localStorage key `lumiq_demo_session`

**Mutations**:
- `updateApplicationStatus(appId, status)`
- `simulateScorePull(bizId)`
- `reset()`

---

### Pattern 4: Multi-Bank Data Resolution

**Use Case**: Bank-switched demo data (Chase, Wells Fargo, Santander, Citi)

```typescript
import { DEMO_BUSINESSES, PILOT_METRICS } from '@/data/fallback/demoData';
// Internally resolves via ACTIVE_BANK_ID from bankConfig.ts

const { data } = useBffQuery({
  queryFn: (pid) => dashboardService.getMetrics(pid),
  demoData: demoRegistry.overview.pilotMetrics,
});
```

**Bank Resolution Logic**:

```typescript
// In demoData.ts
const PILOT_METRICS_MAP: Record<string, typeof CHASE_PILOT_METRICS> = {
  chase: CHASE_PILOT_METRICS,
  wellsfargo: WF_PILOT_METRICS,
  santander: SANT_PILOT_METRICS,
  citi: CITI_PILOT_METRICS,
};

export const PILOT_METRICS = PILOT_METRICS_MAP[ACTIVE_BANK_ID];
```

**Active Bank ID Source**: `src/data/bankConfig.ts` (URL param `?bank=xxx` or env `VITE_BANK_ID`)

---

### Pattern 5: Transformation Wrapper

**Use Case**: BFF data shape differs from demo data shape

```typescript
const { data } = useBffQuery({
  queryFn: (pid) => riskService.getKPIs(pid),
  demoData: () => transformRiskKPIs(RISK_KPIS),
});

function transformRiskKPIs(demoKPIs: RiskKPI[]): BffRiskKPI[] {
  return demoKPIs.map(kpi => ({
    id: kpi.id,
    label: kpi.label,
    currentValue: kpi.value,
    previousValue: typeof kpi.value === 'number'
      ? kpi.value - kpi.change
      : null,
    trend: kpi.trend,
    sparkline: kpi.sparklineData?.map(d => d.value) ?? [],
  }));
}
```

---

### Pattern 6: Paginated/Filtered Data

**Use Case**: BFF endpoint supports pagination/filters, demo data is static

```typescript
const { data } = useBffQuery({
  queryFn: (pid, params) => customersService.list(pid, params),
  demoData: () => {
    const allData = CUSTOMER_DEMO_DATA;

    // Client-side filtering
    let filtered = allData;
    if (filters.segment.length > 0) {
      filtered = filtered.filter(c => filters.segment.includes(c.segment));
    }
    if (filters.riskTier.length > 0) {
      filtered = filtered.filter(c => filters.riskTier.includes(c.riskTier));
    }

    // Client-side pagination
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize,
    };
  },
});
```

---

## Summary Statistics

### Data Volume

| Domain | Export | Record Count | File Size |
|--------|--------|--------------|-----------|
| Customer | `CUSTOMER_DEMO_DATA` | 41 | ~25KB |
| Customer Page | `MOCK_CUSTOMERS` | 8 | ~2KB |
| Credit Signals | `getBusinessSignalProfile()` | 2 explicit + fallback | ~8KB |
| Risk | `RISK_KPIS` | 6 | ~1KB |
| Risk | `RISK_HEATMAPS` | 12 cells | ~2KB |
| Risk | `EWS_QUEUE_ITEMS` | 2 | ~1KB |
| Risk | `CONCENTRATION_CATEGORIES` | 5 items | ~1KB |
| Underwriting | `CASES` | 5 | ~8KB |
| Dashboard | `DEMO_BUSINESSES` | 10 | ~3KB |
| Dashboard | `EnrichedBusiness` | 10 | ~15KB |
| Registry | `demoRegistry` (all domains) | N/A | ~50KB total |

### Type Coverage

**Total Interfaces Defined**: 47

**Total Exports**: 68

**BFF Endpoint Mappings**: 42 endpoints

---

## Appendix: File Dependency Graph

```
demoDataRegistry.ts
├── customerDemoData.ts           (CUSTOMER_DEMO_DATA)
├── customerPageDemoData.ts       (MOCK_CUSTOMERS, MOCK_HEALTH_SUMMARY, etc.)
├── creditSignalsData.ts          (getBusinessSignalProfile)
├── riskDemoData.ts               (RISK_KPIS, EWS_*, etc.)
├── underwritingDemoData.ts       (CASES, QUEUE_STATS)
├── fallback/demoData.ts          (DEMO_BUSINESSES, PILOT_METRICS, EnrichedBusiness)
├── demoDataStore.ts              (mutable session store)
├── chaseDemoData.ts              (bank-specific data)
├── citiDataLoader.ts             (bank-specific data)
├── santanderDataLoader.ts        (bank-specific data)
├── wellsfargoDemoData.ts         (bank-specific data)
├── portfolioSegments.ts          (PORTFOLIO_KPIS, etc.)
└── @/components/enterprise/*     (component-specific mock data)
    ├── analytics/mockData.ts
    ├── products/mockData.ts
    └── reports/mockData.ts
```

---

## Changelog

**2026-02-12**: Initial comprehensive mapping guide created

---

## Next Steps for API Integration

1. **Create BFF Type Definitions**: Define TypeScript interfaces for all BFF response envelopes in `src/services/bff/types.ts`

2. **Build Transformation Layer**: Create `src/services/bff/transformers.ts` to map demo data shapes to BFF response shapes

3. **Update Service Clients**: Modify `src/services/bff/*.service.ts` to return demo data when `DEMO_MODE=true`

4. **Add Integration Tests**: Write tests in `__tests__/services/bff/` to validate demo data matches BFF contracts

5. **Document API Contracts**: Expand this guide with BFF response envelope examples and error handling patterns

---

**End of Document**
