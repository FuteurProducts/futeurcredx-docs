/**
 * Partner API Portal
 * Allows bank partners to manage API keys, view usage, and access endpoint documentation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Code,
  Book,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Users,
  FileText,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey?: string;
  environment: 'sandbox' | 'production';
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
  callsThisMonth: number;
  rateLimit: number;
}

interface UsageStats {
  totalCalls: number;
  successRate: number;
  avgLatency: number;
  callsByEndpoint: { endpoint: string; count: number; avgLatency: number }[];
  dailyUsage: { date: string; calls: number }[];
}

// Demo API Keys
const demoApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Integration',
    keyPrefix: 'lq_prod_****8f2a',
    environment: 'production',
    scopes: ['scores:read', 'customers:read', 'offers:write'],
    createdAt: '2025-01-15',
    lastUsed: '2025-01-22T14:30:00Z',
    status: 'active',
    callsThisMonth: 12450,
    rateLimit: 1000,
  },
  {
    id: 'key-2',
    name: 'Sandbox Testing',
    keyPrefix: 'lq_test_****3b91',
    environment: 'sandbox',
    scopes: ['scores:read', 'scores:write', 'customers:read', 'customers:write'],
    createdAt: '2025-01-10',
    lastUsed: '2025-01-22T16:45:00Z',
    status: 'active',
    callsThisMonth: 3280,
    rateLimit: 100,
  },
];

const demoUsageStats: UsageStats = {
  totalCalls: 15730,
  successRate: 99.2,
  avgLatency: 145,
  callsByEndpoint: [
    { endpoint: 'GET /customers', count: 5240, avgLatency: 120 },
    { endpoint: 'GET /scores', count: 4180, avgLatency: 135 },
    { endpoint: 'POST /scores/pull', count: 2890, avgLatency: 280 },
    { endpoint: 'POST /offers', count: 1820, avgLatency: 165 },
    { endpoint: 'GET /reports', count: 1600, avgLatency: 95 },
  ],
  dailyUsage: [
    { date: 'Jan 16', calls: 1850 },
    { date: 'Jan 17', calls: 2100 },
    { date: 'Jan 18', calls: 1920 },
    { date: 'Jan 19', calls: 980 },
    { date: 'Jan 20', calls: 920 },
    { date: 'Jan 21', calls: 2340 },
    { date: 'Jan 22', calls: 2680 },
  ],
};

const apiEndpoints = [
  {
    category: 'Customers',
    icon: Users,
    endpoints: [
      { method: 'GET', path: '/customers', description: 'List all SMB entities in a portfolio', scopes: ['customers:read'] },
      { method: 'GET', path: '/customers/:id', description: 'Get full customer dossier (triggers PII audit)', scopes: ['customers:read'] },
      { method: 'POST', path: '/customers', description: 'Create a new SMB entity', scopes: ['customers:write'] },
    ],
  },
  {
    category: 'Credit Scores',
    icon: CreditCard,
    endpoints: [
      { method: 'GET', path: '/scores', description: 'List credit scores for a portfolio', scopes: ['scores:read'] },
      { method: 'GET', path: '/scores/:id', description: 'Get score with data lineage', scopes: ['scores:read'] },
      { method: 'POST', path: '/scores/pull', description: 'Request a new bureau pull (soft inquiry)', scopes: ['scores:write'] },
    ],
  },
  {
    category: 'Offers & Applications',
    icon: FileText,
    endpoints: [
      { method: 'GET', path: '/offers', description: 'List prequal offers for a portfolio', scopes: ['offers:read'] },
      { method: 'POST', path: '/offers', description: 'Generate a prequal offer for an entity', scopes: ['offers:write'] },
      { method: 'GET', path: '/applications', description: 'List applications', scopes: ['applications:read'] },
      { method: 'POST', path: '/applications', description: 'Submit an application', scopes: ['applications:write'] },
    ],
  },
  {
    category: 'Reports & Analytics',
    icon: BarChart3,
    endpoints: [
      { method: 'POST', path: '/reports', description: 'Request a new report (async)', scopes: ['reports:write'] },
      { method: 'GET', path: '/reports/:id', description: 'Get report status and download URL', scopes: ['reports:read'] },
      { method: 'GET', path: '/risk/summary', description: 'Portfolio risk summary', scopes: ['risk:read'] },
    ],
  },
];

const PartnerPortal: React.FC = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(demoApiKeys);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast({ title: 'Error', description: 'Please enter a key name', variant: 'destructive' });
      return;
    }

    const prefix = newKeyEnv === 'production' ? 'lq_prod_' : 'lq_test_';
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fullKey = prefix + randomPart;
    const maskedKey = prefix + '****' + randomPart.slice(-4);

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyPrefix: maskedKey,
      fullKey: fullKey,
      environment: newKeyEnv,
      scopes: ['scores:read', 'customers:read'],
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      status: 'active',
      callsThisMonth: 0,
      rateLimit: newKeyEnv === 'production' ? 1000 : 100,
    };

    setApiKeys([newKey, ...apiKeys]);
    setGeneratedKey(fullKey);
    setNewKeyName('');
    setShowNewKeyModal(false);
    
    toast({ 
      title: 'API Key Created', 
      description: 'Copy your key now - it won\'t be shown again!' 
    });
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(k => 
      k.id === keyId ? { ...k, status: 'revoked' as const } : k
    ));
    toast({ title: 'Key Revoked', description: 'The API key has been deactivated' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Copied to clipboard' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Partner API Portal</h1>
          <p className="text-muted-foreground">Manage API keys, view usage, and access documentation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
            <CheckCircle className="h-4 w-4 mr-1" />
            API Status: Operational
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="keys" className="gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Usage Stats
          </TabsTrigger>
          <TabsTrigger value="docs" className="gap-2">
            <Book className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-4">
          {/* Generated Key Alert */}
          {generatedKey && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-chart-2/10 border border-chart-2/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-chart-2">Your new API key (copy now!):</p>
                  <code className="text-sm bg-background px-2 py-1 rounded mt-1 block font-mono">
                    {generatedKey}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedKey)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setGeneratedKey(null)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Create Key */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your API Keys</CardTitle>
                  <CardDescription>Manage keys for sandbox and production environments</CardDescription>
                </div>
                <Button onClick={() => setShowNewKeyModal(!showNewKeyModal)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>

            {showNewKeyModal && (
              <div className="px-6 pb-4 border-b">
                <div className="flex items-end gap-4 bg-muted/50 p-4 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Key Name</label>
                    <Input 
                      placeholder="e.g., Production Integration"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Environment</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={newKeyEnv === 'sandbox' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewKeyEnv('sandbox')}
                      >
                        Sandbox
                      </Button>
                      <Button 
                        variant={newKeyEnv === 'production' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewKeyEnv('production')}
                      >
                        Production
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleGenerateKey}>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            )}

            <CardContent className="pt-4">
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-lg border ${
                      key.status === 'revoked' ? 'bg-muted/30 opacity-60' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          key.environment === 'production' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-chart-4/10 text-chart-4'
                        }`}>
                          <Key className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{key.name}</span>
                            <Badge variant="outline" className={
                              key.environment === 'production' 
                                ? 'bg-primary/10 text-primary border-primary/20' 
                                : 'bg-chart-4/10 text-chart-4 border-chart-4/20'
                            }>
                              {key.environment}
                            </Badge>
                            {key.status === 'revoked' && (
                              <Badge variant="destructive">Revoked</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <code className="font-mono">
                              {revealedKey === key.id && key.fullKey ? key.fullKey : key.keyPrefix}
                            </code>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Created {key.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{key.callsThisMonth.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">calls this month</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => copyToClipboard(key.keyPrefix)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {key.fullKey && (
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => setRevealedKey(revealedKey === key.id ? null : key.id)}
                            >
                              {revealedKey === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          )}
                          {key.status === 'active' && (
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRevokeKey(key.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {key.scopes.map((scope) => (
                        <Badge key={scope} variant="secondary" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Stats Tab */}
        <TabsContent value="usage" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total API Calls</p>
                    <p className="text-2xl font-bold">{demoUsageStats.totalCalls.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-chart-2">{demoUsageStats.successRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-chart-2 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Latency</p>
                    <p className="text-2xl font-bold">{demoUsageStats.avgLatency}ms</p>
                  </div>
                  <Zap className="h-8 w-8 text-chart-4 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rate Limit</p>
                    <p className="text-2xl font-bold">1,000/min</p>
                  </div>
                  <Shield className="h-8 w-8 text-muted-foreground opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage by Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle>Usage by Endpoint</CardTitle>
              <CardDescription>API calls breakdown for the current billing period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoUsageStats.callsByEndpoint.map((endpoint) => {
                  const percentage = (endpoint.count / demoUsageStats.totalCalls) * 100;
                  return (
                    <div key={endpoint.endpoint} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{endpoint.endpoint}</code>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{endpoint.avgLatency}ms avg</span>
                          <span className="font-medium">{endpoint.count.toLocaleString()} calls</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Daily Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily API Usage</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {demoUsageStats.dailyUsage.map((day) => {
                  const maxCalls = Math.max(...demoUsageStats.dailyUsage.map(d => d.calls));
                  const height = (day.calls / maxCalls) * 100;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{day.date.split(' ')[1]}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                API Reference
              </CardTitle>
              <CardDescription>
                Base URL: <code className="bg-muted px-2 py-1 rounded">https://api.lumiq.ai/v1</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiEndpoints.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category} className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.endpoints.map((endpoint) => (
                          <div 
                            key={endpoint.path}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Badge className={
                                endpoint.method === 'GET' 
                                  ? 'bg-chart-2 hover:bg-chart-2' 
                                  : 'bg-chart-4 hover:bg-chart-4'
                              }>
                                {endpoint.method}
                              </Badge>
                              <code className="font-mono text-sm">{endpoint.path}</code>
                              <span className="text-muted-foreground text-sm">{endpoint.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {endpoint.scopes.map(scope => (
                                <Badge key={scope} variant="outline" className="text-xs">
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Start Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Fetch customers from your portfolio
const response = await fetch(
  'https://api.lumiq.ai/v1/customers?portfolioId=YOUR_PORTFOLIO_ID',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const { data, meta, pagination } = await response.json();

// Pull a credit score
const pullResponse = await fetch(
  'https://api.lumiq.ai/v1/scores/pull?portfolioId=YOUR_PORTFOLIO_ID',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      smbEntityId: 'CUSTOMER_ID',
      source: 'experian_biz'
    })
  }
);`}
              </pre>
              <Button variant="outline" className="mt-4" onClick={() => copyToClipboard(`curl -X GET 'https://api.lumiq.ai/v1/customers?portfolioId=YOUR_PORTFOLIO_ID' -H 'Authorization: Bearer YOUR_API_KEY'`)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy cURL Example
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-chart-2" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">API Key Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    All API requests must include your API key in the Authorization header:
                  </p>
                  <code className="block bg-muted p-2 rounded text-sm">
                    Authorization: Bearer lq_prod_xxxxx
                  </code>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Portfolio Scoping</h4>
                  <p className="text-sm text-muted-foreground">
                    All requests require a <code className="bg-muted px-1 rounded">portfolioId</code> parameter. 
                    You can only access data within portfolios assigned to your API key.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-chart-4" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sandbox</span>
                    <Badge variant="outline">100 req/min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Production</span>
                    <Badge variant="outline">1,000 req/min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Burst</span>
                    <Badge variant="outline">50 req/sec</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Rate limit headers are included in all responses:
                  <code className="block mt-1 bg-muted p-2 rounded text-xs">
                    X-RateLimit-Remaining: 950
                  </code>
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
                <CardDescription>All API access is logged for compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">PII Access</p>
                    <p className="text-muted-foreground">Every access to customer dossiers triggers a VIEW_PII audit event</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Credit Pulls</p>
                    <p className="text-muted-foreground">Score pull requests are logged with SOFT_PULL_REQUESTED events</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Data Export</p>
                    <p className="text-muted-foreground">Report downloads are tracked with REPORT_DOWNLOADED events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerPortal;
