// Enterprise Reports Global Controls - Sticky top navigation bar

import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import type { ReportFilters } from './types';

interface ReportsGlobalControlsProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  activeView: 'library' | 'custom';
  onViewChange: (view: 'library' | 'custom') => void;
}

const productOptions = ['All', 'LOC', 'Cards', 'SBA', 'CRE', 'Equipment', 'Auto', 'Merchant', 'Deposits'];
const segmentOptions = ['All', 'Micro', 'Small', 'Mid-market'];
const geographyOptions = ['National', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
const stageOptions = ['All', 'Prospect', 'New', 'Growing', 'Mature', 'At Risk'];
const timeWindows = ['7d', '30d', '90d', '12m', 'Custom'];

export const ReportsGlobalControls: React.FC<ReportsGlobalControlsProps> = ({
  filters,
  onFiltersChange,
  activeView,
  onViewChange,
}) => {
  const updateFilter = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10"
    >
      {/* View Tabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewChange('library')}
            className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-colors ${
              activeView === 'library'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Report Library
          </button>
          <button
            onClick={() => onViewChange('custom')}
            className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-colors ${
              activeView === 'custom'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Custom Report
          </button>
        </div>

        {/* Environment Toggle */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => updateFilter('environment', 'sandbox')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filters.environment === 'sandbox'
                ? 'bg-warning/10 text-warning'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sandbox
          </button>
          <button
            onClick={() => updateFilter('environment', 'production')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filters.environment === 'production'
                ? 'bg-success/10 text-success'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Production
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left - Scope Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          <select
            value={filters.product}
            onChange={(e) => updateFilter('product', e.target.value)}
            className="h-12 px-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            {productOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={filters.segment}
            onChange={(e) => updateFilter('segment', e.target.value)}
            className="h-12 px-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            {segmentOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={filters.geography}
            onChange={(e) => updateFilter('geography', e.target.value)}
            className="h-12 px-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            {geographyOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={filters.relationshipStage}
            onChange={(e) => updateFilter('relationshipStage', e.target.value)}
            className="h-12 px-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            {stageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Center - Time Range */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {timeWindows.map((tw) => (
            <button
              key={tw}
              onClick={() => updateFilter('timeWindow', tw)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filters.timeWindow === tw
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tw}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsGlobalControls;
