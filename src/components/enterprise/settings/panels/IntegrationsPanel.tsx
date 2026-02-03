/**
 * Integrations Panel
 * Third-party service connections and configuration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plug, CheckCircle, XCircle, RefreshCw, Settings, 
  AlertTriangle, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  category: 'bureau' | 'aggregator' | 'accounting' | 'verification' | 'communication';
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  enabled: boolean;
  logo?: string;
}

const mockIntegrations: Integration[] = [
  { id: 'experian', name: 'Experian', category: 'bureau', description: 'Consumer and business credit reports', status: 'connected', lastSync: '2024-01-15T14:00:00Z', enabled: true },
  { id: 'equifax', name: 'Equifax', category: 'bureau', description: 'Credit reports and scores', status: 'connected', lastSync: '2024-01-15T13:30:00Z', enabled: true },
  { id: 'dnb', name: 'Dun & Bradstreet', category: 'bureau', description: 'Business credit and company data', status: 'connected', lastSync: '2024-01-15T12:00:00Z', enabled: true },
  { id: 'plaid', name: 'Plaid', category: 'aggregator', description: 'Bank account aggregation', status: 'connected', lastSync: '2024-01-15T14:30:00Z', enabled: true },
  { id: 'mx', name: 'MX', category: 'aggregator', description: 'Financial data aggregation', status: 'disconnected', lastSync: null, enabled: false },
  { id: 'yodlee', name: 'Yodlee', category: 'aggregator', description: 'Account aggregation platform', status: 'error', lastSync: '2024-01-14T00:00:00Z', enabled: true },
  { id: 'quickbooks', name: 'QuickBooks', category: 'accounting', description: 'Accounting software integration', status: 'connected', lastSync: '2024-01-15T10:00:00Z', enabled: true },
  { id: 'xero', name: 'Xero', category: 'accounting', description: 'Cloud accounting platform', status: 'connected', lastSync: '2024-01-15T11:00:00Z', enabled: true },
  { id: 'persona', name: 'Persona', category: 'verification', description: 'Identity verification', status: 'connected', lastSync: '2024-01-15T09:00:00Z', enabled: true },
  { id: 'twilio', name: 'Twilio', category: 'communication', description: 'SMS and voice communications', status: 'connected', lastSync: '2024-01-15T08:00:00Z', enabled: true },
];

const categoryLabels: Record<string, string> = {
  bureau: 'Credit Bureaus',
  aggregator: 'Data Aggregators',
  accounting: 'Accounting Software',
  verification: 'Identity Verification',
  communication: 'Communications',
};

export const IntegrationsPanel: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const handleToggle = (id: string, enabled: boolean) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, enabled } : i
    ));
    toast({ 
      title: enabled ? 'Integration Enabled' : 'Integration Disabled',
      description: `Changes saved successfully`
    });
  };

  const handleReconnect = () => {
    toast({ title: 'Reconnecting...', description: 'Please wait while we re-establish the connection' });
  };

  const handleSync = () => {
    toast({ title: 'Sync Started', description: 'Data synchronization in progress' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  // Group integrations by category
  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Manage third-party service connections and data sources
          </p>
        </div>
        <Button variant="outline" onClick={() => {
          toast({ title: 'Integration setup wizard coming soon' });
        }}>
          <Plug className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'error').length}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <XCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'disconnected').length}</div>
              <div className="text-sm text-muted-foreground">Disconnected</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations by Category */}
      {Object.entries(groupedIntegrations).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {categoryLabels[category]}
          </h3>
          
          <div className="space-y-3">
            {items.map((integration) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className={integration.status === 'error' ? 'border-destructive/30' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Plug className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{integration.name}</h4>
                            {getStatusBadge(integration.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                          {integration.lastSync && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              Last sync: {new Date(integration.lastSync).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {integration.status === 'error' && (
                          <Button variant="outline" size="sm" onClick={handleReconnect}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reconnect
                          </Button>
                        )}
                        {integration.status === 'connected' && (
                          <Button variant="ghost" size="sm" onClick={handleSync}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Switch 
                          checked={integration.enabled}
                          onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntegrationsPanel;
