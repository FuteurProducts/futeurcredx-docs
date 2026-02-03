/**
 * Usage Analytics Panel
 * Real-time metrics, rate limiting dashboard, latency monitoring, endpoint breakdown
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Clock, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  mockUsageMetrics,
  mockEndpointUsage,
  mockUsageByPeriod,
  mockQuotaInfo,
} from '../mockData';

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  color?: string;
}> = ({ title, value, subtitle, icon, trend, color = 'text-primary' }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${
              trend.direction === 'up' ? 'text-chart-2' : 'text-destructive'
            }`}>
              {trend.direction === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend.value}% vs last period
            </div>
          )}
        </div>
        <div className={`opacity-20 ${color}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export const UsageAnalyticsPanel: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'production' | 'sandbox'>('all');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-chart-2';
    if (latency < 200) return 'text-chart-4';
    if (latency < 500) return 'text-warning';
    return 'text-destructive';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 99.5) return 'text-chart-2';
    if (rate >= 99) return 'text-chart-4';
    if (rate >= 95) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Usage Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Real-time API usage metrics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {['24h', '7d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'production', label: 'Prod' },
              { id: 'sandbox', label: 'Sandbox' },
            ].map((env) => (
              <Button
                key={env.id}
                variant={selectedEnvironment === env.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedEnvironment(env.id as typeof selectedEnvironment)}
              >
                {env.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total API Calls"
          value={formatNumber(mockUsageMetrics.totalRequests)}
          subtitle="This period"
          icon={<BarChart3 className="h-8 w-8" />}
          trend={{ value: 12.5, direction: 'up' }}
        />
        <MetricCard
          title="Success Rate"
          value={`${mockUsageMetrics.successRate}%`}
          subtitle={`${formatNumber(mockUsageMetrics.failedRequests)} failed`}
          icon={<CheckCircle className="h-8 w-8" />}
          color={getSuccessRateColor(mockUsageMetrics.successRate)}
        />
        <MetricCard
          title="Avg Latency"
          value={`${mockUsageMetrics.avgLatencyMs}ms`}
          subtitle={`P95: ${mockUsageMetrics.p95LatencyMs}ms`}
          icon={<Clock className="h-8 w-8" />}
          color={getLatencyColor(mockUsageMetrics.avgLatencyMs)}
        />
        <MetricCard
          title="Rate Limit Hits"
          value={mockUsageMetrics.rateLimitHits}
          subtitle="429 responses"
          icon={<AlertTriangle className="h-8 w-8" />}
          color={mockUsageMetrics.rateLimitHits > 100 ? 'text-destructive' : 'text-chart-4'}
        />
      </div>

      {/* Quota Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quota Usage</CardTitle>
          <CardDescription>Current usage against rate limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockQuotaInfo.map((quota) => (
              <div key={quota.environment} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    quota.environment === 'production' ? 'bg-primary' : 'bg-chart-4'
                  }`} />
                  <span className="font-medium capitalize">{quota.environment}</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Per Minute</span>
                      <span>{quota.usedThisMinute} / {quota.requestsPerMinute}</span>
                    </div>
                    <Progress value={(quota.usedThisMinute / quota.requestsPerMinute) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Daily</span>
                      <span>{formatNumber(quota.usedToday)} / {formatNumber(quota.requestsPerDay)}</span>
                    </div>
                    <Progress value={(quota.usedToday / quota.requestsPerDay) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Monthly</span>
                      <span>{formatNumber(quota.usedThisMonth)} / {formatNumber(quota.requestsPerMonth)}</span>
                    </div>
                    <Progress 
                      value={(quota.usedThisMonth / quota.requestsPerMonth) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Volume</CardTitle>
          <CardDescription>API calls over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-2">
            {mockUsageByPeriod.map((data, index) => {
              const maxRequests = Math.max(...mockUsageByPeriod.map(d => d.requests));
              const height = (data.requests / maxRequests) * 100;
              
              return (
                <motion.div
                  key={data.period}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex-1 relative group"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-md group-hover:bg-primary/30 transition-colors" />
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all group-hover:opacity-90"
                    style={{ height: `${data.successRate}%` }}
                  />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                    {data.period}
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatNumber(data.requests)}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded" />
              <span className="text-muted-foreground">Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/20 rounded" />
              <span className="text-muted-foreground">Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoint Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Endpoint Performance</CardTitle>
          <CardDescription>Detailed metrics by API endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Requests</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Success Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg Latency</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Errors</th>
                </tr>
              </thead>
              <tbody>
                {mockEndpointUsage.map((endpoint, index) => (
                  <motion.tr
                    key={endpoint.endpoint}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          endpoint.method === 'GET' ? 'bg-chart-2/10 text-chart-2 border-chart-2/20' :
                          endpoint.method === 'POST' ? 'bg-primary/10 text-primary border-primary/20' :
                          'bg-chart-4/10 text-chart-4 border-chart-4/20'
                        }>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.endpoint}</code>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatNumber(endpoint.count)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getSuccessRateColor(endpoint.successRate)}>
                        {endpoint.successRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getLatencyColor(endpoint.avgLatencyMs)}>
                        {endpoint.avgLatencyMs}ms
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {endpoint.errorCodes.length > 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          {endpoint.errorCodes.slice(0, 2).map((err) => (
                            <Badge key={err.code} variant="secondary" className="text-xs">
                              {err.code}: {err.count}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Latency Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latency Distribution</CardTitle>
          <CardDescription>Response time percentiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'P50 (Median)', value: mockUsageMetrics.p50LatencyMs },
              { label: 'Average', value: mockUsageMetrics.avgLatencyMs },
              { label: 'P95', value: mockUsageMetrics.p95LatencyMs },
              { label: 'P99', value: mockUsageMetrics.p99LatencyMs },
            ].map((metric) => (
              <div key={metric.label} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className={`text-2xl font-bold ${getLatencyColor(metric.value)}`}>
                  {metric.value}ms
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalyticsPanel;
