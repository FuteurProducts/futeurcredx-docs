import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  Users,
  Target,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricData {
  value: number | string;
  label: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  sparkline?: { value: number }[];
}

interface UnderwritingMetricsCardProps {
  metrics: MetricData[];
  title?: string;
}

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

export const UnderwritingMetricsCard: React.FC<UnderwritingMetricsCardProps> = ({ 
  metrics,
  title = 'Underwriting Performance'
}) => {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-info" />
        {title}
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden"
            >
              <div className={`p-4 rounded-xl ${metric.bgColor} border border-border`}>
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {metric.change !== undefined && <TrendIndicator value={metric.change} />}
                </div>
                
                <div className="mb-1">
                  <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>

                {metric.changeLabel && (
                  <p className="text-xs text-muted-foreground mt-1">{metric.changeLabel}</p>
                )}
                
                {metric.sparkline && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metric.sparkline}>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="transparent"
                          fill="#3b82f6"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Default metrics for underwriting dashboard
export const DEFAULT_UNDERWRITING_METRICS: MetricData[] = [
  {
    value: '94.7%',
    label: 'AI Accuracy',
    change: 2.3,
    changeLabel: 'vs last month',
    icon: Target,
    color: 'bg-success',
    bgColor: 'bg-success/10',
    sparkline: [{ value: 90 }, { value: 91 }, { value: 92 }, { value: 93 }, { value: 94 }, { value: 95 }],
  },
  {
    value: '4.2min',
    label: 'Avg Decision Time',
    change: -15.2,
    changeLabel: 'faster than manual',
    icon: Clock,
    color: 'bg-info',
    bgColor: 'bg-info/10',
    sparkline: [{ value: 8 }, { value: 7 }, { value: 6 }, { value: 5 }, { value: 4 }, { value: 4 }],
  },
  {
    value: '847',
    label: 'Auto-Approved Today',
    change: 12.5,
    changeLabel: 'vs yesterday',
    icon: Zap,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    value: '6.3%',
    label: 'Human Override Rate',
    change: -0.8,
    changeLabel: 'improving',
    icon: Users,
    color: 'bg-warning',
    bgColor: 'bg-warning/10',
  },
];

export const DAILY_STATS_METRICS: MetricData[] = [
  {
    value: '2,847',
    label: 'Applications Received',
    change: 8.5,
    icon: BarChart3,
    color: 'bg-muted-foreground',
    bgColor: 'bg-muted',
  },
  {
    value: '2,156',
    label: 'Approved',
    change: 12.3,
    icon: CheckCircle2,
    color: 'bg-success',
    bgColor: 'bg-success/10',
  },
  {
    value: '534',
    label: 'In Review',
    change: -5.2,
    icon: AlertTriangle,
    color: 'bg-warning',
    bgColor: 'bg-warning/10',
  },
  {
    value: '157',
    label: 'Declined',
    change: -2.1,
    icon: XCircle,
    color: 'bg-destructive',
    bgColor: 'bg-destructive/10',
  },
];
