/**
 * Score Distribution Chart — Recharts BarChart showing 5 risk tiers
 * Bars are clickable, animated on load, with exposure amounts below
 */

import { useCallback, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { RISK_TIERS } from '@/data/chaseDemoData';
import type { RiskTier } from '@/data/chaseDemoData';
import { formatCurrency, formatNumber, getRiskColor } from '@/lib/formatters';

interface TierData {
  tier: RiskTier;
  label: string;
  percent: number;
  count: number;
  exposure: number;
  fill: string;
}

const TIER_ORDER: RiskTier[] = ['CRITICAL', 'HIGH', 'ELEVATED', 'MODERATE', 'LOW'];

const chartData: TierData[] = TIER_ORDER.map((tier) => {
  const data = RISK_TIERS[tier];
  return {
    tier,
    label: data.label,
    percent: data.percent * 100,
    count: data.count,
    exposure: data.exposure,
    fill: getRiskColor(tier),
  };
});

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TierData;
  }>;
}

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-sm">
      <div className="font-semibold text-foreground mb-1">{data.label}</div>
      <div className="text-muted-foreground">
        {formatNumber(data.count)} businesses ({data.percent.toFixed(0)}%)
      </div>
      <div className="text-muted-foreground">
        Exposure: {formatCurrency(data.exposure)}
      </div>
    </div>
  );
}

export function ScoreDistribution() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleBarClick = useCallback((data: TierData) => {
    toast.info(`${data.label} Tier`, {
      description: `${formatNumber(data.count)} businesses | ${formatCurrency(data.exposure)} exposure | ${data.percent.toFixed(0)}% of portfolio`,
    });
  }, []);

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Score Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Portfolio risk tier breakdown across{' '}
          {formatNumber(RISK_TIERS.LOW.count + RISK_TIERS.MODERATE.count + RISK_TIERS.ELEVATED.count + RISK_TIERS.HIGH.count + RISK_TIERS.CRITICAL.count)}{' '}
          businesses
        </p>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <RechartsTooltip content={<ChartTooltip />} />
            <Bar
              dataKey="percent"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              animationDuration={800}
              animationEasing="ease-out"
              onClick={(_data: unknown, index: number) => {
                handleBarClick(chartData[index]);
              }}
              onMouseEnter={(_data: unknown, index: number) => {
                setHoveredTier(chartData[index].tier);
              }}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.tier}
                  fill={entry.fill}
                  opacity={hoveredTier && hoveredTier !== entry.tier ? 0.5 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Exposure row below */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3">
        {chartData.map((tier) => (
          <button
            key={tier.tier}
            onClick={() => handleBarClick(tier)}
            className={cn(
              'text-center p-2 rounded-lg',
              'hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer',
            )}
          >
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: tier.fill }}
            />
            <div className="text-xs text-muted-foreground font-medium">
              {tier.label}
            </div>
            <div className="text-xs font-semibold text-foreground">
              {formatCurrency(tier.exposure)}
            </div>
            <div className="text-xs text-muted-foreground">
              {tier.percent.toFixed(0)}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
