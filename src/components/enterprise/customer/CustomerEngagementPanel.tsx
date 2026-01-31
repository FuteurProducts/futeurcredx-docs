import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Smartphone,
  
  Activity,
  CheckCircle,
  AlertTriangle,
  Zap,
  ChevronRight,
  Clock
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ProductStatus {
  product: string;
  status: 'active' | 'approved' | 'not-held';
  signal: 'healthy' | 'growing' | 'underutilized' | 'high-spend' | 'opportunity';
  utilization?: number;
}

interface TimelineEvent {
  id: string;
  type: 'login' | 'payment' | 'alert' | 'credit-change' | 'offer' | 'touchpoint';
  title: string;
  description: string;
  timestamp: string;
  impact?: 'positive' | 'negative' | 'neutral';
}

interface CustomerEngagementPanelProps {
  customer: {
    id: string;
    businessName: string;
    rhs: number;
    rhsStatus: 'growing' | 'stable' | 'declining';
    rhsTrendData: Array<{ month: string; value: number }>;
    topDrivers: Array<{ label: string; impact: 'positive' | 'negative' }>;
    products: ProductStatus[];
    timeline: TimelineEvent[];
  };
}

const SIGNAL_CONFIG = {
  'healthy': { label: '✅ Healthy', color: 'hsl(var(--chart-2))' },
  'growing': { label: '↑ Growing', color: 'hsl(var(--chart-2))' },
  'underutilized': { label: '⚠️ Underutilized', color: 'hsl(var(--chart-4))' },
  'high-spend': { label: '🔥 High Spend', color: 'hsl(var(--chart-1))' },
  'opportunity': { label: '💡 Opportunity', color: 'hsl(var(--primary))' },
};

const STATUS_CONFIG = {
  'active': { label: 'Active', bg: 'bg-success/10', text: 'text-success' },
  'approved': { label: 'Approved', bg: 'bg-warning/10', text: 'text-warning' },
  'not-held': { label: 'Not Held', bg: 'bg-muted', text: 'text-muted-foreground' },
};

const EVENT_ICONS = {
  'login': Smartphone,
  'payment': DollarSign,
  'alert': AlertTriangle,
  'credit-change': Activity,
  'offer': Zap,
  'touchpoint': Heart,
};

export const CustomerEngagementPanel: React.FC<CustomerEngagementPanelProps> = ({
  customer,
}) => {
  const getRHSColor = (rhs: number) => {
    if (rhs >= 80) return 'hsl(var(--chart-2))';
    if (rhs >= 60) return 'hsl(var(--primary))';
    if (rhs >= 40) return 'hsl(var(--chart-4))';
    return 'hsl(var(--destructive))';
  };

  const getRHSStatusConfig = (status: string) => {
    switch (status) {
      case 'growing': return { label: 'Growing', icon: TrendingUp, color: 'text-success' };
      case 'declining': return { label: 'Declining', icon: TrendingDown, color: 'text-destructive' };
      default: return { label: 'Stable', icon: Activity, color: 'text-muted-foreground' };
    }
  };

  const statusConfig = getRHSStatusConfig(customer.rhsStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-4">
      {/* Relationship Health Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Relationship Health</h3>
        </div>

        {/* Big RHS Display */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <span
              className="text-5xl font-bold"
              style={{ color: getRHSColor(customer.rhs) }}
            >
              {customer.rhs}
            </span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            customer.rhsStatus === 'growing' ? 'bg-success/10' :
            customer.rhsStatus === 'declining' ? 'bg-destructive/10' : 'bg-muted'
          }`}>
            <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="h-24 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customer.rhsTrendData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[0, 100]} 
                hide 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getRHSColor(customer.rhs)}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Drivers */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Top 3 Drivers</p>
          <div className="space-y-2">
            {customer.topDrivers.slice(0, 3).map((driver, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                {driver.impact === 'positive' 
                  ? <CheckCircle className="h-4 w-4 text-success" />
                  : <AlertTriangle className="h-4 w-4 text-warning" />
                }
                <span className="text-sm text-foreground">{driver.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product Footprint Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Product Footprint</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">Product</th>
                <th className="text-center py-2 font-medium">Status</th>
                <th className="text-right py-2 font-medium">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customer.products.map((product) => {
                const statusCfg = STATUS_CONFIG[product.status];
                const signalCfg = SIGNAL_CONFIG[product.signal];

                return (
                  <tr key={product.product} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{product.product}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-md ${statusCfg.bg} ${statusCfg.text}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span 
                        className="text-xs font-medium"
                        style={{ color: signalCfg.color }}
                      >
                        {signalCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Engagement Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Engagement Timeline</h3>
          </div>
          <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {customer.timeline.slice(0, 5).map((event) => {
            const EventIcon = EVENT_ICONS[event.type] || Activity;
            
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  event.impact === 'positive' ? 'bg-success/10' :
                  event.impact === 'negative' ? 'bg-destructive/10' : 'bg-muted'
                }`}>
                  <EventIcon className={`h-4 w-4 ${
                    event.impact === 'positive' ? 'text-success' :
                    event.impact === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{event.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
