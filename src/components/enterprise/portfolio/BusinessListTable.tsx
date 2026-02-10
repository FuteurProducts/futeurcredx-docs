import React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { cn } from '@/lib/utils';

import type { DemoBusinessEntity } from '@/data/fallback/demoData';

interface BusinessListTableProps {
  businesses: DemoBusinessEntity[];
  selectedSegmentName?: string;
  onBusinessClick: (businessId: string) => void;
  className?: string;
}

const DATA_SOURCES = [
  'D&B Commercial',
  'Experian BizID',
  'Banking Data Feed',
  'Secretary of State',
];

const BusinessListTable: React.FC<BusinessListTableProps> = ({
  businesses,
  selectedSegmentName,
  onBusinessClick,
  className,
}) => {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {selectedSegmentName
              ? `Sample Businesses — ${selectedSegmentName}`
              : 'Sample Businesses'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Click a business to view credit signal details
          </p>
        </div>
        <DemoMetaBadge
          lastUpdated="2026-01-28T10:00:00Z"
          dataSources={DATA_SOURCES}
          coverage={80.4}
        />
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-4 px-5 py-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          <div className="col-span-4">Business</div>
          <div className="col-span-2">Industry</div>
          <div className="col-span-1">Score</div>
          <div className="col-span-2">Revenue</div>
          <div className="col-span-1">Risk</div>
          <div className="col-span-2">Trend</div>
        </div>
        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No businesses available</p>
          </div>
        ) : (
          businesses.map((biz) => (
            <button
              key={biz.id}
              onClick={() => onBusinessClick(biz.id)}
              className="w-full grid grid-cols-12 gap-4 items-center px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="col-span-4">
                <div className="text-sm font-medium text-foreground">{biz.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {biz.city}, {biz.state}
                </div>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">{biz.industry}</div>
              <div className="col-span-1 text-sm font-semibold text-foreground">
                {biz.lumiqScore}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">
                ${(biz.annualRevenue / 1e6).toFixed(1)}M
              </div>
              <div className="col-span-1">
                <span
                  className={cn(
                    'inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium',
                    biz.riskTier === 'low'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : biz.riskTier === 'medium'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-red-500/10 text-red-600'
                  )}
                >
                  {biz.riskTier}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-1">
                {biz.scoreTrend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                )}
                {biz.scoreTrend === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                {biz.scoreTrend === 'stable' && (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">
                  {biz.trendValue > 0 ? '+' : ''}
                  {biz.trendValue}pts
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export { BusinessListTable };
export default BusinessListTable;
