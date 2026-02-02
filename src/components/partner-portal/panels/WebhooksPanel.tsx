/**
 * Webhooks Management Panel
 * Event subscriptions, delivery logs, retry policies, signature verification
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Webhook, Plus, Trash2, Pause, Play, RefreshCw, Copy, Eye, EyeOff,
  CheckCircle, XCircle, Clock, Send, Code, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { WebhookEndpoint, WebhookDelivery, WebhookEventType } from '../types';
import { mockWebhookEndpoints, mockWebhookDeliveries } from '../mockData';

const AVAILABLE_EVENTS: { id: WebhookEventType; label: string; category: string }[] = [
  { id: 'score.created', label: 'Score Created', category: 'Credit Scores' },
  { id: 'score.updated', label: 'Score Updated', category: 'Credit Scores' },
  { id: 'offer.generated', label: 'Offer Generated', category: 'Offers' },
  { id: 'offer.accepted', label: 'Offer Accepted', category: 'Offers' },
  { id: 'offer.expired', label: 'Offer Expired', category: 'Offers' },
  { id: 'application.submitted', label: 'Application Submitted', category: 'Applications' },
  { id: 'application.approved', label: 'Application Approved', category: 'Applications' },
  { id: 'application.declined', label: 'Application Declined', category: 'Applications' },
  { id: 'customer.created', label: 'Customer Created', category: 'Customers' },
  { id: 'customer.updated', label: 'Customer Updated', category: 'Customers' },
  { id: 'ews.alert', label: 'Early Warning Alert', category: 'Risk' },
  { id: 'report.completed', label: 'Report Completed', category: 'Reports' },
];

export const WebhooksPanel: React.FC = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhookEndpoints);
  const [deliveries] = useState(mockWebhookDeliveries);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  
  // Create form state
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>([]);
  const [maxRetries, setMaxRetries] = useState(5);
  const [ipFilter, setIpFilter] = useState('');

  const handleCreate = () => {
    if (!newUrl.trim()) {
      toast({ title: 'Error', description: 'Please enter a webhook URL', variant: 'destructive' });
      return;
    }
    if (selectedEvents.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one event', variant: 'destructive' });
      return;
    }

    const secret = 'whsec_' + Math.random().toString(36).substring(2, 15);
    
    const newWebhook: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: newUrl,
      events: selectedEvents,
      status: 'active',
      secret: secret,
      secretMasked: 'whsec_****' + secret.slice(-4),
      retryPolicy: {
        maxRetries,
        backoffMultiplier: 2,
        initialDelayMs: 1000,
        maxDelayMs: 60000,
      },
      createdAt: new Date().toISOString(),
      lastDeliveryAt: null,
      successRate: 100,
      failureCount: 0,
      consecutiveFailures: 0,
      ipFilter: ipFilter ? ipFilter.split(',').map(ip => ip.trim()) : undefined,
    };

    setWebhooks([newWebhook, ...webhooks]);
    resetForm();
    toast({ title: 'Webhook Created', description: 'Your webhook endpoint is now active' });
  };

  const resetForm = () => {
    setNewUrl('');
    setSelectedEvents([]);
    setMaxRetries(5);
    setIpFilter('');
    setShowCreateModal(false);
  };

  const handleToggleStatus = (webhookId: string) => {
    setWebhooks(webhooks.map(wh => {
      if (wh.id === webhookId) {
        const newStatus = wh.status === 'active' ? 'paused' : 'active';
        toast({
          title: newStatus === 'active' ? 'Webhook Activated' : 'Webhook Paused',
          description: `Webhook ${newStatus === 'active' ? 'will now receive' : 'will no longer receive'} events`,
        });
        return { ...wh, status: newStatus as typeof wh.status };
      }
      return wh;
    }));
  };

  const handleDelete = (webhookId: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== webhookId));
    toast({ title: 'Webhook Deleted', description: 'The webhook endpoint has been removed' });
  };

  const [expandedDeliveryId, setExpandedDeliveryId] = useState<string | null>(null);

  const handleTestWebhook = (webhook: WebhookEndpoint) => {
    toast({
      title: 'Test Event Sent',
      description: `Simulated in sandbox mode -- no HTTP request was made to ${webhook.url}`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Copied to clipboard' });
  };

  const toggleSecretReveal = (webhookId: string) => {
    const newRevealed = new Set(revealedSecrets);
    if (newRevealed.has(webhookId)) {
      newRevealed.delete(webhookId);
    } else {
      newRevealed.add(webhookId);
    }
    setRevealedSecrets(newRevealed);
  };

  const getStatusBadge = (status: WebhookEndpoint['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Paused</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'disabled':
        return <Badge variant="secondary">Disabled</Badge>;
    }
  };

  const getDeliveryStatusIcon = (status: WebhookDelivery['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-chart-2" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'retrying':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Webhooks</h2>
          <p className="text-sm text-muted-foreground">
            Configure event notifications and monitor delivery status
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      {/* Create Webhook Form */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Add Webhook Endpoint</CardTitle>
                <CardDescription>Subscribe to events and receive real-time notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* URL */}
                <div className="space-y-2">
                  <Label>Endpoint URL</Label>
                  <Input
                    placeholder="https://your-server.com/webhooks/lumiq"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be HTTPS. We'll send POST requests with JSON payloads.
                  </p>
                </div>

                {/* Events */}
                <div className="space-y-2">
                  <Label>Events to Subscribe</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-muted/50 rounded-lg max-h-64 overflow-y-auto">
                    {AVAILABLE_EVENTS.map((event) => (
                      <label key={event.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvents([...selectedEvents, event.id]);
                            } else {
                              setSelectedEvents(selectedEvents.filter(ev => ev !== event.id));
                            }
                          }}
                          className="rounded border-input"
                        />
                        <div>
                          <span className="text-sm">{event.label}</span>
                          <span className="text-xs text-muted-foreground block">{event.category}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Retry Policy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Retries</Label>
                    <div className="flex gap-2">
                      {[3, 5, 10].map((num) => (
                        <Button
                          key={num}
                          variant={maxRetries === num ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMaxRetries(num)}
                        >
                          {num} retries
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Exponential backoff: 1s, 2s, 4s, 8s, ...
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>IP Filter (optional)</Label>
                    <Input
                      placeholder="e.g., 203.0.113.0/24"
                      value={ipFilter}
                      onChange={(e) => setIpFilter(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Only accept requests from these IPs
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button onClick={handleCreate}>Create Webhook</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints ({webhooks.length})</TabsTrigger>
          <TabsTrigger value="deliveries">Recent Deliveries</TabsTrigger>
          <TabsTrigger value="verify">Signature Verification</TabsTrigger>
        </TabsList>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-3">
          {webhooks.map((webhook) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-background"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    webhook.status === 'active' ? 'bg-chart-2/10 text-chart-2' :
                    webhook.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    <Webhook className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono">{webhook.url}</code>
                      {getStatusBadge(webhook.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created {new Date(webhook.createdAt).toLocaleDateString()}</span>
                      {webhook.lastDeliveryAt && (
                        <span>Last delivery {new Date(webhook.lastDeliveryAt).toLocaleString()}</span>
                      )}
                      <span className={webhook.successRate >= 99 ? 'text-chart-2' : 'text-yellow-500'}>
                        {webhook.successRate}% success rate
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Secret:</span>
                      <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {revealedSecrets.has(webhook.id) ? webhook.secret : webhook.secretMasked}
                      </code>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(webhook.secret)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleSecretReveal(webhook.id)}>
                        {revealedSecrets.has(webhook.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {webhook.events.slice(0, 3).map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">{event}</Badge>
                      ))}
                      {webhook.events.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{webhook.events.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleTestWebhook(webhook)}>
                    <Send className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleStatus(webhook.id)}
                  >
                    {webhook.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(webhook.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Deliveries Tab */}
        <TabsContent value="deliveries">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="rounded-lg bg-muted/50 overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getDeliveryStatusIcon(delivery.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{delivery.eventType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(delivery.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {delivery.status === 'delivered' ? (
                              <span className="text-chart-2">
                                Delivered in {delivery.latencyMs}ms (HTTP {delivery.responseCode})
                              </span>
                            ) : delivery.status === 'failed' ? (
                              <span className="text-destructive">
                                Failed after {delivery.attempts} attempts (HTTP {delivery.responseCode})
                              </span>
                            ) : delivery.status === 'retrying' ? (
                              <span className="text-yellow-500">
                                Retrying... Attempt {delivery.attempts}/{5}
                              </span>
                            ) : (
                              <span>Pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedDeliveryId(
                          expandedDeliveryId === delivery.id ? null : delivery.id
                        )}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        {expandedDeliveryId === delivery.id ? 'Hide Payload' : 'View Payload'}
                      </Button>
                    </div>
                    {expandedDeliveryId === delivery.id && (
                      <div className="px-4 pb-4">
                        <pre className="p-3 bg-background rounded-lg text-xs font-mono overflow-x-auto border">
                          {JSON.stringify(delivery.payload, null, 2)}
                        </pre>
                        {delivery.responseBody && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground font-medium">Response:</span>
                            <pre className="mt-1 p-3 bg-background rounded-lg text-xs font-mono overflow-x-auto border">
                              {delivery.responseBody}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signature Verification Tab */}
        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Webhook Signature Verification
              </CardTitle>
              <CardDescription>
                All webhook payloads are signed with HMAC-SHA256 for security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <h4 className="font-medium">Verification Steps</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Extract the <code className="bg-background px-1 py-0.5 rounded">X-Lumiq-Signature</code> header</li>
                  <li>Compute HMAC-SHA256 of the raw request body using your webhook secret</li>
                  <li>Compare the computed signature with the header value</li>
                  <li>Reject if signatures don't match or timestamp is &gt; 5 minutes old</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <Label>Example Code (Node.js)</Label>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhooksPanel;
