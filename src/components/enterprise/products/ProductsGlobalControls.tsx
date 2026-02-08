// Products Global Controls - View mode switcher + product filters
import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Target,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Building2,
  Users,
  Tag,
} from 'lucide-react';
import type { ProductsFilters, ProductViewMode, ProductFamily, SegmentType, ProductStatus, TimeWindow } from './types';

interface ProductsGlobalControlsProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
}

const viewModes: { id: ProductViewMode; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'shelf', label: 'Product Shelf', icon: LayoutGrid, color: 'bg-primary' },
  { id: 'penetration', label: 'Penetration', icon: Target, color: 'bg-info' },
  { id: 'prequalification', label: 'Pre-Qualification', icon: CheckCircle, color: 'bg-success' },
  { id: 'performance', label: 'Performance', icon: BarChart3, color: 'bg-warning' },
  { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck, color: 'bg-[hsl(var(--primary-04))]' },
];

const productFamilies: { id: ProductFamily | 'All'; label: string }[] = [
  { id: 'All', label: 'All Families' },
  { id: 'Credit Cards', label: 'Credit Cards' },
  { id: 'Lines of Credit', label: 'Lines of Credit' },
  { id: 'Term Loans', label: 'Term Loans' },
  { id: 'SBA Programs', label: 'SBA Programs' },
  { id: 'Equipment Finance', label: 'Equipment Finance' },
  { id: 'Commercial Auto', label: 'Commercial Auto' },
  { id: 'Commercial Real Estate', label: 'Commercial RE' },
  { id: 'Deposits', label: 'Deposits' },
  { id: 'Treasury', label: 'Treasury' },
];

const segments: { id: SegmentType; label: string }[] = [
  { id: 'all', label: 'All Segments' },
  { id: 'micro', label: 'Micro (<$1M)' },
  { id: 'small', label: 'Small ($1M-$10M)' },
  { id: 'midmarket', label: 'Mid-Market ($10M+)' },
];

const statuses: { id: ProductStatus | 'All'; label: string }[] = [
  { id: 'All', label: 'All Statuses' },
  { id: 'Active', label: 'Active' },
  { id: 'Pilot', label: 'Pilot' },
  { id: 'Sunset', label: 'Sunset' },
];

const timeWindows: { id: TimeWindow; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

export const ProductsGlobalControls: React.FC<ProductsGlobalControlsProps> = ({
  filters,
  onFiltersChange,
}) => {
  const updateFilter = <K extends keyof ProductsFilters>(key: K, value: ProductsFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = filters.viewMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFilter('viewMode', mode.id)}
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
        {/* Product Family Selector */}
        <div className="relative">
          <select
            value={filters.productFamily}
            onChange={(e) => updateFilter('productFamily', e.target.value as ProductFamily | 'All')}
            className="appearance-none h-10 pl-10 pr-8 bg-muted rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {productFamilies.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
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

        {/* Status Selector */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value as ProductStatus | 'All')}
            className="appearance-none h-10 pl-10 pr-8 bg-muted rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
      </div>
    </div>
  );
};

export default ProductsGlobalControls;
