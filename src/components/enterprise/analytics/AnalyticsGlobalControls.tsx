// Analytics Global Controls - Portfolio filters and analysis mode selector
import React from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  TrendingUp,
  Shield,
  Rocket,
  Target,
  Activity,
  ChevronDown,
  MapPin,
  Building2,
  Users,
} from 'lucide-react';
import type { AnalyticsFilters, ProductType, SegmentType, RelationshipStage, TimeWindow, AnalysisMode } from './types';

interface AnalyticsGlobalControlsProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
}

const products: { id: ProductType; label: string }[] = [
  { id: 'All', label: 'All Products' },
  { id: 'LOC', label: 'Line of Credit' },
  { id: 'Cards', label: 'Business Cards' },
  { id: 'SBA', label: 'SBA Loans' },
  { id: 'CRE', label: 'Commercial RE' },
  { id: 'Equipment', label: 'Equipment' },
  { id: 'Merchant', label: 'Merchant Services' },
];

const segments: { id: SegmentType; label: string }[] = [
  { id: 'all', label: 'All Segments' },
  { id: 'micro', label: 'Micro (<$1M)' },
  { id: 'small', label: 'Small ($1M-$10M)' },
  { id: 'midmarket', label: 'Mid-Market ($10M+)' },
];

const stages: { id: RelationshipStage; label: string }[] = [
  { id: 'all', label: 'All Stages' },
  { id: 'prospect', label: 'Prospect' },
  { id: 'new', label: 'New' },
  { id: 'growing', label: 'Growing' },
  { id: 'mature', label: 'Mature' },
  { id: 'at-risk', label: 'At Risk' },
];

const timeWindows: { id: TimeWindow; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

const analysisModes: { id: AnalysisMode; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'bg-info' },
  { id: 'risk', label: 'Risk', icon: Shield, color: 'bg-warning' },
  { id: 'growth', label: 'Growth', icon: Rocket, color: 'bg-success' },
  { id: 'conversion', label: 'Conversion', icon: Target, color: 'bg-[hsl(var(--primary-04))]' },
  { id: 'signals', label: 'Signals', icon: Activity, color: 'bg-primary' },
];

export const AnalyticsGlobalControls: React.FC<AnalyticsGlobalControlsProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const updateFilter = <K extends keyof AnalyticsFilters>(key: K, value: AnalyticsFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      {/* Analysis Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {analysisModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = filters.analysisMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFilter('analysisMode', mode.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {mode.label}
            </motion.button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Product Selector */}
        <div className="relative">
          <select
            value={filters.product}
            onChange={(e) => updateFilter('product', e.target.value as ProductType)}
            className="appearance-none h-10 pl-10 pr-8 bg-muted rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Segment Selector */}
        <div className="relative">
          <select
            value={filters.segment}
            onChange={(e) => updateFilter('segment', e.target.value as SegmentType)}
            className="appearance-none h-10 pl-10 pr-8 bg-muted rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Geography */}
        <div className="relative">
          <select
            value={filters.geography}
            onChange={(e) => updateFilter('geography', e.target.value)}
            className="appearance-none h-10 pl-10 pr-8 bg-muted rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="national">National</option>
            <option value="northeast">Northeast</option>
            <option value="southeast">Southeast</option>
            <option value="midwest">Midwest</option>
            <option value="southwest">Southwest</option>
            <option value="west">West</option>
          </select>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Relationship Stage */}
        <div className="relative">
          <select
            value={filters.relationshipStage}
            onChange={(e) => updateFilter('relationshipStage', e.target.value as RelationshipStage)}
            className="appearance-none h-10 pl-10 pr-8 bg-muted rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* Time Window */}
        <div className="flex items-center bg-muted rounded-xl p-1">
          {timeWindows.map((tw) => (
            <button
              key={tw.id}
              onClick={() => updateFilter('timeWindow', tw.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filters.timeWindow === tw.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tw.label}
            </button>
          ))}
        </div>

        {/* More Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ml-auto ${
            showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pt-4 border-t border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Industry</label>
              <select className="w-full h-10 px-3 bg-muted rounded-xl text-sm font-medium">
                <option>All Industries</option>
                <option>Restaurants</option>
                <option>Retail</option>
                <option>Healthcare</option>
                <option>Construction</option>
                <option>Professional Services</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Tier</label>
              <select className="w-full h-10 px-3 bg-muted rounded-xl text-sm font-medium">
                <option>All Tiers</option>
                <option>Low Risk</option>
                <option>Medium Risk</option>
                <option>High Risk</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Indicator Range</label>
              <select className="w-full h-10 px-3 bg-muted rounded-xl text-sm font-medium">
                <option>All Indicators</option>
                <option>86–100 (Excellent)</option>
                <option>76–85 (Good)</option>
                <option>66–75 (Fair)</option>
                <option>51–65 (Poor)</option>
                <option>0–50 (Very Poor)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Exposure Range</label>
              <select className="w-full h-10 px-3 bg-muted rounded-xl text-sm font-medium">
                <option>All Exposures</option>
                <option>$0 – $100K</option>
                <option>$100K – $500K</option>
                <option>$500K – $1M</option>
                <option>$1M+</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsGlobalControls;
