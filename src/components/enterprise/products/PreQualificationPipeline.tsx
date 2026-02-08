// Pre-Qualification Pipeline - View 3: Readiness assessment and top candidates
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  Building2,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { PortfolioKPITiles } from '../analytics/PortfolioKPITiles';
import {
  mockPreQualKPIs,
  mockPreQualReadiness,
  mockPreQualCandidates,
} from './mockData';
import type { ProductsFilters } from './types';

interface PreQualificationPipelineProps {
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

/**
 * Format a number as compact currency:
 *   >= 1 000 000 -> $X.XM
 *   >= 1 000     -> $XXXK
 *   otherwise    -> $XXX
 */
const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
};

/**
 * Return a Tailwind text / bg class pair for readiness scores.
 */
const readinessColor = (score: number) => {
  if (score >= 75) return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' };
  if (score >= 60) return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' };
  return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' };
};

// ---------------------------------------------------------------------------
// Readiness Stacked Bars
// ---------------------------------------------------------------------------

interface ReadinessBarsProps {
  data: typeof mockPreQualReadiness;
}

const ReadinessBars: React.FC<ReadinessBarsProps> = ({ data }) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Readiness by Product</h3>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          Likely
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400" />
          Borderline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-400" />
          Unlikely
        </span>
      </div>

      <div className="space-y-4">
        {data.map((row) => {
          const likelyPct = (row.likely / row.total) * 100;
          const borderlinePct = (row.borderline / row.total) * 100;
          const unlikelyPct = (row.unlikely / row.total) * 100;

          return (
            <div key={row.product}>
              {/* Label row */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground truncate max-w-[60%]">
                  {row.product}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {row.total.toLocaleString()} total
                </span>
              </div>

              {/* Stacked bar */}
              <div className="flex h-6 w-full rounded-md overflow-hidden bg-muted/40">
                {/* Likely */}
                <div
                  className="bg-emerald-500 flex items-center justify-center transition-all"
                  style={{ width: `${likelyPct}%` }}
                >
                  {likelyPct >= 12 && (
                    <span className="text-[10px] font-semibold text-white leading-none">
                      {likelyPct.toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Borderline */}
                <div
                  className="bg-amber-400 flex items-center justify-center transition-all"
                  style={{ width: `${borderlinePct}%` }}
                >
                  {borderlinePct >= 12 && (
                    <span className="text-[10px] font-semibold text-white leading-none">
                      {borderlinePct.toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Unlikely */}
                <div
                  className="bg-red-400 flex items-center justify-center transition-all"
                  style={{ width: `${unlikelyPct}%` }}
                >
                  {unlikelyPct >= 12 && (
                    <span className="text-[10px] font-semibold text-white leading-none">
                      {unlikelyPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Counts row */}
              <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground tabular-nums">
                <span className="text-emerald-600 dark:text-emerald-400">{row.likely}</span>
                <span className="text-amber-600 dark:text-amber-400">{row.borderline}</span>
                <span className="text-red-600 dark:text-red-400">{row.unlikely}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Top Candidates Table
// ---------------------------------------------------------------------------

interface CandidatesTableProps {
  candidates: typeof mockPreQualCandidates;
  products: string[];
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({ candidates, products }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('All');

  const filtered = useMemo(() => {
    if (selectedProduct === 'All') return candidates;
    return candidates.filter((c) => c.topProduct === selectedProduct);
  }, [candidates, selectedProduct]);

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Top Candidates</h3>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="text-xs bg-muted/50 border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="All">All Products</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2.5 pr-4 font-medium text-muted-foreground whitespace-nowrap">Business Name</th>
              <th className="pb-2.5 pr-4 font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">Industry</th>
              <th className="pb-2.5 pr-4 font-medium text-muted-foreground whitespace-nowrap">Revenue</th>
              <th className="pb-2.5 pr-4 font-medium text-muted-foreground whitespace-nowrap">Readiness</th>
              <th className="pb-2.5 pr-4 font-medium text-muted-foreground whitespace-nowrap hidden md:table-cell">Top Product</th>
              <th className="pb-2.5 font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">Key Signals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((candidate) => {
              const color = readinessColor(candidate.readinessScore);
              return (
                <tr
                  key={candidate.businessName}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Business Name */}
                  <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">
                    {candidate.businessName}
                  </td>

                  {/* Industry */}
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                    {candidate.industry}
                  </td>

                  {/* Revenue */}
                  <td className="py-3 pr-4 text-foreground tabular-nums whitespace-nowrap">
                    {formatCompactCurrency(candidate.annualRevenue)}
                  </td>

                  {/* Readiness Score Badge */}
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${color.bg} ${color.text}`}
                    >
                      {candidate.readinessScore}
                      <span className="font-normal opacity-80">{candidate.readiness}</span>
                    </span>
                  </td>

                  {/* Top Product */}
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap hidden md:table-cell">
                    {candidate.topProduct}
                  </td>

                  {/* Signals */}
                  <td className="py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {candidate.signals.map((signal) => (
                        <span
                          key={signal}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium whitespace-nowrap"
                        >
                          <Sparkles className="w-2.5 h-2.5 opacity-50" />
                          {signal}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No candidates match the selected product filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const PreQualificationPipeline: React.FC<PreQualificationPipelineProps> = ({ filters: _filters }) => {
  // Derive unique product names for the selector
  const uniqueProducts = useMemo(
    () => Array.from(new Set(mockPreQualCandidates.map((c) => c.topProduct))).sort(),
    [],
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
        <PortfolioKPITiles kpis={mockPreQualKPIs} />
      </motion.div>

      {/* Two-column layout: Readiness bars + Candidates table */}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <motion.div variants={itemVariants}>
          <ReadinessBars data={mockPreQualReadiness} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CandidatesTable
            candidates={mockPreQualCandidates}
            products={uniqueProducts}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PreQualificationPipeline;
