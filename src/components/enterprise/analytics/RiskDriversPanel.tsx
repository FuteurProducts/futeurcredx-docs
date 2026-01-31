// Risk Drivers Panel - Top risk factors with impact ranking
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Users,
  Info,
} from 'lucide-react';
import type { RiskDriver } from './types';

interface RiskDriversPanelProps {
  drivers: RiskDriver[];
  onViewClients?: (driverId: string) => void;
}

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
};

export const RiskDriversPanel: React.FC<RiskDriversPanelProps> = ({ drivers, onViewClients }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Top Risk Drivers</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Ranked by portfolio impact contribution
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">Ranked by impact</span>
      </div>

      {/* Drivers List */}
      <div className="space-y-3">
        {drivers.map((driver, index) => {
          const colors = severityColors[driver.severity];
          const TrendIcon = driver.trend === 'increasing' ? TrendingUp : driver.trend === 'decreasing' ? TrendingDown : Minus;
          const isExpanded = expandedId === driver.id;

          return (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-xl overflow-hidden ${colors.border}`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : driver.id)}
                className={`w-full p-4 flex items-center gap-4 ${colors.bg} hover:brightness-95 transition-all`}
              >
                {/* Rank */}
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Driver Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{driver.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors.text} bg-card`}>
                      {driver.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {driver.affectedClients.toLocaleString()} clients
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendIcon className={`w-3 h-3 ${driver.trend === 'increasing' ? 'text-destructive' : driver.trend === 'decreasing' ? 'text-success' : ''}`} />
                      {driver.trend}
                    </span>
                  </div>
                </div>

                {/* Impact Bar */}
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Impact</span>
                    <span className="font-semibold">{driver.impact}%</span>
                  </div>
                  <div className="h-2 bg-card rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${driver.severity === 'critical' ? 'bg-destructive' : driver.severity === 'high' ? 'bg-orange-500' : 'bg-warning'}`}
                      style={{ width: `${driver.impact}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-card border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">{driver.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewClients?.(driver.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          View Affected Clients
                        </button>
                        <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-semibold transition-colors">
                          View Trend
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RiskDriversPanel;
