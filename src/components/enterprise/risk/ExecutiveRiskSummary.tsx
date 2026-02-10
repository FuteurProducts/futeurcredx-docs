import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export interface RiskKPI {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'stable';
  trendIsGood: boolean;
  sparklineData?: { value: number }[];
}

export interface DeteriorationDriver {
  driver: string;
  impact: number;
  affectedAccounts: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ExecutiveRiskSummaryProps {
  kpis: RiskKPI[];
  deteriorationDrivers: DeteriorationDriver[];
  trendData: {
    deteriorations: { date: string; value: number }[];
    delinquencies: { date: string; value: number }[];
    cashflowStress: { date: string; value: number }[];
    bureauDrops: { date: string; value: number }[];
  };
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
};

const KPICard: React.FC<{ kpi: RiskKPI; index: number }> = ({ kpi, index }) => {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = kpi.trendIsGood
    ? kpi.trend === 'up' ? 'text-success' : 'text-destructive'
    : kpi.trend === 'up' ? 'text-destructive' : 'text-success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {kpi.label}
        </span>
        {kpi.sparklineData && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpi.sparklineData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.1)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <div className="text-h4 font-bold text-foreground mb-1">
        {typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value}
      </div>

      <div className={`flex items-center gap-1 text-body-2 ${trendColor}`}>
        {kpi.trend !== 'stable' && <TrendIcon className="w-3.5 h-3.5" />}
        <span className="font-medium">
          {kpi.change > 0 ? '+' : ''}{kpi.change}%
        </span>
        <span className="text-muted-foreground">{kpi.changeLabel}</span>
      </div>
    </motion.div>
  );
};

const TrendStrip: React.FC<{ 
  label: string; 
  data: { date: string; value: number }[];
  color: string;
}> = ({ label, data, color }) => {
  const latestValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || latestValue;
  const change = previousValue ? ((latestValue - previousValue) / previousValue * 100) : 0;

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">{formatNumber(latestValue)}</span>
          <span className={`text-xs font-medium ${change >= 0 ? 'text-destructive' : 'text-success'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="w-24 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`${color}20`}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ExecutiveRiskSummary: React.FC<ExecutiveRiskSummaryProps> = ({
  kpis,
  deteriorationDrivers,
  trendData,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-h6 font-semibold text-foreground">Executive Risk Summary</h2>
          <p className="text-body-2 text-muted-foreground">CRO-level portfolio health overview</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </div>

      {/* Trend Strips */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-body-2 font-medium text-foreground">Trend Indicators (30d)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <TrendStrip label="Deteriorations" data={trendData.deteriorations} color="hsl(var(--destructive))" />
          <TrendStrip label="Delinquencies" data={trendData.delinquencies} color="hsl(var(--warning))" />
          <TrendStrip label="Cashflow Stress" data={trendData.cashflowStress} color="hsl(var(--primary-05))" />
          <TrendStrip label="Bureau Drops" data={trendData.bureauDrops} color="hsl(var(--primary-04))" />
        </div>
      </div>

      {/* Top Deterioration Drivers */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-body-2 font-medium text-foreground">Top 3 Deterioration Drivers</span>
          </div>
          <span className="text-xs text-muted-foreground">Model explainability at portfolio level</span>
        </div>
        
        <div className="space-y-3">
          {deteriorationDrivers.slice(0, 3).map((driver, index) => (
            <div key={driver.driver} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/10 text-warning font-bold text-sm">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{driver.driver}</div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(driver.affectedAccounts)} accounts affected
                </div>
              </div>
              <div className="text-right">
                <div className="text-h6 font-semibold text-foreground">{driver.impact}%</div>
                <div className={`text-xs ${
                  driver.trend === 'up' ? 'text-destructive' : driver.trend === 'down' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {driver.trend === 'up' ? '↑ Increasing' : driver.trend === 'down' ? '↓ Decreasing' : '→ Stable'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutiveRiskSummary;
