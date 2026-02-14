// Main API Console Component - Enterprise-grade API Connections management
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutGrid,
  Activity,
  Terminal,
  Key,
  Webhook,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Clock,
  Send,
  Trash2,
  RefreshCw,
  Play,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  Ban,
  Zap,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ApiConsoleHeader } from './ApiConsoleHeader';
import { ConnectionDetail } from './ConnectionDetail';
import { ConnectionCatalog } from './ConnectionCatalog';
import type { Connection } from './types';
import { mockConnections, mockIncidents, mockActivityLogs, mockWebhookConfigs } from './data/bankMockData';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { useRequestLogStore } from '@/stores/apiRequestLogStore';
import type { RequestLogEntry } from '@/stores/apiRequestLogStore';

// LocalStorage keys
const STORAGE_KEYS = {
  CREDENTIALS: 'lumiqai-sandbox-credentials',
  SELECTED_KEY: 'lumiqai-selected-api-key',
  REQUEST_HISTORY: 'lumiqai-request-history',
} as const;

// Types for credentials and history
interface StoredCredential {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
  environment: 'sandbox' | 'production';
  createdAt: string;
}

interface RequestHistoryEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requestBody: string | null;
  responseBody: string;
  simulatedError?: string;
}

// Error simulation types
type ErrorSimulation = 'live' | '200' | '401' | '403' | '429' | '500' | 'timeout';

const errorSimulations: { value: ErrorSimulation; label: string; icon: React.ReactNode }[] = [
  { value: 'live', label: 'Live Request (Real API)', icon: <Zap className="w-4 h-4 text-primary" /> },
  { value: '200', label: '200 OK (Demo Data)', icon: <CheckCircle2 className="w-4 h-4 text-success" /> },
  { value: '401', label: '401 Unauthorized', icon: <Ban className="w-4 h-4 text-destructive" /> },
  { value: '403', label: '403 Forbidden', icon: <XCircle className="w-4 h-4 text-destructive" /> },
  { value: '429', label: '429 Rate Limited', icon: <Timer className="w-4 h-4 text-warning" /> },
  { value: '500', label: '500 Server Error', icon: <AlertCircle className="w-4 h-4 text-destructive" /> },
  { value: 'timeout', label: 'Timeout (3s delay)', icon: <Clock className="w-4 h-4 text-muted-foreground" /> },
];

// Webhook event types
const webhookEventTypes = [
  { value: 'score.completed', label: 'score.completed - Credit score pulled' },
  { value: 'score.failed', label: 'score.failed - Credit score pull failed' },
  { value: 'application.submitted', label: 'application.submitted - New application' },
  { value: 'application.approved', label: 'application.approved - Application approved' },
  { value: 'application.declined', label: 'application.declined - Application declined' },
  { value: 'portfolio.alert', label: 'portfolio.alert - Portfolio risk alert' },
  { value: 'business.updated', label: 'business.updated - Business data changed' },
];

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  keyPrefix?: string;
  environment?: string;
}

interface ApiConsoleProps {
  apiKeys?: ApiKey[];
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

// Helper: map a RequestLogEntry to the shape expected by the activity log table
function mapRequestLogToRow(entry: RequestLogEntry) {
  return {
    id: entry.id,
    timestamp: entry.timestamp,
    connectionName: 'API Playground',
    method: entry.method,
    type: entry.error ? 'error' : 'request',
    endpoint: entry.endpoint,
    statusCode: entry.statusCode,
    duration: entry.responseTime,
  };
}

// Activity Log Panel
const ActivityLogPanel: React.FC = () => {
  const { isDemoMode } = useEnvironment();
  const { requests: liveRequests, clearRequests } = useRequestLogStore();

  // In demo mode, show mock data. In sandbox/production, show live request log.
  const isLive = !isDemoMode;

  const rows = isLive
    ? liveRequests.map(mapRequestLogToRow)
    : mockActivityLogs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        connectionName: log.connectionName,
        method: log.method ?? log.type.toUpperCase(),
        type: log.type,
        endpoint: log.endpoint ?? '',
        statusCode: log.statusCode ?? 0,
        duration: log.duration,
      }));

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Activity Log</h3>
          {isLive && (
            <Badge variant="default" className="bg-primary/10 text-primary">Live</Badge>
          )}
          <Badge variant="secondary">{rows.length}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {isLive ? 'Live API request history' : 'Requests, webhooks, auth events (masked)'}
          </span>
          {isLive && liveRequests.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRequests}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>{isLive ? 'No API requests yet. Use the Playground to make requests.' : 'No activity logs available.'}</p>
          </div>
        ) : (
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
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{row.connectionName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        row.type === 'error'
                          ? 'bg-destructive/10 text-destructive'
                          : row.type === 'webhook'
                            ? 'bg-primary/10 text-primary'
                            : row.type === 'auth'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {row.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">{row.endpoint}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm font-semibold', (row.statusCode ?? 0) < 300 ? 'text-success' : 'text-destructive')}>
                      {row.statusCode ?? '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {typeof row.duration === 'number' ? `${row.duration}ms` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Endpoint definitions for the API Playground
// These paths are appended to baseUrl (which already includes /dashboard when using VITE_API_URL)
const playgroundEndpoints = [
  { id: 'health', method: 'GET', path: '/health', label: 'GET /dashboard/health - Health check' },
  { id: 'portfolios', method: 'GET', path: '/portfolios', label: 'GET /dashboard/portfolios - List portfolios' },
  { id: 'customers', method: 'GET', path: '/customers', label: 'GET /dashboard/customers - List customers' },
  { id: 'scores-dist', method: 'GET', path: '/scores/distribution', label: 'GET /dashboard/scores/distribution - Score distribution' },
  { id: 'risk-summary', method: 'GET', path: '/risk/summary', label: 'GET /dashboard/risk/summary - Risk summary' },
  { id: 'api-keys', method: 'GET', path: '/api-keys', label: 'GET /dashboard/api-keys - List API keys' },
  { id: 'create-key', method: 'POST', path: '/api-keys', label: 'POST /dashboard/api-keys - Create API key' },
] as const;

// Realistic demo responses per endpoint (shown in demo mode only)
const endpointResponses: Record<string, object> = {
  'health': {
    success: true,
    data: {
      status: 'ok',
      timestamp: '2026-02-13T22:18:17.577Z',
      version: '1.0.0',
      database: 'connected',
    },
  },
  'portfolios': {
    success: true,
    data: [
      {
        id: 'pf_test_001',
        name: 'SMB National Portfolio',
        code: 'smb-national',
        businessCount: 200,
        riskDistribution: { low: 120, medium: 52, high: 23, critical: 5 },
        avgScore: 68,
      },
    ],
    pagination: { page: 1, pageSize: 25, total: 2 },
  },
  'customers': {
    success: true,
    data: [
      {
        id: 'biz_test_001',
        name: 'Riverside Bakery LLC',
        city: 'Sacramento',
        state: 'CA',
        annualRevenue: 1250000,
        riskTier: 'low',
        latestScore: 74,
      },
    ],
    pagination: { page: 1, pageSize: 25, total: 200 },
  },
  'scores-dist': {
    success: true,
    data: {
      distribution: [
        { bucket: '0-300', count: 5 },
        { bucket: '301-500', count: 23 },
        { bucket: '501-700', count: 120 },
        { bucket: '701-850', count: 52 },
      ],
      avgScore: 68,
      totalScored: 200,
    },
  },
  'risk-summary': {
    success: true,
    data: {
      avgScore: 68,
      minScore: 310,
      maxScore: 820,
      riskDistribution: { low: 120, medium: 52, high: 23, critical: 5 },
      topDrivers: ['Revenue decline', 'Payment delinquency', 'Industry risk'],
    },
  },
  'api-keys': {
    success: true,
    data: [
      {
        id: 'key_test_001',
        name: 'Sandbox Key',
        keyPrefix: 'sk_test_XrT3...b807',
        environment: 'development',
        isActive: true,
        createdAt: '2026-02-13T00:00:00Z',
      },
    ],
    pagination: { page: 1, pageSize: 25, total: 2 },
  },
  'create-key': {
    success: true,
    data: {
      id: 'key_test_new',
      name: 'New Test Key',
      key: 'sk_test_EXAMPLE_FULL_KEY_ONLY_SHOWN_ONCE',
      keyPrefix: 'sk_test_EXAM...ONCE',
      environment: 'development',
      isActive: true,
      createdAt: '2026-02-13T22:18:17.577Z',
    },
  },
};

// Error response templates
const errorResponses: Record<ErrorSimulation, (endpoint: string) => object> = {
  'live': () => ({}), // Not used — live requests return real data
  '200': () => ({}), // Not used, actual data returned
  '401': () => ({
    error: {
      code: 'unauthorized',
      message: 'Invalid API key provided. Please check your API key and try again.',
      hint: 'API keys should start with lq_test_ for sandbox or lq_live_ for production.',
    },
  }),
  '403': () => ({
    error: {
      code: 'forbidden',
      message: 'Your API key does not have the required scopes for this endpoint.',
      required_scopes: ['credit:read', 'business:read'],
      your_scopes: ['business:read'],
    },
  }),
  '429': () => ({
    error: {
      code: 'rate_limit_exceeded',
      message: 'Rate limit exceeded. Please wait before making another request.',
      retry_after: 60,
      limit: '100 requests per minute',
    },
  }),
  '500': () => ({
    error: {
      code: 'internal_server_error',
      message: 'An unexpected error occurred. Our team has been notified.',
      request_id: 'req_' + Math.random().toString(36).substr(2, 9),
    },
  }),
  'timeout': () => ({
    error: {
      code: 'timeout',
      message: 'The request timed out. Please try again.',
    },
  }),
};

// Helper to get status code for simulation
const getStatusCode = (simulation: ErrorSimulation): number => {
  const codes: Record<ErrorSimulation, number> = {
    'live': 200, // placeholder — live requests use the real status
    '200': 200,
    '401': 401,
    '403': 403,
    '429': 429,
    '500': 500,
    'timeout': 408,
  };
  return codes[simulation];
};

// Helper: get endpoint-specific request body for live requests
function getLiveRequestBody(endpointId: string): Record<string, unknown> | null {
  switch (endpointId) {
    case 'create-key':
      return { name: 'Playground Test Key', scopes: ['read', 'write'], expiresInDays: 30 };
    default:
      return null;
  }
}

// Helper: get endpoint-specific query params for live requests
// Endpoints that require portfolioId will get a placeholder — the backend returns 422 if missing
function getLiveQueryParams(endpointId: string): Record<string, string> | null {
  const needsPortfolio = ['customers', 'scores-dist', 'risk-summary'];
  if (needsPortfolio.includes(endpointId)) {
    // User should replace with a real portfolioId from the /portfolios response
    return { portfolioId: 'replace-with-portfolio-id' };
  }
  return null;
}

// API Playground Panel with full sandbox features
const ApiPlaygroundPanel: React.FC = () => {
  const { currentEnvironment, isDemoMode } = useEnvironment();
  const { apiKey: globalApiKey, setApiKey: setGlobalApiKey } = useApiKeyStore();
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('health');
  const [response, setResponse] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // API Key state — sync with global store for non-demo modes
  const [apiKey, setApiKey] = useState<string>(globalApiKey ?? '');
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>('');
  const [storedCredentials, setStoredCredentials] = useState<StoredCredential[]>([]);
  const [keyValidation, setKeyValidation] = useState<{ valid: boolean; message: string } | null>(null);

  // Error simulation state — default to 'live' in sandbox/production, '200' in demo
  const [errorSimulation, setErrorSimulation] = useState<ErrorSimulation>(isDemoMode ? '200' : 'live');

  // Request history state
  const [requestHistory, setRequestHistory] = useState<RequestHistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Webhook test state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEventType, setWebhookEventType] = useState('score.completed');
  const [webhookSending, setWebhookSending] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; message: string } | null>(null);
  const [webhookPayloadPreview, setWebhookPayloadPreview] = useState<string | null>(null);

  // Copy state
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedFetch, setCopiedFetch] = useState(false);

  const selectedEndpoint = playgroundEndpoints.find(e => e.id === selectedEndpointId) || playgroundEndpoints[0];
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = apiUrl
    ? `${apiUrl}/dashboard`
    : (currentEnvironment === 'sandbox' ? 'https://sandbox.lumiqai.com' : 'https://api.lumiqai.com');

  // Load stored credentials and selected key on mount
  useEffect(() => {
    const loadStoredData = () => {
      // Load credentials
      const credentialsJson = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (credentialsJson) {
        try {
          const creds = JSON.parse(credentialsJson) as StoredCredential[];
          const filtered = creds.filter(c =>
            currentEnvironment === 'sandbox'
              ? c.environment === 'sandbox' || c.keyPrefix?.startsWith('sk_test_') || c.keyPrefix?.startsWith('lq_test_')
              : c.environment === 'production' || c.keyPrefix?.startsWith('sk_live_') || c.keyPrefix?.startsWith('lq_live_')
          );
          setStoredCredentials(filtered);
        } catch (e) {
          // Failed to parse credentials from localStorage
        }
      }

      // Load selected key
      const selectedKeyJson = localStorage.getItem(STORAGE_KEYS.SELECTED_KEY);
      if (selectedKeyJson) {
        try {
          const selected = JSON.parse(selectedKeyJson);
          if (selected.environment === currentEnvironment) {
            setApiKey(selected.key || '');
            setSelectedCredentialId(selected.id || '');
          }
        } catch (e) {
          // Failed to parse selected key from localStorage
        }
      }

      // Load request history
      const historyJson = localStorage.getItem(STORAGE_KEYS.REQUEST_HISTORY);
      if (historyJson) {
        try {
          const history = JSON.parse(historyJson) as RequestHistoryEntry[];
          setRequestHistory(history.slice(0, 20));
        } catch (e) {
          // Failed to parse history from localStorage
        }
      }
    };

    loadStoredData();
  }, [currentEnvironment]);

  // Validate API key format
  const validateApiKey = useCallback((key: string): { valid: boolean; message: string } => {
    if (!key || key.trim() === '') {
      return { valid: false, message: 'API key is required' };
    }

    const trimmedKey = key.trim();

    if (currentEnvironment === 'sandbox') {
      if (trimmedKey.startsWith('sk_live_') || trimmedKey.startsWith('lq_live_') || trimmedKey.startsWith('lq_prod_')) {
        return { valid: false, message: 'Warning: Production key detected in sandbox mode. Use a sandbox key (sk_test_...)' };
      }
      if (!trimmedKey.startsWith('sk_test_') && !trimmedKey.startsWith('lq_test_')) {
        return { valid: false, message: 'Sandbox keys must start with sk_test_' };
      }
    } else {
      if (trimmedKey.startsWith('sk_test_') || trimmedKey.startsWith('lq_test_')) {
        return { valid: false, message: 'Warning: Sandbox key detected in production mode. Use a production key (sk_live_...)' };
      }
      if (!trimmedKey.startsWith('sk_live_') && !trimmedKey.startsWith('lq_live_') && !trimmedKey.startsWith('lq_prod_')) {
        return { valid: false, message: 'Production keys must start with sk_live_' };
      }
    }

    return { valid: true, message: 'Valid API key format' };
  }, [currentEnvironment]);

  // Update validation when key changes
  useEffect(() => {
    if (apiKey) {
      setKeyValidation(validateApiKey(apiKey));
    } else {
      setKeyValidation(null);
    }
  }, [apiKey, validateApiKey]);

  // Handle credential selection
  const handleSelectCredential = (credentialId: string) => {
    setSelectedCredentialId(credentialId);
    const credential = storedCredentials.find(c => c.id === credentialId);
    if (credential) {
      setApiKey(credential.key);
      // Save selection to localStorage
      localStorage.setItem(STORAGE_KEYS.SELECTED_KEY, JSON.stringify({
        id: credential.id,
        key: credential.key,
        environment: currentEnvironment,
      }));
    }
  };

  // Sync local apiKey with global store changes (e.g. from ApiKeysPanel "Set as Active")
  useEffect(() => {
    if (globalApiKey && globalApiKey !== apiKey) {
      setApiKey(globalApiKey);
    }
  }, [globalApiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle manual API key input
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setSelectedCredentialId(''); // Clear selection when manually typing
    // Sync to global store so BFF client also uses this key
    if (!isDemoMode) {
      setGlobalApiKey(value || null);
    }
    if (value) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_KEY, JSON.stringify({
        id: '',
        key: value,
        environment: currentEnvironment,
      }));
    }
  };

  // Build curl example with actual API key
  const buildCurlExample = useCallback(() => {
    const ep = selectedEndpoint;
    const resolvedPath = ep.path;
    const displayKey = apiKey || `sk_test_YOUR_API_KEY`;
    const queryParams = getLiveQueryParams(selectedEndpointId);
    const queryStr = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
    const body = getLiveRequestBody(selectedEndpointId);

    if (ep.method === 'GET') {
      return `curl -X GET "${baseUrl}${resolvedPath}${queryStr}" \\
  -H "X-API-Key: ${displayKey}" \\
  -H "Content-Type: application/json"`;
    }
    return `curl -X ${ep.method} "${baseUrl}${resolvedPath}" \\
  -H "X-API-Key: ${displayKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body || {})}'`;
  }, [selectedEndpoint, selectedEndpointId, apiKey, baseUrl]);

  // Build fetch example
  const buildFetchExample = useCallback(() => {
    const ep = selectedEndpoint;
    const resolvedPath = ep.path;
    const displayKey = apiKey || `sk_test_YOUR_API_KEY`;
    const queryParams = getLiveQueryParams(selectedEndpointId);
    const queryStr = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
    const body = getLiveRequestBody(selectedEndpointId);

    const fetchOptions: { method: string; headers: Record<string, string>; body?: string } = {
      method: ep.method,
      headers: {
        'X-API-Key': displayKey,
        'Content-Type': 'application/json',
      },
    };

    if (ep.method !== 'GET' && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    return `fetch("${baseUrl}${resolvedPath}${queryStr}", ${JSON.stringify(fetchOptions, null, 2)})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
  }, [selectedEndpoint, apiKey, baseUrl]);

  // Copy handlers
  const handleCopyCurl = async () => {
    await navigator.clipboard.writeText(buildCurlExample());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyFetch = async () => {
    await navigator.clipboard.writeText(buildFetchExample());
    setCopiedFetch(true);
    setTimeout(() => setCopiedFetch(false), 2000);
  };

  // Add to history
  const addToHistory = useCallback((entry: Omit<RequestHistoryEntry, 'id'>) => {
    const newEntry: RequestHistoryEntry = {
      ...entry,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    };

    setRequestHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 20);
      localStorage.setItem(STORAGE_KEYS.REQUEST_HISTORY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear history
  const clearHistory = () => {
    setRequestHistory([]);
    localStorage.removeItem(STORAGE_KEYS.REQUEST_HISTORY);
  };

  // Run request — live fetch for sandbox/production, simulated for demo
  const handleRun = async () => {
    // Live requests in non-demo mode skip format validation (real keys may differ)
    if (errorSimulation !== 'live' || isDemoMode) {
      const validation = validateApiKey(apiKey);
      if (!validation.valid) {
        setKeyValidation(validation);
        return;
      }
    } else if (!apiKey) {
      setKeyValidation({ valid: false, message: 'API key is required for live requests' });
      return;
    }

    setIsRunning(true);
    setResponse(null);
    setResponseTime(null);
    setResponseStatus(null);

    const ep = selectedEndpoint;
    const resolvedPath = ep.path.replace(':id', 'biz_test_8f2k9x');

    // ── LIVE REQUEST: real fetch to the backend ──
    if (errorSimulation === 'live' && !isDemoMode) {
      // Build endpoint-specific request body and query params
      const liveRequestBody = getLiveRequestBody(selectedEndpointId);
      const queryParams = getLiveQueryParams(selectedEndpointId);
      const queryStr = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
      const liveUrl = `${baseUrl}${resolvedPath}${queryStr}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      };
      const fetchOptions: RequestInit = {
        method: ep.method,
        headers,
      };
      if (ep.method !== 'GET' && liveRequestBody) {
        fetchOptions.body = JSON.stringify(liveRequestBody);
      }

      const startTime = performance.now();
      try {
        const res = await fetch(liveUrl, fetchOptions);
        const elapsed = Math.round(performance.now() - startTime);
        const body = await res.json().catch(() => ({ error: 'Failed to parse response' }));
        const responseJson = JSON.stringify(body, null, 2);

        setResponse(responseJson);
        setResponseTime(elapsed);
        setResponseStatus(res.status);

        // Add to local history
        addToHistory({
          timestamp: new Date().toISOString(),
          endpoint: resolvedPath,
          method: ep.method,
          statusCode: res.status,
          responseTime: elapsed,
          requestBody: liveRequestBody ? JSON.stringify(liveRequestBody) : null,
          responseBody: responseJson,
        });
      } catch (err) {
        const elapsed = Math.round(performance.now() - startTime);
        const errorMessage = err instanceof Error ? err.message : 'Network error';
        const errorJson = JSON.stringify({ error: { code: 'NETWORK_ERROR', message: errorMessage } }, null, 2);

        setResponse(errorJson);
        setResponseTime(elapsed);
        setResponseStatus(0);

        addToHistory({
          timestamp: new Date().toISOString(),
          endpoint: resolvedPath,
          method: ep.method,
          statusCode: 0,
          responseTime: elapsed,
          requestBody: liveRequestBody ? JSON.stringify(liveRequestBody) : null,
          responseBody: errorJson,
          simulatedError: 'network',
        });
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // ── SIMULATED REQUEST: demo data or error simulation ──
    const delay = errorSimulation === 'timeout' ? 3000 : Math.floor(Math.random() * 171) + 80;

    setTimeout(() => {
      const simulatedTime = errorSimulation === 'timeout' ? 3000 : Math.floor(Math.random() * 171) + 80;
      const statusCode = getStatusCode(errorSimulation);

      let responseData: object;
      if (errorSimulation === '200') {
        responseData = endpointResponses[selectedEndpointId];
      } else {
        responseData = errorResponses[errorSimulation](resolvedPath);
      }

      const responseJson = JSON.stringify(responseData, null, 2);

      setResponse(responseJson);
      setResponseTime(simulatedTime);
      setResponseStatus(statusCode);
      setIsRunning(false);

      // Add to history
      addToHistory({
        timestamp: new Date().toISOString(),
        endpoint: resolvedPath,
        method: ep.method,
        statusCode,
        responseTime: simulatedTime,
        requestBody: ep.method !== 'GET' ? JSON.stringify({ business_id: 'biz_test_8f2k9x' }) : null,
        responseBody: responseJson,
        simulatedError: errorSimulation !== '200' ? errorSimulation : undefined,
      });
    }, delay);
  };

  // Generate webhook payload
  const generateWebhookPayload = useCallback((eventType: string) => {
    const basePayload = {
      id: 'evt_' + Math.random().toString(36).substr(2, 12),
      type: eventType,
      created: new Date().toISOString(),
      api_version: '2026-01-15',
      livemode: currentEnvironment === 'production',
    };

    const payloads: Record<string, object> = {
      'score.completed': {
        ...basePayload,
        data: {
          object: {
            business_id: 'biz_test_8f2k9x',
            lumiq_score: 74,
            risk_tier: 'low',
            sources_pulled: ['experian_biz', 'fico_sbss'],
          },
        },
      },
      'score.failed': {
        ...basePayload,
        data: {
          object: {
            business_id: 'biz_test_8f2k9x',
            error_code: 'bureau_unavailable',
            message: 'Unable to reach credit bureau',
          },
        },
      },
      'application.submitted': {
        ...basePayload,
        data: {
          object: {
            application_id: 'app_test_' + Math.random().toString(36).substr(2, 8),
            business_id: 'biz_test_8f2k9x',
            requested_amount: 75000,
            product_type: 'term_loan',
          },
        },
      },
      'application.approved': {
        ...basePayload,
        data: {
          object: {
            application_id: 'app_test_abc123',
            business_id: 'biz_test_8f2k9x',
            approved_amount: 65000,
            term_months: 24,
            rate: '8.25%',
          },
        },
      },
      'application.declined': {
        ...basePayload,
        data: {
          object: {
            application_id: 'app_test_xyz789',
            business_id: 'biz_test_8f2k9x',
            reason_codes: ['insufficient_credit_history', 'high_utilization'],
          },
        },
      },
      'portfolio.alert': {
        ...basePayload,
        data: {
          object: {
            alert_type: 'risk_increase',
            business_id: 'biz_test_8f2k9x',
            previous_tier: 'low',
            current_tier: 'moderate',
            trigger: 'score_decrease',
          },
        },
      },
      'business.updated': {
        ...basePayload,
        data: {
          object: {
            business_id: 'biz_test_8f2k9x',
            updated_fields: ['annual_revenue', 'employee_count'],
            previous_values: { annual_revenue: 1100000, employee_count: 15 },
            new_values: { annual_revenue: 1250000, employee_count: 18 },
          },
        },
      },
    };

    return payloads[eventType] || basePayload;
  }, [currentEnvironment]);

  // Update webhook preview when event type changes
  useEffect(() => {
    const payload = generateWebhookPayload(webhookEventType);
    setWebhookPayloadPreview(JSON.stringify(payload, null, 2));
  }, [webhookEventType, generateWebhookPayload]);

  // Send test webhook
  const handleSendWebhook = async () => {
    if (!webhookUrl) {
      setWebhookResult({ success: false, message: 'Please enter a webhook URL' });
      return;
    }

    // Basic URL validation
    try {
      new URL(webhookUrl);
    } catch {
      setWebhookResult({ success: false, message: 'Invalid webhook URL format' });
      return;
    }

    setWebhookSending(true);
    setWebhookResult(null);

    // Simulate sending (in a real app, this would make an actual request)
    setTimeout(() => {
      // Simulate success most of the time
      const success = Math.random() > 0.1;
      setWebhookResult({
        success,
        message: success
          ? `Test event sent successfully to ${webhookUrl}`
          : 'Failed to deliver webhook. Check your endpoint URL and try again.',
      });
      setWebhookSending(false);
    }, 1500);
  };

  // Get status background classes
  const getStatusBg = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-success/10 text-success';
    if (status >= 400 && status < 500) return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* API Key Configuration Section */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">API Key Configuration</h3>
            {currentEnvironment === 'sandbox' && (
              <Badge variant="warning" className="ml-2">Sandbox Mode</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual API Key Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Enter API Key</label>
              <Input
                type="password"
                placeholder={currentEnvironment === 'sandbox' ? 'sk_test_...' : 'sk_live_...'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="font-mono"
              />
              {keyValidation && (
                <div className={`flex items-center gap-2 text-xs ${keyValidation.valid ? 'text-success' : 'text-destructive'}`}>
                  {keyValidation.valid ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {keyValidation.message}
                </div>
              )}
            </div>

            {/* Credential Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Or Select from Credentials</label>
              <Select value={selectedCredentialId} onValueChange={handleSelectCredential}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved key..." />
                </SelectTrigger>
                <SelectContent>
                  {storedCredentials.length > 0 ? (
                    storedCredentials.map((cred) => (
                      <SelectItem key={cred.id} value={cred.id}>
                        <div className="flex items-center gap-2">
                          <span>{cred.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {cred.keyPrefix}...
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_none" disabled>
                      No saved credentials. Generate a key in the API Keys tab.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Simulation Toggle */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-warning" />
              <label className="text-sm font-medium">Response Simulation</label>
            </div>
            <Select value={errorSimulation} onValueChange={(v) => setErrorSimulation(v as ErrorSimulation)}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {errorSimulations.map((sim) => (
                  <SelectItem key={sim.value} value={sim.value}>
                    <div className="flex items-center gap-2">
                      {sim.icon}
                      <span>{sim.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {errorSimulation === 'live' && !isDemoMode
                ? 'Sends real requests to the backend API'
                : 'Simulate different API responses to test your error handling'}
            </p>
          </div>
        </div>

        {/* Request / Response Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request</h3>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCurl}
                      className="gap-1"
                    >
                      {copiedCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      cURL
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy as cURL command</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyFetch}
                      className="gap-1"
                    >
                      {copiedFetch ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      fetch
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy as fetch code</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Select
              value={selectedEndpointId}
              onValueChange={(v) => {
                setSelectedEndpointId(v);
                setResponse(null);
                setResponseTime(null);
                setResponseStatus(null);
              }}
            >
              <SelectTrigger className="mb-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {playgroundEndpoints.map(ep => (
                  <SelectItem key={ep.id} value={ep.id}>{ep.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <pre className="bg-foreground text-background p-4 rounded-xl text-xs overflow-auto h-48 font-mono">
              {buildCurlExample()}
            </pre>

            <Button
              onClick={handleRun}
              disabled={isRunning || !apiKey}
              className="mt-4 w-full"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Request
                </>
              )}
            </Button>

            {!apiKey && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Enter an API key above to run requests
              </p>
            )}
          </div>

          {/* Response Panel */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Response</h3>
                {errorSimulation === 'live' && !isDemoMode && response && (
                  <Badge variant="default" className="bg-primary/10 text-primary">Live</Badge>
                )}
                {currentEnvironment === 'sandbox' && errorSimulation !== 'live' && response && (
                  <Badge variant="warning">Sandbox</Badge>
                )}
                {errorSimulation !== '200' && errorSimulation !== 'live' && response && (
                  <Badge variant="destructive">Simulated Error</Badge>
                )}
              </div>
              {response && responseStatus !== null && responseTime !== null && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className={`px-2 py-1 rounded font-semibold ${getStatusBg(responseStatus)}`}>
                    {responseStatus} {responseStatus === 200 ? 'OK' : responseStatus === 401 ? 'Unauthorized' : responseStatus === 403 ? 'Forbidden' : responseStatus === 429 ? 'Rate Limited' : responseStatus === 408 ? 'Timeout' : 'Error'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {responseTime}ms
                  </span>
                </div>
              )}
            </div>

            <pre className="bg-muted p-4 rounded-xl text-xs overflow-auto h-72 font-mono">
              {response || '// Response will appear here'}
            </pre>
          </div>
        </div>

        {/* Request History Section */}
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                {historyOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <h3 className="text-lg font-semibold">Request History</h3>
                <Badge variant="secondary">{requestHistory.length}</Badge>
              </div>
              {requestHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHistory();
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t border-border">
                {requestHistory.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No requests yet. Run a request to see history.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border max-h-96 overflow-y-auto">
                    {requestHistory.map((entry) => (
                      <div key={entry.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedHistoryId(expandedHistoryId === entry.id ? null : entry.id)}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBg(entry.statusCode)}`}>
                              {entry.statusCode}
                            </span>
                            <span className="text-sm font-mono">{entry.method} {entry.endpoint}</span>
                            {entry.simulatedError && (
                              <Badge variant="outline" className="text-xs">Simulated</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{entry.responseTime}ms</span>
                            <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            {expandedHistoryId === entry.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {expandedHistoryId === entry.id && (
                          <div className="mt-4 space-y-3">
                            {entry.requestBody && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Request Body</p>
                                <pre className="bg-muted p-3 rounded-lg text-xs font-mono overflow-auto max-h-32">
                                  {entry.requestBody}
                                </pre>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Response Body</p>
                              <pre className="bg-muted p-3 rounded-lg text-xs font-mono overflow-auto max-h-48">
                                {entry.responseBody}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Webhook Test Section */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Webhook className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Webhook Test Sender</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Webhook URL</label>
                <Input
                  type="url"
                  placeholder="https://your-server.com/webhooks/lumiq"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Event Type</label>
                <Select value={webhookEventType} onValueChange={setWebhookEventType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {webhookEventTypes.map((evt) => (
                      <SelectItem key={evt.value} value={evt.value}>
                        {evt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSendWebhook}
                disabled={webhookSending || !webhookUrl}
                className="w-full"
              >
                {webhookSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Event
                  </>
                )}
              </Button>

              {webhookResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  webhookResult.success
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {webhookResult.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  {webhookResult.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Payload Preview</label>
              <pre className="bg-muted p-4 rounded-xl text-xs overflow-auto h-64 font-mono">
                {webhookPayloadPreview || '// Select an event type to see payload'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Bootstrap Key Section — lets user paste an existing API key to unblock first-key creation
const BootstrapKeySection: React.FC<{ onSetActive: (key: string) => void; envLabel: string }> = ({ onSetActive, envLabel }) => {
  const [pasteKey, setPasteKey] = useState('');

  const handleActivate = () => {
    const trimmed = pasteKey.trim();
    if (!trimmed) return;
    onSetActive(trimmed);
    setPasteKey('');
    toast.success('API key activated. You can now generate new keys.');
  };

  return (
    <div className="mb-6 p-4 bg-warning/5 border border-warning/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <span className="text-sm font-semibold">No Active API Key</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        To create new keys, paste an existing {envLabel} API key below. This authenticates your session with the backend.
      </p>
      <div className="flex gap-3">
        <Input
          type="password"
          placeholder={`Paste your ${envLabel === 'sandbox' ? 'sk_test_...' : 'sk_live_...'} key`}
          value={pasteKey}
          onChange={(e) => setPasteKey(e.target.value)}
          className="flex-1 font-mono"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && pasteKey.trim()) handleActivate();
          }}
        />
        <Button onClick={handleActivate} disabled={!pasteKey.trim()} variant="outline">
          <Key className="w-4 h-4 mr-2" />
          Activate
        </Button>
      </div>
    </div>
  );
};

// API Keys Panel
const ApiKeysPanel: React.FC<ApiConsoleProps> = ({
  apiKeys = [],
  isLoadingKeys,
  error,
  newKeyName = '',
  setNewKeyName,
  handleGenerateKey,
  isGeneratingKey,
  newlyGeneratedKey,
  setNewlyGeneratedKey,
  handleRevokeKey,
}) => {
  const { currentEnvironment } = useEnvironment();
  const { apiKey: activeApiKey, setApiKey: setActiveApiKey } = useApiKeyStore();

  const filteredKeys = apiKeys.filter((key) => {
    // Match by environment field
    if (key.environment === currentEnvironment) return true;
    // Fallback: match by key prefix
    if (currentEnvironment === 'sandbox' && (key.keyPrefix?.startsWith('sk_test_') || key.keyPrefix?.startsWith('lq_test_'))) return true;
    if (currentEnvironment === 'production' && (key.keyPrefix?.startsWith('sk_live_') || key.keyPrefix?.startsWith('lq_live_') || key.keyPrefix?.startsWith('lq_prod_'))) return true;
    return false;
  });

  /** Check if a key is the currently active key by comparing the prefix. */
  const isActiveKey = (key: ApiKey): boolean => {
    if (!activeApiKey) return false;
    if (key.key && activeApiKey === key.key) return true;
    if (key.keyPrefix && activeApiKey.startsWith(key.keyPrefix)) return true;
    return false;
  };

  const handleSetActive = (fullKey: string) => {
    setActiveApiKey(fullKey);
    toast.success('API key set as active for playground requests');
  };

  const envLabel = currentEnvironment === 'sandbox' ? 'sandbox' : 'production';

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">API Keys & OAuth Clients</h3>
      <p className="text-sm text-muted-foreground mb-6">Manage your API keys and OAuth client credentials for secure access.</p>

      {/* Create API Key form */}
      <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Generate New API Key</span>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Key name (e.g. My Sandbox Key)"
            value={newKeyName}
            onChange={(e) => setNewKeyName?.(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newKeyName.trim()) {
                handleGenerateKey?.();
              }
            }}
          />
          <Button
            onClick={handleGenerateKey}
            disabled={isGeneratingKey || !newKeyName.trim()}
          >
            {isGeneratingKey ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Key
              </>
            )}
          </Button>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>

      {/* Bootstrap: paste an existing API key when no keys are stored */}
      {!activeApiKey && filteredKeys.length === 0 && !newlyGeneratedKey && (
        <BootstrapKeySection onSetActive={handleSetActive} envLabel={envLabel} />
      )}

      {/* Newly generated key banner */}
      {newlyGeneratedKey && (
        <div className="mb-4 p-4 bg-success/10 border border-success/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-semibold text-success">Key Created: {newlyGeneratedKey.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Copy this key now -- it will not be shown again.
          </p>
          <code className="block bg-muted px-3 py-2 rounded-lg text-sm font-mono break-all">
            {newlyGeneratedKey.key}
          </code>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                handleSetActive(newlyGeneratedKey.key);
                setNewlyGeneratedKey?.(null);
              }}
            >
              <Zap className="w-4 h-4 mr-1" />
              Set as Active & Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(newlyGeneratedKey.key);
                toast.success('API key copied to clipboard');
              }}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy Key
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setNewlyGeneratedKey?.(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {isLoadingKeys ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeys.length > 0 ? filteredKeys.map((key) => {
            const active = isActiveKey(key);
            return (
              <div
                key={key.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl transition-all duration-200',
                  active ? 'bg-primary/5 border border-primary/20' : 'bg-muted',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{key.name}</span>
                  <span className="text-xs text-muted-foreground">{key.environment || 'development'}</span>
                  {active && (
                    <Badge variant="default" className="bg-primary/10 text-primary text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono text-muted-foreground">
                    {key.keyPrefix || `sk_...${key.key?.slice(-4) || '****'}`}
                  </code>
                  {key.key && !active && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetActive(key.key!)}
                      className="text-xs"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Set as Active
                    </Button>
                  )}
                  {handleRevokeKey && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRevokeKey(key.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No API keys yet. Use the form above to generate one.</p>
            </div>
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
        <button
          onClick={() => {
            toast.info('Webhook endpoint configuration coming soon');
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Add Endpoint
        </button>
      </div>

      <div className="space-y-4">
        {mockWebhookConfigs.map((wh) => (
          <div key={wh.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${(wh.deliveryMetrics?.failureRate ?? 0) > 1 ? 'bg-warning' : 'bg-success'}`} />
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
