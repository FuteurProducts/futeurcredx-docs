/**
 * Notification Preferences Panel
 * Configure email, in-app, and webhook notification settings
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Mail, Smartphone, Webhook,
  AlertTriangle, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  description: string;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  email: boolean;
  inApp: boolean;
  webhook: boolean;
  sms: boolean;
  critical: boolean;
}

const mockChannels: NotificationChannel[] = [
  { id: 'email', name: 'Email', icon: Mail, enabled: true, description: 'Receive notifications via email' },
  { id: 'in-app', name: 'In-App', icon: Bell, enabled: true, description: 'See notifications in the dashboard' },
  { id: 'sms', name: 'SMS', icon: Smartphone, enabled: false, description: 'Text message alerts for critical events' },
  { id: 'webhook', name: 'Webhook', icon: Webhook, enabled: true, description: 'Push notifications to your endpoints' },
];

const mockCategories: NotificationCategory[] = [
  { id: 'score-changes', name: 'Score Changes', description: 'When a credit score is updated', email: true, inApp: true, webhook: true, sms: false, critical: false },
  { id: 'ews-alerts', name: 'Early Warning Alerts', description: 'Risk deterioration signals', email: true, inApp: true, webhook: true, sms: true, critical: true },
  { id: 'application-status', name: 'Application Updates', description: 'Application status changes', email: true, inApp: true, webhook: true, sms: false, critical: false },
  { id: 'api-usage', name: 'API Usage Alerts', description: 'Rate limits and quota warnings', email: true, inApp: true, webhook: false, sms: false, critical: false },
  { id: 'security', name: 'Security Events', description: 'Login attempts and access changes', email: true, inApp: true, webhook: true, sms: true, critical: true },
  { id: 'system', name: 'System Maintenance', description: 'Scheduled maintenance and updates', email: true, inApp: true, webhook: false, sms: false, critical: false },
  { id: 'reports', name: 'Report Ready', description: 'When scheduled reports are generated', email: true, inApp: true, webhook: true, sms: false, critical: false },
];

export const NotificationsPanel: React.FC = () => {
  const { toast } = useToast();
  const [channels, setChannels] = useState(mockChannels);
  const [categories, setCategories] = useState(mockCategories);
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleChannelToggle = (channelId: string, enabled: boolean) => {
    setChannels(channels.map(c => c.id === channelId ? { ...c, enabled } : c));
  };

  const handleCategoryToggle = (categoryId: string, channel: 'email' | 'inApp' | 'webhook' | 'sms', value: boolean) => {
    setCategories(categories.map(c => c.id === categoryId ? { ...c, [channel]: value } : c));
  };

  const handleSave = () => {
    toast({ title: 'Preferences Saved', description: 'Your notification settings have been updated' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Configure how and when you receive notifications
          </p>
        </div>
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>

      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
          <CardDescription>Enable or disable notification delivery methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div 
                  key={channel.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    channel.enabled ? 'border-primary/30 bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      channel.enabled ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${channel.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{channel.name}</h4>
                      <p className="text-xs text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={channel.enabled}
                    onCheckedChange={(checked) => handleChannelToggle(channel.id, checked)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email Digest */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Email Digest</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a summary instead of individual emails
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(['daily', 'weekly'] as const).map((freq) => (
                  <Button
                    key={freq}
                    variant={digestFrequency === freq ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDigestFrequency(freq)}
                    disabled={!digestEnabled}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Button>
                ))}
              </div>
              <Switch 
                checked={digestEnabled}
                onCheckedChange={setDigestEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Categories</CardTitle>
          <CardDescription>Choose which events trigger notifications on each channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Header Row */}
            <div className="grid grid-cols-[1fr,80px,80px,80px,80px] gap-4 p-3 text-xs font-medium text-muted-foreground border-b">
              <div>Event Type</div>
              <div className="text-center">Email</div>
              <div className="text-center">In-App</div>
              <div className="text-center">SMS</div>
              <div className="text-center">Webhook</div>
            </div>
            
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-[1fr,80px,80px,80px,80px] gap-4 p-3 items-center hover:bg-muted/50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.name}</span>
                    {category.critical && (
                      <Badge className="bg-destructive/10 text-destructive text-xs">Critical</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={category.email}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, 'email', checked)}
                    disabled={!channels.find(c => c.id === 'email')?.enabled}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={category.inApp}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, 'inApp', checked)}
                    disabled={!channels.find(c => c.id === 'in-app')?.enabled}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={category.sms}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, 'sms', checked)}
                    disabled={!channels.find(c => c.id === 'sms')?.enabled}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={category.webhook}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, 'webhook', checked)}
                    disabled={!channels.find(c => c.id === 'webhook')?.enabled}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts Notice */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-medium">Critical Alerts</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Critical notifications (Early Warning Alerts, Security Events) cannot be fully disabled. 
                At minimum, one channel must remain active for regulatory compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPanel;
