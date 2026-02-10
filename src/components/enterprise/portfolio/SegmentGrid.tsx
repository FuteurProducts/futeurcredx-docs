import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SegmentCard } from './SegmentCard';

interface IndustrySegment {
  id: string;
  name: string;
  icon: string;
  businessCount: number;
  totalExposure: number;
  qualRate: number;
  avgScore: number;
  highRiskPct: number;
  trend: { direction: 'up' | 'down' | 'stable'; value: number };
  topProducts: { name: string; eligible: number }[];
  region: Record<string, number>;
  riskDistribution: Record<string, number>;
  avgRevenue: number;
  avgYearsInBusiness: number;
}

interface SegmentGridProps {
  segments: IndustrySegment[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onSegmentSelect?: (segmentId: string) => void;
  selectedSegmentId?: string;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'totalExposure', label: 'By Size' },
  { value: 'highRiskPct', label: 'By Risk' },
  { value: 'avgScore', label: 'By Score' },
  { value: 'qualRate', label: 'By Opportunity' },
];

export function SegmentGrid({
  segments,
  sortBy,
  sortOrder: _sortOrder,
  onSortChange,
  onSegmentSelect,
  selectedSegmentId,
  className,
}: SegmentGridProps) {
  const handleSortClick = (field: string) => {
    onSortChange(field);
  };

  // Sort label available for future dropdown UI
  void SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Industry Segments</h2>
          <p className="text-sm text-muted-foreground">
            {segments.length} segments across portfolio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortClick(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground cursor-pointer hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {segments.map((segment, index) => (
          <motion.div
            key={segment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <SegmentCard
              segment={segment}
              onSelect={onSegmentSelect}
              isSelected={selectedSegmentId === segment.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {segments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No segments found</p>
        </div>
      )}
    </div>
  );
}
