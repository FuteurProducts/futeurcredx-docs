# LumiqAI Enterprise Dashboard: Error and Recovery UX

This document maps how errors, failures, and recovery states are presented in the UI.

---

## 1. Error States

### 1.1 Error Display Locations

| Location | Component | Error Type | Visual Treatment |
|----------|-----------|------------|------------------|
| Page-level | BffErrorBoundary | 422 VALIDATION_ERROR | Yellow banner with Briefcase icon |
| Page-level | BffErrorBoundary | 403 FORBIDDEN | Red banner with Lock icon |
| Page-level | BffErrorBoundary | 401 UNAUTHORIZED | Red banner with Lock icon |
| Page-level | BffErrorBoundary | Generic Error | Red banner with AlertTriangle icon |
| Inline | CustomerBff | BFF unavailable | Red border container with AlertCircle |
| Inline | ReportHistoryPanel | Report failed | Red badge "Failed" with XCircle icon |
| Toast | WebhooksPanel | Validation error | Destructive variant toast |
| Toast | API operations | Operation failure | Toast with error message |
| Form | Input validation | Missing required fields | Toast notification |

### 1.2 Error Communication Patterns

| Error Type | Title Shown | Description Shown | Additional Info |
|------------|-------------|-------------------|-----------------|
| VALIDATION_ERROR | "Portfolio Required" | "Please select a portfolio to view this data." | None |
| FORBIDDEN | "Access Denied" | "You don't have permission to access this portfolio." | Request ID |
| UNAUTHORIZED | "Session Expired" | "Please log in again to continue." | None |
| NO_PORTFOLIO | (mutation error) | "No portfolio selected" | Request ID |
| Generic BFF | "Error" | Dynamic error message from response | Request ID |
| Webhook validation | "Error" | "Please enter a webhook URL" / "Please select at least one event" | None |
| Report failed | "Failed" badge | Displayed inline in table | Retry button |

### 1.3 Error State Visual Hierarchy

| Severity | Background | Border | Icon | Icon Color |
|----------|------------|--------|------|------------|
| Warning (422) | `bg-yellow-50` | `border-yellow-200` | Briefcase | `text-yellow-600` |
| Error (403/401/500) | `bg-red-50` | `border-red-200` | Lock / AlertTriangle | `text-red-600` |
| Info | `bg-muted` | `border-border` | AlertCircle | `text-muted-foreground` |
| Destructive toast | Toast destructive variant | N/A | N/A | N/A |

### 1.4 Error Components Used

| Component | Location | Purpose |
|-----------|----------|---------|
| `BffErrorBoundary` | Page wrapper | Catches React errors and BFF exceptions |
| `BffErrorDisplay` | Inline | Displays BFF errors with retry option |
| `toast()` | Anywhere | Transient error notifications |
| `AlertCircle` icon | Inline displays | Error indicator |
| `XCircle` icon | Status badges | Failure state indicator |

---

## 2. Empty States

### 2.1 No Data Scenarios

| Component | Condition | Message Displayed | Visual Treatment |
|-----------|-----------|-------------------|------------------|
| ReportHistoryPanel | `reports.length === 0` | "No reports generated yet" | Centered text, muted color |
| CustomerBff | No customers found | "No customers found in this portfolio" | Centered card with muted text |
| CustomerBff | No portfolio selected | "Select a portfolio to view customers" | AlertCircle icon + PortfolioSelector |
| EWSWorkQueue | No filtered alerts | "No alerts match your filters" | Bell icon (20% opacity) + centered text |
| CustomerEngagementPanel | No customer selected | "Select a customer to view engagement details" | Centered muted text in full-height card |
| ApplicationPipelineView | (implicit) | Uses parent empty state | Table renders empty tbody |
| CustomerListTable | (implicit) | Shows pagination as "1 to 0 of 0" | Empty table body |
| Data Lineage | No sources | (implied grid remains) | Empty grid |

### 2.2 Empty State Visual Patterns

| Pattern | Icon | Icon Style | Message Style |
|---------|------|------------|---------------|
| Primary empty | Context-relevant icon | Large (h-12), `opacity-20` or `mx-auto mb-3` | `text-muted-foreground`, centered |
| Selection empty | None | N/A | `text-sm text-muted-foreground text-center` |
| Table empty | None | N/A | Centered within container, `h-48` height |
| Card empty | None | N/A | `flex items-center justify-center h-full` |

### 2.3 Empty States with Call-to-Action

| Location | CTA Present | CTA Type |
|----------|-------------|----------|
| CustomerBff (no portfolio) | Yes | `PortfolioSelector` component rendered |
| ReportHistoryPanel | No | Text only |
| EWSWorkQueue | No | Text only |
| CustomerEngagementPanel | No | Text only |
| Webhooks (no endpoints) | Yes (implicit) | "Add Endpoint" button in header |

---

## 3. Recovery Paths

### 3.1 Retry Options

| Component | Retry Mechanism | Trigger | Behavior |
|-----------|-----------------|---------|----------|
| BffErrorBoundary | `onRetry` prop | "Try Again" button | Clears error state, calls retry callback |
| CustomerBff | `fetchCustomers()` | "Retry" button in error banner | Re-fetches data with current params |
| ReportHistoryPanel | `onRefresh` prop | Retry icon on failed reports | Re-triggers report generation |
| useBffQuery hook | `refetch()` function | Manual invocation | Clears error, re-executes query |
| useBffMutation hook | `reset()` + re-call | Manual | Clears state, allows re-mutation |

### 3.2 Refresh Actions

| Component | Refresh Control | Location | Behavior |
|-----------|-----------------|----------|----------|
| CustomerBff | Button with RefreshCw icon | Header, top-right | Re-fetches customer list |
| ReportHistoryPanel | RefreshCw icon button | Panel header | Calls `onRefresh()` prop |
| DataFreshnessCard | "Refresh All" button | Card header | Triggers batch data refresh |
| DataLineageFooter | Refresh button | Footer | Refetches data from BFF |
| IntegrationHealthCard | RefreshCw button | Card header | Calls `onRefresh()` prop |
| EWSWorkQueue | (implicit) | Via queue reload | State-based refresh |

### 3.3 User Guidance Provided

| Scenario | Guidance Text | Action Offered |
|----------|---------------|----------------|
| Portfolio required | "Please select a portfolio to view this data." | PortfolioSelector component |
| Access denied | "You don't have permission to access this portfolio." | None (user must contact admin) |
| Session expired | "Please log in again to continue." | Implied redirect to login |
| Webhook URL missing | "Please enter a webhook URL" | Focus on input |
| No events selected | "Please select at least one event" | Focus on event list |
| BFF unavailable | Console log only; silently uses demo data | Automatic fallback |

### 3.4 Automatic Recovery Mechanisms

| Mechanism | Component | Behavior |
|-----------|-----------|----------|
| Demo data fallback | CustomerBff | Falls back to `mockDemoCustomers` when BFF fails |
| Demo data fallback | ScoresBff | Falls back to local mock data when BFF fails |
| Session extend | SessionTimeoutWarning | "Extend Session" button refreshes token |
| Webhook retry | WebhooksPanel (delivery) | Exponential backoff: 1s, 2s, 4s, 8s, ... |
| Report polling | useReportPolling | Auto-polls until `ready` or `failed` status |
| Portfolio auto-refetch | useBffQuery | Refetches on portfolio change if enabled |

### 3.5 Mutation Reset Pattern

```typescript
// From useBffMutation hook
const reset = useCallback(() => {
  setData(null);
  setError(null);
  setIsLoading(false);
}, []);
```

| Reset Capability | Hook | Purpose |
|------------------|------|---------|
| Full state reset | useBffMutation | Clears data, error, loading for retry |
| Error clear on retry | useBffQuery | `setError(null)` before refetch |
| Query invalidation | (not implemented) | No explicit cache invalidation visible |

---

## 4. Loading States

### 4.1 Loading Indicators Used

| Component | Indicator | Icon/Element | Text |
|-----------|-----------|--------------|------|
| CustomerBff (portfolio) | Spinner + text | `Loader2` (animate-spin) | "Loading portfolio..." |
| CustomerBff (customers) | Spinner + text | `Loader2` (animate-spin) | "Loading customers..." |
| RefreshCw button | Spinning icon | `RefreshCw` (animate-spin) | Button label remains |
| ReportHistoryPanel | Processing badge | `Loader2` (animate-spin) | "Processing" |
| useBffQuery | `isLoading` state | (consumer renders) | Consumer-defined |
| useBffMutation | `isLoading` state | (consumer renders) | Consumer-defined |

### 4.2 Loading State Conditions

| State | Condition | Display |
|-------|-----------|---------|
| Portfolio loading | `portfolioLoading === true` | Full-page spinner |
| Data loading (first load) | `isLoading && customers.length === 0` | Card with spinner |
| Data loading (refresh) | `isLoading && customers.length > 0` | Spinning refresh icon only |
| Report processing | `status === 'processing'` | Animated spinner in badge |
| Webhook retrying | `status === 'retrying'` | `animate-spin` on RefreshCw icon |

---

## 5. Status Badge Catalog

### 5.1 Report Status Badges

| Status | Icon | Background | Text Color | Label |
|--------|------|------------|------------|-------|
| pending | Clock | `bg-amber-100` | `text-amber-700` | "Pending" |
| processing | Loader2 (spin) | `bg-blue-100` | `text-blue-700` | "Processing" |
| ready | CheckCircle2 | `bg-green-100` | `text-green-700` | "Ready" |
| failed | XCircle | `bg-red-100` | `text-red-700` | "Failed" |

### 5.2 Webhook Endpoint Status Badges

| Status | Badge Style | Label |
|--------|-------------|-------|
| active | `bg-chart-2/10 text-chart-2` | "Active" |
| paused | `bg-yellow-500/10 text-yellow-600` | "Paused" |
| failed | `variant="destructive"` | "Failed" |
| disabled | `variant="secondary"` | "Disabled" |

### 5.3 Webhook Delivery Status Icons

| Status | Icon | Color |
|--------|------|-------|
| delivered | CheckCircle | `text-chart-2` |
| failed | XCircle | `text-destructive` |
| retrying | RefreshCw (spin) | `text-yellow-500` |
| pending | Clock | `text-muted-foreground` |

### 5.4 EWS Severity Styles

| Severity | Background | Border | Badge | Icon Color |
|----------|------------|--------|-------|------------|
| critical | `bg-rose-50` | `border-l-rose-500` | `bg-rose-500 text-white` | `text-rose-600` |
| high | `bg-orange-50` | `border-l-orange-500` | `bg-orange-500 text-white` | `text-orange-600` |
| medium | `bg-amber-50` | `border-l-amber-500` | `bg-amber-500 text-white` | `text-amber-600` |
| low | `bg-blue-50` | `border-l-blue-500` | `bg-blue-500 text-white` | `text-blue-600` |

---

## 6. Degraded State Handling

### 6.1 Partial Data Scenarios

| Scenario | UI Behavior | User Communication |
|----------|-------------|-------------------|
| BFF timeout | Falls back to demo data | Console log only (silent) |
| Missing score | Display 0 or "N/A" | Risk class shows "unknown" |
| Missing RM assignment | Shows "Unassigned" | Gray text indicator |
| Missing timestamp | Shows "Never" | formatDate() fallback |
| Missing customer fields | Null-safe rendering | Empty strings or placeholders |

### 6.2 Stale Data Indicators

| Component | Stale Threshold | Visual Indicator |
|-----------|-----------------|------------------|
| DataLineageFooter | 1 hour | Yellow clock icon |
| DataLineageFooter | 24 hours | Red clock icon |
| DataFreshnessCard | 1-7 days | Amber "Stale" count |
| DataFreshnessCard | >7 days | Red "Critical" count |
| Data Sources | Connection error | Red status dot |

---

## 7. SLA Breach Visualization

| Indicator | Location | Style |
|-----------|----------|-------|
| SLA breached badge | EWSWorkQueue header | `bg-rose-500 text-white animate-pulse` |
| SLA timer (breached) | Queue item row | `bg-rose-100 text-rose-700` with "BREACHED" text |
| SLA timer (urgent) | Queue item row (<2h) | `bg-amber-100 text-amber-700` |
| SLA timer (normal) | Queue item row | `bg-muted text-foreground` |

---

## Summary: Failure Handling Coverage

### Areas with Strong Coverage

| Area | Coverage Level | Evidence |
|------|----------------|----------|
| **Portfolio context errors** | Comprehensive | BffErrorBoundary handles 422/403/401 with distinct UI |
| **Data loading states** | Good | Spinner + text indicators across major components |
| **Report status lifecycle** | Complete | All 4 states (pending/processing/ready/failed) with distinct badges |
| **Webhook delivery tracking** | Complete | All 4 states with icons and detailed failure info |
| **Empty state messaging** | Good | Most data tables/lists have empty state messages |
| **Refresh/retry controls** | Good | Present in most data-fetching components |
| **Demo mode fallback** | Implemented | Silent fallback to mock data when BFF unavailable |

### Areas with Gaps

| Area | Gap | Impact |
|------|-----|--------|
| **Network timeout handling** | No explicit timeout UI; relies on catch block | Users may not know if request is still pending |
| **Partial load failures** | No skeleton/placeholder while retrying | Jarring UX on intermittent failures |
| **Offline detection** | No offline indicator visible | Users unaware when disconnected |
| **Validation error details** | Toasts are generic; no field-level highlighting | Users must guess which field failed |
| **Error correlation ID** | Shown in BffErrorBoundary but not in toasts | Inconsistent support contact experience |
| **Rate limit warnings** | No visible rate limit feedback | Users may not understand throttling |
| **Bulk operation failures** | No partial success/failure reporting | All-or-nothing feedback |
| **Session timeout recovery** | Warning shown but no auto-save of work | Potential data loss |
| **Form unsaved changes** | No dirty state warning | Navigation may lose unsaved data |

### Recovery Path Completeness

| Path | Status | Notes |
|------|--------|-------|
| Retry current operation | ✓ Present | Via retry buttons and refetch functions |
| Refresh data manually | ✓ Present | RefreshCw buttons in headers |
| Auto-retry with backoff | ✓ Present | Webhooks use exponential backoff |
| Fallback to cached/demo | ✓ Present | CustomerBff, ScoresBff fall back to mocks |
| Session extension | ✓ Present | SessionTimeoutWarning modal |
| Portfolio re-selection | ✓ Present | PortfolioSelector on 422 errors |
| Navigate away | ✓ Present | Standard browser navigation |
| Contact support | ✗ Missing | No "Contact Support" link in error states |
| Error reporting | ✗ Missing | No "Report this issue" mechanism |
