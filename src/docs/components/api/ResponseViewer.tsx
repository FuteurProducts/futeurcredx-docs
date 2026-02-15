import { useCallback, useMemo, useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { CopyButton } from '@/docs/components/shared/CopyButton';
import { useDocsContext } from '@/docs/contexts/DocsContext';
import { bankSnapshotsByBankId } from '@/docs/data/sandbox-responses';

interface ResponseViewerProps {
  endpointId: string;
  defaultResponse?: Record<string, unknown>;
  className?: string;
}

interface JsonNodeProps {
  data: unknown;
  keyName?: string;
  depth: number;
  isLast: boolean;
}

/**
 * Maps endpoint IDs to the response key inside the BankSnapshot.responses object.
 */
const endpointToResponseKey: Record<string, string> = {
  'health-check': 'health',
  'list-portfolios': 'portfolios',
  'portfolio-summary': 'portfolioSummary',
  'list-customers': 'customers',
  'get-customer': 'customers',
  'list-scores': 'customers',
  'score-distribution': 'scoreDistribution',
  'risk-summary': 'riskSummary',
  'risk-events': 'riskSummary',
  'list-applications': 'applications',
  'list-offers': 'offers',
  'analytics-funnel': 'analyticsFunnel',
  kpis: 'portfolioSummary',
  'conversion-trend': 'analyticsFunnel',
};

function JsonNode({ data, keyName, depth, isLast }: JsonNodeProps) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const isObject =
    data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isExpandable = isObject || isArray;

  const indent = depth * 16;
  const comma = isLast ? '' : ',';

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  if (!isExpandable) {
    let valueDisplay: string;
    let valueClass: string;

    if (typeof data === 'string') {
      valueDisplay = `"${data}"`;
      valueClass = 'text-emerald-400';
    } else if (typeof data === 'number') {
      valueDisplay = String(data);
      valueClass = 'text-amber-400';
    } else if (typeof data === 'boolean') {
      valueDisplay = String(data);
      valueClass = 'text-purple-400';
    } else {
      valueDisplay = 'null';
      valueClass = 'text-gray-500';
    }

    return (
      <div
        className="font-mono text-sm leading-6"
        style={{ paddingLeft: indent }}
      >
        {keyName !== undefined && (
          <span className="text-blue-300">&quot;{keyName}&quot;</span>
        )}
        {keyName !== undefined && <span className="text-gray-400">: </span>}
        <span className={valueClass}>{valueDisplay}</span>
        <span className="text-gray-500">{comma}</span>
      </div>
    );
  }

  const entries = isArray
    ? (data as unknown[]).map((val, i) => ({
        key: String(i),
        value: val,
        showKey: false,
      }))
    : Object.entries(data as Record<string, unknown>).map(([k, v]) => ({
        key: k,
        value: v,
        showKey: true,
      }));

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  if (collapsed) {
    return (
      <div
        className="flex cursor-pointer items-center font-mono text-sm leading-6 hover:bg-gray-800/30"
        style={{ paddingLeft: indent }}
        onClick={toggleCollapse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCollapse();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={false}
        aria-label={`Expand ${keyName ?? (isArray ? 'array' : 'object')}`}
      >
        <ChevronRight
          className="mr-1 h-3 w-3 text-gray-500"
          aria-hidden="true"
        />
        {keyName !== undefined && (
          <span className="text-blue-300">&quot;{keyName}&quot;</span>
        )}
        {keyName !== undefined && <span className="text-gray-400">: </span>}
        <span className="text-gray-400">
          {openBracket}
          <span className="text-gray-600"> ... {entries.length} items </span>
          {closeBracket}
        </span>
        <span className="text-gray-500">{comma}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex cursor-pointer items-center font-mono text-sm leading-6 hover:bg-gray-800/30"
        style={{ paddingLeft: indent }}
        onClick={toggleCollapse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCollapse();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={true}
        aria-label={`Collapse ${keyName ?? (isArray ? 'array' : 'object')}`}
      >
        <ChevronDown
          className="mr-1 h-3 w-3 text-gray-500"
          aria-hidden="true"
        />
        {keyName !== undefined && (
          <span className="text-blue-300">&quot;{keyName}&quot;</span>
        )}
        {keyName !== undefined && <span className="text-gray-400">: </span>}
        <span className="text-gray-400">{openBracket}</span>
      </div>
      {entries.map((entry, i) => (
        <JsonNode
          key={entry.key}
          data={entry.value}
          keyName={entry.showKey ? entry.key : undefined}
          depth={depth + 1}
          isLast={i === entries.length - 1}
        />
      ))}
      <div
        className="font-mono text-sm leading-6"
        style={{ paddingLeft: indent }}
      >
        <span className="text-gray-400">{closeBracket}</span>
        <span className="text-gray-500">{comma}</span>
      </div>
    </div>
  );
}

const BANK_OPTIONS = [
  { id: 'chase', label: 'Chase' },
  { id: 'wellsfargo', label: 'Wells Fargo' },
  { id: 'santander', label: 'Santander' },
  { id: 'citi', label: 'Citi' },
] as const;

export function ResponseViewer({
  endpointId,
  defaultResponse,
  className,
}: ResponseViewerProps) {
  const { selectedBank, setSelectedBank } = useDocsContext();

  const responseData = useMemo(() => {
    // Try to get bank-specific response from sandbox snapshots
    const snapshot = bankSnapshotsByBankId[selectedBank];
    if (snapshot) {
      const responseKey = endpointToResponseKey[endpointId];
      if (responseKey && snapshot.responses[responseKey]) {
        return snapshot.responses[responseKey] as Record<string, unknown>;
      }
    }
    // Fall back to default response
    return defaultResponse ?? { message: 'No response data available' };
  }, [selectedBank, endpointId, defaultResponse]);

  const jsonString = useMemo(
    () => JSON.stringify(responseData, null, 2),
    [responseData],
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-gray-800 bg-gray-900',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2.5">
        <span className="text-xs font-medium text-gray-400">Response</span>
        <div className="flex items-center gap-3">
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className={cn(
              'rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1',
              'text-xs text-gray-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            )}
            aria-label="Select bank for response data"
          >
            {BANK_OPTIONS.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.label}
              </option>
            ))}
          </select>
          <CopyButton text={jsonString} />
        </div>
      </div>

      {/* JSON content */}
      <div className="max-h-[500px] overflow-auto p-4">
        <JsonNode data={responseData} depth={0} isLast />
      </div>
    </div>
  );
}
