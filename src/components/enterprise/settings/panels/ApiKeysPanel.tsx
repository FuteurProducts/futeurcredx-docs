// API Keys Panel - Key management with table and drawer

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Key, RefreshCw, Trash2,
  CheckCircle, XCircle, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ApiKey, Environment } from '../types';
import { CopyButton } from '@/components/ui/copy-button';
import { EmptyState } from '@/components/ui/empty-state';

interface ApiKeysPanelProps {
  apiKeys: ApiKey[];
  onCreateKey: (name: string, scopes: string[], environment: Environment) => void;
  onRevokeKey: (keyId: string) => void;
  onRotateKey: (keyId: string) => void;
}

const availableScopes = [
  { id: 'read:scores', label: 'Read Scores' },
  { id: 'read:businesses', label: 'Read Businesses' },
  { id: 'read:pii', label: 'Read PII' },
  { id: 'write:webhooks', label: 'Manage Webhooks' },
  { id: 'write:businesses', label: 'Create Businesses' },
];

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const ApiKeysPanel: React.FC<ApiKeysPanelProps> = ({
  apiKeys,
  onCreateKey,
  onRevokeKey,
  onRotateKey,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<Environment>('sandbox');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const toggleScope = (scopeId: string) => {
    setNewKeyScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  };

  const toggleKeyVisibility = (keyId: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const handleCreate = () => {
    if (newKeyName && newKeyScopes.length > 0) {
      onCreateKey(newKeyName, newKeyScopes, newKeyEnv);
      setShowDrawer(false);
      setNewKeyName('');
      setNewKeyScopes([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage API keys for programmatic access
          </p>
        </div>
        <Button onClick={() => setShowDrawer(true)}>
          <Plus className="h-4 w-4" />
          Create API Key
        </Button>
      </div>

      {/* Keys Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {apiKeys.length === 0 ? (
          <EmptyState
            icon={Key}
            title="No API keys yet"
            description="Create your first API key to start integrating with the LUMIQ AI platform."
            action={{ label: "Create API Key", onClick: () => setShowDrawer(true) }}
          />
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Key</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Environment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Scopes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Used</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{key.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {revealedKeys.has(key.id) ? key.keyMasked.replace(/\*/g, 'x') : key.keyMasked}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {revealedKeys.has(key.id) ? (
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Eye className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                      <CopyButton value={key.keyMasked} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      key.environment === 'production'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {key.environment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.slice(0, 2).map((scope) => (
                        <span key={scope} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {scope}
                        </span>
                      ))}
                      {key.scopes.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{key.scopes.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(key.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(key.lastUsed)}
                  </td>
                  <td className="px-4 py-3">
                    {key.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <XCircle className="h-3 w-3" />
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {key.status === 'active' && (
                        <>
                          <button
                            onClick={() => onRotateKey(key.id)}
                            className="p-1.5 hover:bg-muted rounded transition-colors"
                            title="Rotate"
                          >
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => onRevokeKey(key.id)}
                            className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                            title="Revoke"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Key Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create API Key</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDrawer(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="w-full h-9 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Environment</label>
                  <div className="flex gap-2">
                    {(['sandbox', 'production'] as Environment[]).map((env) => (
                      <button
                        key={env}
                        onClick={() => setNewKeyEnv(env)}
                        className={`flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                          newKeyEnv === env
                            ? env === 'production'
                              ? 'bg-success/10 border-success/20 text-success'
                              : 'bg-warning/10 border-warning/20 text-warning'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {env.charAt(0).toUpperCase() + env.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Scopes</label>
                  <div className="space-y-2">
                    {availableScopes.map((scope) => (
                      <label
                        key={scope.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newKeyScopes.includes(scope.id)}
                          onChange={() => toggleScope(scope.id)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{scope.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreate}
                  disabled={!newKeyName || newKeyScopes.length === 0}
                >
                  <Key className="h-4 w-4" />
                  Generate Key
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApiKeysPanel;
