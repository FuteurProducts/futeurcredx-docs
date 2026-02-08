// Eligibility & Policy Matrix - View 5: Full eligibility rules by product family
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Clock, DollarSign, TrendingUp, Landmark, FileText } from 'lucide-react';
import { mockEligibilityRules } from './mockData';
import type { ProductsFilters, ProductFamily, EligibilityRule } from './types';

interface EligibilityMatrixProps {
  filters: ProductsFilters;
}

const familyOrder: ProductFamily[] = [
  'Credit Cards',
  'Lines of Credit',
  'Term Loans',
  'SBA Programs',
  'Equipment Finance',
  'Commercial Auto',
  'Commercial Real Estate',
  'Deposits',
  'Treasury',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SIGNAL_COLORS: Record<string, string> = {
  'Cash Flow Stability': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Payment Behavior': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Revenue Growth': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Revenue Trend': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'DSCR': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Utilization Rate': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  'A/R Aging': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Leverage Ratio': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  'Identity Verified': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  'OFAC Clear': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  'SBA Eligibility': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  'Job Creation Plan': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  'Appraisal': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  'Environmental Review': 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300',
  'NOI': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  'Rent Roll': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  'Equipment Valuation': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  'Vehicle Valuation': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  'Operating Account Relationship': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  'Business Verification': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

const DEFAULT_SIGNAL_COLOR = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

function getSignalColor(signal: string): string {
  return SIGNAL_COLORS[signal] || DEFAULT_SIGNAL_COLOR;
}

function CellValue({ value }: { value: string }) {
  if (value === 'N/A') {
    return <span className="text-muted-foreground/50 text-xs italic">N/A</span>;
  }
  return <span className="text-foreground text-xs">{value}</span>;
}

function SignalBadge({ signal }: { signal: string }) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium leading-tight whitespace-nowrap ${getSignalColor(signal)}`}
    >
      {signal}
    </span>
  );
}

function FamilySectionRow({ family, colSpan }: { family: ProductFamily; colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-2.5 bg-muted/60 border-y border-border"
      >
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            {family}
          </span>
        </div>
      </td>
    </tr>
  );
}

const COLUMNS = [
  { key: 'product', label: 'Product', icon: FileText },
  { key: 'timeInBusiness', label: 'Time in Business', icon: Clock },
  { key: 'annualRevenue', label: 'Annual Revenue', icon: DollarSign },
  { key: 'dscr', label: 'DSCR', icon: TrendingUp },
  { key: 'paydex', label: 'PAYDEX', icon: null },
  { key: 'fico', label: 'FICO', icon: null },
  { key: 'maxLTV', label: 'Max LTV', icon: null },
  { key: 'collateral', label: 'Collateral', icon: ShieldCheck },
  { key: 'guarantor', label: 'Guarantor', icon: null },
  { key: 'requiredSignals', label: 'Required Signals', icon: null },
  { key: 'policyNotes', label: 'Policy Notes', icon: null },
] as const;

export const EligibilityMatrix: React.FC<EligibilityMatrixProps> = ({ filters }) => {
  const filteredRules = useMemo(() => {
    if (filters.productFamily === 'All') return mockEligibilityRules;
    return mockEligibilityRules.filter((r) => r.family === filters.productFamily);
  }, [filters.productFamily]);

  const groupedByFamily = useMemo(() => {
    const groups: { family: ProductFamily; rules: EligibilityRule[] }[] = [];
    const familySet = new Set<ProductFamily>();

    for (const rule of filteredRules) {
      familySet.add(rule.family);
    }

    for (const family of familyOrder) {
      if (!familySet.has(family)) continue;
      groups.push({
        family,
        rules: filteredRules.filter((r) => r.family === family),
      });
    }

    return groups;
  }, [filteredRules]);

  const totalColSpan = COLUMNS.length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Card wrapper */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Eligibility & Policy Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Minimum thresholds and required signals for each product
              </p>
            </div>
          </div>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute right-0 top-6 z-50 hidden group-hover:block w-72 p-3 bg-popover border border-border rounded-lg shadow-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This matrix shows the minimum eligibility criteria for each product.
                Businesses must meet all thresholds and have the required signals
                active to be pre-qualified. Policy notes indicate special conditions
                or approval workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse">
            <thead>
              <tr className="bg-muted/40">
                {COLUMNS.map((col, idx) => (
                  <th
                    key={col.key}
                    className={`
                      px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider
                      border-b border-border whitespace-nowrap
                      ${idx === 0 ? 'sticky left-0 z-20 bg-muted/40 min-w-[180px]' : ''}
                      ${col.key === 'requiredSignals' ? 'min-w-[200px]' : ''}
                      ${col.key === 'policyNotes' ? 'min-w-[220px]' : ''}
                    `}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.icon && <col.icon className="w-3 h-3" />}
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedByFamily.map(({ family, rules }) => (
                <React.Fragment key={family}>
                  {/* Family section header row */}
                  <FamilySectionRow family={family} colSpan={totalColSpan} />

                  {/* Product rows */}
                  {rules.map((rule, rowIdx) => (
                    <tr
                      key={rule.product}
                      className={`
                        border-b border-border/50 transition-colors hover:bg-muted/30
                        ${rowIdx % 2 === 1 ? 'bg-muted/10' : 'bg-card'}
                      `}
                    >
                      {/* Sticky product name column */}
                      <td
                        className={`
                          px-3 py-2.5 sticky left-0 z-10
                          ${rowIdx % 2 === 1 ? 'bg-muted/10' : 'bg-card'}
                          border-r border-border/30
                        `}
                      >
                        <span className="text-xs font-medium text-foreground whitespace-nowrap">
                          {rule.product}
                        </span>
                      </td>

                      {/* Time in Business */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.timeInBusiness} />
                      </td>

                      {/* Annual Revenue */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.annualRevenue} />
                      </td>

                      {/* DSCR */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.dscr} />
                      </td>

                      {/* PAYDEX */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.paydex} />
                      </td>

                      {/* FICO */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.fico} />
                      </td>

                      {/* Max LTV */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.maxLTV} />
                      </td>

                      {/* Collateral */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.collateral} />
                      </td>

                      {/* Guarantor */}
                      <td className="px-3 py-2.5">
                        <CellValue value={rule.guarantor} />
                      </td>

                      {/* Required Signals */}
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-[240px]">
                          {rule.requiredSignals.map((signal) => (
                            <SignalBadge key={signal} signal={signal} />
                          ))}
                        </div>
                      </td>

                      {/* Policy Notes */}
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {rule.policyNotes}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {filteredRules.length} product{filteredRules.length !== 1 ? 's' : ''} across{' '}
            {groupedByFamily.length} famil{groupedByFamily.length !== 1 ? 'ies' : 'y'}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            Source: Credit Policy &middot; Last reviewed Q4 2025
          </span>
        </div>
      </motion.div>

      {filteredRules.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12 text-muted-foreground">
          No eligibility rules match the current filters.
        </motion.div>
      )}
    </motion.div>
  );
};

export default EligibilityMatrix;
