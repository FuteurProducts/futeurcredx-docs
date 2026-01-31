import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  MoreHorizontal,
  Building2,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SortIndicator } from '@/components/ui/sort-indicator';
import { exportToCSV } from '@/lib/export';
import toast from 'react-hot-toast';

export interface CustomerEntity {
  id: string;
  businessName: string;
  industry: string;
  naicsCode: string;
  segment: 'micro' | 'small' | 'mid-market';
  region: string;
  branch: string;
  rhs: number;
  rhsChange: number;
  primaryProduct: string;
  riskTier: 'low' | 'medium' | 'high';
  relationshipStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
  lastActivity: string;
  assignedRM?: string;
  totalExposure: number;
  depositBalance: number;
  productCount: number;
}

interface CustomerListTableProps {
  customers: CustomerEntity[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (customer: CustomerEntity) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const SEGMENT_CONFIG = {
  'micro': { label: 'Micro', color: 'hsl(var(--chart-1))' },
  'small': { label: 'Small', color: 'hsl(var(--chart-2))' },
  'mid-market': { label: 'Mid-Market', color: 'hsl(var(--chart-3))' },
};

const RISK_CONFIG = {
  'low': { label: 'Low', color: 'hsl(var(--chart-2))', icon: CheckCircle },
  'medium': { label: 'Medium', color: 'hsl(var(--chart-4))', icon: Clock },
  'high': { label: 'High', color: 'hsl(var(--destructive))', icon: AlertTriangle },
};

const STAGE_CONFIG = {
  'prospect': { label: 'Prospect', color: 'hsl(var(--muted-foreground))' },
  'new': { label: 'New', color: 'hsl(var(--chart-1))' },
  'growing': { label: 'Growing', color: 'hsl(var(--chart-2))' },
  'mature': { label: 'Mature', color: 'hsl(var(--chart-3))' },
  'at-risk': { label: 'At Risk', color: 'hsl(var(--destructive))' },
};

export const CustomerListTable: React.FC<CustomerListTableProps> = ({
  customers,
  selectedIds,
  onSelect,
  onSelectAll,
  onViewDetails,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
  onSearchChange,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Filter customers based on search query (match name, industry, segment)
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter((c) =>
      c.businessName.toLowerCase().includes(query) ||
      c.industry.toLowerCase().includes(query) ||
      c.segment.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  // Sort the filtered customers based on sortField and sortDirection
  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers];
    sorted.sort((a, b) => {
      const fieldA = a[sortField as keyof CustomerEntity];
      const fieldB = b[sortField as keyof CustomerEntity];
      if (fieldA == null && fieldB == null) return 0;
      if (fieldA == null) return 1;
      if (fieldB == null) return -1;
      let comparison = 0;
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        comparison = fieldA - fieldB;
      } else {
        comparison = String(fieldA).localeCompare(String(fieldB));
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredCustomers, sortField, sortDirection]);

  // Paginate the sorted results
  const filteredTotal = sortedCustomers.length;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const getRHSColor = (rhs: number) => {
    if (rhs >= 80) return 'text-success';
    if (rhs >= 60) return 'text-primary';
    if (rhs >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const totalPages = Math.ceil(filteredTotal / pageSize);
  const allSelected = paginatedCustomers.length > 0 && selectedIds.length === paginatedCustomers.length;

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <SortIndicator field={field} currentSort={sortField} direction={sortDirection} />
      </div>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Table Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Customer Portfolio
            </h3>
            <span className="text-xs text-muted-foreground">
              {searchQuery.trim()
                ? `Showing ${filteredTotal.toLocaleString()} of ${totalCount.toLocaleString()} businesses`
                : `${totalCount.toLocaleString()} clients`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 bg-muted border-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-primary/10 border-primary/20 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>

            {/* Export */}
            <button
              onClick={() => {
                exportToCSV(customers.map(c => ({
                  'Business Name': c.businessName,
                  Industry: c.industry,
                  'NAICS Code': c.naicsCode,
                  Segment: c.segment,
                  Region: c.region,
                  Branch: c.branch,
                  RHS: c.rhs,
                  'RHS Change': c.rhsChange,
                  'Primary Product': c.primaryProduct,
                  'Risk Tier': c.riskTier,
                  'Relationship Stage': c.relationshipStage,
                  'Last Activity': c.lastActivity,
                  'Assigned RM': c.assignedRM ?? '',
                  'Total Exposure': c.totalExposure,
                  'Deposit Balance': c.depositBalance,
                  'Product Count': c.productCount,
                })), 'customers');
                toast.success('CSV exported successfully');
              }}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Export CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 flex items-center gap-3"
          >
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Assign RM
            </button>
            <button className="px-3 py-1.5 text-xs font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Add to Campaign
            </button>
            <button className="px-3 py-1.5 text-xs font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Export Selected
            </button>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-muted-foreground"
                />
              </th>
              <SortHeader field="businessName" label="Business" />
              <SortHeader field="industry" label="Industry" />
              <SortHeader field="segment" label="Segment" />
              <SortHeader field="region" label="Region" />
              <SortHeader field="rhs" label="RHS" />
              <SortHeader field="primaryProduct" label="Primary Product" />
              <SortHeader field="riskTier" label="Risk" />
              <SortHeader field="relationshipStage" label="Stage" />
              <SortHeader field="lastActivity" label="Last Activity" />
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={11}>
                  <EmptyState
                    icon={Search}
                    title="No customers found"
                    description="Try adjusting your search or filter criteria to find what you're looking for."
                    action={{ label: "Clear filters", onClick: () => onSearchChange('') }}
                  />
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((customer) => {
                const segmentConfig = SEGMENT_CONFIG[customer.segment];
                const riskConfig = RISK_CONFIG[customer.riskTier];
                const stageConfig = STAGE_CONFIG[customer.relationshipStage];
                const RiskIcon = riskConfig.icon;

                return (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                      selectedIds.includes(customer.id) ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => onViewDetails(customer)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(customer.id)}
                        onChange={() => onSelect(customer.id)}
                        className="rounded border-muted-foreground"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {customer.businessName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customer.assignedRM || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                        {customer.naicsCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-md"
                        style={{
                          backgroundColor: `${segmentConfig.color}15`,
                          color: segmentConfig.color,
                        }}
                      >
                        {segmentConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{customer.region}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${getRHSColor(customer.rhs)}`}>
                          {customer.rhs}
                        </span>
                        {customer.rhsChange !== 0 && (
                          <span className={`flex items-center text-xs ${
                            customer.rhsChange > 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {customer.rhsChange > 0
                              ? <TrendingUp className="h-3 w-3" />
                              : <TrendingDown className="h-3 w-3" />
                            }
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{customer.primaryProduct}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <RiskIcon className="h-3.5 w-3.5" style={{ color: riskConfig.color }} />
                        <span
                          className="text-xs font-medium"
                          style={{ color: riskConfig.color }}
                        >
                          {riskConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${stageConfig.color}15`,
                          color: stageConfig.color,
                        }}
                      >
                        {stageConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {customer.lastActivity}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTotal === 0 ? 0 : ((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredTotal)} of {filteredTotal.toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-muted-foreground">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="w-8 h-8 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};
