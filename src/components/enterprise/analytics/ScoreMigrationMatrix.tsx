// Score Migration Matrix - Band-to-band movement analysis
import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ScoreMigrationMatrix as MigrationData } from './types';

interface ScoreMigrationMatrixProps {
  data: MigrationData;
}

const getCellColor = (direction: 'upgrade' | 'downgrade' | 'stable', percent: number): string => {
  if (direction === 'stable') {
    return 'bg-muted';
  }
  if (direction === 'upgrade') {
    if (percent > 15) return 'bg-green-200';
    if (percent > 5) return 'bg-green-100';
    return 'bg-green-50';
  }
  // downgrade
  if (percent > 10) return 'bg-red-200';
  if (percent > 5) return 'bg-red-100';
  return 'bg-red-50';
};

export const ScoreMigrationMatrix: React.FC<ScoreMigrationMatrixProps> = ({ data }) => {
  const bands = data.bands;

  // Create matrix from cells
  const matrix: Record<string, Record<string, { percent: number; count: number; direction: 'upgrade' | 'downgrade' | 'stable' }>> = {};
  bands.forEach((from) => {
    matrix[from] = {};
    bands.forEach((to) => {
      const cell = data.cells.find((c) => c.fromBand === from && c.toBand === to);
      if (cell) {
        matrix[from][to] = { percent: cell.percent, count: cell.count, direction: cell.direction };
      }
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Score Migration Matrix</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Score band transitions over {data.period}
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">Period: {data.period}</span>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-semibold text-muted-foreground uppercase">From \ To</th>
              {bands.map((band) => (
                <th key={band} className="p-2 text-center text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">
                  {band}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bands.map((fromBand) => (
              <tr key={fromBand}>
                <td className="p-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">{fromBand}</td>
                {bands.map((toBand) => {
                  const cell = matrix[fromBand]?.[toBand];
                  if (!cell) return <td key={toBand} className="p-2" />;
                  return (
                    <td key={toBand} className="p-1">
                      <div
                        className={`p-2 rounded-lg text-center ${getCellColor(cell.direction, cell.percent)}`}
                      >
                        <div className="font-semibold text-foreground">{cell.percent}%</div>
                        <div className="text-[10px] text-muted-foreground">{cell.count.toLocaleString()}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-lg font-bold text-green-700">{data.summary.upgradedPercent}%</div>
            <div className="text-xs text-green-600">Upgraded</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
          <Minus className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-lg font-bold text-foreground">{data.summary.stablePercent}%</div>
            <div className="text-xs text-muted-foreground">Stable</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <div>
            <div className="text-lg font-bold text-red-700">{data.summary.downgradedPercent}%</div>
            <div className="text-xs text-red-600">Downgraded</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreMigrationMatrix;
