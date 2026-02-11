/**
 * Webhook Security Panel
 * Signature verification, retry policies, and event filtering
 */

import React, { useState } from 'react';
import { 
  Lock, RefreshCw, Shield, Copy, 
  CheckCircle, Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface WebhookSecurityConfig {
  signatureAlgorithm: 'hmac-sha256' | 'hmac-sha512';
  timestampValidation: boolean;
  timestampToleranceSeconds: number;
  retryEnabled: boolean;
  maxRetries: number;
  retryBackoffMultiplier: number;
  initialDelayMs: number;
  maxDelayMs: number;
  eventFiltering: boolean;
  allowedEvents: string[];
}

const mockConfig: WebhookSecurityConfig = {
  signatureAlgorithm: 'hmac-sha256',
  timestampValidation: true,
  timestampToleranceSeconds: 300,
  retryEnabled: true,
  maxRetries: 5,
  retryBackoffMultiplier: 2,
  initialDelayMs: 1000,
  maxDelayMs: 60000,
  eventFiltering: true,
  allowedEvents: ['score.created', 'score.updated', 'application.submitted', 'application.approved'],
};

const allEvents = [
  { id: 'score.created', label: 'Score Created', category: 'Scores' },
  { id: 'score.updated', label: 'Score Updated', category: 'Scores' },
  { id: 'application.submitted', label: 'Application Submitted', category: 'Applications' },
  { id: 'application.approved', label: 'Application Approved', category: 'Applications' },
  { id: 'application.declined', label: 'Application Declined', category: 'Applications' },
  { id: 'offer.generated', label: 'Offer Generated', category: 'Offers' },
  { id: 'offer.accepted', label: 'Offer Accepted', category: 'Offers' },
  { id: 'customer.created', label: 'Customer Created', category: 'Customers' },
  { id: 'customer.updated', label: 'Customer Updated', category: 'Customers' },
  { id: 'ews.alert', label: 'Early Warning Alert', category: 'Risk' },
];

export const WebhookSecurityPanel: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState(mockConfig);

  const handleSave = () => {
    toast({ title: 'Settings Saved', description: 'Webhook security configuration updated' });
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
          <h2 className="text-xl font-semibold text-foreground">Webhook Security</h2>
          <p className="text-sm text-muted-foreground">
            Configure signature verification, retry policies, and event filtering
          </p>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      {/* Signature Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Signature Verification
          </CardTitle>
          <CardDescription>
            All webhook payloads are signed for security verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="space-y-3">
            <Label>Signature Algorithm</Label>
            <div className="grid grid-cols-2 gap-3">
              {(['hmac-sha256', 'hmac-sha512'] as const).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setConfig({ ...config, signatureAlgorithm: algo })}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    config.signatureAlgorithm === algo
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 transition-colors duration-200'
                  }`}
                >
                  <span className="font-mono text-sm font-medium uppercase">{algo}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {algo === 'hmac-sha256' ? 'Standard security (recommended)' : 'Enhanced security'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Timestamp Validation */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label>Timestamp Validation</Label>
                <p className="text-xs text-muted-foreground">Reject requests with old timestamps (replay attack prevention)</p>
              </div>
              <Switch 
                checked={config.timestampValidation} 
                onCheckedChange={(checked) => setConfig({ ...config, timestampValidation: checked })}
              />
            </div>

            {config.timestampValidation && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label>Tolerance Window: {config.timestampToleranceSeconds} seconds</Label>
                <Slider
                  value={[config.timestampToleranceSeconds]}
                  onValueChange={([value]) => setConfig({ ...config, timestampToleranceSeconds: value })}
                  min={60}
                  max={600}
                  step={30}
                />
                <p className="text-xs text-muted-foreground">
                  Requests older than {config.timestampToleranceSeconds} seconds will be rejected
                </p>
              </div>
            )}
          </div>

          {/* Verification Code Example */}
          <div className="space-y-2 pt-4 border-t">
            <Label className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Verification Example (Node.js)
            </Label>
            <div className="relative">
              <pre className="p-4 bg-muted/50 rounded-xl overflow-x-auto text-xs font-mono">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, timestamp, secret) {
  const signedPayload = \`\${timestamp}.\${payload}\`;
  const expectedSig = crypto
    .createHmac('${config.signatureAlgorithm.split('-')[1]}', secret)
    .update(signedPayload)
    .digest('hex');
  
  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}`}
              </pre>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(`const crypto = require('crypto');\n\nfunction verifyWebhook...`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retry Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Retry Policy
          </CardTitle>
          <CardDescription>
            Configure automatic retries for failed webhook deliveries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <Label>Enable Automatic Retries</Label>
              <p className="text-xs text-muted-foreground">Retry failed deliveries with exponential backoff</p>
            </div>
            <Switch
              checked={config.retryEnabled}
              onCheckedChange={(checked) => setConfig({ ...config, retryEnabled: checked })}
            />
          </div>

          {config.retryEnabled && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Maximum Retries</Label>
                <Input 
                  type="number" 
                  value={config.maxRetries}
                  onChange={(e) => setConfig({ ...config, maxRetries: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
              <div className="space-y-2">
                <Label>Backoff Multiplier</Label>
                <Input 
                  type="number" 
                  value={config.retryBackoffMultiplier}
                  onChange={(e) => setConfig({ ...config, retryBackoffMultiplier: parseFloat(e.target.value) })}
                  min={1.5}
                  max={4}
                  step={0.5}
                />
              </div>
              <div className="space-y-2">
                <Label>Initial Delay (ms)</Label>
                <Input 
                  type="number" 
                  value={config.initialDelayMs}
                  onChange={(e) => setConfig({ ...config, initialDelayMs: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Delay (ms)</Label>
                <Input 
                  type="number" 
                  value={config.maxDelayMs}
                  onChange={(e) => setConfig({ ...config, maxDelayMs: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          {/* Retry Schedule Preview */}
          {config.retryEnabled && (
            <div className="p-4 bg-muted/50 rounded-xl">
              <Label className="mb-3 block">Retry Schedule Preview</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: config.maxRetries }, (_, i) => {
                  const delay = Math.min(
                    config.initialDelayMs * Math.pow(config.retryBackoffMultiplier, i),
                    config.maxDelayMs
                  );
                  return (
                    <div key={i} className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Retry {i + 1}: {delay >= 60000 ? `${Math.round(delay / 60000)}m` : `${Math.round(delay / 1000)}s`}
                      </Badge>
                      {i < config.maxRetries - 1 && <span className="text-muted-foreground">→</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Event Filtering
          </CardTitle>
          <CardDescription>
            Control which events can be subscribed to by partners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <Label>Restrict Available Events</Label>
              <p className="text-xs text-muted-foreground">Partners can only subscribe to selected events</p>
            </div>
            <Switch
              checked={config.eventFiltering}
              onCheckedChange={(checked) => setConfig({ ...config, eventFiltering: checked })}
            />
          </div>

          {config.eventFiltering && (
            <div className="grid grid-cols-2 gap-2">
              {allEvents.map((event) => {
                const isAllowed = config.allowedEvents.includes(event.id);
                return (
                  <label
                    key={event.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isAllowed ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted transition-colors duration-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAllowed}
                      onChange={(e) => {
                        const events = e.target.checked
                          ? [...config.allowedEvents, event.id]
                          : config.allowedEvents.filter(id => id !== event.id);
                        setConfig({ ...config, allowedEvents: events });
                      }}
                      className="rounded-md"
                    />
                    <div>
                      <span className="text-sm font-medium">{event.label}</span>
                      <span className="text-xs text-muted-foreground block">{event.category}</span>
                    </div>
                    {isAllowed && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                  </label>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSecurityPanel;
