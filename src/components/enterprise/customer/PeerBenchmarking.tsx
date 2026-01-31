import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  DollarSign, 
  MapPin,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowRight,
  
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface PeerMetrics {
  category: string;
  yourValue: number;
  peerAvg: number;
  peerMedian: number;
  percentile: number;
}

interface PeerBenchmarkingProps {
  currentBusiness: {
    id: string;
    name: string;
    industry: string;
    naicsCode: string;
    revenueBand: string;
    region: string;
  };
  peerGroup: {
    count: number;
    industryMatch: number;
    revenueBandMatch: number;
    regionMatch: number;
  };
  metrics: PeerMetrics[];
  onViewPeerList: () => void;
}

const METRIC_CONFIG: Record<string, { label: string; format: (v: number) => string; icon: React.ElementType }> = {
  'rhs': { label: 'Relationship Health Score', format: (v) => `${v}/100`, icon: TrendingUp },
  'depositBalance': { label: 'Avg Deposit Balance', format: (v) => `$${(v / 1000).toFixed(0)}K`, icon: DollarSign },
  'productCount': { label: 'Products per Customer', format: (v) => v.toFixed(1), icon: BarChart3 },
  'creditScore': { label: 'Avg Credit Score', format: (v) => v.toString(), icon: Building2 },
};

export const PeerBenchmarking: React.FC<PeerBenchmarkingProps> = ({
  currentBusiness,
  peerGroup,
  metrics,
  onViewPeerList,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<'industry' | 'revenue' | 'region'>('industry');

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'hsl(var(--chart-2))';
    if (percentile >= 50) return 'hsl(var(--primary))';
    if (percentile >= 25) return 'hsl(var(--chart-4))';
    return 'hsl(var(--destructive))';
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 90) return 'Top 10%';
    if (percentile >= 75) return 'Top 25%';
    if (percentile >= 50) return 'Above Median';
    if (percentile >= 25) return 'Below Median';
    return 'Bottom 25%';
  };

  const chartData = metrics.map((m) => ({
    name: METRIC_CONFIG[m.category]?.label || m.category,
    yours: m.yourValue,
    peerAvg: m.peerAvg,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Peer Benchmarking</h3>
          </div>
          <button
            onClick={onViewPeerList}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View peer list <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Business Context */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-foreground">
            <Building2 className="inline h-3 w-3 mr-1" />
            {currentBusiness.industry}
          </span>
          <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-foreground">
            <DollarSign className="inline h-3 w-3 mr-1" />
            {currentBusiness.revenueBand}
          </span>
          <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-foreground">
            <MapPin className="inline h-3 w-3 mr-1" />
            {currentBusiness.region}
          </span>
        </div>

        {/* Dimension Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Compare by:</span>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {[
              { id: 'industry', label: 'Industry', count: peerGroup.industryMatch },
              { id: 'revenue', label: 'Revenue Band', count: peerGroup.revenueBandMatch },
              { id: 'region', label: 'Region', count: peerGroup.regionMatch },
            ].map((dim) => (
              <button
                key={dim.id}
                onClick={() => setSelectedDimension(dim.id as typeof selectedDimension)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  selectedDimension === dim.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {dim.label}
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                  {dim.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Peer Group Stats */}
      <div className="px-5 py-4 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Peer Group Size</p>
            <p className="text-lg font-bold text-foreground">{peerGroup.count.toLocaleString()} businesses</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">NAICS Code</p>
            <p className="text-sm font-medium text-foreground">{currentBusiness.naicsCode}</p>
          </div>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="p-5">
        <div className="space-y-4">
          {metrics.map((metric) => {
            const config = METRIC_CONFIG[metric.category];
            const Icon = config?.icon || BarChart3;
            const percentileColor = getPercentileColor(metric.percentile);
            const isAboveAvg = metric.yourValue >= metric.peerAvg;

            return (
              <div key={metric.category} className="p-4 bg-muted/30 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {config?.label || metric.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getPercentileLabel(metric.percentile)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {isAboveAvg 
                        ? <TrendingUp className="h-3 w-3 text-success" />
                        : <TrendingDown className="h-3 w-3 text-destructive" />
                      }
                      <span className="text-lg font-bold" style={{ color: percentileColor }}>
                        {config?.format(metric.yourValue)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs {config?.format(metric.peerAvg)} avg
                    </p>
                  </div>
                </div>

                {/* Percentile Bar */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{ 
                      width: `${metric.percentile}%`,
                      backgroundColor: percentileColor,
                    }}
                  />
                  {/* Median marker */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/50"
                    style={{ left: '50%' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>0%</span>
                  <span>Median</span>
                  <span>100%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Chart */}
        <div className="mt-6">
          <p className="text-xs font-medium text-muted-foreground mb-3">Your Business vs Peer Average</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="yours" name="Your Business" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="peerAvg" name="Peer Average" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
