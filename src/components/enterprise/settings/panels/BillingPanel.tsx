// Billing Panel - Plan and usage dashboard

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { BillingInfo } from '../types';

interface BillingPanelProps {
  billing: BillingInfo;
  onUpgrade: () => void;
}

const usageData = [
  { day: 'Mon', calls: 320000 },
  { day: 'Tue', calls: 385000 },
  { day: 'Wed', calls: 420000 },
  { day: 'Thu', calls: 398000 },
  { day: 'Fri', calls: 450000 },
  { day: 'Sat', calls: 280000 },
  { day: 'Sun', calls: 197000 },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const BillingPanel: React.FC<BillingPanelProps> = ({
  billing,
  onUpgrade,
}) => {
  const usagePercentage = (billing.monthlyUsage / billing.usageLimit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Plan & Usage</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your subscription and API usage
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
          Upgrade Plan
        </button>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Current Plan</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{billing.plan}</p>
          <p className="text-sm text-muted-foreground mt-1">{billing.tier} tier</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Monthly Usage</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {(billing.monthlyUsage / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            of {(billing.usageLimit / 1000000).toFixed(0)}M API calls
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Calendar className="h-5 w-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Next Invoice</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            ${billing.amountDue.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{formatDate(billing.nextInvoiceDate)}</p>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-foreground">Usage This Month</span>
          <span className="text-sm text-muted-foreground">{usagePercentage.toFixed(1)}% used</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${usagePercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              usagePercentage > 80 ? 'bg-warning' : 'bg-primary'
            }`}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0</span>
          <span>{(billing.usageLimit / 1000000).toFixed(0)}M calls</span>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="font-medium text-foreground mb-4">API Calls Per Day (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value) => [`${(Number(value) / 1000).toFixed(0)}K calls`, 'API Calls']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default BillingPanel;
