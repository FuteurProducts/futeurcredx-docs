import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Car,
  Factory,
  HardHat,
  Heart,
  Laptop,
  Minus,
  MoreHorizontal,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
  TrendingDown,
  TrendingUp,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
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

interface SegmentCardProps {
  segment: IndustrySegment;
  onSelect?: (segmentId: string) => void;
  isSelected?: boolean;
  className?: string;
}

const SEGMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Building2,
  Car,
  Factory,
  HardHat,
  Heart,
  Laptop,
  MoreHorizontal,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Utensils,
  UtensilsCrossed,
};

const formatCurrency = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'stable':
    default:
      return Minus;
  }
};

const getTrendColor = (direction: string): string => {
  switch (direction) {
    case 'up':
      return 'text-emerald-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
    default:
      return 'text-muted-foreground';
  }
};

const getRiskColor = (key: string): string => {
  const normalized = key.toUpperCase();
  if (normalized.includes('LOW')) return 'bg-emerald-500';
  if (normalized.includes('MODERATE')) return 'bg-yellow-500';
  if (normalized.includes('ELEVATED')) return 'bg-orange-500';
  if (normalized.includes('HIGH')) return 'bg-red-500';
  if (normalized.includes('CRITICAL')) return 'bg-red-900';
  return 'bg-gray-500';
};

export function SegmentCard({ segment, onSelect, isSelected, className }: SegmentCardProps) {
  const IconComponent = SEGMENT_ICONS[segment.icon] || Building2;
  const TrendIcon = getTrendIcon(segment.trend.direction);
  const trendColor = getTrendColor(segment.trend.direction);

  const totalRiskCount = Object.values(segment.riskDistribution).reduce((a, b) => a + b, 0);

  const handleClick = () => {
    if (onSelect) {
      onSelect(segment.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isSelected && 'ring-2 ring-primary shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{segment.name}</h3>
            <span className="text-xs text-muted-foreground">
              {segment.businessCount.toLocaleString()} businesses
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Exposure</div>
          <div className="text-sm font-semibold text-foreground">
            {formatCurrency(segment.totalExposure)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Qual Rate</div>
          <div className="text-sm font-semibold text-foreground">
            {segment.qualRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Avg Score</div>
          <div className="text-sm font-semibold text-foreground">
            {segment.avgScore.toFixed(0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">High Risk</div>
          <div className="text-sm font-semibold text-red-600">
            {segment.highRiskPct.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-muted-foreground mb-2">Risk Distribution</div>
        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
          {Object.entries(segment.riskDistribution).map(([key, count]) => {
            const width = totalRiskCount > 0 ? (count / totalRiskCount) * 100 : 0;
            return (
              <div
                key={key}
                className={cn(getRiskColor(key))}
                style={{ width: `${width}%` }}
                title={`${key}: ${count}`}
              />
            );
          })}
        </div>
      </div>

      <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
        <TrendIcon className="h-3 w-3" />
        <span>{Math.abs(segment.trend.value).toFixed(1)}% vs last period</span>
      </div>
    </motion.div>
  );
}
