import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';
import { ApplicationTableSkeleton, SkeletonCard } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/empty-state';

export interface PipelineApplication {
  id: string;
  appId: string;
  companyName: string;
  amount: number;
  productType: string;
  customerSegment: 'micro' | 'small' | 'mid-market';
  riskTier: 'low' | 'medium' | 'high';
  aiRecommendation: 'approve' | 'review' | 'decline';
  confidence: number;
  geography: string;
  industry: string;
  yearsInBusiness: number;
  compositeScore: number;
  submittedAt: string;
  assignedTo?: string;
  tags: string[];
}

interface ApplicationPipelineViewProps {
  applications: PipelineApplication[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (app: PipelineApplication) => void;
  viewMode: 'table' | 'cards';
  applicationStatuses?: Record<string, string>;
  isLoading?: boolean;
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return { label: 'Approved', color: 'bg-success/15 text-success border border-success/30' };
    case 'declined':
      return { label: 'Declined', color: 'bg-destructive/15 text-destructive border border-destructive/30' };
    case 'under_review':
      return { label: 'Under Review', color: 'bg-warning/15 text-warning border border-warning/30' };
    default:
      return null;
  }
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

const getSegmentConfig = (segment: PipelineApplication['customerSegment']) => {
  switch (segment) {
    case 'micro': return { label: 'Micro', color: 'bg-info/10 text-info' };
    case 'small': return { label: 'Small', color: 'bg-success/10 text-success' };
    case 'mid-market': return { label: 'Mid-Market', color: 'bg-[var(--primary-04)]/10 text-[var(--primary-04)]' };
  }
};

const getRiskConfig = (tier: PipelineApplication['riskTier']) => {
  switch (tier) {
    case 'low': return { label: 'Low', color: 'bg-success/10 text-success border-success/20' };
    case 'medium': return { label: 'Medium', color: 'bg-warning/10 text-warning border-warning/20' };
    case 'high': return { label: 'High', color: 'bg-destructive/10 text-destructive border-destructive/20' };
  }
};

const getRecommendationConfig = (rec: PipelineApplication['aiRecommendation']) => {
  switch (rec) {
    case 'approve': return {
      icon: CheckCircle2,
      label: 'Approve',
      color: 'text-success',
      bg: 'bg-success/10 border-success/20'
    };
    case 'review': return {
      icon: AlertTriangle,
      label: 'Review',
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/20'
    };
    case 'decline': return {
      icon: XCircle,
      label: 'Decline',
      color: 'text-destructive',
      bg: 'bg-destructive/10 border-destructive/20'
    };
  }
};

const RISK_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2 };
const REC_ORDER: Record<string, number> = { approve: 0, review: 1, decline: 2 };
const SEGMENT_ORDER: Record<string, number> = { micro: 0, small: 1, 'mid-market': 2 };

export const ApplicationPipelineView: React.FC<ApplicationPipelineViewProps> = ({
  applications,
  selectedIds,
  onSelect,
  onSelectAll,
  onViewDetails,
  viewMode,
  applicationStatuses = {},
  isLoading = false,
  emptyStateAction,
}) => {
  const [sortField, setSortField] = useState<string>('compositeScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedApplications = useMemo(() => {
    const sorted = [...applications];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'riskTier') {
        comparison = (RISK_ORDER[a.riskTier] ?? 0) - (RISK_ORDER[b.riskTier] ?? 0);
      } else if (sortField === 'aiRecommendation') {
        comparison = (REC_ORDER[a.aiRecommendation] ?? 0) - (REC_ORDER[b.aiRecommendation] ?? 0);
      } else if (sortField === 'customerSegment') {
        comparison = (SEGMENT_ORDER[a.customerSegment] ?? 0) - (SEGMENT_ORDER[b.customerSegment] ?? 0);
      } else {
        const fieldA = a[sortField as keyof PipelineApplication];
        const fieldB = b[sortField as keyof PipelineApplication];
        if (fieldA == null && fieldB == null) return 0;
        if (fieldA == null) return 1;
        if (fieldB == null) return -1;
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          comparison = fieldA - fieldB;
        } else {
          comparison = String(fieldA).localeCompare(String(fieldB));
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [applications, sortField, sortDirection]);

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {sortField === field && (
          sortDirection === 'asc'
            ? <ChevronUp className="h-3 w-3" />
            : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </th>
  );

  // Loading state
  if (isLoading) {
    if (viewMode === 'cards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-[280px]" />
          ))}
        </div>
      );
    }
    return <ApplicationTableSkeleton rows={5} />;
  }

  // Empty state
  if (sortedApplications.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No applications found"
        description="There are no applications matching your current filters. Try adjusting the filter criteria or wait for new applications."
        action={emptyStateAction}
        variant="card"
        size="md"
        className="min-h-[300px]"
      />
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedApplications.map((app, index) => {
          const segment = getSegmentConfig(app.customerSegment);
          const risk = getRiskConfig(app.riskTier);
          const rec = getRecommendationConfig(app.aiRecommendation);
          const isSelected = selectedIds.includes(app.id);
          const appStatus = applicationStatuses[app.id];
          const statusBadge = appStatus ? getStatusBadge(appStatus) : null;
          const isActioned = appStatus === 'approved' || appStatus === 'declined';

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActioned ? 0.6 : 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                isActioned ? 'pointer-events-auto' :
                isSelected ? 'border-info bg-info/5' : 'border-border'
              } ${isActioned ? 'border-border' : ''}`}
              onClick={() => onViewDetails(app)}
            >
              {/* Status Badge */}
              {statusBadge && (
                <div className="mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                    {appStatus === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                    {appStatus === 'declined' && <XCircle className="w-3 h-3" />}
                    {appStatus === 'under_review' && <AlertTriangle className="w-3 h-3" />}
                    {statusBadge.label}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelect(app.id);
                    }}
                    className="w-4 h-4 rounded border-border text-info"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{app.companyName}</h3>
                    <p className="text-xs text-muted-foreground">{app.appId}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-accent rounded"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Amount & Product */}
              <div className="mb-3">
                <div className="text-xl font-bold text-foreground">{formatCurrency(app.amount)}</div>
                <div className="text-xs text-muted-foreground">{app.productType}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${segment.color}`}>
                  {segment.label}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${risk.color}`}>
                  {risk.label} Risk
                </span>
                <span className="px-2 py-0.5 bg-accent text-muted-foreground rounded text-xs">
                  {app.geography}
                </span>
              </div>

              {/* AI Recommendation */}
              <div className={`flex items-center justify-between p-2.5 rounded-lg border ${rec.bg}`}>
                <div className="flex items-center gap-2">
                  <rec.icon className={`w-4 h-4 ${rec.color}`} />
                  <span className={`text-sm font-medium ${rec.color}`}>AI: {rec.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{app.confidence}%</span>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {app.submittedAt}
                </div>
                <div className="flex items-center gap-1">
                  Score: <span className="font-semibold text-foreground">{app.compositeScore}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Table View
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === sortedApplications.length && sortedApplications.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-border text-info"
                />
              </th>
              <SortHeader field="companyName" label="Application" />
              <SortHeader field="amount" label="Amount / Product" />
              <SortHeader field="customerSegment" label="Segment" />
              <SortHeader field="riskTier" label="Risk" />
              <SortHeader field="aiRecommendation" label="AI Decision" />
              <SortHeader field="compositeScore" label="Score" />
              <SortHeader field="geography" label="Geography" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedApplications.map((app, index) => {
              const segment = getSegmentConfig(app.customerSegment);
              const risk = getRiskConfig(app.riskTier);
              const rec = getRecommendationConfig(app.aiRecommendation);
              const isSelected = selectedIds.includes(app.id);
              const appStatus = applicationStatuses[app.id];
              const statusBadge = appStatus ? getStatusBadge(appStatus) : null;
              const isActioned = appStatus === 'approved' || appStatus === 'declined';

              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActioned ? 0.5 : 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`hover:bg-muted cursor-pointer transition-colors ${
                    isSelected ? 'bg-info/5' : ''
                  }`}
                  onClick={() => onViewDetails(app)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(app.id)}
                      className="w-4 h-4 rounded border-border text-info"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{app.companyName}</p>
                        <p className="text-xs text-muted-foreground">{app.appId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{formatCurrency(app.amount)}</div>
                    <div className="text-xs text-muted-foreground">{app.productType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${segment.color}`}>
                      {segment.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${risk.color}`}>
                      {risk.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <rec.icon className={`w-4 h-4 ${rec.color}`} />
                      <span className={`text-sm font-medium ${rec.color}`}>{rec.label}</span>
                      <span className="text-xs text-muted-foreground">({app.confidence}%)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground">{app.compositeScore}</span>
                      {app.compositeScore >= 700 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : app.compositeScore < 600 ? (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {app.geography}
                  </td>
                  <td className="px-4 py-3">
                    {statusBadge ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                        {appStatus === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {appStatus === 'declined' && <XCircle className="w-3 h-3" />}
                        {appStatus === 'under_review' && <AlertTriangle className="w-3 h-3" />}
                        {statusBadge.label}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(app);
                      }}
                      className="p-1.5 hover:bg-accent rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
