# Chase Demo Data — Developer Guide

This directory contains comprehensive, research-backed demo data for JPMorgan Chase's small business banking portfolio, ready for integration into the Lumiq AI Dashboard.

## Files

### Data Files
- **`chase_dashboard_data.json`** — Complete dashboard data mapping (PRIMARY OUTPUT)
- **`chase_quantitative.json`** — Quantitative metrics from SEC filings and investor data
- **`chase_segments.json`** — Industry and geographic segmentation analysis

### Documentation
- **`SYNTHESIS_SUMMARY.md`** — Data synthesis methodology and quality notes
- **`README.md`** — This file (developer quick reference)

---

## Quick Start

### Import the Data
```typescript
import chaseData from '@/demo-data/chase/chase_dashboard_data.json';
```

### Access Key Sections
```typescript
// Bank configuration
const bankConfig = chaseData.bank_config;
// { name: "JPMorgan Chase & Co.", display_name: "Chase", ... }

// Portfolio KPIs
const kpis = chaseData.portfolio_summary.kpis;
// Array of 6 KPI objects with trends and formatted values

// Industry segments
const segments = chaseData.segments;
// Array of 8 segment objects with business counts, exposure, trends

// Underwriting queue
const queue = chaseData.underwriting_queue;
// Array of 15 application objects with signals and recommendations

// Filter options
const filters = chaseData.filter_options;
// { industries: [...], regions: [...], products: [...], ... }
```

---

## Data Structure Overview

### 1. Bank Config
```typescript
{
  name: string;
  display_name: string;
  logo_url: string;
  primary_color: string;      // "#117ACA"
  secondary_color: string;
  branch_count: number;        // 4,827
  states_served: number;       // 48
  total_assets_billions: number;
  market_position: string;
  tagline: string;
}
```

### 2. Portfolio Summary
```typescript
{
  total_businesses: number;              // 6,000,000
  total_businesses_formatted: string;    // "6.0M"
  total_exposure: number;                // 650,000,000,000
  total_exposure_formatted: string;      // "$650.0B"
  avg_credit_score: number;              // 71.4
  pre_qualified_rate: number;            // 67.0
  // ... more metrics

  kpis: Array<{
    id: string;
    label: string;
    value: string;           // Formatted
    raw_value: number;       // Numeric
    format: 'number' | 'currency' | 'percent' | 'score';
    trend: {
      direction: 'up' | 'down' | 'stable';
      value: number;
      label: string;
    };
    status: 'positive' | 'neutral' | 'warning' | 'critical';
  }>;
}
```

### 3. Segments (8 industry segments)
```typescript
Array<{
  id: string;                    // "professional_services"
  name: string;                  // "Professional Services"
  icon: string;                  // "Briefcase" (Lucide React icon name)
  business_count: number;        // 1,080,000
  total_exposure: number;        // 116,640,000,000
  avg_exposure: number;          // 108,000
  pre_qualified_rate: number;    // 68.0
  avg_credit_score: number;      // 73.5
  trend: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    label: string;
  };
  trend_value: number;           // For sorting
  color: string;                 // Tailwind color name
  risk_level: 'low' | 'medium' | 'high';
  default_rate: number;          // 1.8
  description: string;
  key_products: string[];        // Array of 3 Chase product names
}>
```

### 4. Risk Metrics
```typescript
{
  concentration: {
    industry: Array<{ name, business_count, exposure, percentage, limit, status }>;
    geographic: Array<{ region, business_count, exposure, percentage, limit, status }>;
    single_borrower: { limit, current, percentage, status };
  };

  ews_clusters: Array<{
    id: string;
    type: string;                  // "Revenue Decline >20%"
    severity: 'critical' | 'warning' | 'medium' | 'low';
    business_count: number;
    total_exposure: number;
    avg_exposure: number;
    top_industries: Array<{ name, count }>;
    recommended_action: string;
  }>;
}
```

### 5. Campaigns (3 active Q1 2026)
```typescript
Array<{
  id: string;
  product_name: string;          // REAL Chase product name
  target_segment: string;
  eligible_businesses: number;
  potential_revenue: number;
  conversion_estimate: number;   // Percentage
  status: 'active' | 'paused' | 'completed';
  start_date: string;            // ISO date
  end_date: string;
  owner: string;
  funnel: {
    pushed: number;
    viewed: number;
    applied: number;
    approved: number;
  };
  description: string;
}>
```

### 6. Underwriting Queue (15 applications)
```typescript
Array<{
  id: string;
  business_name: string;         // Realistic, geography-appropriate
  industry: string;
  state: string;                 // 2-letter code
  product_requested: string;     // REAL Chase product name
  amount_requested: number;      // $165K-$625K range
  credit_score: number;          // 64.3-85.2
  years_in_business: number;
  annual_revenue: number;
  employees: number;
  status: 'underwriting' | 'approved' | 'pending_documents';
  assigned_analyst: string;
  time_in_queue_hours: number;
  signals: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendation: 'approve' | 'conditional_approve' | 'review';
}>
```

### 7. Filter Options
```typescript
{
  industries: string[];          // 8 industries
  regions: string[];             // 5 regions
  states: string[];              // 30 state codes
  business_sizes: string[];      // 4 size categories
  products: string[];            // 12 REAL Chase products
  score_ranges: Array<{
    label: string;
    min: number;
    max: number;
  }>;
}
```

### 8. Sample Businesses (50 businesses)
```typescript
Array<{
  id: string;
  name: string;                  // Realistic, matches industry/state
  industry: string;
  state: string;
  credit_score: number;
  annual_revenue: number;
  years_in_business: number;
  employees: number;
  current_exposure: number;
  products_held: string[];       // 1-3 products
  eligible_products: string[];   // Cross-sell opportunities
}>
```

---

## Real Chase Products Used

All product names verified via web research (February 2026):

### Credit Cards
- Ink Business Preferred® Credit Card
- Ink Business Unlimited® Credit Card
- Ink Business Cash® Credit Card

### Banking
- Chase Business Complete Banking®

### Lending
- Business Line of Credit
- Business Term Loan
- SBA 7(a) Loan
- SBA 504 Loan
- Equipment Financing

### Services
- Chase Merchant Services®
- Business Fuel Cards
- Trade Finance Solutions

---

## Key Metrics (Portfolio-Level)

| Metric | Value | Notes |
|--------|-------|-------|
| Total Businesses | 6.0M | Rounded from 6.5M for cleaner display |
| Total Exposure | $650.0B | Business banking deposits |
| Avg Credit Score | 71.4 | Portfolio-weighted average |
| Pre-Qualified Rate | 67.0% | Above industry 60-70% range |
| At-Risk Exposure | $84.5B | 13.0% of portfolio |
| Offer Potential | $145.0B | Pre-qualified offer volume |

---

## Industry Segments (Ranked by Exposure)

| Rank | Segment | Business Count | Exposure | Trend |
|------|---------|----------------|----------|-------|
| 1 | Professional Services | 1.08M | $116.6B | +3.0% |
| 2 | Retail Trade | 960K | $104.0B | -2.0% |
| 3 | Food Service | 900K | $97.5B | +4.0% |
| 4 | Healthcare | 840K | $91.0B | +6.0% |
| 5 | Construction | 780K | $84.5B | +5.0% |
| 6 | Technology | 720K | $78.0B | +9.0% |
| 7 | Manufacturing | 480K | $52.0B | +4.0% |
| 8 | Transportation | 240K | $26.0B | +2.0% |

---

## Geographic Distribution (Top 5 Regions)

| Rank | Region | Business Count | Exposure | % of Portfolio |
|------|--------|----------------|----------|----------------|
| 1 | West | 1.80M | $195.0B | 30.0% |
| 2 | Northeast | 1.56M | $169.0B | 26.0% |
| 3 | Southeast | 1.20M | $130.0B | 20.0% |
| 4 | Midwest | 1.08M | $117.0B | 18.0% |
| 5 | Southwest | 360K | $39.0B | 6.0% |

---

## Data Quality Notes

### High Confidence
- Total businesses served (6M disclosed by Chase)
- Branch counts by state (FDIC data)
- Market position (#1 by assets and deposits)
- Real product names (verified via web research)

### Calculated with Strong Basis
- Segment distributions (weighted by branch density + SBA data)
- Credit score distribution (industry benchmarks)
- Pre-qualified rates (risk-adjusted by segment)
- Growth trends (market analysis + sector reports)

### Modeled Assumptions
- Average exposure per business ($108.3K derived from total/count)
- At-risk percentages (watch list + NPL + NCO rates)
- Offer potential (acceptance rate × eligible businesses × avg offer)

---

## Integration Examples

### Display KPI Cards
```typescript
import chaseData from '@/demo-data/chase/chase_dashboard_data.json';

const KPIDashboard = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {chaseData.portfolio_summary.kpis.map(kpi => (
        <KPICard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          trend={kpi.trend}
          status={kpi.status}
        />
      ))}
    </div>
  );
};
```

### Render Segment Cards
```typescript
const SegmentGrid = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {chaseData.segments.map(segment => (
        <SegmentCard
          key={segment.id}
          icon={segment.icon}
          name={segment.name}
          businessCount={segment.business_count}
          exposure={segment.total_exposure}
          trend={segment.trend}
          riskLevel={segment.risk_level}
        />
      ))}
    </div>
  );
};
```

### Populate Underwriting Queue
```typescript
const UnderwritingQueue = () => {
  return (
    <Table>
      <TableBody>
        {chaseData.underwriting_queue.map(app => (
          <TableRow key={app.id}>
            <TableCell>{app.business_name}</TableCell>
            <TableCell>{app.product_requested}</TableCell>
            <TableCell>{formatCurrency(app.amount_requested)}</TableCell>
            <TableCell>
              <CreditScoreBadge score={app.credit_score} />
            </TableCell>
            <TableCell>
              <RecommendationBadge rec={app.recommendation} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## Sources

All data synthesized from authoritative sources:
- JPMorgan Chase 10-K (2024)
- JPMorgan Chase Annual Report 2024
- JPMorgan Chase Investor Day Presentations (2024-2025)
- SBA Office of Advocacy 2024-2025 Small Business Profiles
- U.S. Treasury: Financing Small Business (January 2025)
- FDIC Branch Data
- Chase business products web research (February 2026)

See `SYNTHESIS_SUMMARY.md` for detailed methodology and source links.

---

## Questions?

For data methodology questions, see `SYNTHESIS_SUMMARY.md`.
For original research files, see `chase_quantitative.json` and `chase_segments.json`.
For dashboard integration support, contact the frontend team.

**Generated by**: CHASE-SYNTH-1 (Dashboard Data Mapper)
**Date**: 2026-02-11
