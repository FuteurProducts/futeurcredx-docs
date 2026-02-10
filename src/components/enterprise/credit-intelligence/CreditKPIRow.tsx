/**
 * Credit Intelligence KPI Row — 6 executive-level KPI cards
 * Uses KPICard from shared, data from chaseDemoData
 */

import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  Percent,
  Target,
  Users,
} from 'lucide-react';

import { KPICard } from '@/components/enterprise/shared/KPICard';
import { PORTFOLIO } from '@/data/chaseDemoData';
import { formatCurrency, formatNumber } from '@/lib/formatters';

export function CreditKPIRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard
        label="Total Portfolio"
        value={PORTFOLIO.totalBusinesses}
        formatValue={(v) => formatNumber(v)}
        tooltip={`+${formatNumber(PORTFOLIO.quarterlyGrowth)} this quarter`}
        trend={{
          direction: 'up',
          value: `+${formatNumber(PORTFOLIO.quarterlyGrowth)} this quarter`,
          isPositive: true,
        }}
        status="ok"
        icon={<Users className="h-4 w-4" />}
      />

      <KPICard
        label="Total Exposure"
        value={PORTFOLIO.totalExposure}
        formatValue={(v) => formatCurrency(v)}
        tooltip="Click for exposure breakdown"
        trend={{
          direction: 'up',
          value: '+$2.1B YoY',
          isPositive: true,
        }}
        status="ok"
        icon={<DollarSign className="h-4 w-4" />}
      />

      <KPICard
        label="Pre-Qual Rate"
        value={67}
        formatValue={(v) => `${v}%`}
        tooltip={`${formatNumber(Math.round(PORTFOLIO.totalBusinesses * PORTFOLIO.preQualRate))} qualified for at least 1 product`}
        trend={{
          direction: 'flat',
          value: 'Stable',
          isPositive: true,
        }}
        status="ok"
        icon={<Percent className="h-4 w-4" />}
      />

      <KPICard
        label="Avg Score"
        value={583}
        formatValue={(v) => (v / 10).toFixed(1)}
        tooltip="Down 0.8 from last month"
        trend={{
          direction: 'down',
          value: '-0.8 from last month',
          isPositive: false,
        }}
        status="warning"
        icon={<BarChart3 className="h-4 w-4" />}
      />

      <KPICard
        label="At-Risk Exposure"
        value={PORTFOLIO.atRiskExposure}
        formatValue={(v) => formatCurrency(v)}
        subValue="13%"
        tooltip="Click to view Risk tab"
        trend={{
          direction: 'up',
          value: '+$400M this quarter',
          isPositive: false,
        }}
        status="warning"
        icon={<AlertTriangle className="h-4 w-4" />}
      />

      <KPICard
        label="Offer Potential"
        value={PORTFOLIO.offerPotential}
        formatValue={(v) => formatCurrency(v)}
        tooltip="Breakdown by product type"
        trend={{
          direction: 'up',
          value: '+$3.2B identified',
          isPositive: true,
        }}
        status="ok"
        icon={<Target className="h-4 w-4" />}
      />
    </div>
  );
}
