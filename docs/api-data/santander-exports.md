# Santander TypeScript Exports to JSON Mapping Guide

**Purpose:** Documents the exact shape and values of all exported constants from Santander data loader files, mapping TypeScript exports back to their JSON source data.

**Source Files:**
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santander.json` (master data file)
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderDataLoader.ts`
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderPortfolioLoader.ts`
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderCampaignLoader.ts`
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderRiskLoader.ts`
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderUnderwritingLoader.ts`
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderFilterLoader.ts`
- `/Users/devaccount/Lumiq-AI-Dashboard/src/data/santanderPortfolioSegments.ts`

---

## 1. santanderDataLoader.ts

### Export: `SANT_PILOT_METRICS`

**Source:** `santander.json` → `portfolio_summary`

**Shape:**
```typescript
{
  totalBusinesses: number;           // portfolio_summary.total_businesses
  scoredBusinesses: number;          // Derived: total_businesses * 0.804
  scoreCoverage: number;             // Static: 80.4

  preQualifiedBusinesses: number;    // portfolio_summary.pre_qualified_count
  preQualRate: number;               // portfolio_summary.qualification_rate
  applicationsStarted: number;       // Derived: pre_qualified_count * 0.0985
  applicationConversion: number;     // Static: 25.0
  approved: number;                  // Derived: applicationsStarted * 0.755
  approvalRate: number;              // Static: 75.5
  funded: number;                    // Derived: approved * 0.90
  fundingRate: number;               // Static: 90.0
  ineligible: number;                // Derived: total_businesses * 0.198

  avgLumiqScore: number;             // Derived: ficoToLumiq(portfolio_summary.avg_lumiq_score)
  medianLumiqScore: number;          // Static: 61

  totalApiCalls: number;             // Derived: 3_247_000 * scaleFactor
  dailyAvgCalls: number;             // Derived: totalApiCalls / 92
  successRate: number;               // Static: 99.94
  avgLatencyMs: number;              // Static: 145
  p99LatencyMs: number;              // Static: 380
  errorCount: number;                // Derived: 1948 * scaleFactor

  avgPreQualLimit: number;           // Derived: total_exposure / pre_qualified_count
  projectedOriginations: number;     // Derived formula
  avgRevenuePerBusiness: number;     // Static: 4250
  projectedAnnualRevenue: number;    // Derived: approved * 4250

  delinquencyRate: number;           // portfolio_summary.npl_ratio
  defaultRate: number;               // Static: 0.28
  portfolioUtilization: number;      // Static: 62.5

  momGrowth: number;                 // portfolio_summary.growth_qoq
  qoqGrowth: number;                 // portfolio_summary.growth_qoq
  avgTimeToApproval: number;         // Static: 2.3
}
```

**Sample Values:**
```json
{
  "totalBusinesses": 180000,
  "scoredBusinesses": 144720,
  "scoreCoverage": 80.4,
  "preQualifiedBusinesses": 111600,
  "preQualRate": 62.0,
  "avgLumiqScore": 63,
  "delinquencyRate": 2.8,
  "momGrowth": 3.1,
  "qoqGrowth": 3.1
}
```

**FICO to LUMIQ Conversion:**
```typescript
ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}
// Example: ficoToLumiq(648) = 63
```

---

### Export: `SANT_DEMO_BUSINESSES`

**Source:** `santander.json` → `sample_businesses` (first 10 items)

**Shape:**
```typescript
Array<{
  id: string;                    // sample_businesses[].id
  name: string;                  // sample_businesses[].name
  legalName: string;             // sample_businesses[].name (duplicate)
  industry: string;              // sample_businesses[].industry
  naicsCode: string;             // Static: "000000"
  city: string;                  // sample_businesses[].city
  state: string;                 // sample_businesses[].state
  annualRevenue: number;         // sample_businesses[].revenue
  employeeCount: number;         // Derived: revenue / 120000
  yearsInBusiness: number;       // sample_businesses[].years_in_business
  lumiqScore: number;            // Derived: ficoToLumiq(lumiq_score)
  ownerFico: number;             // Derived: 640 + lumiqScore * 1.5
  riskTier: string;              // Derived from lumiqScore
  scoreTrend: string;            // Derived from lumiqScore
  trendValue: number;            // Derived from lumiqScore
  segment: string;               // Derived from revenue
  hasActiveApplication: boolean; // products.length > 0
  productType: string;           // sample_businesses[].products[0]
  applicationAmount: number;     // sample_businesses[].current_exposure
}>
```

**Sample First Item:**
```json
{
  "id": "biz-001",
  "name": "O'Brien Construction Management",
  "legalName": "O'Brien Construction Management",
  "industry": "Construction & Trades",
  "naicsCode": "000000",
  "city": "Boston",
  "state": "MA",
  "annualRevenue": 4800000,
  "employeeCount": 40,
  "yearsInBusiness": 12,
  "lumiqScore": 80,
  "ownerFico": 760,
  "riskTier": "low",
  "scoreTrend": "up",
  "trendValue": 4,
  "segment": "small",
  "hasActiveApplication": true,
  "productType": "Business Line of Credit",
  "applicationAmount": 580000
}
```

---

## 2. santanderPortfolioLoader.ts

### Export: `SANT_PORTFOLIO`

**Source:** `santander.json` → `portfolio_summary`

**Shape:**
```typescript
{
  totalBusinesses: number;              // portfolio_summary.total_businesses
  totalExposure: number;                // portfolio_summary.total_exposure
  preQualRate: number;                  // portfolio_summary.qualification_rate / 100
  avgCompositeScore: number;            // ficoToLumiq(portfolio_summary.avg_lumiq_score)
  avgCompositeScorePrevMonth: number;   // avgCompositeScore - 0.3
  atRiskExposure: number;               // portfolio_summary.at_risk_exposure
  atRiskPercent: number;                // at_risk_count / total_businesses
  offerPotential: number;               // portfolio_summary.pre_qualified_exposure
  quarterlyGrowth: number;              // Derived from growth_qoq
  bureauHitRate: number;                // Static: 0.978
  avgScoreRefreshDays: number;          // Static: 21
}
```

**Sample Values:**
```json
{
  "totalBusinesses": 180000,
  "totalExposure": 8000000000,
  "preQualRate": 0.62,
  "avgCompositeScore": 63,
  "avgCompositeScorePrevMonth": 62.7,
  "atRiskExposure": 1120000000,
  "atRiskPercent": 0.14,
  "offerPotential": 4960000000,
  "quarterlyGrowth": 5580,
  "bureauHitRate": 0.978,
  "avgScoreRefreshDays": 21
}
```

---

### Export: `SANT_SEGMENTS`

**Source:** `santander.json` → `segments`

**Shape:**
```typescript
Array<{
  id: string;                           // "seg_" + segments[].id
  name: string;                         // segments[].name
  icon: string;                         // Mapped from segment ID
  businessCount: number;                // segments[].count
  exposure: number;                     // segments[].exposure
  avgScore: number;                     // ficoToLumiq(segments[].avg_score)
  preQualRate: number;                  // segments[].percentage / 100
  riskDistribution: Record<string, number>;  // Static distribution
  conversionRate: number;               // Derived from avgScore
  status: string;                       // Derived from avgScore
  trend: string;                        // Static: "stable"
  productEligibility: {
    LOC: number;                        // count * 0.5
    TERM: number;                       // count * 0.4
    SBA: number;                        // count * 0.15
  };
}>
```

**Sample First Item:**
```json
{
  "id": "seg_pre-qualified",
  "name": "Pre-Qualified",
  "icon": "✅",
  "businessCount": 111600,
  "exposure": 4960000000,
  "avgScore": 75,
  "preQualRate": 0.62,
  "riskDistribution": {
    "LOW": 0.52,
    "MODERATE": 0.35,
    "ELEVATED": 0.1,
    "HIGH": 0.03,
    "CRITICAL": 0.0
  },
  "conversionRate": 0.12,
  "status": "top_performer",
  "trend": "stable",
  "productEligibility": {
    "LOC": 55800,
    "TERM": 44640,
    "SBA": 16740
  }
}
```

---

### Export: `SANT_RISK_TIERS`

**Source:** `santander.json` → `risk_metrics.risk_tier_distribution`

**Shape:**
```typescript
{
  LOW: {
    percent: number;     // Static: 0.41
    count: number;       // total_businesses * 0.41
    exposure: number;    // total_exposure * 0.41
    label: string;       // "Low Risk"
  };
  MODERATE: { ... };     // Similar structure
  ELEVATED: { ... };
  HIGH: { ... };
  CRITICAL: { ... };
}
```

**Sample Values:**
```json
{
  "LOW": {
    "percent": 0.41,
    "count": 73800,
    "exposure": 3280000000,
    "label": "Low Risk"
  },
  "MODERATE": {
    "percent": 0.279,
    "count": 50220,
    "exposure": 2232000000,
    "label": "Moderate"
  }
}
```

---

## 3. santanderCampaignLoader.ts

### Export: `SANT_CAMPAIGNS`

**Source:** `santander.json` → `campaigns`

**Shape:**
```typescript
Array<{
  id: string;                   // campaigns[].id
  name: string;                 // campaigns[].name
  status: string;               // campaigns[].status
  health: string;               // Derived from conversion_rate
  targetSegment: string;        // Mapped from target_segment
  targetCriteria: string;       // Constructed from min values
  product: string;              // Mapped product name
  startDate: string;            // campaigns[].start_date
  endDate: string;              // campaigns[].end_date
  owner: string;                // Derived from channel
  funnel: {
    pushed: number;             // campaigns[].eligible_count
    viewed: number;             // pushed * 0.68
    applied: number;            // pushed * (conversion_rate / 100)
    approved: number;           // applied * 0.75
  };
  viewRate: number;             // viewed / pushed
  applyRate: number;            // applied / pushed
  approvalRate: number;         // approved / applied
  approvedVolume: number;       // campaigns[].expected_volume
  warning?: string;             // Conditional
}>
```

**Sample First Item:**
```json
{
  "id": "camp-001",
  "name": "Northeast Small Business Growth Initiative",
  "status": "active",
  "health": "on_track",
  "targetSegment": "seg_pre-qualified",
  "targetCriteria": "Score >680 + Revenue >500K + 24mo tenure",
  "product": "TERM",
  "startDate": "2026-02-01",
  "endDate": "2026-05-31",
  "owner": "Sarah Chen",
  "funnel": {
    "pushed": 22752,
    "viewed": 15471,
    "applied": 3230,
    "approved": 2423
  },
  "viewRate": 0.68,
  "applyRate": 0.142,
  "approvalRate": 0.75,
  "approvedVolume": 145000000
}
```

---

### Export: `SANT_CAMPAIGN_SUMMARY`

**Source:** Aggregated from `SANT_CAMPAIGNS`

**Shape:**
```typescript
{
  activeCampaigns: number;      // SANT_CAMPAIGNS.length
  offersPushed: number;         // Sum of all funnel.pushed
  avgViewRate: number;          // Average across campaigns
  avgApplyRate: number;         // Average across campaigns
  avgApprovalRate: number;      // Average across campaigns
  revenueBooked: number;        // Sum of all approvedVolume
}
```

---

### Export: `SANT_CONVERSION_BY_SEGMENT`

**Source:** Static data (12 industry segments)

**Shape:**
```typescript
Array<{
  segment: string;              // Industry name
  viewRate: number;             // Static value
  applyRate: number;            // Static value
  approvalRate: number;         // Static value
  endToEnd: number;             // viewRate * applyRate * approvalRate
  status: string;               // "ok" | "warning" | "at_risk"
}>
```

**Sample First Item:**
```json
{
  "segment": "Professional Services",
  "viewRate": 0.71,
  "applyRate": 0.17,
  "approvalRate": 0.57,
  "endToEnd": 0.0688,
  "status": "ok"
}
```

---

## 4. santanderRiskLoader.ts

### Export: `SANT_RISK_KPIS`

**Source:** `santander.json` → `portfolio_summary` + `risk_metrics`

**Shape:**
```typescript
{
  portfolioAtRisk: {
    value: number;              // portfolio_summary.at_risk_exposure
    percent: number;            // at_risk_count / total_businesses
  };
  industryConcentration: {
    value: number;              // concentration_metrics.industry_concentration.percentage / 100
    label: string;              // concentration_metrics.industry_concentration.highest
  };
  geographicConcentration: {
    value: number;              // concentration_metrics.geographic_concentration.percentage / 100
    label: string;              // concentration_metrics.geographic_concentration.highest
  };
  ewsAlerts: number;            // Sum of all early_warning_signals
  thirtyDayDeterioration: number;  // early_warning_signals.declining_scores_30d
  watchList: number;            // at_risk_count * 0.05
}
```

**Sample Values:**
```json
{
  "portfolioAtRisk": {
    "value": 1120000000,
    "percent": 0.14
  },
  "industryConcentration": {
    "value": 0.214,
    "label": "Real Estate Services"
  },
  "geographicConcentration": {
    "value": 0.635,
    "label": "Northeast"
  },
  "ewsAlerts": 7524,
  "thirtyDayDeterioration": 3420,
  "watchList": 1260
}
```

---

### Export: `SANT_CONCENTRATION`

**Source:** `santander.json` → `risk_metrics.concentration_metrics`

**Shape:**
```typescript
{
  industry: {
    limit: number;              // industry_concentration.threshold / 100
    values: Array<{
      name: string;
      percent: number;
      exposure: number;
      status: "safe" | "warning";
    }>;
  };
  geography: {
    limit: number;              // geographic_concentration.threshold / 100
    values: Array<{
      name: string;
      percent: number;
      exposure: number;
      status: "safe" | "warning";
    }>;
  };
}
```

**Sample Values:**
```json
{
  "industry": {
    "limit": 0.25,
    "values": [
      {
        "name": "Real Estate Services",
        "percent": 0.214,
        "exposure": 1712000000,
        "status": "safe"
      }
    ]
  },
  "geography": {
    "limit": 0.65,
    "values": [
      {
        "name": "Northeast",
        "percent": 0.635,
        "exposure": 5080000000,
        "status": "warning"
      }
    ]
  }
}
```

---

### Export: `SANT_EWS_CLUSTERS`

**Source:** `santander.json` → `risk_metrics.early_warning_signals`

**Shape:**
```typescript
Array<{
  id: string;                   // Static ID
  type: string;                 // Derived type code
  severity: string;             // "critical" | "high" | "medium" | "low"
  title: string;                // Descriptive title
  businessCount: number;        // early_warning_signals value
  exposure: number;             // Derived: businessCount * avg exposure
  heaviestSegments: Array<{
    segment: string;
    count: number;              // businessCount * percentage
  }>;
  actions: string[];            // Static actions
}>
```

**Sample First Item:**
```json
{
  "id": "ews_declining_scores",
  "type": "SCORE_DECLINE",
  "severity": "medium",
  "title": "Score Deterioration (30 days)",
  "businessCount": 3420,
  "exposure": 151996800,
  "heaviestSegments": [
    {
      "segment": "Restaurants & Food",
      "count": 1197
    },
    {
      "segment": "Retail & E-Commerce",
      "count": 958
    }
  ],
  "actions": [
    "View Segment",
    "Add All to Watch List",
    "Assign to Team"
  ]
}
```

---

### Export: `SANT_COMPLIANCE`

**Source:** Static derived data

**Shape:**
```typescript
{
  approvalVariance: Array<{
    segment: string;
    applications: number;
    approved: number;
    rate: number;
    variance: number;
    status: "ok" | "review" | "flag";
  }>;
  portfolioApprovalRate: number;
  adverseActionsSent: number;
  fairLendingStatus: string;
}
```

---

## 5. santanderUnderwritingLoader.ts

### Export: `SANT_UNDERWRITING`

**Source:** `santander.json` → `underwriting_queue`

**Shape:**
```typescript
{
  kpis: {
    queueDepth: number;         // underwriting_queue.length
    avgDecisionTime: number;    // Average of days_in_queue
    autoApproveRate: number;    // Percentage of "Approve" recommendations
    manualReviewRate: number;   // Percentage of "Review" recommendations
    declineRate: number;        // Remainder percentage
    slaCompliance: number;      // Percentage with days_in_queue < 2
  };
  queue: Array<{
    id: string;                 // underwriting_queue[].id
    business: string;           // underwriting_queue[].business_name
    product: string;            // Mapped from product_requested
    amount: number;             // underwriting_queue[].amount_requested
    score: number;              // ficoToLumiq(lumiq_score)
    risk: string;               // Derived from score
    timeInQueue: number;        // days_in_queue * 24 (hours)
    slaStatus: string;          // Derived from days_in_queue
  }>;
  rules: {
    autoApprove: string[];      // Static rules
    autoDecline: string[];      // Static rules
  };
}
```

**Sample Queue Item:**
```json
{
  "id": "uw-2026-0348",
  "business": "Harbor View Construction LLC",
  "product": "TERM",
  "amount": 450000,
  "score": 72,
  "risk": "MODERATE",
  "timeInQueue": 48,
  "slaStatus": "breach"
}
```

---

## 6. santanderFilterLoader.ts

### Export: `SANT_FILTER_OPTIONS`

**Source:** `santander.json` → `filter_options`

**Shape:**
```typescript
{
  industries: string[];         // filter_options.industries[].name
  states: string[];             // filter_options.states[].code
  riskTiers: string[];          // ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL"]
  products: string[];           // filter_options.products[].name
  scoreRange: {
    min: number;                // Static: 0
    max: number;                // Static: 100
  };
  revenueRange: {
    min: number;                // Static: 100000
    max: number;                // Static: 15000000
  };
}
```

---

### Export: `SANT_SAVED_SEGMENTS`

**Source:** Static data (4 segments)

**Shape:**
```typescript
Array<{
  id: string;
  name: string;
  businessCount: number;
  exposure: number;
  createdAt: string;            // ISO 8601 timestamp
}>
```

**Sample Values:**
```json
[
  {
    "id": "seg_northeast_professional",
    "name": "Northeast Professional Services",
    "businessCount": 21600,
    "exposure": 1800000000,
    "createdAt": "2026-01-15T10:30:00Z"
  }
]
```

---

### Export: `SANT_SAMPLE_BUSINESSES`

**Source:** `santander.json` → `sample_businesses` (all 50 items)

**Shape:**
```typescript
Array<{
  id: string;                   // sample_businesses[].id
  name: string;                 // sample_businesses[].name
  revenue: number;              // sample_businesses[].revenue
  score: number;                // ficoToLumiq(lumiq_score)
  risk: string;                 // Derived from score
  status: string;               // Derived from score
  segment: string;              // Mapped from industry
  state: string;                // sample_businesses[].state
}>
```

**Sample First Item:**
```json
{
  "id": "biz-001",
  "name": "O'Brien Construction Management",
  "revenue": 4800000,
  "score": 80,
  "risk": "LOW",
  "status": "Approved",
  "segment": "seg_construction",
  "state": "MA"
}
```

---

## 7. santanderPortfolioSegments.ts

### Export: `SANT_INDUSTRY_SEGMENTS`

**Source:** Static data (12 industry segments)

**Shape:**
```typescript
Array<{
  id: string;
  name: string;
  icon: string;                 // Lucide icon name
  businessCount: number;
  totalExposure: number;
  qualRate: number;             // Percentage
  avgScore: number;
  highRiskPct: number;          // Percentage
  trend: {
    direction: "up" | "down" | "stable";
    value: number;
  };
  topProducts: Array<{
    name: string;
    eligible: number;
  }>;
  region: {
    Northeast: number;
    Southeast: number;
    Midwest: number;
    Southwest: number;
    West: number;
  };
  riskDistribution: {
    LOW: number;
    MODERATE: number;
    ELEVATED: number;
    HIGH: number;
    CRITICAL: number;
  };
  avgRevenue: number;
  avgYearsInBusiness: number;
}>
```

**Sample First Item:**
```json
{
  "id": "seg_prof_services",
  "name": "Professional Services",
  "icon": "Briefcase",
  "businessCount": 10800,
  "totalExposure": 470000000,
  "qualRate": 41.3,
  "avgScore": 75.8,
  "highRiskPct": 5.8,
  "trend": {
    "direction": "up",
    "value": 1.8
  },
  "topProducts": [
    {
      "name": "Term Loan",
      "eligible": 4460
    }
  ],
  "region": {
    "Northeast": 6858,
    "Southeast": 1782,
    "Midwest": 896,
    "Southwest": 670,
    "West": 594
  },
  "riskDistribution": {
    "LOW": 4428,
    "MODERATE": 3013,
    "ELEVATED": 1966,
    "HIGH": 1080,
    "CRITICAL": 313
  },
  "avgRevenue": 2300000,
  "avgYearsInBusiness": 10.2
}
```

---

### Export: `SANT_PORTFOLIO_KPIS`

**Source:** Static KPI data

**Shape:**
```typescript
Array<{
  id: string;
  label: string;
  value: number;
  format: "number" | "currency" | "percent" | "score";
  trend?: {
    direction: "up" | "down" | "stable";
    value: number;
    label: string;
  };
  status: "positive" | "neutral" | "warning";
  tooltip: string;
  dataSource: string;
}>
```

---

### Export: `SANT_GEOGRAPHIC_DISTRIBUTION`

**Source:** Static geographic data

**Shape:**
```typescript
Array<{
  region: string;
  states: string[];
  businessCount: number;
  exposure: number;
  avgScore: number;
  qualRate: number;
}>
```

**Sample First Item:**
```json
{
  "region": "Northeast",
  "states": ["CT", "MA", "ME", "NH", "NJ", "NY", "PA", "RI", "VT"],
  "businessCount": 43519,
  "exposure": 3710000000,
  "avgScore": 73.2,
  "qualRate": 37.8
}
```

---

### Export: `SANT_RISK_TIER_DISTRIBUTION`

**Source:** Static risk tier data

**Shape:**
```typescript
Array<{
  tier: "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL";
  count: number;
  percentage: number;
  exposure: number;
  avgScore: number;
  color: string;                // Tailwind color class
}>
```

---

### Export: `SANT_CONCENTRATION_METRICS`

**Source:** Static concentration data

**Shape:**
```typescript
Array<{
  dimension: "Industry" | "Geographic" | "Revenue Band";
  segments: Array<{
    name: string;
    percentage: number;
    exposure: number;
  }>;
  threshold: number;
  status: "within" | "approaching" | "exceeded";
}>
```

---

### Export: `SANT_EWS_ALERT_CLUSTERS`

**Source:** Static EWS data

**Shape:**
```typescript
Array<{
  type: string;
  severity: "critical" | "warning";
  businessCount: number;
  totalExposure: number;
  topIndustries: Array<{
    name: string;
    count: number;
  }>;
  trend: "stable" | "increasing" | "decreasing";
}>
```

---

### Export: `SANT_ACTIVE_CAMPAIGNS`

**Source:** Static campaign data

**Shape:**
```typescript
Array<{
  id: string;
  name: string;
  segment: string;
  product: string;
  status: "active";
  startDate: string;
  endDate: string;
  funnel: {
    pushed: number;
    viewed: number;
    applied: number;
    approved: number;
  };
  approvedVolume: number;
}>
```

---

### Export: `SANT_PRODUCT_ELIGIBILITY`

**Source:** Static product data

**Shape:**
```typescript
Record<string, {
  eligible: number;             // Number of eligible businesses
  conversionRate: number;       // Percentage
}>
```

**Sample Values:**
```json
{
  "Term Loan": {
    "eligible": 22614,
    "conversionRate": 12.4
  },
  "Line of Credit": {
    "eligible": 23760,
    "conversionRate": 10.8
  }
}
```

---

## Key Transformations Summary

### 1. FICO to LUMIQ Score Conversion
```typescript
ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}
```
- FICO 300 → LUMIQ 0
- FICO 550 → LUMIQ 45
- FICO 648 → LUMIQ 63
- FICO 850 → LUMIQ 100

### 2. Risk Tier Derivation
```typescript
deriveRiskTier(score: number): RiskTier {
  if (score >= 80) return 'LOW';
  if (score >= 70) return 'MODERATE';
  if (score >= 60) return 'ELEVATED';
  if (score >= 50) return 'HIGH';
  return 'CRITICAL';
}
```

### 3. Segment ID Mapping
- `"pre-qualified"` → `"seg_pre-qualified"`
- `"growth-opportunity"` → `"seg_growth-opportunity"`
- `"needs-monitoring"` → `"seg_needs-monitoring"`
- `"at-risk"` → `"seg_at-risk"`

### 4. Product Name Mapping
- `"Business Term Loan"` → `"TERM"`
- `"Business Line of Credit"` → `"LOC"`
- `"SBA Express Loan"` → `"SBA_EXPRESS"`
- `"Equipment Financing"` → `"EQUIPMENT"`
- `"Commercial Real Estate Mortgage"` → `"CRE"`

---

## File Navigation

| Export Constant | File | Line Range |
|----------------|------|------------|
| `SANT_PILOT_METRICS` | `santanderDataLoader.ts` | 74-118 |
| `SANT_DEMO_BUSINESSES` | `santanderDataLoader.ts` | 146-172 |
| `SANT_PORTFOLIO` | `santanderPortfolioLoader.ts` | 163-175 |
| `SANT_SEGMENTS` | `santanderPortfolioLoader.ts` | 179-201 |
| `SANT_RISK_TIERS` | `santanderPortfolioLoader.ts` | 205-236 |
| `SANT_CAMPAIGNS` | `santanderCampaignLoader.ts` | 145-177 |
| `SANT_CAMPAIGN_SUMMARY` | `santanderCampaignLoader.ts` | 183-198 |
| `SANT_CONVERSION_BY_SEGMENT` | `santanderCampaignLoader.ts` | 204-301 |
| `SANT_RISK_KPIS` | `santanderRiskLoader.ts` | 49-69 |
| `SANT_CONCENTRATION` | `santanderRiskLoader.ts` | 75-146 |
| `SANT_EWS_CLUSTERS` | `santanderRiskLoader.ts` | 176-233 |
| `SANT_COMPLIANCE` | `santanderRiskLoader.ts` | 239-293 |
| `SANT_UNDERWRITING` | `santanderUnderwritingLoader.ts` | 138-142 |
| `SANT_FILTER_OPTIONS` | `santanderFilterLoader.ts` | 114-121 |
| `SANT_SAVED_SEGMENTS` | `santanderFilterLoader.ts` | 127-156 |
| `SANT_SAMPLE_BUSINESSES` | `santanderFilterLoader.ts` | 162-174 |
| `SANT_INDUSTRY_SEGMENTS` | `santanderPortfolioSegments.ts` | 27-424 |
| `SANT_PORTFOLIO_KPIS` | `santanderPortfolioSegments.ts` | 432-493 |
| `SANT_GEOGRAPHIC_DISTRIBUTION` | `santanderPortfolioSegments.ts` | 501-542 |
| `SANT_RISK_TIER_DISTRIBUTION` | `santanderPortfolioSegments.ts` | 551-592 |
| `SANT_CONCENTRATION_METRICS` | `santanderPortfolioSegments.ts` | 600-638 |
| `SANT_EWS_ALERT_CLUSTERS` | `santanderPortfolioSegments.ts` | 644-701 |
| `SANT_ACTIVE_CAMPAIGNS` | `santanderPortfolioSegments.ts` | 707-795 |
| `SANT_PRODUCT_ELIGIBILITY` | `santanderPortfolioSegments.ts` | 801-838 |

---

## Data Validation Notes

1. **Total Businesses**: All counts across industry segments sum to 68,500 (portfolio subset)
2. **Risk Tiers**: All counts sum to 180,000 (full portfolio)
3. **Geographic Distribution**: All regional counts sum to 68,500
4. **FICO Range**: All `lumiq_score` values in JSON are FICO scores (300-850 range)
5. **Currency Values**: All exposure/revenue values are in USD (no decimal places)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-12
**Maintainer:** Claude Code Agent
