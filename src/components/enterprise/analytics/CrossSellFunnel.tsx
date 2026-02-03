// Cross-Sell Funnel - Opportunity conversion pipeline
import React from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowDown } from 'lucide-react';
import type { CrossSellFunnelStage } from './types';

interface CrossSellFunnelProps {
  stages: CrossSellFunnelStage[];
}

const stageColors = [
  'bg-info',
  'bg-info/80',
  'bg-primary',
  'bg-success/80',
  'bg-success',
];

export const CrossSellFunnel: React.FC<CrossSellFunnelProps> = ({ stages }) => {
  const maxCount = stages[0]?.count || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Cross-Sell Opportunity Funnel</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Conversion pipeline from eligible to approved
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = (stage.count / maxCount) * 100;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.stage}>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative"
                style={{ originX: 0 }}
              >
                {/* Bar */}
                <div
                  className={`${stageColors[index]} rounded-xl p-4 text-white transition-all hover:brightness-110`}
                  style={{ width: `${Math.max(widthPercent, 30)}%` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{stage.count.toLocaleString()}</div>
                      <div className="text-sm opacity-90">{stage.stage}</div>
                    </div>
                    {index > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-bold">{stage.conversionFromPrevious}%</div>
                        <div className="text-xs opacity-75">conversion</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Arrow */}
                {!isLast && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Overall Conversion */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall Conversion (Eligible → Approved)</span>
          <span className="text-lg font-bold text-foreground">
            {((stages[stages.length - 1]?.count / stages[0]?.count) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CrossSellFunnel;
