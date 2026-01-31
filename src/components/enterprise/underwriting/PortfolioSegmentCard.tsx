import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  DollarSign,
  BarChart3,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SegmentData {
  id: string;
  name: string;
  applicationCount: number;
  totalVolume: number;
  avgLoanSize: number;
  approvalRate: number;
  avgProcessingTime: number; // in hours
  riskDistribution: { low: number; medium: number; high: number };
  trend: number; // percentage change
  topProducts: { name: string; count: number }[];
}

interface PortfolioSegmentCardProps {
  segment: SegmentData;
  onClick?: () => void;
}

const RISK_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export const PortfolioSegmentCard: React.FC<PortfolioSegmentCardProps> = ({ segment, onClick }) => {
  const riskData = [
    { name: 'Low', value: segment.riskDistribution.low },
    { name: 'Medium', value: segment.riskDistribution.medium },
    { name: 'High', value: segment.riskDistribution.high },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <span className={`flex items-center gap-0.5 text-xs font-medium ${
        isPositive ? 'text-success' : 'text-destructive'
      }`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{segment.name}</h3>
            <p className="text-xs text-muted-foreground">{segment.applicationCount.toLocaleString()} applications</p>
          </div>
        </div>
        <TrendIndicator value={segment.trend} />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            Total Volume
          </div>
          <div className="font-bold text-lg text-foreground">{formatCurrency(segment.totalVolume)}</div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <BarChart3 className="w-3 h-3" />
            Avg. Loan Size
          </div>
          <div className="font-bold text-lg text-foreground">{formatCurrency(segment.avgLoanSize)}</div>
        </div>
      </div>

      {/* Approval Rate & Processing Time */}
      <div className="flex items-center justify-between py-3 border-t border-b border-border mb-4">
        <div className="text-center flex-1">
          <div className="text-2xl font-bold text-success">{segment.approvalRate}%</div>
          <div className="text-xs text-muted-foreground">Approval Rate</div>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center flex-1">
          <div className="text-2xl font-bold text-info">{segment.avgProcessingTime}h</div>
          <div className="text-xs text-muted-foreground">Avg. Processing</div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={18}
                outerRadius={28}
                paddingAngle={2}
                dataKey="value"
                stroke="transparent"
              >
                {riskData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={RISK_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              Low Risk
            </span>
            <span className="font-medium text-foreground">{segment.riskDistribution.low}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Medium
            </span>
            <span className="font-medium text-foreground">{segment.riskDistribution.medium}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              High Risk
            </span>
            <span className="font-medium text-foreground">{segment.riskDistribution.high}%</span>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Top Products</p>
        <div className="flex flex-wrap gap-1.5">
          {segment.topProducts.slice(0, 3).map(product => (
            <span
              key={product.name}
              className="px-2 py-1 bg-info/10 text-info rounded text-xs font-medium"
            >
              {product.name} ({product.count})
            </span>
          ))}
        </div>
      </div>

      {/* View Details Link */}
      <button className="mt-4 w-full flex items-center justify-center gap-1 text-sm text-info font-medium hover:text-info/80 transition-colors">
        View Segment Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Mock data for segments
export const PORTFOLIO_SEGMENTS: SegmentData[] = [
  {
    id: 'micro',
    name: 'Micro Business',
    applicationCount: 847293,
    totalVolume: 4200000000,
    avgLoanSize: 45000,
    approvalRate: 72,
    avgProcessingTime: 2.4,
    riskDistribution: { low: 45, medium: 38, high: 17 },
    trend: 12.5,
    topProducts: [
      { name: 'Working Capital', count: 312000 },
      { name: 'Line of Credit', count: 198000 },
      { name: 'Equipment', count: 145000 },
    ],
  },
  {
    id: 'small',
    name: 'Small Business',
    applicationCount: 423156,
    totalVolume: 12800000000,
    avgLoanSize: 285000,
    approvalRate: 68,
    avgProcessingTime: 4.8,
    riskDistribution: { low: 52, medium: 32, high: 16 },
    trend: 8.2,
    topProducts: [
      { name: 'SBA 7(a)', count: 156000 },
      { name: 'Term Loan', count: 124000 },
      { name: 'Equipment', count: 89000 },
    ],
  },
  {
    id: 'mid-market',
    name: 'Mid-Market',
    applicationCount: 89472,
    totalVolume: 28500000000,
    avgLoanSize: 2850000,
    approvalRate: 58,
    avgProcessingTime: 12.5,
    riskDistribution: { low: 38, medium: 42, high: 20 },
    trend: -2.4,
    topProducts: [
      { name: 'Commercial RE', count: 34000 },
      { name: 'SBA 504', count: 28000 },
      { name: 'Equipment', count: 15000 },
    ],
  },
];
