/**
 * Partner Portal Enterprise - Main Component
 * Bank-grade API integration management hub
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key, BarChart3, Webhook, FlaskConical, Shield, Activity, Book,
  CheckCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { CredentialsPanel } from './panels/CredentialsPanel';
import { UsageAnalyticsPanel } from './panels/UsageAnalyticsPanel';
import { WebhooksPanel } from './panels/WebhooksPanel';
import { TestingPanel } from './panels/TestingPanel';
import { CompliancePanel } from './panels/CompliancePanel';
import { SlaPanel } from './panels/SlaPanel';
import { DocumentationPanel } from './panels/DocumentationPanel';

const tabs = [
  { id: 'credentials', label: 'Credentials', icon: Key },
  { id: 'usage', label: 'Usage Analytics', icon: BarChart3 },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'testing', label: 'Testing', icon: FlaskConical },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'sla', label: 'SLA & Support', icon: Activity },
  { id: 'docs', label: 'Documentation', icon: Book },
];

const PartnerPortalEnterprise: React.FC = () => {
  const [activeTab, setActiveTab] = useState('credentials');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Partner API Portal</h1>
          <p className="text-muted-foreground">
            Enterprise integration management for bank partners
          </p>
        </div>
        <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
          <CheckCircle className="h-4 w-4 mr-1" />
          API Status: Operational
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-2 data-[state=active]:bg-background"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="credentials" className="mt-0">
            <CredentialsPanel />
          </TabsContent>
          <TabsContent value="usage" className="mt-0">
            <UsageAnalyticsPanel />
          </TabsContent>
          <TabsContent value="webhooks" className="mt-0">
            <WebhooksPanel />
          </TabsContent>
          <TabsContent value="testing" className="mt-0">
            <TestingPanel />
          </TabsContent>
          <TabsContent value="compliance" className="mt-0">
            <CompliancePanel />
          </TabsContent>
          <TabsContent value="sla" className="mt-0">
            <SlaPanel />
          </TabsContent>
          <TabsContent value="docs" className="mt-0">
            <DocumentationPanel />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default PartnerPortalEnterprise;
