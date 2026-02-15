import { ArrowRight, Key, Lock, RotateCcw, Shield, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { CodeBlock } from '@/docs/components/api/CodeBlock';
import { Callout } from '@/docs/components/shared/Callout';

const apiKeyExamples: Record<string, string> = {
  curl: `curl -X GET \\
  "https://api.sandbox.futeurcredx.com/api/v1/customers" \\
  -H "X-API-Key: sk_test_ceO5...1f817afe" \\
  -H "X-Portfolio-Id: portfolio_chase_001"`,
  python: `import requests

headers = {
    "X-API-Key": "sk_test_ceO5...1f817afe",
    "X-Portfolio-Id": "portfolio_chase_001",
}

response = requests.get(
    "https://api.sandbox.futeurcredx.com/api/v1/customers",
    headers=headers,
)`,
  node: `const response = await fetch(
  "https://api.sandbox.futeurcredx.com/api/v1/customers",
  {
    headers: {
      "X-API-Key": "sk_test_ceO5...1f817afe",
      "X-Portfolio-Id": "portfolio_chase_001",
    },
  }
);`,
};

const jwtExample: Record<string, string> = {
  curl: `curl -X GET \\
  "https://api.sandbox.futeurcredx.com/api/v1/customers" \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \\
  -H "X-Portfolio-Id: portfolio_chase_001"`,
  python: `import requests

headers = {
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIs...",
    "X-Portfolio-Id": "portfolio_chase_001",
}

response = requests.get(
    "https://api.sandbox.futeurcredx.com/api/v1/customers",
    headers=headers,
)`,
  node: `const response = await fetch(
  "https://api.sandbox.futeurcredx.com/api/v1/customers",
  {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIs...",
      "X-Portfolio-Id": "portfolio_chase_001",
    },
  }
);`,
};

interface LifecycleStep {
  icon: typeof Key;
  title: string;
  description: string;
  iconColor: string;
}

const lifecycleSteps: LifecycleStep[] = [
  {
    icon: Key,
    title: 'Create',
    description:
      'Generate a new API key from the dashboard Settings > API Keys panel. Keys are scoped to a specific portfolio.',
    iconColor: 'text-blue-400',
  },
  {
    icon: Shield,
    title: 'Use',
    description:
      'Pass the key in the X-API-Key header with every request. Store keys in environment variables, never in source code.',
    iconColor: 'text-emerald-400',
  },
  {
    icon: RotateCcw,
    title: 'Rotate',
    description:
      'Create a new key, update your applications, then revoke the old key. We recommend rotating keys every 90 days.',
    iconColor: 'text-amber-400',
  },
  {
    icon: Trash2,
    title: 'Revoke',
    description:
      'Revoked keys are immediately invalidated and cannot be restored. Any requests using a revoked key will return 401.',
    iconColor: 'text-red-400',
  },
];

export default function Authentication() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Authentication
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          LumiqAI supports two authentication methods depending on your
          integration pattern.
        </p>
      </div>

      {/* API Key Authentication */}
      <section id="api-key">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <Key className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            API Key Authentication
          </h2>
        </div>

        <p className="mb-4 leading-relaxed text-gray-300">
          API keys are the primary authentication method for server-to-server
          integrations and sandbox development. Each key is tied to a specific
          organization and scoped to a portfolio.
        </p>

        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Header Format
          </h3>
          <code className="block rounded-lg bg-gray-950 px-4 py-2.5 font-mono text-sm text-blue-300">
            X-API-Key: YOUR_API_KEY
          </code>
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Prefix
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Environment
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr>
                <td className="px-5 py-3">
                  <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
                    sk_test_
                  </code>
                </td>
                <td className="px-5 py-3 text-gray-300">Sandbox</td>
                <td className="px-5 py-3 text-gray-400">
                  For development and testing. Uses synthetic data.
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">
                  <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-amber-400">
                    sk_live_
                  </code>
                </td>
                <td className="px-5 py-3 text-gray-300">Production</td>
                <td className="px-5 py-3 text-gray-400">
                  For live integrations. Uses real customer data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock code={apiKeyExamples} title="API Key Usage" />
      </section>

      {/* Key Lifecycle */}
      <section id="key-lifecycle">
        <h2 className="mb-6 text-xl font-bold text-white">
          Key Lifecycle
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {lifecycleSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={cn(
                  'rounded-xl border border-gray-800 bg-gray-900/30 p-5',
                  'transition-all duration-200 hover:border-gray-700',
                )}
              >
                <div className="mb-3 flex items-center gap-3">
                  <Icon className={cn('h-5 w-5', step.iconColor)} />
                  <h3 className="font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* JWT Authentication */}
      <section id="jwt">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/10 p-2">
            <Lock className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            JWT Authentication (Clerk)
          </h2>
        </div>

        <p className="mb-4 leading-relaxed text-gray-300">
          JSON Web Tokens are used for browser-based dashboard access. JWTs are
          issued by Clerk when users authenticate through the LumiqAI dashboard
          and carry organization-scoped claims.
        </p>

        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Header Format
          </h3>
          <code className="block rounded-lg bg-gray-950 px-4 py-2.5 font-mono text-sm text-purple-300">
            Authorization: Bearer YOUR_JWT_TOKEN
          </code>
        </div>

        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">
            How it works with Clerk
          </h3>
          <ol className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="font-mono text-blue-400">1.</span>
              User signs in via Clerk-powered login page
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-blue-400">2.</span>
              Clerk issues a JWT with organization and role claims
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-blue-400">3.</span>
              Dashboard attaches the JWT to all API requests automatically
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-blue-400">4.</span>
              API validates the JWT signature and extracts the portfolio context
            </li>
          </ol>
        </div>

        <CodeBlock code={jwtExample} title="JWT Usage" />
      </section>

      {/* When to use which */}
      <section id="comparison">
        <h2 className="mb-4 text-xl font-bold text-white">
          When to Use Which?
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Use Case
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Recommended
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {[
                ['Server-to-server integration', 'API Key'],
                ['Sandbox / development', 'API Key'],
                ['CI/CD pipeline', 'API Key'],
                ['Browser dashboard', 'JWT (Clerk)'],
                ['Mobile app', 'JWT (Clerk)'],
                ['Webhook verification', 'HMAC-SHA256 Signature'],
              ].map(([useCase, method]) => (
                <tr key={useCase}>
                  <td className="px-5 py-3 text-gray-300">{useCase}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        method === 'API Key'
                          ? 'bg-blue-500/10 text-blue-400'
                          : method === 'JWT (Clerk)'
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-amber-500/10 text-amber-400',
                      )}
                    >
                      {method}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security Best Practices */}
      <section id="security">
        <Callout type="warning" title="Security Best Practices">
          <ul className="mt-2 space-y-2">
            <li className="flex gap-2">
              <span className="text-amber-400">--</span>
              <span>
                <strong className="text-amber-300">Never</strong> expose API
                keys in client-side code, Git repositories, or browser
                JavaScript
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">--</span>
              <span>
                Store keys in environment variables (e.g.,{' '}
                <code className="rounded bg-gray-800 px-1 py-0.5 text-xs text-amber-300">
                  LUMIQ_API_KEY
                </code>
                )
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">--</span>
              <span>
                Rotate keys every 90 days and immediately revoke compromised
                keys
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">--</span>
              <span>
                Use the minimum required scope — sandbox keys for development,
                production keys only when deploying
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">--</span>
              <span>
                Enable IP allowlisting in production to restrict key usage to
                known server addresses
              </span>
            </li>
          </ul>
        </Callout>
      </section>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Link
          to="/docs/api-reference"
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-3',
            'bg-gradient-to-r from-blue-600 to-indigo-600',
            'text-sm font-semibold text-white shadow-lg shadow-blue-500/25',
            'transition-all duration-200',
            'hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
        >
          View API Reference
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
