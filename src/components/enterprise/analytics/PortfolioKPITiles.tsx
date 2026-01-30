// Portfolio KPI Tiles - Top-level performance metrics with drilldown
import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronRight,
} from 'lucide-react';
import type { PortfolioKPI } from './types';

interface PortfolioKPITilesProps {
  kpis: PortfolioKPI[];
  onDrilldown?: (kpiId: string) => void;
}

const formatValue = (value: number, format: PortfolioKPI['format']): string => {
  switch (format) {
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return `$${(value / 1000000).toFixed(1)}M`;
    case 'score':
      return value.toFixed(1);
    default:
      return value.toLocaleString();
  }
};

export const PortfolioKPITiles: React.FC<PortfolioKPITilesProps> = ({ kpis, onDrilldown }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => {
        const TrendIcon = kpi.trendDirection === 'up' ? TrendingUp : kpi.trendDirection === 'down' ? TrendingDown : Minus;
        const trendColor = kpi.isPositiveTrend
          ? 'text-green-600'
          : kpi.trendDirection === 'stable'
          ? 'text-muted-foreground'
          : 'text-red-600';

        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() => onDrilldown?.(kpi.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground leading-tight">{kpi.label}</span>
                <div className="relative group/tooltip">
                  <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {kpi.tooltip}
                    <div className="text-muted-foreground mt-1">Source: {kpi.dataSource}</div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Value */}
            <div className="text-2xl font-bold text-foreground mb-2">
              {formatValue(kpi.value, kpi.format)}
            </div>

            {/* Trend */}
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">
                {kpi.trend > 0 ? '+' : ''}{kpi.trend.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">90d</span>
            </div>

            {/* Freshness */}
            <div className="mt-2 text-[10px] text-muted-foreground/70">
              Updated {kpi.lastUpdated}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PortfolioKPITiles;
