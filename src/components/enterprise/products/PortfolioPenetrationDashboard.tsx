// Portfolio Penetration Dashboard - View 2: Penetration rates, segment breakdown, and cross-sell funnel
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Info,
  Users,
  Layers,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { PortfolioKPITiles } from '../analytics/PortfolioKPITiles';
import { CrossSellFunnel } from '../analytics/CrossSellFunnel';
import {
  mockPenetrationKPIs,
  mockPenetrationByProduct,
  mockSegmentPenetration,
  mockProductCrossSellFunnel,
} from './mockData';
import type { ProductsFilters } from './types';

interface PortfolioPenetrationDashboardProps {
  filters: ProductsFilters;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

const getPenetrationColor = (rate: number): string => {
  if (rate >= 70) return 'bg-success';
  if (rate >= 50) return 'bg-info';
  if (rate >= 35) return 'bg-warning';
  return 'bg-destructive';
};

const getPenetrationTextColor = (rate: number): string => {
  if (rate >= 70) return 'text-success';
  if (rate >= 50) return 'text-info';
  if (rate >= 35) return 'text-warning';
  return 'text-destructive';
};

const getWalletShareColor = (share: number): string => {
  if (share >= 50) return 'bg-success';
  if (share >= 35) return 'bg-info';
  return 'bg-primary';
};

export const PortfolioPenetrationDashboard: React.FC<PortfolioPenetrationDashboardProps> = ({
  filters,
}) => {
  // Sort penetration data by penetration rate descending
  const sortedPenetration = useMemo(() => {
    let data = [...mockPenetrationByProduct];

    // Apply product family filter
    if (filters.productFamily !== 'All') {
      data = data.filter((p) => p.family === filters.productFamily);
    }

    return data.sort((a, b) => b.penetrationRate - a.penetrationRate);
  }, [filters.productFamily]);

  // Total revenue opportunity across all displayed products
  const totalRevenueOpportunity = useMemo(
    () => sortedPenetration.reduce((sum, p) => sum + p.revenueOpportunity, 0),
    [sortedPenetration],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Row */}
      <motion.div variants={itemVariants}>
        <PortfolioKPITiles kpis={mockPenetrationKPIs} />
      </motion.div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Penetration by Product Table (2/3 width) */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-2 bg-card rounded-2xl border border-border p-6"
        >
          {/* Table Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Penetration by Product</h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Product adoption rates sorted by penetration
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success">
                {formatCurrency(totalRevenueOpportunity)} opportunity
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Holding
                  </th>
                  <th className="py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Eligible
                  </th>
                  <th className="py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-4">
                    Penetration
                  </th>
                  <th className="py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Gap
                  </th>
                  <th className="py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Revenue Opp.
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPenetration.map((row, index) => (
                  <motion.tr
                    key={row.product}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    {/* Product Name + Family */}
                    <td className="py-4 pr-4">
                      <div>
                        <span className="font-semibold text-foreground text-sm">
                          {row.product}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {row.family}
                        </span>
                      </div>
                    </td>

                    {/* Customers Holding */}
                    <td className="py-4 text-right">
                      <span className="text-sm font-medium text-foreground">
                        {row.customersHolding.toLocaleString()}
                      </span>
                    </td>

                    {/* Eligible Customers */}
                    <td className="py-4 text-right">
                      <span className="text-sm text-muted-foreground">
                        {row.eligibleCustomers.toLocaleString()}
                      </span>
                    </td>

                    {/* Penetration Rate Bar */}
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${row.penetrationRate}%` }}
                            transition={{ delay: index * 0.04 + 0.2, duration: 0.5 }}
                            className={`h-full rounded-full ${getPenetrationColor(row.penetrationRate)}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-bold tabular-nums w-12 text-right ${getPenetrationTextColor(row.penetrationRate)}`}
                        >
                          {row.penetrationRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Cross-Sell Gap */}
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-warning/10 text-warning rounded-md text-xs font-semibold tabular-nums">
                        {row.crossSellGap.toFixed(1)}%
                      </span>
                    </td>

                    {/* Revenue Opportunity */}
                    <td className="py-4 text-right">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {formatCurrency(row.revenueOpportunity)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedPenetration.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products match the current filters.
            </div>
          )}
        </motion.div>

        {/* Right: Segment Breakdown Cards (1/3 width) */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Segment Breakdown</h3>
            <div className="relative group">
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Product penetration by customer segment
              </div>
            </div>
          </div>

          {/* Segment Cards */}
          {mockSegmentPenetration.map((segment, index) => (
            <motion.div
              key={segment.segment}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all"
            >
              {/* Segment Name + Customer Count */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{segment.segment}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {segment.totalCustomers.toLocaleString()} customers
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                  {segment.productsPerCustomer} prod/cust
                </span>
              </div>

              {/* Wallet Share Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Wallet Share</span>
                  <span className="text-sm font-bold text-foreground">
                    {segment.walletShare}%
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.walletShare}%` }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                    className={`h-full rounded-full ${getWalletShareColor(segment.walletShare)}`}
                  />
                </div>
              </div>

              {/* Mini stats row */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Products/Customer
                  </span>
                  <div className="text-lg font-bold text-foreground mt-0.5">
                    {segment.productsPerCustomer}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Total Customers
                  </span>
                  <div className="text-lg font-bold text-foreground mt-0.5">
                    {segment.totalCustomers.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Full-Width Cross-Sell Funnel */}
      <motion.div variants={itemVariants}>
        <CrossSellFunnel stages={mockProductCrossSellFunnel} />
      </motion.div>
    </motion.div>
  );
};

export default PortfolioPenetrationDashboard;
