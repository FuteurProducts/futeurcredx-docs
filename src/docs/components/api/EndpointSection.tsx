import { Key, Shield, Unlock } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { EndpointDoc } from '@/docs/data/endpoints';

import { CodeBlock } from '@/docs/components/api/CodeBlock';
import { MethodBadge } from '@/docs/components/api/MethodBadge';
import { ParamTable } from '@/docs/components/api/ParamTable';
import { ResponseViewer } from '@/docs/components/api/ResponseViewer';

interface EndpointSectionProps {
  endpoint: EndpointDoc;
  className?: string;
}

const authIcons: Record<string, { icon: typeof Key; label: string }> = {
  'api-key': { icon: Key, label: 'API Key' },
  jwt: { icon: Shield, label: 'Bearer JWT' },
  none: { icon: Unlock, label: 'No Auth' },
};

export function EndpointSection({ endpoint, className }: EndpointSectionProps) {
  const hasCodeExamples =
    endpoint.codeExamples && Object.keys(endpoint.codeExamples).length > 0;

  // Separate body params for display as request body section
  const bodyParams = endpoint.params.filter((p) => p.type === 'body');
  const nonBodyParams = endpoint.params.filter((p) => p.type !== 'body');

  return (
    <section
      id={endpoint.id}
      className={cn(
        'scroll-mt-20 border-b border-gray-800/50 py-10',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-base text-gray-200">
            {endpoint.path}
          </code>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          {endpoint.title}
        </h3>
        <p className="leading-relaxed text-gray-400">{endpoint.description}</p>
      </div>

      {/* Auth badges */}
      {endpoint.auth && endpoint.auth.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Auth:
          </span>
          {endpoint.auth.map((authType) => {
            const config = authIcons[authType];
            if (!config) {
              return (
                <span
                  key={authType}
                  className="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-2.5 py-1 text-xs text-gray-300"
                >
                  {authType}
                </span>
              );
            }
            const Icon = config.icon;
            return (
              <span
                key={authType}
                className="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-2.5 py-1 text-xs text-gray-300"
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {config.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Two-column layout on large screens */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left column: documentation */}
        <div className="space-y-6">
          {/* Non-body parameters */}
          {nonBodyParams.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                Parameters
              </h4>
              <ParamTable params={nonBodyParams} />
            </div>
          )}

          {/* Body parameters */}
          {bodyParams.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                Request Body
              </h4>
              <ParamTable params={bodyParams} />
            </div>
          )}

          {/* Error examples */}
          {endpoint.errorExamples && endpoint.errorExamples.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                Error Responses
              </h4>
              <div className="space-y-3">
                {endpoint.errorExamples.map((err) => (
                  <div
                    key={err.status}
                    className="rounded-xl border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <span className="mb-2 inline-flex rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400">
                      {err.status}
                    </span>
                    <pre className="mt-2 overflow-x-auto text-xs text-gray-400">
                      {JSON.stringify(err.body, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: code examples + response */}
        <div className="space-y-6">
          {/* Code examples */}
          {hasCodeExamples && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                Request
              </h4>
              <CodeBlock code={endpoint.codeExamples} />
            </div>
          )}

          {/* Response viewer */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Response
            </h4>
            <ResponseViewer
              endpointId={endpoint.id}
              defaultResponse={endpoint.responseExample}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
