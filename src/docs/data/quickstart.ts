// =============================================================================
// Lumiq Developer Docs — Quickstart Guide (5 Steps)
// =============================================================================

const API_BASE = 'https://api.sandbox.futeurcredx.com/api/v1';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuickstartStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  code: {
    curl: string;
    python: string;
    node: string;
    go: string;
  };
  expectedResponse: Record<string, unknown>;
  notes?: string[];
}

export interface QuickstartPrerequisite {
  label: string;
  description: string;
  link?: string;
}

// ---------------------------------------------------------------------------
// Prerequisites
// ---------------------------------------------------------------------------

export const prerequisites: QuickstartPrerequisite[] = [
  {
    label: 'Sandbox API Key',
    description:
      'Sign up at sandbox.futeurcredx.com and generate an API key from the Partner Portal. Keys start with sk_test_.',
    link: 'https://sandbox.futeurcredx.com',
  },
  {
    label: 'HTTP Client',
    description:
      'Any HTTP client works: curl, Postman, or your preferred programming language. Code examples are provided for curl, Python, Node.js, and Go.',
  },
  {
    label: 'JSON Parser',
    description:
      'All API responses are JSON. Install jq for command-line parsing, or use your language\'s built-in JSON parser.',
  },
];

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

export const quickstartSteps: QuickstartStep[] = [
  // Step 1: Verify connectivity
  {
    step: 1,
    title: 'Verify Your API Key',
    description:
      'Start by hitting the health endpoint to confirm your API key is valid and the service is reachable. This endpoint does not require a portfolioId.',
    duration: '30 seconds',
    code: {
      curl: `curl -X GET "${API_BASE}/dashboard/health" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      python: `import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "${API_BASE}"

# Step 1: Check health
resp = requests.get(
    f"{BASE_URL}/dashboard/health",
    headers={"X-API-Key": API_KEY}
)
print(resp.status_code)  # 200
health = resp.json()
print(health["data"]["status"])  # "ok"`,
      node: `const API_KEY = "YOUR_API_KEY";
const BASE_URL = "${API_BASE}";

// Step 1: Check health
const healthResp = await fetch(\`\${BASE_URL}/dashboard/health\`, {
  headers: { "X-API-Key": API_KEY },
});
const health = await healthResp.json();
console.log(health.data.status); // "ok"`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

const (
	apiKey  = "YOUR_API_KEY"
	baseURL = "${API_BASE}"
)

func main() {
	// Step 1: Check health
	req, _ := http.NewRequest("GET", baseURL+"/dashboard/health", nil)
	req.Header.Set("X-API-Key", apiKey)
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    expectedResponse: {
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
    notes: [
      'If you receive a 401 error, double-check your API key is correct and starts with sk_test_.',
      'The health endpoint is the only one that does not require a portfolioId.',
    ],
  },

  // Step 2: Discover portfolios
  {
    step: 2,
    title: 'List Your Portfolios',
    description:
      'Retrieve the portfolios associated with your API key. Each portfolio represents a distinct book of business. You will need the portfolio ID for all subsequent requests.',
    duration: '30 seconds',
    code: {
      curl: `curl -X GET "${API_BASE}/dashboard/portfolios" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      python: `# Step 2: Get portfolios
resp = requests.get(
    f"{BASE_URL}/dashboard/portfolios",
    headers={"X-API-Key": API_KEY}
)
portfolios = resp.json()["data"]
portfolio_id = portfolios[0]["id"]
print(f"Using portfolio: {portfolios[0]['name']} ({portfolio_id})")`,
      node: `// Step 2: Get portfolios
const portfolioResp = await fetch(\`\${BASE_URL}/dashboard/portfolios\`, {
  headers: { "X-API-Key": API_KEY },
});
const { data: portfolios } = await portfolioResp.json();
const portfolioId = portfolios[0].id;
console.log(\`Using portfolio: \${portfolios[0].name} (\${portfolioId})\`);`,
      go: `// Step 2: Get portfolios
req, _ = http.NewRequest("GET", baseURL+"/dashboard/portfolios", nil)
req.Header.Set("X-API-Key", apiKey)
resp, _ = http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ = io.ReadAll(resp.Body)
fmt.Println(string(body))
// Parse the first portfolio ID from the response`,
    },
    expectedResponse: {
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
    notes: [
      'Save the portfolio id value -- you will pass it as a query parameter or path parameter in every subsequent call.',
      'Most sandbox API keys are associated with a single portfolio.',
    ],
  },

  // Step 3: Fetch portfolio summary
  {
    step: 3,
    title: 'Get Portfolio Summary',
    description:
      'Pull the high-level KPIs for your portfolio: total businesses, exposure, credit score distribution, and risk metrics. This gives you an at-a-glance view of the entire book.',
    duration: '30 seconds',
    code: {
      curl: `curl -X GET "${API_BASE}/dashboard/portfolios/33ae8a27-8718-4a96-8cd5-f472de6a77ee/summary" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      python: `# Step 3: Get portfolio summary
resp = requests.get(
    f"{BASE_URL}/dashboard/portfolios/{portfolio_id}/summary",
    headers={"X-API-Key": API_KEY}
)
summary = resp.json()["data"]
print(f"Total businesses: {summary['totalBusinesses']:,}")
print(f"Total exposure: \${summary['totalExposure']:,.0f}")
print(f"Average credit score: {summary['avgCreditScore']}")
print(f"At-risk rate: {summary['atRiskRate']}%")`,
      node: `// Step 3: Get portfolio summary
const summaryResp = await fetch(
  \`\${BASE_URL}/dashboard/portfolios/\${portfolioId}/summary\`,
  { headers: { "X-API-Key": API_KEY } }
);
const { data: summary } = await summaryResp.json();
console.log("Total businesses:", summary.totalBusinesses.toLocaleString());
console.log("Total exposure: $" + summary.totalExposure.toLocaleString());
console.log("Avg credit score:", summary.avgCreditScore);`,
      go: `// Step 3: Get portfolio summary
portfolioID := "33ae8a27-8718-4a96-8cd5-f472de6a77ee"
url := fmt.Sprintf("%s/dashboard/portfolios/%s/summary", baseURL, portfolioID)
req, _ = http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", apiKey)
resp, _ = http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ = io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
    expectedResponse: {
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
    notes: [
      'Replace the portfolio ID in the URL with the one you received in Step 2.',
      'The trend object shows year-over-year growth and non-performing loan rates.',
    ],
  },

  // Step 4: Browse businesses
  {
    step: 4,
    title: 'List Businesses',
    description:
      'Fetch the first page of businesses in your portfolio. The response is paginated (default 20 per page) and supports filtering by industry, risk tier, and search text.',
    duration: '1 minute',
    code: {
      curl: `curl -X GET "${API_BASE}/dashboard/customers?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee&page=1&pageSize=5" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      python: `# Step 4: List businesses
resp = requests.get(
    f"{BASE_URL}/dashboard/customers",
    params={
        "portfolioId": portfolio_id,
        "page": 1,
        "pageSize": 5,
    },
    headers={"X-API-Key": API_KEY}
)
result = resp.json()
businesses = result["data"]
meta = result["meta"]

print(f"Showing {len(businesses)} of {meta['total']:,} businesses")
print(f"Page {meta['page']} of {meta['totalPages']:,}")
print()
for biz in businesses:
    print(f"  {biz['name']}")
    print(f"    Industry: {biz['industry']}")
    print(f"    Score: {biz['creditScore']} | Risk: {biz['riskTier']}")
    print(f"    Revenue: \${biz['annualRevenue']:,}")
    print()`,
      node: `// Step 4: List businesses
const params = new URLSearchParams({
  portfolioId: portfolioId,
  page: "1",
  pageSize: "5",
});
const bizResp = await fetch(\`\${BASE_URL}/dashboard/customers?\${params}\`, {
  headers: { "X-API-Key": API_KEY },
});
const bizResult = await bizResp.json();

console.log(\`Showing \${bizResult.data.length} of \${bizResult.meta.total.toLocaleString()}\`);
bizResult.data.forEach((biz) => {
  console.log(\`  \${biz.name} — Score: \${biz.creditScore}, Risk: \${biz.riskTier}\`);
});`,
      go: `// Step 4: List businesses
req, _ = http.NewRequest("GET", baseURL+"/dashboard/customers", nil)
q := req.URL.Query()
q.Add("portfolioId", portfolioID)
q.Add("page", "1")
q.Add("pageSize", "5")
req.URL.RawQuery = q.Encode()
req.Header.Set("X-API-Key", apiKey)
resp, _ = http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ = io.ReadAll(resp.Body)
fmt.Println(string(body))`,
    },
    expectedResponse: {
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
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 5,
        total: 6000000,
        totalPages: 1200000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    notes: [
      'Use the search parameter for full-text search on business names.',
      'Combine industry and riskTier filters for targeted queries.',
      'Maximum pageSize is 100. Default is 20.',
    ],
  },

  // Step 5: Check score distribution
  {
    step: 5,
    title: 'Analyze Score Distribution',
    description:
      'Retrieve the credit score distribution across the entire portfolio. This histogram shows how businesses are distributed across score ranges, with mean and median values.',
    duration: '30 seconds',
    code: {
      curl: `curl -X GET "${API_BASE}/dashboard/scores/distribution?portfolioId=33ae8a27-8718-4a96-8cd5-f472de6a77ee" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      python: `# Step 5: Score distribution
resp = requests.get(
    f"{BASE_URL}/dashboard/scores/distribution",
    params={"portfolioId": portfolio_id},
    headers={"X-API-Key": API_KEY}
)
dist = resp.json()["data"]

print(f"Portfolio Score Distribution")
print(f"Mean: {dist['mean']} | Median: {dist['median']}")
print()
for r in dist["ranges"]:
    bar = "#" * int(r["percentage"])
    print(f"  {r['min']:>3}-{r['max']:>3}: {bar} {r['count']:>10,} ({r['percentage']}%)")

print()
print("Quickstart complete! Explore the full API reference for more endpoints.")`,
      node: `// Step 5: Score distribution
const distResp = await fetch(
  \`\${BASE_URL}/dashboard/scores/distribution?portfolioId=\${portfolioId}\`,
  { headers: { "X-API-Key": API_KEY } }
);
const { data: dist } = await distResp.json();

console.log("Portfolio Score Distribution");
console.log(\`Mean: \${dist.mean} | Median: \${dist.median}\`);
dist.ranges.forEach((r) => {
  const bar = "#".repeat(Math.round(r.percentage));
  console.log(\`  \${r.min}-\${r.max}: \${bar} \${r.count.toLocaleString()} (\${r.percentage}%)\`);
});

console.log("\\nQuickstart complete! Explore the full API reference for more endpoints.");`,
      go: `// Step 5: Score distribution
url = fmt.Sprintf("%s/dashboard/scores/distribution?portfolioId=%s", baseURL, portfolioID)
req, _ = http.NewRequest("GET", url, nil)
req.Header.Set("X-API-Key", apiKey)
resp, _ = http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ = io.ReadAll(resp.Body)
fmt.Println(string(body))
fmt.Println("\\nQuickstart complete!")`,
    },
    expectedResponse: {
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
    notes: [
      'The Lumiq credit score ranges from 0-100 (proprietary composite).',
      'The 60-80 range typically contains the majority of businesses.',
      'Use the /risk/summary endpoint for deeper risk analysis.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Full-flow code examples (complete scripts)
// ---------------------------------------------------------------------------

export const fullFlowExamples = {
  python: `"""
Lumiq API — Complete Quickstart Script
Run: pip install requests && python quickstart.py
"""
import requests

API_KEY = "YOUR_API_KEY"
BASE = "${API_BASE}"
HEADERS = {"X-API-Key": API_KEY}

# 1. Health check
health = requests.get(f"{BASE}/dashboard/health", headers=HEADERS).json()
assert health["data"]["status"] == "ok", "API is not healthy"
print("1. API is healthy")

# 2. Get portfolios
portfolios = requests.get(f"{BASE}/dashboard/portfolios", headers=HEADERS).json()["data"]
pid = portfolios[0]["id"]
print(f"2. Using portfolio: {portfolios[0]['name']}")

# 3. Portfolio summary
summary = requests.get(f"{BASE}/dashboard/portfolios/{pid}/summary", headers=HEADERS).json()["data"]
print(f"3. {summary['totalBusinesses']:,} businesses, \${summary['totalExposure']:,.0f} exposure")

# 4. First page of businesses
biz = requests.get(f"{BASE}/dashboard/customers", params={"portfolioId": pid, "pageSize": 5}, headers=HEADERS).json()
print(f"4. First {len(biz['data'])} of {biz['meta']['total']:,} businesses:")
for b in biz["data"]:
    print(f"   - {b['name']} (Score: {b['creditScore']}, Risk: {b['riskTier']})")

# 5. Score distribution
dist = requests.get(f"{BASE}/dashboard/scores/distribution", params={"portfolioId": pid}, headers=HEADERS).json()["data"]
print(f"5. Score distribution — Mean: {dist['mean']}, Median: {dist['median']}")
for r in dist["ranges"]:
    print(f"   {r['min']:>3}-{r['max']:>3}: {'#' * int(r['percentage'])} ({r['percentage']}%)")

print("\\nDone! Explore the full API reference at docs.futeurcredx.com")
`,
  node: `/**
 * Lumiq API — Complete Quickstart Script
 * Run: node quickstart.mjs
 * Requires Node.js 18+ (native fetch)
 */
const API_KEY = "YOUR_API_KEY";
const BASE = "${API_BASE}";
const headers = { "X-API-Key": API_KEY };

async function main() {
  // 1. Health check
  const health = await (await fetch(\`\${BASE}/dashboard/health\`, { headers })).json();
  console.log("1. API status:", health.data.status);

  // 2. Get portfolios
  const { data: portfolios } = await (await fetch(\`\${BASE}/dashboard/portfolios\`, { headers })).json();
  const portfolioId = portfolios[0].id;
  console.log(\`2. Using portfolio: \${portfolios[0].name}\`);

  // 3. Portfolio summary
  const { data: summary } = await (
    await fetch(\`\${BASE}/dashboard/portfolios/\${portfolioId}/summary\`, { headers })
  ).json();
  console.log(\`3. \${summary.totalBusinesses.toLocaleString()} businesses, $\${summary.totalExposure.toLocaleString()} exposure\`);

  // 4. First page of businesses
  const params = new URLSearchParams({ portfolioId, pageSize: "5" });
  const bizResult = await (await fetch(\`\${BASE}/dashboard/customers?\${params}\`, { headers })).json();
  console.log(\`4. First \${bizResult.data.length} of \${bizResult.meta.total.toLocaleString()} businesses:\`);
  bizResult.data.forEach((b) =>
    console.log(\`   - \${b.name} (Score: \${b.creditScore}, Risk: \${b.riskTier})\`)
  );

  // 5. Score distribution
  const { data: dist } = await (
    await fetch(\`\${BASE}/dashboard/scores/distribution?portfolioId=\${portfolioId}\`, { headers })
  ).json();
  console.log(\`5. Score distribution — Mean: \${dist.mean}, Median: \${dist.median}\`);
  dist.ranges.forEach((r) =>
    console.log(\`   \${r.min}-\${r.max}: \${"#".repeat(Math.round(r.percentage))} (\${r.percentage}%)\`)
  );

  console.log("\\nDone! Explore the full API reference at docs.futeurcredx.com");
}

main().catch(console.error);
`,
};

/** Estimated total time to complete the quickstart */
export const estimatedTotalTime = '3 minutes';
