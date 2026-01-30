import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, RefreshCw, Download, Calendar } from 'lucide-react';

export interface PortfolioFilter {
  product: string[];
  segment: string[];
  region: string[];
  relationshipStage: string[];
  riskTier: string[];
}

export interface RiskLens {
  id: 'credit' | 'cashflow' | 'bureau' | 'fraud' | 'model_drift';
  label: string;
  active: boolean;
}

export interface RiskGlobalControlsProps {
  portfolioFilter: PortfolioFilter;
  onPortfolioFilterChange: (filter: PortfolioFilter) => void;
  timeWindow: '7d' | '30d' | '90d' | '12m';
  onTimeWindowChange: (window: '7d' | '30d' | '90d' | '12m') => void;
  riskLenses: RiskLens[];
  onRiskLensToggle: (lensId: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  lastRefreshed?: string;
  className?: string;
}

const PRODUCTS = ['Credit Line', 'Working Capital', 'Business Credit Card', 'SBA Loans', 'Commercial Auto', 'Equipment Loans', 'CRE'];
const SEGMENTS = ['Micro Business', 'Small Business', 'Mid-Market'];
const REGIONS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast'];
const STAGES = ['Prospect', 'Active', 'Dormant'];
const RISK_TIERS = ['Low', 'Medium', 'High', 'Watch'];

export const RiskGlobalControls: React.FC<RiskGlobalControlsProps> = ({
  portfolioFilter,
  onPortfolioFilterChange,
  timeWindow,
  onTimeWindowChange,
  riskLenses,
  onRiskLensToggle,
  onRefresh,
  onExport,
  lastRefreshed,
  className = '',
}) => {
  const [expandedFilter, setExpandedFilter] = React.useState<string | null>(null);

  const FilterDropdown = ({ 
    label, 
    options, 
    selected, 
    filterKey 
  }: { 
    label: string; 
    options: string[]; 
    selected: string[]; 
    filterKey: keyof PortfolioFilter 
  }) => {
    const isExpanded = expandedFilter === filterKey;
    
    return (
      <div className="relative">
        <button
          onClick={() => setExpandedFilter(isExpanded ? null : filterKey)}
          className={`flex items-center gap-2 h-9 px-3 rounded-lg border text-sm font-medium transition-all ${
            selected.length > 0 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-border bg-background text-foreground hover:border-muted-foreground'
          }`}
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">
              {selected.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 p-2"
          >
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const newSelected = isSelected
                        ? selected.filter(s => s !== option)
                        : [...selected, option];
                      onPortfolioFilterChange({
                        ...portfolioFilter,
                        [filterKey]: newSelected,
                      });
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-border mt-2 pt-2">
              <button
                onClick={() => onPortfolioFilterChange({ ...portfolioFilter, [filterKey]: [] })}
                className="w-full text-sm text-muted-foreground hover:text-foreground py-1"
              >
                Clear selection
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl p-4 ${className}`}
    >
      {/* Top Row: Portfolio Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 mr-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Portfolio</span>
        </div>
        
        <FilterDropdown
          label="Product"
          options={PRODUCTS}
          selected={portfolioFilter.product}
          filterKey="product"
        />
        <FilterDropdown
          label="Segment"
          options={SEGMENTS}
          selected={portfolioFilter.segment}
          filterKey="segment"
        />
        <FilterDropdown
          label="Region"
          options={REGIONS}
          selected={portfolioFilter.region}
          filterKey="region"
        />
        <FilterDropdown
          label="Stage"
          options={STAGES}
          selected={portfolioFilter.relationshipStage}
          filterKey="relationshipStage"
        />
        <FilterDropdown
          label="Risk Tier"
          options={RISK_TIERS}
          selected={portfolioFilter.riskTier}
          filterKey="riskTier"
        />

        {/* Clear All */}
        {(portfolioFilter.product.length > 0 || 
          portfolioFilter.segment.length > 0 || 
          portfolioFilter.region.length > 0 || 
          portfolioFilter.relationshipStage.length > 0 || 
          portfolioFilter.riskTier.length > 0) && (
          <button
            onClick={() => onPortfolioFilterChange({
              product: [],
              segment: [],
              region: [],
              relationshipStage: [],
              riskTier: [],
            })}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Bottom Row: Time Window, Risk Lenses, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Time Window */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
            {(['7d', '30d', '90d', '12m'] as const).map((window) => (
              <button
                key={window}
                onClick={() => onTimeWindowChange(window)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  timeWindow === window
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {window}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Lenses */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Risk Lens:</span>
          <div className="flex items-center gap-1">
            {riskLenses.map((lens) => (
              <button
                key={lens.id}
                onClick={() => onRiskLensToggle(lens.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lens.active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {lens.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-xs text-muted-foreground">
              Updated {lastRefreshed}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 h-8 px-3 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RiskGlobalControls;
