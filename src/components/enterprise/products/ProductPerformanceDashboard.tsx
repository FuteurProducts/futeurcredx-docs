// Product Performance Dashboard - View 4: Performance metrics and conversion funnel
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { PortfolioKPITiles } from '../analytics/PortfolioKPITiles';
import { ApplicationFunnelChart } from '../analytics/ApplicationFunnelChart';
import {
  mockPerformanceKPIs,
  mockPerformanceApplicationFunnel,
  mockProductPerformance,
} from './mockData';
import type { ProductsFilters } from './types';

interface ProductPerformanceDashboardProps {
  filters: ProductsFilters;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

const getRateBadgeClasses = (rate: number): string => {
  if (rate >= 75) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
  if (rate >= 60) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
  return 'bg-red-500/15 text-red-600 dark:text-red-400';
};

export const ProductPerformanceDashboard: React.FC<ProductPerformanceDashboardProps> = ({
  filters,
}) => {
  // Filter and sort performance rows
  const sortedRows = useMemo(() => {
    const filtered = mockProductPerformance.filter((row) => {
      if (filters.productFamily !== 'All' && row.family !== filters.productFamily) return false;
      return true;
    });
    return [...filtered].sort((a, b) => b.totalFunded30d - a.totalFunded30d);
  }, [filters.productFamily]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Row */}
      <motion.div variants={itemVariants}>
        <PortfolioKPITiles kpis={mockPerformanceKPIs} />
      </motion.div>

      {/* Application Funnel */}
      <motion.div variants={itemVariants}>
        <ApplicationFunnelChart data={mockPerformanceApplicationFunnel} />
      </motion.div>

      {/* Performance by Product Table */}
      <motion.div
        variants={itemVariants}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Performance by Product</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {sortedRows.length} products
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  Product
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  Family
                </th>
                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  Approval Rate
                </th>
                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  Funding Rate
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  Avg Deal Size
                </th>
                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  <span className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time to Decision
                  </span>
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">
                  Funded (30d)
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">
                  YoY Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, index) => (
                <motion.tr
                  key={row.product}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                >
                  {/* Product */}
                  <td className="py-3.5 pr-4">
                    <span className="text-sm font-medium text-foreground">{row.product}</span>
                  </td>

                  {/* Family */}
                  <td className="py-3.5 pr-4">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {row.family}
                    </span>
                  </td>

                  {/* Approval Rate */}
                  <td className="py-3.5 pr-4 text-center">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getRateBadgeClasses(
                        row.approvalRate
                      )}`}
                    >
                      {row.approvalRate.toFixed(1)}%
                    </span>
                  </td>

                  {/* Funding Rate */}
                  <td className="py-3.5 pr-4 text-center">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getRateBadgeClasses(
                        row.fundingRate
                      )}`}
                    >
                      {row.fundingRate.toFixed(1)}%
                    </span>
                  </td>

                  {/* Avg Deal Size */}
                  <td className="py-3.5 pr-4 text-right">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(row.avgDealSize)}
                    </span>
                  </td>

                  {/* Time to Decision */}
                  <td className="py-3.5 pr-4 text-center">
                    <span className="text-sm text-foreground">
                      {row.avgTimeToDecision.toFixed(1)}
                      <span className="text-xs text-muted-foreground ml-1">days</span>
                    </span>
                  </td>

                  {/* Total Funded 30d */}
                  <td className="py-3.5 pr-4 text-right">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(row.totalFunded30d)}
                    </span>
                  </td>

                  {/* YoY Growth */}
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold ${
                        row.yoyGrowth >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {row.yoyGrowth >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {row.yoyGrowth >= 0 ? '+' : ''}
                      {row.yoyGrowth.toFixed(1)}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedRows.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products match the current filters.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductPerformanceDashboard;
