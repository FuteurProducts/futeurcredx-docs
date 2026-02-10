import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import type { RiskTierDistribution } from '@/data/portfolioSegments';

interface RiskDistributionChartProps {
  tiers: RiskTierDistribution[];
  className?: string;
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ tiers, className }) => {
  const total = tiers.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className={cn('bg-card rounded-xl border border-border p-5', className)}>
      <h3 className="text-lg font-bold text-foreground mb-1">Risk Tier Distribution</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {total.toLocaleString()} businesses across {tiers.length} risk tiers
      </p>
      <div className="space-y-3">
        {tiers.map((tier) => (
          <div key={tier.tier} className="flex items-center gap-3">
            <div className="w-20 text-xs font-medium text-muted-foreground text-right">
              {tier.tier}
            </div>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${tier.percentage}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn('h-full rounded-full', tier.color)}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-foreground">
                {tier.count.toLocaleString()} ({tier.percentage}%)
              </span>
            </div>
            <div className="w-16 text-xs text-muted-foreground text-right">
              {tier.avgScore.toFixed(0)} avg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RiskDistributionChart };
export default RiskDistributionChart;
