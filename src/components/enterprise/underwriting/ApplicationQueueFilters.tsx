import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

export interface FilterState {
  productType: string[];
  geography: string[];
  customerSegment: string[];
  relationshipStage: string[];
  riskTier: string[];
  amountRange: [number, number];
  searchQuery: string;
}

interface ApplicationQueueFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalApplications: number;
  filteredCount: number;
}

const PRODUCT_TYPES = [
  'Business Line of Credit',
  'Working Capital',
  'Equipment Financing',
  'Commercial Real Estate',
  'SBA 7(a) Loan',
  'SBA 504 Loan',
  'Business Credit Card',
  'Commercial Auto Loan',
  'Term Loan',
  'Invoice Factoring',
  'Merchant Cash Advance',
];

const GEOGRAPHIES = [
  'Northeast',
  'Southeast',
  'Midwest',
  'Southwest',
  'West Coast',
  'Pacific Northwest',
  'Mountain Region',
];

const CUSTOMER_SEGMENTS = [
  { id: 'micro', label: 'Micro (<$500K Rev)', color: 'bg-blue-100 text-blue-700' },
  { id: 'small', label: 'Small ($500K-$5M Rev)', color: 'bg-green-100 text-green-700' },
  { id: 'mid-market', label: 'Mid-Market ($5M-$50M Rev)', color: 'bg-purple-100 text-purple-700' },
];

const RELATIONSHIP_STAGES = [
  { id: 'prospect', label: 'Prospect', icon: '🎯' },
  { id: 'active', label: 'Active', icon: '✅' },
  { id: 'dormant', label: 'Dormant', icon: '💤' },
];

const RISK_TIERS = [
  { id: 'low', label: 'Low Risk', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'medium', label: 'Medium Risk', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'high', label: 'High Risk', color: 'bg-red-100 text-red-700 border-red-200' },
];

export const ApplicationQueueFilters: React.FC<ApplicationQueueFiltersProps> = ({
  filters,
  onFiltersChange,
  totalApplications,
  filteredCount,
}) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFiltersChange({ ...filters, [category]: newValues });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      productType: [],
      geography: [],
      customerSegment: [],
      relationshipStage: [],
      riskTier: [],
      amountRange: [0, 10000000],
      searchQuery: '',
    });
  };

  const activeFilterCount = 
    filters.productType.length + 
    filters.geography.length + 
    filters.customerSegment.length + 
    filters.relationshipStage.length + 
    filters.riskTier.length;

  const FilterSection: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
    count?: number;
  }> = ({ title, sectionKey, children, count }) => (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setExpandedSection(expandedSection === sectionKey ? null : sectionKey)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">{title}</span>
          {count && count > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {count}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform ${
            expandedSection === sectionKey ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSection === sectionKey && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-3 pb-3"
        >
          {children}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-800">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Results count */}
        <div className="mt-3 text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filteredCount.toLocaleString()}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalApplications.toLocaleString()}</span> applications
        </div>
      </div>

      {/* Filter Sections */}
      <div className="max-h-[500px] overflow-y-auto">
        <FilterSection 
          title="Product Type" 
          sectionKey="productType"
          count={filters.productType.length}
        >
          <div className="space-y-1">
            {PRODUCT_TYPES.map(product => (
              <label key={product} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.productType.includes(product)}
                  onChange={() => toggleFilter('productType', product)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">{product}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection 
          title="Geography" 
          sectionKey="geography"
          count={filters.geography.length}
        >
          <div className="space-y-1">
            {GEOGRAPHIES.map(geo => (
              <label key={geo} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.geography.includes(geo)}
                  onChange={() => toggleFilter('geography', geo)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">{geo}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection 
          title="Customer Segment" 
          sectionKey="customerSegment"
          count={filters.customerSegment.length}
        >
          <div className="space-y-2">
            {CUSTOMER_SEGMENTS.map(segment => (
              <button
                key={segment.id}
                onClick={() => toggleFilter('customerSegment', segment.id)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all ${
                  filters.customerSegment.includes(segment.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${segment.color}`}>
                  {segment.label}
                </span>
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection 
          title="Relationship Stage" 
          sectionKey="relationshipStage"
          count={filters.relationshipStage.length}
        >
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_STAGES.map(stage => (
              <button
                key={stage.id}
                onClick={() => toggleFilter('relationshipStage', stage.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${
                  filters.relationshipStage.includes(stage.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{stage.icon}</span>
                <span>{stage.label}</span>
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection 
          title="Risk Tier" 
          sectionKey="riskTier"
          count={filters.riskTier.length}
        >
          <div className="space-y-2">
            {RISK_TIERS.map(tier => (
              <button
                key={tier.id}
                onClick={() => toggleFilter('riskTier', tier.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  filters.riskTier.includes(tier.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${tier.color}`}>
                  {tier.label}
                </span>
                {filters.riskTier.includes(tier.id) && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};
