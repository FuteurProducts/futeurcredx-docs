import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { CodeBlock } from '@/docs/components/api/CodeBlock';
import { Callout } from '@/docs/components/shared/Callout';
import { StepList } from '@/docs/components/shared/StepList';
import { quickstartSteps } from '@/docs/data/quickstart';

const installExamples: Record<string, string> = {
  curl: '# curl is pre-installed on macOS and Linux\ncurl --version',
  python: 'pip install requests',
  node: 'npm install node-fetch',
};

const authExamples: Record<string, string> = {
  curl: `curl -H "X-API-Key: sk_test_YOUR_KEY" \\
  https://api.sandbox.futeurcredx.com/api/v1/health`,
  python: `import requests

headers = {"X-API-Key": "sk_test_YOUR_KEY"}
response = requests.get(
    "https://api.sandbox.futeurcredx.com/api/v1/health",
    headers=headers,
)
print(response.json())`,
  node: `const response = await fetch(
  "https://api.sandbox.futeurcredx.com/api/v1/health",
  {
    headers: { "X-API-Key": "sk_test_YOUR_KEY" },
  }
);
const data = await response.json();
console.log(data);`,
};

const listBusinessesExamples: Record<string, string> = {
  curl: `curl -H "X-API-Key: sk_test_YOUR_KEY" \\
  -H "X-Portfolio-Id: portfolio_chase_001" \\
  "https://api.sandbox.futeurcredx.com/api/v1/customers?limit=5"`,
  python: `import requests

headers = {
    "X-API-Key": "sk_test_YOUR_KEY",
    "X-Portfolio-Id": "portfolio_chase_001",
}
response = requests.get(
    "https://api.sandbox.futeurcredx.com/api/v1/customers",
    headers=headers,
    params={"limit": 5},
)
businesses = response.json()
print(f"Found {len(businesses['data'])} businesses")`,
  node: `const response = await fetch(
  "https://api.sandbox.futeurcredx.com/api/v1/customers?limit=5",
  {
    headers: {
      "X-API-Key": "sk_test_YOUR_KEY",
      "X-Portfolio-Id": "portfolio_chase_001",
    },
  }
);
const { data } = await response.json();
console.log(\`Found \${data.length} businesses\`);`,
};

const creditScoreExamples: Record<string, string> = {
  curl: `curl -H "X-API-Key: sk_test_YOUR_KEY" \\
  -H "X-Portfolio-Id: portfolio_chase_001" \\
  "https://api.sandbox.futeurcredx.com/api/v1/customers/biz_001/credit-score"`,
  python: `response = requests.get(
    "https://api.sandbox.futeurcredx.com/api/v1/customers/biz_001/credit-score",
    headers=headers,
)
score = response.json()["data"]
print(f"Credit Score: {score['score']} ({score['trend']})")`,
  node: `const scoreRes = await fetch(
  "https://api.sandbox.futeurcredx.com/api/v1/customers/biz_001/credit-score",
  {
    headers: {
      "X-API-Key": "sk_test_YOUR_KEY",
      "X-Portfolio-Id": "portfolio_chase_001",
    },
  }
);
const { data: score } = await scoreRes.json();
console.log(\`Credit Score: \${score.score} (\${score.trend})\`);`,
};

const healthResponse = JSON.stringify(
  {
    status: 'ok',
    version: '1.0.0',
    environment: 'sandbox',
    timestamp: '2026-02-15T12:00:00.000Z',
  },
  null,
  2,
);

const businessesResponse = JSON.stringify(
  {
    data: [
      {
        id: 'biz_001',
        name: 'Acme Supply Co',
        industry: 'Manufacturing',
        creditScore: 742,
        riskTier: 'low',
      },
    ],
    meta: { total: 1243, page: 1, limit: 5 },
  },
  null,
  2,
);

const creditScoreResponse = JSON.stringify(
  {
    data: {
      businessId: 'biz_001',
      score: 742,
      previousScore: 728,
      trend: 'improving',
      factors: [
        'Strong payment history',
        'Low credit utilization',
        'Established business age',
      ],
      updatedAt: '2026-02-14T08:30:00.000Z',
    },
  },
  null,
  2,
);

export default function Quickstart() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Quickstart
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Get your first API call running in under 5 minutes.
        </p>
      </div>

      {/* Prerequisites */}
      <Callout type="info" title="Prerequisites">
        You need a LumiqAI sandbox account. Sign up for free at{' '}
        <a
          href="https://sandbox.futeurcredx.com"
          className="font-medium text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          sandbox.futeurcredx.com
        </a>{' '}
        to get your API key. No credit card required.
      </Callout>

      {/* Steps */}
      <StepList
        steps={quickstartSteps.map((qs) => ({
          ...qs,
          children: undefined,
        }))}
      />

      {/* Detailed Walkthrough */}
      <div className="space-y-12">
        {/* Step 1: Install */}
        <section id="step-1">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Step 1: Install Dependencies
          </h2>
          <p className="mb-4 text-gray-400">
            Choose your preferred language. The sandbox API uses standard HTTPS
            requests, so any HTTP client will work.
          </p>
          <CodeBlock
            code={installExamples}
            title="Install"
          />
        </section>

        {/* Step 2: Authenticate */}
        <section id="step-2">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Step 2: Authenticate
          </h2>
          <p className="mb-4 text-gray-400">
            All requests require an API key passed via the{' '}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-blue-300">
              X-API-Key
            </code>{' '}
            header. Test connectivity with the health endpoint.
          </p>
          <CodeBlock
            code={authExamples}
            title="Test Authentication"
          />
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Expected Response:
            </p>
            <CodeBlock code={healthResponse} language="json" />
          </div>
        </section>

        {/* Step 3: List Businesses */}
        <section id="step-3">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Step 3: List Businesses
          </h2>
          <p className="mb-4 text-gray-400">
            Fetch businesses from your portfolio. All data endpoints require
            a{' '}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-blue-300">
              X-Portfolio-Id
            </code>{' '}
            header to scope data to the correct tenant.
          </p>
          <CodeBlock
            code={listBusinessesExamples}
            title="List Businesses"
          />
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Expected Response:
            </p>
            <CodeBlock code={businessesResponse} language="json" />
          </div>
        </section>

        {/* Step 4: Get Credit Score */}
        <section id="step-4">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Step 4: Fetch a Credit Score
          </h2>
          <p className="mb-4 text-gray-400">
            Retrieve the credit score for a specific business, including
            historical trend and contributing factors.
          </p>
          <CodeBlock
            code={creditScoreExamples}
            title="Get Credit Score"
          />
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Expected Response:
            </p>
            <CodeBlock code={creditScoreResponse} language="json" />
          </div>
        </section>
      </div>

      {/* Next Steps */}
      <Callout type="tip" title="Next Steps">
        You have successfully made your first API calls. Now explore the full{' '}
        <Link
          to="/api-reference"
          className="font-medium text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400"
        >
          API Reference
        </Link>{' '}
        for all available endpoints, or try the{' '}
        <Link
          to="/sandbox"
          className="font-medium text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400"
        >
          Sandbox
        </Link>{' '}
        to explore data from 4 different bank tenants.
      </Callout>

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          to="/api-reference"
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-3',
            'bg-gradient-to-r from-blue-600 to-indigo-600',
            'text-sm font-semibold text-white shadow-lg shadow-blue-500/25',
            'transition-all duration-200',
            'hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
        >
          Explore the API Reference
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
