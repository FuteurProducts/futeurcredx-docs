// =============================================================================
// Lumiq Developer Docs — FAQ (15+ items across 5 categories)
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  relatedEndpoints?: string[];
  codeSnippet?: string;
}

export type FaqCategory =
  | 'getting-started'
  | 'authentication'
  | 'data'
  | 'technical'
  | 'billing';

export interface FaqCategoryMeta {
  id: FaqCategory;
  label: string;
  description: string;
  icon: string;
}

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

export const faqCategories: FaqCategoryMeta[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    description: 'How to sign up, get your API key, and make your first call.',
    icon: 'rocket',
  },
  {
    id: 'authentication',
    label: 'Authentication',
    description: 'API keys, JWT tokens, and security best practices.',
    icon: 'shield-check',
  },
  {
    id: 'data',
    label: 'Data & Portfolios',
    description: 'Understanding portfolios, business data, and credit scores.',
    icon: 'database',
  },
  {
    id: 'technical',
    label: 'Technical',
    description: 'Rate limits, pagination, error handling, and integration patterns.',
    icon: 'code-2',
  },
  {
    id: 'billing',
    label: 'Billing & Plans',
    description: 'Pricing, usage limits, and plan upgrades.',
    icon: 'credit-card',
  },
];

// ---------------------------------------------------------------------------
// FAQ Items
// ---------------------------------------------------------------------------

export const faqItems: FaqItem[] = [
  // =========================================================================
  // GETTING STARTED
  // =========================================================================
  {
    id: 'gs-1',
    question: 'How do I get a sandbox API key?',
    answer:
      'Sign up at sandbox.futeurcredx.com and navigate to the Partner Portal. Under the "API Keys" tab, click "Create New Key" to generate a sandbox key. Sandbox keys always start with the prefix sk_test_. The full key is only shown once at creation time, so store it securely. You can create up to 10 keys per tenant.',
    category: 'getting-started',
    relatedEndpoints: ['create-api-key', 'list-api-keys'],
  },
  {
    id: 'gs-2',
    question: 'What is the base URL for the API?',
    answer:
      'The sandbox API base URL is https://api.sandbox.futeurcredx.com/api/v1. All endpoint paths documented in the reference are relative to this base. For production, the base URL is https://api.futeurcredx.com/api/v1 (available after onboarding).',
    category: 'getting-started',
  },
  {
    id: 'gs-3',
    question: 'What is the fastest way to test the API?',
    answer:
      'Follow the 5-step quickstart guide. You can verify connectivity in under 30 seconds: call GET /dashboard/health with your API key in the X-API-Key header. If you get {"data":{"status":"ok"}}, you are connected. From there, list portfolios, get a summary, and browse businesses -- all within 3 minutes.',
    category: 'getting-started',
    relatedEndpoints: ['health-check', 'list-portfolios'],
  },

  // =========================================================================
  // AUTHENTICATION
  // =========================================================================
  {
    id: 'auth-1',
    question: 'What authentication methods are supported?',
    answer:
      'The API supports two authentication methods: (1) API Key -- pass your key in the X-API-Key header. This is the primary method for server-to-server integrations. (2) JWT Bearer Token -- pass a JWT in the Authorization: Bearer <token> header. This is used for browser-based flows after Clerk authentication. When both are present, X-API-Key takes precedence.',
    category: 'authentication',
    codeSnippet: `# API Key authentication
curl -H "X-API-Key: sk_test_your_key_here" \\
  https://api.sandbox.futeurcredx.com/api/v1/dashboard/health

# JWT Bearer authentication
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \\
  https://api.sandbox.futeurcredx.com/api/v1/dashboard/health`,
  },
  {
    id: 'auth-2',
    question: 'Can I use my sandbox key in production?',
    answer:
      'No. Sandbox keys (sk_test_*) only work against the sandbox environment. Production keys (sk_live_*) are issued during the production onboarding process and are tied to your production tenant. Attempting to use a sandbox key against production endpoints will return a 401 Unauthorized error.',
    category: 'authentication',
  },
  {
    id: 'auth-3',
    question: 'What happens if my API key is compromised?',
    answer:
      'Immediately revoke the compromised key using DELETE /api-keys/:id and create a new one. Revocation is instant -- any in-flight requests with the old key will receive 401 errors. We recommend rotating keys periodically (e.g., every 90 days) as a best practice. Enable webhook notifications for key usage anomalies to detect compromise early.',
    category: 'authentication',
    relatedEndpoints: ['delete-api-key', 'create-api-key'],
  },
  {
    id: 'auth-4',
    question: 'How many API keys can I create?',
    answer:
      'Each tenant can create up to 10 API keys. This limit applies across all environments (development and production). If you need more, contact support. Use separate keys for different services or environments so you can revoke individually without disrupting other integrations.',
    category: 'authentication',
    relatedEndpoints: ['list-api-keys', 'create-api-key'],
  },

  // =========================================================================
  // DATA & PORTFOLIOS
  // =========================================================================
  {
    id: 'data-1',
    question: 'What is a portfolio?',
    answer:
      'A portfolio is a logical grouping of businesses (SMB customers) that represents a specific book of business. For example, a bank might have separate portfolios for different regions or business lines. Almost every API call requires a portfolioId parameter to scope the query. Your API key determines which portfolios you can access.',
    category: 'data',
    relatedEndpoints: ['list-portfolios', 'portfolio-summary'],
  },
  {
    id: 'data-2',
    question: 'How often is the data updated?',
    answer:
      'In the sandbox environment, data is refreshed daily. Credit scores are recalculated nightly based on the latest financial signals. The meta.lastUpdated field in every response tells you exactly when the underlying data was last refreshed. In production, data updates are near real-time (within 15 minutes of signal ingestion).',
    category: 'data',
  },
  {
    id: 'data-3',
    question: 'What is the Lumiq credit score range?',
    answer:
      'The Lumiq SMB Credit Score is a proprietary composite score ranging from 0 to 100. Higher scores indicate better creditworthiness. The score is derived from multiple data sources including financial statements, payment history, industry benchmarks, and macroeconomic indicators. Risk tiers map to ranges: 80-100 = low risk, 60-79 = medium risk, 40-59 = high risk, 0-39 = critical risk.',
    category: 'data',
    relatedEndpoints: ['list-scores', 'score-distribution'],
  },
  {
    id: 'data-4',
    question: 'Is the sandbox data real?',
    answer:
      'No. Sandbox data is synthetic but statistically realistic. It is modeled after real-world SMB lending patterns to provide a representative development experience. Business names, addresses, and financial data are all generated. You should not use sandbox data for any real business decisions. The sandbox contains data for 4 bank tenants: Chase (6M businesses), Wells Fargo (4.2M), Santander (1.8M), and Citi (3.5M).',
    category: 'data',
  },

  // =========================================================================
  // TECHNICAL
  // =========================================================================
  {
    id: 'tech-1',
    question: 'What are the rate limits?',
    answer:
      'Sandbox: 100 requests per minute per API key, 10,000 requests per day, 10 concurrent connections. Production: 1,000 requests per minute, 1,000,000 per day, 100 concurrent connections. When you exceed the limit, you receive a 429 response with a Retry-After header indicating how many seconds to wait. Implement exponential backoff with jitter for best results.',
    category: 'technical',
  },
  {
    id: 'tech-2',
    question: 'How does pagination work?',
    answer:
      'List endpoints support cursor-based pagination via page (1-indexed) and pageSize (default 20, max 100) query parameters. The response meta includes page, pageSize, total, and totalPages. To iterate, increment the page parameter until page > totalPages. The total count reflects the full dataset matching your filters, not just the current page.',
    category: 'technical',
    codeSnippet: `# Fetch page 3 with 50 items per page
curl -X GET "https://api.sandbox.futeurcredx.com/api/v1/dashboard/customers\\
?portfolioId=33ae8a27-...&page=3&pageSize=50" \\
  -H "X-API-Key: sk_test_your_key_here"

# Response meta:
# { "page": 3, "pageSize": 50, "total": 6000000, "totalPages": 120000 }`,
  },
  {
    id: 'tech-3',
    question: 'How should I handle errors?',
    answer:
      'All error responses follow the standard envelope: { success: false, data: null, error: { code, message, details? }, meta: { requestId } }. Use the error.code field for programmatic handling (e.g., switch on UNAUTHORIZED, NOT_FOUND, RATE_LIMITED). Always log the meta.requestId for debugging. For 429 errors, respect the Retry-After header. For 500 errors, retry with exponential backoff but do not retry non-idempotent requests (POST, DELETE) without confirming the original did not succeed.',
    category: 'technical',
  },
  {
    id: 'tech-4',
    question: 'Does the API support webhooks?',
    answer:
      'Yes. You can subscribe to events like score.updated, application.approved, application.declined, risk.alert, and report.completed. Create a subscription via POST /dashboard/webhooks with your HTTPS endpoint URL and desired events. Payloads are signed with HMAC-SHA256 using a shared secret (auto-generated or provided at creation). Verify the X-Lumiq-Signature header to authenticate webhook deliveries.',
    category: 'technical',
    relatedEndpoints: ['list-webhooks', 'create-webhook'],
  },
  {
    id: 'tech-5',
    question: 'What content type does the API use?',
    answer:
      'All responses are application/json. For POST/PUT/PATCH requests with a body, set Content-Type: application/json. GET and DELETE requests do not require a content type header. The API does not support XML, form-encoded, or multipart requests.',
    category: 'technical',
  },

  // =========================================================================
  // BILLING
  // =========================================================================
  {
    id: 'billing-1',
    question: 'Is the sandbox free?',
    answer:
      'Yes. The sandbox environment is completely free with no time limit. You can make up to 10,000 API calls per day with your sandbox key. This is sufficient for development, testing, and proof-of-concept work. There is no credit card required to access the sandbox.',
    category: 'billing',
  },
  {
    id: 'billing-2',
    question: 'What are the production pricing tiers?',
    answer:
      'Production pricing is usage-based with three tiers: Starter (up to 50K API calls/month), Growth (up to 500K calls/month), and Enterprise (custom volume). All tiers include real-time data, webhook support, and SLA guarantees. Contact sales@futeurcredx.com for detailed pricing and custom enterprise agreements.',
    category: 'billing',
  },
  {
    id: 'billing-3',
    question: 'How do I upgrade from sandbox to production?',
    answer:
      'Contact your account manager or email onboarding@futeurcredx.com to start the production onboarding process. You will need to: (1) Complete KYB verification for your organization, (2) Sign the data processing agreement, (3) Provide production webhook URLs, (4) Receive production API keys (sk_live_*). The typical onboarding timeline is 5-10 business days.',
    category: 'billing',
  },
];

// ---------------------------------------------------------------------------
// Derived exports
// ---------------------------------------------------------------------------

export const faqByCategory = faqItems.reduce<Record<FaqCategory, FaqItem[]>>(
  (acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  },
  {
    'getting-started': [],
    authentication: [],
    data: [],
    technical: [],
    billing: [],
  }
);

/** Total FAQ count */
export const faqCount = faqItems.length;
