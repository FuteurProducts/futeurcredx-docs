/**
 * Segment Drill-Down View — shown when [View] is clicked on a segment card
 *
 * Contains:
 * - Header with back button, segment info, action buttons
 * - 4 KPI cards with comparison to portfolio average
 * - Risk donut chart + Product eligibility horizontal bars (side-by-side)
 * - Sample businesses table
 */

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Eye,
  Megaphone,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { KPICard } from '@/components/enterprise/shared/KPICard';
import {
  PORTFOLIO,
  SAMPLE_BUSINESSES,
  SEGMENTS,
} from '@/data/chaseDemoData';
import type { Segment, SampleBusiness } from '@/data/chaseDemoData';
import {
  formatCurrency,
  formatNumber,
  getRiskBadgeClass,
  getRiskColor,
} from '@/lib/formatters';

interface SegmentDrillDownProps {
  segmentId: string;
  onBack: () => void;
}

// ---- Helpers ----

function getSegment(segmentId: string): Segment | undefined {
  return SEGMENTS.find((s) => s.id === segmentId);
}

function getSegmentBusinesses(segmentId: string): SampleBusiness[] {
  return SAMPLE_BUSINESSES.filter((b) => b.segment === segmentId);
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---- Sub-Components ----

function DrillDownKPIs({ segment }: { segment: Segment }) {
  const scoreDiff = segment.avgScore - PORTFOLIO.avgCompositeScore;
  const preQualDiff = segment.preQualRate - PORTFOLIO.preQualRate;
  const convDiff = segment.conversionRate - 0.068; // portfolio avg conversion ~6.8%
  const avgOfferAmount = 142_000;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPICard
        label="Avg Score"
        value={segment.avgScore}
        formatValue={(v) => String(v)}
        trend={{
          direction: scoreDiff >= 0 ? 'up' : 'down',
          value: `${scoreDiff >= 0 ? '+' : ''}${scoreDiff.toFixed(1)} vs avg`,
          isPositive: scoreDiff >= 0,
        }}
        status={segment.avgScore >= 60 ? 'ok' : 'warning'}
      />
      <KPICard
        label="Pre-Qual Rate"
        value={Math.round(segment.preQualRate * 100)}
        formatValue={(v) => `${v}%`}
        trend={{
          direction: preQualDiff >= 0 ? 'up' : 'down',
          value: `${preQualDiff >= 0 ? '+' : ''}${(preQualDiff * 100).toFixed(1)}pp vs avg`,
          isPositive: preQualDiff >= 0,
        }}
        status={segment.preQualRate >= 0.6 ? 'ok' : 'warning'}
      />
      <KPICard
        label="Conversion Rate"
        value={Math.round(segment.conversionRate * 1000)}
        formatValue={(v) => `${(v / 10).toFixed(1)}%`}
        trend={{
          direction: convDiff >= 0 ? 'up' : 'down',
          value: `${convDiff >= 0 ? '+' : ''}${(convDiff * 100).toFixed(1)}pp vs avg`,
          isPositive: convDiff >= 0,
        }}
        status={segment.conversionRate >= 0.05 ? 'ok' : 'warning'}
      />
      <KPICard
        label="Avg Offer Amount"
        value={avgOfferAmount}
        formatValue={(v) => formatCurrency(v)}
        trend={{
          direction: 'flat',
          value: 'Placeholder estimate',
          isPositive: true,
        }}
        status="ok"
      />
    </div>
  );
}

function RiskDonut({ segment }: { segment: Segment }) {
  const data = Object.entries(segment.riskDistribution).map(
    ([tier, pct]) => ({
      tier,
      value: pct * 100,
      color: getRiskColor(tier),
    }),
  );

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        Risk Distribution
      </h4>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              nameKey="tier"
              animationDuration={600}
            >
              {data.map((entry) => (
                <Cell key={entry.tier} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { tier: string; value: number };
                return (
                  <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs">
                    <span className="font-medium">{d.tier}</span>: {d.value.toFixed(0)}%
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {data.map((entry) => (
          <div key={entry.tier} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[10px] text-muted-foreground">
              {entry.tier} {entry.value.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductEligibility({ segment }: { segment: Segment }) {
  const products = Object.entries(segment.productEligibility).map(
    ([product, count]) => ({
      product,
      count,
      pct: (count / segment.businessCount) * 100,
    }),
  );

  const maxCount = Math.max(...products.map((p) => p.count));

  const productLabels: Record<string, string> = {
    LOC: 'Line of Credit',
    TERM: 'Term Loan',
    SBA: 'SBA 7(a)',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        Product Eligibility
      </h4>
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.product}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">
                {productLabels[p.product] ?? p.product}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatNumber(p.count)} ({p.pct.toFixed(0)}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(p.count / maxCount) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SampleBusinessTable({
  businesses,
  onRefresh,
}: {
  businesses: SampleBusiness[];
  onRefresh: () => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Sample Businesses
          </h4>
          <p className="text-[11px] text-muted-foreground">
            {businesses.length} businesses in this segment
          </p>
        </div>
        <button
          onClick={onRefresh}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border',
            'bg-card text-xs text-foreground',
            'hover:bg-accent transition-colors',
          )}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Sample
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
        <div className="col-span-4">Business Name</div>
        <div className="col-span-2 text-right">Revenue</div>
        <div className="col-span-2 text-center">Score</div>
        <div className="col-span-2 text-center">Risk</div>
        <div className="col-span-2 text-center">Status</div>
      </div>

      {/* Table Rows */}
      {businesses.length > 0 ? (
        businesses.map((biz) => (
          <div
            key={biz.id}
            className="grid grid-cols-12 gap-3 px-3 py-2.5 items-center hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="col-span-4">
              <div className="text-sm font-medium text-foreground">
                {biz.name}
              </div>
              <div className="text-[10px] text-muted-foreground">{biz.state}</div>
            </div>
            <div className="col-span-2 text-right text-sm text-foreground">
              {formatCurrency(biz.revenue)}
            </div>
            <div className="col-span-2 text-center text-sm font-semibold text-foreground">
              {biz.score}
            </div>
            <div className="col-span-2 text-center">
              <span
                className={cn(
                  'inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border',
                  getRiskBadgeClass(biz.risk),
                )}
              >
                {biz.risk}
              </span>
            </div>
            <div className="col-span-2 text-center text-xs text-muted-foreground">
              {biz.status}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No sample businesses available for this segment
        </div>
      )}
    </div>
  );
}

// ---- Main Component ----

export function SegmentDrillDown({ segmentId, onBack }: SegmentDrillDownProps) {
  const segment = getSegment(segmentId);
  const allBusinesses = useMemo(() => getSegmentBusinesses(segmentId), [segmentId]);
  const [displayedBusinesses, setDisplayedBusinesses] = useState(allBusinesses);

  const handleRefresh = useCallback(() => {
    if (allBusinesses.length > 0) {
      setDisplayedBusinesses(shuffleArray(allBusinesses));
      toast.success('Sample refreshed');
    } else {
      toast.info('No businesses to shuffle in this segment');
    }
  }, [allBusinesses]);

  const handlePushOffers = useCallback(() => {
    if (!segment) return;
    toast.success(`Offers pushed to ${segment.name}`, {
      description: `${formatNumber(segment.businessCount)} pre-qualified businesses targeted`,
    });
  }, [segment]);

  const handleAddToWatch = useCallback(() => {
    if (!segment) return;
    toast.success(`${segment.name} added to Watch List`, {
      description: `${formatNumber(segment.businessCount)} businesses now monitored`,
    });
  }, [segment]);

  const handleExportCSV = useCallback(() => {
    if (!segment) return;
    toast.success(`${segment.name} exported`, {
      description: `CSV with ${formatNumber(segment.businessCount)} records downloaded`,
    });
  }, [segment]);

  if (!segment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Segment not found</p>
        <button
          onClick={onBack}
          className="mt-4 text-primary text-sm hover:underline"
        >
          Back to segments
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={cn(
              'p-2 rounded-lg border border-border bg-card',
              'hover:bg-accent transition-colors',
            )}
            aria-label="Back to segments"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <span className="text-2xl">{segment.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {segment.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatNumber(segment.businessCount)} businesses |{' '}
              {formatCurrency(segment.exposure)} exposure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePushOffers}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'bg-primary text-primary-foreground text-xs font-medium',
              'hover:bg-primary/90 transition-colors',
            )}
          >
            <Megaphone className="h-3.5 w-3.5" />
            Push Offers
          </button>
          <button
            onClick={handleAddToWatch}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border',
              'bg-card text-xs font-medium text-foreground',
              'hover:bg-accent transition-colors',
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Add to Watch
          </button>
          <button
            onClick={handleExportCSV}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border',
              'bg-card text-xs font-medium text-foreground',
              'hover:bg-accent transition-colors',
            )}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <DrillDownKPIs segment={segment} />

      {/* Risk Donut + Product Eligibility side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDonut segment={segment} />
        <ProductEligibility segment={segment} />
      </div>

      {/* Sample Businesses Table */}
      <SampleBusinessTable
        businesses={displayedBusinesses}
        onRefresh={handleRefresh}
      />
    </motion.div>
  );
}
