import { FlaskConical, Globe, Key, Server, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import { CodeBlock } from '@/docs/components/api/CodeBlock';
import { BankSelector } from '@/docs/components/sandbox/BankSelector';
import { SandboxOverview } from '@/docs/components/sandbox/SandboxOverview';
import { Callout } from '@/docs/components/shared/Callout';

interface ComparisonRow {
  feature: string;
  sandbox: string;
  production: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Base URL',
    sandbox: 'api.sandbox.futeurcredx.com',
    production: 'api.lumiq.futeurcredx.com',
  },
  {
    feature: 'API Key Prefix',
    sandbox: 'sk_test_',
    production: 'sk_live_',
  },
  {
    feature: 'Data',
    sandbox: 'Synthetic',
    production: 'Real',
  },
  {
    feature: 'Rate Limit',
    sandbox: '100 req/min',
    production: 'Plan-based',
  },
  {
    feature: 'Cost',
    sandbox: 'Free',
    production: 'Usage-based',
  },
  {
    feature: 'Webhooks',
    sandbox: 'Simulated',
    production: 'Live',
  },
];

interface TestCredential {
  bank: string;
  portfolioId: string;
  apiKeyPrefix: string;
}

const testCredentials: TestCredential[] = [
  {
    bank: 'Chase',
    portfolioId: 'portfolio_chase_001',
    apiKeyPrefix: 'sk_test_ceO5...1f817afe',
  },
  {
    bank: 'Wells Fargo',
    portfolioId: 'portfolio_wellsfargo_001',
    apiKeyPrefix: 'sk_test_-oL8...e03f728b',
  },
  {
    bank: 'Santander',
    portfolioId: 'portfolio_santander_001',
    apiKeyPrefix: 'sk_test_DBhG...de72b928',
  },
  {
    bank: 'Citi',
    portfolioId: 'portfolio_citi_001',
    apiKeyPrefix: 'sk_test_8DNz...93715101',
  },
];

const sandboxTestExample = `curl -X GET \\
  "https://api.sandbox.futeurcredx.com/api/v1/customers?limit=3" \\
  -H "X-API-Key: sk_test_ceO5...1f817afe" \\
  -H "X-Portfolio-Id: portfolio_chase_001"`;

export default function Sandbox() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      {/* Header */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <FlaskConical className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Sandbox Environment
          </h1>
        </div>
        <p className="text-lg leading-relaxed text-gray-400">
          The LumiqAI sandbox provides a fully-featured environment with
          synthetic data from 4 bank tenants. Build, test, and iterate
          without affecting production data or incurring costs.
        </p>
      </div>

      {/* How it Works */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">How it Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Key,
              title: 'Get an API Key',
              description:
                'Sign up at sandbox.futeurcredx.com and generate a sk_test_ key from the API Settings panel.',
              color: 'text-blue-400',
            },
            {
              icon: Server,
              title: 'Make Requests',
              description:
                'Hit the sandbox base URL with your test key. All endpoints mirror production behavior exactly.',
              color: 'text-emerald-400',
            },
            {
              icon: Globe,
              title: 'Switch Banks',
              description:
                'Change the X-Portfolio-Id header to explore data from Chase, Wells Fargo, Santander, or Citi.',
              color: 'text-purple-400',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-5"
              >
                <Icon className={cn('mb-3 h-5 w-5', item.color)} />
                <h3 className="mb-1.5 text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bank Selector */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Select a Bank Tenant
        </h2>
        <BankSelector />
      </section>

      {/* Bank Data Overview */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Sandbox Data Overview
        </h2>
        <SandboxOverview />
      </section>

      {/* Sandbox vs Production */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Sandbox vs Production
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Feature
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                    Sandbox
                  </span>
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    Production
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {comparisonData.map((row) => (
                <tr key={row.feature}>
                  <td className="px-5 py-3 font-medium text-gray-300">
                    {row.feature}
                  </td>
                  <td className="px-5 py-3">
                    <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
                      {row.sandbox}
                    </code>
                  </td>
                  <td className="px-5 py-3">
                    <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-amber-400">
                      {row.production}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Test Credentials */}
      <section id="test-credentials">
        <h2 className="mb-4 text-xl font-bold text-white">
          Test Credentials
        </h2>
        <Callout type="info" title="Pre-seeded API Keys">
          Each sandbox bank comes with a pre-seeded API key for immediate
          testing. You can also generate additional keys from the dashboard.
        </Callout>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Bank
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Portfolio ID
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  API Key
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {testCredentials.map((cred) => (
                <tr key={cred.bank}>
                  <td className="px-5 py-3 font-medium text-gray-300">
                    {cred.bank}
                  </td>
                  <td className="px-5 py-3">
                    <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-blue-300">
                      {cred.portfolioId}
                    </code>
                  </td>
                  <td className="px-5 py-3">
                    <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-400">
                      {cred.apiKeyPrefix}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <CodeBlock code={sandboxTestExample} language="bash" title="Example Request" />
        </div>
      </section>

      {/* Rate Limits */}
      <section id="rate-limits">
        <h2 className="mb-4 text-xl font-bold text-white">Rate Limits</h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-white">100</p>
              <p className="text-xs text-gray-500">requests per minute</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1,000</p>
              <p className="text-xs text-gray-500">requests per hour</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">10,000</p>
              <p className="text-xs text-gray-500">requests per day</p>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400">
              Rate-limited responses return{' '}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-amber-400">
                429 Too Many Requests
              </code>{' '}
              with a{' '}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-300">
                Retry-After
              </code>{' '}
              header indicating seconds to wait. Implement exponential backoff
              for production integrations.
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <Callout type="warning" title="Sandbox Limitations">
        Sandbox data is refreshed weekly. Entities created or modified during
        testing may be reset. Do not rely on specific IDs persisting across
        weeks. Webhook delivery in sandbox uses simulated endpoints.
      </Callout>
    </div>
  );
}
