/**
 * Credentials Management Panel
 * Full API key lifecycle: generation, scoping, IP whitelisting, mTLS, rotation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, Copy, Eye, EyeOff, Plus, Trash2, Shield, Clock, RefreshCw,
  Lock, Globe, Calendar, Settings, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { ApiCredential, EnvironmentType, AuthMethod } from '../types';
import { mockCredentials } from '../mockData';
import { useAuditEmit } from '@/hooks/useAuditEmit';

const AVAILABLE_SCOPES = [
  { id: 'customers:read', label: 'Read Customers', category: 'Customers' },
  { id: 'customers:write', label: 'Write Customers', category: 'Customers' },
  { id: 'scores:read', label: 'Read Scores', category: 'Credit Scores' },
  { id: 'scores:write', label: 'Pull Scores', category: 'Credit Scores' },
  { id: 'offers:read', label: 'Read Offers', category: 'Offers' },
  { id: 'offers:write', label: 'Generate Offers', category: 'Offers' },
  { id: 'applications:read', label: 'Read Applications', category: 'Applications' },
  { id: 'applications:write', label: 'Submit Applications', category: 'Applications' },
  { id: 'reports:read', label: 'Read Reports', category: 'Reports' },
  { id: 'reports:write', label: 'Generate Reports', category: 'Reports' },
  { id: 'risk:read', label: 'Read Risk Data', category: 'Risk' },
  { id: 'webhooks:manage', label: 'Manage Webhooks', category: 'Webhooks' },
];

const CREDENTIALS_STORAGE_KEY = 'lumiqai-sandbox-credentials';

function loadCredentialsFromStorage(): ApiCredential[] | null {
  try {
    const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ApiCredential[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Corrupted storage; fall through to default
  }
  return null;
}

function saveCredentialsToStorage(credentials: ApiCredential[]) {
  try {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
  } catch {
    // Storage full or unavailable; fail silently
  }
}

export const CredentialsPanel: React.FC = () => {
  const { toast } = useToast();
  const { emit } = useAuditEmit();
  const [credentials, setCredentials] = useState<ApiCredential[]>(
    () => loadCredentialsFromStorage() ?? mockCredentials
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [, setSelectedCredential] = useState<ApiCredential | null>(null);
  const autoHideTimers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Persist credentials to localStorage whenever they change
  useEffect(() => {
    saveCredentialsToStorage(credentials);
  }, [credentials]);
  
  // Create form state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<EnvironmentType>('sandbox');
  const [newKeyAuthMethod, setNewKeyAuthMethod] = useState<AuthMethod>('api_key');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['customers:read', 'scores:read']);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [enableRotation, setEnableRotation] = useState(false);
  const [rotationDays, setRotationDays] = useState(90);
  const [expirationDays, setExpirationDays] = useState<number | null>(null);

  const handleCreateCredential = useCallback(() => {
    if (!newKeyName.trim()) {
      toast({ title: 'Error', description: 'Please enter a credential name', variant: 'destructive' });
      return;
    }

    // All client-generated keys use lq_test_ prefix to make it clear they are sandbox-only
    const prefix = newKeyEnv === 'production' ? 'lq_test_prod_' : 'lq_test_';
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fullKey = prefix + randomPart;
    const maskedKey = prefix + '****' + randomPart.slice(-4);

    const newCredential: ApiCredential = {
      id: `cred-${Date.now()}`,
      name: newKeyName,
      keyPrefix: maskedKey,
      fullKey: fullKey,
      environment: newKeyEnv,
      authMethod: newKeyAuthMethod,
      scopes: selectedScopes,
      ipWhitelist: ipWhitelist ? ipWhitelist.split(',').map(ip => ip.trim()) : [],
      rateLimitPerMinute: newKeyEnv === 'production' ? 1000 : 100,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'current-user@example.com',
      lastUsedAt: null,
      expiresAt: expirationDays ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString() : null,
      rotationPolicy: {
        enabled: enableRotation,
        intervalDays: rotationDays,
        lastRotatedAt: enableRotation ? new Date().toISOString() : null,
        nextRotationAt: enableRotation ? new Date(Date.now() + rotationDays * 24 * 60 * 60 * 1000).toISOString() : null,
        notifyDaysBefore: 14,
      },
    };

    setCredentials([newCredential, ...credentials]);
    setRevealedKeys(new Set([newCredential.id]));
    resetForm();

    toast({
      title: 'Sandbox Test Credential Created',
      description: 'This is a sandbox test key (lq_test_ prefix). Copy it now -- it will be masked on next page load.'
    });
  }, [newKeyName, newKeyEnv, newKeyAuthMethod, selectedScopes, ipWhitelist, expirationDays, enableRotation, rotationDays, credentials, toast]);

  const resetForm = () => {
    setNewKeyName('');
    setNewKeyEnv('sandbox');
    setNewKeyAuthMethod('api_key');
    setSelectedScopes(['customers:read', 'scores:read']);
    setIpWhitelist('');
    setEnableRotation(false);
    setRotationDays(90);
    setExpirationDays(null);
    setShowCreateModal(false);
  };

  const handleRevoke = (credId: string) => {
    setCredentials(credentials.map(c => 
      c.id === credId ? { ...c, status: 'revoked' as const } : c
    ));
    toast({ title: 'Credential Revoked', description: 'The credential has been deactivated' });
  };

  const handleRotate = (credId: string) => {
    const prefix = 'lq_prod_';
    const randomPart = Math.random().toString(36).substring(2, 15);
    
    setCredentials(credentials.map(c => {
      if (c.id === credId) {
        return {
          ...c,
          keyPrefix: prefix + '****' + randomPart.slice(-4),
          fullKey: prefix + randomPart,
          rotationPolicy: {
            ...c.rotationPolicy,
            lastRotatedAt: new Date().toISOString(),
            nextRotationAt: new Date(Date.now() + c.rotationPolicy.intervalDays * 24 * 60 * 60 * 1000).toISOString(),
          },
        };
      }
      return c;
    }));
    
    setRevealedKeys(new Set([credId]));
    toast({ title: 'Key Rotated', description: 'New key generated - copy it now!' });
  };

  const copyToClipboard = (text: string, credId?: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Copied to clipboard' });
    // Audit: credential value copied
    emit('EXPORT_INITIATED', {
      resourceType: 'credential',
      resourceId: credId,
      details: { action: 'copy_to_clipboard' },
    });
  };

  const toggleReveal = (credId: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(credId)) {
      newRevealed.delete(credId);
      // Clear any pending auto-hide timer
      const timer = autoHideTimers.current.get(credId);
      if (timer) { clearTimeout(timer); autoHideTimers.current.delete(credId); }
    } else {
      newRevealed.add(credId);
      // Audit: credential revealed
      emit('SCORE_VIEWED', {
        resourceType: 'credential',
        resourceId: credId,
        details: { action: 'reveal_key' },
      });
      // Auto-hide after 30 seconds
      const timer = setTimeout(() => {
        setRevealedKeys(prev => {
          const next = new Set(prev);
          next.delete(credId);
          return next;
        });
        autoHideTimers.current.delete(credId);
      }, 30_000);
      autoHideTimers.current.set(credId, timer);
    }
    setRevealedKeys(newRevealed);
  };

  // Cleanup auto-hide timers on unmount
  useEffect(() => {
    const timers = autoHideTimers.current;
    return () => { timers.forEach(t => clearTimeout(t)); timers.clear(); };
  }, []);

  const getStatusBadge = (cred: ApiCredential) => {
    if (cred.status === 'revoked') {
      return <Badge variant="destructive">Revoked</Badge>;
    }
    if (cred.expiresAt && new Date(cred.expiresAt) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (cred.expiresAt && new Date(cred.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Expiring Soon</Badge>;
    }
    return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Active</Badge>;
  };

  const getAuthMethodIcon = (method: AuthMethod) => {
    switch (method) {
      case 'oauth2': return <Shield className="h-4 w-4" />;
      case 'mtls': return <Lock className="h-4 w-4" />;
      default: return <Key className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">API Credentials</h2>
          <p className="text-sm text-muted-foreground">
            Manage API keys, OAuth clients, and mTLS certificates
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Credential
        </Button>
      </div>

      {/* Create Credential Form */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Create New Credential</CardTitle>
                <CardDescription>Configure authentication for your integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Credential Name</Label>
                    <Input
                      placeholder="e.g., Production Integration"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={newKeyEnv === 'sandbox' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setNewKeyEnv('sandbox')}
                      >
                        Sandbox
                      </Button>
                      <Button
                        variant={newKeyEnv === 'production' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setNewKeyEnv('production')}
                      >
                        Production
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Auth Method</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={newKeyAuthMethod === 'api_key' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewKeyAuthMethod('api_key')}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        API Key
                      </Button>
                      <Button
                        variant={newKeyAuthMethod === 'oauth2' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewKeyAuthMethod('oauth2')}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        OAuth2
                      </Button>
                      <Button
                        variant={newKeyAuthMethod === 'mtls' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewKeyAuthMethod('mtls')}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        mTLS
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Scopes */}
                <div className="space-y-2">
                  <Label>Scopes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-muted/50 rounded-lg">
                    {AVAILABLE_SCOPES.map((scope) => (
                      <label key={scope.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScopes([...selectedScopes, scope.id]);
                            } else {
                              setSelectedScopes(selectedScopes.filter(s => s !== scope.id));
                            }
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm">{scope.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Security Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>IP Whitelist (optional)</Label>
                    <Input
                      placeholder="e.g., 203.0.113.0/24, 198.51.100.0/24"
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated CIDR ranges. Leave empty to allow all IPs.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Expiration (optional)</Label>
                    <div className="flex gap-2">
                      {[null, 30, 90, 365].map((days) => (
                        <Button
                          key={days ?? 'never'}
                          variant={expirationDays === days ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setExpirationDays(days)}
                        >
                          {days ? `${days} days` : 'Never'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rotation Policy */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Automatic Key Rotation</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically rotate keys every {rotationDays} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {enableRotation && (
                      <select
                        value={rotationDays}
                        onChange={(e) => setRotationDays(Number(e.target.value))}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                        <option value={180}>180 days</option>
                        <option value={365}>365 days</option>
                      </select>
                    )}
                    <Switch checked={enableRotation} onCheckedChange={setEnableRotation} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button onClick={handleCreateCredential}>Create Credential</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sandbox Notice */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/5 border border-chart-4/20">
        <Info className="h-4 w-4 text-chart-4 mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-chart-4">Sandbox Mode</span> -- All credentials generated here are client-side test keys with the{' '}
          <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">lq_test_</code> prefix.
          They are persisted in your browser's local storage and are not valid for production API calls.
        </p>
      </div>

      {/* Credentials List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({credentials.length})</TabsTrigger>
          <TabsTrigger value="production">
            Production ({credentials.filter(c => c.environment === 'production').length})
          </TabsTrigger>
          <TabsTrigger value="sandbox">
            Sandbox ({credentials.filter(c => c.environment === 'sandbox').length})
          </TabsTrigger>
        </TabsList>

        {['all', 'production', 'sandbox'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {credentials
              .filter(c => tab === 'all' || c.environment === tab)
              .map((cred) => (
                <motion.div
                  key={cred.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border bg-background ${
                    cred.status === 'revoked' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        cred.environment === 'production'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-chart-4/10 text-chart-4'
                      }`}>
                        {getAuthMethodIcon(cred.authMethod)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{cred.name}</span>
                          <Badge variant="outline" className={
                            cred.environment === 'production'
                              ? 'bg-primary/10 text-primary border-primary/20'
                              : 'bg-chart-4/10 text-chart-4 border-chart-4/20'
                          }>
                            {cred.environment}
                          </Badge>
                          <Badge variant="outline">{cred.authMethod.toUpperCase()}</Badge>
                          {getStatusBadge(cred)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <code className="font-mono bg-muted px-2 py-0.5 rounded">
                            {revealedKeys.has(cred.id) && cred.fullKey ? cred.fullKey : cred.keyPrefix}
                          </code>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Created {new Date(cred.createdAt).toLocaleDateString()}
                          </span>
                          {cred.lastUsedAt && (
                            <span>Last used {new Date(cred.lastUsedAt).toLocaleString()}</span>
                          )}
                        </div>
                        {cred.ipWhitelist.length > 0 && (
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">IP Whitelist:</span>
                            {cred.ipWhitelist.map((ip) => (
                              <Badge key={ip} variant="secondary" className="text-xs">{ip}</Badge>
                            ))}
                          </div>
                        )}
                        {cred.rotationPolicy.enabled && cred.rotationPolicy.nextRotationAt && (
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Next rotation: {new Date(cred.rotationPolicy.nextRotationAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-1 mt-2">
                          {cred.scopes.slice(0, 4).map((scope) => (
                            <Badge key={scope} variant="secondary" className="text-xs">{scope}</Badge>
                          ))}
                          {cred.scopes.length > 4 && (
                            <Badge variant="secondary" className="text-xs">+{cred.scopes.length - 4} more</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => copyToClipboard(cred.fullKey || cred.keyPrefix, cred.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      {cred.fullKey && (
                        <Button size="icon" variant="ghost" onClick={() => toggleReveal(cred.id)}>
                          {revealedKeys.has(cred.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      )}
                      {cred.status === 'active' && cred.rotationPolicy.enabled && (
                        <Button size="icon" variant="ghost" onClick={() => handleRotate(cred.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => setSelectedCredential(cred)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      {cred.status === 'active' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRevoke(cred.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Rate Limit Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate Limits by Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-chart-4" />
                <span className="font-medium">Sandbox</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>100 requests/minute</p>
                <p>10,000 requests/day</p>
                <p>100,000 requests/month</p>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium">Production</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>1,000 requests/minute</p>
                <p>100,000 requests/day</p>
                <p>2,000,000 requests/month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialsPanel;
