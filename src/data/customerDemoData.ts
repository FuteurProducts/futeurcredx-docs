/**
 * Customer-specific demo data for the Customer Engagement tab.
 * 36 customers with realistic coverage across all filter dimensions.
 * First 10 entries mirror DEMO_BUSINESSES (biz-001 to biz-010).
 *
 * Distribution targets:
 *   Segment:  ~10 micro, ~14 small, ~12 mid-market
 *   Region:   7-8 per region (northeast/southeast/midwest/southwest/west)
 *   Stage:    4 prospect, 7 new, 11 growing, 9 mature, 5 at-risk
 *   Products: every product ID on at least 6 customers
 */

export interface CustomerDemoRecord {
  id: string;
  businessName: string;
  legalName: string;
  industry: string;
  naicsCode: string;
  city: string;
  state: string;
  annualRevenue: number;
  employeeCount: number;
  yearsInBusiness: number;
  riskTier: 'low' | 'medium' | 'high';
  segment: 'micro' | 'small' | 'mid-market';
  region: string;
  relationshipStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
  rhs: number;
  rhsChange: number;
  products: string[];          // product filter IDs: loc, cards, sba, cre, equipment, auto, merchant, deposits
  primaryProduct: string;      // display name of lead product
  assignedRM: string;
  depositBalance: number;
  totalExposure: number;
  productCount: number;
  lastActivity: string;
}

export const CUSTOMER_DEMO_DATA: CustomerDemoRecord[] = [
  // ── biz-001 to biz-010: mirror existing DEMO_BUSINESSES ─────────────────
  {
    id: 'biz-001', businessName: 'Stellar Dynamics LLC', legalName: 'Stellar Dynamics LLC',
    industry: 'Technology Services', naicsCode: '541511', city: 'Austin', state: 'TX',
    annualRevenue: 3400000, employeeCount: 42, yearsInBusiness: 7,
    riskTier: 'low', segment: 'small', region: 'Southwest',
    relationshipStage: 'growing', rhs: 82, rhsChange: 3,
    products: ['loc', 'cards', 'deposits'], primaryProduct: 'Line of Credit',
    assignedRM: 'Sarah Mitchell', depositBalance: 429400, totalExposure: 250000, productCount: 3,
    lastActivity: '2026-01-28',
  },
  {
    id: 'biz-002', businessName: 'Metro Logistics Corp', legalName: 'Metro Logistics Corporation',
    industry: 'Transportation', naicsCode: '484110', city: 'Dallas', state: 'TX',
    annualRevenue: 5200000, employeeCount: 82, yearsInBusiness: 15,
    riskTier: 'medium', segment: 'mid-market', region: 'Southwest',
    relationshipStage: 'growing', rhs: 68, rhsChange: 0,
    products: ['loc', 'auto', 'deposits'], primaryProduct: 'Fleet Card Program',
    assignedRM: 'David Park', depositBalance: 198500, totalExposure: 547200, productCount: 2,
    lastActivity: '2026-01-27',
  },
  {
    id: 'biz-003', businessName: 'Apex Construction Group', legalName: 'Apex Construction Group Inc.',
    industry: 'Construction', naicsCode: '236220', city: 'Phoenix', state: 'AZ',
    annualRevenue: 8100000, employeeCount: 120, yearsInBusiness: 12,
    riskTier: 'low', segment: 'mid-market', region: 'West',
    relationshipStage: 'mature', rhs: 86, rhsChange: 4,
    products: ['equipment', 'cards', 'cre', 'deposits'], primaryProduct: 'Equipment LOC',
    assignedRM: 'Sarah Mitchell', depositBalance: 834000, totalExposure: 542400, productCount: 4,
    lastActivity: '2026-01-26',
  },
  {
    id: 'biz-004', businessName: 'Sunrise Healthcare Partners', legalName: 'Sunrise Healthcare Partners LLC',
    industry: 'Healthcare', naicsCode: '621111', city: 'Houston', state: 'TX',
    annualRevenue: 12500000, employeeCount: 210, yearsInBusiness: 9,
    riskTier: 'low', segment: 'mid-market', region: 'Southwest',
    relationshipStage: 'mature', rhs: 88, rhsChange: 2,
    products: ['cards', 'merchant', 'deposits'], primaryProduct: 'Treasury Management',
    assignedRM: 'Jennifer Adams', depositBalance: 1240000, totalExposure: 8200, productCount: 3,
    lastActivity: '2026-01-29',
  },
  {
    id: 'biz-005', businessName: 'GreenLeaf Organics', legalName: 'GreenLeaf Organics LLC',
    industry: 'Agriculture & Food', naicsCode: '111000', city: 'Fresno', state: 'CA',
    annualRevenue: 1800000, employeeCount: 35, yearsInBusiness: 4,
    riskTier: 'medium', segment: 'small', region: 'West',
    relationshipStage: 'new', rhs: 62, rhsChange: -3,
    products: ['sba', 'deposits'], primaryProduct: 'Term Loan',
    assignedRM: 'David Park', depositBalance: 34200, totalExposure: 75000, productCount: 1,
    lastActivity: '2026-01-27',
  },
  {
    id: 'biz-006', businessName: 'Coastal Hospitality Group', legalName: 'Coastal Hospitality Group Inc.',
    industry: 'Hospitality', naicsCode: '721110', city: 'Miami', state: 'FL',
    annualRevenue: 4200000, employeeCount: 92, yearsInBusiness: 6,
    riskTier: 'high', segment: 'small', region: 'Southeast',
    relationshipStage: 'at-risk', rhs: 42, rhsChange: -8,
    products: ['deposits'], primaryProduct: 'Business Checking',
    assignedRM: 'Jennifer Adams', depositBalance: 67800, totalExposure: 0, productCount: 1,
    lastActivity: '2026-01-28',
  },
  {
    id: 'biz-007', businessName: 'Precision Manufacturing Co', legalName: 'Precision Manufacturing Company',
    industry: 'Manufacturing', naicsCode: '332710', city: 'Detroit', state: 'MI',
    annualRevenue: 9800000, employeeCount: 175, yearsInBusiness: 22,
    riskTier: 'low', segment: 'mid-market', region: 'Midwest',
    relationshipStage: 'mature', rhs: 79, rhsChange: 1,
    products: ['equipment', 'cards', 'loc', 'deposits'], primaryProduct: 'Term Loan',
    assignedRM: 'Sarah Mitchell', depositBalance: 412000, totalExposure: 338900, productCount: 3,
    lastActivity: '2026-01-25',
  },
  {
    id: 'biz-008', businessName: 'TechVenture Solutions', legalName: 'TechVenture Solutions Inc.',
    industry: 'Technology', naicsCode: '541512', city: 'San Francisco', state: 'CA',
    annualRevenue: 2200000, employeeCount: 28, yearsInBusiness: 3,
    riskTier: 'low', segment: 'small', region: 'West',
    relationshipStage: 'new', rhs: 91, rhsChange: 5,
    products: ['cards', 'deposits'], primaryProduct: 'Business Credit Card',
    assignedRM: 'David Park', depositBalance: 385000, totalExposure: 50000, productCount: 2,
    lastActivity: '2026-01-29',
  },
  {
    id: 'biz-009', businessName: 'Urban Retail Partners', legalName: 'Urban Retail Partners LP',
    industry: 'Retail', naicsCode: '445110', city: 'Chicago', state: 'IL',
    annualRevenue: 950000, employeeCount: 18, yearsInBusiness: 2,
    riskTier: 'high', segment: 'micro', region: 'Midwest',
    relationshipStage: 'at-risk', rhs: 48, rhsChange: -4,
    products: ['deposits'], primaryProduct: 'Business Checking',
    assignedRM: 'Jennifer Adams', depositBalance: 18700, totalExposure: 0, productCount: 1,
    lastActivity: '2026-01-26',
  },
  {
    id: 'biz-010', businessName: 'Pacific Marine Services', legalName: 'Pacific Marine Services LLC',
    industry: 'Marine Services', naicsCode: '483211', city: 'Seattle', state: 'WA',
    annualRevenue: 6700000, employeeCount: 65, yearsInBusiness: 11,
    riskTier: 'medium', segment: 'mid-market', region: 'West',
    relationshipStage: 'growing', rhs: 74, rhsChange: 2,
    products: ['loc', 'equipment', 'deposits'], primaryProduct: 'Line of Credit',
    assignedRM: 'Sarah Mitchell', depositBalance: 289000, totalExposure: 145000, productCount: 2,
    lastActivity: '2026-01-28',
  },

  // ── biz-011 to biz-036: additional customers for filter coverage ────────

  // Northeast customers (7)
  {
    id: 'biz-011', businessName: 'Empire State Digital', legalName: 'Empire State Digital Inc.',
    industry: 'Technology', naicsCode: '541511', city: 'New York', state: 'NY',
    annualRevenue: 7200000, employeeCount: 95, yearsInBusiness: 8,
    riskTier: 'low', segment: 'mid-market', region: 'Northeast',
    relationshipStage: 'mature', rhs: 84, rhsChange: 2,
    products: ['loc', 'cards', 'merchant', 'deposits'], primaryProduct: 'Line of Credit',
    assignedRM: 'Sarah Mitchell', depositBalance: 620000, totalExposure: 480000, productCount: 4,
    lastActivity: '2026-01-27',
  },
  {
    id: 'biz-012', businessName: 'Harbor Freight Logistics', legalName: 'Harbor Freight Logistics LLC',
    industry: 'Transportation', naicsCode: '484110', city: 'Boston', state: 'MA',
    annualRevenue: 3800000, employeeCount: 55, yearsInBusiness: 14,
    riskTier: 'medium', segment: 'small', region: 'Northeast',
    relationshipStage: 'growing', rhs: 71, rhsChange: 1,
    products: ['auto', 'loc', 'deposits'], primaryProduct: 'Auto Fleet',
    assignedRM: 'David Park', depositBalance: 245000, totalExposure: 320000, productCount: 3,
    lastActivity: '2026-01-25',
  },
  {
    id: 'biz-013', businessName: 'Liberty Dental Group', legalName: 'Liberty Dental Group PC',
    industry: 'Healthcare', naicsCode: '621111', city: 'Hartford', state: 'CT',
    annualRevenue: 2900000, employeeCount: 38, yearsInBusiness: 11,
    riskTier: 'low', segment: 'small', region: 'Northeast',
    relationshipStage: 'mature', rhs: 80, rhsChange: 0,
    products: ['sba', 'cards', 'deposits'], primaryProduct: 'SBA 7(a) Loan',
    assignedRM: 'Jennifer Adams', depositBalance: 310000, totalExposure: 175000, productCount: 3,
    lastActivity: '2026-01-24',
  },
  {
    id: 'biz-014', businessName: 'BrightPath Tutoring', legalName: 'BrightPath Tutoring LLC',
    industry: 'Education Services', naicsCode: '611710', city: 'Newark', state: 'NJ',
    annualRevenue: 320000, employeeCount: 8, yearsInBusiness: 2,
    riskTier: 'medium', segment: 'micro', region: 'Northeast',
    relationshipStage: 'new', rhs: 58, rhsChange: 2,
    products: ['cards', 'deposits'], primaryProduct: 'Business Credit Card',
    assignedRM: 'David Park', depositBalance: 28000, totalExposure: 15000, productCount: 2,
    lastActivity: '2026-01-20',
  },
  {
    id: 'biz-015', businessName: 'Granite State Builders', legalName: 'Granite State Builders Inc.',
    industry: 'Construction', naicsCode: '236220', city: 'Manchester', state: 'NH',
    annualRevenue: 420000, employeeCount: 12, yearsInBusiness: 5,
    riskTier: 'medium', segment: 'micro', region: 'Northeast',
    relationshipStage: 'growing', rhs: 66, rhsChange: 3,
    products: ['sba', 'equipment', 'deposits'], primaryProduct: 'SBA Express Loan',
    assignedRM: 'Sarah Mitchell', depositBalance: 42000, totalExposure: 85000, productCount: 3,
    lastActivity: '2026-01-22',
  },
  {
    id: 'biz-016', businessName: 'Atlantic Seafood Co', legalName: 'Atlantic Seafood Company LLC',
    industry: 'Food & Beverage', naicsCode: '311710', city: 'Providence', state: 'RI',
    annualRevenue: 1100000, employeeCount: 22, yearsInBusiness: 18,
    riskTier: 'low', segment: 'small', region: 'Northeast',
    relationshipStage: 'mature', rhs: 77, rhsChange: 0,
    products: ['loc', 'merchant', 'deposits'], primaryProduct: 'Line of Credit',
    assignedRM: 'Jennifer Adams', depositBalance: 165000, totalExposure: 120000, productCount: 3,
    lastActivity: '2026-01-23',
  },
  {
    id: 'biz-017', businessName: 'Hudson Valley Farms', legalName: 'Hudson Valley Farms LLC',
    industry: 'Agriculture', naicsCode: '111000', city: 'Albany', state: 'NY',
    annualRevenue: 280000, employeeCount: 6, yearsInBusiness: 3,
    riskTier: 'high', segment: 'micro', region: 'Northeast',
    relationshipStage: 'prospect', rhs: 45, rhsChange: -2,
    products: ['deposits'], primaryProduct: 'Business Checking',
    assignedRM: 'David Park', depositBalance: 12500, totalExposure: 0, productCount: 1,
    lastActivity: '2026-01-18',
  },

  // Southeast customers (7)
  {
    id: 'biz-018', businessName: 'Peachtree Medical Associates', legalName: 'Peachtree Medical Associates PA',
    industry: 'Healthcare', naicsCode: '621111', city: 'Atlanta', state: 'GA',
    annualRevenue: 6400000, employeeCount: 78, yearsInBusiness: 15,
    riskTier: 'low', segment: 'mid-market', region: 'Southeast',
    relationshipStage: 'mature', rhs: 85, rhsChange: 1,
    products: ['cre', 'loc', 'cards', 'deposits'], primaryProduct: 'Commercial RE Loan',
    assignedRM: 'Sarah Mitchell', depositBalance: 890000, totalExposure: 720000, productCount: 4,
    lastActivity: '2026-01-29',
  },
  {
    id: 'biz-019', businessName: 'Carolina BBQ Supply', legalName: 'Carolina BBQ Supply Inc.',
    industry: 'Wholesale Trade', naicsCode: '424490', city: 'Charlotte', state: 'NC',
    annualRevenue: 1400000, employeeCount: 16, yearsInBusiness: 7,
    riskTier: 'medium', segment: 'small', region: 'Southeast',
    relationshipStage: 'growing', rhs: 69, rhsChange: 2,
    products: ['merchant', 'auto', 'deposits'], primaryProduct: 'Merchant Services',
    assignedRM: 'David Park', depositBalance: 118000, totalExposure: 95000, productCount: 3,
    lastActivity: '2026-01-26',
  },
  {
    id: 'biz-020', businessName: 'Sunshine Auto Repair', legalName: 'Sunshine Auto Repair LLC',
    industry: 'Automotive Services', naicsCode: '811111', city: 'Tampa', state: 'FL',
    annualRevenue: 380000, employeeCount: 9, yearsInBusiness: 4,
    riskTier: 'medium', segment: 'micro', region: 'Southeast',
    relationshipStage: 'new', rhs: 60, rhsChange: 1,
    products: ['auto', 'deposits'], primaryProduct: 'Auto Equipment Loan',
    assignedRM: 'Jennifer Adams', depositBalance: 31000, totalExposure: 48000, productCount: 2,
    lastActivity: '2026-01-21',
  },
  {
    id: 'biz-021', businessName: 'Savannah Event Planners', legalName: 'Savannah Event Planners LLC',
    industry: 'Event Services', naicsCode: '561920', city: 'Savannah', state: 'GA',
    annualRevenue: 190000, employeeCount: 4, yearsInBusiness: 1,
    riskTier: 'high', segment: 'micro', region: 'Southeast',
    relationshipStage: 'prospect', rhs: 41, rhsChange: 0,
    products: ['deposits'], primaryProduct: 'Business Checking',
    assignedRM: 'David Park', depositBalance: 8900, totalExposure: 0, productCount: 1,
    lastActivity: '2026-01-15',
  },
  {
    id: 'biz-022', businessName: 'Lowcountry Brewing Co', legalName: 'Lowcountry Brewing Company LLC',
    industry: 'Food & Beverage', naicsCode: '312120', city: 'Charleston', state: 'SC',
    annualRevenue: 2600000, employeeCount: 32, yearsInBusiness: 6,
    riskTier: 'low', segment: 'small', region: 'Southeast',
    relationshipStage: 'growing', rhs: 76, rhsChange: 4,
    products: ['sba', 'equipment', 'merchant', 'deposits'], primaryProduct: 'SBA 504 Loan',
    assignedRM: 'Sarah Mitchell', depositBalance: 210000, totalExposure: 340000, productCount: 4,
    lastActivity: '2026-01-28',
  },
  {
    id: 'biz-023', businessName: 'Magnolia Staffing', legalName: 'Magnolia Staffing Solutions Inc.',
    industry: 'Staffing Services', naicsCode: '561311', city: 'Jacksonville', state: 'FL',
    annualRevenue: 5800000, employeeCount: 145, yearsInBusiness: 10,
    riskTier: 'low', segment: 'mid-market', region: 'Southeast',
    relationshipStage: 'growing', rhs: 81, rhsChange: 2,
    products: ['loc', 'cards', 'deposits'], primaryProduct: 'Line of Credit',
    assignedRM: 'Jennifer Adams', depositBalance: 520000, totalExposure: 400000, productCount: 3,
    lastActivity: '2026-01-27',
  },
  {
    id: 'biz-024', businessName: 'Palmetto Landscaping', legalName: 'Palmetto Landscaping LLC',
    industry: 'Landscaping Services', naicsCode: '561730', city: 'Raleigh', state: 'NC',
    annualRevenue: 450000, employeeCount: 14, yearsInBusiness: 3,
    riskTier: 'medium', segment: 'micro', region: 'Southeast',
    relationshipStage: 'new', rhs: 57, rhsChange: 1,
    products: ['equipment', 'deposits'], primaryProduct: 'Equipment Lease',
    assignedRM: 'David Park', depositBalance: 24000, totalExposure: 35000, productCount: 2,
    lastActivity: '2026-01-19',
  },

  // Midwest customers (additional — biz-007 and biz-009 already Midwest)
  {
    id: 'biz-025', businessName: 'Great Lakes Plating', legalName: 'Great Lakes Plating Inc.',
    industry: 'Manufacturing', naicsCode: '332710', city: 'Cleveland', state: 'OH',
    annualRevenue: 11200000, employeeCount: 190, yearsInBusiness: 28,
    riskTier: 'low', segment: 'mid-market', region: 'Midwest',
    relationshipStage: 'mature', rhs: 83, rhsChange: 1,
    products: ['equipment', 'cre', 'loc', 'deposits'], primaryProduct: 'Equipment Financing',
    assignedRM: 'Sarah Mitchell', depositBalance: 980000, totalExposure: 1200000, productCount: 4,
    lastActivity: '2026-01-29',
  },
  {
    id: 'biz-026', businessName: 'Prairie Wind Energy', legalName: 'Prairie Wind Energy LLC',
    industry: 'Renewable Energy', naicsCode: '221115', city: 'Des Moines', state: 'IA',
    annualRevenue: 3100000, employeeCount: 40, yearsInBusiness: 6,
    riskTier: 'low', segment: 'small', region: 'Midwest',
    relationshipStage: 'growing', rhs: 78, rhsChange: 3,
    products: ['sba', 'cre', 'deposits'], primaryProduct: 'SBA 504 Green Loan',
    assignedRM: 'Jennifer Adams', depositBalance: 275000, totalExposure: 420000, productCount: 3,
    lastActivity: '2026-01-25',
  },
  {
    id: 'biz-027', businessName: 'Heartland Trucking', legalName: 'Heartland Trucking Inc.',
    industry: 'Transportation', naicsCode: '484110', city: 'Milwaukee', state: 'WI',
    annualRevenue: 4500000, employeeCount: 68, yearsInBusiness: 19,
    riskTier: 'medium', segment: 'small', region: 'Midwest',
    relationshipStage: 'at-risk', rhs: 52, rhsChange: -5,
    products: ['auto', 'loc', 'deposits'], primaryProduct: 'Fleet Financing',
    assignedRM: 'David Park', depositBalance: 156000, totalExposure: 380000, productCount: 3,
    lastActivity: '2026-01-28',
  },
  {
    id: 'biz-028', businessName: 'Twin Cities Bakery', legalName: 'Twin Cities Bakery LLC',
    industry: 'Food & Beverage', naicsCode: '311811', city: 'Minneapolis', state: 'MN',
    annualRevenue: 240000, employeeCount: 7, yearsInBusiness: 2,
    riskTier: 'medium', segment: 'micro', region: 'Midwest',
    relationshipStage: 'new', rhs: 55, rhsChange: 0,
    products: ['merchant', 'deposits'], primaryProduct: 'Merchant Services',
    assignedRM: 'Jennifer Adams', depositBalance: 19000, totalExposure: 0, productCount: 2,
    lastActivity: '2026-01-17',
  },
  {
    id: 'biz-029', businessName: 'Buckeye Dental Labs', legalName: 'Buckeye Dental Laboratories Inc.',
    industry: 'Healthcare', naicsCode: '339116', city: 'Columbus', state: 'OH',
    annualRevenue: 1600000, employeeCount: 24, yearsInBusiness: 9,
    riskTier: 'low', segment: 'small', region: 'Midwest',
    relationshipStage: 'growing', rhs: 75, rhsChange: 2,
    products: ['sba', 'cards', 'merchant', 'deposits'], primaryProduct: 'SBA Express',
    assignedRM: 'Sarah Mitchell', depositBalance: 148000, totalExposure: 110000, productCount: 4,
    lastActivity: '2026-01-24',
  },

  // Southwest customers (additional — biz-001, biz-002, biz-004 already Southwest)
  {
    id: 'biz-030', businessName: 'Desert Sun Solar', legalName: 'Desert Sun Solar Installations LLC',
    industry: 'Construction', naicsCode: '238220', city: 'Albuquerque', state: 'NM',
    annualRevenue: 2800000, employeeCount: 36, yearsInBusiness: 5,
    riskTier: 'low', segment: 'small', region: 'Southwest',
    relationshipStage: 'growing', rhs: 77, rhsChange: 4,
    products: ['sba', 'equipment', 'deposits'], primaryProduct: 'SBA 504 Loan',
    assignedRM: 'David Park', depositBalance: 195000, totalExposure: 225000, productCount: 3,
    lastActivity: '2026-01-27',
  },
  {
    id: 'biz-031', businessName: 'Rio Grande Veterinary', legalName: 'Rio Grande Veterinary Clinic PA',
    industry: 'Healthcare', naicsCode: '541940', city: 'El Paso', state: 'TX',
    annualRevenue: 680000, employeeCount: 11, yearsInBusiness: 8,
    riskTier: 'low', segment: 'small', region: 'Southwest',
    relationshipStage: 'mature', rhs: 81, rhsChange: 1,
    products: ['cre', 'cards', 'deposits'], primaryProduct: 'Commercial Mortgage',
    assignedRM: 'Jennifer Adams', depositBalance: 92000, totalExposure: 310000, productCount: 3,
    lastActivity: '2026-01-23',
  },
  {
    id: 'biz-032', businessName: 'Lone Star Food Truck', legalName: 'Lone Star Food Truck LLC',
    industry: 'Food Services', naicsCode: '722330', city: 'San Antonio', state: 'TX',
    annualRevenue: 160000, employeeCount: 3, yearsInBusiness: 1,
    riskTier: 'high', segment: 'micro', region: 'Southwest',
    relationshipStage: 'prospect', rhs: 38, rhsChange: -1,
    products: ['merchant', 'deposits'], primaryProduct: 'Merchant POS',
    assignedRM: 'David Park', depositBalance: 6200, totalExposure: 0, productCount: 2,
    lastActivity: '2026-01-12',
  },
  {
    id: 'biz-033', businessName: 'Tulsa Oil Equipment', legalName: 'Tulsa Oil Equipment Rentals Inc.',
    industry: 'Oil & Gas Services', naicsCode: '213112', city: 'Tulsa', state: 'OK',
    annualRevenue: 8500000, employeeCount: 110, yearsInBusiness: 20,
    riskTier: 'medium', segment: 'mid-market', region: 'Southwest',
    relationshipStage: 'at-risk', rhs: 54, rhsChange: -6,
    products: ['equipment', 'cre', 'auto', 'deposits'], primaryProduct: 'Equipment LOC',
    assignedRM: 'Sarah Mitchell', depositBalance: 340000, totalExposure: 920000, productCount: 4,
    lastActivity: '2026-01-29',
  },

  // West customers (additional — biz-003, biz-005, biz-008, biz-010 already West)
  {
    id: 'biz-034', businessName: 'Golden Gate Consulting', legalName: 'Golden Gate Consulting Group LLC',
    industry: 'Management Consulting', naicsCode: '541611', city: 'San Jose', state: 'CA',
    annualRevenue: 5600000, employeeCount: 48, yearsInBusiness: 10,
    riskTier: 'low', segment: 'mid-market', region: 'West',
    relationshipStage: 'mature', rhs: 87, rhsChange: 2,
    products: ['loc', 'cards', 'merchant', 'deposits'], primaryProduct: 'Working Capital LOC',
    assignedRM: 'Jennifer Adams', depositBalance: 710000, totalExposure: 350000, productCount: 4,
    lastActivity: '2026-01-28',
  },
  {
    id: 'biz-035', businessName: 'Cascade Pet Care', legalName: 'Cascade Pet Care Inc.',
    industry: 'Veterinary Services', naicsCode: '541940', city: 'Portland', state: 'OR',
    annualRevenue: 350000, employeeCount: 10, yearsInBusiness: 3,
    riskTier: 'medium', segment: 'micro', region: 'West',
    relationshipStage: 'new', rhs: 59, rhsChange: 2,
    products: ['sba', 'deposits'], primaryProduct: 'SBA Microloan',
    assignedRM: 'David Park', depositBalance: 22000, totalExposure: 45000, productCount: 2,
    lastActivity: '2026-01-16',
  },
  {
    id: 'biz-036', businessName: 'Silver State Logistics', legalName: 'Silver State Logistics LLC',
    industry: 'Warehousing', naicsCode: '493110', city: 'Las Vegas', state: 'NV',
    annualRevenue: 7800000, employeeCount: 130, yearsInBusiness: 13,
    riskTier: 'low', segment: 'mid-market', region: 'West',
    relationshipStage: 'growing', rhs: 80, rhsChange: 3,
    products: ['cre', 'auto', 'loc', 'deposits'], primaryProduct: 'CRE Warehouse Loan',
    assignedRM: 'Sarah Mitchell', depositBalance: 560000, totalExposure: 680000, productCount: 4,
    lastActivity: '2026-01-26',
  },

  // Additional Midwest
  {
    id: 'biz-037', businessName: 'Cornfield Ag Supply', legalName: 'Cornfield Agricultural Supply Co.',
    industry: 'Agriculture', naicsCode: '111000', city: 'Cedar Rapids', state: 'IA',
    annualRevenue: 390000, employeeCount: 8, yearsInBusiness: 4,
    riskTier: 'medium', segment: 'micro', region: 'Midwest',
    relationshipStage: 'prospect', rhs: 50, rhsChange: -1,
    products: ['deposits'], primaryProduct: 'Business Checking',
    assignedRM: 'David Park', depositBalance: 15000, totalExposure: 0, productCount: 1,
    lastActivity: '2026-01-14',
  },

  // Additional Southeast — at-risk
  {
    id: 'biz-038', businessName: 'Gulf Coast Marine', legalName: 'Gulf Coast Marine Repair LLC',
    industry: 'Marine Services', naicsCode: '811490', city: 'Mobile', state: 'AL',
    annualRevenue: 1200000, employeeCount: 15, yearsInBusiness: 9,
    riskTier: 'high', segment: 'small', region: 'Southeast',
    relationshipStage: 'at-risk', rhs: 46, rhsChange: -7,
    products: ['equipment', 'auto', 'deposits'], primaryProduct: 'Equipment Loan',
    assignedRM: 'Jennifer Adams', depositBalance: 45000, totalExposure: 185000, productCount: 3,
    lastActivity: '2026-01-28',
  },

  // Additional Southwest — new
  {
    id: 'biz-039', businessName: 'Cactus Creek Wellness', legalName: 'Cactus Creek Wellness Spa LLC',
    industry: 'Health & Wellness', naicsCode: '812199', city: 'Scottsdale', state: 'AZ',
    annualRevenue: 520000, employeeCount: 12, yearsInBusiness: 2,
    riskTier: 'medium', segment: 'small', region: 'Southwest',
    relationshipStage: 'new', rhs: 63, rhsChange: 3,
    products: ['cards', 'merchant', 'deposits'], primaryProduct: 'Business Credit Card',
    assignedRM: 'Sarah Mitchell', depositBalance: 48000, totalExposure: 20000, productCount: 3,
    lastActivity: '2026-01-22',
  },

  // Additional West — growing
  {
    id: 'biz-040', businessName: 'Redwood Analytics', legalName: 'Redwood Analytics Corp.',
    industry: 'Data Analytics', naicsCode: '518210', city: 'Sacramento', state: 'CA',
    annualRevenue: 4100000, employeeCount: 55, yearsInBusiness: 5,
    riskTier: 'low', segment: 'small', region: 'West',
    relationshipStage: 'growing', rhs: 83, rhsChange: 5,
    products: ['loc', 'cards', 'deposits'], primaryProduct: 'Growth LOC',
    assignedRM: 'David Park', depositBalance: 320000, totalExposure: 200000, productCount: 3,
    lastActivity: '2026-01-27',
  },

  // Additional Midwest — growing mid-market
  {
    id: 'biz-041', businessName: 'Lakeshore Distribution', legalName: 'Lakeshore Distribution Inc.',
    industry: 'Distribution', naicsCode: '423990', city: 'Indianapolis', state: 'IN',
    annualRevenue: 6900000, employeeCount: 85, yearsInBusiness: 16,
    riskTier: 'low', segment: 'mid-market', region: 'Midwest',
    relationshipStage: 'growing', rhs: 79, rhsChange: 2,
    products: ['cre', 'auto', 'merchant', 'deposits'], primaryProduct: 'CRE Warehouse',
    assignedRM: 'Jennifer Adams', depositBalance: 450000, totalExposure: 520000, productCount: 4,
    lastActivity: '2026-01-26',
  },
];
