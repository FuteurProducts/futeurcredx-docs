# LumiqAI Enterprise Dashboard: UI Component Inventory

This document inventories every UI component used in the enterprise dashboard, independent of pages.

---

## 1. Global Components

### 1.1 Header

| Component | File | Description |
|-----------|------|-------------|
| DashboardHeader | `src/components/dashboard/dashboard/DashboardHeader.tsx` | Sticky top header with search, environment toggle, notifications, and user menu |

**Props/Data Expected:**
- `showMenu?: boolean` - Controls horizontal navigation visibility

**Sub-components Used:**
- SidebarTrigger
- Search Input
- ConnectedEnvironmentToggle
- Bell notification button with badge
- DropdownMenu with Avatar

### 1.2 Sidebar

| Component | File | Description |
|-----------|------|-------------|
| DashboardSidebar | `src/components/dashboard/dashboard/DashboardSidebar.tsx` | Collapsible sidebar with navigation menu items |

**Props/Data Expected:**
- Uses `useSidebar()` hook for open/collapsed state

**Menu Items:**
- Overview
- Analytics
- Users
- Reports
- Performance
- Settings

### 1.3 Layout

| Component | File | Description |
|-----------|------|-------------|
| DashboardLayout | `src/components/dashboard/dashboard/DashboardLayout.tsx` | Main layout wrapper with sidebar and content area |

**Props/Data Expected:**
- `children: ReactNode`
- `hideSidebar?: boolean`

### 1.4 Navigation Components

| Component | File | Description |
|-----------|------|-------------|
| SettingsNavigation | `src/components/enterprise/settings/SettingsNavigation.tsx` | Two-column settings navigation |

### 1.5 Modals

| Component | File | Description |
|-----------|------|-------------|
| SessionTimeoutWarning | `src/components/shared/SessionTimeoutWarning.tsx` | AlertDialog for session expiration warning |
| MetricDrilldownModal | `src/components/enterprise/customer/MetricDrilldownModal.tsx` | Modal for RHS metric drill-down analysis |
| ReportPreviewDrawer | `src/components/enterprise/reports/ReportPreviewDrawer.tsx` | Drawer component for report preview |

**SessionTimeoutWarning Props:**
- `warningMinutes?: number` (default: 5)
- `timeoutMinutes?: number` (default: 30)

### 1.6 Notifications

| Component | File | Description |
|-----------|------|-------------|
| Toaster | `src/components/dashboard/ui/toaster.tsx` | Toast notification container |
| Sonner | `src/components/dashboard/ui/sonner.tsx` | Alternative toast system |

### 1.7 Global Controls

| Component | File | Description |
|-----------|------|-------------|
| SettingsGlobalControls | `src/components/enterprise/settings/SettingsGlobalControls.tsx` | Sticky bar with environment toggle, tenant info, SSO badge |
| AnalyticsGlobalControls | `src/components/enterprise/analytics/AnalyticsGlobalControls.tsx` | Analytics page global filters |
| RiskGlobalControls | `src/components/enterprise/risk/RiskGlobalControls.tsx` | Risk page global filters |
| CustomerGlobalControls | `src/components/enterprise/customer/CustomerGlobalControls.tsx` | Customer page filters (portfolio, segment, region) |
| ReportsGlobalControls | `src/components/enterprise/reports/ReportsGlobalControls.tsx` | Reports page global controls |

---

## 2. Data Display Components

### 2.1 Tables

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| CustomerListTable | Data table | `customers: CustomerEntity[]`, `selectedIds`, `sortField`, `sortDirection`, `searchQuery`, pagination props | Repeated |
| TopBusinessesTable | Ranked table | Business entities with scores | Single-use |
| ProductPenetrationTable | Matrix table | Product/segment penetration data | Single-use |
| ScoreMigrationMatrix | Transition matrix | Score band migration data | Single-use |

**CustomerListTable Features:**
- Checkbox selection
- Sortable headers
- Search input
- Filter toggle
- Export button
- Bulk actions toolbar
- Pagination controls

### 2.2 Charts

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| PortfolioHealthCard | Pie chart | `data: PortfolioHealthData` (segments, averageScore, lastUpdated) | Repeated |
| ScoreDistributionCard | Distribution chart | Score distribution by tier | Single-use |
| ScoreDistributionChart | Bar/histogram | Score distribution data | Repeated |
| PortfolioScoreTrendsCard | Line chart | Time-series score trends | Single-use |
| ApplicationFunnelChart | Funnel chart | Application stage counts | Single-use |
| CrossSellFunnel | Funnel chart | Cross-sell conversion stages | Single-use |
| RiskHeatmapMatrix | Heatmap grid | `heatmaps: HeatmapConfig[]` with rows, columns, cells | Repeated |
| FeatureImportanceChart | Horizontal bar | Feature importance scores | Single-use |
| SignalDriftMonitor | Multi-series chart | Signal drift over time | Single-use |
| ConversionChart | Area/line chart | Conversion metrics | Single-use |
| RevenueChart | Area chart | Revenue time-series | Single-use |

**RiskHeatmapMatrix Features:**
- Multiple heatmap tabs
- Hover tooltips with cell details
- Color gradient legend
- Click-to-drill-down

### 2.3 Cards

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| PortfolioKPITiles | KPI tile grid | `kpis: PortfolioKPI[]` | Repeated |
| MetricCard | Single KPI | `title`, `value`, `trend`, `icon` | Repeated |
| ConnectedBusinessesCard | Summary card | Connected business count, growth | Single-use |
| ApiUsageCard | Usage metrics | API call volume, rate limits | Single-use |
| DataFreshnessCard | Freshness indicator | Data staleness metrics | Single-use |
| DataSourceHealthCard | Health status | Source connectivity status | Single-use |
| IntegrationHealthCard | Integration status | Integration health metrics | Single-use |
| MultiBureauStatusCard | Bureau status | Bureau connectivity per source | Single-use |
| PortfolioAlertsCard | Alert list | Active portfolio alerts | Single-use |
| RiskSegmentationCard | Segment breakdown | Risk tier distribution | Single-use |
| WebhookEventsCard | Event list | Recent webhook deliveries | Single-use |
| UnderwritingMetricsCard | Underwriting KPIs | Application metrics | Single-use |
| PortfolioSegmentCard | Segment card | Segment-specific metrics | Repeated |

**PortfolioKPITiles Props:**
- `kpis: PortfolioKPI[]`
- `onDrilldown?: (kpiId: string) => void`

**KPI Format Types:**
- `percent`
- `currency`
- `score`
- `number`

### 2.4 Finlab Cards

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| FinlabCard | Base wrapper | `title`, `tooltip`, `onSeeMore`, `center`, `right`, `children` | Repeated |
| TotalBalanceCard | Balance display | `balance`, `percent` | Single-use |
| IncomeAnalysisCard | Bar chart card | `items: IncomeDataItem[]`, `expense`, `row` | Single-use |
| ExpenseAnalysisCard | Area chart card | `items: ExpenseDataItem[]`, `expense`, `row` | Single-use |
| RecentActivityCard | Activity list | `items: ActivityItem[]`, `viewItems` | Single-use |
| PocketPlansCard | Goal cards | `items: PlanItem[]`, `more`, `row` | Single-use |
| CurrencyCard | Exchange rates | `items: CurrencyItem[]`, `viewItems` | Single-use |
| ExpenseCategoryCard | Category breakdown | Expense by category | Single-use |
| AnalysisCard | Chart wrapper | `title`, `tooltip`, `price`, `percent`, `expense`, `row` | Repeated |

### 2.5 Widgets

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| CreditScoreWidget | Score gauge | `data: CreditScoreData`, `variant: 'full' | 'compact' | 'mini'` | Repeated |
| CreditJourneyWidget | Timeline | Credit journey stages | Single-use |
| SignalBreakdownCard | Signal list | Signal scores with status | Single-use |
| ApprovalPathWidget | Decision tree | Approval path visualization | Single-use |
| BureauDataDisplay | Bureau data | Multi-bureau score display | Single-use |
| WebhookConfigPanel | Config form | Webhook configuration | Single-use |
| SDKDownloadSection | Download links | SDK download options | Single-use |

**CreditScoreWidget Variants:**
- `full`: Gauge chart with all metrics
- `compact`: Condensed horizontal layout
- `mini`: Minimal badge-style display

### 2.6 Badges

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| Badge | Status badge | `variant`, `children` | Repeated |
| Risk tier badges | Inline | Low/Medium/High with colors | Repeated |
| Segment badges | Inline | Micro/Small/Mid-Market | Repeated |
| Stage badges | Pill | Prospect/New/Growing/Mature/At-Risk | Repeated |

### 2.7 Progress Indicators

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| Progress | Progress bar | `value`, `max` | Repeated |
| Signal score bars | Animated bar | Score 0-100 with status color | Repeated |

### 2.8 Data Lineage

| Component | Type | Props/Data Expected | Reusability |
|-----------|------|---------------------|-------------|
| DataLineageFooter | Footer strip | `meta: BffResponseMeta`, `onRefresh`, `isRefreshing` | Repeated |
| DataLineagePanel | Full panel | Data source lineage tree | Single-use |

---

## 3. Interactive Components

### 3.1 Filters

| Component | Type | Location |
|-----------|------|----------|
| Portfolio filter dropdown | Select | CustomerGlobalControls |
| Segment filter (multi-select) | Dropdown | CustomerGlobalControls |
| Region filter | Dropdown | CustomerGlobalControls |
| Risk tier filter | Dropdown | RiskGlobalControls |
| Date range picker | Calendar | Multiple pages |
| Search input | Text input | CustomerListTable, DashboardHeader |
| Mode selector | Tab group | AnalyticsGlobalControls |

### 3.2 Dropdowns

| Component | File | Description |
|-----------|------|-------------|
| PortfolioSelector | `src/components/shared/PortfolioSelector.tsx` | Portfolio switching dropdown |
| Select | `src/components/dashboard/ui/select.tsx` | Generic select component |
| DropdownMenu | `src/components/dashboard/ui/dropdown-menu.tsx` | Action menu dropdown |
| Command | `src/components/dashboard/ui/command.tsx` | Command palette/combobox |

**PortfolioSelector Variants:**
- `default`
- `compact`
- `minimal`

### 3.3 Toggles

| Component | File | Description |
|-----------|------|-------------|
| ConnectedEnvironmentToggle | `src/components/widgets/ConnectedEnvironmentToggle.tsx` | Sandbox/Production toggle |
| SandboxEnvironmentToggle | `src/components/widgets/SandboxEnvironmentToggle.tsx` | Alternative environment toggle |
| Switch | `src/components/dashboard/ui/switch.tsx` | Boolean toggle |
| Toggle | `src/components/dashboard/ui/toggle.tsx` | Pressable toggle |
| ToggleGroup | `src/components/dashboard/ui/toggle-group.tsx` | Multi-option toggle |

**ConnectedEnvironmentToggle Variants:**
- `default`
- `minimal`

### 3.4 Buttons

| Component | Type | Variants |
|-----------|------|----------|
| Button | Action button | `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` |
| SidebarTrigger | Icon button | Sidebar collapse toggle |
| Refresh button | Icon button | Data refresh |
| Export button | Icon button | CSV/PDF export |
| Filter toggle | Icon button | Show/hide filters |

### 3.5 Drill-down Elements

| Component | Description |
|-----------|-------------|
| CustomerListTable row click | Opens CustomerDossier |
| PortfolioKPITiles tile click | Triggers `onDrilldown` callback |
| RiskHeatmapMatrix cell click | Triggers `onCellClick` with cell data |
| See more buttons | FinlabCard "See more" links |
| ChevronRight indicators | Visual cue for drillable items |

### 3.6 Pagination

| Component | Location | Features |
|-----------|----------|----------|
| Table pagination | CustomerListTable | Previous/Next, page numbers, showing X of Y |

### 3.7 Sorting

| Component | Location | Features |
|-----------|----------|----------|
| SortHeader | CustomerListTable | Clickable column headers with direction indicators |

---

## 4. State-Based Components

### 4.1 Loading States

| Component | File | Description |
|-----------|------|-------------|
| Skeleton | `src/components/dashboard/ui/skeleton.tsx` | Content placeholder |
| Loader2 spinner | lucide-react | Spinning icon for inline loading |
| Loading text | PortfolioSelector | "Loading portfolios..." |
| Animate-spin | Tailwind | CSS spinner animation |
| Animate-pulse | Tailwind | CSS pulse animation |

**Usage Patterns:**
- PortfolioSelector shows Loader2 with "Loading portfolios..."
- DataLineageFooter refresh button shows spinning RefreshCw
- Charts show Skeleton placeholders

### 4.2 Empty States

| Component | Description | Location |
|-----------|-------------|----------|
| "No portfolios available" | Text with icon | PortfolioSelector |
| "No positive factors identified" | Italic text | AIDecisioningPanel |
| "No risk factors identified" | Italic text | AIDecisioningPanel |
| Empty table rows | Placeholder | CustomerListTable |

### 4.3 Error States

| Component | File | Description |
|-----------|------|-------------|
| BffErrorBoundary | `src/components/shared/BffErrorBoundary.tsx` | Error boundary wrapper |
| BffErrorDisplay | `src/components/shared/BffErrorBoundary.tsx` | Error display component |

**Error Types Handled:**
- `VALIDATION_ERROR` (422): "Portfolio Required" with Briefcase icon
- `FORBIDDEN` (403): "Access Denied" with Lock icon
- `UNAUTHORIZED` (401): "Session Expired" with Lock icon
- Generic errors: "Error" with AlertTriangle icon

**BffErrorDisplay Props:**
- `error: BffError | Error | null`
- `onRetry?: () => void`
- `className?: string`

### 4.4 Disabled States

| Component | Description |
|-----------|-------------|
| Pagination buttons | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Refresh button | Disabled during `isRefreshing` |
| Action buttons | Disabled when no selection |

---

## 5. Component Consistency Notes

### 5.1 Variations of Similar Components

**Environment Toggles:**
- `ConnectedEnvironmentToggle` - Uses EnvironmentContext, supports variants
- `SandboxEnvironmentToggle` - Standalone implementation

**Score Display Components:**
- `CreditScoreWidget` - Full gauge visualization with variants
- `ScoreDistributionCard` - Distribution chart
- `ScoreDistributionChart` - Analytics-specific distribution

**KPI/Metric Cards:**
- `PortfolioKPITiles` - Analytics-style KPI grid
- `MetricCard` - Dashboard MetricCard component
- `FinlabCard` - Finlab-style card with header actions
- `AnalysisCard` - Finlab card with price/percent display

**Table Components:**
- `CustomerListTable` - Full-featured with selection, sorting, pagination
- `TopBusinessesTable` - Simpler ranked list
- `ProductPenetrationTable` - Matrix format

**Heatmap/Matrix:**
- `RiskHeatmapMatrix` - Multi-tab heatmap with drill-down
- `ScoreMigrationMatrix` - Score band transition matrix

### 5.2 Inconsistent Labels or Behaviors

**Risk Tier Labeling:**
- Some components use: `low`, `medium`, `high`
- Others use: `Low Risk`, `Medium Risk`, `High Risk`
- Color mapping varies between components

**Date/Time Formatting:**
- Some use relative: "2h ago", "Just now"
- Others use absolute: "15/02/22 - 12.34"
- No standardized date formatting utility

**Score Ranges:**
- Credit scores: 300-850 (consumer standard)
- LumiqAI Score: 0-100
- RHS (Relationship Health Score): 0-100
- Signal scores: 0-100

**Button Styles:**
- Primary actions: Various implementations (bg-primary, bg-emerald-600, bg-[#1A1D1F])
- Some use Button component, others use native buttons

**Card Styling:**
- Enterprise components: `bg-card border border-border rounded-xl`
- Finlab components: `bg-white rounded-2xl`
- Dashboard components: Mix of both

**Animation Libraries:**
- All use `framer-motion` for entrance animations
- Consistent use of `motion.div` wrappers
- Stagger animations via `delay` prop

---

## Summary: Component Coverage and Gaps

### Component Coverage

**Fully Implemented:**
- Layout system (Header, Sidebar, Layout wrapper)
- Data tables with full interactivity
- Chart components for all major visualizations
- Form controls (inputs, selects, toggles, buttons)
- Modal/dialog system
- Error handling and loading states
- Portfolio selection and environment switching

**Well-Structured Domains:**
- Enterprise analytics (12 components)
- Enterprise risk (9 components)
- Enterprise customer (9 components)
- Enterprise settings (17 panel components)
- Enterprise reports (6 components)
- Enterprise underwriting (6 components)

### Component Gaps

**Missing Reusable Abstractions:**
- No unified DateFormatter utility component
- No standardized CurrencyFormatter component
- No shared TrendIndicator component (duplicated logic)
- No unified EmptyState component template

**Inconsistencies:**
- Multiple implementations of environment toggles
- Varying card styling patterns
- Non-standardized risk tier color mapping
- Multiple button styling approaches outside design system

**State Management:**
- No global toast/notification integration component
- Session timeout warning exists but not universally applied
- Audit event emission handled per-component rather than centrally

### Component Count Summary

| Category | Count |
|----------|-------|
| Global Components | 7 |
| Tables | 4 |
| Charts | 11 |
| Cards | 18 |
| Finlab Cards | 9 |
| Widgets | 7 |
| Interactive Controls | 15+ |
| State Components | 6 |
| Settings Panels | 17 |
| **Total Unique Components** | **94+** |
