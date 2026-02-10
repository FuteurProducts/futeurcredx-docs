import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface IndustrySegment {
  id: string;
  name: string;
  icon: string;
  businessCount: number;
  totalExposure: number;
  qualRate: number;
  avgScore: number;
  highRiskPct: number;
  trend: { direction: 'up' | 'down' | 'stable'; value: number };
  topProducts: { name: string; eligible: number }[];
  region: Record<string, number>;
  riskDistribution: Record<string, number>;
  avgRevenue: number;
  avgYearsInBusiness: number;
}

interface SegmentScatterPlotProps {
  segments: IndustrySegment[];
  className?: string;
  onSegmentClick?: (segmentId: string) => void;
}

interface ScatterDataPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  highRiskPct: number;
  businessCount: number;
}

const getColorByRisk = (highRiskPct: number): string => {
  if (highRiskPct < 8) return '#10b981';
  if (highRiskPct <= 12) return '#f59e0b';
  return '#ef4444';
};

const formatCurrency = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ScatterDataPoint;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
      <div className="font-semibold text-foreground mb-2">{data.name}</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Credit Score:</span>
          <span className="font-medium text-foreground">{data.x.toFixed(1)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Qual Rate:</span>
          <span className="font-medium text-foreground">{data.y.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Exposure:</span>
          <span className="font-medium text-foreground">{formatCurrency(data.z)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">High Risk:</span>
          <span className="font-medium text-foreground">{data.highRiskPct.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Businesses:</span>
          <span className="font-medium text-foreground">{data.businessCount}</span>
        </div>
      </div>
    </div>
  );
};

export function SegmentScatterPlot({
  segments,
  className,
  onSegmentClick,
}: SegmentScatterPlotProps) {
  const scatterData: ScatterDataPoint[] = segments.map((segment) => ({
    id: segment.id,
    name: segment.name,
    x: segment.avgScore,
    y: segment.qualRate,
    z: segment.totalExposure,
    color: getColorByRisk(segment.highRiskPct),
    highRiskPct: segment.highRiskPct,
    businessCount: segment.businessCount,
  }));

  const minExposure = Math.min(...scatterData.map((d) => d.z));
  const maxExposure = Math.max(...scatterData.map((d) => d.z));

  const handleClick = (data: ScatterDataPoint) => {
    if (onSegmentClick) {
      onSegmentClick(data.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('bg-card rounded-xl border border-border p-5', className)}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Portfolio Opportunity Map</h3>
        <p className="text-sm text-muted-foreground">
          Credit score vs qualification rate (bubble size = exposure)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="Credit Score"
            domain={[50, 90]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            label={{
              value: 'Average Credit Score',
              position: 'insideBottom',
              offset: -10,
              style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Qual Rate"
            domain={[20, 50]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            label={{
              value: 'Qualification Rate (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
            }}
          />
          <ZAxis
            type="number"
            dataKey="z"
            name="Exposure"
            range={[100, 1000]}
            domain={[minExposure, maxExposure]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            data={scatterData}
            onClick={(data) => handleClick(data as unknown as ScatterDataPoint)}
          >
            {scatterData.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.color}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Low Risk (&lt;8%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Medium Risk (8-12%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>High Risk (&gt;12%)</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Click bubbles to view segment details
        </div>
      </div>
    </motion.div>
  );
}
