// Underwriting Assistant — Case Management Workspace
// NO composite scores, NO auto-approve, NO AI confidence %
// Bank-safe language: recommendations, not decisions

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Building2,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Minus,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuditEmit } from '@/hooks/useAuditEmit';
import {
  CASE_STATUSES,
  SIGNAL_STATUSES,
  SIGNAL_DIRECTIONS,
  DISCLAIMER_TEXT,
  type CaseStatus,
  type SignalStatus,
  type SignalDirection,
} from '@/constants/bankTerminology';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';

// ============================================
// TYPES
// ============================================

type PolicyCheckResult = 'pass' | 'review' | 'fail';

interface PolicyCheck {
  id: string;
  name: string;
  result: PolicyCheckResult;
  value: string;
  threshold: string;
  source: string;
}

interface SignalSummary {
  name: string;
  status: SignalStatus;
  direction: SignalDirection;
  detail: string;
}

interface ComparativeBenchmark {
  label: string;
  applicantValue: string;
  portfolioPeerAvg: string;
  industryPeerAvg: string;
}

type RecommendationAction = 'recommend_approval' | 'request_info' | 'flag_committee' | 'recommend_decline';

interface CaseApplication {
  id: string;
  caseId: string;
  companyName: string;
  amount: number;
  productType: string;
  caseStatus: CaseStatus;
  assignedAnalyst: string;
  daysInQueue: number;
  slaTarget: number;
  pdBand: string;
  industry: string;
  naicsCode: string;
  established: string;
  yearsInBusiness: number;
  ownerName: string;
  ownership: number;
  address: string;
  tags?: string[];
  // Signal-based data
  signals: SignalSummary[];
  policyChecks: PolicyCheck[];
  benchmarks: ComparativeBenchmark[];
  // Decision support
  riskLevel: 'low' | 'moderate' | 'elevated';
  supportingFactors: string[];
  areasOfAttention: string[];
  suggestedNextSteps: string[];
}

// ============================================
// DEMO DATA — Bank-safe, signal-based
// ============================================

const CASES: CaseApplication[] = [
  {
    id: '1',
    caseId: 'CASE-2026-001',
    companyName: 'Stellar Dynamics LLC',
    amount: 250000,
    productType: 'Business Line of Credit',
    caseStatus: 'in_review',
    assignedAnalyst: 'J. Morrison',
    daysInQueue: 2,
    slaTarget: 5,
    pdBand: 'PD 1.2-2.0% (Investment Grade Equivalent)',
    industry: 'Technology Services',
    naicsCode: '541511',
    established: '2017',
    yearsInBusiness: 7,
    ownerName: 'James Morrison',
    ownership: 85,
    address: '1420 Innovation Way, Austin, TX 78701',
    signals: [
      { name: 'Payment Behavior', status: 'strong', direction: 'improving', detail: '98.2% on-time across 12 trade lines' },
      { name: 'Revenue Trajectory', status: 'stable', direction: 'improving', detail: '+8.3% QoQ from deposit activity' },
      { name: 'Debt Service Coverage', status: 'strong', direction: 'stable', detail: 'DSCR 1.8x vs 1.25x policy minimum' },
      { name: 'Cash Flow Consistency', status: 'strong', direction: 'improving', detail: 'CV 0.12, 18-month runway' },
      { name: 'Owner Credit Profile', status: 'weak', direction: 'worsening', detail: 'Guarantor FICO declined 15pts in 90d' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '7 years', threshold: '≥ 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$3.4M annual', threshold: '≥ $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'review', value: '742 (declining)', threshold: '≥ 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Technology Services', threshold: 'Not on exclusion list', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'pass', value: 'LTV 62%', threshold: '≤ 80% LTV', source: 'UCC + Appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: '1 active (current)', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'pass', value: '28%', threshold: '≤ 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: '0.0%', portfolioPeerAvg: '1.8%', industryPeerAvg: '2.1%' },
      { label: 'Avg Facility Utilization', applicantValue: '62%', portfolioPeerAvg: '58%', industryPeerAvg: '65%' },
      { label: 'Payment Timeliness', applicantValue: '98.2%', portfolioPeerAvg: '94.5%', industryPeerAvg: '92.8%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '+8.3%', portfolioPeerAvg: '+4.2%', industryPeerAvg: '+5.1%' },
    ],
    riskLevel: 'low',
    supportingFactors: [
      'Strong payment history exceeding portfolio median',
      'DSCR well above policy minimum with stable trajectory',
      'Consistent cash flow with low coefficient of variation',
      '7 years operating history in stable industry vertical',
    ],
    areasOfAttention: [
      'Owner/guarantor FICO has declined 15 points in 90 days — monitor for further deterioration',
      'Revenue concentration in single client vertical (technology)',
    ],
    suggestedNextSteps: [
      'Request updated personal financial statement from guarantor',
      'Verify revenue diversification across client base',
      'Proceed to credit committee with standard documentation package',
    ],
  },
  {
    id: '2',
    caseId: 'CASE-2026-002',
    companyName: 'GreenTech Innovations',
    amount: 150000,
    productType: 'Equipment Financing',
    caseStatus: 'pending_review',
    assignedAnalyst: 'Unassigned',
    daysInQueue: 4,
    slaTarget: 5,
    pdBand: 'PD 3.5-5.0% (Non-Investment Grade)',
    industry: 'Environmental Services',
    naicsCode: '541620',
    established: '2022',
    yearsInBusiness: 2,
    ownerName: 'Sarah Chen',
    ownership: 100,
    address: '890 Eco Boulevard, Portland, OR 97201',
    tags: ['SLA at risk', 'Unassigned'],
    signals: [
      { name: 'Payment Behavior', status: 'stable', direction: 'stable', detail: '85.2% on-time, limited history' },
      { name: 'Revenue Trajectory', status: 'stable', direction: 'improving', detail: 'Growing but limited track record' },
      { name: 'Debt Service Coverage', status: 'weak', direction: 'stable', detail: 'DSCR 1.1x — at policy minimum' },
      { name: 'Cash Flow Consistency', status: 'weak', direction: 'stable', detail: 'CV 0.35, 3.5-month runway' },
      { name: 'Owner Credit Profile', status: 'stable', direction: 'stable', detail: 'Guarantor FICO 680, stable' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '2 years', threshold: '≥ 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$820K annual', threshold: '≥ $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'pass', value: '680', threshold: '≥ 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Environmental', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'review', value: 'Equipment as collateral', threshold: '≤ 80% LTV', source: 'Pending appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: 'None', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'fail', value: '48%', threshold: '≤ 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: 'N/A (new)', portfolioPeerAvg: '3.2%', industryPeerAvg: '4.1%' },
      { label: 'Avg Facility Utilization', applicantValue: 'N/A', portfolioPeerAvg: '52%', industryPeerAvg: '58%' },
      { label: 'Payment Timeliness', applicantValue: '85.2%', portfolioPeerAvg: '91.0%', industryPeerAvg: '89.5%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '+15.2%', portfolioPeerAvg: '+6.8%', industryPeerAvg: '+7.5%' },
    ],
    riskLevel: 'elevated',
    supportingFactors: [
      'Strong revenue growth trajectory (+15.2% QoQ)',
      'Clean compliance screening',
      'Owner fully committed (100% ownership)',
    ],
    areasOfAttention: [
      'DTI ratio exceeds policy maximum (48% vs 43% threshold)',
      'Limited operating history — only 2 years',
      'Cash flow runway below comfortable threshold (3.5 months)',
      'DSCR at policy minimum with no cushion',
    ],
    suggestedNextSteps: [
      'Request DTI exception approval from senior credit officer',
      'Obtain equipment appraisal for collateral valuation',
      'Consider reduced facility size to improve coverage ratios',
    ],
  },
  {
    id: '3',
    caseId: 'CASE-2026-003',
    companyName: 'Metro Logistics Corp',
    amount: 500000,
    productType: 'Working Capital',
    caseStatus: 'conditional',
    assignedAnalyst: 'R. Patel',
    daysInQueue: 8,
    slaTarget: 10,
    pdBand: 'PD 0.5-1.2% (Prime)',
    industry: 'Transportation & Warehousing',
    naicsCode: '484110',
    established: '2009',
    yearsInBusiness: 15,
    ownerName: 'Michael Rodriguez',
    ownership: 75,
    address: '2500 Commerce Drive, Chicago, IL 60601',
    tags: ['Conditional'],
    signals: [
      { name: 'Payment Behavior', status: 'strong', direction: 'stable', detail: '99.8% on-time across 45 trade lines' },
      { name: 'Revenue Trajectory', status: 'strong', direction: 'improving', detail: '+12% YoY consistent growth' },
      { name: 'Debt Service Coverage', status: 'strong', direction: 'stable', detail: 'DSCR 2.4x — well above minimum' },
      { name: 'Cash Flow Consistency', status: 'strong', direction: 'stable', detail: 'CV 0.08, 12.5-month runway' },
      { name: 'Owner Credit Profile', status: 'strong', direction: 'stable', detail: 'Guarantor FICO 790, stable 12mo' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '15 years', threshold: '≥ 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$8.2M annual', threshold: '≥ $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'pass', value: '790', threshold: '≥ 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Transportation', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'pass', value: 'Fleet $1.2M, LTV 45%', threshold: '≤ 80% LTV', source: 'Equipment Appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: '2 active (current)', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'pass', value: '22%', threshold: '≤ 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: '0.0%', portfolioPeerAvg: '1.5%', industryPeerAvg: '2.3%' },
      { label: 'Avg Facility Utilization', applicantValue: '45%', portfolioPeerAvg: '55%', industryPeerAvg: '61%' },
      { label: 'Payment Timeliness', applicantValue: '99.8%', portfolioPeerAvg: '95.2%', industryPeerAvg: '93.1%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '+3.0%', portfolioPeerAvg: '+2.8%', industryPeerAvg: '+1.9%' },
    ],
    riskLevel: 'low',
    supportingFactors: [
      'Exceptional payment history — top decile of portfolio',
      'DSCR 2.4x provides significant debt service cushion',
      'Strong fleet collateral with conservative LTV',
      '15-year operating history with consistent profitability',
      'Owner FICO 790 — excellent personal credit standing',
    ],
    areasOfAttention: [
      'Conditional on updated fleet appraisal (pending)',
      'Fuel cost exposure in current macro environment',
    ],
    suggestedNextSteps: [
      'Obtain updated fleet appraisal to clear conditional status',
      'Present to credit committee for final approval',
    ],
  },
  {
    id: '4',
    caseId: 'CASE-2026-004',
    companyName: 'QuickServe Restaurants',
    amount: 75000,
    productType: 'Business Term Loan',
    caseStatus: 'declined',
    assignedAnalyst: 'K. Williams',
    daysInQueue: 6,
    slaTarget: 5,
    pdBand: 'PD 8.0-12.0% (Substandard)',
    industry: 'Food Services',
    naicsCode: '722511',
    established: '2019',
    yearsInBusiness: 5,
    ownerName: 'David Thompson',
    ownership: 60,
    address: '456 Main Street, Denver, CO 80202',
    tags: ['Multiple policy failures'],
    signals: [
      { name: 'Payment Behavior', status: 'weak', direction: 'worsening', detail: '72.5% on-time, 90-day delinquency noted' },
      { name: 'Revenue Trajectory', status: 'weak', direction: 'worsening', detail: '-12% QoQ decline in deposit activity' },
      { name: 'Debt Service Coverage', status: 'weak', direction: 'worsening', detail: 'DSCR 0.85x — below breakeven' },
      { name: 'Cash Flow Consistency', status: 'weak', direction: 'worsening', detail: 'CV 0.52, 1.2-month runway' },
      { name: 'Owner Credit Profile', status: 'weak', direction: 'worsening', detail: 'Guarantor FICO 580, lien detected' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '5 years', threshold: '≥ 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$480K annual', threshold: '≥ $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'fail', value: '580', threshold: '≥ 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Food Services', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'fail', value: 'No collateral offered', threshold: '≤ 80% LTV', source: 'N/A' },
      { id: 'p6', name: 'UCC Filing Status', result: 'review', value: 'Tax lien detected', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'fail', value: '62%', threshold: '≤ 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: 'N/A (est. >8%)', portfolioPeerAvg: '2.8%', industryPeerAvg: '4.5%' },
      { label: 'Avg Facility Utilization', applicantValue: 'N/A', portfolioPeerAvg: '48%', industryPeerAvg: '55%' },
      { label: 'Payment Timeliness', applicantValue: '72.5%', portfolioPeerAvg: '90.2%', industryPeerAvg: '87.5%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '-12.0%', portfolioPeerAvg: '+3.5%', industryPeerAvg: '+2.1%' },
    ],
    riskLevel: 'elevated',
    supportingFactors: [
      '5 years operating history in known industry',
      'Clean OFAC/BSA screening',
    ],
    areasOfAttention: [
      'Owner FICO 580 — below policy minimum of 680',
      'DSCR below breakeven at 0.85x',
      'Active tax lien on record',
      'DTI ratio 62% — significantly exceeds 43% maximum',
      'Cash flow runway critically low at 1.2 months',
      '90-day payment delinquency in trade data',
    ],
    suggestedNextSteps: [
      'Decline recommendation documented — multiple policy threshold failures',
      'Provide applicant with adverse action notice per Reg B requirements',
      'Suggest alternative: smaller facility with personal collateral pledge',
    ],
  },
  {
    id: '5',
    caseId: 'CASE-2026-005',
    companyName: 'Apex Construction Group',
    amount: 350000,
    productType: 'Equipment Financing',
    caseStatus: 'in_review',
    assignedAnalyst: 'J. Morrison',
    daysInQueue: 1,
    slaTarget: 5,
    pdBand: 'PD 2.0-3.5% (Near-Investment Grade)',
    industry: 'Construction',
    naicsCode: '236220',
    established: '2014',
    yearsInBusiness: 10,
    ownerName: 'Robert Williams',
    ownership: 90,
    address: '780 Industrial Parkway, Phoenix, AZ 85004',
    tags: ['Seasonal revenue'],
    signals: [
      { name: 'Payment Behavior', status: 'strong', direction: 'stable', detail: '96.2% on-time across 32 trade lines' },
      { name: 'Revenue Trajectory', status: 'stable', direction: 'stable', detail: 'Seasonal pattern — consistent with prior years' },
      { name: 'Debt Service Coverage', status: 'stable', direction: 'stable', detail: 'DSCR 1.45x — adequate with seasonal adjustment' },
      { name: 'Cash Flow Consistency', status: 'stable', direction: 'stable', detail: 'CV 0.28, 5.8-month runway' },
      { name: 'Owner Credit Profile', status: 'strong', direction: 'stable', detail: 'Guarantor FICO 720, stable 12mo' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '10 years', threshold: '≥ 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$5.1M annual', threshold: '≥ $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'pass', value: '720', threshold: '≥ 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Construction', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'pass', value: 'Equipment collateral', threshold: '≤ 80% LTV', source: 'Equipment Appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: '1 active (current)', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'pass', value: '31%', threshold: '≤ 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: '0.0%', portfolioPeerAvg: '2.1%', industryPeerAvg: '3.2%' },
      { label: 'Avg Facility Utilization', applicantValue: '55%', portfolioPeerAvg: '58%', industryPeerAvg: '62%' },
      { label: 'Payment Timeliness', applicantValue: '96.2%', portfolioPeerAvg: '93.8%', industryPeerAvg: '91.5%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '-2.0% (seasonal)', portfolioPeerAvg: '+1.5%', industryPeerAvg: '+0.8%' },
    ],
    riskLevel: 'moderate',
    supportingFactors: [
      'Strong payment history — above portfolio median',
      '10-year operating history with predictable seasonal patterns',
      'All policy checks passed',
      'Equipment collateral provides adequate coverage',
    ],
    areasOfAttention: [
      'Seasonal revenue pattern requires adjusted cash flow analysis',
      'Construction industry cyclicality in current macro environment',
    ],
    suggestedNextSteps: [
      'Complete seasonal cash flow adjustment analysis',
      'Verify equipment specifications match financing request',
      'Present to credit committee with standard package',
    ],
  },
];

const QUEUE_STATS = [
  { label: 'Pending Review', value: 23, color: 'text-slate-600' },
  { label: 'In Review', value: 15, color: 'text-blue-600' },
  { label: 'Conditional', value: 8, color: 'text-amber-600' },
  { label: 'Approved (MTD)', value: 47, color: 'text-emerald-600' },
  { label: 'Declined (MTD)', value: 12, color: 'text-red-600' },
  { label: 'Avg Days to Decision', value: '3.8', color: 'text-muted-foreground' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

const CaseStatusStepper: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const steps: CaseStatus[] = ['pending_review', 'in_review', 'conditional', 'approved'];
  const currentStep = CASE_STATUSES[status].step;
  const isDeclined = status === 'declined';

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const cfg = CASE_STATUSES[step];
        const isActive = !isDeclined && currentStep >= cfg.step;
        const isCurrent = !isDeclined && currentStep === cfg.step;
        return (
          <React.Fragment key={step}>
            {idx > 0 && (
              <div className={cn('h-0.5 w-6', isActive ? 'bg-primary' : 'bg-border')} />
            )}
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                isCurrent ? cfg.bg : isActive ? 'bg-muted border-border text-muted-foreground' : 'bg-transparent border-border text-muted-foreground',
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', isCurrent ? 'bg-current' : isActive ? 'bg-muted-foreground' : 'bg-border')} />
              {cfg.label}
            </div>
          </React.Fragment>
        );
      })}
      {isDeclined && (
        <>
          <div className="h-0.5 w-6 bg-red-300" />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-red-50 border-red-200 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Declined
          </div>
        </>
      )}
    </div>
  );
};

const SignalRow: React.FC<{ signal: SignalSummary }> = ({ signal }) => {
  const sCfg = SIGNAL_STATUSES[signal.status];
  const dCfg = SIGNAL_DIRECTIONS[signal.direction];
  const DirIcon = signal.direction === 'improving' ? TrendingUp : signal.direction === 'worsening' ? TrendingDown : Minus;

  return (
    <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg border', sCfg.bg)}>
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm font-medium', sCfg.color)}>{signal.name}</span>
        <p className="text-xs text-foreground/70 truncate">{signal.detail}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', sCfg.bg, sCfg.color)}>
          {SIGNAL_STATUSES[signal.status].label}
        </span>
        <DirIcon className={cn('h-3.5 w-3.5', dCfg.color)} />
      </div>
    </div>
  );
};

const PolicyCheckRow: React.FC<{ check: PolicyCheck; isExpanded: boolean; onToggle: () => void }> = ({
  check,
  isExpanded,
  onToggle,
}) => {
  const resultCfg = {
    pass: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Pass' },
    review: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Review' },
    fail: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Fail' },
  }[check.result];
  const Icon = resultCfg.icon;

  return (
    <div>
      <button onClick={onToggle} className="w-full grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left">
        <div className="col-span-4 flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <span className="text-sm text-foreground">{check.name}</span>
        </div>
        <div className="col-span-2">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', resultCfg.bg, resultCfg.color)}>
            <Icon className="h-3 w-3" />
            {resultCfg.label}
          </span>
        </div>
        <div className="col-span-2 text-xs text-foreground">{check.value}</div>
        <div className="col-span-2 text-xs text-muted-foreground">{check.threshold}</div>
        <div className="col-span-2 text-xs text-muted-foreground">{check.source}</div>
      </button>
      {isExpanded && (
        <div className="ml-7 mr-3 mb-2 px-3 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <span className="font-medium">Value:</span> {check.value} | <span className="font-medium">Threshold:</span> {check.threshold} | <span className="font-medium">Source:</span> {check.source}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const UnderwritingAssistant: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseApplication>(CASES[0]);
  const [activeTab, setActiveTab] = useState<'signals' | 'policy' | 'benchmarks' | 'decision'>('signals');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [rationale, setRationale] = useState('');
  const { toast } = useToast();
  const { emitBulkActionExecuted } = useAuditEmit();

  const policyPassCount = useMemo(
    () => selectedCase.policyChecks.filter((c) => c.result === 'pass').length,
    [selectedCase],
  );
  const policyTotal = selectedCase.policyChecks.length;

  const handleAction = (action: RecommendationAction) => {
    if (!rationale.trim()) return;
    const labels: Record<RecommendationAction, string> = {
      recommend_approval: 'Recommended for Approval',
      request_info: 'Additional Information Requested',
      flag_committee: 'Flagged for Committee Review',
      recommend_decline: 'Decline Recommended',
    };
    toast({ title: labels[action], description: `${selectedCase.companyName} — ${selectedCase.caseId}` });
    emitBulkActionExecuted(action, [selectedCase.caseId]);
    setRationale('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Disclaimer */}
      <div className="px-4 lg:px-6 pt-4">
        <BankDisclaimer />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Underwriting Assistant</h1>
            <p className="text-sm text-muted-foreground">Case management and decision support workspace</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Showing 5 of 89 applications
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-6 gap-3 lg:grid-cols-3 md:grid-cols-2">
          {QUEUE_STATS.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border text-center">
              <div className={cn('text-xl font-bold', stat.color)}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Case Queue — Left */}
          <div className="w-full lg:w-[320px] lg:shrink-0 bg-card rounded-xl border border-border mb-6 lg:mb-0">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Case Queue</h2>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{CASES.length} cases loaded</p>
            </div>
            <div className="p-2 space-y-1.5">
              {CASES.map((c) => {
                const isSelected = selectedCase.id === c.id;
                const statusCfg = CASE_STATUSES[c.caseStatus];
                return (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCase(c); setActiveTab('signals'); }}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all',
                      isSelected ? 'bg-primary/5 border-2 border-primary' : 'hover:bg-muted border border-transparent',
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground font-mono">{c.caseId}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', statusCfg.bg, statusCfg.color)}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{c.companyName}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{c.productType}</span>
                      <span className="text-xs text-muted-foreground">${(c.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <User className="h-2.5 w-2.5" />
                        {c.assignedAnalyst}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {c.daysInQueue}d
                      </div>
                    </div>
                    {c.tags && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.tags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Case Detail — Right */}
          <div className="flex-1 space-y-4">
            {/* Case Header */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-semibold text-foreground">{selectedCase.companyName}</h3>
                    <span className="text-xs text-muted-foreground font-mono">{selectedCase.caseId}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCase.productType} &middot; ${selectedCase.amount.toLocaleString()} &middot; {selectedCase.industry}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedCase.pdBand}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {selectedCase.assignedAnalyst}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedCase.daysInQueue}d / {selectedCase.slaTarget}d SLA
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="mb-4">
                <CaseStatusStepper status={selectedCase.caseStatus} />
              </div>

              {/* Tabs */}
              <div className="flex gap-0.5 p-0.5 bg-muted rounded-lg w-fit">
                {[
                  { id: 'signals', label: 'Signals' },
                  { id: 'policy', label: `Policy Checks (${policyPassCount}/${policyTotal})` },
                  { id: 'benchmarks', label: 'Benchmarks' },
                  { id: 'decision', label: 'Decision Support' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signals Tab */}
            {activeTab === 'signals' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Risk Indicator Signals</h3>
                    <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={['D&B', 'Experian', 'Banking Feed']} />
                  </div>
                  <div className="space-y-2">
                    {selectedCase.signals.map((signal) => (
                      <SignalRow key={signal.name} signal={signal} />
                    ))}
                  </div>
                </div>

                {/* Business Profile Summary */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Applicant Profile</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {[
                      { label: 'Industry', value: `${selectedCase.industry} (${selectedCase.naicsCode})` },
                      { label: 'Established', value: `${selectedCase.established} (${selectedCase.yearsInBusiness} years)` },
                      { label: 'Owner', value: `${selectedCase.ownerName} (${selectedCase.ownership}%)` },
                      { label: 'Location', value: selectedCase.address },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-medium text-foreground text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Policy Checks Tab */}
            {activeTab === 'policy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-card rounded-xl border border-border">
                  <div className="flex items-center justify-between p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Policy & Eligibility Checks</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="text-emerald-600">{selectedCase.policyChecks.filter((c) => c.result === 'pass').length} Pass</span>
                      <span className="text-amber-600">{selectedCase.policyChecks.filter((c) => c.result === 'review').length} Review</span>
                      <span className="text-red-600">{selectedCase.policyChecks.filter((c) => c.result === 'fail').length} Fail</span>
                    </div>
                  </div>
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-3 px-8 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                    <div className="col-span-4">Check</div>
                    <div className="col-span-2">Result</div>
                    <div className="col-span-2">Value</div>
                    <div className="col-span-2">Threshold</div>
                    <div className="col-span-2">Source</div>
                  </div>
                  <div className="p-3">
                    {selectedCase.policyChecks.map((check) => (
                      <PolicyCheckRow
                        key={check.id}
                        check={check}
                        isExpanded={expandedCheck === check.id}
                        onToggle={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benchmarks Tab */}
            {activeTab === 'benchmarks' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Comparative Benchmarks</h3>
                    <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={['Portfolio Analytics', 'Industry Benchmarks']} />
                  </div>
                  {/* Table header */}
                  <div className="grid grid-cols-4 gap-4 px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                    <div>Metric</div>
                    <div>This Applicant</div>
                    <div>Portfolio Peers</div>
                    <div>Industry Peers</div>
                  </div>
                  <div className="divide-y divide-border">
                    {selectedCase.benchmarks.map((bm) => (
                      <div key={bm.label} className="grid grid-cols-4 gap-4 px-3 py-3 items-center">
                        <div className="text-sm text-foreground">{bm.label}</div>
                        <div className="text-sm font-semibold text-foreground">{bm.applicantValue}</div>
                        <div className="text-sm text-muted-foreground">{bm.portfolioPeerAvg}</div>
                        <div className="text-sm text-muted-foreground">{bm.industryPeerAvg}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-muted-foreground">
                    Peer comparisons based on same segment, product type, and SIC code within portfolio and industry databases.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Decision Support Tab */}
            {activeTab === 'decision' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Decision Support Summary */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Decision Support Summary</h3>

                  {/* Risk Level */}
                  <div className="mb-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
                        selectedCase.riskLevel === 'low'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : selectedCase.riskLevel === 'moderate'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-red-50 border-red-200 text-red-700',
                      )}
                    >
                      {selectedCase.riskLevel === 'low' ? 'Low' : selectedCase.riskLevel === 'moderate' ? 'Moderate' : 'Elevated'} Risk Indicators
                    </span>
                  </div>

                  {/* Supporting Factors */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-emerald-700 mb-2">Key Supporting Factors</h4>
                    <ul className="space-y-1.5">
                      {selectedCase.supportingFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas of Attention */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-amber-700 mb-2">Areas Requiring Attention</h4>
                    <ul className="space-y-1.5">
                      {selectedCase.areasOfAttention.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Next Steps */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-blue-700 mb-2">Suggested Next Steps</h4>
                    <ol className="space-y-1.5 list-decimal list-inside">
                      {selectedCase.suggestedNextSteps.map((s, i) => (
                        <li key={i} className="text-xs text-foreground">{s}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Decision disclaimer */}
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-[10px] text-muted-foreground italic">
                      {DISCLAIMER_TEXT} This summary is for informational purposes only and does not constitute a lending decision.
                    </p>
                  </div>
                </div>

                {/* Analyst Action Panel */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Analyst Recommendation</h3>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Enter rationale for recommendation (required)..."
                    className="w-full h-24 px-3 py-2 text-sm bg-muted rounded-lg border border-border resize-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      onClick={() => handleAction('recommend_approval')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Recommend for Approval
                    </button>
                    <button
                      onClick={() => handleAction('request_info')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Request Additional Info
                    </button>
                    <button
                      onClick={() => handleAction('flag_committee')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Flag for Committee Review
                    </button>
                    <button
                      onClick={() => handleAction('recommend_decline')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Recommend Decline
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    All actions are logged to the audit trail. Rationale is required for every recommendation.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Data Lineage Footer */}
        <DataLineageFooter
          meta={{
            lastUpdated: '2026-01-28T10:00:00Z',
            dataSources: ['D&B Commercial', 'Experian BizID', 'Banking Data Feed', 'UCC Filing Search', 'Compliance Engine'],
          }}
        />
      </div>
    </div>
  );
};

export default UnderwritingAssistant;
