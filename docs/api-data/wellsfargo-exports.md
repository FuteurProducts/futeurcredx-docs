# Wells Fargo Data Exports - TypeScript to JSON Mapping Guide

This document maps each TypeScript export constant from the Wells Fargo loader files to the exact JSON data source and structure.

**Source JSON**: `/Users/devaccount/Lumiq-AI-Dashboard/src/data/wellsfargo.json`
**Documentation Date**: 2026-02-12
**Total Portfolio**: 3.3M customers, $670B exposure, 8 segments, 3 campaigns, 50 sample businesses

---

## Table of Contents

1. [wellsfargoDataLoader.ts](#1-wellsfargodataloaderts)
2. [wellsfargoPortfolioLoader.ts](#2-wellsfargoportfolioloaderts)
3. [wellsfargoCampaignLoader.ts](#3-wellsfargocampaignloaderts)
4. [wellsfargoRiskLoader.ts](#4-wellsfargoriskloaderts)
5. [wellsfargoUnderwritingLoader.ts](#5-wellsfargounderwritingloaderts)
6. [wellsfargoFilterLoader.ts](#6-wellsfargofilterloaderts)
7. [wellsfargoPortfolioSegments.ts](#7-wellsfargoportfoliosegmentsts)
8. [FICO to LUMIQ Conversion](#8-fico-to-lumiq-conversion)

---

## 1. wellsfargoDataLoader.ts

### Export: `WF_PILOT_METRICS`

**Maps to**: `portfolio_summary` object + derived calculations
**Purpose**: Top-level KPIs scaled to Wells Fargo's 3.3M customer portfolio

#### Shape
```typescript
{
  // Business coverage
  totalBusinesses: number;          // FROM: portfolio_summary.totalCustomers (3,300,000)
  scoredBusinesses: number;         // CALC: totalCustomers * 0.804 (2,653,200)
  scoreCoverage: number;            // STATIC: 80.4

  // Pre-qualification funnel
  preQualifiedBusinesses: number;   // CALC: totalCustomers * keyMetrics.pre_qualified_rate / 100 (2,145,000)
  preQualRate: number;              // FROM: keyMetrics.pre_qualified_rate (65.0)
  applicationsStarted: number;      // CALC: preQualifiedBusinesses * 0.0985 (211,282)
  applicationConversion: number;    // STATIC: 25.0
  approved: number;                 // CALC: applicationsStarted * 0.755 (159,518)
  approvalRate: number;             // STATIC: 75.5
  funded: number;                   // CALC: approved * 0.90 (143,566)
  fundingRate: number;              // STATIC: 90.0
  ineligible: number;               // CALC: totalCustomers * 0.198 (653,400)

  // Score distribution
  avgLumiqScore: number;            // CALC: ficoToLumiq(avgCreditScore) — 698 FICO → 72
  medianLumiqScore: number;         // STATIC: 70

  // API performance
  totalApiCalls: number;            // CALC: scaled from pilot (3,247,000 * 69.47) = ~225M
  dailyAvgCalls: number;            // CALC: totalApiCalls / 92
  successRate: number;              // STATIC: 99.94
  avgLatencyMs: number;             // STATIC: 145
  p99LatencyMs: number;             // STATIC: 380
  errorCount: number;               // CALC: scaled from pilot

  // Financial impact
  avgPreQualLimit: number;          // FROM: avgExposurePerCustomer (203,030)
  projectedOriginations: number;    // CALC: preQualifiedBusinesses * avgExposurePerCustomer * 0.25
  avgRevenuePerBusiness: number;    // STATIC: 4,250
  projectedAnnualRevenue: number;   // CALC: approved * 4,250

  // Risk metrics
  delinquencyRate: number;          // FROM: nplRate (0.58)
  defaultRate: number;              // FROM: defaultRate (0.27)
  portfolioUtilization: number;     // FROM: keyMetrics.avg_loan_utilization (68.4)

  // Growth metrics
  momGrowth: number;                // FROM: portfolioGrowthYoY (3.0)
  qoqGrowth: number;                // STATIC: 10.2
  avgTimeToApproval: number;        // STATIC: 2.5 (days)
}
```

#### Sample Values (First Item)
```json
{
  "totalBusinesses": 3300000,
  "scoredBusinesses": 2653200,
  "scoreCoverage": 80.4,
  "preQualifiedBusinesses": 2145000,
  "preQualRate": 65.0,
  "avgLumiqScore": 72,
  "delinquencyRate": 0.58,
  "defaultRate": 0.27
}
```

---

### Export: `WF_DEMO_BUSINESSES`

**Maps to**: `sample_businesses` array (first 10 items)
**Purpose**: Sample business entities for UI display

#### Shape
```typescript
Array<{
  id: string;                    // FROM: sample_businesses[].id (with underscore replaced by dash)
  name: string;                  // FROM: sample_businesses[].name
  legalName: string;             // FROM: sample_businesses[].name
  industry: string;              // FROM: sample_businesses[].industry
  naicsCode: string;             // STATIC: "000000"
  city: string;                  // FROM: sample_businesses[].city
  state: string;                 // FROM: sample_businesses[].state
  annualRevenue: number;         // FROM: sample_businesses[].revenue
  employeeCount: number;         // FROM: sample_businesses[].employeeCount
  yearsInBusiness: number;       // FROM: sample_businesses[].yearsInBusiness
  lumiqScore: number;            // CALC: ficoToLumiq(creditScore) — 708 FICO → 74
  ownerFico: number;             // CALC: 640 + (lumiqScore * 1.5)
  riskTier: 'low' | 'medium' | 'high';  // DERIVED: from lumiqScore
  scoreTrend: 'up' | 'down' | 'stable'; // DERIVED: from lumiqScore
  trendValue: number;            // DERIVED: from lumiqScore
  segment: 'micro' | 'small' | 'mid-market'; // DERIVED: from revenue
  hasActiveApplication: boolean; // DERIVED: totalExposure > 0
  productType: string;           // FROM: sample_businesses[].currentProducts[0]
  applicationAmount: number;     // FROM: sample_businesses[].totalExposure
}>
```

#### Sample Values (First Item: "AgriTech Farms Co-op")
```json
{
  "id": "biz-wf-001",
  "name": "AgriTech Farms Co-op",
  "legalName": "AgriTech Farms Co-op",
  "industry": "Food Service & Agriculture",
  "naicsCode": "000000",
  "city": "Cedar Rapids",
  "state": "IA",
  "annualRevenue": 12500000,
  "employeeCount": 78,
  "yearsInBusiness": 32,
  "lumiqScore": 74,
  "ownerFico": 751,
  "riskTier": "medium",
  "scoreTrend": "stable",
  "trendValue": 1,
  "segment": "mid-market",
  "hasActiveApplication": true,
  "productType": "Equipment Financing",
  "applicationAmount": 2850000
}
```

---

## 2. wellsfargoPortfolioLoader.ts

### Export: `WF_PORTFOLIO`

**Maps to**: `portfolio_summary` + `risk_metrics.credit_quality`
**Purpose**: Portfolio-level aggregates

#### Shape
```typescript
{
  totalBusinesses: number;           // FROM: portfolio_summary.totalCustomers (3,300,000)
  totalExposure: number;             // FROM: portfolio_summary.totalExposure (670,000,000,000)
  preQualRate: number;               // FROM: keyMetrics.pre_qualified_rate / 100 (0.65)
  avgCompositeScore: number;         // CALC: ficoToLumiq(avgCreditScore) — 698 → 72
  avgCompositeScorePrevMonth: number;// CALC: avgCompositeScore - 0.3
  atRiskExposure: number;            // FROM: credit_quality.at_risk_exposure_billions * 1e9 (40.3B)
  atRiskPercent: number;             // FROM: keyMetrics.at_risk_rate / 100 (0.13)
  offerPotential: number;            // CALC: totalCustomers * 0.45 (1,485,000)
  quarterlyGrowth: number;           // CALC: totalCustomers * portfolioGrowthYoY / 100 (99,000)
  bureauHitRate: number;             // STATIC: 0.985
  avgScoreRefreshDays: number;       // STATIC: 20
}
```

#### Sample Values
```json
{
  "totalBusinesses": 3300000,
  "totalExposure": 670000000000,
  "preQualRate": 0.65,
  "avgCompositeScore": 72,
  "avgCompositeScorePrevMonth": 71.7,
  "atRiskExposure": 40300000000,
  "atRiskPercent": 0.13,
  "offerPotential": 1485000
}
```

---

### Export: `WF_SEGMENTS`

**Maps to**: `segments` array (8 segments)
**Purpose**: Industry segment analytics

#### Shape
```typescript
Array<{
  id: string;                    // FROM: segments[].id (e.g., "seg_tech")
  name: string;                  // FROM: segments[].name (e.g., "Technology")
  icon: string;                  // MAPPED: from SEGMENT_ICONS lookup
  businessCount: number;         // FROM: segments[].customerCount
  exposure: number;              // FROM: segments[].totalExposure
  avgScore: number;              // CALC: ficoToLumiq(segments[].avgScore)
  preQualRate: number;           // DERIVED: from defaultRate (lower default → higher preQual)
  riskDistribution: Record<string, number>; // DERIVED: from defaultRate
  conversionRate: number;        // DERIVED: from growthRate
  status: 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk'; // DERIVED: from avgScore
  trend: 'up' | 'down' | 'stable'; // DERIVED: from growthRate
  productEligibility: Record<string, number>; // CALC: customerCount * product eligibility %
}>
```

#### Sample Values (First Item: Technology)
```json
{
  "id": "seg_tech",
  "name": "Technology",
  "icon": "💻",
  "businessCount": 346500,
  "exposure": 70350000000,
  "avgScore": 76,
  "preQualRate": 0.72,
  "riskDistribution": {
    "LOW": 0.31,
    "MODERATE": 0.45,
    "ELEVATED": 0.16,
    "HIGH": 0.06,
    "CRITICAL": 0.02
  },
  "conversionRate": 0.12,
  "status": "top_performer",
  "trend": "up",
  "productEligibility": {
    "LOC": 173250,
    "SBA": 51975,
    "EQF": 138600
  }
}
```

---

### Export: `WF_RISK_TIERS`

**Maps to**: `portfolio_summary` totals + derived percentages
**Purpose**: Portfolio-wide risk tier distribution

#### Shape
```typescript
{
  LOW: {
    percent: number;             // STATIC: 0.22
    count: number;               // CALC: totalBusinesses * 0.22
    exposure: number;            // CALC: totalExposure * 0.22
    label: string;               // STATIC: "Low Risk"
  },
  MODERATE: { /* similar structure */ },
  ELEVATED: { /* similar structure */ },
  HIGH: { /* similar structure */ },
  CRITICAL: { /* similar structure */ }
}
```

#### Sample Values (LOW tier)
```json
{
  "LOW": {
    "percent": 0.22,
    "count": 726000,
    "exposure": 147400000000,
    "label": "Low Risk"
  }
}
```

---

## 3. wellsfargoCampaignLoader.ts

### Export: `WF_CAMPAIGNS`

**Maps to**: `campaigns` array (3 campaigns)
**Purpose**: Marketing campaign performance

#### Shape
```typescript
Array<{
  id: string;                    // FROM: campaigns[].id
  name: string;                  // FROM: campaigns[].name
  status: string;                // FROM: campaigns[].status
  health: 'on_track' | 'below_target' | 'paused' | 'completed'; // DERIVED: from viewRate
  targetSegment: string;         // MAPPED: from campaigns[].targetSegments[0]
  targetCriteria: string;        // DERIVED: combination of segments + product + score
  product: string;               // MAPPED: from campaigns[].product
  startDate: string;             // FROM: campaigns[].startDate
  endDate: string;               // FROM: campaigns[].endDate
  owner: string;                 // MAPPED: from CAMPAIGN_OWNERS lookup
  funnel: {
    pushed: number;              // FROM: campaigns[].performance.targeted
    viewed: number;              // FROM: campaigns[].performance.reached
    applied: number;             // FROM: campaigns[].performance.applied
    approved: number;            // FROM: campaigns[].performance.approved
  };
  viewRate: number;              // CALC: viewed / pushed
  applyRate: number;             // CALC: applied / pushed
  approvalRate: number;          // CALC: approved / applied
  approvedVolume: number;        // FROM: campaigns[].performance.totalVolume
  warning?: string;              // DERIVED: if viewRate < 0.35
}>
```

#### Sample Values (First Item: BusinessLine LOC Spring 2026)
```json
{
  "id": "camp_wf_businessline_q1",
  "name": "BusinessLine LOC Spring 2026",
  "status": "active",
  "health": "on_track",
  "targetSegment": "seg_tech",
  "targetCriteria": "Technology + Professional Services + Healthcare + Score >50 + LOC eligible",
  "product": "LOC",
  "startDate": "2026-01-15",
  "endDate": "2026-03-31",
  "owner": "Lisa Chen",
  "funnel": {
    "pushed": 285000,
    "viewed": 267400,
    "applied": 18920,
    "approved": 13844
  },
  "viewRate": 0.938,
  "applyRate": 0.0664,
  "approvalRate": 0.732,
  "approvedVolume": 588370000
}
```

---

### Export: `WF_CAMPAIGN_SUMMARY`

**Maps to**: Aggregated from `WF_CAMPAIGNS`
**Purpose**: Campaign funnel totals

#### Shape
```typescript
{
  activeCampaigns: number;       // COUNT: WF_CAMPAIGNS.length
  offersPushed: number;          // SUM: WF_CAMPAIGNS[].funnel.pushed
  avgViewRate: number;           // CALC: totalViewed / totalPushed
  avgApplyRate: number;          // CALC: totalApplied / totalPushed
  avgApprovalRate: number;       // CALC: totalApproved / totalApplied
  revenueBooked: number;         // SUM: WF_CAMPAIGNS[].approvedVolume
}
```

#### Sample Values
```json
{
  "activeCampaigns": 3,
  "offersPushed": 552000,
  "avgViewRate": 0.938,
  "avgApplyRate": 0.052,
  "avgApprovalRate": 0.742,
  "revenueBooked": 3979135000
}
```

---

### Export: `WF_CONVERSION_BY_SEGMENT`

**Maps to**: STATIC data based on 8 WF segments
**Purpose**: Segment-level conversion funnel metrics

#### Shape
```typescript
Array<{
  segment: string;               // STATIC: segment names
  viewRate: number;              // STATIC: realistic conversion rates
  applyRate: number;             // STATIC: realistic conversion rates
  approvalRate: number;          // STATIC: realistic conversion rates
  endToEnd: number;              // CALC: viewRate * applyRate * approvalRate
  status: 'ok' | 'warning' | 'at_risk'; // DERIVED: from performance
}>
```

#### Sample Values (First Item: Technology)
```json
{
  "segment": "Technology",
  "viewRate": 0.70,
  "applyRate": 0.16,
  "approvalRate": 0.56,
  "endToEnd": 0.06272,
  "status": "ok"
}
```

---

## 4. wellsfargoRiskLoader.ts

### Export: `WF_RISK_KPIS`

**Maps to**: `risk_metrics.credit_quality`, `risk_metrics.alerts`, `segments`
**Purpose**: Risk KPI metrics

#### Shape
```typescript
{
  portfolioAtRisk: {
    value: number;               // FROM: credit_quality.at_risk_exposure_billions * 1e9
    percent: number;             // FROM: keyMetrics.at_risk_rate / 100
  };
  industryConcentration: {
    value: number;               // FROM: segments[5].percentage / 100 (Construction)
    label: string;               // FROM: segments[5].name
  };
  geographicConcentration: {
    value: number;               // STATIC: 0.246 (California)
    label: string;               // STATIC: "California"
  };
  ewsAlerts: number;             // SUM: alerts[].affected_count
  thirtyDayDeterioration: number; // CALC: at_risk_count * 0.02
  watchList: number;             // CALC: at_risk_count * 0.05
}
```

#### Sample Values
```json
{
  "portfolioAtRisk": {
    "value": 40300000000,
    "percent": 0.13
  },
  "industryConcentration": {
    "value": 0.155,
    "label": "Construction"
  },
  "geographicConcentration": {
    "value": 0.246,
    "label": "California"
  },
  "ewsAlerts": 1331800,
  "thirtyDayDeterioration": 8580,
  "watchList": 21450
}
```

---

### Export: `WF_CONCENTRATION`

**Maps to**: `segments` + STATIC geographic data
**Purpose**: Concentration limits and current values

#### Shape
```typescript
{
  industry: {
    limit: number;               // STATIC: 0.20
    values: Array<{
      name: string;              // FROM: segments[].name
      percent: number;           // FROM: segments[].percentage / 100
      exposure: number;          // FROM: segments[].totalExposure
      status: 'warning' | 'safe' | 'breach'; // DERIVED: percent vs limit
    }>
  };
  geography: {
    limit: number;               // STATIC: 0.30
    values: Array<{
      name: string;              // STATIC: region names
      percent: number;           // STATIC: region percentages
      exposure: number;          // STATIC: region exposures
      status: 'warning' | 'safe' | 'breach';
    }>
  }
}
```

#### Sample Values (Industry, First Item)
```json
{
  "industry": {
    "limit": 0.20,
    "values": [
      {
        "name": "Construction",
        "percent": 0.155,
        "exposure": 103850450000,
        "status": "warning"
      }
    ]
  }
}
```

---

### Export: `WF_EWS_CLUSTERS`

**Maps to**: `risk_metrics.alerts` array (3 alerts)
**Purpose**: Early Warning System alert clusters

#### Shape
```typescript
Array<{
  id: string;                    // DERIVED: "ews_wf_{type}_{index}"
  type: string;                  // MAPPED: from alert.type via deriveTypeCode()
  severity: 'critical' | 'high' | 'medium' | 'low'; // FROM: alerts[].severity
  title: string;                 // FROM: alerts[].message (split on ' - ')
  businessCount: number;         // FROM: alerts[].affected_count
  exposure: number;              // FROM: alerts[].exposure
  heaviestSegments: Array<{
    segment: string;             // DERIVED: from alert.type
    count: number;               // CALC: affected_count * percentage
  }>;
  actions: string[];             // STATIC: ["View Segment", "Add All to Watch List", "Assign to Team"]
}>
```

#### Sample Values (First Item: Construction concentration)
```json
{
  "id": "ews_wf_concentration_0",
  "type": "CONCENTRATION_RISK",
  "severity": "medium",
  "title": "Construction segment exposure at 15.5% ($103.9B)",
  "businessCount": 511500,
  "exposure": 103850450000,
  "heaviestSegments": [
    { "segment": "Construction", "count": 204600 },
    { "segment": "Texas", "count": 127875 }
  ],
  "actions": ["View Segment", "Add All to Watch List", "Assign to Team"]
}
```

---

### Export: `WF_COMPLIANCE`

**Maps to**: STATIC compliance data scaled to WF portfolio
**Purpose**: Fair lending and approval variance metrics

#### Shape
```typescript
{
  approvalVariance: Array<{
    segment: string;             // STATIC: segment names
    applications: number;        // STATIC: scaled application volumes
    approved: number;            // CALC: applications * rate
    rate: number;                // STATIC: approval rates by segment
    variance: number;            // CALC: rate - portfolioApprovalRate
    status: 'ok' | 'review' | 'flag'; // DERIVED: from variance
  }>;
  portfolioApprovalRate: number; // STATIC: 0.72
  adverseActionsSent: number;    // CALC: totalCustomers * 0.16
  fairLendingStatus: string;     // STATIC: "pass"
}
```

#### Sample Values (First Item: Technology)
```json
{
  "approvalVariance": [
    {
      "segment": "Technology",
      "applications": 118000,
      "approved": 96760,
      "rate": 0.82,
      "variance": 0.10,
      "status": "ok"
    }
  ],
  "portfolioApprovalRate": 0.72,
  "adverseActionsSent": 528000,
  "fairLendingStatus": "pass"
}
```

---

## 5. wellsfargoUnderwritingLoader.ts

### Export: `WF_UNDERWRITING`

**Maps to**: `underwriting_queue` array (15 applications)
**Purpose**: Underwriting queue data and KPIs

#### Shape
```typescript
{
  kpis: {
    queueDepth: number;          // COUNT: underwriting_queue.length
    avgDecisionTime: number;     // CALC: avg(timeInQueue) / 24 (hours → days)
    autoApproveRate: number;     // CALC: recommendations='approve' / total
    manualReviewRate: number;    // CALC: recommendations='review'+'conditional' / total
    declineRate: number;         // CALC: 1 - autoApproveRate - manualReviewRate
    slaCompliance: number;       // CALC: items with timeInQueue < 96hrs / total
  };
  queue: Array<{
    id: string;                  // FROM: underwriting_queue[].id
    business: string;            // FROM: underwriting_queue[].businessName
    product: string;             // MAPPED: from underwriting_queue[].product
    amount: number;              // FROM: underwriting_queue[].requestedAmount
    score: number;               // CALC: ficoToLumiq(creditScore)
    risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL'; // DERIVED: from score
    timeInQueue: number;         // CALC: hours since submittedDate
    slaStatus: 'ok' | 'warning' | 'breach'; // DERIVED: from timeInQueue
  }>;
  rules: {
    autoApprove: string[];       // STATIC: 4 auto-approve criteria
    autoDecline: string[];       // STATIC: 3 auto-decline criteria
  }
}
```

#### Sample Values (First Queue Item: Cascade Timber Solutions)
```json
{
  "kpis": {
    "queueDepth": 15,
    "avgDecisionTime": 2.13,
    "autoApproveRate": 0.267,
    "manualReviewRate": 0.533,
    "declineRate": 0.200,
    "slaCompliance": 0.867
  },
  "queue": [
    {
      "id": "app_wf_20260211_001",
      "business": "Cascade Timber Solutions",
      "product": "EQF",
      "amount": 385000,
      "score": 71,
      "risk": "MODERATE",
      "timeInQueue": 48,
      "slaStatus": "ok"
    }
  ],
  "rules": {
    "autoApprove": [
      "Composite Score >= 75",
      "No delinquencies in 24 months",
      "Business age >= 3 years",
      "Amount <= $100,000"
    ],
    "autoDecline": [
      "Composite Score < 25",
      "Active bankruptcy",
      "Industry: Cannabis, Gaming, Adult Entertainment"
    ]
  }
}
```

---

## 6. wellsfargoFilterLoader.ts

### Export: `WF_FILTER_OPTIONS`

**Maps to**: `filter_options` object
**Purpose**: Filter dropdown options for UI

#### Shape
```typescript
{
  industries: string[];          // FROM: filter_options.industries (8 items)
  states: string[];              // FROM: filter_options.states (42 items)
  riskTiers: Array<'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL'>; // STATIC: 5 tiers
  products: string[];            // FROM: filter_options.products (9 items)
  scoreRange: {
    min: number;                 // STATIC: 0
    max: number;                 // STATIC: 100
  };
  revenueRange: {
    min: number;                 // STATIC: 100,000
    max: number;                 // STATIC: 50,000,000
  }
}
```

#### Sample Values
```json
{
  "industries": [
    "Technology",
    "Professional Services",
    "Manufacturing",
    "Retail Trade",
    "Healthcare",
    "Construction",
    "Food Service & Agriculture",
    "Transportation & Logistics"
  ],
  "states": ["CA", "TX", "FL", "NY", "WA", "NC", "AZ", "GA", "CO", "OR", "..."],
  "riskTiers": ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
  "products": [
    "BusinessLine Line of Credit",
    "Prime Line of Credit",
    "Small Business Advantage LOC",
    "SBA 7(a) Loan",
    "SBA 504 Loan",
    "Equipment Financing",
    "Commercial Real Estate Loan",
    "Commercial Auto Financing",
    "Working Capital Loan"
  ],
  "scoreRange": { "min": 0, "max": 100 },
  "revenueRange": { "min": 100000, "max": 50000000 }
}
```

---

### Export: `WF_SAVED_SEGMENTS`

**Maps to**: STATIC saved segment data scaled to WF portfolio
**Purpose**: Predefined customer segments

#### Shape
```typescript
Array<{
  id: string;                    // STATIC: segment IDs
  name: string;                  // STATIC: segment names
  businessCount: number;         // STATIC: scaled to WF portfolio
  exposure: number;              // STATIC: scaled to WF portfolio
  createdAt: string;             // STATIC: ISO date strings
}>
```

#### Sample Values (First Item: High Value Technology)
```json
{
  "id": "seg_high_value_tech",
  "name": "High Value Technology",
  "businessCount": 297000,
  "exposure": 60300000000,
  "createdAt": "2026-01-15T10:30:00Z"
}
```

---

### Export: `WF_SAMPLE_BUSINESSES`

**Maps to**: `sample_businesses` array (all 50 businesses)
**Purpose**: Searchable business list for UI

#### Shape
```typescript
Array<{
  id: string;                    // FROM: sample_businesses[].id
  name: string;                  // FROM: sample_businesses[].name
  revenue: number;               // FROM: sample_businesses[].revenue
  score: number;                 // CALC: ficoToLumiq(creditScore)
  risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL'; // DERIVED: from score
  status: string;                // DERIVED: from score
  segment: string;               // MAPPED: from industry
  state: string;                 // FROM: sample_businesses[].state
}>
```

#### Sample Values (First Item: AgriTech Farms Co-op)
```json
{
  "id": "biz_wf_001",
  "name": "AgriTech Farms Co-op",
  "revenue": 12500000,
  "score": 74,
  "risk": "MODERATE",
  "status": "Offer Sent",
  "segment": "seg_food_service",
  "state": "IA"
}
```

---

## 7. wellsfargoPortfolioSegments.ts

### Export: `WF_INDUSTRY_SEGMENTS`

**Maps to**: `segments` array + STATIC enrichments
**Purpose**: Detailed industry segment analytics with regional breakdowns

#### Shape
```typescript
Array<{
  id: string;                    // FROM: segments[].id
  name: string;                  // FROM: segments[].name
  icon: string;                  // STATIC: icon names (e.g., "Laptop", "Briefcase")
  businessCount: number;         // FROM: segments[].customerCount
  totalExposure: number;         // FROM: segments[].totalExposure
  qualRate: number;              // DERIVED: from defaultRate
  avgScore: number;              // CALC: ficoToLumiq(avgScore)
  highRiskPct: number;           // DERIVED: from defaultRate
  trend: {
    direction: 'up' | 'down' | 'stable'; // DERIVED: from growthRate
    value: number;               // FROM: segments[].growthRate
  };
  topProducts: Array<{
    name: string;                // STATIC: product names
    eligible: number;            // CALC: customerCount * eligibility %
  }>;
  region: Record<string, number>; // STATIC: regional distribution by customer count
  riskDistribution: Record<string, number>; // DERIVED: from defaultRate
  avgRevenue: number;            // STATIC: typical revenue for segment
  avgYearsInBusiness: number;    // STATIC: typical age for segment
}>
```

#### Sample Values (First Item: Technology)
```json
{
  "id": "seg_tech",
  "name": "Technology",
  "icon": "Laptop",
  "businessCount": 346500,
  "totalExposure": 70350000000,
  "qualRate": 44.8,
  "avgScore": 76,
  "highRiskPct": 4.2,
  "trend": { "direction": "up", "value": 12.4 },
  "topProducts": [
    { "name": "BusinessLine Line of Credit", "eligible": 155925 },
    { "name": "Prime Line of Credit", "eligible": 121275 },
    { "name": "SBA 7(a) Loan", "eligible": 69300 },
    { "name": "Equipment Financing", "eligible": 48510 }
  ],
  "region": {
    "Northeast": 34650,
    "Southeast": 52000,
    "Midwest": 52000,
    "Southwest": 69300,
    "West": 138550
  },
  "riskDistribution": {
    "LOW": 173250,
    "MODERATE": 121275,
    "ELEVATED": 41580,
    "HIGH": 6930,
    "CRITICAL": 3465
  },
  "avgRevenue": 4800000,
  "avgYearsInBusiness": 6.8
}
```

---

### Export: `WF_PORTFOLIO_KPIS`

**Maps to**: `portfolio_summary` + derived calculations
**Purpose**: Top-level portfolio KPI cards

#### Shape
```typescript
Array<{
  id: string;                    // STATIC: KPI IDs
  label: string;                 // STATIC: KPI labels
  value: number;                 // FROM/CALC: various sources
  format: 'number' | 'currency' | 'percent' | 'score'; // STATIC: display format
  trend: {
    direction: 'up' | 'down' | 'stable'; // STATIC/CALC: trend direction
    value: number;               // STATIC/CALC: trend value
    label: string;               // STATIC: trend label
  };
  status: 'positive' | 'neutral' | 'warning'; // STATIC: status indicator
  tooltip: string;               // STATIC: help text
  dataSource: string;            // STATIC: source system
}>
```

#### Sample Values (First Item: Total Portfolio)
```json
{
  "id": "total-portfolio",
  "label": "Total Portfolio",
  "value": 3300000,
  "format": "number",
  "trend": {
    "direction": "up",
    "value": 3.0,
    "label": "+3.0% vs last quarter"
  },
  "status": "positive",
  "tooltip": "Total number of businesses in portfolio",
  "dataSource": "Portfolio Management System"
}
```

---

### Export: `WF_GEOGRAPHIC_DISTRIBUTION`

**Maps to**: STATIC geographic data scaled to WF portfolio
**Purpose**: Regional portfolio breakdowns

#### Shape
```typescript
Array<{
  region: string;                // STATIC: region names
  states: string[];              // STATIC: state abbreviations in region
  businessCount: number;         // STATIC: scaled to WF portfolio
  exposure: number;              // STATIC: scaled to WF portfolio
  avgScore: number;              // STATIC: regional avg LUMIQ score
  qualRate: number;              // STATIC: regional qualification rate
}>
```

#### Sample Values (First Item: Northeast)
```json
{
  "region": "Northeast",
  "states": ["CT", "MA", "ME", "NH", "NJ", "NY", "PA", "RI", "VT"],
  "businessCount": 528000,
  "exposure": 107200000000,
  "avgScore": 74.2,
  "qualRate": 40.1
}
```

---

### Export: `WF_RISK_TIER_DISTRIBUTION`

**Maps to**: `risk_metrics.credit_quality` bands
**Purpose**: Portfolio-wide risk tier distribution

#### Shape
```typescript
Array<{
  tier: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL'; // STATIC: tier names
  count: number;                 // FROM: credit_quality bands count
  percentage: number;            // FROM: credit_quality bands percentage
  exposure: number;              // CALC: count * avg_exposure (scaled)
  avgScore: number;              // CALC: ficoToLumiq(credit_quality bands avg_score)
  color: string;                 // STATIC: Tailwind color classes
}>
```

#### Sample Values (First Item: LOW)
```json
{
  "tier": "LOW",
  "count": 1155000,
  "percentage": 35.0,
  "exposure": 234500000000,
  "avgScore": 83,
  "color": "bg-green-500"
}
```

---

### Export: `WF_CONCENTRATION_METRICS`

**Maps to**: `segments` + STATIC data
**Purpose**: Industry, geographic, and revenue band concentration analysis

#### Shape
```typescript
Array<{
  dimension: 'Industry' | 'Geographic' | 'Revenue Band'; // STATIC: dimension type
  segments: Array<{
    name: string;                // FROM: segments[].name OR STATIC
    percentage: number;          // FROM: segments[].percentage OR STATIC
    exposure: number;            // FROM: segments[].totalExposure OR STATIC
  }>;
  threshold: number;             // STATIC: concentration limit (e.g., 15%, 30%, 25%)
  status: 'within' | 'approaching' | 'breach'; // DERIVED: max(percentage) vs threshold
}>
```

#### Sample Values (First Dimension: Industry)
```json
{
  "dimension": "Industry",
  "segments": [
    { "name": "Construction", "percentage": 15.5, "exposure": 103850450000 },
    { "name": "Manufacturing", "percentage": 14.2, "exposure": 95139600000 },
    { "name": "Transportation & Logistics", "percentage": 14.5, "exposure": 97169850000 },
    { "name": "Professional Services", "percentage": 11.8, "exposure": 79060200000 },
    { "name": "Healthcare", "percentage": 11.0, "exposure": 73699890000 },
    { "name": "Other Industries", "percentage": 33.0, "exposure": 220079910000 }
  ],
  "threshold": 15.0,
  "status": "approaching"
}
```

---

### Export: `WF_EWS_ALERT_CLUSTERS`

**Maps to**: STATIC early warning alert data scaled to WF portfolio
**Purpose**: Early Warning System alert clusters for risk monitoring

#### Shape
```typescript
Array<{
  type: string;                  // STATIC: alert type (e.g., "Score Drop >15pts")
  severity: 'critical' | 'high' | 'medium' | 'low'; // STATIC: severity level
  businessCount: number;         // STATIC: scaled to WF portfolio
  totalExposure: number;         // STATIC: scaled to WF portfolio
  topIndustries: Array<{
    name: string;                // STATIC: industry names
    count: number;               // STATIC: scaled counts
  }>;
  trend: 'increasing' | 'decreasing' | 'stable'; // STATIC: trend direction
}>
```

#### Sample Values (First Item: Score Drop >15pts)
```json
{
  "type": "Score Drop >15pts",
  "severity": "critical",
  "businessCount": 9900,
  "totalExposure": 2680000000,
  "topIndustries": [
    { "name": "Retail Trade", "count": 2030 },
    { "name": "Food Service & Agriculture", "count": 1684 },
    { "name": "Construction", "count": 1534 },
    { "name": "Transportation & Logistics", "count": 1437 },
    { "name": "Other", "count": 3215 }
  ],
  "trend": "stable"
}
```

---

### Export: `WF_ACTIVE_CAMPAIGNS`

**Maps to**: `campaigns` array (3 campaigns)
**Purpose**: Active marketing campaigns for portfolio view

#### Shape
```typescript
Array<{
  id: string;                    // FROM: campaigns[].id
  name: string;                  // FROM: campaigns[].name
  segment: string;               // FROM: campaigns[].targetSegments (joined)
  product: string;               // FROM: campaigns[].product
  status: 'active' | 'paused' | 'completed'; // FROM: campaigns[].status
  startDate: string;             // FROM: campaigns[].startDate
  endDate: string;               // FROM: campaigns[].endDate
  funnel: {
    pushed: number;              // FROM: campaigns[].performance.targeted
    viewed: number;              // FROM: campaigns[].performance.reached
    applied: number;             // FROM: campaigns[].performance.applied
    approved: number;            // FROM: campaigns[].performance.approved
  };
  approvedVolume: number;        // FROM: campaigns[].performance.totalVolume
}>
```

#### Sample Values (First Item: BusinessLine LOC Spring 2026)
```json
{
  "id": "camp_wf_businessline_q1",
  "name": "BusinessLine LOC Spring 2026",
  "segment": "Technology, Professional Services, Healthcare",
  "product": "BusinessLine Line of Credit",
  "status": "active",
  "startDate": "2026-01-15",
  "endDate": "2026-03-31",
  "funnel": {
    "pushed": 285000,
    "viewed": 267400,
    "applied": 18920,
    "approved": 13844
  },
  "approvedVolume": 588370000
}
```

---

### Export: `WF_COMPLETED_CAMPAIGNS`

**Maps to**: STATIC historical campaign data
**Purpose**: Historical campaign performance

#### Shape
Same as `WF_ACTIVE_CAMPAIGNS`

#### Sample Values (First Item: Q4 2025 Retail LOC Push)
```json
{
  "id": "camp_wf_c01",
  "name": "Q4 2025 Retail LOC Push",
  "segment": "Retail Trade",
  "product": "Small Business Advantage LOC",
  "status": "completed",
  "startDate": "2025-10-01",
  "endDate": "2025-12-31",
  "funnel": {
    "pushed": 95000,
    "viewed": 85500,
    "applied": 5985,
    "approved": 4189
  },
  "approvedVolume": 293250000
}
```

---

### Export: `WF_PRODUCT_ELIGIBILITY`

**Maps to**: STATIC product eligibility data scaled to WF portfolio
**Purpose**: Product-level eligibility and conversion metrics

#### Shape
```typescript
Record<string, {
  eligible: number;              // STATIC: scaled eligible business count
  conversionRate: number;        // STATIC: product-specific conversion rate
}>
```

#### Sample Values (First Product: BusinessLine Line of Credit)
```json
{
  "BusinessLine Line of Credit": {
    "eligible": 1089000,
    "conversionRate": 7.08
  },
  "Prime Line of Credit": {
    "eligible": 726000,
    "conversionRate": 8.4
  }
}
```

---

## 8. FICO to LUMIQ Conversion

**ALL** loaders use the same FICO-to-LUMIQ conversion formula:

```typescript
function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}
```

### Conversion Examples

| FICO | LUMIQ | Notes |
|------|-------|-------|
| 300  | 0     | Minimum FICO → Minimum LUMIQ |
| 565  | 48    | Very Poor (wellsfargo.json avg) |
| 625  | 59    | Poor (wellsfargo.json avg) |
| 675  | 68    | Fair (wellsfargo.json avg) |
| 685  | 70    | Construction segment avg |
| 690  | 71    | Transportation segment avg |
| 698  | 72    | **Portfolio avg** (wellsfargo.json) |
| 708  | 74    | Professional Services segment avg |
| 715  | 76    | Technology segment avg |
| 725  | 77    | Good (wellsfargo.json avg) |
| 785  | 88    | Excellent (wellsfargo.json avg) |
| 850  | 100   | Maximum FICO → Maximum LUMIQ |

**Note**: All LUMIQ scores are rounded to the nearest integer.

---

## Summary Statistics

### Wells Fargo Portfolio Totals
- **Total Customers**: 3,300,000
- **Total Exposure**: $670,000,000,000
- **Total Loans**: $360,000,000,000
- **Total Deposits**: $310,000,000,000
- **Avg FICO**: 698 (LUMIQ: 72)
- **Avg Exposure per Customer**: $203,030
- **At-Risk Rate**: 13.0%
- **Pre-Qualified Rate**: 65.0%

### Data Counts by Domain
- **Segments**: 8 industry segments
- **Campaigns**: 3 active campaigns
- **Underwriting Queue**: 15 applications
- **Sample Businesses**: 50 businesses
- **Risk Alerts**: 3 EWS clusters
- **States**: 42 states (WF footprint)
- **Products**: 9 products

### Geographic Distribution
- **Northeast**: 16.0% ($107.2B)
- **Southeast**: 23.0% ($154.1B)
- **Midwest**: 23.0% ($140.8B)
- **Southwest**: 22.0% ($147.4B)
- **West**: 16.0% ($120.5B)

---

## Usage Notes

1. **All number values are exact** — no rounding unless explicitly noted in CALC formulas
2. **STATIC values** are hardcoded in the loader files (not from JSON)
3. **DERIVED values** are calculated using business logic in the loaders
4. **FROM values** are direct mappings from the JSON
5. **CALC values** use arithmetic formulas described in the "Shape" sections
6. **MAPPED values** use lookup tables (e.g., `SEGMENT_ICONS`, `CAMPAIGN_OWNERS`)

---

**Last Updated**: 2026-02-12
**JSON Version**: 1.1
**Total Lines in Source JSON**: 1415 lines
