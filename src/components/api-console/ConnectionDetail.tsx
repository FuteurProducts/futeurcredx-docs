// Connection Detail Page - Full integration dossier with 7 tabs
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Shield,
  Database,
  Activity,
  Webhook,
  Gauge,
  History,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Copy,
  RotateCw,
  Power,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Globe,
  Zap,
} from 'lucide-react';
import type { Connection, ConsentScope } from './types';
import { mockConsent, mockRateLimits, mockCoverageMetrics, mockHealthMetrics, mockChangeLogs, mockWebhookConfigs, mockWebhookEvents } from './data/bankMockData';

interface ConnectionDetailProps {
  connection: Connection;
  onBack: () => void;
}

export const ConnectionDetail: React.FC<ConnectionDetailProps> = ({ connection, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{connection.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{connection.type.replace('-', ' ')} • {connection.authMethod.toUpperCase()}</p>
          </div>
          <StatusBadge status={connection.status} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <ActionButton icon={RotateCw} label="Rotate Secret" />
          <ActionButton icon={RefreshCw} label="Re-authenticate" variant="warning" />
          <ActionButton icon={Power} label="Disable" variant="danger" />
          <ActionButton icon={Download} label="Export Logs" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border p-1 rounded-xl flex-wrap">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Info className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Shield className="w-4 h-4" />
            Auth & Consent
          </TabsTrigger>
          <TabsTrigger value="coverage" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Database className="w-4 h-4" />
            Data Coverage
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Activity className="w-4 h-4" />
            Health & Logs
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Webhook className="w-4 h-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="ratelimits" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Gauge className="w-4 h-4" />
            Rate Limits
          </TabsTrigger>
          <TabsTrigger value="changelog" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <History className="w-4 h-4" />
            Change Log
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection Info */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Connection Details</h3>
              <div className="space-y-4">
                <InfoRow label="Connection ID" value={connection.id} copyable />
                <InfoRow label="Environment" value={connection.environment} badge />
                <InfoRow label="OAuth Client ID" value={connection.oauthClientId || 'N/A'} copyable />
                <InfoRow label="OAuth Audience" value={connection.oauthAudience || 'N/A'} />
                <InfoRow label="Webhook Endpoint" value={connection.webhookEndpoint || 'Not configured'} copyable />
                <InfoRow label="Owner" value={connection.owner} />
                <InfoRow label="SLA Tier" value={connection.slaTier} badge />
              </div>
            </div>

            {/* Data Categories */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Data Categories Enabled</h3>
              <div className="flex flex-wrap gap-2">
                {connection.dataCategories.map((cat, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium capitalize">
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Scopes Granted</h3>
              <div className="space-y-2">
                {connection.scopesGranted.map((scope, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <code className="text-sm font-mono">{scope}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Limit Summary */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Rate Limit Usage</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Daily Quota</span>
                  <span className="text-sm font-semibold">{connection.rateLimitUsage}% used</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      connection.rateLimitUsage > 80 ? 'bg-destructive' :
                      connection.rateLimitUsage > 60 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${connection.rateLimitUsage}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {(connection.rateLimitMax * connection.rateLimitUsage / 100).toLocaleString()} / {connection.rateLimitMax.toLocaleString()} requests
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Last Sync" value={connection.dataFreshness} />
                <StatCard label="Error Rate (24h)" value={`${connection.errorRate24h}%`} variant={connection.errorRate24h > 1 ? 'danger' : 'success'} />
                <StatCard label="Coverage" value={`${connection.coveragePercent?.toFixed(1) || 0}%`} />
                <StatCard label="Created" value={new Date(connection.createdAt).toLocaleDateString()} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Authorization & Consent (FDX-style) */}
        <TabsContent value="consent" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consent Object */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Consent Object (FDX)</h3>
                <span className="px-2 py-1 bg-success/10 text-success rounded text-xs font-semibold">Active</span>
              </div>
              
              <div className="space-y-4">
                <InfoRow label="Consent ID" value={mockConsent.id} copyable />
                <InfoRow label="Created" value={new Date(mockConsent.createdAt).toLocaleDateString()} />
                <InfoRow label="Last Updated" value={new Date(mockConsent.lastUpdated).toLocaleDateString()} />
                <InfoRow label="Expires" value={new Date(mockConsent.duration.expiresAt).toLocaleDateString()} />
                <InfoRow label="Days Remaining" value={`${mockConsent.duration.daysRemaining} days`} badge />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Accounts Permitted</h4>
                <div className="flex flex-wrap gap-2">
                  {mockConsent.accountsPermitted.map((acc, i) => (
                    <span key={i} className="px-3 py-1.5 bg-muted rounded-lg text-sm font-mono">{acc}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {mockConsent.revocable ? (
                  <>
                    <Unlock className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">User can revoke access</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Non-revocable consent</span>
                  </>
                )}
              </div>
            </div>

            {/* Scopes */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Granted Scopes</h3>
              <div className="space-y-3">
                {mockConsent.scopes.map((scope: ConsentScope) => (
                  <div key={scope.id} className={`p-4 rounded-xl border ${scope.granted ? 'border-success/20 bg-success/10' : 'border-border bg-muted/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono font-semibold">{scope.name}</code>
                      {scope.granted ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{scope.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-card rounded text-xs text-muted-foreground capitalize">{scope.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Token State */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Token State</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Access Token Age" value="2.5 hours" />
                <StatCard label="Refresh Success Rate" value="99.8%" variant="success" />
                <StatCard label="Last Auth Event" value="Today 14:30" />
                <StatCard label="Token Type" value="Bearer JWT" />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    toast.info('Refreshing OAuth token...');
                    setTimeout(() => toast.success('Token refreshed successfully'), 1000);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Refresh Token
                </button>
                <button
                  onClick={() => {
                    toast.info('Testing re-authentication flow...');
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-semibold transition-colors"
                >
                  Test Re-auth Flow
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Data Coverage */}
        <TabsContent value="coverage" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coverage Stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Portfolio Coverage</h3>
              <div className="text-center py-6">
                <div className="text-5xl font-bold text-primary mb-2">{mockCoverageMetrics.coveragePercent}%</div>
                <p className="text-muted-foreground">
                  {mockCoverageMetrics.connectedSmbs.toLocaleString()} of {mockCoverageMetrics.totalSmbs.toLocaleString()} SMBs connected
                </p>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${mockCoverageMetrics.coveragePercent}%` }}
                />
              </div>
            </div>

            {/* Freshness Distribution */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Freshness Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">p50 (Median)</span>
                  <span className="text-sm font-semibold">{mockCoverageMetrics.freshnessDistribution.p50} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">p90</span>
                  <span className="text-sm font-semibold">{mockCoverageMetrics.freshnessDistribution.p90} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">p99</span>
                  <span className="text-sm font-semibold text-warning">{mockCoverageMetrics.freshnessDistribution.p99} hours</span>
                </div>
              </div>
            </div>

            {/* Missing Fields */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Missing Fields Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Field</th>
                      <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Missing Count</th>
                      <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">% Missing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCoverageMetrics.missingFields.map((field, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-3 font-mono text-sm">{field.field}</td>
                        <td className="py-3 text-sm">{field.missingCount.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`text-sm font-semibold ${field.missingPercent > 1 ? 'text-warning' : 'text-success'}`}>
                            {field.missingPercent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Health & Logs */}
        <TabsContent value="health" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Uptime */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Uptime</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">24 Hours</span>
                  <span className={`text-lg font-bold ${mockHealthMetrics.uptime24h > 99.9 ? 'text-success' : 'text-warning'}`}>
                    {mockHealthMetrics.uptime24h}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">7 Days</span>
                  <span className="text-lg font-bold text-success">{mockHealthMetrics.uptime7d}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">30 Days</span>
                  <span className="text-lg font-bold text-success">{mockHealthMetrics.uptime30d}%</span>
                </div>
              </div>
            </div>

            {/* Latency */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Latency</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average</span>
                  <span className="text-lg font-bold">{mockHealthMetrics.avgLatency}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">p95</span>
                  <span className="text-lg font-bold">{mockHealthMetrics.p95Latency}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">p99</span>
                  <span className="text-lg font-bold text-warning">{mockHealthMetrics.p99Latency}ms</span>
                </div>
              </div>
            </div>

            {/* Errors by Type */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Errors by Type</h3>
              <div className="space-y-3">
                {mockHealthMetrics.errorsByType.map((err, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{err.type.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{err.count}</span>
                      <span className="text-xs text-muted-foreground">({err.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requests by Endpoint */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Requests by Endpoint</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Endpoint</th>
                      <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Requests</th>
                      <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Error Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHealthMetrics.requestsByEndpoint.map((ep, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 font-mono text-sm">{ep.endpoint}</td>
                        <td className="py-3 text-sm">{ep.count.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`text-sm font-semibold ${ep.errorRate > 0.05 ? 'text-destructive' : 'text-success'}`}>
                            {ep.errorRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Webhooks */}
        <TabsContent value="webhooks" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Webhook Config */}
            {mockWebhookConfigs.slice(0, 1).map(config => (
              <div key={config.id} className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Webhook Configuration</h3>
                <div className="space-y-4">
                  <InfoRow label="Endpoint URL" value={config.endpointUrl} copyable />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Secret</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">{showSecret ? config.secret : '••••••••••••'}</code>
                      <button onClick={() => setShowSecret(!showSecret)} className="p-1 hover:bg-muted rounded">
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <InfoRow label="Last Rotated" value={new Date(config.secretLastRotated).toLocaleDateString()} />
                  <div className="flex items-center gap-2">
                    {config.mtlsEnabled ? (
                      <>
                        <Lock className="w-4 h-4 text-success" />
                        <span className="text-sm text-success">mTLS Enabled</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Standard HTTPS</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">Event Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {config.eventTypes.map((evt, i) => (
                      <span key={i} className="px-2 py-1 bg-muted rounded text-xs font-mono">{evt}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      toast.success('New secret generated');
                    }}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90"
                  >
                    Send Test Event
                  </button>
                  <button
                    onClick={() => {
                      toast.warning('Are you sure? This will invalidate all existing credentials.', {
                        action: {
                          label: 'Confirm',
                          onClick: () => toast.success('Credentials rotated successfully'),
                        },
                      });
                    }}
                    className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-semibold"
                  >
                    Replay Last 10
                  </button>
                </div>
              </div>
            ))}

            {/* Delivery Metrics */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="p50 Delivery" value={`${mockWebhookConfigs[0]?.deliveryMetrics.p50DeliveryTime || 0}ms`} />
                <StatCard label="Failure Rate" value={`${mockWebhookConfigs[0]?.deliveryMetrics.failureRate || 0}%`} variant={mockWebhookConfigs[0]?.deliveryMetrics.failureRate > 1 ? 'danger' : 'success'} />
                <StatCard label="Total Delivered" value={(mockWebhookConfigs[0]?.deliveryMetrics.totalDelivered || 0).toLocaleString()} />
                <StatCard label="Total Failed" value={(mockWebhookConfigs[0]?.deliveryMetrics.totalFailed || 0).toLocaleString()} variant="danger" />
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Recent Webhook Events</h3>
              <div className="space-y-3">
                {mockWebhookEvents.slice(0, 5).map(evt => (
                  <div key={evt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <StatusDot status={evt.status} />
                      <div>
                        <code className="text-sm font-mono font-semibold">{evt.eventType}</code>
                        <p className="text-xs text-muted-foreground">{new Date(evt.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {evt.deliveryTime && <span className="text-sm">{evt.deliveryTime}ms</span>}
                      {evt.retryCount > 0 && <span className="ml-2 text-xs text-warning">Retry #{evt.retryCount}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 6: Rate Limits */}
        <TabsContent value="ratelimits" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quota Usage */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Quota Usage</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Daily Quota</span>
                    <span className="text-sm font-semibold">{mockRateLimits.quotaUsed.toLocaleString()} / {mockRateLimits.quotaLimit.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(mockRateLimits.quotaUsed / mockRateLimits.quotaLimit) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Burst Limit</span>
                    <span className="text-sm font-semibold">{mockRateLimits.burstUsed} / {mockRateLimits.burstLimit} req/s</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${mockRateLimits.burstUsed > mockRateLimits.burstLimit * 0.8 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${(mockRateLimits.burstUsed / mockRateLimits.burstLimit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Per-Endpoint Limits */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Per-Endpoint Limits</h3>
              <div className="space-y-4">
                {mockRateLimits.perEndpointLimits.map((ep, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <code className="text-xs font-mono">{ep.endpoint}</code>
                      <span className="text-xs">{ep.used.toLocaleString()} / {ep.limit.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${(ep.used / ep.limit) > 0.8 ? 'bg-warning' : 'bg-primary'}`}
                        style={{ width: `${(ep.used / ep.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limit Exceeded Incidents */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Limit Exceeded Incidents</h3>
              {mockRateLimits.limitExceededIncidents.length > 0 ? (
                <div className="space-y-3">
                  {mockRateLimits.limitExceededIncidents.map((inc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <div>
                          <code className="text-sm font-mono">{inc.endpoint}</code>
                          <p className="text-xs text-muted-foreground">{new Date(inc.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-destructive">{inc.requestedCount.toLocaleString()} requests</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No rate limit incidents</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 7: Change Log */}
        <TabsContent value="changelog" className="mt-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Configuration Change Log</h3>
            <div className="space-y-4">
              {mockChangeLogs.map(log => (
                <div key={log.id} className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <ChangeLogIcon action={log.action} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{log.userName}</span>
                      <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{log.description}</p>
                    {log.oldValue && log.newValue && (
                      <div className="text-xs font-mono bg-muted p-2 rounded">
                        <span className="text-destructive line-through">{log.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span className="text-success">{log.newValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper Components
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    'connected': { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle },
    'needs-reauth': { bg: 'bg-warning/10', text: 'text-warning', icon: RefreshCw },
    'degraded': { bg: 'bg-warning/10', text: 'text-warning', icon: AlertTriangle },
    'down': { bg: 'bg-destructive/10', text: 'text-destructive', icon: XCircle },
    'pending': { bg: 'bg-muted', text: 'text-muted-foreground', icon: Clock },
  };
  const { bg, text, icon: Icon } = config[status] || config['pending'];
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bg} ${text} text-sm font-semibold capitalize`}>
      <Icon className="w-4 h-4" />
      {status.replace('-', ' ')}
    </span>
  );
};

const ActionButton: React.FC<{ icon: React.ElementType; label: string; variant?: 'default' | 'warning' | 'danger' }> = ({ icon: Icon, label, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-muted hover:bg-muted/80 text-foreground',
    warning: 'bg-warning/10 hover:bg-warning/20 text-warning',
    danger: 'bg-destructive/10 hover:bg-destructive/20 text-destructive',
  };
  return (
    <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${variantClasses[variant]}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

const InfoRow: React.FC<{ label: string; value: string; copyable?: boolean; badge?: boolean }> = ({ label, value, copyable, badge }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      {badge ? (
        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-sm font-semibold capitalize">{value}</span>
      ) : (
        <span className="text-sm font-medium truncate max-w-[200px]">{value}</span>
      )}
      {copyable && (
        <button 
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  </div>
);

const StatCard: React.FC<{ label: string; value: string; variant?: 'default' | 'success' | 'danger' }> = ({ label, value, variant = 'default' }) => {
  const valueColor = variant === 'success' ? 'text-success' : variant === 'danger' ? 'text-destructive' : 'text-foreground';
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <span className="text-xs text-muted-foreground block mb-1">{label}</span>
      <span className={`text-lg font-bold ${valueColor}`}>{value}</span>
    </div>
  );
};

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const color = status === 'delivered' ? 'bg-success' : status === 'failed' ? 'bg-destructive' : 'bg-warning';
  return <div className={`w-2 h-2 rounded-full ${color}`} />;
};

const ChangeLogIcon: React.FC<{ action: string }> = ({ action }) => {
  const iconMap: Record<string, React.ElementType> = {
    created: Zap,
    updated: RefreshCw,
    scopes_changed: Shield,
    endpoint_changed: Globe,
    key_rotated: Key,
    disabled: Power,
    enabled: CheckCircle,
  };
  const Icon = iconMap[action] || History;
  return <Icon className="w-4 h-4 text-primary" />;
};

export default ConnectionDetail;
