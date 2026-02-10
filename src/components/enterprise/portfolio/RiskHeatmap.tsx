import { motion } from 'framer-motion';
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

interface RiskHeatmapProps {
  segments: IndustrySegment[];
  className?: string;
  onCellClick?: (industry: string, riskTier: string) => void;
}

type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

const RISK_TIERS: RiskTier[] = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'];

const getRiskColorClass = (tier: RiskTier, intensity: number): string => {
  const baseColors = {
    LOW: 'bg-emerald-500',
    MODERATE: 'bg-amber-500',
    ELEVATED: 'bg-orange-500',
    HIGH: 'bg-red-500',
    CRITICAL: 'bg-red-900',
  };

  const opacities = [
    'opacity-20',
    'opacity-40',
    'opacity-60',
    'opacity-80',
    'opacity-100',
  ];

  const opacityIndex = Math.min(Math.floor(intensity * 5), 4);
  return `${baseColors[tier]} ${opacities[opacityIndex]}`;
};

const formatCurrency = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

interface HeatmapCell {
  count: number;
  exposure: number;
  intensity: number;
}

export function RiskHeatmap({ segments, className, onCellClick }: RiskHeatmapProps) {
  const heatmapData = new Map<string, Map<RiskTier, HeatmapCell>>();
  let maxCount = 0;

  segments.forEach((segment) => {
    if (!heatmapData.has(segment.name)) {
      heatmapData.set(segment.name, new Map());
    }

    const industryMap = heatmapData.get(segment.name)!;

    Object.entries(segment.riskDistribution).forEach(([key, count]) => {
      const normalizedKey = key.toUpperCase();
      let tier: RiskTier = 'MODERATE';

      if (normalizedKey.includes('LOW')) tier = 'LOW';
      else if (normalizedKey.includes('MODERATE')) tier = 'MODERATE';
      else if (normalizedKey.includes('ELEVATED')) tier = 'ELEVATED';
      else if (normalizedKey.includes('CRITICAL')) tier = 'CRITICAL';
      else if (normalizedKey.includes('HIGH')) tier = 'HIGH';

      const exposure = (segment.totalExposure * count) / segment.businessCount;

      industryMap.set(tier, { count, exposure, intensity: 0 });
      maxCount = Math.max(maxCount, count);
    });
  });

  heatmapData.forEach((industryMap) => {
    industryMap.forEach((cell) => {
      cell.intensity = maxCount > 0 ? cell.count / maxCount : 0;
    });
  });

  const industries = Array.from(heatmapData.keys());

  return (
    <div className={cn('bg-card rounded-xl border border-border p-5', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Risk Distribution Heatmap</h3>
        <p className="text-sm text-muted-foreground">
          Industry exposure by risk tier
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border">
                Industry
              </th>
              {RISK_TIERS.map((tier) => (
                <th
                  key={tier}
                  className="text-center text-xs font-medium text-muted-foreground p-2 border-b border-border"
                >
                  {tier}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {industries.map((industry, rowIndex) => {
              const industryMap = heatmapData.get(industry)!;

              return (
                <motion.tr
                  key={industry}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <td className="text-sm font-medium text-foreground p-2">
                    {industry}
                  </td>
                  {RISK_TIERS.map((tier) => {
                    const cell = industryMap.get(tier);
                    const count = cell?.count || 0;
                    const exposure = cell?.exposure || 0;
                    const intensity = cell?.intensity || 0;

                    return (
                      <td
                        key={tier}
                        className="p-1"
                        onClick={() => onCellClick?.(industry, tier)}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                          className={cn(
                            'relative group cursor-pointer rounded-lg p-2 text-center transition-all hover:scale-105',
                            count > 0 ? getRiskColorClass(tier, intensity) : 'bg-muted/20'
                          )}
                        >
                          <span className="text-xs font-semibold text-foreground">
                            {count > 0 ? count : '—'}
                          </span>

                          {count > 0 && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                              <div className="bg-popover border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                                <div className="text-xs font-medium text-foreground">
                                  {industry} - {tier}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Count: {count}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Exposure: {formatCurrency(exposure)}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Cell intensity indicates relative volume</span>
        <div className="flex items-center gap-2">
          {RISK_TIERS.map((tier) => (
            <div key={tier} className="flex items-center gap-1">
              <div className={cn('h-3 w-3 rounded', getRiskColorClass(tier, 1))} />
              <span>{tier}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
