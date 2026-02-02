// Main API Console Component - Enterprise-grade API Connections management
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutGrid,
  Activity,
  Terminal,
  Key,
  Webhook,
} from 'lucide-react';

import { ApiConsoleHeader } from './ApiConsoleHeader';
import { ConnectionDetail } from './ConnectionDetail';
import { ConnectionCatalog } from './ConnectionCatalog';
import type { Connection } from './types';
import { mockConnections, mockIncidents, mockActivityLogs, mockWebhookConfigs } from './data/mockData';
import { useEnvironment } from '@/contexts/EnvironmentContext';

interface ApiConsoleProps {
  apiKeys?: any[];
  isLoadingKeys?: boolean;
  error?: string;
  newKeyName?: string;
  setNewKeyName?: (name: string) => void;
  handleGenerateKey?: () => void;
  isGeneratingKey?: boolean;
  newlyGeneratedKey?: { id: string; key: string; name: string } | null;
  setNewlyGeneratedKey?: (key: { id: string; key: string; name: string } | null) => void;
  handleRevokeKey?: (keyId: string) => void;
  showApiKey?: Record<string, boolean>;
  toggleKeyVisibility?: (keyId: string) => void;
  formatDate?: (date: string | Date) => string;
}

export const ApiConsole: React.FC<ApiConsoleProps> = (props) => {
  const { currentEnvironment, switchEnvironment } = useEnvironment();
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState(currentEnvironment === 'sandbox' ? 'playground' : 'connections');

  const handleSelectConnection = (connection: Connection) => {
    setSelectedConnection(connection);
  };

  const handleBackFromDetail = () => {
    setSelectedConnection(null);
  };

  // If a connection is selected, show the detail view
  if (selectedConnection) {
    return (
      <div className="space-y-6">
        <ApiConsoleHeader
          currentEnvironment={currentEnvironment}
          switchEnvironment={switchEnvironment}
          incidents={mockIncidents}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <ConnectionDetail
          connection={selectedConnection}
          onBack={handleBackFromDetail}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApiConsoleHeader
        currentEnvironment={currentEnvironment}
        switchEnvironment={switchEnvironment}
        incidents={mockIncidents}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border p-1 rounded-xl">
          <TabsTrigger value="connections" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <LayoutGrid className="w-4 h-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Activity className="w-4 h-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="playground" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Terminal className="w-4 h-4" />
            API Playground
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2 data-[state=active]:bg-muted rounded-lg">
            <Webhook className="w-4 h-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6">
          <ConnectionCatalog
            connections={mockConnections}
            onSelectConnection={handleSelectConnection}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityLogPanel />
        </TabsContent>

        <TabsContent value="playground" className="mt-6">
          <ApiPlaygroundPanel />
        </TabsContent>

        <TabsContent value="keys" className="mt-6">
          <ApiKeysPanel {...props} />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <WebhooksPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Activity Log Panel
const ActivityLogPanel: React.FC = () => {

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold">Activity Log</h3>
        <span className="text-sm text-muted-foreground">Requests, webhooks, auth events (masked)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Connection</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Endpoint</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockActivityLogs.map((log: any) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{log.connectionName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      log.type === 'error'
                        ? 'bg-destructive/10 text-destructive'
                        : log.type === 'webhook'
                          ? 'bg-primary/10 text-primary'
                          : log.type === 'auth'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {log.method || log.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-mono">{log.endpoint}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${log.statusCode < 300 ? 'text-success' : 'text-destructive'}`}>
                    {log.statusCode}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {typeof log.duration === 'number' ? `${log.duration}ms` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Endpoint definitions for the API Playground
const playgroundEndpoints = [
  { id: 'credit-score', method: 'POST', path: '/v1/credit/score', label: 'POST /v1/credit/score - Pull credit score' },
  { id: 'credit-report', method: 'POST', path: '/v1/credit/report', label: 'POST /v1/credit/report - Pull credit report' },
  { id: 'business-details', method: 'GET', path: '/v1/businesses/:id', label: 'GET /v1/businesses/:id - Get business details' },
  { id: 'prequal-check', method: 'POST', path: '/v1/prequal/check', label: 'POST /v1/prequal/check - Run pre-qualification' },
  { id: 'portfolio-health', method: 'GET', path: '/v1/portfolio/health', label: 'GET /v1/portfolio/health - Portfolio health summary' },
] as const;

// Realistic demo responses per endpoint
const endpointResponses: Record<string, object> = {
  'credit-score': {
    status: 'success',
    data: {
      business_id: 'biz_test_8f2k9x',
      business_name: 'Riverside Bakery LLC',
      scores: [
        { source: 'experian_biz', score: 72, range: [1, 100], grade: 'B+' },
        { source: 'fico_sbss', score: 185, range: [0, 300], grade: 'Good' },
      ],
      risk_tier: 'low',
      lumiq_score: 74,
      pulled_at: '2026-02-02T18:30:00Z',
    },
  },
  'credit-report': {
    status: 'success',
    data: {
      business_id: 'biz_test_8f2k9x',
      report_id: 'rpt_test_3m7nq2',
      trade_lines: 12,
      derogatory_marks: 0,
      oldest_account: '2019-03-15',
      utilization: 0.34,
      payment_history: { on_time: 142, late_30: 1, late_60: 0, late_90: 0 },
      public_records: [],
      generated_at: '2026-02-02T18:30:00Z',
    },
  },
  'business-details': {
    status: 'success',
    data: {
      id: 'biz_test_8f2k9x',
      legal_name: 'Riverside Bakery LLC',
      dba: 'Riverside Bakery',
      ein: '**-***4521',
      industry: 'Food Services',
      naics_code: '722515',
      annual_revenue: 1250000,
      employee_count: 18,
      years_in_business: 7,
      state: 'CA',
      lumiq_score: 74,
      relationship_stage: 'active',
    },
  },
  'prequal-check': {
    status: 'success',
    data: {
      business_id: 'biz_test_8f2k9x',
      prequal_id: 'pq_test_9k4mv7',
      qualified: true,
      max_amount: 150000,
      term_months: 36,
      estimated_rate: '7.5% - 9.2%',
      product_type: 'term_loan',
      valid_until: '2026-03-02T00:00:00Z',
      factors: [
        { factor: 'Strong payment history', impact: 'positive' },
        { factor: 'Low utilization', impact: 'positive' },
        { factor: 'Limited time in business', impact: 'neutral' },
      ],
    },
  },
  'portfolio-health': {
    status: 'success',
    data: {
      portfolio_id: 'pf_test_main',
      total_businesses: 247,
      scored_businesses: 238,
      risk_distribution: { low: 168, moderate: 52, elevated: 15, high: 3 },
      avg_lumiq_score: 68,
      delinquency_rate: 0.023,
      approval_rate: 0.72,
      last_updated: '2026-02-02T18:00:00Z',
    },
  },
};

// API Playground Panel
const ApiPlaygroundPanel: React.FC = () => {
  const { currentEnvironment } = useEnvironment();
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('credit-score');
  const [response, setResponse] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const selectedEndpoint = playgroundEndpoints.find(e => e.id === selectedEndpointId) || playgroundEndpoints[0];
  const apiKeyPrefix = currentEnvironment === 'sandbox' ? 'lq_test_xxx' : 'lq_live_xxx';
  const baseUrl = currentEnvironment === 'sandbox' ? 'https://sandbox.lumiqai.com' : 'https://api.lumiqai.com';

  const buildCurlExample = () => {
    const ep = selectedEndpoint;
    const resolvedPath = ep.path.replace(':id', 'biz_test_8f2k9x');
    if (ep.method === 'GET') {
      return `curl -X GET "${baseUrl}${resolvedPath}" \\
  -H "Authorization: Bearer ${apiKeyPrefix}" \\
  -H "Content-Type: application/json"`;
    }
    return `curl -X ${ep.method} "${baseUrl}${resolvedPath}" \\
  -H "Authorization: Bearer ${apiKeyPrefix}" \\
  -H "Content-Type: application/json" \\
  -d '{"business_id": "biz_test_8f2k9x"}'`;
  };

  const handleRun = () => {
    setIsRunning(true);
    const simulatedTime = Math.floor(Math.random() * 171) + 80; // 80-250ms
    setTimeout(() => {
      const data = endpointResponses[selectedEndpointId];
      setResponse(JSON.stringify(data, null, 2));
      setResponseTime(simulatedTime);
      setIsRunning(false);
    }, 300);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Request</h3>
        <select
          value={selectedEndpointId}
          onChange={(e) => {
            setSelectedEndpointId(e.target.value);
            setResponse(null);
            setResponseTime(null);
          }}
          className="w-full h-10 px-3 bg-muted rounded-lg mb-4 text-sm"
        >
          {playgroundEndpoints.map(ep => (
            <option key={ep.id} value={ep.id}>{ep.label}</option>
          ))}
        </select>
        <pre className="bg-foreground text-background p-4 rounded-xl text-xs overflow-auto h-48 font-mono">
{buildCurlExample()}
        </pre>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="mt-4 w-full h-10 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Request'}
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Response</h3>
            {currentEnvironment === 'sandbox' && response && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-600 border border-amber-500/25">
                Sandbox
              </span>
            )}
          </div>
          {response && responseTime !== null && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-success/10 text-success font-semibold">200 OK</span>
              <span>{responseTime}ms</span>
            </div>
          )}
        </div>
        <pre className="bg-muted p-4 rounded-xl text-xs overflow-auto h-72 font-mono">
          {response || '// Response will appear here'}
        </pre>
      </div>
    </div>
  );
};

// API Keys Panel
const ApiKeysPanel: React.FC<ApiConsoleProps> = ({ apiKeys = [], isLoadingKeys }) => {
  const { currentEnvironment } = useEnvironment();

  const filteredKeys = apiKeys.filter((key: any) => {
    // Match by environment field
    if (key.environment === currentEnvironment) return true;
    // Fallback: match by key prefix
    if (currentEnvironment === 'sandbox' && key.keyPrefix?.startsWith('lq_test_')) return true;
    if (currentEnvironment === 'production' && (key.keyPrefix?.startsWith('lq_live_') || key.keyPrefix?.startsWith('lq_prod_'))) return true;
    return false;
  });

  const envLabel = currentEnvironment === 'sandbox' ? 'sandbox' : 'production';

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">API Keys & OAuth Clients</h3>
      <p className="text-sm text-muted-foreground mb-6">Manage your API keys and OAuth client credentials for secure access.</p>

      {isLoadingKeys ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeys.length > 0 ? filteredKeys.map((key: any) => (
            <div key={key.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <span className="font-medium">{key.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{key.environment || 'development'}</span>
              </div>
              <code className="text-sm font-mono text-muted-foreground">sk_...{key.key?.slice(-4) || '****'}</code>
            </div>
          )) : (
            <p className="text-center py-8 text-muted-foreground">No API keys yet. Generate one above.</p>
          )}
          <p className="text-xs text-muted-foreground text-center pt-2">
            Showing {envLabel} keys. Switch environment to see other keys.
          </p>
        </div>
      )}
    </div>
  );
};

// Webhooks Panel
const WebhooksPanel: React.FC = () => {

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Webhook Endpoints</h3>
          <p className="text-sm text-muted-foreground">Configure endpoints to receive real-time events</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          Add Endpoint
        </button>
      </div>

      <div className="space-y-4">
        {mockWebhookConfigs.map((wh: any) => (
          <div key={wh.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${wh.deliveryMetrics?.failureRate > 1 ? 'bg-warning' : 'bg-success'}`} />
              <div>
                <code className="text-sm font-mono">{wh.endpointUrl}</code>
                <div className="text-xs text-muted-foreground mt-1">{wh.eventTypes.length} event types subscribed</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-foreground">
                {typeof wh.deliveryMetrics?.failureRate === 'number' ? `${(100 - wh.deliveryMetrics.failureRate).toFixed(1)}%` : '--'}
              </span>
              <div className="text-xs text-muted-foreground">delivery success</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiConsole;
