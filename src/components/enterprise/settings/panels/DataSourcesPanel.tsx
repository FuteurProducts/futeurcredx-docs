// Data Sources Panel - Connected data source cards

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, AlertTriangle, RefreshCw,
  Database, CreditCard, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DataSource } from '../types';

interface DataSourcesPanelProps {
  dataSources: DataSource[];
  onReauth: (sourceId: string) => void;
  onSync: (sourceId: string) => void;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const StatusIcon: React.FC<{ status: DataSource['status'] }> = ({ status }) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="h-5 w-5 text-success" />;
    case 'error':
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case 'disconnected':
      return <XCircle className="h-5 w-5 text-muted-foreground" />;
  }
};

const TypeIcon: React.FC<{ type: DataSource['type'] }> = ({ type }) => {
  switch (type) {
    case 'aggregator':
      return <Database className="h-5 w-5" />;
    case 'bureau':
      return <CreditCard className="h-5 w-5" />;
    case 'accounting':
      return <FileText className="h-5 w-5" />;
  }
};

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({
  dataSources,
  onReauth,
  onSync,
}) => {
  const aggregators = dataSources.filter((ds) => ds.type === 'aggregator');
  const bureaus = dataSources.filter((ds) => ds.type === 'bureau');
  const accounting = dataSources.filter((ds) => ds.type === 'accounting');

  const renderCard = (source: DataSource) => (
    <motion.div
      key={source.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl border border-border p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-xl">
            <TypeIcon type={source.type} />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{source.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">{source.type}</p>
          </div>
        </div>
        <StatusIcon status={source.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Sync</span>
          <span className="font-medium">{formatDate(source.lastSync)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Error Rate</span>
          <span className={`font-medium ${source.errorRate > 5 ? 'text-warning' : 'text-foreground'}`}>
            {source.errorRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {source.status === 'disconnected' || source.status === 'error' ? (
          <Button
            className="flex-1"
            onClick={() => onReauth(source.id)}
          >
            {source.status === 'disconnected' ? 'Connect' : 'Re-authenticate'}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onSync(source.id)}
          >
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </Button>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Connected Data Sources</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage connections to external data providers
        </p>
      </div>

      {/* Aggregators */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Bank Aggregators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aggregators.map(renderCard)}
        </div>
      </div>

      {/* Bureaus */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Credit Bureaus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bureaus.map(renderCard)}
        </div>
      </div>

      {/* Accounting */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Accounting Platforms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounting.map(renderCard)}
        </div>
      </div>
    </motion.div>
  );
};

export default DataSourcesPanel;
