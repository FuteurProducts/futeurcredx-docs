import React from 'react';
import { motion } from 'framer-motion';
import { Database, AlertCircle, CheckCircle2, FileSearch, Link } from 'lucide-react';

export interface DataSource {
  id: string;
  name: string;
  type: 'bureau' | 'bank' | 'accounting' | 'api' | 'internal';
  coverage: number;
  freshness: string;
  medianAge: string;
  recordCount: number;
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  errorRate: number;
}

export interface MissingField {
  field: string;
  missingPct: number;
  impactLevel: 'high' | 'medium' | 'low';
  affectedModels: string[];
}

export interface DataLineagePanelProps {
  sources: DataSource[];
  missingFields: MissingField[];
  overallCoverage: number;
  overallFreshness: string;
  reconciliationStatus: 'ok' | 'warning' | 'error';
  lastReconciliation: string;
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
};

const getSourceTypeIcon = (type: string) => {
  switch (type) {
    case 'bureau': return '📊';
    case 'bank': return '🏦';
    case 'accounting': return '📑';
    case 'api': return '🔌';
    default: return '📁';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return { bg: 'bg-emerald-500', text: 'text-emerald-700', bgLight: 'bg-emerald-50' };
    case 'degraded': return { bg: 'bg-amber-500', text: 'text-amber-700', bgLight: 'bg-amber-50' };
    case 'disconnected': return { bg: 'bg-rose-500', text: 'text-rose-700', bgLight: 'bg-rose-50' };
    default: return { bg: 'bg-muted-foreground', text: 'text-muted-foreground', bgLight: 'bg-muted' };
  }
};

export const DataLineagePanel: React.FC<DataLineagePanelProps> = ({
  sources,
  missingFields,
  overallCoverage,
  overallFreshness,
  reconciliationStatus,
  lastReconciliation,
  className = '',
}) => {
  const connectedCount = sources.filter(s => s.status === 'connected').length;
  const degradedCount = sources.filter(s => s.status === 'degraded').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Lineage & Quality</h3>
            <p className="text-sm text-muted-foreground">Source coverage, freshness, and provenance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Overall Coverage</div>
            <div className="text-lg font-bold text-foreground">{overallCoverage}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Median Freshness</div>
            <div className="text-lg font-bold text-foreground">{overallFreshness}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Source Status Summary */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium">{connectedCount} Connected</span>
          </div>
          {degradedCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">{degradedCount} Degraded</span>
            </div>
          )}
          <div className="flex-1" />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            reconciliationStatus === 'ok' ? 'bg-emerald-50 text-emerald-700' :
            reconciliationStatus === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {reconciliationStatus === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-xs font-medium">Reconciliation {reconciliationStatus.toUpperCase()}</span>
            <span className="text-xs opacity-70">({lastReconciliation})</span>
          </div>
        </div>

        {/* Data Sources Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Data Sources</span>
          </div>
          <div className="space-y-2">
            {sources.map((source) => {
              const statusColor = getStatusColor(source.status);
              return (
                <div
                  key={source.id}
                  className={`flex items-center gap-4 p-3 rounded-lg ${statusColor.bgLight} border border-border/50`}
                >
                  <span className="text-xl">{getSourceTypeIcon(source.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{source.name}</span>
                      <div className={`w-2 h-2 rounded-full ${statusColor.bg}`} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(source.recordCount)} records • Last sync: {source.lastSync}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{source.coverage}%</div>
                    <div className="text-xs text-muted-foreground">Coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{source.medianAge}</div>
                    <div className="text-xs text-muted-foreground">Median Age</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-semibold ${source.errorRate > 1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {source.errorRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Error Rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing Fields */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileSearch className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Top Missing Fields</span>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {missingFields.slice(0, 6).map((field) => (
              <div
                key={field.field}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className={`w-2 h-8 rounded-full ${
                  field.impactLevel === 'high' ? 'bg-rose-500' :
                  field.impactLevel === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground truncate">{field.field}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    Affects: {field.affectedModels.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    field.missingPct > 20 ? 'text-rose-600' : 'text-foreground'
                  }`}>
                    {field.missingPct}%
                  </div>
                  <div className="text-xs text-muted-foreground">missing</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataLineagePanel;
