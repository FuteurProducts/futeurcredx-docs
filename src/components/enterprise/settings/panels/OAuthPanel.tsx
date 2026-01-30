/**
 * OAuth Clients Panel
 * OAuth 2.0 client management for third-party integrations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Plus, Trash2, Copy, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface OAuthClientLocal {
  id: string;
  name: string;
  clientId: string;
  clientSecret?: string;
  redirectUris: string[];
  scopes: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { mockOAuthClients } from '../mockData';


export const OAuthPanel: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<OAuthClientLocal[]>(mockOAuthClients.map(c => ({ ...c, clientSecret: undefined })));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  
  // Form state
  const [newName, setNewName] = useState('');
  const [newRedirectUris, setNewRedirectUris] = useState('');
  const [newScopes, setNewScopes] = useState<string[]>(['openid', 'profile']);

  const availableScopes = [
    { id: 'openid', label: 'OpenID Connect', required: true },
    { id: 'profile', label: 'User Profile', required: false },
    { id: 'email', label: 'Email Address', required: false },
    { id: 'read:scores', label: 'Read Credit Scores', required: false },
    { id: 'read:businesses', label: 'Read Business Data', required: false },
    { id: 'write:webhooks', label: 'Manage Webhooks', required: false },
  ];

  const handleCreate = () => {
    if (!newName.trim()) {
      toast({ title: 'Error', description: 'Please enter a client name', variant: 'destructive' });
      return;
    }

    const newClient: OAuthClientLocal = {
      id: `oauth-${Date.now()}`,
      name: newName,
      clientId: `client_${Math.random().toString(36).substring(2, 15)}`,
      clientSecret: `secret_${Math.random().toString(36).substring(2, 30)}`,
      redirectUris: newRedirectUris.split('\n').filter(uri => uri.trim()),
      scopes: newScopes,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setClients([newClient, ...clients]);
    setNewName('');
    setNewRedirectUris('');
    setNewScopes(['openid', 'profile']);
    setShowCreateDialog(false);
    toast({ title: 'OAuth Client Created', description: 'Save the client secret - it won\'t be shown again!' });
  };

  const handleDelete = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast({ title: 'Client Deleted', description: 'The OAuth client has been removed' });
  };

  const handleRotateSecret = (clientId: string) => {
    setClients(clients.map(c => {
      if (c.id === clientId) {
        return { ...c, clientSecret: `secret_${Math.random().toString(36).substring(2, 30)}` };
      }
      return c;
    }));
    toast({ title: 'Secret Rotated', description: 'Update your application with the new secret' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">OAuth Clients</h2>
          <p className="text-sm text-muted-foreground">
            Manage OAuth 2.0 clients for third-party application integrations
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create OAuth Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input 
                  placeholder="e.g., Mobile App, Partner Portal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Redirect URIs (one per line)</Label>
                <textarea 
                  className="w-full h-24 p-3 text-sm bg-muted rounded-lg border border-border"
                  placeholder="https://app.example.com/callback&#10;myapp://callback"
                  value={newRedirectUris}
                  onChange={(e) => setNewRedirectUris(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Scopes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableScopes.map((scope) => (
                    <label key={scope.id} className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted">
                      <input 
                        type="checkbox"
                        checked={newScopes.includes(scope.id)}
                        disabled={scope.required}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewScopes([...newScopes, scope.id]);
                          } else {
                            setNewScopes(newScopes.filter(s => s !== scope.id));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{scope.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Client</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={client.status === 'active' ? 'bg-chart-2/10 text-chart-2' : 'bg-muted'}>
                        {client.status}
                      </Badge>
                    </div>

                    {/* Credentials */}
                    <div className="grid gap-2 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-20">Client ID:</span>
                        <code className="text-xs font-mono bg-background px-2 py-1 rounded">{client.clientId}</code>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(client.clientId)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      {client.clientSecret && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-20">Secret:</span>
                          <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                            {revealedSecrets.has(client.id) ? client.clientSecret : '••••••••••••••••••••'}
                          </code>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6" 
                            onClick={() => {
                              const next = new Set(revealedSecrets);
                              if (next.has(client.id)) next.delete(client.id);
                              else next.add(client.id);
                              setRevealedSecrets(next);
                            }}
                          >
                            {revealedSecrets.has(client.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(client.clientSecret || '')}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Redirect URIs */}
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Redirect URIs:</span>
                      <div className="flex flex-wrap gap-1">
                        {client.redirectUris.map((uri, idx) => (
                          <code key={idx} className="text-xs bg-muted px-2 py-1 rounded">{uri}</code>
                        ))}
                      </div>
                    </div>

                    {/* Scopes */}
                    <div className="flex gap-1">
                      {client.scopes.map((scope) => (
                        <Badge key={scope} variant="secondary" className="text-xs">{scope}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleRotateSecret(client.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Rotate Secret
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">No OAuth Clients</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create an OAuth client to enable third-party integrations
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OAuthPanel;
