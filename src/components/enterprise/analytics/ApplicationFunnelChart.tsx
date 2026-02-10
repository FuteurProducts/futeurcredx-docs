// Application Funnel Chart - Underwriting conversion by product
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Clock, CheckCircle, FileText, DollarSign } from 'lucide-react';
import type { ApplicationFunnelMetrics } from './types';

interface ApplicationFunnelChartProps {
  data: ApplicationFunnelMetrics[];
}

export const ApplicationFunnelChart: React.FC<ApplicationFunnelChartProps> = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState(data[0]?.product || '');
  const selected = data.find((d) => d.product === selectedProduct) || data[0];

  const stages = [
    { key: 'preQualified', label: 'Pre-qualified', icon: FileText, color: 'bg-info' },
    { key: 'applied', label: 'Applied', icon: FileText, color: 'bg-primary' },
    { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'bg-success' },
    { key: 'funded', label: 'Funded', icon: DollarSign, color: 'bg-success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-h6 font-semibold text-foreground">Application Funnel</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Pre-qual to funding conversion by product
            </div>
          </div>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2">
          {data.map((d) => (
            <button
              key={d.product}
              onClick={() => setSelectedProduct(d.product)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedProduct === d.product
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {d.product}
            </button>
          ))}
        </div>
      </div>

      {/* Funnel Bars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stages.map((stage, index) => {
          const value = selected[stage.key as keyof ApplicationFunnelMetrics] as number;
          const maxValue = selected.preQualified;
          const heightPercent = (value / maxValue) * 100;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex flex-col items-center">
              {/* Bar */}
              <div className="relative w-full h-40 bg-muted rounded-xl overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`absolute bottom-0 w-full ${stage.color} rounded-t-xl`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Icon className="w-6 h-6 text-white mb-1 drop-shadow" />
                  <span className="text-xl font-bold text-white drop-shadow">{value.toLocaleString()}</span>
                </div>
              </div>
              {/* Label */}
              <div className="mt-3 text-center">
                <div className="text-body-2 font-semibold text-foreground">{stage.label}</div>
                <div className="text-caption text-muted-foreground">{heightPercent.toFixed(0)}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="p-3 bg-muted rounded-xl text-center">
          <div className="text-h6 font-bold text-foreground">{selected.preQualToApplyRate}%</div>
          <div className="text-caption text-muted-foreground">Pre-qual → Apply</div>
        </div>
        <div className="p-3 bg-muted rounded-xl text-center">
          <div className="text-h6 font-bold text-foreground">{selected.applyToApproveRate}%</div>
          <div className="text-caption text-muted-foreground">Apply → Approve</div>
        </div>
        <div className="p-3 bg-muted rounded-xl text-center flex flex-col items-center">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-h6 font-bold text-foreground">{selected.avgTimeToDecision}</span>
            <span className="text-body-2 text-muted-foreground">days</span>
          </div>
          <div className="text-caption text-muted-foreground">Avg Time to Decision</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationFunnelChart;
