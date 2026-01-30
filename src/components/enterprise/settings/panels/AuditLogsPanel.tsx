// Audit Logs Panel - Access, change, and export logs

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter } from 'lucide-react';
import type { AuditLogEntry } from '../types';

interface AuditLogsPanelProps {
  logs: AuditLogEntry[];
  onExport: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

const actionColors: Record<string, string> = {
  'user.created': 'bg-green-100 text-green-700',
  'user.deleted': 'bg-red-100 text-red-700',
  'api_key.created': 'bg-blue-100 text-blue-700',
  'api_key.revoked': 'bg-amber-100 text-amber-700',
  'settings.updated': 'bg-purple-100 text-purple-700',
  'report.exported': 'bg-cyan-100 text-cyan-700',
  'customer.viewed': 'bg-muted text-muted-foreground',
  'role.updated': 'bg-indigo-100 text-indigo-700',
};

export const AuditLogsPanel: React.FC<AuditLogsPanelProps> = ({
  logs,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState<'access' | 'changes' | 'exports'>('access');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'access', label: 'Access Logs' },
    { id: 'changes', label: 'Change Logs' },
    { id: 'exports', label: 'Export Logs' },
  ] as const;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'exports') {
      return matchesSearch && log.action.includes('export');
    } else if (activeTab === 'changes') {
      return matchesSearch && (log.action.includes('created') || log.action.includes('updated') || log.action.includes('deleted'));
    }
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Audit Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete audit trail of platform activity
          </p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Resource</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{log.user}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    actionColors[log.action] || 'bg-muted text-muted-foreground'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{log.resource}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{log.ip}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No logs found
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuditLogsPanel;
