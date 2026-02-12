# Chase Data Exports — TypeScript to JSON Mapping

This document maps all TypeScript exports from the Chase data loaders to their source data in `chase.json`.

## File Reference
- **Source JSON**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/chase.json`
- **Complete Copy**: `/Users/devaccount/Lumiq-AI-Dashboard/docs/api-data/chase-complete.json`

---

## 1. chaseDataLoader.ts

### Export: `CHASE_PILOT_METRICS`

**Type**: Object with 28 scalar fields

**Source**: Derived from `portfolio_summary` with scaleFactor calculations

**Shape**:
```typescript
{
  // Business coverage
  totalBusinesses: number;           // portfolio_summary.total_businesses (6,000,000)
  scoredBusinesses: number;          // totalBusinesses * 0.804 (4,824,000)
  scoreCoverage: number;             // 80.4

  // Pre-qualification funnel
  preQualifiedBusinesses: number;    // portfolio_summary.pre_qualified_count (4,020,000)
  preQualRate: number;               // portfolio_summary.pre_qualified_rate (67.0)
  applicationsStarted: number;       // pre_qualified_count * 0.0985 (395,970)
  applicationConversion: number;     // 25.0
  approved: number;                  // applicationsStarted * 0.755 (298,857)
  approvalRate: number;              // 75.5
  funded: number;                    // approved * 0.90 (268,971)
  fundingRate: number;               // 90.0
  ineligible: number;                // totalBusinesses * 0.198 (1,188,000)

  // Score distribution
  avgLumiqScore: number;             // portfolio_summary.avg_credit_score (71.4)
  medianLumiqScore: number;          // 73

  // API performance
  totalApiCalls: number;             // 3,247,000 * scaleFactor (409,626,316)
  dailyAvgCalls: number;             // totalApiCalls / 92 (4,452,460)
  successRate: number;               // 99.94
  avgLatencyMs: number;              // 145
  p99LatencyMs: number;              // 380
  errorCount: number;                // 1948 * scaleFactor (245,495)

  // Financial impact
  avgPreQualLimit: number;           // portfolio_summary.avg_exposure_per_business (108,333)
  projectedOriginations: number;     // pre_qualified_count * avg_exposure_per_business * 0.25
  avgRevenuePerBusiness: number;     // 4,250
  projectedAnnualRevenue: number;    // approved * 4250 (1,270,142,500)

  // Risk metrics
  delinquencyRate: number;           // portfolio_summary.trend.npl_rate (0.65)
  defaultRate: number;               // 0.28
  portfolioUtilization: number;      // 62.5

  // Growth metrics
  momGrowth: number;                 // portfolio_summary.trend.portfolio_growth_yoy (4.5)
  qoqGrowth: number;                 // 12.8
  avgTimeToApproval: number;         // 2.3
}
```

**Sample Values**:
```json
{
  "totalBusinesses": 6000000,
  "scoredBusinesses": 4824000,
  "scoreCoverage": 80.4,
  "preQualifiedBusinesses": 4020000,
  "preQualRate": 67.0,
  "avgLumiqScore": 71.4,
  "avgPreQualLimit": 108333
}
```

---

### Export: `CHASE_DEMO_BUSINESSES`

**Type**: Array of 10 `DemoBusinessEntity` objects

**Source**: `sample_businesses[0..9]` with derived fields

**Shape (per item)**:
```typescript
{
  id: string;                       // sample_businesses[i].id (with '_' → '-')
  name: string;                     // sample_businesses[i].name
  legalName: string;                // sample_businesses[i].name
  industry: string;                 // sample_businesses[i].industry
  naicsCode: string;                // '000000' (placeholder)
  city: string;                     // sample_businesses[i].state (used as city)
  state: string;                    // sample_businesses[i].state
  annualRevenue: number;            // sample_businesses[i].annual_revenue
  employeeCount: number;            // sample_businesses[i].employees
  yearsInBusiness: number;          // sample_businesses[i].years_in_business
  lumiqScore: number;               // Math.round(sample_businesses[i].credit_score)
  ownerFico: number;                // Math.round(640 + credit_score * 1.5)
  riskTier: 'low' | 'medium' | 'high'; // Derived: score>=75→low, >=65→medium, else→high
  scoreTrend: 'up' | 'down' | 'stable'; // Derived: score>=78→up, <67→down, else→stable
  trendValue: number;               // Derived from score
  segment: 'micro' | 'small' | 'mid-market'; // Derived: revenue>=5M→mid-market, >=2M→small, else→micro
  hasActiveApplication: boolean;    // eligible_products.length > 0
  productType: string;              // products_held[0]
  applicationAmount: number;        // current_exposure
}
```

**First Item Sample**:
```json
{
  "id": "biz-001",
  "name": "Bay Area Tech Consulting LLC",
  "legalName": "Bay Area Tech Consulting LLC",
  "industry": "Technology Services",
  "naicsCode": "000000",
  "city": "CA",
  "state": "CA",
  "annualRevenue": 4800000,
  "employeeCount": 24,
  "yearsInBusiness": 7,
  "lumiqScore": 84,
  "ownerFico": 766,
  "riskTier": "low",
  "scoreTrend": "up",
  "trendValue": 7,
  "segment": "small",
  "hasActiveApplication": true,
  "productType": "Business Line of Credit",
  "applicationAmount": 285000
}
```

---

## 2. chasePortfolioLoader.ts

### Export: `CHASE_PORTFOLIO`

**Type**: Object with 13 scalar fields

**Source**: `portfolio_summary`

**Shape**:
```typescript
{
  totalBusinesses: number;          // portfolio_summary.total_businesses (6,000,000)
  totalExposure: number;            // portfolio_summary.total_exposure (650,000,000,000)
  preQualRate: number;              // portfolio_summary.pre_qualified_rate / 100 (0.67)
  avgCompositeScore: number;        // portfolio_summary.avg_credit_score (71.4)
  avgCompositeScorePrevMonth: number; // avg_credit_score - 0.3 (71.1)
  atRiskExposure: number;           // portfolio_summary.at_risk_exposure (84,500,000,000)
  atRiskPercent: number;            // portfolio_summary.at_risk_rate / 100 (0.13)
  offerPotential: number;           // portfolio_summary.offer_potential (145,000,000,000)
  quarterlyGrowth: number;          // total_businesses * (trend.portfolio_growth_yoy / 100) (270,000)
  bureauHitRate: number;            // 0.987
  avgScoreRefreshDays: number;      // 18
}
```

**Sample Values**:
```json
{
  "totalBusinesses": 6000000,
  "totalExposure": 650000000000,
  "preQualRate": 0.67,
  "avgCompositeScore": 71.4,
  "avgCompositeScorePrevMonth": 71.1,
  "atRiskExposure": 84500000000,
  "atRiskPercent": 0.13,
  "offerPotential": 145000000000,
  "quarterlyGrowth": 270000,
  "bureauHitRate": 0.987,
  "avgScoreRefreshDays": 18
}
```

---

### Export: `CHASE_SEGMENTS`

**Type**: Array of 8 Segment objects

**Source**: `segments[]` with derived fields

**Shape (per item)**:
```typescript
{
  id: string;                       // `seg_${segments[i].id}`
  name: string;                     // segments[i].name
  icon: string;                     // Mapped from SEGMENT_ICONS (e.g., '👔', '🏪', '🍽️')
  businessCount: number;            // segments[i].business_count
  exposure: number;                 // segments[i].total_exposure
  avgScore: number;                 // segments[i].avg_credit_score
  preQualRate: number;              // segments[i].pre_qualified_rate / 100
  riskDistribution: {               // Based on segments[i].risk_level
    LOW: number;                    // Percent (e.g., 0.31 for low risk)
    MODERATE: number;               // Percent
    ELEVATED: number;               // Percent
    HIGH: number;                   // Percent
    CRITICAL: number;               // Percent
  };
  conversionRate: number;           // Derived from pre_qualified_rate (0.03 to 0.12)
  status: 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk';
  trend: 'up' | 'down' | 'stable'; // segments[i].trend.direction
  productEligibility: {
    LOC: number;                    // business_count * 0.5
    TERM: number;                   // business_count * 0.4
    SBA: number;                    // business_count * 0.15
  };
}
```

**First Item Sample** (Professional Services):
```json
{
  "id": "seg_professional_services",
  "name": "Professional Services",
  "icon": "👔",
  "businessCount": 1080000,
  "exposure": 116640000000,
  "avgScore": 73.5,
  "preQualRate": 0.68,
  "riskDistribution": {
    "LOW": 0.31,
    "MODERATE": 0.45,
    "ELEVATED": 0.16,
    "HIGH": 0.06,
    "CRITICAL": 0.02
  },
  "conversionRate": 0.10,
  "status": "performing",
  "trend": "stable",
  "productEligibility": {
    "LOC": 540000,
    "TERM": 432000,
    "SBA": 162000
  }
}
```

---

### Export: `CHASE_RISK_TIERS`

**Type**: Object with 5 keys (LOW, MODERATE, ELEVATED, HIGH, CRITICAL)

**Source**: Derived from `portfolio_summary.total_businesses` and `total_exposure`

**Shape**:
```typescript
{
  LOW: {
    percent: number;                // 0.22
    count: number;                  // total_businesses * 0.22 (1,320,000)
    exposure: number;               // total_exposure * 0.22 (143,000,000,000)
    label: string;                  // 'Low Risk'
  };
  MODERATE: {
    percent: number;                // 0.41
    count: number;                  // total_businesses * 0.41 (2,460,000)
    exposure: number;               // total_exposure * 0.41 (266,500,000,000)
    label: string;                  // 'Moderate'
  };
  ELEVATED: {
    percent: number;                // 0.24
    count: number;                  // total_businesses * 0.24 (1,440,000)
    exposure: number;               // total_exposure * 0.24 (156,000,000,000)
    label: string;                  // 'Elevated'
  };
  HIGH: {
    percent: number;                // 0.10
    count: number;                  // total_businesses * 0.10 (600,000)
    exposure: number;               // total_exposure * 0.10 (65,000,000,000)
    label: string;                  // 'High Risk'
  };
  CRITICAL: {
    percent: number;                // 0.03
    count: number;                  // total_businesses * 0.03 (180,000)
    exposure: number;               // total_exposure * 0.03 (19,500,000,000)
    label: string;                  // 'Critical'
  };
}
```

---

## 3. chaseCampaignLoader.ts

### Export: `CHASE_CAMPAIGNS`

**Type**: Array of 3 Campaign objects

**Source**: `campaigns[]` with derived fields

**Shape (per item)**:
```typescript
{
  id: string;                       // campaigns[i].id
  name: string;                     // `Q1 ${product_name} — ${target_segment}`
  status: string;                   // campaigns[i].status ('active', 'paused', 'completed')
  health: 'on_track' | 'below_target' | 'paused' | 'completed';
  targetSegment: string;            // Mapped to seg_id (e.g., 'seg_healthcare')
  targetCriteria: string;           // `${target_segment} + Score >50 + ${product} eligible`
  product: string;                  // Mapped product code ('LOC', 'TERM', 'EQUIPMENT')
  startDate: string;                // campaigns[i].start_date (ISO 8601)
  endDate: string;                  // campaigns[i].end_date (ISO 8601)
  owner: string;                    // campaigns[i].owner
  funnel: {
    pushed: number;                 // campaigns[i].funnel.pushed
    viewed: number;                 // campaigns[i].funnel.viewed
    applied: number;                // campaigns[i].funnel.applied
    approved: number;               // campaigns[i].funnel.approved
  };
  viewRate: number;                 // viewed / pushed
  applyRate: number;                // applied / pushed
  approvalRate: number;             // approved / applied
  approvedVolume: number;           // campaigns[i].potential_revenue
  warning?: string;                 // Warning if viewRate < 0.35
}
```

**First Item Sample**:
```json
{
  "id": "camp_q1_healthcare_loc",
  "name": "Q1 Business Line of Credit — Healthcare Services",
  "status": "active",
  "health": "on_track",
  "targetSegment": "seg_healthcare",
  "targetCriteria": "Healthcare Services + Score >50 + LOC eligible",
  "product": "LOC",
  "startDate": "2026-01-15",
  "endDate": "2026-03-31",
  "owner": "Northeast Regional Team",
  "funnel": {
    "pushed": 8240,
    "viewed": 5768,
    "applied": 1236,
    "approved": 618
  },
  "viewRate": 0.7,
  "applyRate": 0.15,
  "approvalRate": 0.50,
  "approvedVolume": 87400000
}
```

---

### Export: `CHASE_CAMPAIGN_SUMMARY`

**Type**: Object with 6 scalar fields

**Source**: Aggregated from all campaigns

**Shape**:
```typescript
{
  activeCampaigns: number;          // CHASE_CAMPAIGNS.length (3)
  offersPushed: number;             // Sum of all funnel.pushed (24,310)
  avgViewRate: number;              // Total viewed / total pushed (0.667)
  avgApplyRate: number;             // Total applied / total pushed (0.151)
  avgApprovalRate: number;          // Total approved / total applied (0.515)
  revenueBooked: number;            // Sum of all approved volumes (268,300,000)
}
```

---

### Export: `CHASE_CONVERSION_BY_SEGMENT`

**Type**: Array of 6 ConversionBySegment objects

**Source**: Static data (scaled for Chase)

**Shape (per item)**:
```typescript
{
  segment: string;                  // Segment name
  viewRate: number;                 // Decimal (e.g., 0.72)
  applyRate: number;                // Decimal (e.g., 0.18)
  approvalRate: number;             // Decimal (e.g., 0.58)
  endToEnd: number;                 // viewRate * applyRate * approvalRate
  status: 'ok' | 'warning' | 'at_risk';
}
```

**First Item Sample**:
```json
{
  "segment": "Professional Services",
  "viewRate": 0.72,
  "applyRate": 0.18,
  "approvalRate": 0.58,
  "endToEnd": 0.0751,
  "status": "ok"
}
```

---

## 4. chaseRiskLoader.ts

### Export: `CHASE_RISK_KPIS`

**Type**: Object with nested objects

**Source**: `portfolio_summary` and `risk_metrics`

**Shape**:
```typescript
{
  portfolioAtRisk: {
    value: number;                  // portfolio_summary.at_risk_exposure (84,500,000,000)
    percent: number;                // portfolio_summary.at_risk_rate / 100 (0.13)
  };
  industryConcentration: {
    value: number;                  // risk_metrics.concentration.industry[0].percentage / 100 (0.179)
    label: string;                  // risk_metrics.concentration.industry[0].name ("Professional Services")
  };
  geographicConcentration: {
    value: number;                  // risk_metrics.concentration.geographic[0].percentage / 100 (0.30)
    label: string;                  // risk_metrics.concentration.geographic[0].region ("West")
  };
  ewsAlerts: number;                // Sum of all ews_clusters business_count (8,932)
  thirtyDayDeterioration: number;   // at_risk_count * 0.02 (15,600)
  watchList: number;                // at_risk_count * 0.05 (39,000)
}
```

---

### Export: `CHASE_CONCENTRATION`

**Type**: Object with industry and geography concentration limits

**Source**: `risk_metrics.concentration`

**Shape**:
```typescript
{
  industry: {
    limit: number;                  // 0.20
    values: Array<{
      name: string;                 // Industry name
      percent: number;              // Percentage / 100 (decimal)
      exposure: number;             // Dollar exposure
      status: 'safe' | 'warning' | 'breach';
    }>;
  };
  geography: {
    limit: number;                  // 0.35
    values: Array<{
      name: string;                 // Region name
      percent: number;              // Percentage / 100 (decimal)
      exposure: number;             // Dollar exposure
      status: 'safe' | 'warning' | 'breach';
    }>;
  };
}
```

**Industry Values Sample** (first item):
```json
{
  "name": "Professional Services",
  "percent": 0.179,
  "exposure": 116640000000,
  "status": "safe"
}
```

---

### Export: `CHASE_EWS_CLUSTERS`

**Type**: Array of 4 EWSCluster objects

**Source**: `risk_metrics.ews_clusters`

**Shape (per item)**:
```typescript
{
  id: string;                       // ews_clusters[i].id
  type: string;                     // Mapped type code ('REVENUE_DECLINE', 'PAYMENT_STRESS', etc.)
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;                    // ews_clusters[i].type
  businessCount: number;            // ews_clusters[i].business_count
  exposure: number;                 // ews_clusters[i].total_exposure
  heaviestSegments: Array<{
    segment: string;                // top_industries[j].name or top_regions[j].name
    count: number;                  // top_industries[j].count or top_regions[j].count
  }>;
  actions: string[];                // Static: ['View Segment', 'Add All to Watch List', 'Assign to Team']
}
```

**First Item Sample**:
```json
{
  "id": "ews_revenue_decline",
  "type": "REVENUE_DECLINE",
  "severity": "critical",
  "title": "Revenue Decline >20%",
  "businessCount": 1420,
  "exposure": 187000000,
  "heaviestSegments": [
    { "segment": "Retail Trade", "count": 347 },
    { "segment": "Food Service", "count": 298 },
    { "segment": "Transportation", "count": 213 }
  ],
  "actions": ["View Segment", "Add All to Watch List", "Assign to Team"]
}
```

---

### Export: `CHASE_COMPLIANCE`

**Type**: Object with approval variance and fair lending metrics

**Source**: Static data scaled to Chase portfolio

**Shape**:
```typescript
{
  approvalVariance: Array<{
    segment: string;
    applications: number;
    approved: number;
    rate: number;
    variance: number;
    status: 'ok' | 'review' | 'flag';
  }>;
  portfolioApprovalRate: number;    // 0.72
  adverseActionsSent: number;       // 960,000
  fairLendingStatus: string;        // 'pass'
}
```

**First approvalVariance Item**:
```json
{
  "segment": "Professional Services",
  "applications": 215000,
  "approved": 176300,
  "rate": 0.82,
  "variance": 0.1,
  "status": "ok"
}
```

---

## 5. chaseUnderwritingLoader.ts

### Export: `CHASE_UNDERWRITING`

**Type**: Object with kpis, queue, and rules

**Source**: `underwriting_queue[]` + static rules

**Shape**:
```typescript
{
  kpis: {
    queueDepth: number;             // underwriting_queue.length (15)
    avgDecisionTime: number;        // Average time_in_queue_hours / 24 (in days)
    autoApproveRate: number;        // Percent with recommendation='approve'
    manualReviewRate: number;       // Percent with recommendation='review' or 'conditional_approve'
    declineRate: number;            // Percent declined
    slaCompliance: number;          // Percent with time_in_queue < 48 hours
  };
  queue: Array<{
    id: string;                     // underwriting_queue[i].id
    business: string;               // underwriting_queue[i].business_name
    product: string;                // Mapped product code ('EQUIPMENT', 'LOC', 'TERM', 'SBA')
    amount: number;                 // underwriting_queue[i].amount_requested
    score: number;                  // Math.round(underwriting_queue[i].credit_score)
    risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
    timeInQueue: number;            // underwriting_queue[i].time_in_queue_hours
    slaStatus: 'ok' | 'warning' | 'breach';
  }>;
  rules: {
    autoApprove: string[];          // Static list of 4 rules
    autoDecline: string[];          // Static list of 3 rules
  };
}
```

**First Queue Item Sample**:
```json
{
  "id": "app_001",
  "business": "Pacific Coast Manufacturing Inc",
  "product": "EQUIPMENT",
  "amount": 485000,
  "score": 76,
  "risk": "LOW",
  "timeInQueue": 14,
  "slaStatus": "ok"
}
```

---

## 6. chaseFilterLoader.ts

### Export: `CHASE_FILTER_OPTIONS`

**Type**: Object with filter arrays and ranges

**Source**: `filter_options`

**Shape**:
```typescript
{
  industries: string[];             // filter_options.industries (8 items)
  states: string[];                 // filter_options.states (30 items)
  riskTiers: RiskTier[];            // ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL']
  products: string[];               // filter_options.products (12 items)
  scoreRange: {
    min: number;                    // 0
    max: number;                    // 100
  };
  revenueRange: {
    min: number;                    // 100,000
    max: number;                    // 50,000,000
  };
}
```

---

### Export: `CHASE_SAVED_SEGMENTS`

**Type**: Array of 4 saved segment objects

**Source**: Static data scaled to Chase portfolio

**Shape (per item)**:
```typescript
{
  id: string;                       // Segment ID (e.g., 'seg_high_value_professional')
  name: string;                     // Display name
  businessCount: number;            // Number of businesses
  exposure: number;                 // Total dollar exposure
  createdAt: string;                // ISO 8601 timestamp
}
```

**First Item Sample**:
```json
{
  "id": "seg_high_value_professional",
  "name": "High Value Professional",
  "businessCount": 540000,
  "exposure": 58300000000,
  "createdAt": "2026-01-15T10:30:00Z"
}
```

---

### Export: `CHASE_SAMPLE_BUSINESSES`

**Type**: Array of 50 business summary objects

**Source**: `sample_businesses[]` (all 50 items)

**Shape (per item)**:
```typescript
{
  id: string;                       // sample_businesses[i].id
  name: string;                     // sample_businesses[i].name
  revenue: number;                  // sample_businesses[i].annual_revenue
  score: number;                    // Math.round(sample_businesses[i].credit_score)
  risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  status: string;                   // Derived: 'Approved', 'Offer Sent', 'Qualified', 'Under Review', 'Not Eligible'
  segment: string;                  // Mapped to seg_id (e.g., 'seg_technology')
  state: string;                    // sample_businesses[i].state
}
```

**First Item Sample**:
```json
{
  "id": "biz_001",
  "name": "Bay Area Tech Consulting LLC",
  "revenue": 4800000,
  "score": 84,
  "risk": "LOW",
  "status": "Approved",
  "segment": "seg_technology",
  "state": "CA"
}
```

---

## Derivation Functions Reference

### Risk Tier Mapping
```typescript
score >= 80  → LOW
score >= 70  → MODERATE
score >= 60  → ELEVATED
score >= 50  → HIGH
score < 50   → CRITICAL
```

### Status Mapping
```typescript
score >= 80  → Approved
score >= 70  → Offer Sent
score >= 60  → Qualified
score >= 50  → Under Review
score < 50   → Not Eligible
```

### Segment Status Mapping
```typescript
avgScore >= 75  → top_performer
avgScore >= 70  → performing
avgScore >= 65  → below_benchmark
avgScore < 65   → at_risk
```

### Product Code Mapping
```typescript
'Business Line of Credit'  → 'LOC'
'Business Term Loan'       → 'TERM'
'Equipment Financing'      → 'EQUIPMENT'
'SBA 7(a) Loan'           → 'SBA'
```

### Industry to Segment ID Mapping
```typescript
'Technology Services'       → 'seg_technology'
'Healthcare Services'       → 'seg_healthcare'
'Professional Services'     → 'seg_professional'
'Construction & Trades'     → 'seg_construction'
'Food Service & Restaurants'→ 'seg_food_service'
'Retail Trade'             → 'seg_retail'
'Manufacturing'            → 'seg_manufacturing'
'Transportation & Logistics'→ 'seg_transportation'
```

---

## Summary Statistics

### Chase JSON Data Points
- **Total businesses**: 6,000,000
- **Total exposure**: $650,000,000,000 ($650B)
- **Segments**: 8 industry segments
- **Sample businesses**: 50 complete business records
- **Underwriting queue**: 15 applications
- **Campaigns**: 3 active campaigns
- **EWS clusters**: 4 early warning clusters
- **Filter options**: 8 industries, 30 states, 12 products
- **Concentration limits**: Industry (20%), Geography (35%)

### TypeScript Exports
- **chaseDataLoader.ts**: 2 exports (CHASE_PILOT_METRICS, CHASE_DEMO_BUSINESSES)
- **chasePortfolioLoader.ts**: 3 exports (CHASE_PORTFOLIO, CHASE_SEGMENTS, CHASE_RISK_TIERS)
- **chaseCampaignLoader.ts**: 3 exports (CHASE_CAMPAIGNS, CHASE_CAMPAIGN_SUMMARY, CHASE_CONVERSION_BY_SEGMENT)
- **chaseRiskLoader.ts**: 4 exports (CHASE_RISK_KPIS, CHASE_CONCENTRATION, CHASE_EWS_CLUSTERS, CHASE_COMPLIANCE)
- **chaseUnderwritingLoader.ts**: 1 export (CHASE_UNDERWRITING)
- **chaseFilterLoader.ts**: 3 exports (CHASE_FILTER_OPTIONS, CHASE_SAVED_SEGMENTS, CHASE_SAMPLE_BUSINESSES)

**Total**: 16 named exports across 6 loader files

---

## Usage Example

```typescript
import { CHASE_PILOT_METRICS, CHASE_DEMO_BUSINESSES } from '@/data/chaseDataLoader';
import { CHASE_PORTFOLIO, CHASE_SEGMENTS } from '@/data/chasePortfolioLoader';
import { CHASE_CAMPAIGNS } from '@/data/chaseCampaignLoader';

// Access portfolio metrics
console.log(CHASE_PORTFOLIO.totalBusinesses);  // 6000000
console.log(CHASE_PORTFOLIO.totalExposure);    // 650000000000

// Access first segment
console.log(CHASE_SEGMENTS[0].name);           // "Professional Services"
console.log(CHASE_SEGMENTS[0].avgScore);       // 73.5

// Access first campaign
console.log(CHASE_CAMPAIGNS[0].product);       // "LOC"
console.log(CHASE_CAMPAIGNS[0].viewRate);      // 0.70
```

---

**Last Updated**: 2026-02-12
**Chase JSON Version**: 2026-02-11
**Source Files**: 6 TypeScript loaders + 1 JSON data file
