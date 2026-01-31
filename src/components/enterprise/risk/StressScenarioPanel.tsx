import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Activity, ChevronRight, BarChart2 } from 'lucide-react';

export interface StressScenario {
  id: string;
  name: string;
  type: 'recession' | 'rate_shock' | 'industry_stress' | 'custom';
  severity: 'mild' | 'moderate' | 'severe';
  assumptions: {
    rateChange: number;
    revenueDecline: number;
    unemploymentIncrease: number;
  };
}

export interface MigrationMatrix {
  fromTier: string;
  toTier: string;
  currentPct: number;
  stressedPct: number;
  delta: number;
}

export interface StressImpact {
  metric: string;
  baseline: number;
  stressed: number;
  change: number;
  unit: string;
}

export interface StressScenarioPanelProps {
  scenarios: StressScenario[];
  selectedScenarioId: string;
  migrationMatrix: MigrationMatrix[];
  impacts: StressImpact[];
  portfolioSize: number;
  expectedLossBaseline: number;
  expectedLossStressed: number;
  onScenarioChange?: (scenarioId: string) => void;
  className?: string;
}

const formatCurrency = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'mild': return 'bg-info/10 text-info';
    case 'moderate': return 'bg-warning/10 text-warning';
    case 'severe': return 'bg-destructive/10 text-destructive';
    default: return 'bg-muted text-foreground';
  }
};

export const StressScenarioPanel: React.FC<StressScenarioPanelProps> = ({
  scenarios,
  selectedScenarioId,
  migrationMatrix,
  impacts,
  portfolioSize,
  expectedLossBaseline,
  expectedLossStressed,
  onScenarioChange,
  className = '',
}) => {
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  const lossIncrease = expectedLossStressed - expectedLossBaseline;
  const lossIncreasePct = ((lossIncrease / expectedLossBaseline) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Stress & Scenario Analysis</h3>
            <p className="text-sm text-muted-foreground">CECL-aligned portfolio stress testing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedScenarioId}
            onChange={(e) => onScenarioChange?.(e.target.value)}
            className="h-9 px-3 bg-muted border-0 rounded-lg text-sm font-medium"
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scenario Summary */}
        {selectedScenario && (
          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{selectedScenario.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(selectedScenario.severity)}`}>
                  {selectedScenario.severity.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Rate Shock</div>
                <div className="font-semibold text-foreground">
                  {selectedScenario.assumptions.rateChange > 0 ? '+' : ''}{selectedScenario.assumptions.rateChange}bps
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Revenue Decline</div>
                <div className="font-semibold text-rose-600">-{selectedScenario.assumptions.revenueDecline}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Unemployment Δ</div>
                <div className="font-semibold text-foreground">+{selectedScenario.assumptions.unemploymentIncrease}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Key Impact Summary */}
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="text-xs text-muted-foreground mb-1">Portfolio at Risk</div>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(portfolioSize)}</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="text-xs text-muted-foreground mb-1">Expected Loss (Baseline)</div>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(expectedLossBaseline)}</div>
          </div>
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
            <div className="text-xs text-rose-600 mb-1">Expected Loss (Stressed)</div>
            <div className="text-2xl font-bold text-rose-700">{formatCurrency(expectedLossStressed)}</div>
            <div className="flex items-center gap-1 mt-1 text-sm text-rose-600">
              <TrendingDown className="w-4 h-4" />
              <span>+{formatCurrency(lossIncrease)} ({lossIncreasePct}%)</span>
            </div>
          </div>
        </div>

        {/* Migration Matrix */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Risk Tier Migration</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">From → To</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Current</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Stressed</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Δ</th>
                </tr>
              </thead>
              <tbody>
                {migrationMatrix.filter(m => m.delta !== 0).slice(0, 8).map((migration, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{migration.fromTier}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className={`font-medium ${
                          migration.toTier === 'High' || migration.toTier === 'Watch' || migration.toTier === 'Default'
                            ? 'text-rose-600' : ''
                        }`}>{migration.toTier}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-muted-foreground">{migration.currentPct}%</td>
                    <td className="py-2 px-3 text-right font-medium">{migration.stressedPct}%</td>
                    <td className={`py-2 px-3 text-right font-medium ${
                      migration.delta > 0 ? 'text-rose-600' : 'text-success'
                    }`}>
                      {migration.delta > 0 ? '+' : ''}{migration.delta}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Stress Impact by Metric</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {impacts.map((impact) => (
              <div key={impact.metric} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{impact.metric}</span>
                  <span className={`text-sm font-bold ${impact.change > 0 ? 'text-rose-600' : 'text-success'}`}>
                    {impact.change > 0 ? '+' : ''}{impact.change}{impact.unit}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground/30 rounded-full"
                        style={{ width: `${(impact.baseline / (impact.baseline + Math.abs(impact.change))) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground w-24 text-right">
                    {impact.baseline}{impact.unit} → {impact.stressed}{impact.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StressScenarioPanel;
