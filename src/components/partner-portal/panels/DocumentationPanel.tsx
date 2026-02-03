/**
 * API Documentation Panel
 * Interactive API reference, versioning, code examples
 */

import React, { useState } from 'react';
import {
  Book, Code, Copy, ChevronRight, ExternalLink,
  Terminal, FileJson
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { mockApiVersions } from '../mockData';

const API_CATEGORIES = [
  {
    name: 'Customers',
    description: 'SMB entity management',
    endpoints: [
      { method: 'GET', path: '/customers', description: 'List all customers in a portfolio', scopes: ['customers:read'] },
      { method: 'GET', path: '/customers/:id', description: 'Get customer dossier (triggers PII audit)', scopes: ['customers:read'] },
      { method: 'POST', path: '/customers', description: 'Create a new SMB entity', scopes: ['customers:write'] },
      { method: 'PUT', path: '/customers/:id', description: 'Update customer information', scopes: ['customers:write'] },
    ],
  },
  {
    name: 'Credit Scores',
    description: 'Bureau data and scoring',
    endpoints: [
      { method: 'GET', path: '/scores', description: 'List scores for a portfolio', scopes: ['scores:read'] },
      { method: 'GET', path: '/scores/:id', description: 'Get score with data lineage', scopes: ['scores:read'] },
      { method: 'POST', path: '/scores/pull', description: 'Request a new bureau pull (soft inquiry)', scopes: ['scores:write'] },
    ],
  },
  {
    name: 'Offers',
    description: 'Prequal offer generation',
    endpoints: [
      { method: 'GET', path: '/offers', description: 'List offers for a portfolio', scopes: ['offers:read'] },
      { method: 'GET', path: '/offers/:id', description: 'Get offer details', scopes: ['offers:read'] },
      { method: 'POST', path: '/offers', description: 'Generate prequal offer', scopes: ['offers:write'] },
      { method: 'POST', path: '/offers/:id/accept', description: 'Accept an offer', scopes: ['offers:write'] },
    ],
  },
  {
    name: 'Applications',
    description: 'Loan application management',
    endpoints: [
      { method: 'GET', path: '/applications', description: 'List applications', scopes: ['applications:read'] },
      { method: 'GET', path: '/applications/:id', description: 'Get application details', scopes: ['applications:read'] },
      { method: 'POST', path: '/applications', description: 'Submit new application', scopes: ['applications:write'] },
      { method: 'PUT', path: '/applications/:id/decision', description: 'Update application decision', scopes: ['applications:write'] },
    ],
  },
  {
    name: 'Reports',
    description: 'Async report generation',
    endpoints: [
      { method: 'GET', path: '/reports', description: 'List report jobs', scopes: ['reports:read'] },
      { method: 'GET', path: '/reports/:id', description: 'Get report status and download URL', scopes: ['reports:read'] },
      { method: 'POST', path: '/reports', description: 'Request new report (async)', scopes: ['reports:write'] },
    ],
  },
  {
    name: 'Risk',
    description: 'Portfolio risk analytics',
    endpoints: [
      { method: 'GET', path: '/risk/summary', description: 'Portfolio risk summary', scopes: ['risk:read'] },
      { method: 'GET', path: '/risk/alerts', description: 'Early warning system alerts', scopes: ['risk:read'] },
      { method: 'GET', path: '/risk/concentrations', description: 'Risk concentration analysis', scopes: ['risk:read'] },
    ],
  },
];

export const DocumentationPanel: React.FC = () => {
  const { toast } = useToast();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Customers']));
  const [selectedEndpoint, setSelectedEndpoint] = useState<{
    category: string;
    endpoint: typeof API_CATEGORIES[0]['endpoints'][0];
  } | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Code copied to clipboard' });
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
      POST: 'bg-primary/10 text-primary border-primary/20',
      PUT: 'bg-warning/10 text-warning border-warning/20',
      DELETE: 'bg-destructive/10 text-destructive border-destructive/20',
      PATCH: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    };
    return <Badge className={colors[method] || 'bg-muted'}>{method}</Badge>;
  };

  const generateCurlExample = (method: string, path: string) => {
    const baseUrl = 'https://api.lumiq.ai/v2';
    const fullPath = path.replace(':id', 'example-id-123');
    
    let curl = `curl -X ${method} "${baseUrl}${fullPath}" \\
  -H "Authorization: Bearer lq_prod_your_api_key" \\
  -H "X-Portfolio-Id: portfolio-123" \\
  -H "Content-Type: application/json"`;
    
    if (method === 'POST' || method === 'PUT') {
      curl += ` \\
  -d '{
    "example": "data"
  }'`;
    }
    
    return curl;
  };

  const generateNodeExample = (method: string, path: string) => {
    const fullPath = path.replace(':id', 'example-id-123');
    
    return `const response = await fetch('https://api.lumiq.ai/v2${fullPath}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer ' + process.env.LUMIQ_API_KEY,
    'X-Portfolio-Id': 'portfolio-123',
    'Content-Type': 'application/json'
  }${method === 'POST' || method === 'PUT' ? `,
  body: JSON.stringify({
    example: 'data'
  })` : ''}
});

const data = await response.json();
console.log(data);`;
  };

  const generatePythonExample = (method: string, path: string) => {
    const fullPath = path.replace(':id', 'example-id-123');
    
    return `import requests

response = requests.${method.toLowerCase()}(
    'https://api.lumiq.ai/v2${fullPath}',
    headers={
        'Authorization': f'Bearer {os.environ["LUMIQ_API_KEY"]}',
        'X-Portfolio-Id': 'portfolio-123',
        'Content-Type': 'application/json'
    }${method === 'POST' || method === 'PUT' ? `,
    json={
        'example': 'data'
    }` : ''}
)

print(response.json())`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">API Documentation</h2>
          <p className="text-sm text-muted-foreground">
            Interactive API reference and code examples
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="https://docs.lumiq.ai" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Docs
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://api.lumiq.ai/v2/openapi.json" target="_blank" rel="noopener noreferrer">
              <FileJson className="h-4 w-4 mr-2" />
              OpenAPI Spec
            </a>
          </Button>
        </div>
      </div>

      {/* API Versions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {mockApiVersions.map((version) => (
              <div
                key={version.version}
                className={`flex-1 p-4 rounded-lg ${
                  version.status === 'current' ? 'bg-primary/10 border border-primary/20' :
                  version.status === 'deprecated' ? 'bg-warning/10 border border-warning/20' :
                  'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{version.version}</span>
                  <Badge variant={
                    version.status === 'current' ? 'default' :
                    version.status === 'deprecated' ? 'destructive' : 'secondary'
                  }>
                    {version.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Released: {new Date(version.releaseDate).toLocaleDateString()}
                </p>
                {version.sunsetDate && (
                  <p className="text-sm text-destructive mt-1">
                    Sunset: {new Date(version.sunsetDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-semibold mb-4">Endpoints</h3>
          {API_CATEGORIES.map((category) => (
            <Collapsible
              key={category.name}
              open={expandedCategories.has(category.name)}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      expandedCategories.has(category.name) ? 'rotate-90' : ''
                    }`} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary">{category.endpoints.length}</Badge>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-6 mt-1 space-y-1">
                  {category.endpoints.map((endpoint) => (
                    <div
                      key={`${endpoint.method}-${endpoint.path}`}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        selectedEndpoint?.endpoint === endpoint
                          ? 'bg-primary/10'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedEndpoint({ category: category.name, endpoint })}
                    >
                      {getMethodBadge(endpoint.method)}
                      <code className="text-xs font-mono truncate">{endpoint.path}</code>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Endpoint Detail */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getMethodBadge(selectedEndpoint.endpoint.method)}
                  <code className="text-lg font-mono">{selectedEndpoint.endpoint.path}</code>
                </div>
                <CardDescription>{selectedEndpoint.endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Required Scopes */}
                <div>
                  <h4 className="font-medium mb-2">Required Scopes</h4>
                  <div className="flex gap-2">
                    {selectedEndpoint.endpoint.scopes.map((scope) => (
                      <Badge key={scope} variant="outline">{scope}</Badge>
                    ))}
                  </div>
                </div>

                {/* Code Examples */}
                <Tabs defaultValue="curl" className="w-full">
                  <TabsList>
                    <TabsTrigger value="curl">
                      <Terminal className="h-4 w-4 mr-2" />
                      cURL
                    </TabsTrigger>
                    <TabsTrigger value="node">
                      <Code className="h-4 w-4 mr-2" />
                      Node.js
                    </TabsTrigger>
                    <TabsTrigger value="python">
                      <Code className="h-4 w-4 mr-2" />
                      Python
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="curl">
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                        <code>{generateCurlExample(selectedEndpoint.endpoint.method, selectedEndpoint.endpoint.path)}</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateCurlExample(selectedEndpoint.endpoint.method, selectedEndpoint.endpoint.path))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="node">
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                        <code>{generateNodeExample(selectedEndpoint.endpoint.method, selectedEndpoint.endpoint.path)}</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateNodeExample(selectedEndpoint.endpoint.method, selectedEndpoint.endpoint.path))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="python">
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                        <code>{generatePythonExample(selectedEndpoint.endpoint.method, selectedEndpoint.endpoint.path)}</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatePythonExample(selectedEndpoint.endpoint.method, selectedEndpoint.endpoint.path))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Response Example */}
                <div>
                  <h4 className="font-medium mb-2">Example Response</h4>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify({
                      data: {
                        id: 'example-123',
                        createdAt: '2025-01-22T10:00:00Z',
                        // Add more example fields based on endpoint
                      },
                      meta: {
                        lastUpdated: '2025-01-22T10:00:00Z',
                        dataSources: ['internal'],
                      },
                    }, null, 2)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Book className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Select an endpoint to view documentation</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Authentication Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Authentication</CardTitle>
          <CardDescription>
            All API requests require authentication and portfolio context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Required Headers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <code className="font-mono">Authorization</code>
                  <span className="text-muted-foreground">Bearer token</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono">X-Portfolio-Id</code>
                  <span className="text-muted-foreground">Required for all endpoints</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono">Content-Type</code>
                  <span className="text-muted-foreground">application/json</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Error Responses</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <code className="font-mono text-destructive">401</code>
                  <span className="text-muted-foreground">Invalid or expired token</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-destructive">403</code>
                  <span className="text-muted-foreground">Insufficient permissions</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-destructive">422</code>
                  <span className="text-muted-foreground">Missing portfolioId</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-warning">429</code>
                  <span className="text-muted-foreground">Rate limit exceeded</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationPanel;
