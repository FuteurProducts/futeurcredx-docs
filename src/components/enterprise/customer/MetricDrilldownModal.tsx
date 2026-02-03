import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingBag,
  Lightbulb,
  ArrowUpRight,
  Users,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from 'recharts';
import { toast } from 'sonner';

interface CustomerEntity {
  id: string;
  businessName: string;
  industry: string;
  segment: string;
  rhs: number;
  rhsChange: number;
  relationshipStage: string;
  totalExposure: number;
}

interface MetricDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string | null;
  customers: CustomerEntity[];
  onSelectCustomer: (id: string) => void;
}

// Mock detailed data for each metric
const getMetricData = (metric: string, customers: CustomerEntity[]) => {
  switch (metric) {
    case 'rhs':
      return {
        title: 'Relationship Health Score Analysis',
        subtitle: 'Detailed breakdown of portfolio RHS distribution',
        icon: Heart,
        iconColor: 'hsl(var(--chart-1))',
        distribution: [
          { range: '90-100', count: customers.filter(c => c.rhs >= 90).length, color: 'hsl(var(--chart-2))' },
          { range: '80-89', count: customers.filter(c => c.rhs >= 80 && c.rhs < 90).length, color: 'hsl(var(--chart-3))' },
          { range: '60-79', count: customers.filter(c => c.rhs >= 60 && c.rhs < 80).length, color: 'hsl(var(--chart-4))' },
          { range: '40-59', count: customers.filter(c => c.rhs >= 40 && c.rhs < 60).length, color: 'hsl(var(--chart-5))' },
          { range: '<40', count: customers.filter(c => c.rhs < 40).length, color: 'hsl(var(--destructive))' },
        ],
        trendData: [
          { month: 'Jul', value: 68, benchmark: 70 },
          { month: 'Aug', value: 70, benchmark: 70 },
          { month: 'Sep', value: 71, benchmark: 71 },
          { month: 'Oct', value: 72, benchmark: 71 },
          { month: 'Nov', value: 73, benchmark: 72 },
          { month: 'Dec', value: 74, benchmark: 72 },
        ],
        topCustomers: customers.sort((a, b) => b.rhs - a.rhs).slice(0, 5),
        insights: [
          { text: '23% of customers improved RHS by 10+ points', trend: 'up' as const },
          { text: 'Deposit growth correlates strongly with RHS', trend: 'up' as const },
          { text: 'Healthcare sector showing decline', trend: 'down' as const },
        ],
      };
    case 'growing':
      return {
        title: 'Growing Relationships',
        subtitle: 'Customers with positive RHS trajectory',
        icon: TrendingUp,
        iconColor: 'hsl(var(--chart-2))',
        distribution: [
          { range: 'Rapid Growth (+15%)', count: 12, color: 'hsl(var(--chart-2))' },
          { range: 'Steady Growth (+5-15%)', count: 45, color: 'hsl(var(--chart-3))' },
          { range: 'Moderate (+1-5%)', count: 89, color: 'hsl(var(--chart-4))' },
        ],
        trendData: [
          { month: 'Jul', value: 22, benchmark: 20 },
          { month: 'Aug', value: 24, benchmark: 21 },
          { month: 'Sep', value: 25, benchmark: 22 },
          { month: 'Oct', value: 26, benchmark: 23 },
          { month: 'Nov', value: 27, benchmark: 24 },
          { month: 'Dec', value: 28, benchmark: 25 },
        ],
        topCustomers: customers.filter(c => c.rhsChange > 0).sort((a, b) => b.rhsChange - a.rhsChange).slice(0, 5),
        insights: [
          { text: 'Technology sector leading growth', trend: 'up' as const },
          { text: 'Cross-sell success rate up 18%', trend: 'up' as const },
          { text: 'Average time-to-grow reduced by 2 weeks', trend: 'up' as const },
        ],
      };
    case 'at-risk':
      return {
        title: 'At-Risk Relationships',
        subtitle: 'Customers requiring immediate attention',
        icon: AlertTriangle,
        iconColor: 'hsl(var(--destructive))',
        distribution: [
          { range: 'Critical (<30 RHS)', count: 5, color: 'hsl(var(--destructive))' },
          { range: 'High Risk (30-45 RHS)', count: 18, color: 'hsl(var(--chart-5))' },
          { range: 'Elevated (45-55 RHS)', count: 34, color: 'hsl(var(--chart-4))' },
        ],
        trendData: [
          { month: 'Jul', value: 18, benchmark: 15 },
          { month: 'Aug', value: 16, benchmark: 14 },
          { month: 'Sep', value: 15, benchmark: 13 },
          { month: 'Oct', value: 14, benchmark: 12 },
          { month: 'Nov', value: 13, benchmark: 12 },
          { month: 'Dec', value: 12, benchmark: 11 },
        ],
        topCustomers: customers.filter(c => c.rhsChange < 0 || c.rhs < 50).sort((a, b) => a.rhs - b.rhs).slice(0, 5),
        insights: [
          { text: 'Retail sector most impacted', trend: 'down' as const },
          { text: 'Early intervention saving 67% of at-risk', trend: 'up' as const },
          { text: 'Avg recovery time: 45 days', trend: 'up' as const },
        ],
      };
    case 'cross-sell':
      return {
        title: 'Cross-Sell Penetration',
        subtitle: 'Product adoption and wallet share analysis',
        icon: ShoppingBag,
        iconColor: 'hsl(var(--chart-3))',
        distribution: [
          { range: '5+ Products', count: 15, color: 'hsl(var(--chart-2))' },
          { range: '3-4 Products', count: 42, color: 'hsl(var(--chart-3))' },
          { range: '2 Products', count: 68, color: 'hsl(var(--chart-4))' },
          { range: '1 Product', count: 45, color: 'hsl(var(--chart-5))' },
        ],
        trendData: [
          { month: 'Jul', value: 36, benchmark: 35 },
          { month: 'Aug', value: 38, benchmark: 36 },
          { month: 'Sep', value: 39, benchmark: 37 },
          { month: 'Oct', value: 40, benchmark: 38 },
          { month: 'Nov', value: 41, benchmark: 39 },
          { month: 'Dec', value: 42, benchmark: 40 },
        ],
        topCustomers: customers.sort((a, b) => b.totalExposure - a.totalExposure).slice(0, 5),
        insights: [
          { text: 'Merchant Services uptake +24%', trend: 'up' as const },
          { text: 'Equipment financing underperforming', trend: 'down' as const },
          { text: 'Bundle offers converting at 45%', trend: 'up' as const },
        ],
      };
    case 'opportunities':
      return {
        title: 'Revenue Opportunities',
        subtitle: 'AI-identified growth and upsell opportunities',
        icon: Lightbulb,
        iconColor: 'hsl(var(--warning))',
        distribution: [
          { range: 'LOC Expansion', count: 28, color: 'hsl(var(--chart-1))' },
          { range: 'Equipment Financing', count: 22, color: 'hsl(var(--chart-2))' },
          { range: 'Merchant Services', count: 35, color: 'hsl(var(--chart-3))' },
          { range: 'SBA Loans', count: 18, color: 'hsl(var(--chart-4))' },
          { range: 'Credit Cards', count: 15, color: 'hsl(var(--chart-5))' },
        ],
        trendData: [
          { month: 'Jul', value: 2.1, benchmark: 2.0 },
          { month: 'Aug', value: 2.4, benchmark: 2.1 },
          { month: 'Sep', value: 2.8, benchmark: 2.2 },
          { month: 'Oct', value: 3.2, benchmark: 2.3 },
          { month: 'Nov', value: 3.5, benchmark: 2.5 },
          { month: 'Dec', value: 3.9, benchmark: 2.6 },
        ],
        topCustomers: customers.sort((a, b) => b.totalExposure - a.totalExposure).slice(0, 5),
        insights: [
          { text: 'Total pipeline: $12.4M identified', trend: 'up' as const },
          { text: 'Win rate: 34% (up from 28%)', trend: 'up' as const },
          { text: 'Avg deal size: $45K', trend: 'up' as const },
        ],
      };
    default:
      return null;
  }
};

export const MetricDrilldownModal: React.FC<MetricDrilldownModalProps> = ({
  isOpen,
  onClose,
  metric,
  customers,
  onSelectCustomer,
}) => {
  if (!metric) return null;

  const data = getMetricData(metric, customers);
  if (!data) return null;

  const Icon = data.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${data.iconColor}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: data.iconColor }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{data.title}</h2>
                  <p className="text-sm text-muted-foreground">{data.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toast.info('Advanced filters coming soon')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <button
                  onClick={() => toast.success('Exporting metric data...')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Left: Distribution Chart */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="bg-muted/30 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Distribution</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.distribution} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="range" width={100} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {data.distribution.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-muted/30 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Key Insights</h3>
                    <div className="space-y-3">
                      {data.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                          {insight.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-sm text-foreground">{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center: Trend Chart */}
                <div className="col-span-12 lg:col-span-5">
                  <div className="bg-muted/30 rounded-xl p-5 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">Trend Analysis</h3>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: data.iconColor }} />
                          <span className="text-muted-foreground">Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-muted-foreground rounded-full opacity-50" />
                          <span className="text-muted-foreground">Benchmark</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.trendData}>
                          <defs>
                            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={data.iconColor} stopOpacity={0.2} />
                              <stop offset="95%" stopColor={data.iconColor} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="benchmark"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="transparent"
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={data.iconColor}
                            strokeWidth={2}
                            fill="url(#metricGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Right: Top Customers */}
                <div className="col-span-12 lg:col-span-3">
                  <div className="bg-muted/30 rounded-xl p-5 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">
                        {metric === 'at-risk' ? 'Needs Attention' : 'Top Performers'}
                      </h3>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      {data.topCustomers.map((customer, idx) => (
                        <motion.div
                          key={customer.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-3 bg-card rounded-lg cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => {
                            onSelectCustomer(customer.id);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-foreground line-clamp-1">
                                {customer.businessName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {customer.industry}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${
                              customer.rhs >= 70 ? 'text-success' :
                              customer.rhs >= 50 ? 'text-warning' : 'text-destructive'
                            }`}>
                              {customer.rhs}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <button
                      className="w-full mt-4 py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
                      onClick={onClose}
                    >
                      View all customers
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};