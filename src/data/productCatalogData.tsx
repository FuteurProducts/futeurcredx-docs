// Product Catalog — Types, data, and presentation constants
// Extracted from Products.tsx for separation of concerns


// ============================================
// TYPES
// ============================================

export type ProductStatus = 'GA' | 'Beta' | 'Coming Soon';
export type ProductCategory = 'Credit' | 'Identity' | 'Banking' | 'Compliance';

export interface Product {
  id: string;
  title: string;
  description: string;
  color: 'yellow' | 'purple' | 'green' | 'blue' | 'cyan' | 'orange';
  icon: 'chart' | 'bell' | 'shield' | 'zap' | 'fingerprint' | 'bank';
  status: ProductStatus;
  category: ProductCategory;
  details: {
    features: string[];
    pricing: string;
    apiEndpoint: string;
    rateLimit: string;
    responseTime: string;
  };
}

// ============================================
// DATA
// ============================================

export const PRODUCTS: Product[] = [
  {
    id: 'credit-score',
    title: 'Credit Score API',
    description: 'Get real-time credit scores for individuals and businesses with comprehensive risk assessment.',
    color: 'yellow',
    icon: 'chart',
    status: 'GA',
    category: 'Credit',
    details: {
      features: [
        'Real-time credit score retrieval',
        'Risk level assessment (Low/Medium/High)',
        'Historical score tracking',
        'Multi-bureau support (Experian, TransUnion, Equifax)',
      ],
      pricing: 'Starting at $0.10/call',
      apiEndpoint: '/v1/credit/score',
      rateLimit: '1000 calls/minute',
      responseTime: '< 200ms',
    },
  },
  {
    id: 'credit-report',
    title: 'Credit Report API',
    description: 'Access detailed credit reports including payment history, accounts, and public records.',
    color: 'purple',
    icon: 'bell',
    status: 'GA',
    category: 'Credit',
    details: {
      features: [
        'Complete credit history',
        'Payment behavior analysis',
        'Account summaries',
        'Public records and collections',
      ],
      pricing: 'Starting at $0.50/call',
      apiEndpoint: '/v1/credit/report',
      rateLimit: '500 calls/minute',
      responseTime: '< 500ms',
    },
  },
  {
    id: 'lumiq-experian',
    title: 'Lumiq Experian',
    description: 'Enterprise-grade Experian data integration with advanced scoring models.',
    color: 'green',
    icon: 'shield',
    status: 'GA',
    category: 'Credit',
    details: {
      features: [
        'Experian business data',
        'FICO score integration',
        'Fraud detection signals',
        'Identity verification',
      ],
      pricing: 'Enterprise pricing',
      apiEndpoint: '/v1/experian/ext/score',
      rateLimit: '2000 calls/minute',
      responseTime: '< 300ms',
    },
  },
  {
    id: 'credit-journey',
    title: 'Credit Journey',
    description: 'Track credit improvement progress with personalized recommendations and insights.',
    color: 'blue',
    icon: 'zap',
    status: 'Beta',
    category: 'Credit',
    details: {
      features: [
        'Score progress tracking',
        'Personalized improvement tips',
        'Goal setting and milestones',
        'Monthly credit monitoring',
      ],
      pricing: 'Starting at $0.25/call',
      apiEndpoint: '/v1/credit/journey',
      rateLimit: '1000 calls/minute',
      responseTime: '< 250ms',
    },
  },
  {
    id: 'identity-verification',
    title: 'Identity Verification API',
    description: 'Verify consumer and business identities in real time with document and biometric checks.',
    color: 'cyan',
    icon: 'fingerprint',
    status: 'GA',
    category: 'Identity',
    details: {
      features: [
        'Document verification (ID, passport, license)',
        'Biometric liveness detection',
        'Watchlist and sanctions screening',
        'Address and phone validation',
      ],
      pricing: 'Starting at $0.30/call',
      apiEndpoint: '/v1/identity/verify',
      rateLimit: '800 calls/minute',
      responseTime: '< 350ms',
    },
  },
  {
    id: 'banking-health',
    title: 'Banking Health API',
    description: 'Analyze bank account health with transaction categorization, income detection, and cash flow insights.',
    color: 'orange',
    icon: 'bank',
    status: 'Beta',
    category: 'Banking',
    details: {
      features: [
        'Transaction categorization',
        'Income and employment detection',
        'Cash flow analysis',
        'Account balance trends',
      ],
      pricing: 'Starting at $0.40/call',
      apiEndpoint: '/v1/banking/health',
      rateLimit: '600 calls/minute',
      responseTime: '< 400ms',
    },
  },
  {
    id: 'kyb-compliance',
    title: 'KYB Compliance API',
    description: 'Automate Know Your Business checks with entity verification, beneficial ownership, and regulatory screening.',
    color: 'purple',
    icon: 'shield',
    status: 'Coming Soon',
    category: 'Compliance',
    details: {
      features: [
        'Business entity verification',
        'Beneficial ownership mapping',
        'AML and sanctions screening',
        'Ongoing monitoring and alerts',
      ],
      pricing: 'Contact sales',
      apiEndpoint: '/v1/compliance/kyb',
      rateLimit: 'TBD',
      responseTime: 'TBD',
    },
  },
];

// ============================================
// PRESENTATION CONSTANTS
// ============================================

export const COLOR_CLASSES: Record<Product['color'], { bg: string; border: string; iconBg: string }> = {
  yellow: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    iconBg: 'bg-warning',
  },
  purple: {
    bg: 'bg-[hsl(var(--primary-04))]/10',
    border: 'border-[hsl(var(--primary-04))]/30',
    iconBg: 'bg-[hsl(var(--primary-04))]',
  },
  green: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    iconBg: 'bg-success',
  },
  blue: {
    bg: 'bg-info/10',
    border: 'border-info/30',
    iconBg: 'bg-primary',
  },
  cyan: {
    bg: 'bg-info/10',
    border: 'border-info/30',
    iconBg: 'bg-info',
  },
  orange: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    iconBg: 'bg-warning',
  },
};

export const STATUS_CONFIG: Record<ProductStatus, { variant: 'success' | 'warning' | 'secondary'; label: string }> = {
  GA: { variant: 'success', label: 'GA' },
  Beta: { variant: 'warning', label: 'Beta' },
  'Coming Soon': { variant: 'secondary', label: 'Coming Soon' },
};

export const CATEGORIES: Array<{ label: string; value: ProductCategory | 'All' }> = [
  { label: 'All', value: 'All' },
  { label: 'Credit', value: 'Credit' },
  { label: 'Identity', value: 'Identity' },
  { label: 'Banking', value: 'Banking' },
  { label: 'Compliance', value: 'Compliance' },
];

// ============================================
// ICON COMPONENT
// ============================================

export const ProductIcon = ({ name, className = '' }: { name: string; className?: string }) => {
  switch (name) {
    case 'chart':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'zap':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'fingerprint':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      );
    case 'bank':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      );
    default:
      return null;
  }
};
