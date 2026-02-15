import { AlertTriangle, CheckCircle, Link as LinkIcon, ServerCrash, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { CodeBlock } from '@/docs/components/api/CodeBlock';
import { Callout } from '@/docs/components/shared/Callout';
import { httpStatuses, responseEnvelopeFields } from '@/docs/data/errors';

const successEnvelopeExample = JSON.stringify(
  {
    data: {
      id: 'biz_001',
      name: 'Acme Supply Co',
      creditScore: 742,
    },
    meta: {
      requestId: 'req_abc123',
      timestamp: '2026-02-15T12:00:00.000Z',
    },
  },
  null,
  2,
);

const listEnvelopeExample = JSON.stringify(
  {
    data: [
      { id: 'biz_001', name: 'Acme Supply Co' },
      { id: 'biz_002', name: 'Global Trade LLC' },
    ],
    meta: {
      requestId: 'req_def456',
      total: 1243,
      page: 1,
      limit: 20,
      timestamp: '2026-02-15T12:00:00.000Z',
    },
  },
  null,
  2,
);

const errorEnvelopeExample = JSON.stringify(
  {
    error: {
      code: 'INVALID_API_KEY',
      message: 'The provided API key is invalid or has been revoked.',
      details: {
        keyPrefix: 'sk_test_abc...',
        suggestion: 'Generate a new key from the API Settings panel.',
      },
    },
    meta: {
      requestId: 'req_ghi789',
      timestamp: '2026-02-15T12:00:00.000Z',
    },
  },
  null,
  2,
);

interface CommonScenario {
  status: number;
  title: string;
  description: string;
  resolution: string;
  code: string;
}

const commonScenarios: CommonScenario[] = [
  {
    status: 403,
    title: 'Organization context required',
    description:
      'All data endpoints require a valid X-Portfolio-Id header. This error occurs when the header is missing or contains an invalid portfolio ID.',
    resolution:
      'Include the X-Portfolio-Id header in every request. Use the portfolios endpoint to list available portfolio IDs for your organization.',
    code: JSON.stringify(
      {
        error: {
          code: 'PORTFOLIO_REQUIRED',
          message:
            'X-Portfolio-Id header is required for this endpoint.',
          details: {
            suggestion:
              'GET /api/v1/portfolios to list available portfolios.',
          },
        },
        meta: { requestId: 'req_xyz' },
      },
      null,
      2,
    ),
  },
  {
    status: 401,
    title: 'Invalid credentials',
    description:
      'The provided API key is invalid, expired, or has been revoked. This also occurs when mixing sandbox and production keys.',
    resolution:
      'Verify your API key is correct and active. Ensure sk_test_ keys are used with the sandbox URL and sk_live_ keys with the production URL.',
    code: JSON.stringify(
      {
        error: {
          code: 'INVALID_API_KEY',
          message:
            'The provided API key is invalid or has been revoked.',
        },
        meta: { requestId: 'req_abc' },
      },
      null,
      2,
    ),
  },
  {
    status: 429,
    title: 'Rate limiting',
    description:
      'You have exceeded the rate limit for your plan. Sandbox allows 100 requests per minute.',
    resolution:
      'Implement exponential backoff with jitter. Check the Retry-After header for the recommended wait time. Consider caching responses for read-heavy workloads.',
    code: JSON.stringify(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please retry after 30 seconds.',
          details: {
            limit: 100,
            window: '1m',
            retryAfter: 30,
          },
        },
        meta: { requestId: 'req_def' },
      },
      null,
      2,
    ),
  },
];

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-emerald-400';
  if (status >= 400 && status < 500) return 'text-amber-400';
  return 'text-red-400';
}

function getStatusBg(status: number): string {
  if (status >= 200 && status < 300) return 'bg-emerald-500/10';
  if (status >= 400 && status < 500) return 'bg-amber-500/10';
  return 'bg-red-500/10';
}

function getStatusIcon(status: number) {
  if (status >= 200 && status < 300) return CheckCircle;
  if (status >= 400 && status < 500) return AlertTriangle;
  return ServerCrash;
}

export default function Errors() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Error Reference
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Understand response envelopes, HTTP status codes, and how to handle
          errors gracefully.
        </p>
      </div>

      {/* Response Envelope */}
      <section id="envelope">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Response Envelope
        </h2>
        <p className="mb-6 leading-relaxed text-gray-300">
          All API responses are wrapped in a standard envelope. Successful
          responses include a{' '}
          <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-blue-300">
            data
          </code>{' '}
          field. Error responses include an{' '}
          <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-red-300">
            error
          </code>{' '}
          field. Every response includes a{' '}
          <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-gray-300">
            meta
          </code>{' '}
          object with the request ID for debugging.
        </p>

        {/* Envelope Schema */}
        {responseEnvelopeFields.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-800">
            <div className="border-b border-gray-800 bg-gray-900/50 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-300">
                Envelope Structure
              </h3>
            </div>
            <div className="divide-y divide-gray-800/30">
              {responseEnvelopeFields.map((field) => (
                <div key={field.field} className="flex items-start px-5 py-3">
                  <code className="mr-4 min-w-[100px] font-mono text-sm text-blue-300">
                    {field.field}
                  </code>
                  <span className="text-sm text-gray-400">
                    {field.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-emerald-400">
              Success Response (Single)
            </h3>
            <CodeBlock code={successEnvelopeExample} language="json" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-blue-400">
              Success Response (List)
            </h3>
            <CodeBlock code={listEnvelopeExample} language="json" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-red-400">
              Error Response
            </h3>
            <CodeBlock code={errorEnvelopeExample} language="json" />
          </div>
        </div>
      </section>

      {/* HTTP Status Codes */}
      <section id="status-codes">
        <h2 className="mb-4 text-2xl font-bold text-white">
          HTTP Status Codes
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Code
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Description
                </th>
                <th className="hidden px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">
                  Resolution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {httpStatuses.map((error) => {
                const StatusIcon = getStatusIcon(error.status);
                return (
                  <tr key={error.status}>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-xs font-bold',
                          getStatusBg(error.status),
                          getStatusColor(error.status),
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {error.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-gray-300">
                        {error.title}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {error.description}
                    </td>
                    <td className="hidden px-5 py-3 text-gray-500 lg:table-cell">
                      {error.resolution}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Error Scenarios */}
      <section id="common-errors">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Common Error Scenarios
        </h2>
        <div className="space-y-6">
          {commonScenarios.map((scenario) => (
            <div
              key={scenario.title}
              className="rounded-xl border border-gray-800 bg-gray-900/30"
            >
              <div className="flex items-center gap-3 border-b border-gray-800/50 px-5 py-4">
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-xs font-bold',
                    getStatusBg(scenario.status),
                    getStatusColor(scenario.status),
                  )}
                >
                  {scenario.status}
                </span>
                <h3 className="font-semibold text-white">{scenario.title}</h3>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm leading-relaxed text-gray-400">
                  {scenario.description}
                </p>
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Resolution
                  </h4>
                  <p className="text-sm text-gray-400">
                    {scenario.resolution}
                  </p>
                </div>
                <CodeBlock code={scenario.code} language="json" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Error Handling Best Practices */}
      <Callout type="tip" title="Error Handling Best Practices">
        <ul className="mt-2 space-y-1.5">
          <li>Always check the HTTP status code before parsing the response body</li>
          <li>Log the <code className="rounded bg-gray-800 px-1 py-0.5 text-xs text-emerald-300">meta.requestId</code> for debugging -- include it in support tickets</li>
          <li>Implement retry logic with exponential backoff for 429 and 5xx errors</li>
          <li>Never retry 4xx errors (except 429) as they indicate client issues</li>
        </ul>
      </Callout>

      {/* CTA */}
      <div className="flex justify-center">
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
          <XCircle className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
