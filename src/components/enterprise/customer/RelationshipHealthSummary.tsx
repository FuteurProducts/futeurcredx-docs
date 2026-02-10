import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
   
  AlertTriangle,
  ShoppingBag,
  Lightbulb,
  Info,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface KPIData {
  avgRHS: number;
  rhsTrend: number;
  growingPercentage: number;
  growingTrend: number;
  atRiskPercentage: number;
  atRiskTrend: number;
  crossSellPenetration: number;
  crossSellTrend: number;
  topOpportunities: Array<{
    id: string;
    businessName: string;
    opportunity: string;
    estimatedValue: number;
  }>;
  rhsTrendData: Array<{ date: string; value: number }>;
}

interface RelationshipHealthSummaryProps {
  data: KPIData;
  onDrilldown: (metric: string) => void;
}

export const RelationshipHealthSummary: React.FC<RelationshipHealthSummaryProps> = ({
  data,
  onDrilldown,
}) => {
  const KPITile = ({
    label,
    value,
    trend,
    icon: Icon,
    iconColor,
    tooltip,
    metricKey,
    suffix = '',
    prefix = '',
  }: {
    label: string;
    value: number | string;
    trend: number;
    icon: React.ElementType;
    iconColor: string;
    tooltip: string;
    metricKey: string;
    suffix?: string;
    prefix?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-xl p-5 cursor-pointer group"
      onClick={() => onDrilldown(metricKey)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        <div className="relative group/tooltip">
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          <div className="absolute right-0 top-6 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-10 pointer-events-none">
            {tooltip}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-foreground">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend > 0 ? 'text-success' : trend < 0 ? 'text-destructive' : 'text-muted-foreground'
        }`}>
          {trend !== 0 && (
            trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
          )}
          <span>{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <span>View details</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPITile
          label="Avg Relationship Health"
          value={data.avgRHS}
          trend={data.rhsTrend}
          icon={Heart}
          iconColor="hsl(var(--chart-1))"
          tooltip="Composite score combining credit posture, deposit growth, product usage, digital engagement, and risk flags"
          metricKey="rhs"
          suffix="/100"
        />

        <KPITile
          label="Growing Relationships"
          value={data.growingPercentage}
          trend={data.growingTrend}
          icon={TrendingUp}
          iconColor="hsl(var(--chart-2))"
          tooltip="Percentage of clients showing positive RHS trajectory over the selected time period"
          metricKey="growing"
          suffix="%"
        />

        <KPITile
          label="At Risk Relationships"
          value={data.atRiskPercentage}
          trend={data.atRiskTrend}
          icon={AlertTriangle}
          iconColor="hsl(var(--destructive))"
          tooltip="Percentage of clients with declining RHS or negative engagement signals"
          metricKey="at-risk"
          suffix="%"
        />

        <KPITile
          label="Cross-sell Penetration"
          value={data.crossSellPenetration}
          trend={data.crossSellTrend}
          icon={ShoppingBag}
          iconColor="hsl(var(--chart-3))"
          tooltip="Average number of products per customer relative to target wallet share"
          metricKey="cross-sell"
          suffix="%"
        />
      </div>

      {/* Bottom Row: RHS Trend + Top Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RHS Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Portfolio RHS Trend</h3>
              <p className="text-xs text-muted-foreground">Relationship health over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary rounded-full" />
                <span className="text-muted-foreground">RHS Score</span>
              </div>
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.rhsTrendData}>
                <defs>
                  <linearGradient id="rhsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#rhsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Top Opportunities</h3>
          </div>

          <div className="space-y-3">
            {data.topOpportunities.slice(0, 3).map((opp, idx) => (
              <div
                key={opp.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {opp.businessName}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {opp.opportunity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-success">
                  +${(opp.estimatedValue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onDrilldown('opportunities')}
            className="w-full mt-3 py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
          >
            View all opportunities
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
