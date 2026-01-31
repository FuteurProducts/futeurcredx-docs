/**
 * Data Retention Policies Panel
 * Configure data lifecycle and automatic purging rules
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Trash2, AlertTriangle, Shield, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface RetentionPolicy {
  id: string;
  dataType: string;
  description: string;
  retentionDays: number;
  minDays: number;
  maxDays: number;
  enabled: boolean;
  complianceRequired: boolean;
}

const mockPolicies: RetentionPolicy[] = [
  { id: 'audit-logs', dataType: 'Audit Logs', description: 'User activity and system events', retentionDays: 2555, minDays: 365, maxDays: 2555, enabled: true, complianceRequired: true },
  { id: 'api-logs', dataType: 'API Request Logs', description: 'API call history and performance data', retentionDays: 90, minDays: 30, maxDays: 365, enabled: true, complianceRequired: false },
  { id: 'credit-scores', dataType: 'Credit Scores', description: 'Historical score snapshots', retentionDays: 1825, minDays: 365, maxDays: 2555, enabled: true, complianceRequired: true },
  { id: 'pii-data', dataType: 'PII Data', description: 'Personally identifiable information', retentionDays: 365, minDays: 90, maxDays: 730, enabled: true, complianceRequired: true },
  { id: 'session-data', dataType: 'Session Data', description: 'User session tokens and metadata', retentionDays: 30, minDays: 7, maxDays: 90, enabled: true, complianceRequired: false },
  { id: 'webhook-logs', dataType: 'Webhook Delivery Logs', description: 'Webhook request/response history', retentionDays: 30, minDays: 7, maxDays: 90, enabled: true, complianceRequired: false },
];

export const RetentionPanel: React.FC = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState(mockPolicies);
  const [autoDelete, setAutoDelete] = useState(true);

  const handleUpdatePolicy = (policyId: string, updates: Partial<RetentionPolicy>) => {
    setPolicies(policies.map(p => p.id === policyId ? { ...p, ...updates } : p));
  };

  const handleSave = () => {
    toast({ title: 'Retention Policies Saved', description: 'Changes will be applied during the next purge cycle' });
  };

  const formatDays = (days: number): string => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years} year${years > 1 ? 's' : ''}`;
    } else if (days >= 30) {
      return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''}`;
    }
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Data Retention Policies</h2>
          <p className="text-sm text-muted-foreground">
            Configure how long different types of data are retained
          </p>
        </div>
        <Button onClick={handleSave}>Save Policies</Button>
      </div>

      {/* Auto-Delete Toggle */}
      <Card className={autoDelete ? 'border-chart-2/30 bg-chart-2/5' : 'border-warning/30 bg-warning/5'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {autoDelete ? (
                <Trash2 className="h-8 w-8 text-chart-2" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-warning" />
              )}
              <div>
                <h3 className="font-medium">
                  {autoDelete ? 'Automatic Data Purging Enabled' : 'Manual Data Management'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {autoDelete 
                    ? 'Data exceeding retention periods will be automatically deleted'
                    : 'Warning: Data will accumulate without automatic cleanup'}
                </p>
              </div>
            </div>
            <Switch 
              checked={autoDelete} 
              onCheckedChange={setAutoDelete}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Regulatory Compliance</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Some retention periods are mandated by regulations (FCRA, GDPR, SOX). 
                Policies marked with a shield cannot be reduced below minimum requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Policies */}
      <div className="space-y-4">
        {policies.map((policy) => (
          <motion.div key={policy.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={!policy.enabled ? 'opacity-60' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{policy.dataType}</h3>
                        {policy.complianceRequired && (
                          <Badge className="bg-warning/10 text-warning border-warning/20">
                            <Shield className="h-3 w-3 mr-1" />
                            Regulated
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={policy.enabled} 
                    onCheckedChange={(checked) => handleUpdatePolicy(policy.id, { enabled: checked })}
                    disabled={policy.complianceRequired}
                  />
                </div>

                {policy.enabled && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label>Retention Period</Label>
                      <Badge variant="outline" className="font-mono">
                        {formatDays(policy.retentionDays)}
                      </Badge>
                    </div>
                    <Slider
                      value={[policy.retentionDays]}
                      onValueChange={([value]) => handleUpdatePolicy(policy.id, { retentionDays: value })}
                      min={policy.minDays}
                      max={policy.maxDays}
                      step={policy.maxDays > 365 ? 30 : 7}
                      disabled={!policy.enabled}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatDays(policy.minDays)} (min)</span>
                      <span>{formatDays(policy.maxDays)} (max)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* GDPR Right to be Forgotten */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Right to be Forgotten (GDPR/CCPA)
          </CardTitle>
          <CardDescription>
            Process data deletion requests in compliance with privacy regulations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-xs text-muted-foreground">Avg. Processing Time</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Pending Requests</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-chart-2">147</div>
              <div className="text-xs text-muted-foreground">Processed (90d)</div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View Deletion Request Queue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetentionPanel;
