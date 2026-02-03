import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import { toast } from '@/components/dashboard/ui/sonner';
import { Button } from '@/components/ui/button';

// ============================================
// COUNT UP ANIMATION HOOK
// ============================================

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// ============================================
// ICON COMPONENT
// ============================================

const Icon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-5 h-5" }) => {
  const iconPaths: Record<string, React.ReactNode> = {
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    brain: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    building: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    creditCard: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    fingerprint: <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    trendUp: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    trendDown: <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />,
  };
  
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      {iconPaths[type] || iconPaths.document}
    </svg>
  );
};

// ============================================
// MOCK DATA
// ============================================

interface Application {
  id: string;
  appId: string;
  companyName: string;
  amount: number;
  confidence: number;
  status: 'approve' | 'review' | 'decline';
  productType: string;
  tags?: string[];
  ownerFico: number;
  bankingHealth: number;
  kybStatus: 'Pass' | 'Fail' | 'Pending';
  identityMatch: number;
  compositeScore: number;
  grade: string;
  positiveDrivers: string[];
  riskDrivers: string[];
  summary: string;
  // Business Info
  dba?: string;
  ein: string;
  industry: string;
  naicsCode: string;
  established: string;
  yearsInBusiness: number;
  // Contact Info
  address: string;
  phone: string;
  email: string;
  website: string;
  // Owner Info
  ownerName: string;
  ownership: number;
  identityVerified: boolean;
  // Credit Data
  subscores: {
    tradelines: number;
    payments: number;
    bankingHealth: number;
    identityMatch: number;
  };
  banking: {
    avg30dBalance: number;
    avg90dBalance: number;
    nsf90d: number;
    achReturns90d: number;
    depositConsistency: 'Stable' | 'Moderate' | 'Volatile';
    cashRunway: number;
  };
  tradelines: {
    vendorsReporting: number;
    oldestTradeline: string;
    onTimePayment: number;
    dbtAverage: number;
  };
  publicRecords: {
    uccFilings: number;
    liens: boolean;
    judgments: boolean;
    bankruptcies: boolean;
  };
  kyb: {
    registry: 'Verified' | 'Pending' | 'Failed';
    ein: boolean;
    addressStability: 'High' | 'Medium' | 'Low';
  };
  // Rule Triggers
  ruleTriggers: {
    id: number;
    name: string;
    description: string;
    status: 'passed' | 'failed' | 'warning';
    category: 'credit' | 'identity' | 'banking' | 'compliance';
  }[];
}

const applications: Application[] = [
  {
    id: '1',
    appId: 'APP-2024-001',
    companyName: 'Stellar Dynamics LLC',
    amount: 250000,
    confidence: 92,
    status: 'approve',
    productType: 'Business Line of Credit',
    ownerFico: 758,
    bankingHealth: 85,
    kybStatus: 'Pass',
    identityMatch: 98,
    compositeScore: 728,
    grade: 'B+',
    positiveDrivers: [
      'Stable deposit pattern over 90 days',
      '98.5% on-time payment history',
      'Strong owner FICO score (758)',
      '7 years business history',
      'Low DBT average (12 days)',
    ],
    riskDrivers: [],
    summary: 'Strong creditworthiness with consistent payment history and healthy financials. Low-risk profile suitable for standard approval.',
    // Extended data
    dba: 'Stellar Tech',
    ein: '82-1234567',
    industry: 'Technology Services',
    naicsCode: '541512',
    established: '2017',
    yearsInBusiness: 7,
    address: '1420 Innovation Way, Austin, TX 78701',
    phone: '(512) 555-0142',
    email: 'contact@stellardynamics.com',
    website: 'www.stellardynamics.com',
    ownerName: 'James Morrison',
    ownership: 85,
    identityVerified: true,
    subscores: { tradelines: 82, payments: 91, bankingHealth: 85, identityMatch: 98 },
    banking: { avg30dBalance: 127500, avg90dBalance: 142300, nsf90d: 0, achReturns90d: 0, depositConsistency: 'Stable', cashRunway: 8.2 },
    tradelines: { vendorsReporting: 23, oldestTradeline: '5 years 3 months', onTimePayment: 98.5, dbtAverage: 12 },
    publicRecords: { uccFilings: 1, liens: false, judgments: false, bankruptcies: false },
    kyb: { registry: 'Verified', ein: true, addressStability: 'High' },
    ruleTriggers: [
      { id: 1, name: 'Minimum Credit Score', description: 'Score 728 exceeds minimum 650', status: 'passed', category: 'credit' },
      { id: 2, name: 'Time in Business', description: '7 years exceeds 2 year minimum', status: 'passed', category: 'compliance' },
      { id: 3, name: 'Debt Service Coverage', description: 'DSCR 1.8x exceeds 1.25x threshold', status: 'passed', category: 'banking' },
      { id: 4, name: 'Payment History', description: '98.5% on-time payments', status: 'passed', category: 'credit' },
    ],
  },
  {
    id: '2',
    appId: 'APP-2024-002',
    companyName: 'GreenTech Innovations',
    amount: 150000,
    confidence: 67,
    status: 'review',
    productType: 'Equipment Financing',
    tags: ['High utilization', 'Recent inquiry'],
    ownerFico: 680,
    bankingHealth: 72,
    kybStatus: 'Pass',
    identityMatch: 95,
    compositeScore: 645,
    grade: 'C+',
    positiveDrivers: [
      'Growing revenue trend',
      'Verified business identity',
    ],
    riskDrivers: [
      'High credit utilization (78%)',
      'Recent credit inquiry (30 days)',
      'Short business history (2 years)',
    ],
    summary: 'Moderate risk profile with some concerning factors. Manual review recommended to assess recent credit activity.',
    dba: 'GreenTech',
    ein: '47-9876543',
    industry: 'Environmental Services',
    naicsCode: '541620',
    established: '2022',
    yearsInBusiness: 2,
    address: '890 Eco Boulevard, Portland, OR 97201',
    phone: '(503) 555-0198',
    email: 'info@greentechinnovations.com',
    website: 'www.greentechinnovations.com',
    ownerName: 'Sarah Chen',
    ownership: 100,
    identityVerified: true,
    subscores: { tradelines: 65, payments: 72, bankingHealth: 72, identityMatch: 95 },
    banking: { avg30dBalance: 45000, avg90dBalance: 52000, nsf90d: 1, achReturns90d: 0, depositConsistency: 'Moderate', cashRunway: 3.5 },
    tradelines: { vendorsReporting: 8, oldestTradeline: '1 year 8 months', onTimePayment: 85.2, dbtAverage: 28 },
    publicRecords: { uccFilings: 0, liens: false, judgments: false, bankruptcies: false },
    kyb: { registry: 'Verified', ein: true, addressStability: 'Medium' },
    ruleTriggers: [
      { id: 1, name: 'Minimum Credit Score', description: 'Score 645 below minimum 650', status: 'warning', category: 'credit' },
      { id: 2, name: 'Time in Business', description: '2 years meets 2 year minimum', status: 'passed', category: 'compliance' },
      { id: 3, name: 'Credit Utilization', description: '78% exceeds 50% threshold', status: 'failed', category: 'credit' },
      { id: 4, name: 'Recent Inquiries', description: '3 inquiries in 30 days', status: 'warning', category: 'credit' },
    ],
  },
  {
    id: '3',
    appId: 'APP-2024-003',
    companyName: 'Metro Logistics Corp',
    amount: 500000,
    confidence: 95,
    status: 'approve',
    productType: 'Working Capital',
    ownerFico: 790,
    bankingHealth: 92,
    kybStatus: 'Pass',
    identityMatch: 99,
    compositeScore: 785,
    grade: 'A',
    positiveDrivers: [
      'Excellent owner credit (790)',
      'Strong cash reserves',
      '15 years in business',
      'Consistent revenue growth',
      'No derogatory marks',
    ],
    riskDrivers: [],
    summary: 'Excellent credit profile with strong financials across all metrics. Recommended for immediate approval.',
    dba: 'Metro Logistics',
    ein: '36-5432109',
    industry: 'Transportation & Warehousing',
    naicsCode: '484110',
    established: '2009',
    yearsInBusiness: 15,
    address: '2500 Commerce Drive, Chicago, IL 60601',
    phone: '(312) 555-0234',
    email: 'business@metrologistics.com',
    website: 'www.metrologistics.com',
    ownerName: 'Michael Rodriguez',
    ownership: 75,
    identityVerified: true,
    subscores: { tradelines: 95, payments: 98, bankingHealth: 92, identityMatch: 99 },
    banking: { avg30dBalance: 485000, avg90dBalance: 520000, nsf90d: 0, achReturns90d: 0, depositConsistency: 'Stable', cashRunway: 12.5 },
    tradelines: { vendorsReporting: 45, oldestTradeline: '12 years 7 months', onTimePayment: 99.8, dbtAverage: 5 },
    publicRecords: { uccFilings: 2, liens: false, judgments: false, bankruptcies: false },
    kyb: { registry: 'Verified', ein: true, addressStability: 'High' },
    ruleTriggers: [
      { id: 1, name: 'Minimum Credit Score', description: 'Score 785 exceeds minimum 650', status: 'passed', category: 'credit' },
      { id: 2, name: 'Time in Business', description: '15 years exceeds 2 year minimum', status: 'passed', category: 'compliance' },
      { id: 3, name: 'Debt Service Coverage', description: 'DSCR 2.4x exceeds 1.25x threshold', status: 'passed', category: 'banking' },
      { id: 4, name: 'Payment History', description: '99.8% on-time payments', status: 'passed', category: 'credit' },
    ],
  },
  {
    id: '4',
    appId: 'APP-2024-004',
    companyName: 'QuickServe Restaurants',
    amount: 75000,
    confidence: 88,
    status: 'decline',
    productType: 'Business Term Loan',
    tags: ['Delinquency history', 'Low revenue', '+1'],
    ownerFico: 580,
    bankingHealth: 45,
    kybStatus: 'Pass',
    identityMatch: 92,
    compositeScore: 520,
    grade: 'D',
    positiveDrivers: [
      'Verified business identity',
    ],
    riskDrivers: [
      'Previous 90-day delinquency',
      'Declining revenue trend',
      'Low owner FICO score (580)',
      'High NSF occurrence (5 in 90 days)',
    ],
    summary: 'High-risk profile with significant credit issues. Multiple risk factors present including payment delinquency and declining financials.',
    dba: 'QuickServe',
    ein: '58-7654321',
    industry: 'Food Services',
    naicsCode: '722511',
    established: '2019',
    yearsInBusiness: 5,
    address: '456 Main Street, Denver, CO 80202',
    phone: '(303) 555-0167',
    email: 'manager@quickserve.com',
    website: 'www.quickserverestaurants.com',
    ownerName: 'David Thompson',
    ownership: 60,
    identityVerified: true,
    subscores: { tradelines: 45, payments: 52, bankingHealth: 45, identityMatch: 92 },
    banking: { avg30dBalance: 12500, avg90dBalance: 15000, nsf90d: 5, achReturns90d: 2, depositConsistency: 'Volatile', cashRunway: 1.2 },
    tradelines: { vendorsReporting: 12, oldestTradeline: '4 years 2 months', onTimePayment: 72.5, dbtAverage: 45 },
    publicRecords: { uccFilings: 0, liens: true, judgments: false, bankruptcies: false },
    kyb: { registry: 'Verified', ein: true, addressStability: 'Medium' },
    ruleTriggers: [
      { id: 1, name: 'Minimum Credit Score', description: 'Score 520 below minimum 650', status: 'failed', category: 'credit' },
      { id: 2, name: 'Payment Delinquency', description: '90-day delinquency detected', status: 'failed', category: 'credit' },
      { id: 3, name: 'NSF Activity', description: '5 NSF events in 90 days', status: 'failed', category: 'banking' },
      { id: 4, name: 'Cash Runway', description: '1.2 months below 3 month minimum', status: 'failed', category: 'banking' },
    ],
  },
  {
    id: '5',
    appId: 'APP-2024-005',
    companyName: 'Apex Construction',
    amount: 350000,
    confidence: 89,
    status: 'approve',
    productType: 'Equipment Financing',
    tags: ['Seasonal revenue'],
    ownerFico: 720,
    bankingHealth: 78,
    kybStatus: 'Pass',
    identityMatch: 97,
    compositeScore: 695,
    grade: 'B',
    positiveDrivers: [
      'Strong owner credit (720)',
      '10 years in business',
      'Industry expertise verified',
      'Consistent seasonal patterns',
    ],
    riskDrivers: [
      'Seasonal revenue fluctuation',
    ],
    summary: 'Good credit profile with predictable seasonal patterns. Standard approval with consideration for seasonal cash flow.',
    dba: 'Apex Builders',
    ein: '29-8765432',
    industry: 'Construction',
    naicsCode: '236220',
    established: '2014',
    yearsInBusiness: 10,
    address: '780 Industrial Parkway, Phoenix, AZ 85004',
    phone: '(480) 555-0289',
    email: 'projects@apexconstruction.com',
    website: 'www.apexconstruction.com',
    ownerName: 'Robert Williams',
    ownership: 90,
    identityVerified: true,
    subscores: { tradelines: 78, payments: 85, bankingHealth: 78, identityMatch: 97 },
    banking: { avg30dBalance: 185000, avg90dBalance: 210000, nsf90d: 0, achReturns90d: 0, depositConsistency: 'Moderate', cashRunway: 5.8 },
    tradelines: { vendorsReporting: 32, oldestTradeline: '8 years 11 months', onTimePayment: 96.2, dbtAverage: 18 },
    publicRecords: { uccFilings: 1, liens: false, judgments: false, bankruptcies: false },
    kyb: { registry: 'Verified', ein: true, addressStability: 'High' },
    ruleTriggers: [
      { id: 1, name: 'Minimum Credit Score', description: 'Score 695 exceeds minimum 650', status: 'passed', category: 'credit' },
      { id: 2, name: 'Time in Business', description: '10 years exceeds 2 year minimum', status: 'passed', category: 'compliance' },
      { id: 3, name: 'Revenue Stability', description: 'Seasonal pattern detected', status: 'warning', category: 'banking' },
      { id: 4, name: 'Payment History', description: '96.2% on-time payments', status: 'passed', category: 'credit' },
    ],
  },
];

const stats = [
  { label: 'Approved Today', value: 47, icon: 'check', color: 'var(--primary-02)' },
  { label: 'In Review', value: 12, icon: 'warning', color: 'var(--primary-05)' },
  { label: 'Declined Today', value: 8, icon: 'x', color: 'var(--primary-03)' },
  { label: 'Avg Processing', value: '4.2 mins', icon: 'clock', color: 'var(--muted-foreground)' },
  { label: 'AI Accuracy', value: '94.7%', icon: 'brain', color: 'var(--primary-01)' },
  { label: 'Human Override', value: '6.3%', icon: 'users', color: 'var(--muted-foreground)' },
];

// ============================================
// RULE TRIGGERS TAB (Notification Style)
// ============================================

interface RuleTrigger {
  id: number;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning';
  category: 'credit' | 'identity' | 'banking' | 'compliance';
}

interface RuleTriggersTabProps {
  triggers: RuleTrigger[];
}

const RuleTriggersTab: React.FC<RuleTriggersTabProps> = ({ triggers }) => {
  const [filter, setFilter] = useState<'all' | 'credit' | 'banking' | 'compliance'>('all');
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'credit', label: 'Credit Rules' },
    { id: 'banking', label: 'Banking Rules' },
    { id: 'compliance', label: 'Compliance' },
  ];
  
  const filteredTriggers = filter === 'all' 
    ? triggers 
    : triggers.filter(t => t.category === filter);

  const getStatusConfig = (status: RuleTrigger['status']) => {
    switch (status) {
      case 'passed':
        return { bg: 'bg-primary-02/10', iconBg: 'bg-primary-02/10', iconColor: 'text-primary-02', borderColor: 'border-l-primary-02', label: 'Passed' };
      case 'failed':
        return { bg: 'bg-primary-03/10', iconBg: 'bg-primary-03/10', iconColor: 'text-primary-03', borderColor: 'border-l-primary-03', label: 'Failed' };
      case 'warning':
        return { bg: 'bg-primary-05/10', iconBg: 'bg-primary-05/10', iconColor: 'text-primary-05', borderColor: 'border-l-primary-05', label: 'Warning' };
    }
  };

  const passedCount = triggers.filter(t => t.status === 'passed').length;
  const failedCount = triggers.filter(t => t.status === 'failed').length;
  const warningCount = triggers.filter(t => t.status === 'warning').length;

  return (
    <div className="bg-card rounded-2xl border border-border">
      {/* Header with filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-border">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-[0.875rem] font-medium transition-all ${
                filter === f.id
                  ? 'bg-card border-2 border-primary text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[0.8125rem] text-primary-02">
            <Icon type="check" className="w-4 h-4" />
            {passedCount} Passed
          </span>
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-[0.8125rem] text-primary-05">
              <Icon type="warning" className="w-4 h-4" />
              {warningCount} Warning
            </span>
          )}
          {failedCount > 0 && (
            <span className="flex items-center gap-1 text-[0.8125rem] text-primary-03">
              <Icon type="x" className="w-4 h-4" />
              {failedCount} Failed
            </span>
          )}
        </div>
      </div>

      {/* Rules List */}
      <div className="p-4 space-y-3">
        {filteredTriggers.map((trigger) => {
          const config = getStatusConfig(trigger.status);
          return (
            <div
              key={trigger.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${config.borderColor} bg-muted/50 hover:bg-muted transition-colors`}
            >
              <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center shrink-0`}>
                {trigger.status === 'passed' && <Icon type="check" className={`w-6 h-6 ${config.iconColor}`} />}
                {trigger.status === 'failed' && <Icon type="x" className={`w-6 h-6 ${config.iconColor}`} />}
                {trigger.status === 'warning' && <Icon type="warning" className={`w-6 h-6 ${config.iconColor}`} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 bg-primary-02/10 text-primary-02 rounded text-[0.6875rem] font-semibold uppercase">
                    INFO
                  </span>
                </div>
                <h4 className="text-[1rem] font-semibold text-foreground mb-0.5">{trigger.name}</h4>
                <p className="text-[0.875rem] text-muted-foreground">{trigger.description}</p>
              </div>
              
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                trigger.status === 'passed' ? 'border-primary-02 text-primary-02' :
                trigger.status === 'failed' ? 'border-primary-03 text-primary-03' :
                'border-primary-05 text-primary-05'
              }`}>
                <Icon type="check" className="w-4 h-4" />
                <span className="text-[0.875rem] font-medium">{config.label}</span>
              </div>
            </div>
          );
        })}

        {filteredTriggers.length === 0 && (
          <div className="text-center py-12">
            <Icon type="document" className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No rules found for this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CREDIT SCORE GAUGE (Same as UsageLimitGauge style)
// ============================================

const scoreGaugeData = [
  { name: "Red", value: 400 },
  { name: "Yellow", value: 250 },
  { name: "Pink", value: 350 },
  { name: "Green", value: 300 },
];

const SCORE_GAUGE_COLORS = ["var(--primary-03)", "var(--primary-05)", "var(--primary-04)", "var(--primary-02)"];

interface CreditScoreGaugeProps {
  score: number;
  grade: string;
}

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score, grade }) => {
  const animatedScore = useCountUp(score, 1500);
  
  const getGradeColor = (g: string) => {
    if (g.startsWith('A')) return 'var(--primary-02)';
    if (g.startsWith('B')) return 'var(--primary-02)';
    if (g.startsWith('C')) return 'var(--primary-05)';
    return 'var(--primary-03)';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <ResponsiveContainer width="100%" height={80}>
          <PieChart>
            <Pie
              data={scoreGaugeData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={1}
              dataKey="value"
              stroke="transparent"
            >
              {scoreGaugeData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SCORE_GAUGE_COLORS[index % SCORE_GAUGE_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score in center */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center">
          <div className="text-[2rem] font-bold text-foreground">{animatedScore}</div>
        </div>
      </div>
      
      {/* Grade Badge */}
      <div 
        className="mt-2 text-[0.9375rem] font-semibold"
        style={{ color: getGradeColor(grade) }}
      >
        Grade {grade}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const UnderwritingAssistant: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<Application>(applications[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'credit' | 'rules'>('overview');

  const getStatusBadge = (status: Application['status']) => {
    const config = {
      approve: { bg: 'bg-primary-02/10', text: 'text-primary-02', label: 'Approve' },
      review: { bg: 'bg-primary-05/10', text: 'text-primary-05', label: 'Review' },
      decline: { bg: 'bg-primary-03/10', text: 'text-primary-03', label: 'Decline' },
    };
    return config[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem] font-bold text-foreground">Underwriting Assistant</h1>
          <p className="text-muted-foreground text-[0.9375rem]">AI-powered decisioning with real-time risk assessment</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
          <div className="w-2 h-2 rounded-full bg-primary-02 animate-pulse" />
          <span className="text-[0.875rem] font-medium text-foreground">AI Engine Active</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4 lg:grid-cols-3 md:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex justify-center mb-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon type={stat.icon} className="w-5 h-5" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-[1.5rem] font-bold text-foreground">{stat.value}</div>
              <div className="text-[0.8125rem] text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* Application Queue - Left Sidebar */}
        <div className="w-full lg:w-[340px] lg:shrink-0 bg-card rounded-2xl p-5 border border-border mb-6 lg:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Icon type="document" className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-[1.125rem] font-semibold text-foreground">Application Queue</h2>
          </div>
          <p className="text-[0.875rem] text-muted-foreground mb-4">{applications.length} pending review</p>
          
          <div className="space-y-2">
            {applications.map((app) => {
              const badge = getStatusBadge(app.status);
              const isSelected = selectedApp.id === app.id;
              
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-muted border-2 border-primary' 
                      : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.75rem] text-muted-foreground font-mono">{app.appId}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] font-medium ${badge.bg} ${badge.text}`}>
                      {app.status === 'approve' && <Icon type="check" className="w-3 h-3" />}
                      {app.status === 'review' && <Icon type="warning" className="w-3 h-3" />}
                      {app.status === 'decline' && <Icon type="x" className="w-3 h-3" />}
                      {badge.label}
                    </div>
                  </div>
                  <div className="font-semibold text-foreground mb-1">{app.companyName}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.875rem] text-muted-foreground">{formatCurrency(app.amount)}</span>
                    <span className="text-[0.875rem] text-muted-foreground">% {app.confidence}%</span>
                  </div>
                  {app.tags && app.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-primary-05/10 text-primary-05 rounded text-[0.6875rem] font-medium">
                          {tag}
                        </span>
                      ))}
                      {app.tags.length > 2 && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[0.6875rem] font-medium">
                          +{app.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Detail - Right Panel */}
        <div className="flex-1 space-y-6">
          {/* Application Header */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-02/10 rounded-xl flex items-center justify-center">
                  <Icon type="check" className="w-6 h-6 text-primary-02" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-[1.25rem] font-semibold text-foreground">{selectedApp.companyName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-medium ${getStatusBadge(selectedApp.status).bg} ${getStatusBadge(selectedApp.status).text}`}>
                      AI: {getStatusBadge(selectedApp.status).label}
                    </span>
                  </div>
                  <div className="text-[0.875rem] text-muted-foreground">
                    {selectedApp.productType} • {formatCurrency(selectedApp.amount)} • {selectedApp.appId}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 bg-primary-02/10 rounded-full flex items-center justify-center">
                      <Icon type="shield" className="w-3 h-3 text-primary-02" />
                    </div>
                    <span className="text-[1.5rem] font-bold text-primary-02">{selectedApp.confidence}%</span>
                  </div>
                  <div className="text-[0.75rem] text-muted-foreground">Confidence</div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.error('Application declined', {
                      description: `${selectedApp.companyName} - ${selectedApp.appId}`,
                    });
                  }}
                  className="gap-2 rounded-xl"
                >
                  <Icon type="x" className="w-4 h-4" />
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    toast.success('Application approved successfully', {
                      description: `${selectedApp.companyName} - ${selectedApp.appId}`,
                    });
                  }}
                  className="gap-2 rounded-xl bg-primary-02 hover:bg-primary-02/90"
                >
                  <Icon type="check" className="w-4 h-4" />
                  Approve
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'profile', label: 'Applicant Profile' },
                { id: 'credit', label: 'Credit Data' },
                { id: 'rules', label: 'Rule Triggers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-card text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Score and Stats */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex flex-wrap items-center gap-6 lg:gap-0">
                  {/* Credit Score Gauge */}
                  <div className="w-full lg:w-1/3 flex flex-col items-center py-4 lg:border-r border-border">
                    <CreditScoreGauge score={selectedApp.compositeScore} grade={selectedApp.grade} />
                    <div className="mt-3 text-[0.8125rem] text-muted-foreground">Composite Score</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex-1 grid grid-cols-4 gap-4 lg:pl-6 md:grid-cols-2">
                    <div className="text-center">
                      <div className="text-[1.5rem] font-bold text-foreground">{selectedApp.ownerFico}</div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-medium bg-primary-02/10 text-primary-02 border border-primary-02/20">
                        {selectedApp.ownerFico >= 720 ? 'Excellent' : selectedApp.ownerFico >= 680 ? 'Good' : 'Fair'}
                      </div>
                      <div className="mt-1 text-[0.75rem] text-muted-foreground">Owner FICO</div>
                    </div>
                    <div className="text-center border-l border-border pl-4">
                      <div className="text-[1.5rem] font-bold text-foreground">{selectedApp.bankingHealth}</div>
                      <div className="w-16 h-1 bg-muted rounded-full mx-auto mt-1 mb-1">
                        <div 
                          className="h-full bg-foreground rounded-full" 
                          style={{ width: `${selectedApp.bankingHealth}%` }}
                        />
                      </div>
                      <div className="text-[0.75rem] text-muted-foreground">Banking Health</div>
                    </div>
                    <div className="text-center border-l border-border pl-4">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon type="check" className="w-4 h-4 text-primary-02" />
                        <span className="text-[1rem] font-semibold text-primary-02">{selectedApp.kybStatus}</span>
                      </div>
                      <div className="text-[0.75rem] text-muted-foreground">KYB Verified</div>
                    </div>
                    <div className="text-center border-l border-border pl-4">
                      <div className="text-[1.5rem] font-bold text-primary-02">{selectedApp.identityMatch}%</div>
                      <div className="text-[0.75rem] text-muted-foreground">Identity Match</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-border text-[0.8125rem] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon type="trendUp" className="w-4 h-4" />
                    Data sources matched: 8/9
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon type="clock" className="w-4 h-4" />
                    Signals updated: 1h ago
                  </div>
                </div>
              </div>

              {/* Why This Score */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="info" className="w-4 h-4 text-foreground" />
                    </div>
                    <h3 className="text-[1.125rem] font-semibold text-foreground">Why this score?</h3>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[0.875rem] font-semibold ${
                    selectedApp.status === 'approve' ? 'bg-primary-02/10 text-primary-02' :
                    selectedApp.status === 'review' ? 'bg-primary-05/10 text-primary-05' :
                    'bg-primary-03/10 text-primary-03'
                  }`}>
                    AI Recommendation: {getStatusBadge(selectedApp.status).label.toUpperCase()}
                  </span>
                </div>

                <p className="text-[0.9375rem] text-foreground mb-6">{selectedApp.summary}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Positive Drivers */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon type="check" className="w-4 h-4 text-primary-02" />
                      <span className="text-[0.9375rem] font-semibold text-primary-02">Positive Drivers</span>
                    </div>
                    {selectedApp.positiveDrivers.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedApp.positiveDrivers.map((driver, i) => (
                          <li key={i} className="flex items-start gap-2 text-[0.875rem] text-foreground">
                            <span className="text-primary-02 mt-1">•</span>
                            {driver}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[0.875rem] text-muted-foreground italic">No positive factors identified</p>
                    )}
                  </div>

                  {/* Risk Drivers */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon type="warning" className="w-4 h-4 text-primary-03" />
                      <span className="text-[0.9375rem] font-semibold text-primary-03">Risk Drivers</span>
                    </div>
                    {selectedApp.riskDrivers.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedApp.riskDrivers.map((driver, i) => (
                          <li key={i} className="flex items-start gap-2 text-[0.875rem] text-foreground">
                            <span className="text-primary-03 mt-1">•</span>
                            {driver}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[0.875rem] text-muted-foreground italic">No risk factors identified</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Applicant Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Business & Contact Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Information */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="building" className="w-4 h-4 text-foreground" />
                    </div>
                    <h3 className="text-[1rem] font-semibold text-foreground">Business Information</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Legal Name', value: selectedApp.companyName },
                      { label: 'DBA', value: selectedApp.dba || 'N/A' },
                      { label: 'EIN', value: selectedApp.ein },
                      { label: 'Industry', value: selectedApp.industry },
                      { label: 'NAICS Code', value: selectedApp.naicsCode },
                      { label: 'Established', value: `${selectedApp.established} (${selectedApp.yearsInBusiness} years)` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="text-[0.875rem] text-muted-foreground">{item.label}</span>
                        <span className="text-[0.875rem] font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="info" className="w-4 h-4 text-foreground" />
                    </div>
                    <h3 className="text-[1rem] font-semibold text-foreground">Contact Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center shrink-0 mt-0.5">
                        <Icon type="building" className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-[0.875rem] text-foreground">{selectedApp.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                        <Icon type="info" className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-[0.875rem] text-foreground">{selectedApp.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                        <Icon type="info" className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-[0.875rem] text-foreground">{selectedApp.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                        <Icon type="trendUp" className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <a href={`https://${selectedApp.website}`} target="_blank" rel="noopener noreferrer" className="text-[0.875rem] text-primary hover:underline">
                        {selectedApp.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Icon type="users" className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-[1rem] font-semibold text-foreground">Owner Information</h3>
                </div>
                <div className="grid grid-cols-4 gap-6 md:grid-cols-2">
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="text-[1.25rem] font-bold text-foreground mb-1">{selectedApp.ownerName}</div>
                    <div className="text-[0.8125rem] text-muted-foreground">Primary Owner</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="text-[1.5rem] font-bold text-foreground mb-1">{selectedApp.ownerFico}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.75rem] font-medium mb-1 ${
                      selectedApp.ownerFico >= 720 ? 'bg-primary-02/10 text-primary-02' :
                      selectedApp.ownerFico >= 680 ? 'bg-primary-05/10 text-primary-05' :
                      'bg-primary-03/10 text-primary-03'
                    }`}>
                      {selectedApp.ownerFico >= 720 ? 'Excellent' : selectedApp.ownerFico >= 680 ? 'Good' : 'Fair'}
                    </span>
                    <div className="text-[0.8125rem] text-muted-foreground">Personal FICO</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="text-[1.5rem] font-bold text-foreground mb-1">{selectedApp.ownership}%</div>
                    <div className="text-[0.8125rem] text-muted-foreground">Ownership</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Icon type="check" className="w-5 h-5 text-primary-02" />
                      <span className="text-[1rem] font-bold text-primary-02">Verified</span>
                    </div>
                    <div className="text-[0.8125rem] text-muted-foreground">Identity Check</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credit Data Tab */}
          {activeTab === 'credit' && (
            <div className="space-y-6">
              {/* Subscores, Banking Health, Tradelines */}
              <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                {/* Subscores */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="text-[1rem] font-semibold text-foreground mb-5">Subscores</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Tradelines', score: selectedApp.subscores.tradelines },
                      { label: 'Payments', score: selectedApp.subscores.payments },
                      { label: 'Banking Health', score: selectedApp.subscores.bankingHealth },
                      { label: 'Identity Match', score: selectedApp.subscores.identityMatch },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[0.875rem] text-foreground">{item.label}</span>
                          <span className="text-[0.875rem] font-semibold text-foreground">{item.score}/100</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banking Health */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="building" className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-[1rem] font-semibold text-foreground">Banking Health</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Avg 30d Balance', value: `$${selectedApp.banking.avg30dBalance.toLocaleString()}` },
                      { label: 'Avg 90d Balance', value: `$${selectedApp.banking.avg90dBalance.toLocaleString()}` },
                      { label: 'NSF (90d)', value: selectedApp.banking.nsf90d, isNumber: true },
                      { label: 'ACH Returns (90d)', value: selectedApp.banking.achReturns90d, isNumber: true },
                      { label: 'Deposit Consistency', value: selectedApp.banking.depositConsistency, isBadge: true },
                      { label: 'Cash Runway', value: `${selectedApp.banking.cashRunway} months` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-1.5">
                        <span className="text-[0.875rem] text-muted-foreground">{item.label}</span>
                        {item.isBadge ? (
                          <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-medium ${
                            item.value === 'Stable' ? 'bg-primary-02/10 text-primary-02 border border-primary-02/20' :
                            item.value === 'Moderate' ? 'bg-primary-05/10 text-primary-05 border border-primary-05/20' :
                            'bg-primary-03/10 text-primary-03 border border-primary-03/20'
                          }`}>
                            {item.value}
                          </span>
                        ) : (
                          <span className={`text-[0.875rem] font-semibold ${
                            item.isNumber && Number(item.value) > 0 ? 'text-primary-03' : 'text-foreground'
                          }`}>
                            {item.isNumber && Number(item.value) === 0 ? <span className="text-primary-02">0</span> : item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tradelines & Payments */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="document" className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-[1rem] font-semibold text-foreground">Tradelines & Payments</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Vendors Reporting', value: selectedApp.tradelines.vendorsReporting },
                      { label: 'Oldest Tradeline', value: selectedApp.tradelines.oldestTradeline },
                      { label: 'On-Time Payment', value: `${selectedApp.tradelines.onTimePayment}%`, isGreen: selectedApp.tradelines.onTimePayment >= 95 },
                      { label: 'DBT Average', value: `${selectedApp.tradelines.dbtAverage} days`, isGreen: selectedApp.tradelines.dbtAverage <= 15 },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-1.5">
                        <span className="text-[0.875rem] text-muted-foreground">{item.label}</span>
                        <span className={`text-[0.875rem] font-semibold ${item.isGreen ? 'text-primary-02' : 'text-foreground'}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Public Records & Identity */}
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
                {/* Public Records & Liens */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="shield" className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-[1rem] font-semibold text-foreground">Public Records & Liens</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4 md:grid-cols-2">
                    <div className="text-center p-3 bg-muted rounded-xl">
                      <div className="text-[1.25rem] font-bold text-foreground mb-1">{selectedApp.publicRecords.uccFilings}</div>
                      <div className="text-[0.75rem] text-muted-foreground">UCC Filings</div>
                    </div>
                    {[
                      { label: 'Liens', value: selectedApp.publicRecords.liens },
                      { label: 'Judgments', value: selectedApp.publicRecords.judgments },
                      { label: 'Bankruptcies', value: selectedApp.publicRecords.bankruptcies },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3 bg-muted rounded-xl">
                        <div className="flex justify-center mb-1">
                          <Icon type="check" className={`w-5 h-5 ${item.value ? 'text-primary-03' : 'text-primary-02'}`} />
                        </div>
                        <div className="text-[0.75rem] text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identity & KYB */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon type="fingerprint" className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-[1rem] font-semibold text-foreground">Identity & KYB</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-[0.875rem] text-muted-foreground">Registry</span>
                      <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-medium ${
                        selectedApp.kyb.registry === 'Verified' ? 'bg-primary-02/10 text-primary-02' :
                        selectedApp.kyb.registry === 'Pending' ? 'bg-primary-05/10 text-primary-05' :
                        'bg-primary-03/10 text-primary-03'
                      }`}>
                        {selectedApp.kyb.registry}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-[0.875rem] text-muted-foreground">EIN</span>
                      <Icon type="check" className={`w-5 h-5 ${selectedApp.kyb.ein ? 'text-primary-02' : 'text-primary-03'}`} />
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-[0.875rem] text-muted-foreground">Address Stability</span>
                      <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-medium ${
                        selectedApp.kyb.addressStability === 'High' ? 'bg-primary-02/10 text-primary-02' :
                        selectedApp.kyb.addressStability === 'Medium' ? 'bg-primary-05/10 text-primary-05' :
                        'bg-primary-03/10 text-primary-03'
                      }`}>
                        {selectedApp.kyb.addressStability}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rule Triggers Tab - Notification Style */}
          {activeTab === 'rules' && (
            <RuleTriggersTab triggers={selectedApp.ruleTriggers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnderwritingAssistant;

