import { useMemo } from 'react';

import { Building2, CreditCard, DollarSign, ShieldAlert, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BankSelector } from '@/docs/components/sandbox/BankSelector';
import { useDocsContext } from '@/docs/contexts/DocsContext';
import { bankSnapshotsByBankId } from '@/docs/data/sandbox-responses';

interface StatCardProps {
  icon: typeof Building2;
  label: string;
  value: string | number;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn('h-4 w-4', iconColor)} aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function formatExposure(exposure: number): string {
  if (exposure >= 1_000_000_000_000) {
    return `$${(exposure / 1_000_000_000_000).toFixed(0)}T`;
  }
  if (exposure >= 1_000_000_000) {
    return `$${(exposure / 1_000_000_000).toFixed(1)}B`;
  }
  if (exposure >= 1_000_000) {
    return `$${(exposure / 1_000_000).toFixed(1)}M`;
  }
  return `$${exposure.toLocaleString()}`;
}

export function SandboxOverview() {
  const { selectedBank } = useDocsContext();

  const bankData = useMemo(() => {
    const snapshot = bankSnapshotsByBankId[selectedBank] ?? bankSnapshotsByBankId.chase;
    const summary = snapshot.responses.portfolioSummary as Record<string, unknown> | undefined;
    const summaryData = (summary as { data?: Record<string, unknown> } | undefined)?.data;
    const riskData = (snapshot.responses.riskSummary as { data?: Record<string, unknown> } | undefined)?.data;

    return {
      name: snapshot.bank,
      portfolioId: snapshot.portfolioId,
      apiKeyPrefix: snapshot.apiKeyPrefix,
      totalBusinesses: (summaryData?.totalBusinesses as number) ?? 0,
      totalExposure: (summaryData?.totalExposure as number) ?? 0,
      avgCreditScore: (summaryData?.avgCreditScore as number) ?? 0,
      riskDistribution: {
        lowPct: 100 - ((summaryData?.atRiskRate as number) ?? 0) - 20,
        medPct: 20,
        highPct: (summaryData?.atRiskRate as number) ?? 0,
      },
      delinquencyRate: (riskData?.delinquencyRate as number) ?? 0,
      watchlistCount: (riskData?.watchlistCount as number) ?? 0,
    };
  }, [selectedBank]);

  return (
    <div className="space-y-6">
      {/* Bank selector and header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Sandbox: {bankData.name}
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Portfolio ID:{' '}
            <code className="rounded bg-gray-800/50 px-1.5 py-0.5 font-mono text-xs text-blue-400">
              {bankData.portfolioId}
            </code>
          </p>
        </div>
        <BankSelector className="w-48" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Businesses"
          value={bankData.totalBusinesses.toLocaleString()}
          iconColor="text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          label="Total Exposure"
          value={formatExposure(bankData.totalExposure)}
          iconColor="text-emerald-400"
        />
        <StatCard
          icon={CreditCard}
          label="Avg Credit Score"
          value={bankData.avgCreditScore}
          iconColor="text-amber-400"
        />
        <StatCard
          icon={Building2}
          label="API Key"
          value={`${bankData.apiKeyPrefix}...`}
          iconColor="text-purple-400"
        />
      </div>

      {/* Risk distribution */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Risk Indicators
        </h4>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-sm text-gray-300">
              Delinquency:{' '}
              <span className="font-semibold text-amber-400">
                {bankData.delinquencyRate}%
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-400" aria-hidden="true" />
            <span className="text-sm text-gray-300">
              At-Risk:{' '}
              <span className="font-semibold text-red-400">
                {bankData.riskDistribution.highPct.toFixed(1)}%
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <span className="text-sm text-gray-300">
              Watchlist:{' '}
              <span className="font-semibold text-blue-400">
                {bankData.watchlistCount.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* Visual bar */}
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${bankData.riskDistribution.lowPct}%` }}
          />
          <div
            className="bg-amber-500 transition-all duration-300"
            style={{ width: `${bankData.riskDistribution.medPct}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-300"
            style={{ width: `${bankData.riskDistribution.highPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Low risk</span>
          <span>Medium</span>
          <span>High risk</span>
        </div>
      </div>

      {/* API key format note */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <p className="text-sm text-gray-400">
          Sandbox API keys use the{' '}
          <code className="rounded bg-gray-800/50 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            sk_test_
          </code>{' '}
          prefix. Production keys use{' '}
          <code className="rounded bg-gray-800/50 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            sk_live_
          </code>
          . All sandbox data is synthetic and safe for testing.
        </p>
      </div>
    </div>
  );
}
