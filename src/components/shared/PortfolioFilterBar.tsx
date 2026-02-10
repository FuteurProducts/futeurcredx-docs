import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Calendar,
  Building2,
  MapPin,
  Users,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PortfolioFilters {
  product: string[];
  segment: string[];
  region: string[];
  stage: string[];
  timeWindow: '7d' | '30d' | '90d' | '12m';
}

export const DEFAULT_PORTFOLIO_FILTERS: PortfolioFilters = {
  product: [],
  segment: [],
  region: [],
  stage: [],
  timeWindow: '30d',
};

interface PortfolioFilterBarProps {
  filters: PortfolioFilters;
  onFiltersChange: (filters: PortfolioFilters) => void;
  showStage?: boolean;
  showTimeRange?: boolean;
  className?: string;
}

const PRODUCTS = [
  { id: 'loc', label: 'Line of Credit' },
  { id: 'cards', label: 'Credit Cards' },
  { id: 'sba', label: 'SBA Loans' },
  { id: 'cre', label: 'Commercial RE' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'auto', label: 'Auto' },
  { id: 'merchant', label: 'Merchant Services' },
  { id: 'deposits', label: 'Deposits' },
];

const SEGMENTS = [
  { id: 'micro', label: 'Micro (<$500K)' },
  { id: 'small', label: 'Small ($500K-$5M)' },
  { id: 'mid-market', label: 'Mid-Market ($5M+)' },
];

const REGIONS = [
  { id: 'national', label: 'National' },
  { id: 'northeast', label: 'Northeast' },
  { id: 'southeast', label: 'Southeast' },
  { id: 'midwest', label: 'Midwest' },
  { id: 'southwest', label: 'Southwest' },
  { id: 'west', label: 'West' },
];

const STAGES = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'new', label: 'New' },
  { id: 'growing', label: 'Growing' },
  { id: 'mature', label: 'Mature' },
  { id: 'at-risk', label: 'At Risk' },
];

const TIME_WINDOWS = [
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: '12m', label: '12M' },
];

export const PortfolioFilterBar: React.FC<PortfolioFilterBarProps> = ({
  filters,
  onFiltersChange,
  showStage = true,
  showTimeRange = true,
  className,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (
    category: 'product' | 'segment' | 'region' | 'stage',
    value: string,
  ) => {
    const current = filters[category];

    if (category === 'region') {
      if (value === 'national') {
        onFiltersChange({ ...filters, region: current.includes('national') ? [] : ['national'] });
        return;
      }
      const withoutNational = current.filter((v) => v !== 'national');
      const updated = withoutNational.includes(value)
        ? withoutNational.filter((v) => v !== value)
        : [...withoutNational, value];
      onFiltersChange({ ...filters, region: updated });
      return;
    }

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [category]: updated });
  };

  const activeCount =
    filters.product.length + filters.segment.length + filters.region.length + filters.stage.length;

  const Dropdown = ({
    id,
    label,
    icon: Icon,
    options,
    category,
    selected,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
    options: { id: string; label: string }[];
    category: 'product' | 'segment' | 'region' | 'stage';
    selected: string[];
  }) => (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border',
          selected.length > 0
            ? 'bg-primary/10 border-primary/20 text-primary'
            : 'bg-card border-border text-muted-foreground hover:bg-muted',
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="px-1 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full leading-none">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 transition-transform', activeDropdown === id && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {activeDropdown === id && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 mt-1.5 w-52 bg-card border border-border rounded-2xl shadow-lg z-50 p-1.5"
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFilter(category, opt.id);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors',
                  selected.includes(opt.id) ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                )}
              >
                <div
                  className={cn(
                    'w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0',
                    selected.includes(opt.id) ? 'bg-primary border-primary' : 'border-muted-foreground',
                  )}
                >
                  {selected.includes(opt.id) && (
                    <svg className="w-2 h-2 text-primary-foreground" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </div>
                <span>{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2.5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Portfolio</span>
            {activeCount > 0 && (
              <span className="text-[10px] text-muted-foreground">({activeCount})</span>
            )}
          </div>

          <Dropdown id="product" label="Product" icon={CreditCard} options={PRODUCTS} category="product" selected={filters.product} />
          <Dropdown id="segment" label="Segment" icon={Users} options={SEGMENTS} category="segment" selected={filters.segment} />
          <Dropdown id="region" label="Region" icon={MapPin} options={REGIONS} category="region" selected={filters.region} />
          {showStage && (
            <Dropdown id="stage" label="Stage" icon={Building2} options={STAGES} category="stage" selected={filters.stage} />
          )}

          {activeCount > 0 && (
            <button
              onClick={() =>
                onFiltersChange({ ...filters, product: [], segment: [], region: [], stage: [] })
              }
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors ml-1"
            >
              Clear
            </button>
          )}
        </div>

        {showTimeRange && (
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            <Calendar className="h-4 w-4 text-muted-foreground ml-1.5" />
            {TIME_WINDOWS.map((tw) => (
              <button
                key={tw.id}
                onClick={() => onFiltersChange({ ...filters, timeWindow: tw.id as PortfolioFilters['timeWindow'] })}
                className={cn(
                  'px-2 py-1 rounded text-[10px] font-medium transition-all',
                  filters.timeWindow === tw.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tw.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioFilterBar;
