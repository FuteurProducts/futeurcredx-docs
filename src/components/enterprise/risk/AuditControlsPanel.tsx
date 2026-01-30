import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Download, Key, FileText, Filter } from 'lucide-react';

export interface AccessEvent {
  id: string;
  userId: string;
  userName: string;
  action: 'view' | 'export' | 'modify' | 'delete';
  resource: string;
  resourceType: 'portfolio' | 'entity' | 'report' | 'settings';
  timestamp: Date;
  ipAddress: string;
  sensitivityLevel: 'high' | 'medium' | 'low';
}

export interface PermissionChange {
  id: string;
  userId: string;
  userName: string;
  changedBy: string;
  changeType: 'grant' | 'revoke' | 'modify';
  permission: string;
  timestamp: Date;
}

export interface AuditControlsPanelProps {
  accessEvents: AccessEvent[];
  permissionChanges: PermissionChange[];
  mfaEnforced: boolean;
  ssoEnabled: boolean;
  totalExports24h: number;
  sensitiveAccessCount: number;
  className?: string;
}

const getActionStyle = (action: string) => {
  switch (action) {
    case 'view': return { bg: 'bg-blue-50', text: 'text-blue-700', icon: Eye };
    case 'export': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: Download };
    case 'modify': return { bg: 'bg-violet-50', text: 'text-violet-700', icon: FileText };
    case 'delete': return { bg: 'bg-rose-50', text: 'text-rose-700', icon: FileText };
    default: return { bg: 'bg-muted', text: 'text-foreground', icon: Eye };
  }
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

export const AuditControlsPanel: React.FC<AuditControlsPanelProps> = ({
  accessEvents,
  permissionChanges,
  mfaEnforced,
  ssoEnabled,
  totalExports24h,
  sensitiveAccessCount,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'access' | 'permissions'>('access');
  const [filterSensitivity, setFilterSensitivity] = useState<'all' | 'high' | 'medium'>('all');

  const filteredEvents = accessEvents.filter(e => 
    filterSensitivity === 'all' || e.sensitivityLevel === filterSensitivity
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-500/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Audit & Access Controls</h3>
            <p className="text-sm text-muted-foreground">FFIEC-compliant access monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Security Status */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${mfaEnforced ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              <Key className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">MFA {mfaEnforced ? 'ON' : 'OFF'}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${ssoEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
              <span className="text-xs font-medium">SSO {ssoEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-border lg:grid-cols-2">
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{accessEvents.length}</div>
          <div className="text-xs text-muted-foreground">Access Events (24h)</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{totalExports24h}</div>
          <div className="text-xs text-muted-foreground">Exports (24h)</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-700">{sensitiveAccessCount}</div>
          <div className="text-xs text-amber-600">Sensitive Data Access</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{permissionChanges.length}</div>
          <div className="text-xs text-muted-foreground">Permission Changes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'access' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-4 h-4" />
          Access Events
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'permissions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Key className="w-4 h-4" />
          Permission Changes
        </button>
        
        {activeTab === 'access' && (
          <div className="ml-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterSensitivity}
              onChange={(e) => setFilterSensitivity(e.target.value as typeof filterSensitivity)}
              className="h-8 px-2 bg-muted border-0 rounded-lg text-sm"
            >
              <option value="all">All Sensitivity</option>
              <option value="high">High Only</option>
              <option value="medium">Medium+</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {activeTab === 'access' ? (
          <div className="space-y-2">
            {filteredEvents.slice(0, 20).map((event) => {
              const style = getActionStyle(event.action);
              const ActionIcon = style.icon;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                    <ActionIcon className={`w-4 h-4 ${style.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{event.userName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
                        {event.action.toUpperCase()}
                      </span>
                      {event.sensitivityLevel === 'high' && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-xs font-medium">
                          SENSITIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {event.resourceType}: {event.resource}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{formatTime(event.timestamp)}</div>
                    <div className="font-mono">{event.ipAddress}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {permissionChanges.slice(0, 20).map((change) => (
              <div
                key={change.id}
                className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  change.changeType === 'grant' ? 'bg-emerald-50' :
                  change.changeType === 'revoke' ? 'bg-rose-50' : 'bg-blue-50'
                }`}>
                  <Key className={`w-4 h-4 ${
                    change.changeType === 'grant' ? 'text-emerald-600' :
                    change.changeType === 'revoke' ? 'text-rose-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{change.userName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      change.changeType === 'grant' ? 'bg-emerald-100 text-emerald-700' :
                      change.changeType === 'revoke' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {change.changeType.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {change.permission} • by {change.changedBy}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(change.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuditControlsPanel;
