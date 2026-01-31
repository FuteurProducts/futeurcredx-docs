import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Info } from 'lucide-react';

export interface HeatmapCell {
  row: string;
  column: string;
  value: number;
  count: number;
  exposure: number;
  change: number;
}

export interface HeatmapConfig {
  id: string;
  title: string;
  description: string;
  rows: string[];
  columns: string[];
  data: HeatmapCell[];
}

export interface RiskHeatmapMatrixProps {
  heatmaps: HeatmapConfig[];
  className?: string;
  onCellClick?: (cell: HeatmapCell, heatmapId: string) => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
};

const getHeatColor = (value: number, max: number): string => {
  const intensity = Math.min(value / max, 1);
  if (intensity < 0.2) return 'bg-success/10 text-success';
  if (intensity < 0.4) return 'bg-success/20 text-success';
  if (intensity < 0.6) return 'bg-warning/20 text-warning';
  if (intensity < 0.8) return 'bg-orange-300 text-orange-900';
  return 'bg-rose-400 text-rose-900';
};

const HeatmapGrid: React.FC<{
  config: HeatmapConfig;
  onCellClick?: (cell: HeatmapCell) => void;
}> = ({ config, onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  
  const maxValue = Math.max(...config.data.map(d => d.value));
  
  const getCellData = (row: string, column: string): HeatmapCell | undefined => {
    return config.data.find(d => d.row === row && d.column === column);
  };

  return (
    <div className="relative">
      {/* Column Headers */}
      <div className="flex mb-2">
        <div className="w-28 shrink-0" /> {/* Spacer for row labels */}
        {config.columns.map((col) => (
          <div 
            key={col} 
            className="flex-1 text-center text-xs font-medium text-muted-foreground px-1 truncate"
            title={col}
          >
            {col}
          </div>
        ))}
      </div>
      
      {/* Grid Rows */}
      <div className="space-y-1">
        {config.rows.map((row) => (
          <div key={row} className="flex items-center gap-1">
            {/* Row Label */}
            <div className="w-28 shrink-0 text-xs font-medium text-muted-foreground pr-2 text-right truncate" title={row}>
              {row}
            </div>
            
            {/* Cells */}
            {config.columns.map((col) => {
              const cell = getCellData(row, col);
              const value = cell?.value || 0;
              const colorClass = getHeatColor(value, maxValue);
              
              return (
                <div
                  key={`${row}-${col}`}
                  className={`flex-1 h-10 rounded-md ${colorClass} flex items-center justify-center text-xs font-semibold cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1 relative`}
                  onMouseEnter={() => setHoveredCell(cell || null)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => cell && onCellClick?.(cell)}
                >
                  {value > 0 ? formatNumber(cell?.count || 0) : '-'}
                  
                  {/* Hover Tooltip */}
                  {hoveredCell === cell && cell && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-popover border border-border rounded-lg shadow-lg p-3 min-w-[180px]"
                    >
                      <div className="text-sm font-semibold text-foreground mb-2">
                        {row} × {col}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accounts:</span>
                          <span className="font-medium">{formatNumber(cell.count)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Exposure:</span>
                          <span className="font-medium">${formatNumber(cell.exposure)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk Score:</span>
                          <span className="font-medium">{cell.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">30d Change:</span>
                          <span className={`font-medium ${cell.change > 0 ? 'text-rose-600' : 'text-success'}`}>
                            {cell.change > 0 ? '+' : ''}{cell.change}%
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Risk Level:</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 rounded bg-success/10" />
          <div className="w-6 h-3 rounded bg-success/20" />
          <div className="w-6 h-3 rounded bg-warning/20" />
          <div className="w-6 h-3 rounded bg-orange-300" />
          <div className="w-6 h-3 rounded bg-rose-400" />
        </div>
        <span className="text-xs text-muted-foreground">Low → High</span>
      </div>
    </div>
  );
};

export const RiskHeatmapMatrix: React.FC<RiskHeatmapMatrixProps> = ({
  heatmaps,
  className = '',
  onCellClick,
}) => {
  const [activeHeatmap, setActiveHeatmap] = useState(heatmaps[0]?.id || '');

  const currentHeatmap = heatmaps.find(h => h.id === activeHeatmap);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Portfolio Risk Heatmaps</h3>
            <p className="text-sm text-muted-foreground">Multi-dimensional risk distribution analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
          {heatmaps.map((heatmap) => (
            <button
              key={heatmap.id}
              onClick={() => setActiveHeatmap(heatmap.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeHeatmap === heatmap.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {heatmap.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current Heatmap */}
      {currentHeatmap && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{currentHeatmap.description}</span>
          </div>
          <HeatmapGrid 
            config={currentHeatmap} 
            onCellClick={(cell) => onCellClick?.(cell, currentHeatmap.id)}
          />
        </div>
      )}
    </motion.div>
  );
};

export default RiskHeatmapMatrix;
