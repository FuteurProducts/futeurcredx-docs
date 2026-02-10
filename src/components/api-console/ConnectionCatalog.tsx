// Connection Catalog - Grid of connection cards with filters
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronRight,
  Shield,
  Zap,
  Database,
  Building2,
  CreditCard,
  FileText,
} from 'lucide-react';
import type { Connection, ConnectionType, ConnectionStatus } from './types';

interface ConnectionCatalogProps {
  connections: Connection[];
  onSelectConnection: (connection: Connection) => void;
  selectedConnectionId?: string;
}

const connectionTypeConfig: Record<ConnectionType, { label: string; icon: React.ElementType; color: string }> = {
  'open-banking': { label: 'Open Banking', icon: Building2, color: 'text-info bg-info/10' },
  'aggregator': { label: 'Aggregator', icon: Database, color: 'text-[var(--primary-04)] bg-[var(--primary-04)]/10' },
  'accounting': { label: 'Accounting', icon: FileText, color: 'text-success bg-success/10' },
  'bureau': { label: 'Credit Bureau', icon: CreditCard, color: 'text-warning bg-warning/10' },
  'internal': { label: 'Internal', icon: Zap, color: 'text-muted-foreground bg-muted' },
};

const statusConfig: Record<ConnectionStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  'connected': { label: 'Connected', color: 'text-success', bgColor: 'bg-success/10', icon: CheckCircle },
  'needs-reauth': { label: 'Needs Re-auth', color: 'text-warning', bgColor: 'bg-warning/10', icon: RefreshCw },
  'degraded': { label: 'Degraded', color: 'text-warning', bgColor: 'bg-warning/10', icon: AlertTriangle },
  'down': { label: 'Down', color: 'text-destructive', bgColor: 'bg-destructive/10', icon: XCircle },
  'pending': { label: 'Pending', color: 'text-muted-foreground', bgColor: 'bg-muted', icon: Clock },
};

export const ConnectionCatalog: React.FC<ConnectionCatalogProps> = ({
  connections,
  onSelectConnection,
  selectedConnectionId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ConnectionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ConnectionStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredConnections = useMemo(() => {
    return connections.filter(conn => {
      const matchesSearch = conn.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || conn.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || conn.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [connections, searchQuery, typeFilter, statusFilter]);

  const needsReauthQueue = connections.filter(c => c.status === 'needs-reauth');
  const degradedQueue = connections.filter(c => c.status === 'degraded' || c.status === 'down');

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>

          {/* Quick Counts */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {filteredConnections.length} connection{filteredConnections.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border flex flex-wrap gap-4">
                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setTypeFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        typeFilter === 'all' ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      All
                    </button>
                    {(Object.keys(connectionTypeConfig) as ConnectionType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          typeFilter === type ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {connectionTypeConfig[type].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === 'all' ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      All
                    </button>
                    {(Object.keys(statusConfig) as ConnectionStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          statusFilter === status ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {statusConfig[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alert Queues */}
      {(needsReauthQueue.length > 0 || degradedQueue.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {needsReauthQueue.length > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-warning">Needs Re-authentication</span>
                <span className="ml-auto px-2 py-0.5 bg-warning/20 text-warning rounded-full text-xs font-semibold">
                  {needsReauthQueue.length}
                </span>
              </div>
              <div className="space-y-2">
                {needsReauthQueue.slice(0, 3).map(conn => (
                  <button
                    key={conn.id}
                    onClick={() => onSelectConnection(conn)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-card rounded-lg hover:bg-warning/10 transition-colors text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{conn.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {degradedQueue.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Degraded / Down</span>
                <span className="ml-auto px-2 py-0.5 bg-destructive/20 text-destructive rounded-full text-xs font-semibold">
                  {degradedQueue.length}
                </span>
              </div>
              <div className="space-y-2">
                {degradedQueue.slice(0, 3).map(conn => (
                  <button
                    key={conn.id}
                    onClick={() => onSelectConnection(conn)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-card rounded-lg hover:bg-destructive/10 transition-colors text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{conn.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnections.map((connection, index) => {
          const typeInfo = connectionTypeConfig[connection.type];
          const statusInfo = statusConfig[connection.status];
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <motion.button
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectConnection(connection)}
              className={`bg-card rounded-2xl border p-5 text-left transition-all hover:shadow-lg hover:border-primary/30 ${
                selectedConnectionId === connection.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeInfo.color}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{connection.name}</h3>
                    <span className="text-xs text-muted-foreground">{typeInfo.label}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
                  <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                  <span className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <span className="text-xs text-muted-foreground block">Freshness</span>
                  <span className="text-sm font-semibold text-foreground">{connection.dataFreshness}</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <span className="text-xs text-muted-foreground block">Error Rate</span>
                  <span className={`text-sm font-semibold ${connection.errorRate24h > 1 ? 'text-destructive' : 'text-success'}`}>
                    {connection.errorRate24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">{connection.authMethod}</span>
                </div>
                <div className="flex items-center gap-1">
                  {connection.scopesGranted.slice(0, 2).map((scope, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-muted text-xs rounded">
                      {scope.split(':')[0]}
                    </span>
                  ))}
                  {connection.scopesGranted.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{connection.scopesGranted.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Coverage Bar */}
              {connection.coveragePercent !== undefined && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Coverage</span>
                    <span className="text-xs font-semibold">{connection.coveragePercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${connection.coveragePercent}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {filteredConnections.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No connections found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionCatalog;
