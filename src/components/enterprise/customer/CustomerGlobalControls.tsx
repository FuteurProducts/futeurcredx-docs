import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Calendar, 
  LayoutGrid, 
  List,
  Building2,
  MapPin,
  Users,
  CreditCard,
  ChevronDown
} from 'lucide-react';

export interface CustomerFilters {
  product: string[];
  segment: string[];
  region: string[];
  relationshipStage: string[];
  timeWindow: '7d' | '30d' | '90d' | '12m';
  viewMode: 'portfolio' | 'entity';
}

interface CustomerGlobalControlsProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

const PRODUCTS = [
  { id: 'loc', label: 'Line of Credit', icon: CreditCard },
  { id: 'cards', label: 'Credit Cards', icon: CreditCard },
  { id: 'sba', label: 'SBA Loans', icon: Building2 },
  { id: 'cre', label: 'Commercial RE', icon: Building2 },
  { id: 'equipment', label: 'Equipment', icon: Building2 },
  { id: 'auto', label: 'Auto', icon: Building2 },
  { id: 'merchant', label: 'Merchant Services', icon: CreditCard },
  { id: 'deposits', label: 'Deposits', icon: Building2 },
];

const SEGMENTS = [
  { id: 'micro', label: 'Micro (<$500K)', color: 'hsl(var(--chart-1))' },
  { id: 'small', label: 'Small ($500K-$5M)', color: 'hsl(var(--chart-2))' },
  { id: 'mid-market', label: 'Mid-Market ($5M+)', color: 'hsl(var(--chart-3))' },
];

const REGIONS = [
  { id: 'national', label: 'National' },
  { id: 'northeast', label: 'Northeast' },
  { id: 'southeast', label: 'Southeast' },
  { id: 'midwest', label: 'Midwest' },
  { id: 'southwest', label: 'Southwest' },
  { id: 'west', label: 'West' },
];

const RELATIONSHIP_STAGES = [
  { id: 'prospect', label: 'Prospect', color: 'hsl(var(--muted-foreground))' },
  { id: 'new', label: 'New', color: 'hsl(var(--chart-1))' },
  { id: 'growing', label: 'Growing', color: 'hsl(var(--chart-2))' },
  { id: 'mature', label: 'Mature', color: 'hsl(var(--chart-3))' },
  { id: 'at-risk', label: 'At Risk', color: 'hsl(var(--destructive))' },
];

const TIME_WINDOWS = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

export const CustomerGlobalControls: React.FC<CustomerGlobalControlsProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleArrayFilter = (
    category: 'product' | 'segment' | 'region' | 'relationshipStage',
    value: string
  ) => {
    const current = filters[category];

    // Region: "National" exclusive toggle
    if (category === 'region') {
      if (value === 'national') {
        // Selecting National clears other regions; deselecting National does nothing special
        const updated = current.includes('national') ? [] : ['national'];
        onFiltersChange({ ...filters, region: updated });
        return;
      } else {
        // Selecting a specific region clears "National"
        const withoutNational = current.filter(v => v !== 'national');
        const updated = withoutNational.includes(value)
          ? withoutNational.filter(v => v !== value)
          : [...withoutNational, value];
        onFiltersChange({ ...filters, region: updated });
        return;
      }
    }

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [category]: updated });
  };

  const getActiveCount = () => {
    return (
      filters.product.length +
      filters.segment.length +
      filters.region.length +
      filters.relationshipStage.length
    );
  };

  const FilterDropdown = ({
    id,
    label,
    icon: Icon,
    options,
    category,
    selectedValues,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
    options: { id: string; label: string; color?: string }[];
    category: 'product' | 'segment' | 'region' | 'relationshipStage';
    selectedValues: string[];
  }) => (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${selectedValues.length > 0
            ? 'bg-primary/10 border-primary/20 text-primary'
            : 'bg-card border-border text-muted-foreground hover:bg-muted'
          }
        `}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === id ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {activeDropdown === id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 p-2"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArrayFilter(category, option.id);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  transition-colors
                  ${selectedValues.includes(option.id)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                  }
                `}
              >
                <div
                  className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${selectedValues.includes(option.id)
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                    }
                  `}
                >
                  {selectedValues.includes(option.id) && (
                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </div>
                {option.color && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: option.color }} />
                )}
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Portfolio Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Portfolio</span>
            {getActiveCount() > 0 && (
              <span className="text-xs text-muted-foreground">
                ({getActiveCount()} active)
              </span>
            )}
          </div>

          <FilterDropdown
            id="product"
            label="Product"
            icon={CreditCard}
            options={PRODUCTS}
            category="product"
            selectedValues={filters.product}
          />

          <FilterDropdown
            id="segment"
            label="Segment"
            icon={Users}
            options={SEGMENTS}
            category="segment"
            selectedValues={filters.segment}
          />

          <FilterDropdown
            id="region"
            label="Region"
            icon={MapPin}
            options={REGIONS}
            category="region"
            selectedValues={filters.region}
          />

          <FilterDropdown
            id="stage"
            label="Stage"
            icon={Building2}
            options={RELATIONSHIP_STAGES}
            category="relationshipStage"
            selectedValues={filters.relationshipStage}
          />

          {getActiveCount() > 0 && (
            <button
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  product: [],
                  segment: [],
                  region: [],
                  relationshipStage: [],
                })
              }
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Right: Time Window + View Mode */}
        <div className="flex items-center gap-3">
          {/* Time Window */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
            {TIME_WINDOWS.map((tw) => (
              <button
                key={tw.id}
                onClick={() =>
                  onFiltersChange({ ...filters, timeWindow: tw.id as CustomerFilters['timeWindow'] })
                }
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${filters.timeWindow === tw.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tw.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => onFiltersChange({ ...filters, viewMode: 'portfolio' })}
              className={`
                p-2 rounded-md transition-all
                ${filters.viewMode === 'portfolio'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              title="Portfolio View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, viewMode: 'entity' })}
              className={`
                p-2 rounded-md transition-all
                ${filters.viewMode === 'entity'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              title="Entity View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
