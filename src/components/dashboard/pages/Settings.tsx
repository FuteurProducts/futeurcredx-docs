// Enterprise Settings Page - Bank-grade platform configuration
// Uses modular components from src/components/enterprise/settings/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  // Active section state
  const [activeSection, setActiveSection] = useState('users');
  
  // Environment state
  const [environment, setEnvironment] = useState<Environment>('sandbox');
  
  // Mock tenant info
  const tenantName = 'Acme Bank';
  const tenantId = 'BANK-001';
  const ssoEnabled = true;

  // User management handlers
  const handleAddUser = () => {
    console.log('Add user clicked');
  };

  const handleEditUser = (user: PlatformUser) => {
    console.log('Edit user:', user.id);
  };

  const handleRemoveUser = (userId: string) => {
    console.log('Remove user:', userId);
  };

  // Roles handlers
  const handleSaveRoles = (roles: RolePermissions[]) => {
    console.log('Save roles:', roles);
  };

  // API Key handlers
  const handleCreateApiKey = (name: string, scopes: string[], env: Environment) => {
    console.log('Create API key:', name, scopes, env);
  };

  const handleRevokeApiKey = (keyId: string) => {
    console.log('Revoke API key:', keyId);
  };

  const handleRotateApiKey = (keyId: string) => {
    console.log('Rotate API key:', keyId);
  };

  // Data source handlers
  const handleReauthDataSource = (sourceId: string) => {
    console.log('Reauth data source:', sourceId);
  };

  const handleSyncDataSource = (sourceId: string) => {
    console.log('Sync data source:', sourceId);
  };

  // Alert threshold handlers
  const handleSaveThresholds = (thresholds: AlertThreshold[]) => {
    console.log('Save thresholds:', thresholds);
  };

  // Audit log handlers
  const handleExportAuditLogs = () => {
    console.log('Export audit logs');
  };

  // Billing handlers
  const handleUpgrade = () => {
    console.log('Upgrade subscription');
  };

  // Render active panel based on section
  const renderActivePanel = () => {
    switch (activeSection) {
      // Access & Users
      case 'users':
        return (
          <UsersPanel
            users={mockUsers}
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
            apiKeys={mockApiKeys}
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
            dataSources={mockDataSources}
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
            thresholds={mockAlertThresholds}
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
            users={mockUsers}
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
        environment={environment}
        onEnvironmentChange={setEnvironment}
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
