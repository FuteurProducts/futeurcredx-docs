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
import type { Environment, Connection } from './types';
import { mockConnections, mockIncidents, mockActivityLogs, mockWebhookConfigs } from './data/mockData';

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
  const [environment, setEnvironment] = useState<Environment>('production');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState('connections');

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
          environment={environment}
          onEnvironmentChange={setEnvironment}
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
        environment={environment}
        onEnvironmentChange={setEnvironment}
        incidents={mockIncidents}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-border p-1 rounded-xl">
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
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
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
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {log.method || log.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-mono">{log.endpoint}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${log.statusCode < 300 ? 'text-green-600' : 'text-destructive'}`}>
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

// API Playground Panel
const ApiPlaygroundPanel: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/v2/credit-journey');
  const [response, setResponse] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setResponse(JSON.stringify({
        status: "success",
        data: {
          journey_id: "cj_abc123",
          business_id: "biz_xyz789",
          credit_score: 720,
          risk_tier: "low"
        }
      }, null, 2));
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Request</h3>
        <select 
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
          className="w-full h-10 px-3 bg-muted rounded-lg mb-4 text-sm"
        >
          <option value="/v2/credit-journey">POST /v2/credit-journey</option>
          <option value="/v2/accounts">GET /v2/accounts</option>
          <option value="/v2/transactions">GET /v2/transactions</option>
        </select>
        <pre className="bg-foreground text-background p-4 rounded-xl text-xs overflow-auto h-48 font-mono">
{`curl -X POST "https://api.futeurcredx.com${selectedEndpoint}" \\
  -H "Authorization: Bearer sk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"business_id": "biz_xyz789"}'`}
        </pre>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="mt-4 w-full h-10 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Request'}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Response</h3>
        <pre className="bg-muted p-4 rounded-xl text-xs overflow-auto h-72 font-mono">
          {response || '// Response will appear here'}
        </pre>
      </div>
    </div>
  );
};

// API Keys Panel
const ApiKeysPanel: React.FC<ApiConsoleProps> = ({ apiKeys = [], isLoadingKeys }) => {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">API Keys & OAuth Clients</h3>
      <p className="text-sm text-muted-foreground mb-6">Manage your API keys and OAuth client credentials for secure access.</p>
      
      {isLoadingKeys ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.length > 0 ? apiKeys.map((key: any) => (
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
        </div>
      )}
    </div>
  );
};

// Webhooks Panel
const WebhooksPanel: React.FC = () => {

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
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
              <div className={`w-2 h-2 rounded-full ${wh.deliveryMetrics?.failureRate > 1 ? 'bg-amber-500' : 'bg-green-500'}`} />
              <div>
                <code className="text-sm font-mono">{wh.endpointUrl}</code>
                <div className="text-xs text-muted-foreground mt-1">{wh.eventTypes.length} event types subscribed</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-foreground">
                {typeof wh.deliveryMetrics?.failureRate === 'number' ? `${(100 - wh.deliveryMetrics.failureRate).toFixed(1)}%` : '—'}
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
