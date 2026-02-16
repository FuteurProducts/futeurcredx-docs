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
        distribution: {
          '0-20': 180000,
          '21-40': 540000,
          '41-60': 1200000,
          '61-80': 2700000,
          '81-100': 1380000,
        },
        mean: 71.4,
        median: 73,
        total: 6000000,
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
for range_key, count in dist["distribution"].items():
    print(f"  {range_key}: {count:,}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/scores/distribution?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: dist } = await resp.json();
console.log("Mean:", dist.mean, "Median:", dist.median);
Object.entries(dist.distribution).forEach(([range, count]) =>
  console.log(\`  \${range}: \${Number(count).toLocaleString()}\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/scores/distribution?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  {
    id: 'scores-pull',
    method: 'POST',
    path: '/api/v1/dashboard/scores/pull',
    title: 'Trigger Credit Score Pull',
    description:
      'Initiates a credit score pull for a specific business. This triggers a fresh credit assessment using the latest available data. Returns the new score once calculation is complete.',
    tag: 'scores',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'businessId',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Business entity ID to pull the score for',
      },
      {
        name: 'portfolioId',
        type: 'body',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the business belongs to',
      },
    ],
    responseExample: {
      success: true,
      data: {
        scoreId: 'scr_01PULL001',
        businessId: 'biz_01HQ3V7K8M2N4P5R6S7T8U9V0W',
        score: 79,
        previousScore: 78,
        riskTier: 'low',
        calculatedAt: '2026-02-15T22:35:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:35:00.000Z',
      },
    },
    errorExamples: [
      {
        status: 404,
        body: {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Business not found in portfolio' },
          meta: { requestId: 'req_pull001' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/scores/pull" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"businessId": "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W", "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/scores/pull",
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "businessId": "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
    }
)
result = resp.json()["data"]
print(f"New score: {result['score']} (was {result['previousScore']})")`,
      node: `const resp = await fetch("${API_BASE}/dashboard/scores/pull", {
  method: "POST",
  headers: {
    "X-API-Key": "sk_test_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    businessId: "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
    portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  }),
});
const { data: result } = await resp.json();
console.log(\`New score: \${result.score} (was \${result.previousScore})\`);`,
      go: `payload := strings.NewReader(\`{
  "businessId":"biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
  "portfolioId":"33ae8a27-8718-4a96-8cd5-f472de6a77ee"
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/scores/pull", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
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
    id: 'risk-ews',
    method: 'GET',
    path: '/api/v1/dashboard/risk/ews',
    title: 'Get Early Warning System Alerts',
    description:
      'Returns Early Warning System (EWS) alerts for the portfolio. EWS monitors businesses for deteriorating credit signals and generates proactive alerts before defaults occur. Critical for banks to take preventive action.',
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
        description: 'Filter by severity: low, medium, high, critical',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'ews_01ALERT001',
          businessId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          businessName: 'Bright Path Consulting',
          severity: 'high',
          signalType: 'SCORE_DECLINE',
          description: 'Credit score declined 12 points over 30 days — approaching high-risk threshold',
          currentScore: 65,
          previousScore: 77,
          recommendation: 'Review account for potential credit line reduction',
          triggeredAt: '2026-02-14T08:30:00.000Z',
          status: 'open',
        },
        {
          id: 'ews_02ALERT002',
          businessId: 'biz_03KS5X9M0O4P6R7T8U1V2W3Y4Z',
          businessName: 'Metro Auto Parts Inc',
          severity: 'critical',
          signalType: 'PAYMENT_DELINQUENCY',
          description: 'Payment 60+ days past due on Line of Credit',
          currentScore: 42,
          previousScore: 58,
          recommendation: 'Escalate to collections team immediately',
          triggeredAt: '2026-02-13T14:15:00.000Z',
          status: 'open',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 1450,
        totalPages: 73,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/risk/ews?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&severity=critical" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/risk/ews",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "severity": "critical",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
alerts = resp.json()["data"]
for alert in alerts:
    print(f"[{alert['severity'].upper()}] {alert['businessName']}: {alert['description']}")
    print(f"  Recommendation: {alert['recommendation']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  severity: "critical",
});
const resp = await fetch(\`${API_BASE}/dashboard/risk/ews?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: alerts } = await resp.json();
alerts.forEach((a) => {
  console.log(\`[\${a.severity.toUpperCase()}] \${a.businessName}: \${a.description}\`);
  console.log(\`  Recommendation: \${a.recommendation}\`);
});`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/risk/ews", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("severity", "critical")
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
  // BATCH
  // =========================================================================
  {
    id: 'batch-submit',
    method: 'POST',
    path: '/api/v1/dashboard/batch/submit',
    title: 'Submit Batch Processing Job',
    description:
      'Submits a batch processing job for bulk operations such as credit score pulls, risk assessments, or data enrichment across multiple businesses. Returns a job ID for tracking progress. Use webhooks or poll the job status for completion.',
    tag: 'batch',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'body',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to process',
      },
      {
        name: 'operation',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Batch operation type: "score_pull", "risk_assessment", "data_enrichment"',
      },
      {
        name: 'businessIds',
        type: 'body',
        required: false,
        dataType: 'string[]',
        description: 'Optional list of business IDs to process. If omitted, processes entire portfolio.',
      },
    ],
    responseExample: {
      success: true,
      data: {
        jobId: 'batch_01JOB001',
        portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
        operation: 'score_pull',
        status: 'queued',
        totalItems: 500,
        processedItems: 0,
        estimatedCompletionAt: '2026-02-15T23:00:00.000Z',
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
            message: 'Invalid batch configuration',
            details: [{ field: 'operation', issue: 'Must be one of: score_pull, risk_assessment, data_enrichment' }],
          },
          meta: { requestId: 'req_batch001' },
        },
      },
    ],
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/batch/submit" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee", "operation": "score_pull", "businessIds": ["biz_01HQ3V7K8M2N4P5R6S7T8U9V0W", "biz_02JR4W8L9N3O5Q6S7T8U0V1W2X"]}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/batch/submit",
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "operation": "score_pull",
        "businessIds": [
            "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
            "biz_02JR4W8L9N3O5Q6S7T8U0V1W2X",
        ],
    }
)
job = resp.json()["data"]
print(f"Batch job {job['jobId']} — Status: {job['status']}")
print(f"Processing {job['totalItems']} items")`,
      node: `const resp = await fetch("${API_BASE}/dashboard/batch/submit", {
  method: "POST",
  headers: {
    "X-API-Key": "sk_test_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
    operation: "score_pull",
    businessIds: [
      "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
      "biz_02JR4W8L9N3O5Q6S7T8U0V1W2X",
    ],
  }),
});
const { data: job } = await resp.json();
console.log(\`Batch job \${job.jobId} — Status: \${job.status}\`);
console.log(\`Processing \${job.totalItems} items\`);`,
      go: `payload := strings.NewReader(\`{
  "portfolioId":"33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  "operation":"score_pull",
  "businessIds":["biz_01HQ3V7K8M2N4P5R6S7T8U9V0W","biz_02JR4W8L9N3O5Q6S7T8U0V1W2X"]
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/batch/submit", payload)
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
    path: '/api/v1/webhooks',
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
      curl: `curl -X GET "${API_BASE}/webhooks" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/webhooks",
    headers={"X-API-Key": "sk_test_your_key_here"}
)
webhooks = resp.json()["data"]
for wh in webhooks:
    print(f"{wh['url']} — Events: {', '.join(wh['events'])} [{wh['status']}]")`,
      node: `const resp = await fetch("${API_BASE}/webhooks", {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: webhooks } = await resp.json();
webhooks.forEach((wh) =>
  console.log(\`\${wh.url} — Events: \${wh.events.join(", ")} [\${wh.status}]\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/webhooks", nil)
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
    path: '/api/v1/webhooks',
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
      curl: `curl -X POST "${API_BASE}/webhooks" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/webhooks/lumiq", "events": ["score.updated", "risk.alert"]}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/webhooks",
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
      node: `const resp = await fetch("${API_BASE}/webhooks", {
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
req, _ := http.NewRequest("POST", "${API_BASE}/webhooks", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // COMPLIANCE
  // =========================================================================
  {
    id: 'emit-audit-event',
    method: 'POST',
    path: '/api/v1/dashboard/audit-events',
    title: 'Emit Audit Event',
    description:
      'Records a client-side audit event to the compliance trail. Use this to log user actions such as viewing scores, opening dossiers, downloading reports, or initiating exports. Events are enriched server-side with IP address and session context.',
    tag: 'compliance',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'action',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Event type: SCORE_VIEWED, DOSSIER_OPENED, REPORT_DOWNLOADED, APPLY_CLICKED, OFFER_PRESENTED, FILTER_APPLIED, EXPORT_INITIATED, BULK_ACTION_EXECUTED',
      },
      {
        name: 'resourceType',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Type of resource acted upon (e.g., "business", "report", "score")',
      },
      {
        name: 'resourceId',
        type: 'body',
        required: false,
        dataType: 'string',
        description: 'ID of the specific resource',
      },
      {
        name: 'details',
        type: 'body',
        required: false,
        dataType: 'object',
        description: 'Additional context for the event (e.g., search terms, filter values)',
      },
    ],
    responseExample: {
      success: true,
      data: {
        eventId: 'aud_03EMT001',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/audit-events" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "SCORE_VIEWED", "resourceType": "business", "resourceId": "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W", "details": {"score": 78}}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/audit-events",
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "action": "SCORE_VIEWED",
        "resourceType": "business",
        "resourceId": "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
        "details": {"score": 78},
    }
)
print(resp.json()["data"]["eventId"])`,
      node: `const resp = await fetch("${API_BASE}/dashboard/audit-events", {
  method: "POST",
  headers: {
    "X-API-Key": "sk_test_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    action: "SCORE_VIEWED",
    resourceType: "business",
    resourceId: "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
    details: { score: 78 },
  }),
});
const { data } = await resp.json();
console.log("Event ID:", data.eventId);`,
      go: `payload := strings.NewReader(\`{
  "action":"SCORE_VIEWED",
  "resourceType":"business",
  "resourceId":"biz_01HQ3V7K8M2N4P5R6S7T8U9V0W",
  "details":{"score":78}
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/audit-events", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
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
    title: 'List Report Jobs',
    description:
      'Returns a paginated list of report generation jobs for the portfolio. Supports filtering by report type and status. Reports are generated asynchronously; poll the job status for completion.',
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
        name: 'reportType',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by type: portfolio_summary, risk_analysis, compliance_audit, performance_metrics, custom',
      },
      {
        name: 'status',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by status: queued, processing, completed, failed',
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
          reportType: 'compliance_audit',
          status: 'completed',
          parameters: { dateRange: '2026-01-01/2026-02-01' },
          artifactUrl: 'https://storage.futeurcredx.com/reports/rpt_01RPT001.pdf',
          startedAt: '2026-02-15T10:00:00.000Z',
          completedAt: '2026-02-15T10:05:32.000Z',
          createdAt: '2026-02-15T09:59:00.000Z',
        },
        {
          id: 'rpt_02RPT002',
          portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
          reportType: 'risk_analysis',
          status: 'processing',
          parameters: {},
          artifactUrl: null,
          startedAt: '2026-02-16T08:00:00.000Z',
          completedAt: null,
          createdAt: '2026-02-16T07:59:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 42,
        totalPages: 3,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&status=completed" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/reports",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "status": "completed",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
reports = resp.json()["data"]
for r in reports:
    print(f"{r['reportType']} [{r['status']}] — {r['id']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  status: "completed",
});
const resp = await fetch(\`${API_BASE}/dashboard/reports?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: reports } = await resp.json();
reports.forEach((r) => console.log(\`\${r.reportType} [\${r.status}]\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/reports", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("status", "completed")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'get-report',
    method: 'GET',
    path: '/api/v1/dashboard/reports/:id',
    title: 'Get Report Job Status',
    description:
      'Returns the current status and details of a specific report job. Use this endpoint to poll for completion after submitting a report generation request.',
    tag: 'reports',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Report job ID',
      },
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the report belongs to',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'rpt_01RPT001',
        portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
        reportType: 'compliance_audit',
        status: 'completed',
        parameters: { dateRange: '2026-01-01/2026-02-01' },
        artifactUrl: 'https://storage.futeurcredx.com/reports/rpt_01RPT001.pdf',
        startedAt: '2026-02-15T10:00:00.000Z',
        completedAt: '2026-02-15T10:05:32.000Z',
        createdAt: '2026-02-15T09:59:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/reports/rpt_01RPT001?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests
import time

report_id = "rpt_01RPT001"
portfolio_id = "33ae8a27-8718-4a96-8cd5-f472de6a77ee"

# Poll until complete
while True:
    resp = requests.get(
        f"${API_BASE}/dashboard/reports/{report_id}",
        params={"portfolioId": portfolio_id},
        headers={"X-API-Key": "sk_test_your_key_here"}
    )
    report = resp.json()["data"]
    if report["status"] in ("completed", "failed"):
        break
    print(f"Status: {report['status']}... waiting")
    time.sleep(5)

print(f"Report {report['status']}: {report.get('artifactUrl', 'N/A')}")`,
      node: `const reportId = "rpt_01RPT001";
const portfolioId = "33ae8a27-8718-4a96-8cd5-f472de6a77ee";

const resp = await fetch(
  \`${API_BASE}/dashboard/reports/\${reportId}?portfolioId=\${portfolioId}\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: report } = await resp.json();
console.log("Status:", report.status);
if (report.artifactUrl) console.log("Download:", report.artifactUrl);`,
      go: `reportID := "rpt_01RPT001"
url := fmt.Sprintf("${API_BASE}/dashboard/reports/%s?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", reportID)
req, _ := http.NewRequest("GET", url, nil)
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
      'Submits a new report generation job. Reports are generated asynchronously. Poll the returned job ID using the Get Report Job Status endpoint to check for completion. Supported types: portfolio_summary, risk_analysis, compliance_audit, performance_metrics, custom.',
    tag: 'reports',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to generate the report for',
      },
      {
        name: 'reportType',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Report type: portfolio_summary, risk_analysis, compliance_audit, performance_metrics, custom',
      },
      {
        name: 'parameters',
        type: 'body',
        required: false,
        dataType: 'object',
        description: 'Report-specific parameters (e.g., date range, filters)',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'rpt_03RPT003',
        portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
        reportType: 'compliance_audit',
        status: 'queued',
        parameters: { dateRange: '2026-01-01/2026-02-16' },
        artifactUrl: null,
        startedAt: null,
        completedAt: null,
        createdAt: '2026-02-16T10:00:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"reportType": "compliance_audit", "parameters": {"dateRange": "2026-01-01/2026-02-16"}}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/reports",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "reportType": "compliance_audit",
        "parameters": {"dateRange": "2026-01-01/2026-02-16"},
    }
)
job = resp.json()["data"]
print(f"Report job created: {job['id']} — Status: {job['status']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  {
    method: "POST",
    headers: {
      "X-API-Key": "sk_test_your_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reportType: "compliance_audit",
      parameters: { dateRange: "2026-01-01/2026-02-16" },
    }),
  }
);
const { data: job } = await resp.json();
console.log(\`Report job: \${job.id} — Status: \${job.status}\`);`,
      go: `payload := strings.NewReader(\`{
  "reportType":"compliance_audit",
  "parameters":{"dateRange":"2026-01-01/2026-02-16"}
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/reports?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'download-report',
    method: 'GET',
    path: '/api/v1/dashboard/reports/:id/download',
    title: 'Download Report Artifact',
    description:
      'Returns a time-limited signed URL for downloading a completed report artifact. Triggers a REPORT_DOWNLOADED audit event server-side for compliance tracking.',
    tag: 'reports',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Report job ID',
      },
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the report belongs to',
      },
    ],
    responseExample: {
      success: true,
      data: {
        url: 'https://storage.futeurcredx.com/reports/rpt_01RPT001.pdf?token=signed_url_token',
        expiresAt: '2026-02-16T11:00:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/reports/rpt_01RPT001/download?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

report_id = "rpt_01RPT001"
resp = requests.get(
    f"${API_BASE}/dashboard/reports/{report_id}/download",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
result = resp.json()["data"]
print(f"Download URL: {result['url']}")
print(f"Expires at: {result['expiresAt']}")`,
      node: `const reportId = "rpt_01RPT001";
const resp = await fetch(
  \`${API_BASE}/dashboard/reports/\${reportId}/download?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data } = await resp.json();
console.log("Download URL:", data.url);`,
      go: `reportID := "rpt_01RPT001"
url := fmt.Sprintf("${API_BASE}/dashboard/reports/%s/download?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", reportID)
req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'report-templates',
    method: 'GET',
    path: '/api/v1/dashboard/reports/templates',
    title: 'List Report Templates',
    description:
      'Returns the available report templates for the portfolio. Each template defines a report type with its name and description, which can be used when creating new report jobs.',
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
    ],
    responseExample: {
      success: true,
      data: [
        { id: 'tmpl_01', name: 'Portfolio Summary', description: 'High-level KPIs and trends for the entire portfolio', type: 'portfolio_summary' },
        { id: 'tmpl_02', name: 'Risk Analysis', description: 'Detailed risk breakdown by tier, industry, and geography', type: 'risk_analysis' },
        { id: 'tmpl_03', name: 'Compliance Audit', description: 'Fair lending and regulatory compliance report', type: 'compliance_audit' },
        { id: 'tmpl_04', name: 'Performance Metrics', description: 'Product performance, approval rates, and yield analysis', type: 'performance_metrics' },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/reports/templates?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/reports/templates",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
templates = resp.json()["data"]
for t in templates:
    print(f"{t['name']} ({t['type']}): {t['description']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/reports/templates?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: templates } = await resp.json();
templates.forEach((t) => console.log(\`\${t.name} (\${t.type})\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/reports/templates?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // BATCH (additional endpoints)
  // =========================================================================
  {
    id: 'batch-status',
    method: 'GET',
    path: '/api/v1/dashboard/batch/:batchJobId/status',
    title: 'Get Batch Job Status',
    description:
      'Returns the current status of a batch processing job including progress counts. Use this to poll for completion after submitting a batch job.',
    tag: 'batch',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'batchJobId',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Batch job ID returned from the submit endpoint',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'batch_01JOB001',
        status: 'processing',
        totalCount: 500,
        processedCount: 342,
        failedCount: 3,
        startedAt: '2026-02-15T22:30:15.000Z',
        completedAt: null,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:45:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/batch/batch_01JOB001/status" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests
import time

batch_id = "batch_01JOB001"
while True:
    resp = requests.get(
        f"${API_BASE}/dashboard/batch/{batch_id}/status",
        headers={"X-API-Key": "sk_test_your_key_here"}
    )
    job = resp.json()["data"]
    print(f"Status: {job['status']} — {job['processedCount']}/{job['totalCount']}")
    if job["status"] in ("completed", "failed"):
        break
    time.sleep(5)`,
      node: `const batchId = "batch_01JOB001";
const resp = await fetch(
  \`${API_BASE}/dashboard/batch/\${batchId}/status\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: job } = await resp.json();
console.log(\`Status: \${job.status} — \${job.processedCount}/\${job.totalCount}\`);`,
      go: `batchID := "batch_01JOB001"
url := fmt.Sprintf("${API_BASE}/dashboard/batch/%s/status", batchID)
req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'batch-results',
    method: 'GET',
    path: '/api/v1/dashboard/batch/:batchJobId/results',
    title: 'Get Batch Job Results',
    description:
      'Returns paginated results for a completed batch job. Each result item includes the business ID, processing status, generated credit score, and any pre-qualification offers.',
    tag: 'batch',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'batchJobId',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Batch job ID',
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
          status: 'scored',
          score: { id: 'scr_batch_001', score: 78, riskClass: 'low', source: 'internal' },
          offers: [
            { productType: 'Term Loan', maxAmount: 750000, estimatedRate: 7.25 },
          ],
        },
        {
          businessId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          businessName: 'Bright Path Consulting',
          status: 'scored',
          score: { id: 'scr_batch_002', score: 65, riskClass: 'medium', source: 'internal' },
          offers: [],
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 500,
        totalPages: 25,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T23:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/batch/batch_01JOB001/results?page=1&pageSize=20" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

batch_id = "batch_01JOB001"
resp = requests.get(
    f"${API_BASE}/dashboard/batch/{batch_id}/results",
    params={"page": 1, "pageSize": 20},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
results = resp.json()["data"]
for r in results:
    score = r.get("score", {}).get("score", "N/A")
    print(f"{r['businessName']}: {r['status']} — Score: {score}")`,
      node: `const batchId = "batch_01JOB001";
const resp = await fetch(
  \`${API_BASE}/dashboard/batch/\${batchId}/results?page=1&pageSize=20\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: results } = await resp.json();
results.forEach((r) =>
  console.log(\`\${r.businessName}: \${r.status} — Score: \${r.score?.score ?? "N/A"}\`)
);`,
      go: `batchID := "batch_01JOB001"
url := fmt.Sprintf("${API_BASE}/dashboard/batch/%s/results?page=1&pageSize=20", batchID)
req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // PRODUCTS
  // =========================================================================
  {
    id: 'list-products',
    method: 'GET',
    path: '/api/v1/dashboard/products',
    title: 'List Bank Products',
    description:
      'Returns a paginated list of bank products configured for the portfolio. Supports filtering by product family, status, and eligibility tier. Includes term details and target segments.',
    tag: 'products',
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
        name: 'family',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by product family: Credit Cards, Lines of Credit, Term Loans, SBA Programs, Equipment Finance, Commercial Auto, Commercial Real Estate, Deposits, Treasury',
      },
      {
        name: 'status',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by status: Active, Pilot, Sunset',
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
          id: 'prod_01',
          name: 'Business Line of Credit',
          family: 'Lines of Credit',
          status: 'Active',
          eligibilityTier: 'Tier 1',
          targetSegments: ['small', 'mid_market'],
          terms: {
            rateRange: '7.5% - 12.0%',
            termRange: '12 - 36 months',
            amountRange: '$25,000 - $500,000',
            collateral: 'Unsecured',
            guarantor: 'Personal guarantee required',
          },
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 18,
        totalPages: 1,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/products?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&family=Lines+of+Credit" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/products",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "family": "Lines of Credit",
        "status": "Active",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
products = resp.json()["data"]
for p in products:
    print(f"{p['name']} ({p['family']}) — {p['terms']['amountRange']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  family: "Lines of Credit",
});
const resp = await fetch(\`${API_BASE}/dashboard/products?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: products } = await resp.json();
products.forEach((p) => console.log(\`\${p.name}: \${p.terms.amountRange}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/products", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("family", "Lines of Credit")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'product-penetration',
    method: 'GET',
    path: '/api/v1/dashboard/products/penetration',
    title: 'Get Product Penetration',
    description:
      'Returns product penetration metrics across the portfolio showing how many customers hold each product versus how many are eligible, with cross-sell gap and revenue opportunity estimates.',
    tag: 'products',
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
      data: [
        {
          product: 'Business Line of Credit',
          family: 'Lines of Credit',
          customersHolding: 1250000,
          eligibleCustomers: 3400000,
          penetrationRate: 36.8,
          crossSellGap: 2150000,
          revenueOpportunity: 45000000,
        },
        {
          product: 'Business Credit Card',
          family: 'Credit Cards',
          customersHolding: 2100000,
          eligibleCustomers: 4800000,
          penetrationRate: 43.8,
          crossSellGap: 2700000,
          revenueOpportunity: 32000000,
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/products/penetration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/products/penetration",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
data = resp.json()["data"]
for p in data:
    print(f"{p['product']}: {p['penetrationRate']}% penetration, \${p['revenueOpportunity']:,} opportunity")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/products/penetration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data } = await resp.json();
data.forEach((p) =>
  console.log(\`\${p.product}: \${p.penetrationRate}% penetration\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/products/penetration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'product-performance',
    method: 'GET',
    path: '/api/v1/dashboard/products/performance',
    title: 'Get Product Performance',
    description:
      'Returns performance metrics for each product including active accounts, approval rates, average loan amounts, delinquency rates, charge-off rates, and yield rates.',
    tag: 'products',
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
      data: [
        {
          product: 'Business Line of Credit',
          family: 'Lines of Credit',
          activeAccounts: 1250000,
          approvalRate: 72.4,
          avgLoanAmount: 185000,
          portfolioBalance: 231250000000,
          delinquencyRate: 3.2,
          chargeoffRate: 0.8,
          yieldRate: 9.4,
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/products/performance?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/products/performance",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for p in resp.json()["data"]:
    print(f"{p['product']}: Approval {p['approvalRate']}%, Yield {p['yieldRate']}%, Delinquency {p['delinquencyRate']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/products/performance?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data } = await resp.json();
data.forEach((p) => console.log(\`\${p.product}: Yield \${p.yieldRate}%\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/products/performance?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'prequal-readiness',
    method: 'GET',
    path: '/api/v1/dashboard/products/prequal-readiness',
    title: 'Get Pre-Qualification Readiness',
    description:
      'Returns pre-qualification readiness summary across products. Shows how many businesses are likely, borderline, or unlikely to qualify for each product.',
    tag: 'products',
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
      data: [
        { product: 'Term Loan', likely: 2400000, borderline: 1200000, unlikely: 2400000, total: 6000000 },
        { product: 'Business Line of Credit', likely: 3000000, borderline: 1500000, unlikely: 1500000, total: 6000000 },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/products/prequal-readiness?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/products/prequal-readiness",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for p in resp.json()["data"]:
    pct = round(p["likely"] / p["total"] * 100, 1)
    print(f"{p['product']}: {pct}% likely to qualify ({p['likely']:,} businesses)")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/products/prequal-readiness?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data } = await resp.json();
data.forEach((p) => console.log(\`\${p.product}: \${p.likely.toLocaleString()} likely\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/products/prequal-readiness?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // CAMPAIGNS
  // =========================================================================
  {
    id: 'list-campaigns',
    method: 'GET',
    path: '/api/v1/dashboard/campaigns',
    title: 'List Campaigns',
    description:
      'Returns a paginated list of marketing campaigns for the portfolio. Each campaign includes funnel metrics (pushed, viewed, applied, approved), conversion rates, and health status.',
    tag: 'campaigns',
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
        name: 'status',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by status: active, paused, completed, draft',
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
          id: 'camp_01',
          name: 'Q1 LOC Cross-Sell',
          status: 'active',
          health: 'on_track',
          targetSegment: 'small',
          product: 'Business Line of Credit',
          startDate: '2026-01-15',
          endDate: '2026-03-31',
          owner: 'Sarah Johnson',
          funnel: { pushed: 50000, viewed: 32000, applied: 8500, approved: 6100 },
          viewRate: 64.0,
          applyRate: 26.6,
          approvalRate: 71.8,
          approvedVolume: 915000000,
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 8,
        totalPages: 1,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/campaigns?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&status=active" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/campaigns",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "status": "active",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for c in resp.json()["data"]:
    print(f"{c['name']} [{c['health']}]: {c['approvalRate']}% approval, \${c['approvedVolume']:,} volume")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  status: "active",
});
const resp = await fetch(\`${API_BASE}/dashboard/campaigns?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: campaigns } = await resp.json();
campaigns.forEach((c) => console.log(\`\${c.name}: \${c.approvalRate}% approval\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/campaigns", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("status", "active")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'campaign-summary',
    method: 'GET',
    path: '/api/v1/dashboard/campaigns/summary',
    title: 'Get Campaign Summary',
    description:
      'Returns aggregate campaign metrics including total active campaigns, offers pushed, average conversion rates, and total revenue booked.',
    tag: 'campaigns',
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
        activeCampaigns: 5,
        offersPushed: 250000,
        avgViewRate: 61.2,
        avgApplyRate: 24.8,
        avgApprovalRate: 68.5,
        revenueBooked: 4500000000,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/campaigns/summary?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/campaigns/summary",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
s = resp.json()["data"]
print(f"Active campaigns: {s['activeCampaigns']}")
print(f"Offers pushed: {s['offersPushed']:,}")
print(f"Revenue booked: \${s['revenueBooked']:,}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/campaigns/summary?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: summary } = await resp.json();
console.log("Active:", summary.activeCampaigns);
console.log("Revenue:", summary.revenueBooked.toLocaleString());`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/campaigns/summary?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'create-campaign',
    method: 'POST',
    path: '/api/v1/dashboard/campaigns',
    title: 'Create Campaign',
    description:
      'Creates a new marketing campaign targeting a specific customer segment and product. The campaign will begin generating offers on the specified start date.',
    tag: 'campaigns',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to create the campaign in',
      },
      {
        name: 'name',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Campaign name',
      },
      {
        name: 'targetSegment',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Target segment: micro, small, mid_market',
      },
      {
        name: 'product',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Product to offer (e.g., "Business Line of Credit")',
      },
      {
        name: 'startDate',
        type: 'body',
        required: true,
        dataType: 'string (ISO 8601)',
        description: 'Campaign start date',
      },
      {
        name: 'endDate',
        type: 'body',
        required: true,
        dataType: 'string (ISO 8601)',
        description: 'Campaign end date',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'camp_02',
        name: 'Q1 Term Loan Push',
        status: 'draft',
        health: 'on_track',
        targetSegment: 'mid_market',
        product: 'Term Loan',
        startDate: '2026-03-01',
        endDate: '2026-06-30',
        owner: 'API User',
        funnel: { pushed: 0, viewed: 0, applied: 0, approved: 0 },
        viewRate: 0,
        applyRate: 0,
        approvalRate: 0,
        approvedVolume: 0,
        createdAt: '2026-02-16T10:00:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/campaigns?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Q1 Term Loan Push", "targetSegment": "mid_market", "product": "Term Loan", "startDate": "2026-03-01", "endDate": "2026-06-30"}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/campaigns",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "name": "Q1 Term Loan Push",
        "targetSegment": "mid_market",
        "product": "Term Loan",
        "startDate": "2026-03-01",
        "endDate": "2026-06-30",
    }
)
campaign = resp.json()["data"]
print(f"Campaign created: {campaign['id']} — {campaign['name']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/campaigns?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  {
    method: "POST",
    headers: {
      "X-API-Key": "sk_test_your_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Q1 Term Loan Push",
      targetSegment: "mid_market",
      product: "Term Loan",
      startDate: "2026-03-01",
      endDate: "2026-06-30",
    }),
  }
);
const { data: campaign } = await resp.json();
console.log("Created:", campaign.id, campaign.name);`,
      go: `payload := strings.NewReader(\`{
  "name":"Q1 Term Loan Push",
  "targetSegment":"mid_market",
  "product":"Term Loan",
  "startDate":"2026-03-01",
  "endDate":"2026-06-30"
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/campaigns?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // RISK (additional endpoints)
  // =========================================================================
  {
    id: 'risk-concentration',
    method: 'GET',
    path: '/api/v1/dashboard/risk/concentration',
    title: 'Get Concentration Risk',
    description:
      'Returns concentration risk analysis broken down by industry, state, and risk tier. Identifies portfolio concentration hotspots that may require diversification.',
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
        byIndustry: [
          { industry: 'Retail', exposure: 145000000000, percentage: 22.3 },
          { industry: 'Healthcare', exposure: 98000000000, percentage: 15.1 },
          { industry: 'Manufacturing', exposure: 91000000000, percentage: 14.0 },
        ],
        byState: [
          { state: 'CA', exposure: 102000000000, percentage: 15.7 },
          { state: 'TX', exposure: 78000000000, percentage: 12.0 },
          { state: 'NY', exposure: 71000000000, percentage: 10.9 },
        ],
        byRiskTier: [
          { tier: 'low', exposure: 325000000000, percentage: 50.0 },
          { tier: 'moderate', exposure: 162500000000, percentage: 25.0 },
          { tier: 'high', exposure: 97500000000, percentage: 15.0 },
          { tier: 'critical', exposure: 65000000000, percentage: 10.0 },
        ],
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/risk/concentration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/risk/concentration",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
data = resp.json()["data"]
print("Top industries by exposure:")
for i in data["byIndustry"][:5]:
    print(f"  {i['industry']}: {i['percentage']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/risk/concentration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data } = await resp.json();
data.byIndustry.forEach((i) => console.log(\`\${i.industry}: \${i.percentage}%\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/risk/concentration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'risk-aggregates',
    method: 'GET',
    path: '/api/v1/dashboard/risk/aggregates',
    title: 'Get Risk Aggregates',
    description:
      'Returns risk metrics aggregated by a specified dimension such as industry, segment, risk tier, state, or relationship stage. Useful for building risk dashboards and heatmaps.',
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
        name: 'dimension',
        type: 'query',
        required: true,
        dataType: 'string',
        description: 'Aggregation dimension: industry, segment, riskTier, state, relationshipStage',
      },
    ],
    responseExample: {
      success: true,
      data: [
        { dimension: 'industry', value: 'Retail', count: 1340000, totalExposure: 145000000000, avgRiskScore: 68.2 },
        { dimension: 'industry', value: 'Healthcare', count: 900000, totalExposure: 98000000000, avgRiskScore: 74.1 },
        { dimension: 'industry', value: 'Manufacturing', count: 840000, totalExposure: 91000000000, avgRiskScore: 71.8 },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/risk/aggregates?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&dimension=industry" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/risk/aggregates",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "dimension": "industry",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for agg in resp.json()["data"]:
    print(f"{agg['value']}: {agg['count']:,} businesses, avg risk score {agg['avgRiskScore']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  dimension: "industry",
});
const resp = await fetch(\`${API_BASE}/dashboard/risk/aggregates?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data } = await resp.json();
data.forEach((a) => console.log(\`\${a.value}: \${a.count.toLocaleString()}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/risk/aggregates", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("dimension", "industry")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'acknowledge-ews-alert',
    method: 'POST',
    path: '/api/v1/dashboard/risk/ews/:alertId/acknowledge',
    title: 'Acknowledge EWS Alert',
    description:
      'Acknowledges an Early Warning System alert, marking it as reviewed. Optionally include notes documenting the action taken. This is required for compliance audit trails.',
    tag: 'risk',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'alertId',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'EWS alert ID to acknowledge',
      },
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the alert belongs to',
      },
      {
        name: 'notes',
        type: 'body',
        required: false,
        dataType: 'string',
        description: 'Notes documenting the action taken',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'ews_01ALERT001',
        smbEntityId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
        alertType: 'SCORE_DECLINE',
        severity: 'high',
        message: 'Credit score declined 12 points over 30 days',
        triggeredAt: '2026-02-14T08:30:00.000Z',
        acknowledgedAt: '2026-02-16T10:00:00.000Z',
        acknowledgedBy: 'user_01USR001',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/risk/ews/ews_01ALERT001/acknowledge?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"notes": "Reviewed account — reducing credit line by 20%"}'`,
      python: `import requests

alert_id = "ews_01ALERT001"
resp = requests.post(
    f"${API_BASE}/dashboard/risk/ews/{alert_id}/acknowledge",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={"notes": "Reviewed account — reducing credit line by 20%"}
)
alert = resp.json()["data"]
print(f"Alert {alert['id']} acknowledged at {alert['acknowledgedAt']}")`,
      node: `const alertId = "ews_01ALERT001";
const resp = await fetch(
  \`${API_BASE}/dashboard/risk/ews/\${alertId}/acknowledge?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  {
    method: "POST",
    headers: {
      "X-API-Key": "sk_test_your_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes: "Reviewed account — reducing credit line by 20%" }),
  }
);
const { data: alert } = await resp.json();
console.log("Acknowledged at:", alert.acknowledgedAt);`,
      go: `alertID := "ews_01ALERT001"
payload := strings.NewReader(\`{"notes":"Reviewed account — reducing credit line by 20%"}\`)
url := fmt.Sprintf("${API_BASE}/dashboard/risk/ews/%s/acknowledge?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", alertID)
req, _ := http.NewRequest("POST", url, payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // UNDERWRITING (additional endpoints)
  // =========================================================================
  {
    id: 'underwriting-queue',
    method: 'GET',
    path: '/api/v1/dashboard/underwriting/queue',
    title: 'Get Underwriting Queue',
    description:
      'Returns the underwriting review queue with pending applications. Supports filtering by SLA status, risk level, and assigned underwriter. Items include time-in-queue and SLA breach warnings.',
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
        name: 'slaStatus',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by SLA status: ok, warning, breach',
      },
      {
        name: 'risk',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by risk level: LOW, MODERATE, ELEVATED, HIGH, CRITICAL',
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
          id: 'uwq_01',
          applicationId: 'app_02UW002',
          smbEntityId: 'biz_02JR4W8L9N3O5Q6S7T8U0V1W2X',
          business: 'Bright Path Consulting',
          product: 'Business Line of Credit',
          amount: 150000,
          score: 65,
          risk: 'MODERATE',
          timeInQueue: 48,
          slaStatus: 'warning',
          assignedTo: 'Mike Chen',
          recommendation: 'review',
          submittedAt: '2026-02-13T11:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 145,
        totalPages: 8,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/underwriting/queue?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&slaStatus=warning" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/underwriting/queue",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "slaStatus": "warning",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for item in resp.json()["data"]:
    print(f"{item['business']}: {item['product']} \${item['amount']:,} — SLA: {item['slaStatus']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  slaStatus: "warning",
});
const resp = await fetch(\`${API_BASE}/dashboard/underwriting/queue?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: queue } = await resp.json();
queue.forEach((q) => console.log(\`\${q.business}: SLA \${q.slaStatus}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/underwriting/queue", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("slaStatus", "warning")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'underwriting-kpis',
    method: 'GET',
    path: '/api/v1/dashboard/underwriting/kpis',
    title: 'Get Underwriting KPIs',
    description:
      'Returns key performance indicators for the underwriting function including queue depth, average decision time, auto-approve/decline rates, and SLA compliance percentage.',
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
    ],
    responseExample: {
      success: true,
      data: {
        queueDepth: 145,
        avgDecisionTime: 18.5,
        autoApproveRate: 42.3,
        manualReviewRate: 38.5,
        declineRate: 19.2,
        slaCompliance: 94.7,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/underwriting/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/underwriting/kpis",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
kpis = resp.json()["data"]
print(f"Queue depth: {kpis['queueDepth']}")
print(f"Avg decision time: {kpis['avgDecisionTime']}h")
print(f"SLA compliance: {kpis['slaCompliance']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/underwriting/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: kpis } = await resp.json();
console.log("Queue:", kpis.queueDepth, "SLA:", kpis.slaCompliance + "%");`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/underwriting/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'underwriting-decision',
    method: 'POST',
    path: '/api/v1/dashboard/underwriting/queue/:queueItemId/decision',
    title: 'Make Underwriting Decision',
    description:
      'Records an underwriting decision (approve, decline, conditional approve, or send for further review) on a queue item. Includes decision notes and any conditions for conditional approvals.',
    tag: 'underwriting',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'queueItemId',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Underwriting queue item ID',
      },
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the queue item belongs to',
      },
      {
        name: 'decision',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Decision: approve, decline, review, conditional_approve',
      },
      {
        name: 'notes',
        type: 'body',
        required: false,
        dataType: 'string',
        description: 'Decision notes for audit trail',
      },
      {
        name: 'decisionData',
        type: 'body',
        required: false,
        dataType: 'object',
        description: 'Additional decision data (conditions, modified terms)',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'uwq_01',
        applicationId: 'app_02UW002',
        business: 'Bright Path Consulting',
        product: 'Business Line of Credit',
        amount: 150000,
        score: 65,
        risk: 'MODERATE',
        timeInQueue: 48,
        slaStatus: 'warning',
        recommendation: 'approve',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/underwriting/queue/uwq_01/decision?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"decision": "conditional_approve", "notes": "Approved with reduced line", "decisionData": {"approvedAmount": 100000}}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/underwriting/queue/uwq_01/decision",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "decision": "conditional_approve",
        "notes": "Approved with reduced line",
        "decisionData": {"approvedAmount": 100000},
    }
)
result = resp.json()["data"]
print(f"Decision recorded for {result['business']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/underwriting/queue/uwq_01/decision?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  {
    method: "POST",
    headers: {
      "X-API-Key": "sk_test_your_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      decision: "conditional_approve",
      notes: "Approved with reduced line",
      decisionData: { approvedAmount: 100000 },
    }),
  }
);
const { data } = await resp.json();
console.log("Decision recorded for:", data.business);`,
      go: `payload := strings.NewReader(\`{
  "decision":"conditional_approve",
  "notes":"Approved with reduced line",
  "decisionData":{"approvedAmount":100000}
}\`)
url := "${API_BASE}/dashboard/underwriting/queue/uwq_01/decision?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee"
req, _ := http.NewRequest("POST", url, payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // SETTINGS / USER MANAGEMENT
  // =========================================================================
  {
    id: 'list-users',
    method: 'GET',
    path: '/api/v1/dashboard/settings/users',
    title: 'List Platform Users',
    description:
      'Returns a paginated list of platform users configured for the tenant. Includes role, MFA status, portfolio access, and permission flags.',
    tag: 'settings',
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
        description: 'Items per page',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'user_01USR001',
          name: 'John Smith',
          email: 'john.smith@bank.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2026-02-16T08:00:00.000Z',
          mfaEnabled: true,
          portfolioAccess: ['33ae8a27-8718-4a96-8cd5-f472de6a77ee'],
          allowExports: true,
          allowApiKeyCreation: true,
          createdAt: '2025-06-01T00:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 12,
        totalPages: 1,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/settings/users?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/settings/users",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for user in resp.json()["data"]:
    mfa = "MFA" if user["mfaEnabled"] else "no MFA"
    print(f"{user['name']} ({user['role']}) — {user['status']}, {mfa}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/settings/users?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: users } = await resp.json();
users.forEach((u) => console.log(\`\${u.name} (\${u.role})\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/settings/users?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'create-user',
    method: 'POST',
    path: '/api/v1/dashboard/settings/users',
    title: 'Create Platform User',
    description:
      'Creates a new platform user with the specified role and permissions. The user will receive an invitation email to set up their account.',
    tag: 'settings',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio to add user to',
      },
      {
        name: 'name',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Full name of the user',
      },
      {
        name: 'email',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Email address',
      },
      {
        name: 'role',
        type: 'body',
        required: true,
        dataType: 'string',
        description: 'Role: admin, developer, risk, rm, readonly',
      },
      {
        name: 'portfolioAccess',
        type: 'body',
        required: true,
        dataType: 'string[]',
        description: 'Array of portfolio IDs the user can access',
      },
      {
        name: 'allowExports',
        type: 'body',
        required: false,
        dataType: 'boolean',
        default: 'false',
        description: 'Whether user can export data',
      },
      {
        name: 'allowApiKeyCreation',
        type: 'body',
        required: false,
        dataType: 'boolean',
        default: 'false',
        description: 'Whether user can create API keys',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'user_02USR002',
        name: 'Jane Doe',
        email: 'jane.doe@bank.com',
        role: 'risk',
        status: 'pending',
        lastLogin: null,
        mfaEnabled: false,
        portfolioAccess: ['33ae8a27-8718-4a96-8cd5-f472de6a77ee'],
        allowExports: true,
        allowApiKeyCreation: false,
        createdAt: '2026-02-16T10:00:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X POST "${API_BASE}/dashboard/settings/users?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Doe", "email": "jane.doe@bank.com", "role": "risk", "portfolioAccess": ["33ae8a27-8718-4a96-8cd5-f472de6a77ee"], "allowExports": true}'`,
      python: `import requests

resp = requests.post(
    "${API_BASE}/dashboard/settings/users",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={
        "X-API-Key": "sk_test_your_key_here",
        "Content-Type": "application/json",
    },
    json={
        "name": "Jane Doe",
        "email": "jane.doe@bank.com",
        "role": "risk",
        "portfolioAccess": ["33ae8a27-8718-4a96-8cd5-f472de6a77ee"],
        "allowExports": True,
    }
)
user = resp.json()["data"]
print(f"User created: {user['name']} ({user['role']}) — Status: {user['status']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/settings/users?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  {
    method: "POST",
    headers: {
      "X-API-Key": "sk_test_your_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Jane Doe",
      email: "jane.doe@bank.com",
      role: "risk",
      portfolioAccess: ["33ae8a27-8718-4a96-8cd5-f472de6a77ee"],
      allowExports: true,
    }),
  }
);
const { data: user } = await resp.json();
console.log(\`User created: \${user.name} (\${user.role})\`);`,
      go: `payload := strings.NewReader(\`{
  "name":"Jane Doe",
  "email":"jane.doe@bank.com",
  "role":"risk",
  "portfolioAccess":["33ae8a27-8718-4a96-8cd5-f472de6a77ee"],
  "allowExports":true
}\`)
req, _ := http.NewRequest("POST", "${API_BASE}/dashboard/settings/users?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", payload)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'settings-roles',
    method: 'GET',
    path: '/api/v1/dashboard/settings/roles',
    title: 'Get Role Permissions Matrix',
    description:
      'Returns the role-permission matrix showing which capabilities each role has. Useful for displaying permission grids in settings UIs.',
    tag: 'settings',
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
      data: [
        {
          role: 'admin',
          label: 'Administrator',
          permissions: {
            'view:portfolio': true,
            'manage:users': true,
            'manage:api-keys': true,
            'export:data': true,
            'view:pii': true,
            'make:decisions': true,
          },
        },
        {
          role: 'readonly',
          label: 'Read Only',
          permissions: {
            'view:portfolio': true,
            'manage:users': false,
            'manage:api-keys': false,
            'export:data': false,
            'view:pii': false,
            'make:decisions': false,
          },
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/settings/roles?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/settings/roles",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for role in resp.json()["data"]:
    perms = [k for k, v in role["permissions"].items() if v]
    print(f"{role['label']}: {', '.join(perms)}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/settings/roles?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: roles } = await resp.json();
roles.forEach((r) => console.log(r.label, Object.entries(r.permissions).filter(([,v]) => v).map(([k]) => k)));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/settings/roles?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'settings-billing',
    method: 'GET',
    path: '/api/v1/dashboard/settings/billing',
    title: 'Get Billing Information',
    description:
      'Returns billing information for the tenant including plan type, API call usage, storage consumption, and next billing date.',
    tag: 'settings',
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
        plan: 'enterprise',
        billingCycle: 'annual',
        apiCallsUsed: 2450000,
        apiCallsLimit: 10000000,
        storageUsedGB: 45.2,
        storageLimit: 500,
        nextBillingDate: '2026-06-01T00:00:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/settings/billing?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/settings/billing",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
billing = resp.json()["data"]
pct = round(billing["apiCallsUsed"] / billing["apiCallsLimit"] * 100, 1)
print(f"Plan: {billing['plan']} ({billing['billingCycle']})")
print(f"API calls: {billing['apiCallsUsed']:,} / {billing['apiCallsLimit']:,} ({pct}%)")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/settings/billing?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: billing } = await resp.json();
console.log(\`Plan: \${billing.plan}, API calls: \${billing.apiCallsUsed.toLocaleString()}\`);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/settings/billing?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // NOTIFICATIONS
  // =========================================================================
  {
    id: 'list-notifications',
    method: 'GET',
    path: '/api/v1/dashboard/notifications',
    title: 'List Notifications',
    description:
      'Returns a paginated list of notifications for the current user. Supports filtering by read status, priority, and notification type.',
    tag: 'notifications',
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
        name: 'isRead',
        type: 'query',
        required: false,
        dataType: 'boolean',
        description: 'Filter by read status',
      },
      {
        name: 'priority',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by priority: low, medium, high, urgent',
      },
      {
        name: 'type',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Filter by type: ews_alert, campaign_milestone, application_status, report_ready, system_update, compliance_flag',
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
        description: 'Items per page',
      },
    ],
    responseExample: {
      success: true,
      data: [
        {
          id: 'notif_01',
          type: 'ews_alert',
          priority: 'high',
          title: 'Critical EWS Alert',
          message: 'Metro Auto Parts Inc has a payment 60+ days past due',
          actionUrl: '/risk/ews/ews_02ALERT002',
          actionLabel: 'View Alert',
          isRead: false,
          createdAt: '2026-02-16T08:00:00.000Z',
        },
        {
          id: 'notif_02',
          type: 'report_ready',
          priority: 'low',
          title: 'Compliance Report Ready',
          message: 'Your Q1 compliance audit report is ready for download',
          actionUrl: '/reports/rpt_01RPT001',
          actionLabel: 'Download Report',
          isRead: true,
          readAt: '2026-02-16T09:00:00.000Z',
          createdAt: '2026-02-16T07:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 34,
        totalPages: 2,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/notifications?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&isRead=false&priority=high" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/notifications",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "isRead": "false",
        "priority": "high",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for n in resp.json()["data"]:
    print(f"[{n['priority'].upper()}] {n['title']}: {n['message']}")`,
      node: `const params = new URLSearchParams({
  portfolioId: "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
  isRead: "false",
  priority: "high",
});
const resp = await fetch(\`${API_BASE}/dashboard/notifications?\${params}\`, {
  headers: { "X-API-Key": "sk_test_your_key_here" },
});
const { data: notifications } = await resp.json();
notifications.forEach((n) => console.log(\`[\${n.priority}] \${n.title}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/notifications", nil)
q := req.URL.Query()
q.Add("portfolioId", "33ae8a27-8718-4a96-8cd5-f472de6a77ee")
q.Add("isRead", "false")
q.Add("priority", "high")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'mark-notification-read',
    method: 'PATCH',
    path: '/api/v1/dashboard/notifications/:id/read',
    title: 'Mark Notification as Read',
    description:
      'Marks a single notification as read. Returns the updated notification object.',
    tag: 'notifications',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Notification ID',
      },
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the notification belongs to',
      },
    ],
    responseExample: {
      success: true,
      data: {
        id: 'notif_01',
        type: 'ews_alert',
        priority: 'high',
        title: 'Critical EWS Alert',
        isRead: true,
        readAt: '2026-02-16T10:00:00.000Z',
        createdAt: '2026-02-16T08:00:00.000Z',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X PATCH "${API_BASE}/dashboard/notifications/notif_01/read?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.patch(
    "${API_BASE}/dashboard/notifications/notif_01/read",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
print(resp.json()["data"]["readAt"])`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/notifications/notif_01/read?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  {
    method: "PATCH",
    headers: { "X-API-Key": "sk_test_your_key_here" },
  }
);
const { data } = await resp.json();
console.log("Read at:", data.readAt);`,
      go: `req, _ := http.NewRequest("PATCH", "${API_BASE}/dashboard/notifications/notif_01/read?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // ANALYTICS (additional endpoints)
  // =========================================================================
  {
    id: 'analytics-kpis',
    method: 'GET',
    path: '/api/v1/dashboard/analytics/kpis',
    title: 'Get Portfolio KPIs',
    description:
      'Returns key performance indicators for the portfolio including total businesses, exposure, average scores, qualification rates, and trend indicators with optional time window filtering.',
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
        name: 'timeWindow',
        type: 'query',
        required: false,
        dataType: 'string',
        description: 'Time window: 7d, 30d, 90d, 1y, all',
      },
    ],
    responseExample: {
      success: true,
      data: [
        { label: 'Total Businesses', value: 6000000, format: 'number', trend: { direction: 'up', value: 4.5 }, status: 'positive' },
        { label: 'Total Exposure', value: 650000000000, format: 'currency', trend: { direction: 'up', value: 3.2 }, status: 'positive' },
        { label: 'Avg Credit Score', value: 71.4, format: 'score', trend: { direction: 'up', value: 1.2 }, status: 'positive' },
        { label: 'Pre-Qualified Rate', value: 67.0, format: 'percent', trend: { direction: 'stable', value: 0.1 }, status: 'neutral' },
        { label: 'At-Risk Rate', value: 13.0, format: 'percent', trend: { direction: 'down', value: -0.8 }, status: 'positive' },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/analytics/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&timeWindow=30d" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/analytics/kpis",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "timeWindow": "30d",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for kpi in resp.json()["data"]:
    arrow = "+" if kpi["trend"]["direction"] == "up" else "-" if kpi["trend"]["direction"] == "down" else "="
    print(f"{kpi['label']}: {kpi['value']} ({arrow}{kpi['trend']['value']}%)")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/analytics/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&timeWindow=30d\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: kpis } = await resp.json();
kpis.forEach((k) => console.log(\`\${k.label}: \${k.value}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/analytics/kpis?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&timeWindow=30d", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'analytics-segments',
    method: 'GET',
    path: '/api/v1/dashboard/analytics/segments',
    title: 'Get Industry Segments',
    description:
      'Returns industry segment breakdown for the portfolio showing business count, total exposure, qualification rate, average score, and risk distribution per industry.',
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
      data: [
        {
          id: 'seg_retail',
          name: 'Retail',
          businessCount: 1340000,
          totalExposure: 145000000000,
          qualRate: 64.2,
          avgScore: 68.5,
          highRiskPct: 15.3,
          trend: { direction: 'stable', value: 0.2 },
        },
        {
          id: 'seg_healthcare',
          name: 'Healthcare',
          businessCount: 900000,
          totalExposure: 98000000000,
          qualRate: 72.1,
          avgScore: 74.1,
          highRiskPct: 8.7,
          trend: { direction: 'up', value: 2.1 },
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/analytics/segments?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/analytics/segments",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for seg in resp.json()["data"]:
    print(f"{seg['name']}: {seg['businessCount']:,} businesses, avg score {seg['avgScore']}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/analytics/segments?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: segments } = await resp.json();
segments.forEach((s) => console.log(\`\${s.name}: \${s.businessCount.toLocaleString()}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/analytics/segments?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'analytics-geography',
    method: 'GET',
    path: '/api/v1/dashboard/analytics/geography',
    title: 'Get Geographic Distribution',
    description:
      'Returns the geographic distribution of businesses across regions with exposure, average scores, and qualification rates per region.',
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
      data: [
        { region: 'West', states: ['CA', 'OR', 'WA', 'NV', 'AZ'], businessCount: 1500000, exposure: 162500000000, avgScore: 72.3, qualRate: 68.4 },
        { region: 'South', states: ['TX', 'FL', 'GA', 'NC', 'VA'], businessCount: 1800000, exposure: 195000000000, avgScore: 69.8, qualRate: 65.1 },
        { region: 'Northeast', states: ['NY', 'NJ', 'PA', 'MA', 'CT'], businessCount: 1200000, exposure: 130000000000, avgScore: 73.1, qualRate: 70.2 },
        { region: 'Midwest', states: ['OH', 'IL', 'MI', 'MN', 'WI'], businessCount: 1500000, exposure: 162500000000, avgScore: 71.0, qualRate: 67.5 },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/analytics/geography?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/analytics/geography",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
for geo in resp.json()["data"]:
    print(f"{geo['region']}: {geo['businessCount']:,} businesses across {', '.join(geo.get('states', []))}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/analytics/geography?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: geo } = await resp.json();
geo.forEach((g) => console.log(\`\${g.region}: \${g.businessCount.toLocaleString()}\`));`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/analytics/geography?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },
  {
    id: 'analytics-score-migration',
    method: 'GET',
    path: '/api/v1/dashboard/analytics/score-migration',
    title: 'Get Score Migration Matrix',
    description:
      'Returns a score migration matrix showing how businesses have moved between credit score bands over a specified period. Critical for monitoring portfolio credit quality trends.',
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
        description: 'Migration period: 30d, 90d, 1y (default: 90d)',
      },
    ],
    responseExample: {
      success: true,
      data: {
        period: '90d',
        bands: ['0-20', '21-40', '41-60', '61-80', '81-100'],
        cells: [
          { fromBand: '61-80', toBand: '81-100', count: 180000, percent: 6.7, direction: 'upgrade' },
          { fromBand: '61-80', toBand: '61-80', count: 2340000, percent: 86.7, direction: 'stable' },
          { fromBand: '61-80', toBand: '41-60', count: 180000, percent: 6.7, direction: 'downgrade' },
        ],
        summary: {
          upgradedPercent: 12.4,
          downgradedPercent: 8.1,
          stablePercent: 79.5,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/analytics/score-migration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&period=90d" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/analytics/score-migration",
    params={
        "portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee",
        "period": "90d",
    },
    headers={"X-API-Key": "sk_test_your_key_here"}
)
data = resp.json()["data"]
s = data["summary"]
print(f"Upgraded: {s['upgradedPercent']}%, Stable: {s['stablePercent']}%, Downgraded: {s['downgradedPercent']}%")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/analytics/score-migration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&period=90d\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data } = await resp.json();
const s = data.summary;
console.log(\`Upgraded: \${s.upgradedPercent}%, Stable: \${s.stablePercent}%\`);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/analytics/score-migration?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&period=90d", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // SCORES (additional endpoints)
  // =========================================================================
  {
    id: 'score-bureau-status',
    method: 'GET',
    path: '/api/v1/dashboard/scores/bureau-status/:smbEntityId',
    title: 'Get Multi-Bureau Status',
    description:
      'Returns the credit score status across all bureaus for a specific business entity. Shows the latest score from each bureau (Dun & Bradstreet, Experian Business, Equifax Business, FICO SBSS, Internal) along with last pull date and status.',
    tag: 'scores',
    auth: ['api-key', 'jwt'],
    params: [
      {
        name: 'smbEntityId',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'Business entity ID',
      },
      {
        name: 'portfolioId',
        type: 'query',
        required: true,
        dataType: 'string (UUID)',
        description: 'Portfolio the entity belongs to',
      },
    ],
    responseExample: {
      success: true,
      data: {
        dun_bradstreet: { score: 82, lastPulled: '2026-02-10T10:00:00.000Z', status: 'current' },
        experian_biz: { score: 76, lastPulled: '2026-02-08T10:00:00.000Z', status: 'current' },
        equifax_biz: { score: null, lastPulled: null, status: 'not_pulled' },
        internal: { score: 78, lastPulled: '2026-02-14T10:00:00.000Z', status: 'current' },
        fico_sbss: { score: 185, lastPulled: '2026-01-20T10:00:00.000Z', status: 'stale' },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/scores/bureau-status/biz_01HQ3V7K8M2N4P5R6S7T8U9V0W?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

biz_id = "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W"
resp = requests.get(
    f"${API_BASE}/dashboard/scores/bureau-status/{biz_id}",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
bureaus = resp.json()["data"]
for bureau, info in bureaus.items():
    score = info.get("score") or "N/A"
    print(f"{bureau}: {score} [{info['status']}]")`,
      node: `const bizId = "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W";
const resp = await fetch(
  \`${API_BASE}/dashboard/scores/bureau-status/\${bizId}?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: bureaus } = await resp.json();
Object.entries(bureaus).forEach(([bureau, info]) =>
  console.log(\`\${bureau}: \${info.score ?? "N/A"} [\${info.status}]\`)
);`,
      go: `bizID := "biz_01HQ3V7K8M2N4P5R6S7T8U9V0W"
url := fmt.Sprintf("${API_BASE}/dashboard/scores/bureau-status/%s?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", bizID)
req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // BUSINESSES (additional endpoints)
  // =========================================================================
  {
    id: 'customer-lifecycle',
    method: 'GET',
    path: '/api/v1/dashboard/customers/lifecycle',
    title: 'Get Lifecycle Distribution',
    description:
      'Returns the distribution of businesses across relationship lifecycle stages: prospect, new, growing, mature, and at_risk. Useful for pipeline and retention analysis.',
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
    ],
    responseExample: {
      success: true,
      data: {
        prospect: 1200000,
        new: 900000,
        growing: 1800000,
        mature: 1500000,
        at_risk: 600000,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/dashboard/customers/lifecycle?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/dashboard/customers/lifecycle",
    params={"portfolioId": "33ae8a27-8718-4a96-8cd5-f472de6a77ee"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
stages = resp.json()["data"]
for stage, count in stages.items():
    print(f"{stage}: {count:,}")`,
      node: `const resp = await fetch(
  \`${API_BASE}/dashboard/customers/lifecycle?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: stages } = await resp.json();
Object.entries(stages).forEach(([stage, count]) =>
  console.log(\`\${stage}: \${Number(count).toLocaleString()}\`)
);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/dashboard/customers/lifecycle?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
  },

  // =========================================================================
  // API KEYS (additional endpoints)
  // =========================================================================
  {
    id: 'api-key-usage',
    method: 'GET',
    path: '/api/v1/api-keys/:id/usage',
    title: 'Get API Key Usage',
    description:
      'Returns usage statistics for a specific API key including total calls, success/failure counts, average latency, and top endpoints by call volume.',
    tag: 'api-keys',
    auth: ['api-key'],
    params: [
      {
        name: 'id',
        type: 'path',
        required: true,
        dataType: 'string',
        description: 'API key ID',
      },
      {
        name: 'startDate',
        type: 'query',
        required: false,
        dataType: 'string (ISO 8601)',
        description: 'Start of date range',
      },
      {
        name: 'endDate',
        type: 'query',
        required: false,
        dataType: 'string (ISO 8601)',
        description: 'End of date range',
      },
    ],
    responseExample: {
      success: true,
      data: {
        keyId: 'key_01AK001',
        totalCalls: 245000,
        successfulCalls: 241500,
        failedCalls: 3500,
        avgLatencyMs: 142,
        topEndpoints: [
          { endpoint: '/dashboard/customers', count: 85000 },
          { endpoint: '/dashboard/scores', count: 62000 },
          { endpoint: '/dashboard/risk/summary', count: 45000 },
        ],
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-16T10:00:00.000Z',
      },
    },
    codeExamples: {
      curl: `curl -X GET "${API_BASE}/api-keys/key_01AK001/usage?startDate=2026-02-01" \\
  -H "X-API-Key: sk_test_your_key_here"`,
      python: `import requests

resp = requests.get(
    "${API_BASE}/api-keys/key_01AK001/usage",
    params={"startDate": "2026-02-01"},
    headers={"X-API-Key": "sk_test_your_key_here"}
)
usage = resp.json()["data"]
pct = round(usage["successfulCalls"] / usage["totalCalls"] * 100, 1)
print(f"Total calls: {usage['totalCalls']:,} ({pct}% success)")
print(f"Avg latency: {usage['avgLatencyMs']}ms")`,
      node: `const resp = await fetch(
  \`${API_BASE}/api-keys/key_01AK001/usage?startDate=2026-02-01\`,
  { headers: { "X-API-Key": "sk_test_your_key_here" } }
);
const { data: usage } = await resp.json();
console.log(\`Total: \${usage.totalCalls.toLocaleString()}, Avg latency: \${usage.avgLatencyMs}ms\`);`,
      go: `req, _ := http.NewRequest("GET", "${API_BASE}/api-keys/key_01AK001/usage?startDate=2026-02-01", nil)
req.Header.Set("X-API-Key", "sk_test_your_key_here")
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
  { id: 'batch', label: 'Batch', icon: 'layers' },
  { id: 'audit', label: 'Audit', icon: 'scroll-text' },
  { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
  { id: 'compliance', label: 'Compliance', icon: 'shield-check' },
  { id: 'reports', label: 'Reports', icon: 'file-bar-chart' },
  { id: 'products', label: 'Products', icon: 'package' },
  { id: 'campaigns', label: 'Campaigns', icon: 'megaphone' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
] as const;

export type EndpointTagId = (typeof endpointTags)[number]['id'];
