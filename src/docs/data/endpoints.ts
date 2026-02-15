// =============================================================================
// Lumiq Developer Docs — Master Endpoint Catalog
// =============================================================================

const API_BASE = 'https://api.sandbox.futeurcredx.com/api/v1';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EndpointParam {
  name: string;
  type: 'query' | 'path' | 'header' | 'body';
  required: boolean;
  dataType: string;
  default?: string;
  description: string;
}

export interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  tag: string;
  auth: ('api-key' | 'jwt' | 'none')[];
  params: EndpointParam[];
  responseExample: Record<string, unknown>;
  errorExamples?: { status: number; body: Record<string, unknown> }[];
  codeExamples: {
    curl: string;
    python: string;
    node: string;
    go: string;
  };
}

// ---------------------------------------------------------------------------
// Endpoint Data
// ---------------------------------------------------------------------------

export const endpoints: EndpointDoc[] = [
  // =========================================================================
  // HEALTH
  // =========================================================================
  {
    id: 'health-check',
    method: 'GET',
    path: '/api/v1/dashboard/health',
    title: 'Check API Status',
    description:
      'Returns the current health status of the API, including version and data source connectivity. Does not require a portfolioId.',
    tag: 'health',
    auth: ['api-key'],
    params: [],
    responseExample: {
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-02-15T22:27:27.323Z',
        version: '1.0.0',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    errorExamples: [
      {
        status: 401,
        body: {
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' },
          meta: { requestId: 'req_abc123' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/health" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/health",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
print(resp.json())`,
      node: `const resp = await fetch("${API_BASE}/dashboard/health", {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const data = await resp.json();
console.log(data);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/health", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // PORTFOLIOS
  // =========================================================================
  {
    id: 'list-portfolios',
    method: 'GET',
    path: '/api/v1/dashboard/portfolios',
    title: 'List Portfolios',
    description:
      'Returns all portfolios accessible to the authenticated tenant. Each portfolio represents a distinct book of business.',
    tag: 'portfolios',
    auth: ['api-key', 'jwt'],
    params: [],
    responseExample: {
      success: true,
      data: [
        {
          id: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
          name: 'Chase SMB National',
          code: 'CHASE-SMB-NAT',
          config: {},
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/portfolios" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/portfolios",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
portfolios = resp.json()["data"]
for p in portfolios:
    print(f"{p['name']} ({p['id']})")`,
      node: `const resp = await fetch("${API_BASE}/dashboard/portfolios", {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: portfolios } = await resp.json();
portfolios.forEach((p) => console.log(p.name, p.id));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/portfolios", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'portfolio-summary',
    method: 'GET',
    path: '/api/v1/dashboard/portfolios/:id/summary',
    title: 'Get Portfolio Summary',
    description:
      'Returns high-level KPIs for a specific portfolio, including total businesses, exposure, average credit score, pre-qualified rate, at-risk metrics, and year-over-year trends.',
    tag: 'portfolios',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio UUID',
      },
    ],
    responseExample: {
      success: true,
      data: {
        totalBusinesses: 6000000,
        totalExposure: 650000000000,
        avgCreditScore: 71.4,
        preQualifiedRate: 67.0,
        atRiskRate: 13.0,
        atRiskExposure: 84500000000,
        offerPotential: 145000000000,
        trend: {
          portfolioGrowthYoy: 4.5,
          nplRate: 0.65,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    errorExamples: [
      {
        status: 404,
        body: {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Portfolio not found' },
          meta: { requestId: 'req_xyz789' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/portfolios/33ae8a27-8718-4a96-8cd5-f472de6a77ee/summary" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

portfolio_id = "33ae8a27-8718-4a96-8cd5-f472de6a77ee"
resp = requests.get(
    f"${API_BASE}/dashboard/portfolios/{portfolio_id}/summary",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
summary = resp.json()["data"]
print(f"Total businesses: {summary['totalBusinesses']:,}")
print(f"Avg credit score: {summary['avgCreditScore']}")`,
      node: `const portfolioId = "33ae8a27-8718-4a96-8cd5-f472de6a77ee";
const resp = await fetch(
  \`${API_BASE}/dashboard/portfolios/\${portfolioId}/summary\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: summary } = await resp.json();
console.log("Total businesses:", summary.totalBusinesses.toLocaleString());`,
      go: `portfolioID := "33ae8a27-8718-4a96-8cd5-f472de6a77ee"
url := fmt.Sprintf("${API_BASE}/dashboard/portfolios/%s/summary", portfolioID)
req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // BUSINESSES (Customers)
  // =========================================================================
  {
    id: 'list-customers',
    method: 'GET',
    path: '/api/v1/dashboard/customers',
    title: 'List Businesses',
    description:
      'Returns a paginated list of businesses (customers) within the specified portfolio. Supports filtering by industry, risk tier, and free-text search.',
    tag: 'businesses',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number (1-indexed)',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
      {
        name: 'search',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Free-text search on business name',
      },
      {
        name: 'industry',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by industry (e.g., "Retail", "Healthcare")',
      },
      {
        name: 'riskTier',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by risk tier: low, medium, high, critical',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
          name: 'Apex Manufacturing LLC',
          industry: 'Manufacturing',
          annualRevenue: 12500000,
          employeeCount: 85,
          yearsInBusiness: 14,
          creditScore: 78,
          riskTier: 'low',
          state: 'OH',
          city: 'Columbus',
        },
        {
          id: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          name: 'Bright Path Consulting',
          industry: 'Professional Services',
          annualRevenue: 3200000,
          employeeCount: 22,
          yearsInBusiness: 7,
          creditScore: 65,
          riskTier: 'medium',
          state: 'TX',
          city: 'Austin',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 6000000,
        totalPages: 300000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    errorExamples: [
      {
        status: 400,
        body: {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'portfolioId is required',
            details: [{ field: 'portfolioId', issue: 'Required query parameter missing' }],
          },
          meta: { requestId: 'req_val456' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/customers?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&page=1&pageSize=20" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/customers",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "page": 1,
        "pageSize": 20,
        "industry": "Retail",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
result = resp.json()
for biz in result["data"]:
    print(f"{biz['name']} — Score: {biz['creditScore']}, Risk: {biz['riskTier']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  page: "1",
  pageSize: "20",
  industry: "Retail",
});
const resp = await fetch(\`${API_BASE}/dashboard/customers?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: businesses, meta } = await resp.json();
console.log(\`Page \${meta.page} of \${meta.totalPages}\`);
businesses.forEach((b) => console.log(b.name, b.creditScore));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/customers", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("page", "1")
q.Add("pageSize", "20")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'get-customer',
    method: 'GET',
    path: '/api/v1/dashboard/customers/:id',
    title: 'Get Business Details',
    description:
      'Returns complete details for a single business including credit history, current products held, and eligible product recommendations.',
    tag: 'businesses',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Business entity ID',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
        name: 'Apex Manufacturing LLC',
        industry: 'Manufacturing',
        naicsCode: '332710',
        annualRevenue: 12500000,
        employeeCount: 85,
        yearsInBusiness: 14,
        creditScore: 78,
        riskTier: 'low',
        state: 'OH',
        city: 'Columbus',
        zipCode: '43215',
        creditHistory: [
          { date: '2026-01-15', score: 78, delta: 2 },
          { date: '2025-12-15', score: 76, delta: -1 },
          { date: '2025-11-15', score: 77, delta: 3 },
        ],
        productsHeld: [
          { id: 'prod_loc_001', name: 'Business Line of Credit', balance: 250000, limit: 500000 },
        ],
        eligibleProducts: [
          { id: 'prod_term_002', name: 'Term Loan', maxAmount: 750000, rate: '7.25%' },
          { id: 'prod_cc_003', name: 'Business Credit Card', maxAmount: 50000, rate: '18.99%' },
        ],
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    errorExamples: [
      {
        status: 404,
        body: {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Business not found' },
          meta: { requestId: 'req_nf789' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/customers/biz_01HQ3V7K8M2N4P5R6S7T8U9V0W" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

biz_id = "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W"
resp = requests.get(
    f"${API_BASE}/dashboard/customers/{biz_id}",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
biz = resp.json()["data"]
print(f"{biz['name']} — Score: {biz['creditScore']}")
print(f"Products held: {len(biz['productsHeld'])}")
print(f"Eligible for: {len(biz['eligibleProducts'])} new products")`,
      node: `const bizId = "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W";
const resp = await fetch(\`${API_BASE}/dashboard/customers/\${bizId}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: biz } = await resp.json();
console.log(biz.name, "Score:", biz.creditScore);
console.log("Eligible products:", biz.eligibleProducts.length);`,
      go: `bizID := "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W"
url := fmt.Sprintf("${API_BASE}/dashboard/customers/%s", bizID)
req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // CREDIT SCORES
  // =========================================================================
  {
    id: 'list-scores',
    method: 'GET',
    path: '/api/v1/dashboard/scores',
    title: 'List Credit Scores',
    description:
      'Returns a paginated list of credit scores for all businesses in the specified portfolio. Each entry includes the business ID, current score, and risk tier.',
    tag: 'scores',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          businessId: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
          businessName: 'Apex Manufacturing LLC',
          score: 78,
          riskTier: 'low',
          lastUpdated: '2026-02-14T10:00:00.000Z',
        },
        {
          businessId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          businessName: 'Bright Path Consulting',
          score: 65,
          riskTier: 'medium',
          lastUpdated: '2026-02-14T10:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 6000000,
        totalPages: 300000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/scores?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&page=1&pageSize=20" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/scores",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "page": 1,
        "pageSize": 20,
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
scores = resp.json()["data"]
for s in scores:
    print(f"{s['businessName']}: {s['score']} ({s['riskTier']})")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  page: "1",
  pageSize: "20",
});
const resp = await fetch(\`${API_BASE}/dashboard/scores?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: scores } = await resp.json();
scores.forEach((s) => console.log(s.businessName, s.score));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/scores", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("page", "1")
q.Add("pageSize", "20")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'score-distribution',
    method: 'GET',
    path: '/api/v1/dashboard/scores/distribution',
    title: 'Get Score Distribution',
    description:
      'Returns a histogram of credit score distribution across the portfolio, including statistical metrics (mean, median) and percentage breakdowns by range.',
    tag: 'scores',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
    ],
    responseExample: {
      success: true,
      data: {
        ranges: [
          { min: 0, max: 20, count: 180000, percentage: 3.0 },
          { min: 20, max: 40, count: 540000, percentage: 9.0 },
          { min: 40, max: 60, count: 1200000, percentage: 20.0 },
          { min: 60, max: 80, count: 2700000, percentage: 45.0 },
          { min: 80, max: 100, count: 1380000, percentage: 23.0 },
        ],
        mean: 71.4,
        median: 73,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/scores/distribution?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/scores/distribution",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
dist = resp.json()["data"]
print(f"Mean: {dist['mean']}, Median: {dist['median']}")
for r in dist["ranges"]:
    print(f"  {r['min']}-{r['max']}: {r['count']:,} ({r['percentage']}%)")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/scores/distribution?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: dist } = await resp.json();
console.log("Mean:", dist.mean, "Median:", dist.median);
dist.ranges.forEach((r) =>
  console.log(\`  \${r.min}-\${r.max}: \${r.count.toLocaleString()} (\${r.percentage}%)\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/scores/distribution?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // RISK
  // =========================================================================
  {
    id: 'risk-summary',
    method: 'GET',
    path: '/api/v1/dashboard/risk/summary',
    title: 'Get Risk Summary',
    description:
      'Returns an overview of portfolio risk including delinquency rates, default rates, watchlist counts, and total active alerts.',
    tag: 'risk',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
    ],
    responseExample: {
      success: true,
      data: {
        delinquencyRate: 4.2,
        defaultRate: 1.1,
        watchlistCount: 14500,
        totalAlerts: 3200,
        nplRatio: 0.65,
        concentrationRisk: {
          topIndustry: 'Retail',
          topIndustryPct: 22.4,
          topState: 'CA',
          topStatePct: 15.8,
        },
        trends: {
          delinquencyDelta30d: -0.3,
          defaultDelta30d: 0.1,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/risk/summary?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/risk/summary",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
risk = resp.json()["data"]
print(f"Delinquency rate: {risk['delinquencyRate']}%")
print(f"Watchlist: {risk['watchlistCount']:,} businesses")
print(f"Active alerts: {risk['totalAlerts']:,}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/risk/summary?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: risk } = await resp.json();
console.log("Delinquency:", risk.delinquencyRate + "%");
console.log("Watchlist:", risk.watchlistCount.toLocaleString());`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/risk/summary?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'risk-events',
    method: 'GET',
    path: '/api/v1/dashboard/risk/events',
    title: 'List Risk Events',
    description:
      'Returns a paginated list of risk events and alerts for the portfolio. Events include score drops, delinquency triggers, and watchlist additions.',
    tag: 'risk',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
      {
        name: 'severity',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by severity: info, warning, critical',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'evt_01RISK001',
          type: 'SCORE_DROP',
          severity: 'warning',
          businessId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          businessName: 'Bright Path Consulting',
          description: 'Credit score dropped 12 points in 30 days',
          previousValue: 77,
          currentValue: 65,
          createdAt: '2026-02-14T08:30:00.000Z',
        },
        {
          id: 'evt_02RISK002',
          type: 'DELINQUENCY',
          severity: 'critical',
          businessId: 'biz_03KS5X9M0O4P6R7T8U1V2W3Y4Z',
          businessName: 'Metro Auto Parts Inc',
          description: 'Payment 60+ days past due on Line of Credit',
          previousValue: null,
          currentValue: 62,
          createdAt: '2026-02-13T14:15:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 3200,
        totalPages: 160,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/risk/events?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&severity=critical&page=1" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/risk/events",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "severity": "critical",
        "page": 1,
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
events = resp.json()["data"]
for evt in events:
    print(f"[{evt['severity'].upper()}] {evt['businessName']}: {evt['description']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  severity: "critical",
  page: "1",
});
const resp = await fetch(\`${API_BASE}/dashboard/risk/events?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: events } = await resp.json();
events.forEach((e) =>
  console.log(\`[\${e.severity.toUpperCase()}] \${e.businessName}: \${e.description}\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/risk/events", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("severity", "critical")
q.Add("page", "1")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // UNDERWRITING
  // =========================================================================
  {
    id: 'list-applications',
    method: 'GET',
    path: '/api/v1/dashboard/applications',
    title: 'List Underwriting Applications',
    description:
      'Returns a paginated list of underwriting applications within the portfolio. Supports filtering by application status.',
    tag: 'underwriting',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
      {
        name: 'status',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by status: pending, approved, declined, in_review',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'app_01UW001',
          businessId: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
          businessName: 'Apex Manufacturing LLC',
          productType: 'Term Loan',
          requestedAmount: 500000,
          status: 'approved',
          creditScore: 78,
          submittedAt: '2026-02-10T09:00:00.000Z',
          decidedAt: '2026-02-12T16:30:00.000Z',
        },
        {
          id: 'app_02UW002',
          businessId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          businessName: 'Bright Path Consulting',
          productType: 'Business Line of Credit',
          requestedAmount: 150000,
          status: 'in_review',
          creditScore: 65,
          submittedAt: '2026-02-13T11:00:00.000Z',
          decidedAt: null,
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 12450,
        totalPages: 623,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/applications?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&status=pending" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/applications",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "status": "pending",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
apps = resp.json()["data"]
for app in apps:
    print(f"{app['businessName']}: {app['productType']} \${app['requestedAmount']:,} [{app['status']}]")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  status: "pending",
});
const resp = await fetch(\`${API_BASE}/dashboard/applications?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: apps } = await resp.json();
apps.forEach((a) =>
  console.log(\`\${a.businessName}: \${a.productType} $\${a.requestedAmount.toLocaleString()}\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/applications", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("status", "pending")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'list-offers',
    method: 'GET',
    path: '/api/v1/dashboard/offers',
    title: 'List Active Offers',
    description:
      'Returns a paginated list of active product offers within the portfolio, including pre-qualified and targeted offers.',
    tag: 'underwriting',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'offer_01OFF001',
          businessId: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
          businessName: 'Apex Manufacturing LLC',
          productType: 'Term Loan',
          offeredAmount: 750000,
          interestRate: 7.25,
          term: '60 months',
          status: 'active',
          expiresAt: '2026-03-15T00:00:00.000Z',
          createdAt: '2026-02-01T12:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 45000,
        totalPages: 2250,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/offers?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/offers",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
offers = resp.json()["data"]
for o in offers:
    print(f"{o['businessName']}: {o['productType']} \${o['offeredAmount']:,} @ {o['interestRate']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/offers?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: offers } = await resp.json();
offers.forEach((o) =>
  console.log(\`\${o.businessName}: \${o.productType} $\${o.offeredAmount.toLocaleString()}\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/offers?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // ANALYTICS
  // =========================================================================
  {
    id: 'analytics-funnel',
    method: 'GET',
    path: '/api/v1/dashboard/analytics/funnel',
    title: 'Get Conversion Funnel',
    description:
      'Returns conversion funnel data showing how businesses progress through the pipeline: total portfolio, pre-qualified, applied, approved, and funded stages.',
    tag: 'analytics',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
    ],
    responseExample: {
      success: true,
      data: {
        stages: [
          { name: 'Total Portfolio', count: 6000000, rate: 100.0 },
          { name: 'Pre-Qualified', count: 4020000, rate: 67.0 },
          { name: 'Applied', count: 1206000, rate: 30.0 },
          { name: 'Approved', count: 843000, rate: 69.9 },
          { name: 'Funded', count: 612000, rate: 72.6 },
        ],
        overallConversion: 10.2,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/analytics/funnel?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/analytics/funnel",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
funnel = resp.json()["data"]
for stage in funnel["stages"]:
    print(f"{stage['name']}: {stage['count']:,} ({stage['rate']}%)")
print(f"Overall conversion: {funnel['overallConversion']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/analytics/funnel?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: funnel } = await resp.json();
funnel.stages.forEach((s) =>
  console.log(\`\${s.name}: \${s.count.toLocaleString()} (\${s.rate}%)\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/analytics/funnel?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'kpis',
    method: 'GET',
    path: '/api/v1/dashboard/kpis',
    title: 'Get Key Performance Indicators',
    description:
      'Returns the core KPIs for the portfolio including business counts, revenue metrics, lending performance, and risk indicators.',
    tag: 'analytics',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
    ],
    responseExample: {
      success: true,
      data: {
        totalBusinesses: 6000000,
        activeAccounts: 4800000,
        totalExposure: 650000000000,
        avgLoanSize: 135416,
        approvalRate: 69.9,
        avgTimeToDecision: 2.4,
        nplRatio: 0.65,
        portfolioYield: 6.8,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/kpis",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
kpis = resp.json()["data"]
print(f"Total businesses: {kpis['totalBusinesses']:,}")
print(f"Approval rate: {kpis['approvalRate']}%")
print(f"NPL ratio: {kpis['nplRatio']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: kpis } = await resp.json();
console.log("Total businesses:", kpis.totalBusinesses.toLocaleString());
console.log("Approval rate:", kpis.approvalRate + "%");`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'conversion-trend',
    method: 'GET',
    path: '/api/v1/dashboard/conversion-trend',
    title: 'Get Conversion Trend',
    description:
      'Returns conversion rate trends over time. Useful for tracking how application-to-funding ratios change across periods.',
    tag: 'analytics',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'period',
        type: 'query',
        required: false,
        dataType: 'string',
        default: '12m',
        description: 'Time period: 3m, 6m, 12m, 24m',
      },
    ],
    responseExample: {
      success: true,
      data: {
        period: '12m',
        dataPoints: [
          { month: '2025-03', applications: 12400, approvals: 8680, conversionRate: 70.0 },
          { month: '2025-06', applications: 13100, approvals: 9170, conversionRate: 70.0 },
          { month: '2025-09', applications: 13800, approvals: 9660, conversionRate: 70.0 },
          { month: '2025-12', applications: 14200, approvals: 9940, conversionRate: 70.0 },
          { month: '2026-01', applications: 14500, approvals: 10150, conversionRate: 70.0 },
          { month: '2026-02', applications: 14800, approvals: 10360, conversionRate: 70.0 },
        ],
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/conversion-trend?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&period=12m" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/conversion-trend",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "period": "12m",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
trend = resp.json()["data"]
for dp in trend["dataPoints"]:
    print(f"{dp['month']}: {dp['applications']:,} apps -> {dp['approvals']:,} approved ({dp['conversionRate']}%)")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/conversion-trend?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&period=12m\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: trend } = await resp.json();
trend.dataPoints.forEach((dp) =>
  console.log(\`\${dp.month}: \${dp.applications} -> \${dp.approvals} (\${dp.conversionRate}%)\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/conversion-trend?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&period=12m", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // API KEYS
  // =========================================================================
  {
    id: 'list-api-keys',
    method: 'GET',
    path: '/api/v1/api-keys',
    title: 'List API Keys',
    description:
      'Returns all API keys for the authenticated tenant. Key values are masked after creation — only the prefix is visible.',
    tag: 'api-keys',
    auth: ['api-key'],
    params: [],
    responseExample: {
      apiKeys: [
        {
          id: 'key_01AK001',
          name: 'Production Key',
          prefix: 'sk_test_ceO5',
          environment: 'development',
          createdAt: '2026-01-15T10:00:00.000Z',
          lastUsedAt: '2026-02-15T20:00:00.000Z',
          status: 'active',
        },
      ],
      total: 1,
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/api-keys" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/api-keys",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
result = resp.json()
print(f"Total keys: {result['total']}")
for key in result["apiKeys"]:
    print(f"  {key['name']} ({key['prefix']}...) - {key['status']}")`,
      node: `const resp = await fetch("${API_BASE}/api-keys", {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { apiKeys, total } = await resp.json();
console.log("Total keys:", total);
apiKeys.forEach((k) => console.log(\`  \${k.name} (\${k.prefix}...) - \${k.status}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/api-keys", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'create-api-key',
    method: 'POST',
    path: '/api/v1/api-keys',
    title: 'Create API Key',
    description:
      'Creates a new API key for the tenant. The full key value is only returned once in the response — store it securely. Subsequent retrievals will only show the prefix.',
    tag: 'api-keys',
    auth: ['api-key'],
    params: [
      {
        name: 'name',
        type: 'body',
        required: false,
        dataType: 'string',
        description: 'Human-readable name for the key',
      },
      {
        name: 'environment',
        type: 'body',
        required: false,
        dataType: 'string',
        default: 'development',
        description: 'Target environment: "development" or "production"',
      },
    ],
    responseExample: {
      id: 'key_02AK002',
      name: 'My New Key',
      key: 'sk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      prefix: 'sk_test_a1b2',
      environment: 'development',
      createdAt: '2026-02-15T22:30:00.000Z',
      status: 'active',
    },
    errorExamples: [
      {
        status: 429,
        body: {
          success: false,
          data: null,
          error: {
            code: 'RATE_LIMITED',
            message: 'Maximum number of API keys (10) reached for this tenant',
          },
          meta: { requestId: 'req_rl001' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/api-keys" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My New Key", "environment": "development"}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/api-keys",
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={"name": "My New Key", "environment": "development"}
)
new_key = resp.json()
# IMPORTANT: Save this key — it won't be shown again
print(f"Key created: {new_key['key']}")`,
      node: `const resp = await fetch("${API_BASE}/api-keys", {
  method: "POST",
  headers: {
    "X-API-Key": "sk_test_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "My New Key", environment: "development" }),
});
const newKey = await resp.json();
// IMPORTANT: Save this key — it won't be shown again
console.log("Key created:", newKey.key);`,
      go: `payload := strings.NewReader(\`{"name":"My New Key","environment":"development"}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/api-keys", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'delete-api-key',
    method: 'DELETE',
    path: '/api/v1/api-keys/:id',
    title: 'Revoke API Key',
    description:
      'Permanently revokes an API key. This action is irreversible. Any requests using the revoked key will receive a 401 response.',
    tag: 'api-keys',
    auth: ['api-key'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'API key ID to revoke',
      },
    ],
    responseExample: {
      success: true,
      message: 'API key revoked successfully',
    },
    errorExamples: [
      {
        status: 404,
        body: {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'API key not found' },
          meta: { requestId: 'req_nf002' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X DELETE "${API_BASE}/api-keys/key_02AK002" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

key_id = "key_02AK002"
resp = requests.delete(
    f"${API_BASE}/api-keys/{key_id}",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
print(resp.json())  # {"success": true, "message": "API key revoked successfully"}`,
      node: `const keyId = "key_02AK002";
const resp = await fetch(\`${API_BASE}/api-keys/\${keyId}\`, {
  method: "DELETE",
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const result = await resp.json();
console.log(result.message);`,
      go: `keyID := "key_02AK002"
url := fmt.Sprintf("${API_BASE}/api-keys/%s", keyID)
req, _ := http.NewRequest("DELETE", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // REPORTS
  // =========================================================================
  {
    id: 'list-reports',
    method: 'GET',
    path: '/api/v1/dashboard/reports',
    title: 'List Reports',
    description:
      'Returns a paginated list of previously generated reports for the portfolio.',
    tag: 'reports',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'rpt_01RPT001',
          portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
          type: 'risk',
          format: 'pdf',
          status: 'completed',
          generatedAt: '2026-02-14T16:00:00.000Z',
          downloadUrl: '/api/v1/dashboard/reports/rpt_01RPT001/download',
          fileSize: 2456789,
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 45,
        totalPages: 3,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/reports",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
reports = resp.json()["data"]
for r in reports:
    print(f"{r['type']} report ({r['format']}) — {r['status']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: reports } = await resp.json();
reports.forEach((r) => console.log(\`\${r.type} (\${r.format}) - \${r.status}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'create-report',
    method: 'POST',
    path: '/api/v1/dashboard/reports',
    title: 'Generate Report',
    description:
      'Initiates asynchronous generation of a new report. Returns immediately with a report ID. Poll the report status via GET /reports or use webhooks for completion notification.',
    tag: 'reports',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'body',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to generate report for',
      },
      {
        name: 'type',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Report type: "risk", "compliance", or "performance"',
      },
      {
        name: 'format',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Output format: "pdf" or "csv"',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'rpt_02RPT002',
        portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
        type: 'risk',
        format: 'pdf',
        status: 'processing',
        estimatedCompletionAt: '2026-02-15T22:35:00.000Z',
        createdAt: '2026-02-15T22:30:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:30:00.000Z',
      },
    },
    errorExamples: [
      {
        status: 422,
        body: {
          success: false,
          data: null,
          error: {
            code: 'UNPROCESSABLE_ENTITY',
            message: 'Invalid report configuration',
            details: [{ field: 'type', issue: 'Must be one of: risk, compliance, performance' }],
          },
          meta: { requestId: 'req_up001' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/reports" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee", "type": "risk", "format": "pdf"}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/reports",
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "type": "risk",
        "format": "pdf",
    }
)
report = resp.json()["data"]
print(f"Report {report['id']} is {report['status']}")`,
      node: `const resp = await fetch("${API_BASE}/dashboard/reports", {
  method: "POST",
  headers: {
    "X-API-Key": "sk_test_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
    type: "risk",
    format: "pdf",
  }),
});
const { data: report } = await resp.json();
console.log(\`Report \${report.id} is \${report.status}\`);`,
      go: `payload := strings.NewReader(\`{
  "portfolioId":"33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  "type":"risk",
  "format":"pdf"
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/reports", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // AUDIT
  // =========================================================================
  {
    id: 'list-audit-events',
    method: 'GET',
    path: '/api/v1/dashboard/audit-events',
    title: 'List Audit Events',
    description:
      'Returns a paginated list of audit trail events for the portfolio. Supports filtering by action type and date range for compliance reporting.',
    tag: 'audit',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to query',
      },
      {
        name: 'page',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '1',
        description: 'Page number',
      },
      {
        name: 'pageSize',
        type: 'query',
        required: false,
        dataType: 'number',
        default: '20',
        description: 'Items per page (max 100)',
      },
      {
        name: 'action',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by action: SCORE_VIEWED, DOSSIER_OPENED, REPORT_DOWNLOADED, EXPORT_INITIATED',
      },
      {
        name: 'startDate',
        type: 'query',
        required: false,
        dataType: 'string (ISO 8601)',
        description: 'Filter events after this date',
      },
      {
        name: 'endDate',
        type: 'query',
        required: false,
        dataType: 'string (ISO 8601)',
        description: 'Filter events before this date',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'aud_01AUD001',
          action: 'SCORE_VIEWED',
          userId: 'user_01USR001',
          userName: 'John Smith',
          portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
          resourceType: 'business',
          resourceId: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
          metadata: { businessName: 'Apex Manufacturing LLC', score: 78 },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0',
          createdAt: '2026-02-15T21:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 15680,
        totalPages: 784,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/audit-events?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&action=SCORE_VIEWED&startDate=2026-02-01" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/audit-events",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "action": "SCORE_VIEWED",
        "startDate": "2026-02-01",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
events = resp.json()["data"]
for evt in events:
    print(f"[{evt['createdAt']}] {evt['userName']}: {evt['action']} on {evt['metadata'].get('businessName', 'N/A')}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  action: "SCORE_VIEWED",
  startDate: "2026-02-01",
});
const resp = await fetch(\`${API_BASE}/dashboard/audit-events?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: events } = await resp.json();
events.forEach((e) =>
  console.log(\`[\${e.createdAt}] \${e.userName}: \${e.action}\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/audit-events", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("action", "SCORE_VIEWED")
q.Add("startDate", "2026-02-01")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // WEBHOOKS
  // =========================================================================
  {
    id: 'list-webhooks',
    method: 'GET',
    path: '/api/v1/dashboard/webhooks',
    title: 'List Webhook Subscriptions',
    description:
      'Returns all webhook subscriptions configured for the tenant. Each subscription defines a URL and the events it listens for.',
    tag: 'webhooks',
    auth: ['api-key', 'jwt'],
    params: [],
    responseExample: {
      success: true,
      data: [
        {
          id: 'wh_01WH001',
          url: 'https://example.com/webhooks/lumiq',
          events: ['score.updated', 'application.approved', 'risk.alert'],
          secret: 'whsec_****',
          status: 'active',
          createdAt: '2026-01-20T10:00:00.000Z',
          lastDeliveryAt: '2026-02-15T20:00:00.000Z',
          lastDeliveryStatus: 200,
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/webhooks" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/webhooks",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
webhooks = resp.json()["data"]
for wh in webhooks:
    print(f"{wh['url']} — Events: {', '.join(wh['events'])} [{wh['status']}]")`,
      node: `const resp = await fetch("${API_BASE}/dashboard/webhooks", {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: webhooks } = await resp.json();
webhooks.forEach((wh) =>
  console.log(\`\${wh.url} — Events: \${wh.events.join(", ")} [\${wh.status}]\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/webhooks", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'create-webhook',
    method: 'POST',
    path: '/api/v1/dashboard/webhooks',
    title: 'Create Webhook Subscription',
    description:
      'Creates a new webhook subscription. The API will send POST requests to the specified URL when subscribed events occur. Optionally provide a secret for HMAC signature verification.',
    tag: 'webhooks',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'url',
        type: 'body',
        required: true,
        dataType: 'string (URL)',
        description: 'HTTPS endpoint to receive webhook payloads',
      },
      {
        name: 'events',
        type: 'body',
        required: true,
        dataType: 'string[]',
        description:
          'Array of event types: score.updated, application.submitted, application.approved, application.declined, risk.alert, report.completed',
      },
      {
        name: 'secret',
        type: 'body',
        required: false,
        dataType: 'string',
        description: 'Shared secret for HMAC-SHA256 payload signing. Auto-generated if omitted.',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'wh_02WH002',
        url: 'https://example.com/webhooks/lumiq',
        events: ['score.updated', 'risk.alert'],
        secret: 'whsec_abc123def456ghi789',
        status: 'active',
        createdAt: '2026-02-15T22:30:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:30:00.000Z',
      },
    },
    errorExamples: [
      {
        status: 422,
        body: {
          success: false,
          data: null,
          error: {
            code: 'UNPROCESSABLE_ENTITY',
            message: 'Invalid webhook configuration',
            details: [
              { field: 'url', issue: 'Must be a valid HTTPS URL' },
              { field: 'events', issue: 'At least one event type is required' },
            ],
          },
          meta: { requestId: 'req_wh001' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/webhooks" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/webhooks/lumiq", "events": ["score.updated", "risk.alert"]}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/webhooks",
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com/webhooks/lumiq",
        "events": ["score.updated", "risk.alert"],
    }
)
webhook = resp.json()["data"]
# Save the secret for verifying webhook signatures
print(f"Webhook created: {webhook['id']}")
print(f"Secret: {webhook['secret']}")`,
      node: `const resp = await fetch("${API_BASE}/dashboard/webhooks", {
  method: "POST",
  headers: {
    "X-API-Key": "sk_test_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com/webhooks/lumiq",
    events: ["score.updated", "risk.alert"],
  }),
});
const { data: webhook } = await resp.json();
console.log("Webhook created:", webhook.id);
console.log("Secret:", webhook.secret);`,
      go: `payload := strings.NewReader(\`{
  "url":"https://example.com/webhooks/lumiq",
  "events":["score.updated","risk.alert"]
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/webhooks", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
];

// ---------------------------------------------------------------------------
// Derived exports
// ---------------------------------------------------------------------------

export const endpointsByTag = endpoints.reduce<Record<string, EndpointDoc[]>>((acc, ep) => {
  if (!acc[ep.tag]) acc[ep.tag] = [];
  acc[ep.tag].push(ep);
  return acc;
}, {});

export const endpointTags = [
  { id: 'health', label: 'Health', icon: 'heart-pulse' },
  { id: 'portfolios', label: 'Portfolios', icon: 'briefcase' },
  { id: 'businesses', label: 'Businesses', icon: 'building-2' },
  { id: 'scores', label: 'Credit Scores', icon: 'bar-chart-3' },
  { id: 'risk', label: 'Risk', icon: 'shield-alert' },
  { id: 'underwriting', label: 'Underwriting', icon: 'file-check' },
  { id: 'analytics', label: 'Analytics', icon: 'trending-up' },
  { id: 'api-keys', label: 'API Keys', icon: 'key' },
  { id: 'reports', label: 'Reports', icon: 'file-text' },
  { id: 'audit', label: 'Audit', icon: 'scroll-text' },
  { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
] as const;

export type EndpointTagId = (typeof endpointTags)[number]['id'];
