/**
 * IP Allowlist Panel
 * Manage IP addresses and CIDR ranges for API access control
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Plus, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { mockIpAllowlist } from '../mockData';
import type { IpAllowlistEntry } from '../types';

export const IpAllowlistPanel: React.FC = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<IpAllowlistEntry[]>(mockIpAllowlist);
  const [enforceAllowlist, setEnforceAllowlist] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [newIp, setNewIp] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const validateIp = (ip: string): boolean => {
    // Basic IP/CIDR validation
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}(\/\d{1,3})?$/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  };

  const handleAdd = () => {
    if (!validateIp(newIp)) {
      toast({ title: 'Invalid IP', description: 'Please enter a valid IP address or CIDR range', variant: 'destructive' });
      return;
    }

    const newEntry: IpAllowlistEntry = {
      id: `ip-${Date.now()}`,
      ipOrCidr: newIp,
      description: newDescription || 'No description',
      addedBy: 'current.user@bank.com',
      addedOn: new Date().toISOString(),
    };

    setEntries([...entries, newEntry]);
    setNewIp('');
    setNewDescription('');
    setShowAddForm(false);
    toast({ title: 'IP Added', description: 'The IP address has been added to the allowlist' });
  };

  const handleDelete = (entryId: string) => {
    setEntries(entries.filter(e => e.id !== entryId));
    toast({ title: 'IP Removed', description: 'The IP address has been removed from the allowlist' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">IP Allowlist</h2>
          <p className="text-sm text-muted-foreground">
            Restrict API access to specific IP addresses and ranges
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add IP Address
        </Button>
      </div>

      {/* Enforcement Toggle */}
      <Card className={enforceAllowlist ? 'border-chart-2/30 bg-chart-2/5' : 'border-warning/30 bg-warning/5'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {enforceAllowlist ? (
                <Shield className="h-8 w-8 text-chart-2" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-warning" />
              )}
              <div>
                <h3 className="font-medium">
                  {enforceAllowlist ? 'IP Allowlist Enforced' : 'IP Allowlist Disabled'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {enforceAllowlist 
                    ? 'Only listed IPs can access the API'
                    : 'Warning: Any IP can access the API'}
                </p>
              </div>
            </div>
            <Switch 
              checked={enforceAllowlist} 
              onCheckedChange={(checked) => {
                setEnforceAllowlist(checked);
                toast({ 
                  title: checked ? 'Allowlist Enabled' : 'Allowlist Disabled',
                  description: checked ? 'API access is now restricted' : 'Warning: All IPs can now access the API',
                  variant: checked ? 'default' : 'destructive'
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>IP Address or CIDR Range</Label>
                  <Input 
                    placeholder="e.g., 192.168.1.0/24 or 203.0.113.50"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports IPv4, IPv6, and CIDR notation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    placeholder="e.g., Corporate HQ, Dev Office"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add to Allowlist</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Entries List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allowed IP Addresses</CardTitle>
          <CardDescription>{entries.length} entries configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm font-medium">{entry.ipOrCidr}</code>
                      <Badge variant="secondary" className="text-xs">
                        {entry.ipOrCidr.includes('/') ? 'CIDR' : 'Single IP'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Added by {entry.addedBy} on {new Date(entry.addedOn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}

            {entries.length === 0 && (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">No IP Addresses</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add IP addresses to restrict API access
                </p>
                <Button variant="outline" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First IP
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Common IPs Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Best Practices
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-2" />
              Use CIDR notation for office networks (e.g., 192.168.1.0/24)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-2" />
              Add your VPN gateway IPs for remote access
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-2" />
              Regularly audit and remove unused entries
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-2" />
              Keep production and sandbox environments separate
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default IpAllowlistPanel;
