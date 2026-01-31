// Signal Drift Monitor - Model governance and data quality tracking
import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import type { SignalDrift } from './types';

interface SignalDriftMonitorProps {
  signals: SignalDrift[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  healthy: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  critical: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export const SignalDriftMonitor: React.FC<SignalDriftMonitorProps> = ({ signals }) => {
  const healthyCount = signals.filter((s) => s.status === 'healthy').length;
  const warningCount = signals.filter((s) => s.status === 'warning').length;
  const criticalCount = signals.filter((s) => s.status === 'critical').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Signal Drift Monitor</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Tracks data quality and distribution shifts
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-lg">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">{healthyCount}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">{warningCount}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded-lg">
            <XCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Signals Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Signal</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Mean Shift</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Var Shift</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Freshness</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Missing %</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => {
              const config = statusConfig[signal.status];
              const StatusIcon = config.icon;

              return (
                <motion.tr
                  key={signal.signal}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{signal.signal}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                      <span className={`text-xs font-semibold capitalize ${config.color}`}>{signal.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`font-semibold ${signal.meanShift > 0.1 ? 'text-destructive' : signal.meanShift > 0.05 ? 'text-warning' : 'text-success'}`}>
                      {(signal.meanShift * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`font-semibold ${signal.varianceShift > 0.15 ? 'text-destructive' : signal.varianceShift > 0.08 ? 'text-warning' : 'text-success'}`}>
                      {(signal.varianceShift * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {signal.dataFreshness}
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`font-semibold ${signal.missingnessRate > 2 ? 'text-destructive' : signal.missingnessRate > 1 ? 'text-warning' : 'text-success'}`}>
                      {signal.missingnessRate.toFixed(1)}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Row */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Last model validation: 4 hours ago</span>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          Run Validation
        </button>
      </div>
    </motion.div>
  );
};

export default SignalDriftMonitor;
