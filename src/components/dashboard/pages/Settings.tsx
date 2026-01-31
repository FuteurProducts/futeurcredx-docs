// Enterprise Settings Page - Bank-grade platform configuration
// Uses modular components from src/components/enterprise/settings/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import {
  SettingsGlobalControls,
  SettingsNavigation,
  UsersPanel,
  RolesPanel,
  ApiKeysPanel,
  DataSourcesPanel,
  AuditLogsPanel,
  AlertThresholdsPanel,
  BillingPanel,
  SSOPanel,
  OAuthPanel,
  IpAllowlistPanel,
  WebhookSecurityPanel,
  RetentionPanel,
  ConsentPanel,
  PIIMaskingPanel,
  ModelVersionsPanel,
  IntegrationsPanel,
  NotificationsPanel,
  mockUsers,
  mockRolePermissions,
  mockPermissions,
  mockApiKeys,
  mockDataSources,
  mockAuditLogs,
  mockAlertThresholds,
  mockBillingInfo,
  type Environment,
  type PlatformUser,
  type RolePermissions,
  type AlertThreshold,
} from '@/components/enterprise/settings';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { currentEnvironment, switchEnvironment } = useEnvironment();

  // Active section state
  const [activeSection, setActiveSection] = useState('users');

  // Managed state for settings that persist via localStorage
  const [users, setUsers] = useState<PlatformUser[]>(mockUsers);
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [dataSources, setDataSources] = useState(mockDataSources);
  const [thresholds, setThresholds] = useState(mockAlertThresholds);

  // Mock tenant info
  const tenantName = 'Partner Bank';
  const tenantId = 'BANK-001';
  const ssoEnabled = true;

  // User management handlers
  const handleAddUser = () => {
    toast({ title: "Invite sent", description: "User invitation has been sent via email." });
  };

  const handleEditUser = (user: PlatformUser) => {
    toast({ title: "User updated", description: `${user.name}'s profile has been saved.` });
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({ title: "User removed", description: "User access has been revoked." });
  };

  // Roles handlers
  const handleSaveRoles = (roles: RolePermissions[]) => {
    localStorage.setItem('lumiq_roles', JSON.stringify(roles));
    toast({ title: "Roles saved", description: `${roles.length} role configurations updated.` });
  };

  // API Key handlers
  const handleCreateApiKey = (name: string, scopes: string[], env: Environment) => {
    const newKey = {
      id: `key-${Date.now()}`,
      name,
      keyMasked: `sk_${env === 'production' ? 'live' : 'test'}_${'*'.repeat(28)}${Math.random().toString(36).slice(-4)}`,
      environment: env,
      scopes,
      createdAt: new Date().toISOString(),
      lastUsed: null as string | null,
      status: 'active' as const,
      createdBy: 'current.user@bank.com',
    };
    setApiKeys(prev => [newKey, ...prev]);
    toast({ title: "API key created", description: `${name} (${env}) is now active.` });
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: 'revoked' as const } : k));
    toast({ title: "Key revoked", description: "API key has been permanently revoked." });
  };

  const handleRotateApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, keyMasked: `sk_live_${'*'.repeat(28)}${Math.random().toString(36).slice(-4)}`, lastUsed: null } : k));
    toast({ title: "Key rotated", description: "New key generated. Previous key will expire in 24h." });
  };

  // Data source handlers
  const handleReauthDataSource = (sourceId: string) => {
    setDataSources(prev => prev.map(ds => ds.id === sourceId ? { ...ds, status: 'connected' as const, lastSync: new Date().toISOString(), errorRate: 0 } : ds));
    toast({ title: "Re-authenticated", description: "Data source connection restored." });
  };

  const handleSyncDataSource = (sourceId: string) => {
    const source = dataSources.find(ds => ds.id === sourceId);
    setDataSources(prev => prev.map(ds => ds.id === sourceId ? { ...ds, lastSync: new Date().toISOString() } : ds));
    toast({ title: "Sync initiated", description: `${source?.name || 'Data source'} sync in progress.` });
  };

  // Alert threshold handlers
  const handleSaveThresholds = (newThresholds: AlertThreshold[]) => {
    setThresholds(newThresholds);
    localStorage.setItem('lumiq_alert_thresholds', JSON.stringify(newThresholds));
    toast({ title: "Thresholds saved", description: `${newThresholds.length} alert thresholds updated.` });
  };

  // Audit log handlers
  const handleExportAuditLogs = () => {
    const csv = mockAuditLogs.map(l => `${l.timestamp},${l.user},${l.action},${l.resource}`).join('\n');
    const blob = new Blob([`timestamp,user,action,resource\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Audit logs exported", description: "CSV file downloaded successfully." });
  };

  // Billing handlers
  const handleUpgrade = () => {
    toast({ title: "Contact sales", description: "A LUMIQ AI representative will reach out to discuss Enterprise tier options." });
  };

  // Render active panel based on section
  const renderActivePanel = () => {
    switch (activeSection) {
      // Access & Users
      case 'users':
        return (
          <UsersPanel
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onRemoveUser={handleRemoveUser}
          />
        );
      case 'roles':
        return (
          <RolesPanel
            roles={mockRolePermissions}
            permissions={mockPermissions}
            onSave={handleSaveRoles}
          />
        );
      case 'sso':
        return <SSOPanel />;
      
      // API & Security
      case 'api-keys':
        return (
          <ApiKeysPanel
            apiKeys={apiKeys}
            onCreateKey={handleCreateApiKey}
            onRevokeKey={handleRevokeApiKey}
            onRotateKey={handleRotateApiKey}
          />
        );
      case 'oauth':
        return <OAuthPanel />;
      case 'ip-allowlist':
        return <IpAllowlistPanel />;
      case 'webhook-security':
        return <WebhookSecurityPanel />;
      
      // Data & Privacy
      case 'data-sources':
        return (
          <DataSourcesPanel
            dataSources={dataSources}
            onReauth={handleReauthDataSource}
            onSync={handleSyncDataSource}
          />
        );
      case 'retention':
        return <RetentionPanel />;
      case 'consent':
        return <ConsentPanel />;
      case 'pii':
        return <PIIMaskingPanel />;
      
      // Risk & Models
      case 'models':
        return <ModelVersionsPanel />;
      case 'alerts':
      case 'alert-thresholds':
        return (
          <AlertThresholdsPanel
            thresholds={thresholds}
            onSave={handleSaveThresholds}
          />
        );
      
      // Integrations
      case 'integrations':
        return <IntegrationsPanel />;
      
      // Notifications
      case 'notifications':
        return <NotificationsPanel />;
      
      // Billing
      case 'billing':
        return (
          <BillingPanel
            billing={mockBillingInfo}
            onUpgrade={handleUpgrade}
          />
        );
      
      // Audit
      case 'audit-logs':
        return (
          <AuditLogsPanel
            logs={mockAuditLogs}
            onExport={handleExportAuditLogs}
          />
        );
      
      default:
        return (
          <UsersPanel
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onRemoveUser={handleRemoveUser}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Sticky Global Controls */}
      <SettingsGlobalControls
        environment={currentEnvironment}
        onEnvironmentChange={(env) => switchEnvironment(env)}
        tenantName={tenantName}
        tenantId={tenantId}
        ssoEnabled={ssoEnabled}
      />

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Navigation */}
        <div className="w-64 flex-shrink-0 p-4 overflow-y-auto">
          <SettingsNavigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderActivePanel()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
