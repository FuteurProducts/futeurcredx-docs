// =============================================================================
// Lumiq Developer Docs — Pre-captured Sandbox Responses (4 Bank Tenants)
// =============================================================================

export interface BankSnapshot {
  bank: string;
  bankId: string;
  portfolioId: string;
  apiKeyPrefix: string;
  responses: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Chase — Largest SMB portfolio, 6M businesses, $650B exposure
// ---------------------------------------------------------------------------

const chase: BankSnapshot = {
  bank: 'Chase',
  bankId: 'chase',
  portfolioId: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
  apiKeyPrefix: 'sk_test_ceO5',
  responses: {
    health: {
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-02-15T22:27:27.323Z',
        version: '1.0.0',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    portfolios: {
      success: true,
      data: [
        {
          id: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
          name: 'Chase SMB National',
          code: 'CHASE-SMB-NAT',
          config: {},
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    portfolioSummary: {
      success: true,
      data: {
        totalBusinesses: 6000000,
        totalExposure: 650000000000,
        avgCreditScore: 71.4,
        preQualifiedRate: 67.0,
        atRiskRate: 13.0,
        atRiskExposure: 84500000000,
        offerPotential: 145000000000,
        trend: {
          portfolioGrowthYoy: 4.5,
          nplRate: 0.65,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    customers: {
      success: true,
      data: [
        {
          id: 'biz_chase_001',
          name: 'Apex Manufacturing LLC',
          industry: 'Manufacturing',
          annualRevenue: 12500000,
          employeeCount: 85,
          yearsInBusiness: 14,
          creditScore: 78,
          riskTier: 'low',
          state: 'OH',
          city: 'Columbus',
        },
        {
          id: 'biz_chase_002',
          name: 'Bright Path Consulting',
          industry: 'Professional Services',
          annualRevenue: 3200000,
          employeeCount: 22,
          yearsInBusiness: 7,
          creditScore: 65,
          riskTier: 'medium',
          state: 'TX',
          city: 'Austin',
        },
        {
          id: 'biz_chase_003',
          name: 'Metro Auto Parts Inc',
          industry: 'Retail',
          annualRevenue: 8900000,
          employeeCount: 62,
          yearsInBusiness: 22,
          creditScore: 82,
          riskTier: 'low',
          state: 'CA',
          city: 'Los Angeles',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 6000000,
        totalPages: 300000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    scoreDistribution: {
      success: true,
      data: {
        ranges: [
          { min: 0, max: 20, count: 180000, percentage: 3.0 },
          { min: 20, max: 40, count: 540000, percentage: 9.0 },
          { min: 40, max: 60, count: 1200000, percentage: 20.0 },
          { min: 60, max: 80, count: 2700000, percentage: 45.0 },
          { min: 80, max: 100, count: 1380000, percentage: 23.0 },
        ],
        mean: 71.4,
        median: 73,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    riskSummary: {
      success: true,
      data: {
        delinquencyRate: 4.2,
        defaultRate: 1.1,
        watchlistCount: 14500,
        totalAlerts: 3200,
        nplRatio: 0.65,
        concentrationRisk: {
          topIndustry: 'Retail',
          topIndustryPct: 22.4,
          topState: 'CA',
          topStatePct: 15.8,
        },
        trends: {
          delinquencyDelta30d: -0.3,
          defaultDelta30d: 0.1,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    analyticsFunnel: {
      success: true,
      data: {
        stages: [
          { name: 'Total Portfolio', count: 6000000, rate: 100.0 },
          { name: 'Pre-Qualified', count: 4020000, rate: 67.0 },
          { name: 'Applied', count: 1206000, rate: 30.0 },
          { name: 'Approved', count: 843000, rate: 69.9 },
          { name: 'Funded', count: 612000, rate: 72.6 },
        ],
        overallConversion: 10.2,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    offers: {
      success: true,
      data: [
        {
          id: 'offer_chase_001',
          businessId: 'biz_chase_001',
          businessName: 'Apex Manufacturing LLC',
          productType: 'Term Loan',
          offeredAmount: 750000,
          interestRate: 7.25,
          term: '60 months',
          status: 'active',
          expiresAt: '2026-03-15T00:00:00.000Z',
          createdAt: '2026-02-01T12:00:00.000Z',
        },
        {
          id: 'offer_chase_002',
          businessId: 'biz_chase_003',
          businessName: 'Metro Auto Parts Inc',
          productType: 'Business Line of Credit',
          offeredAmount: 500000,
          interestRate: 6.5,
          term: 'Revolving',
          status: 'active',
          expiresAt: '2026-03-20T00:00:00.000Z',
          createdAt: '2026-02-05T09:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 45000,
        totalPages: 2250,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
    applications: {
      success: true,
      data: [
        {
          id: 'app_chase_001',
          businessId: 'biz_chase_001',
          businessName: 'Apex Manufacturing LLC',
          productType: 'Term Loan',
          requestedAmount: 500000,
          status: 'approved',
          creditScore: 78,
          submittedAt: '2026-02-10T09:00:00.000Z',
          decidedAt: '2026-02-12T16:30:00.000Z',
        },
        {
          id: 'app_chase_002',
          businessId: 'biz_chase_002',
          businessName: 'Bright Path Consulting',
          productType: 'Business Line of Credit',
          requestedAmount: 150000,
          status: 'in_review',
          creditScore: 65,
          submittedAt: '2026-02-13T11:00:00.000Z',
          decidedAt: null,
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 12450,
        totalPages: 623,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Wells Fargo — Strong mid-market focus, 4.2M businesses, $380B exposure
// ---------------------------------------------------------------------------

const wellsFargo: BankSnapshot = {
  bank: 'Wells Fargo',
  bankId: 'wellsfargo',
  portfolioId: 'a1b2c3d4-5678-9012-abcd-ef0123456789',
  apiKeyPrefix: 'sk_test_-oL8',
  responses: {
    health: {
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-02-15T22:27:30.112Z',
        version: '1.0.0',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    portfolios: {
      success: true,
      data: [
        {
          id: 'a1b2c3d4-5678-9012-abcd-ef0123456789',
          name: 'Wells Fargo Business Banking',
          code: 'WF-BIZ-BANK',
          config: {},
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    portfolioSummary: {
      success: true,
      data: {
        totalBusinesses: 4200000,
        totalExposure: 380000000000,
        avgCreditScore: 69.8,
        preQualifiedRate: 62.5,
        atRiskRate: 15.2,
        atRiskExposure: 57760000000,
        offerPotential: 98000000000,
        trend: {
          portfolioGrowthYoy: 3.2,
          nplRate: 0.82,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    customers: {
      success: true,
      data: [
        {
          id: 'biz_wf_001',
          name: 'Heartland Logistics Corp',
          industry: 'Transportation',
          annualRevenue: 28000000,
          employeeCount: 210,
          yearsInBusiness: 18,
          creditScore: 74,
          riskTier: 'low',
          state: 'MN',
          city: 'Minneapolis',
        },
        {
          id: 'biz_wf_002',
          name: 'Prairie Health Systems',
          industry: 'Healthcare',
          annualRevenue: 45000000,
          employeeCount: 380,
          yearsInBusiness: 25,
          creditScore: 81,
          riskTier: 'low',
          state: 'NE',
          city: 'Omaha',
        },
        {
          id: 'biz_wf_003',
          name: 'Summit Construction Group',
          industry: 'Construction',
          annualRevenue: 15600000,
          employeeCount: 120,
          yearsInBusiness: 11,
          creditScore: 58,
          riskTier: 'medium',
          state: 'CO',
          city: 'Denver',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 4200000,
        totalPages: 210000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    scoreDistribution: {
      success: true,
      data: {
        ranges: [
          { min: 0, max: 20, count: 168000, percentage: 4.0 },
          { min: 20, max: 40, count: 462000, percentage: 11.0 },
          { min: 40, max: 60, count: 924000, percentage: 22.0 },
          { min: 60, max: 80, count: 1764000, percentage: 42.0 },
          { min: 80, max: 100, count: 882000, percentage: 21.0 },
        ],
        mean: 69.8,
        median: 71,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    riskSummary: {
      success: true,
      data: {
        delinquencyRate: 5.1,
        defaultRate: 1.4,
        watchlistCount: 12600,
        totalAlerts: 2850,
        nplRatio: 0.82,
        concentrationRisk: {
          topIndustry: 'Healthcare',
          topIndustryPct: 19.8,
          topState: 'TX',
          topStatePct: 14.2,
        },
        trends: {
          delinquencyDelta30d: 0.2,
          defaultDelta30d: -0.1,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    analyticsFunnel: {
      success: true,
      data: {
        stages: [
          { name: 'Total Portfolio', count: 4200000, rate: 100.0 },
          { name: 'Pre-Qualified', count: 2625000, rate: 62.5 },
          { name: 'Applied', count: 840000, rate: 32.0 },
          { name: 'Approved', count: 571200, rate: 68.0 },
          { name: 'Funded', count: 399840, rate: 70.0 },
        ],
        overallConversion: 9.5,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    offers: {
      success: true,
      data: [
        {
          id: 'offer_wf_001',
          businessId: 'biz_wf_001',
          businessName: 'Heartland Logistics Corp',
          productType: 'Equipment Financing',
          offeredAmount: 1200000,
          interestRate: 6.75,
          term: '84 months',
          status: 'active',
          expiresAt: '2026-03-18T00:00:00.000Z',
          createdAt: '2026-02-03T10:00:00.000Z',
        },
        {
          id: 'offer_wf_002',
          businessId: 'biz_wf_002',
          businessName: 'Prairie Health Systems',
          productType: 'Commercial Real Estate Loan',
          offeredAmount: 5000000,
          interestRate: 5.9,
          term: '120 months',
          status: 'active',
          expiresAt: '2026-04-01T00:00:00.000Z',
          createdAt: '2026-02-08T14:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 32000,
        totalPages: 1600,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
    applications: {
      success: true,
      data: [
        {
          id: 'app_wf_001',
          businessId: 'biz_wf_001',
          businessName: 'Heartland Logistics Corp',
          productType: 'Equipment Financing',
          requestedAmount: 1000000,
          status: 'approved',
          creditScore: 74,
          submittedAt: '2026-02-08T09:00:00.000Z',
          decidedAt: '2026-02-11T15:00:00.000Z',
        },
        {
          id: 'app_wf_002',
          businessId: 'biz_wf_003',
          businessName: 'Summit Construction Group',
          productType: 'Business Line of Credit',
          requestedAmount: 350000,
          status: 'pending',
          creditScore: 58,
          submittedAt: '2026-02-14T10:00:00.000Z',
          decidedAt: null,
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 9800,
        totalPages: 490,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:30.112Z',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Santander — Micro-business focus, 1.8M businesses, $95B exposure
// ---------------------------------------------------------------------------

const santander: BankSnapshot = {
  bank: 'Santander',
  bankId: 'santander',
  portfolioId: 'b2c3d4e5-6789-0123-bcde-f01234567890',
  apiKeyPrefix: 'sk_test_DBhG',
  responses: {
    health: {
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-02-15T22:27:32.445Z',
        version: '1.0.0',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    portfolios: {
      success: true,
      data: [
        {
          id: 'b2c3d4e5-6789-0123-bcde-f01234567890',
          name: 'Santander Micro Business',
          code: 'SAN-MICRO-BIZ',
          config: {},
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    portfolioSummary: {
      success: true,
      data: {
        totalBusinesses: 1800000,
        totalExposure: 95000000000,
        avgCreditScore: 72.1,
        preQualifiedRate: 70.5,
        atRiskRate: 10.8,
        atRiskExposure: 10260000000,
        offerPotential: 42000000000,
        trend: {
          portfolioGrowthYoy: 6.8,
          nplRate: 0.48,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    customers: {
      success: true,
      data: [
        {
          id: 'biz_san_001',
          name: 'La Cocina Mexicana',
          industry: 'Food & Beverage',
          annualRevenue: 850000,
          employeeCount: 8,
          yearsInBusiness: 5,
          creditScore: 76,
          riskTier: 'low',
          state: 'FL',
          city: 'Miami',
        },
        {
          id: 'biz_san_002',
          name: 'Coastal Cleaning Services',
          industry: 'Services',
          annualRevenue: 420000,
          employeeCount: 4,
          yearsInBusiness: 3,
          creditScore: 68,
          riskTier: 'medium',
          state: 'FL',
          city: 'Tampa',
        },
        {
          id: 'biz_san_003',
          name: 'Sunrise Auto Repair',
          industry: 'Automotive',
          annualRevenue: 1200000,
          employeeCount: 12,
          yearsInBusiness: 9,
          creditScore: 83,
          riskTier: 'low',
          state: 'NJ',
          city: 'Newark',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 1800000,
        totalPages: 90000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    scoreDistribution: {
      success: true,
      data: {
        ranges: [
          { min: 0, max: 20, count: 36000, percentage: 2.0 },
          { min: 20, max: 40, count: 126000, percentage: 7.0 },
          { min: 40, max: 60, count: 306000, percentage: 17.0 },
          { min: 60, max: 80, count: 882000, percentage: 49.0 },
          { min: 80, max: 100, count: 450000, percentage: 25.0 },
        ],
        mean: 72.1,
        median: 74,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    riskSummary: {
      success: true,
      data: {
        delinquencyRate: 3.6,
        defaultRate: 0.8,
        watchlistCount: 4200,
        totalAlerts: 980,
        nplRatio: 0.48,
        concentrationRisk: {
          topIndustry: 'Food & Beverage',
          topIndustryPct: 28.5,
          topState: 'FL',
          topStatePct: 24.1,
        },
        trends: {
          delinquencyDelta30d: -0.5,
          defaultDelta30d: -0.1,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    analyticsFunnel: {
      success: true,
      data: {
        stages: [
          { name: 'Total Portfolio', count: 1800000, rate: 100.0 },
          { name: 'Pre-Qualified', count: 1269000, rate: 70.5 },
          { name: 'Applied', count: 380700, rate: 30.0 },
          { name: 'Approved', count: 281318, rate: 73.9 },
          { name: 'Funded', count: 213802, rate: 76.0 },
        ],
        overallConversion: 11.9,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    offers: {
      success: true,
      data: [
        {
          id: 'offer_san_001',
          businessId: 'biz_san_001',
          businessName: 'La Cocina Mexicana',
          productType: 'Micro Loan',
          offeredAmount: 50000,
          interestRate: 8.5,
          term: '36 months',
          status: 'active',
          expiresAt: '2026-03-10T00:00:00.000Z',
          createdAt: '2026-02-01T08:00:00.000Z',
        },
        {
          id: 'offer_san_002',
          businessId: 'biz_san_003',
          businessName: 'Sunrise Auto Repair',
          productType: 'Business Credit Card',
          offeredAmount: 25000,
          interestRate: 16.99,
          term: 'Revolving',
          status: 'active',
          expiresAt: '2026-03-25T00:00:00.000Z',
          createdAt: '2026-02-06T11:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 18500,
        totalPages: 925,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
    applications: {
      success: true,
      data: [
        {
          id: 'app_san_001',
          businessId: 'biz_san_001',
          businessName: 'La Cocina Mexicana',
          productType: 'Micro Loan',
          requestedAmount: 35000,
          status: 'approved',
          creditScore: 76,
          submittedAt: '2026-02-09T08:00:00.000Z',
          decidedAt: '2026-02-10T14:00:00.000Z',
        },
        {
          id: 'app_san_002',
          businessId: 'biz_san_002',
          businessName: 'Coastal Cleaning Services',
          productType: 'Micro Loan',
          requestedAmount: 15000,
          status: 'declined',
          creditScore: 68,
          submittedAt: '2026-02-11T10:00:00.000Z',
          decidedAt: '2026-02-12T09:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 5400,
        totalPages: 270,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:32.445Z',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Citi — High exposure per business, 3.5M businesses, $420B exposure
// ---------------------------------------------------------------------------

const citi: BankSnapshot = {
  bank: 'Citi',
  bankId: 'citi',
  portfolioId: 'c3d4e5f6-7890-1234-cdef-012345678901',
  apiKeyPrefix: 'sk_test_8DNz',
  responses: {
    health: {
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-02-15T22:27:35.789Z',
        version: '1.0.0',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    portfolios: {
      success: true,
      data: [
        {
          id: 'c3d4e5f6-7890-1234-cdef-012345678901',
          name: 'Citi Commercial Banking',
          code: 'CITI-COMM-BNK',
          config: {},
        },
      ],
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    portfolioSummary: {
      success: true,
      data: {
        totalBusinesses: 3500000,
        totalExposure: 420000000000,
        avgCreditScore: 70.5,
        preQualifiedRate: 64.2,
        atRiskRate: 14.5,
        atRiskExposure: 60900000000,
        offerPotential: 112000000000,
        trend: {
          portfolioGrowthYoy: 3.8,
          nplRate: 0.72,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    customers: {
      success: true,
      data: [
        {
          id: 'biz_citi_001',
          name: 'GlobalTech Solutions',
          industry: 'Technology',
          annualRevenue: 95000000,
          employeeCount: 650,
          yearsInBusiness: 12,
          creditScore: 85,
          riskTier: 'low',
          state: 'NY',
          city: 'New York',
        },
        {
          id: 'biz_citi_002',
          name: 'Atlantic Pharma Group',
          industry: 'Pharmaceuticals',
          annualRevenue: 180000000,
          employeeCount: 1200,
          yearsInBusiness: 30,
          creditScore: 88,
          riskTier: 'low',
          state: 'NJ',
          city: 'Princeton',
        },
        {
          id: 'biz_citi_003',
          name: 'Meridian Energy Partners',
          industry: 'Energy',
          annualRevenue: 42000000,
          employeeCount: 280,
          yearsInBusiness: 8,
          creditScore: 52,
          riskTier: 'high',
          state: 'TX',
          city: 'Houston',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 3500000,
        totalPages: 175000,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    scoreDistribution: {
      success: true,
      data: {
        ranges: [
          { min: 0, max: 20, count: 140000, percentage: 4.0 },
          { min: 20, max: 40, count: 350000, percentage: 10.0 },
          { min: 40, max: 60, count: 770000, percentage: 22.0 },
          { min: 60, max: 80, count: 1505000, percentage: 43.0 },
          { min: 80, max: 100, count: 735000, percentage: 21.0 },
        ],
        mean: 70.5,
        median: 72,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    riskSummary: {
      success: true,
      data: {
        delinquencyRate: 4.8,
        defaultRate: 1.3,
        watchlistCount: 11200,
        totalAlerts: 2650,
        nplRatio: 0.72,
        concentrationRisk: {
          topIndustry: 'Technology',
          topIndustryPct: 24.6,
          topState: 'NY',
          topStatePct: 18.3,
        },
        trends: {
          delinquencyDelta30d: 0.1,
          defaultDelta30d: 0.0,
        },
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    analyticsFunnel: {
      success: true,
      data: {
        stages: [
          { name: 'Total Portfolio', count: 3500000, rate: 100.0 },
          { name: 'Pre-Qualified', count: 2247000, rate: 64.2 },
          { name: 'Applied', count: 742000, rate: 33.0 },
          { name: 'Approved', count: 504560, rate: 68.0 },
          { name: 'Funded', count: 358236, rate: 71.0 },
        ],
        overallConversion: 10.2,
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    offers: {
      success: true,
      data: [
        {
          id: 'offer_citi_001',
          businessId: 'biz_citi_001',
          businessName: 'GlobalTech Solutions',
          productType: 'Revolving Credit Facility',
          offeredAmount: 10000000,
          interestRate: 5.25,
          term: 'Revolving (364-day)',
          status: 'active',
          expiresAt: '2026-03-30T00:00:00.000Z',
          createdAt: '2026-02-01T16:00:00.000Z',
        },
        {
          id: 'offer_citi_002',
          businessId: 'biz_citi_002',
          businessName: 'Atlantic Pharma Group',
          productType: 'Term Loan',
          offeredAmount: 25000000,
          interestRate: 4.85,
          term: '84 months',
          status: 'active',
          expiresAt: '2026-04-15T00:00:00.000Z',
          createdAt: '2026-02-10T09:00:00.000Z',
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 28000,
        totalPages: 1400,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
    applications: {
      success: true,
      data: [
        {
          id: 'app_citi_001',
          businessId: 'biz_citi_001',
          businessName: 'GlobalTech Solutions',
          productType: 'Revolving Credit Facility',
          requestedAmount: 8000000,
          status: 'approved',
          creditScore: 85,
          submittedAt: '2026-02-05T10:00:00.000Z',
          decidedAt: '2026-02-09T11:00:00.000Z',
        },
        {
          id: 'app_citi_002',
          businessId: 'biz_citi_003',
          businessName: 'Meridian Energy Partners',
          productType: 'Term Loan',
          requestedAmount: 5000000,
          status: 'in_review',
          creditScore: 52,
          submittedAt: '2026-02-14T14:00:00.000Z',
          decidedAt: null,
        },
      ],
      error: null,
      meta: {
        page: 1,
        pageSize: 20,
        total: 8200,
        totalPages: 410,
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:35.789Z',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const bankSnapshots: BankSnapshot[] = [chase, wellsFargo, santander, citi];

export const bankSnapshotsByBankId: Record<string, BankSnapshot> = {
  chase,
  wellsfargo: wellsFargo,
  santander,
  citi,
};

/** Quick lookup: bankId -> portfolioId */
export const portfolioIdByBank: Record<string, string> = {
  chase: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
  wellsfargo: 'a1b2c3d4-5678-9012-abcd-ef0123456789',
  santander: 'b2c3d4e5-6789-0123-bcde-f01234567890',
  citi: 'c3d4e5f6-7890-1234-cdef-012345678901',
};

/** Comparison table data for the docs explorer */
export const bankComparisonData = [
  {
    bank: 'Chase',
    businesses: '6.0M',
    exposure: '$650B',
    avgScore: 71.4,
    preQualRate: '67.0%',
    atRiskRate: '13.0%',
    nplRate: '0.65%',
    topIndustry: 'Retail',
    focus: 'Broadest SMB portfolio',
  },
  {
    bank: 'Wells Fargo',
    businesses: '4.2M',
    exposure: '$380B',
    avgScore: 69.8,
    preQualRate: '62.5%',
    atRiskRate: '15.2%',
    nplRate: '0.82%',
    topIndustry: 'Healthcare',
    focus: 'Mid-market strength',
  },
  {
    bank: 'Santander',
    businesses: '1.8M',
    exposure: '$95B',
    avgScore: 72.1,
    preQualRate: '70.5%',
    atRiskRate: '10.8%',
    nplRate: '0.48%',
    topIndustry: 'Food & Beverage',
    focus: 'Micro-business specialist',
  },
  {
    bank: 'Citi',
    businesses: '3.5M',
    exposure: '$420B',
    avgScore: 70.5,
    preQualRate: '64.2%',
    atRiskRate: '14.5%',
    nplRate: '0.72%',
    topIndustry: 'Technology',
    focus: 'High exposure per business',
  },
] as const;
