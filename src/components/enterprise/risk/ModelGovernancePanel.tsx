import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, AlertTriangle, FileText, TrendingUp, BarChart3 } from 'lucide-react';

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  deployedDate: string;
  lastValidationDate: string;
  nextValidationDue: string;
  status: 'ok' | 'warning' | 'breach';
  type: 'credit_score' | 'pd' | 'lgd' | 'ead' | 'ews' | 'fraud';
}

export interface FeatureDrift {
  feature: string;
  driftScore: number;
  threshold: number;
  status: 'ok' | 'warning' | 'breach';
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface OutcomeMonitoring {
  metric: string;
  expected: number;
  actual: number;
  variance: number;
  status: 'ok' | 'warning' | 'breach';
}

export interface ModelGovernancePanelProps {
  models: ModelInfo[];
  featureDrifts: FeatureDrift[];
  outcomeMonitoring: OutcomeMonitoring[];
  overallStatus: 'ok' | 'warning' | 'breach';
  className?: string;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ok': return { bg: 'bg-success/10', text: 'text-success', badge: 'bg-success', icon: CheckCircle2 };
    case 'warning': return { bg: 'bg-warning/10', text: 'text-warning', badge: 'bg-warning', icon: AlertTriangle };
    case 'breach': return { bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-500', icon: AlertTriangle };
    default: return { bg: 'bg-muted', text: 'text-foreground', badge: 'bg-muted-foreground', icon: CheckCircle2 };
  }
};

export const ModelGovernancePanel: React.FC<ModelGovernancePanelProps> = ({
  models,
  featureDrifts,
  outcomeMonitoring,
  overallStatus,
  className = '',
}) => {
  const style = getStatusStyle(overallStatus);
  const StatusIcon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
            <Cpu className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Model Governance</h3>
            <p className="text-sm text-muted-foreground">SR 11-7 compliant model risk management</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${style.bg}`}>
          <StatusIcon className={`w-4 h-4 ${style.text}`} />
          <span className={`text-sm font-semibold ${style.text}`}>
            {overallStatus === 'ok' ? 'All Models OK' : overallStatus === 'warning' ? 'Warnings Detected' : 'Action Required'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Active Models */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Deployed Models</span>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-2 md:grid-cols-1">
            {models.map((model) => {
              const modelStyle = getStatusStyle(model.status);
              const ModelStatusIcon = modelStyle.icon;
              return (
                <div
                  key={model.id}
                  className={`p-4 rounded-xl border ${modelStyle.bg} border-border/50`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-foreground">{model.name}</div>
                      <div className="text-xs text-muted-foreground">v{model.version}</div>
                    </div>
                    <ModelStatusIcon className={`w-5 h-5 ${modelStyle.text}`} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deployed:</span>
                      <span className="font-medium">{model.deployedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Validated:</span>
                      <span className="font-medium">{model.lastValidationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Validation:</span>
                      <span className={`font-medium ${model.status === 'warning' ? 'text-warning' : ''}`}>
                        {model.nextValidationDue}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Drift */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Feature Drift Monitoring</span>
            <span className="text-xs text-muted-foreground">(Top drifting signals)</span>
          </div>
          <div className="space-y-2">
            {featureDrifts.slice(0, 5).map((drift) => {
              const driftStyle = getStatusStyle(drift.status);
              return (
                <div
                  key={drift.feature}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">{drift.feature}</div>
                    <div className="text-xs text-muted-foreground">
                      Threshold: {drift.threshold}
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Drift Score</span>
                      <span className={`font-semibold ${driftStyle.text}`}>{drift.driftScore}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${driftStyle.badge}`}
                        style={{ width: `${Math.min((drift.driftScore / drift.threshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${driftStyle.bg} ${driftStyle.text}`}>
                    {drift.status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcome Monitoring */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Outcome Monitoring</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Metric</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Expected</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Actual</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Variance</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {outcomeMonitoring.map((metric) => {
                  const metricStyle = getStatusStyle(metric.status);
                  return (
                    <tr key={metric.metric} className="border-b border-border/50">
                      <td className="py-2 px-3 font-medium text-foreground">{metric.metric}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">{metric.expected}%</td>
                      <td className="py-2 px-3 text-right font-medium">{metric.actual}%</td>
                      <td className={`py-2 px-3 text-right font-medium ${
                        metric.variance > 0 ? 'text-rose-600' : 'text-success'
                      }`}>
                        {metric.variance > 0 ? '+' : ''}{metric.variance}%
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${metricStyle.bg} ${metricStyle.text}`}>
                          {metric.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelGovernancePanel;
