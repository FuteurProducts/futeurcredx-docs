/**
 * SLA & Support Panel
 * Uptime tracking, incident history, support tickets, escalation paths
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity, CheckCircle, AlertTriangle, XCircle, TrendingUp,
  MessageSquare, Phone, Mail, ExternalLink, Plus, ChevronRight, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockSlaMetrics, mockIncidents, mockSupportTickets } from '../mockData';

export const SlaPanel: React.FC = () => {
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-chart-2" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'partial_outage':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'major_outage':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'operational': return 'All Systems Operational';
      case 'degraded': return 'Degraded Performance';
      case 'partial_outage': return 'Partial Outage';
      case 'major_outage': return 'Major Outage';
      default: return 'Unknown';
    }
  };

  const getIncidentSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'major':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Major</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Minor</Badge>;
    }
  };

  const getTicketPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-warning/10 text-warning border-warning/20">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate uptime bar segments (last 90 days, simplified)
  const uptimeDays = Array.from({ length: 90 }, (_, i) => {
    // Simulate some minor incidents
    if (i === 20 || i === 45) return 'degraded';
    return 'operational';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">SLA & Support</h2>
          <p className="text-sm text-muted-foreground">
            Service level metrics, incidents, and support resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="https://status.lumiq.ai" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Status Page
            </a>
          </Button>
          <Button onClick={() => toast({ title: 'Create Support Ticket', description: 'For production support, email support@lumiq.ai or call the 24/7 hotline.' })}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <Card className={mockSlaMetrics.currentStatus === 'operational' ? 'border-chart-2/20' : 'border-yellow-500/20'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(mockSlaMetrics.currentStatus)}
              <div>
                <h3 className="font-semibold text-lg">{getStatusLabel(mockSlaMetrics.currentStatus)}</h3>
                <p className="text-sm text-muted-foreground">
                  Last checked: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${
                mockSlaMetrics.uptimePercentage >= mockSlaMetrics.targetUptime ? 'text-chart-2' : 'text-warning'
              }`}>
                {mockSlaMetrics.uptimePercentage}%
              </p>
              <p className="text-sm text-muted-foreground">
                Uptime (Target: {mockSlaMetrics.targetUptime}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uptime Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Uptime History</CardTitle>
              <CardDescription>Last 90 days</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-2 rounded" />
                <span className="text-muted-foreground">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded" />
                <span className="text-muted-foreground">Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded" />
                <span className="text-muted-foreground">Outage</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-0.5">
            {uptimeDays.map((status, i) => (
              <div
                key={i}
                className={`flex-1 h-8 rounded-lg ${
                  status === 'operational' ? 'bg-chart-2' :
                  status === 'degraded' ? 'bg-warning' :
                  'bg-destructive'
                }`}
                title={`Day ${90 - i}: ${status}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* SLA Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTTR</p>
                <p className="text-2xl font-bold">{mockSlaMetrics.mttr} min</p>
                <p className="text-xs text-muted-foreground">Mean Time to Recovery</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTBF</p>
                <p className="text-2xl font-bold">{mockSlaMetrics.mtbf} hrs</p>
                <p className="text-xs text-muted-foreground">Mean Time Between Failures</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-2 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incidents (30d)</p>
                <p className="text-2xl font-bold">{mockIncidents.length}</p>
                <p className="text-xs text-muted-foreground">All resolved</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">37 min</p>
                <p className="text-xs text-muted-foreground">Support tickets</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Incident History</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="escalation">Escalation Paths</TabsTrigger>
        </TabsList>

        {/* Incidents Tab */}
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockIncidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{incident.title}</span>
                        {getIncidentSeverityBadge(incident.severity)}
                        <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                          Resolved
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Affected: {incident.affectedServices.join(', ')}
                        </span>
                        <span className="text-muted-foreground">
                          Duration: {incident.duration} minutes
                        </span>
                      </div>
                      {incident.rootCause && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Root Cause: </span>
                          {incident.rootCause}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{new Date(incident.startedAt).toLocaleDateString()}</p>
                      <p>{new Date(incident.startedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  {incident.postmortemUrl && (
                    <Button variant="link" className="p-0 h-auto text-sm mt-2" asChild>
                      <a href={incident.postmortemUrl} target="_blank" rel="noopener noreferrer">
                        View Postmortem <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Support Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSupportTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ticket.subject}</span>
                        {getTicketPriorityBadge(ticket.priority)}
                        {getTicketStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.category} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escalation Tab */}
        <TabsContent value="escalation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Support Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { tier: 'Tier 1', name: 'Technical Support', sla: '< 1 hour response', channel: 'Email / Chat' },
                  { tier: 'Tier 2', name: 'Engineering Escalation', sla: '< 4 hours response', channel: 'Email / Phone' },
                  { tier: 'Tier 3', name: 'Critical Incident', sla: '< 30 min response', channel: '24/7 Hotline' },
                ].map((tier) => (
                  <div key={tier.tier} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{tier.tier}: {tier.name}</span>
                      <Badge variant="outline">{tier.sla}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.channel}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium">Email Support</span>
                  </div>
                  <a href="mailto:support@lumiq.ai" className="text-sm text-primary hover:underline">
                    support@lumiq.ai
                  </a>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium">24/7 Critical Support</span>
                  </div>
                  <a href="tel:+18001234567" className="text-sm text-primary hover:underline">
                    +1 (800) 123-4567
                  </a>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="font-medium">Slack Channel</span>
                  </div>
                  <p className="text-sm text-muted-foreground">#lumiq-support (Enterprise only)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SlaPanel;
