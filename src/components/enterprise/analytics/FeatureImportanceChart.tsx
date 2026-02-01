// Feature Importance Chart - Model signal contribution ranking
import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { FeatureImportance } from './types';

interface FeatureImportanceChartProps {
  features: FeatureImportance[];
}

const categoryColors: Record<string, string> = {
  'Financial Health': 'bg-info',
  'Credit Behavior': 'bg-purple-500',
  'External Data': 'bg-cyan-500',
  'Market Factors': 'bg-orange-500',
  'Business Profile': 'bg-success',
};

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ features }) => {
  const sortedFeatures = [...features].sort((a, b) => b.importance - a.importance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">LUMIQ AI Signal Importance</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Contribution of each signal to LUMIQ AI score
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">Model v2.4.1</span>
      </div>

      {/* Feature Bars */}
      <div className="space-y-4">
        {sortedFeatures.map((feature, index) => {
          const TrendIcon = feature.trend === 'increasing' ? TrendingUp : feature.trend === 'decreasing' ? TrendingDown : Minus;
          const barColor = categoryColors[feature.category] || 'bg-muted-foreground';

          return (
            <motion.div
              key={feature.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{feature.feature}</span>
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                    {feature.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon
                    className={`w-4 h-4 ${
                      feature.trend === 'increasing' ? 'text-orange-500' : feature.trend === 'decreasing' ? 'text-success' : 'text-muted-foreground'
                    }`}
                  />
                  <span className="font-bold text-foreground">{feature.importance}%</span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${feature.importance}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  className={`h-full ${barColor} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeatureImportanceChart;
