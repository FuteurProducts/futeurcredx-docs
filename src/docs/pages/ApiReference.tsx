import { useEffect, useRef } from 'react';

import {
  BarChart3,
  CreditCard,
  FileText,
  Key,
  LayoutDashboard,
  Shield,
  Users,
} from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { EndpointSection } from '@/docs/components/api/EndpointSection';
import { BankSelector } from '@/docs/components/sandbox/BankSelector';
import { Callout } from '@/docs/components/shared/Callout';
import { endpointTags, endpointsByTag } from '@/docs/data/endpoints';

const tagIcons: Record<string, typeof Users> = {
  customers: Users,
  credit: CreditCard,
  risk: Shield,
  underwriting: FileText,
  portfolio: LayoutDashboard,
  reports: FileText,
  analytics: BarChart3,
  credentials: Key,
};

export default function ApiReference() {
  const { tag: urlTag } = useParams<{ tag?: string }>();
  const location = useLocation();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const targetId = urlTag ?? location.hash.replace('#', '');
    if (!targetId) return;

    const timeout = setTimeout(() => {
      const element = sectionRefs.current[targetId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [urlTag, location.hash]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          API Reference
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Complete endpoint documentation with request/response examples for
          every resource.
        </p>
      </div>

      {/* Base URL */}
      <Callout type="info" title="Base URL">
        <code className="font-mono text-blue-300">
          https://api.sandbox.futeurcredx.com/api/v1
        </code>
        <p className="mt-1 text-xs text-gray-500">
          All endpoint paths below are relative to this base URL.
        </p>
      </Callout>

      {/* Bank Selector */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Select Bank Tenant
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          Response examples are shown for the selected bank. Each bank has its
          own portfolio of businesses and synthetic data.
        </p>
        <BankSelector />
      </div>

      {/* Tag Navigation */}
      <nav className="flex flex-wrap gap-2" aria-label="API sections">
        {endpointTags.map((tag) => {
          const Icon = tagIcons[tag.id] ?? FileText;
          return (
            <a
              key={tag.id}
              href={`#${tag.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = sectionRefs.current[tag.id];
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5',
                'border border-gray-800 bg-gray-900/50 text-sm text-gray-400',
                'transition-all duration-200',
                'hover:border-gray-700 hover:bg-gray-800/50 hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tag.label}
            </a>
          );
        })}
      </nav>

      {/* Endpoint Sections by Tag */}
      <div className="space-y-16">
        {endpointTags.map((tag) => {
          const tagEndpoints = endpointsByTag[tag.id] ?? [];
          const Icon = tagIcons[tag.id] ?? FileText;

          return (
            <section
              key={tag.id}
              id={tag.id}
              ref={(el) => {
                sectionRefs.current[tag.id] = el;
              }}
              className="scroll-mt-24"
            >
              {/* Tag Header */}
              <div className="mb-6 flex items-center gap-3 border-b border-gray-800 pb-4">
                <div
                  className={cn(
                    'rounded-lg p-2',
                    'bg-gray-800/50',
                  )}
                >
                  <Icon className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{tag.label}</h2>
                  {'description' in tag && (
                    <p className="text-sm text-gray-500">{String(tag.label)}</p>
                  )}
                </div>
                <span className="ml-auto rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                  {tagEndpoints.length} endpoint
                  {tagEndpoints.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Endpoints */}
              <div className="space-y-8">
                {tagEndpoints.map((endpoint) => (
                  <EndpointSection key={endpoint.id} endpoint={endpoint} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
