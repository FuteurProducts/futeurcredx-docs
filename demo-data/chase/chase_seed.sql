-- ============================================================================
-- CHASE COMMERCIAL BANKING — DEMO DATA SEED
-- ============================================================================
-- Generated: 2026-02-11
-- Source: JPMorgan Chase SEC filings, FDIC data, SBA statistics, market research
-- Research: CHASE-SYNTH-2 (quantitative + segments analysis)
--
-- Portfolio Overview:
--   - 6,000,000 small business customers served nationally
--   - $285B total portfolio exposure ($650B deposits + $600B loans)
--   - 4,827 branches across 48 states
--   - #1 small business bank in the U.S.
--   - 8 industry segments with detailed business profiles
--
-- Usage: psql -U <user> -d <database> -f demo-data/chase/chase_seed.sql
-- ============================================================================

BEGIN;

-- ── Bank Configuration ───────────────────────────────────────────────────────

INSERT INTO banks (id, name, display_name, legal_name, primary_color, secondary_color, logo_url)
VALUES ('chase', 'Chase for Business', 'Chase', 'JPMorgan Chase Bank, N.A.', '#117ACA', '#0A5CA8', '/assets/logos/chase.svg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color;

-- ── Portfolio Summary ─────────────────────────────────────────────────────────

INSERT INTO portfolio_summaries (bank_id, total_businesses, total_exposure, avg_credit_score, pre_qualified_rate, at_risk_rate, offer_potential, updated_at)
VALUES ('chase', 6000000, 285000000000, 715, 0.67, 0.13, 145000000000, NOW())
ON CONFLICT (bank_id) DO UPDATE SET
  total_businesses = EXCLUDED.total_businesses,
  total_exposure = EXCLUDED.total_exposure,
  avg_credit_score = EXCLUDED.avg_credit_score,
  pre_qualified_rate = EXCLUDED.pre_qualified_rate,
  at_risk_rate = EXCLUDED.at_risk_rate,
  offer_potential = EXCLUDED.offer_potential,
  updated_at = EXCLUDED.updated_at;

-- ── Industry Segments (8) ─────────────────────────────────────────────────────

INSERT INTO segments (bank_id, id, name, icon, business_count, total_exposure, pre_qualified_rate, growth_trend, trend_value, color, description) VALUES
  ('chase', 'professional_services', 'Professional Services', 'Briefcase', 1080000, 51300000000, 0.68, 'stable', 0.03, 'blue', 'Consulting, legal, accounting, marketing, and knowledge-intensive professional services'),
  ('chase', 'retail_trade', 'Retail Trade', 'ShoppingCart', 960000, 45600000000, 0.58, 'contracting', -0.02, 'purple', 'Brick-and-mortar and e-commerce retail operations'),
  ('chase', 'food_service', 'Food Service', 'UtensilsCrossed', 900000, 42800000000, 0.52, 'stable', 0.04, 'orange', 'Restaurants, catering, and food production'),
  ('chase', 'healthcare', 'Healthcare', 'Heart', 840000, 39900000000, 0.72, 'expanding', 0.06, 'red', 'Medical practices, dental offices, clinics, and healthcare services'),
  ('chase', 'construction', 'Construction', 'HardHat', 780000, 37100000000, 0.48, 'expanding', 0.05, 'yellow', 'Contractors, builders, and trades'),
  ('chase', 'technology', 'Technology', 'Cpu', 720000, 34200000000, 0.74, 'expanding', 0.09, 'indigo', 'Software, IT services, SaaS, and technology consulting'),
  ('chase', 'manufacturing', 'Manufacturing', 'Factory', 480000, 22800000000, 0.62, 'expanding', 0.04, 'gray', 'Production, fabrication, and assembly operations'),
  ('chase', 'transportation', 'Transportation & Logistics', 'Truck', 240000, 11400000000, 0.55, 'stable', 0.02, 'green', 'Trucking, delivery services, and logistics operations')
ON CONFLICT (bank_id, id) DO UPDATE SET
  name = EXCLUDED.name,
  business_count = EXCLUDED.business_count,
  total_exposure = EXCLUDED.total_exposure,
  pre_qualified_rate = EXCLUDED.pre_qualified_rate,
  growth_trend = EXCLUDED.growth_trend,
  trend_value = EXCLUDED.trend_value,
  description = EXCLUDED.description;

-- ── Products (Real Chase Products) ────────────────────────────────────────────

INSERT INTO products (bank_id, id, name, category, credit_min, credit_max, annual_fee, target_segment, description) VALUES
  ('chase', 'ink_preferred', 'Ink Business Preferred Credit Card', 'Credit Card', 680, 850, 95, 'technology,professional_services,healthcare', 'Premium rewards card earning 3X on first $150K in combined purchases'),
  ('chase', 'ink_unlimited', 'Ink Business Unlimited Credit Card', 'Credit Card', 650, 850, 0, 'technology,professional_services,retail_trade', 'Unlimited 1.5% cash back on all purchases with no annual fee'),
  ('chase', 'ink_cash', 'Ink Business Cash Credit Card', 'Credit Card', 640, 850, 0, 'retail_trade,food_service,healthcare', '5% cash back on first $25K in office supplies, internet, phone, cable'),
  ('chase', 'business_complete', 'Business Complete Banking', 'Checking Account', 0, 1000, 0, 'all', 'Full-service business checking with digital tools and no monthly fee'),
  ('chase', 'business_loc', 'Business Line of Credit', 'Line of Credit', 680, 850, 0, 'construction,manufacturing,food_service,retail_trade', 'Flexible revolving credit line up to $500K for working capital'),
  ('chase', 'equipment_financing', 'Equipment Financing', 'Term Loan', 660, 850, 0, 'healthcare,construction,manufacturing,transportation', 'Loans and leases for business equipment purchases'),
  ('chase', 'sba_7a', 'SBA 7(a) Loan', 'SBA Loan', 680, 850, 0, 'food_service,healthcare,retail_trade', 'SBA-backed loans up to $5M for expansion and working capital'),
  ('chase', 'merchant_services', 'Chase Merchant Services', 'Payment Processing', 0, 1000, 0, 'retail_trade,food_service,professional_services', 'Payment processing and point-of-sale solutions'),
  ('chase', 'business_savings', 'Business Savings Account', 'Savings', 0, 1000, 0, 'all', 'Interest-bearing savings with FDIC insurance'),
  ('chase', 'trade_finance', 'Trade Finance Solutions', 'Trade Finance', 700, 850, 0, 'manufacturing', 'Import/export financing and letters of credit'),
  ('chase', 'fuel_cards', 'Business Fuel Cards', 'Fleet Card', 640, 850, 0, 'transportation', 'Fleet fuel management and rebate programs'),
  ('chase', 'treasury_management', 'Treasury Management Services', 'Cash Management', 0, 1000, 0, 'all', 'Enterprise-grade cash flow and payment management')
ON CONFLICT (bank_id, id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  credit_min = EXCLUDED.credit_min,
  credit_max = EXCLUDED.credit_max,
  annual_fee = EXCLUDED.annual_fee,
  target_segment = EXCLUDED.target_segment,
  description = EXCLUDED.description;

-- ── Campaigns (3 Active) ──────────────────────────────────────────────────────

INSERT INTO campaigns (bank_id, id, name, product_id, target_segment, eligible_businesses, potential_revenue, conversion_rate, status, start_date, end_date) VALUES
  ('chase', 'ink_2026_q1', 'Ink Preferred Q1 2026 Acquisition', 'ink_preferred', 'technology,professional_services', 533000, 45300000, 0.12, 'active', '2026-01-01', '2026-03-31'),
  ('chase', 'loc_construction_2026', 'Business LOC - Construction Spring 2026', 'business_loc', 'construction', 374400, 112320000, 0.18, 'active', '2026-02-01', '2026-05-31'),
  ('chase', 'equipment_healthcare_2026', 'Equipment Financing - Healthcare Expansion', 'equipment_financing', 'healthcare', 604800, 151200000, 0.15, 'active', '2026-01-15', '2026-06-30')
ON CONFLICT (bank_id, id) DO UPDATE SET
  eligible_businesses = EXCLUDED.eligible_businesses,
  potential_revenue = EXCLUDED.potential_revenue,
  conversion_rate = EXCLUDED.conversion_rate,
  status = EXCLUDED.status;

-- ── Sample Businesses (120 across all segments) ───────────────────────────────

INSERT INTO businesses (bank_id, id, name, industry, state, credit_score, annual_revenue, years_in_business, employees, current_exposure, segment, risk_tier) VALUES
  -- Professional Services (18%)
  ('chase', 'chase_biz_001', 'Sterling Consulting Group', 'Management Consulting', 'NY', 782, 2400000, 12, 18, 125000, 'professional_services', 'low'),
  ('chase', 'chase_biz_002', 'Apex Legal Partners', 'Legal Services', 'CA', 795, 3200000, 15, 24, 185000, 'professional_services', 'low'),
  ('chase', 'chase_biz_003', 'Brightwave Marketing', 'Marketing Agency', 'TX', 748, 1800000, 8, 14, 92000, 'professional_services', 'low'),
  ('chase', 'chase_biz_004', 'Summit Accounting & Tax', 'Accounting Services', 'IL', 768, 1200000, 10, 9, 68000, 'professional_services', 'low'),
  ('chase', 'chase_biz_005', 'TechBridge IT Solutions', 'IT Consulting', 'WA', 812, 4100000, 14, 32, 240000, 'professional_services', 'low'),
  ('chase', 'chase_biz_006', 'Harbor Architectural Group', 'Architecture', 'MA', 738, 2800000, 18, 21, 152000, 'professional_services', 'low'),
  ('chase', 'chase_biz_007', 'Catalyst HR Consulting', 'Human Resources', 'GA', 755, 980000, 6, 7, 54000, 'professional_services', 'low'),
  ('chase', 'chase_biz_008', 'Meridian Engineering', 'Engineering Services', 'PA', 778, 5200000, 22, 38, 310000, 'professional_services', 'low'),
  ('chase', 'chase_biz_009', 'Vertex Data Analytics', 'Data Science', 'CA', 825, 6400000, 9, 42, 385000, 'professional_services', 'low'),
  ('chase', 'chase_biz_010', 'Crown Financial Advisors', 'Financial Planning', 'FL', 802, 3600000, 16, 28, 215000, 'professional_services', 'low'),
  ('chase', 'chase_biz_011', 'Pinnacle Public Relations', 'PR Agency', 'NY', 712, 1450000, 7, 11, 78000, 'professional_services', 'medium'),
  ('chase', 'chase_biz_012', 'Crestview Design Studio', 'Graphic Design', 'OR', 688, 620000, 4, 5, 38000, 'professional_services', 'medium'),
  ('chase', 'chase_biz_013', 'Pacific Coast Recruiters', 'Staffing Agency', 'CA', 745, 2100000, 11, 16, 128000, 'professional_services', 'low'),
  ('chase', 'chase_biz_014', 'Evergreen Business Consulting', 'Strategy Consulting', 'CO', 792, 4800000, 19, 35, 295000, 'professional_services', 'low'),
  ('chase', 'chase_biz_015', 'Redwood Legal Services', 'Corporate Law', 'CA', 818, 7200000, 24, 52, 425000, 'professional_services', 'low'),
  ('chase', 'chase_biz_016', 'Skyline Architects', 'Architecture', 'NY', 758, 3100000, 13, 23, 182000, 'professional_services', 'low'),
  ('chase', 'chase_biz_017', 'Fusion Creative Agency', 'Advertising', 'TX', 725, 1680000, 6, 13, 95000, 'professional_services', 'medium'),
  ('chase', 'chase_biz_018', 'Cornerstone Tax & Audit', 'Accounting', 'IL', 781, 2200000, 17, 19, 138000, 'professional_services', 'low'),
  ('chase', 'chase_biz_019', 'Lighthouse Management Group', 'Business Consulting', 'FL', 695, 1120000, 5, 8, 62000, 'professional_services', 'medium'),
  ('chase', 'chase_biz_020', 'Quantum Analytics', 'Data Analysis', 'WA', 835, 8400000, 11, 58, 485000, 'professional_services', 'low'),
  ('chase', 'chase_biz_021', 'Blue Horizon HR', 'HR Consulting', 'MA', 708, 875000, 4, 6, 48000, 'professional_services', 'medium'),
  ('chase', 'chase_biz_022', 'Northstar Engineering', 'Civil Engineering', 'OH', 772, 4200000, 20, 31, 258000, 'professional_services', 'low'),

  -- Retail Trade (16%)
  ('chase', 'chase_biz_023', 'Metro Fashion Boutique', 'Apparel Retail', 'NY', 685, 1250000, 8, 12, 72000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_024', 'TechGear Electronics', 'Electronics Retail', 'CA', 728, 2800000, 11, 22, 165000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_025', 'GreenLeaf Garden Center', 'Garden Supplies', 'TX', 652, 980000, 6, 9, 54000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_026', 'Urban Home Furnishings', 'Furniture Retail', 'IL', 712, 3400000, 14, 28, 198000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_027', 'Coastal Surf & Sport', 'Sporting Goods', 'FL', 698, 1650000, 9, 15, 92000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_028', 'Artisan Marketplace', 'Gift Shop', 'WA', 642, 520000, 4, 5, 32000, 'retail_trade', 'high'),
  ('chase', 'chase_biz_029', 'Premier Auto Parts', 'Auto Parts Retail', 'OH', 735, 4200000, 18, 32, 245000, 'retail_trade', 'low'),
  ('chase', 'chase_biz_030', 'Vintage Books & Coffee', 'Bookstore', 'OR', 625, 385000, 3, 4, 24000, 'retail_trade', 'high'),
  ('chase', 'chase_biz_031', 'Bella Fashion Outlet', 'Clothing Store', 'CA', 672, 2100000, 10, 18, 128000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_032', 'Hardware Haven', 'Hardware Store', 'PA', 745, 2850000, 22, 24, 172000, 'retail_trade', 'low'),
  ('chase', 'chase_biz_033', 'Organic Market Co-op', 'Grocery Retail', 'CO', 718, 1920000, 12, 16, 115000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_034', 'Tech Valley Computers', 'Computer Retail', 'NY', 755, 3600000, 15, 26, 215000, 'retail_trade', 'low'),
  ('chase', 'chase_biz_035', 'Sunset Jewelers', 'Jewelry Retail', 'CA', 688, 1450000, 9, 8, 85000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_036', 'Kids World Toys', 'Toy Store', 'TX', 638, 820000, 5, 7, 48000, 'retail_trade', 'high'),
  ('chase', 'chase_biz_037', 'Gourmet Kitchen Supply', 'Kitchenware Retail', 'MA', 702, 1280000, 8, 11, 75000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_038', 'Peak Performance Sports', 'Athletic Apparel', 'CO', 768, 2450000, 13, 20, 148000, 'retail_trade', 'low'),
  ('chase', 'chase_biz_039', 'Lakeshore Marine Supply', 'Marine Equipment', 'MI', 725, 1850000, 16, 14, 108000, 'retail_trade', 'medium'),
  ('chase', 'chase_biz_040', 'Downtown Music & Sound', 'Musical Instruments', 'IL', 658, 975000, 7, 6, 58000, 'retail_trade', 'medium'),

  -- Food Service (15%)
  ('chase', 'chase_biz_041', 'Bella Vita Italian Restaurant', 'Full-Service Restaurant', 'NY', 695, 1850000, 9, 28, 112000, 'food_service', 'medium'),
  ('chase', 'chase_biz_042', 'Urban Burger & Brew', 'Quick Service Restaurant', 'CA', 718, 2200000, 11, 32, 135000, 'food_service', 'medium'),
  ('chase', 'chase_biz_043', 'Sunrise Cafe & Bakery', 'Bakery Cafe', 'TX', 672, 980000, 6, 14, 62000, 'food_service', 'medium'),
  ('chase', 'chase_biz_044', 'Pacific Rim Asian Fusion', 'Asian Restaurant', 'WA', 745, 3100000, 14, 42, 185000, 'food_service', 'low'),
  ('chase', 'chase_biz_045', 'Green Fork Salad Bar', 'Healthy Fast Casual', 'CA', 625, 620000, 4, 9, 38000, 'food_service', 'high'),
  ('chase', 'chase_biz_046', 'Smokehouse BBQ Pit', 'Barbecue Restaurant', 'TX', 688, 1450000, 8, 22, 88000, 'food_service', 'medium'),
  ('chase', 'chase_biz_047', 'Coastal Seafood Grill', 'Seafood Restaurant', 'FL', 712, 2650000, 12, 36, 158000, 'food_service', 'medium'),
  ('chase', 'chase_biz_048', 'Artisan Pizza Kitchen', 'Pizzeria', 'IL', 658, 1120000, 7, 16, 68000, 'food_service', 'medium'),
  ('chase', 'chase_biz_049', 'Mountain View Steakhouse', 'Steakhouse', 'CO', 735, 3800000, 16, 48, 225000, 'food_service', 'low'),
  ('chase', 'chase_biz_050', 'Sweet Treats Dessert Bar', 'Dessert Shop', 'MA', 642, 485000, 3, 7, 28000, 'food_service', 'high'),
  ('chase', 'chase_biz_051', 'Taco Fiesta', 'Mexican Restaurant', 'AZ', 678, 1380000, 9, 24, 82000, 'food_service', 'medium'),
  ('chase', 'chase_biz_052', 'Downtown Deli & Market', 'Delicatessen', 'NY', 705, 920000, 11, 12, 58000, 'food_service', 'medium'),
  ('chase', 'chase_biz_053', 'Harvest Table Farm-to-Fork', 'Farm-to-Table Restaurant', 'OR', 725, 1950000, 8, 26, 118000, 'food_service', 'medium'),
  ('chase', 'chase_biz_054', 'Espresso Lane Coffee House', 'Coffee Shop', 'WA', 638, 425000, 4, 6, 26000, 'food_service', 'high'),
  ('chase', 'chase_biz_055', 'Spice Route Indian Cuisine', 'Indian Restaurant', 'CA', 692, 1680000, 10, 21, 98000, 'food_service', 'medium'),
  ('chase', 'chase_biz_056', 'Garden Bistro', 'Contemporary Restaurant', 'NC', 715, 2100000, 13, 30, 128000, 'food_service', 'medium'),
  ('chase', 'chase_biz_057', 'Wing Zone Sports Bar', 'Sports Bar', 'TX', 665, 1520000, 7, 19, 88000, 'food_service', 'medium'),

  -- Healthcare (14%)
  ('chase', 'chase_biz_058', 'Sunrise Family Medicine', 'Medical Practice', 'CA', 785, 3200000, 16, 24, 195000, 'healthcare', 'low'),
  ('chase', 'chase_biz_059', 'Harbor Dental Associates', 'Dental Office', 'NY', 812, 2800000, 18, 18, 168000, 'healthcare', 'low'),
  ('chase', 'chase_biz_060', 'Peak Performance Physical Therapy', 'Physical Therapy', 'CO', 748, 1650000, 11, 14, 98000, 'healthcare', 'low'),
  ('chase', 'chase_biz_061', 'Vision Care Center', 'Optometry', 'TX', 795, 2100000, 14, 16, 128000, 'healthcare', 'low'),
  ('chase', 'chase_biz_062', 'Wellness Chiropractic Clinic', 'Chiropractic', 'FL', 728, 980000, 8, 7, 62000, 'healthcare', 'low'),
  ('chase', 'chase_biz_063', 'Pediatric Partners', 'Pediatrics', 'IL', 822, 4200000, 22, 32, 258000, 'healthcare', 'low'),
  ('chase', 'chase_biz_064', 'Midtown Dermatology', 'Dermatology', 'NY', 805, 3600000, 19, 26, 218000, 'healthcare', 'low'),
  ('chase', 'chase_biz_065', 'Coastal Urgent Care', 'Urgent Care', 'CA', 762, 5400000, 12, 42, 325000, 'healthcare', 'low'),
  ('chase', 'chase_biz_066', 'Bright Smiles Orthodontics', 'Orthodontics', 'WA', 835, 4800000, 20, 28, 295000, 'healthcare', 'low'),
  ('chase', 'chase_biz_067', 'Serenity Mental Health', 'Psychology Practice', 'MA', 715, 1250000, 9, 11, 75000, 'healthcare', 'low'),
  ('chase', 'chase_biz_068', 'Complete Care Pharmacy', 'Pharmacy', 'OH', 785, 6200000, 24, 38, 385000, 'healthcare', 'low'),
  ('chase', 'chase_biz_069', 'Valley Veterinary Hospital', 'Veterinary Medicine', 'AZ', 758, 2450000, 15, 22, 148000, 'healthcare', 'low'),
  ('chase', 'chase_biz_070', 'Advanced Imaging Center', 'Medical Imaging', 'TX', 795, 7800000, 17, 46, 465000, 'healthcare', 'low'),
  ('chase', 'chase_biz_071', 'Lakeside Speech Therapy', 'Speech Therapy', 'MI', 725, 820000, 7, 6, 52000, 'healthcare', 'low'),
  ('chase', 'chase_biz_072', 'Women\'s Health Specialists', 'Women\'s Health', 'CA', 812, 3900000, 21, 28, 238000, 'healthcare', 'low'),
  ('chase', 'chase_biz_073', 'Heart & Vascular Clinic', 'Cardiology', 'FL', 825, 8400000, 25, 52, 512000, 'healthcare', 'low'),

  -- Construction (13%)
  ('chase', 'chase_biz_074', 'Summit Builders Inc', 'General Contractor', 'TX', 685, 4200000, 14, 38, 258000, 'construction', 'medium'),
  ('chase', 'chase_biz_075', 'Precision Electrical Contractors', 'Electrical', 'CA', 712, 2800000, 18, 24, 172000, 'construction', 'medium'),
  ('chase', 'chase_biz_076', 'Coastal Plumbing Services', 'Plumbing', 'FL', 638, 1450000, 9, 16, 88000, 'construction', 'high'),
  ('chase', 'chase_biz_077', 'Apex Roofing & Siding', 'Roofing', 'NY', 665, 1850000, 11, 18, 112000, 'construction', 'medium'),
  ('chase', 'chase_biz_078', 'Stonework Masonry', 'Masonry', 'MA', 642, 920000, 7, 10, 58000, 'construction', 'high'),
  ('chase', 'chase_biz_079', 'Modern Kitchen & Bath Remodeling', 'Remodeling', 'CO', 695, 2450000, 13, 21, 148000, 'construction', 'medium'),
  ('chase', 'chase_biz_080', 'Skyline HVAC Systems', 'HVAC', 'IL', 718, 3100000, 16, 26, 185000, 'construction', 'medium'),
  ('chase', 'chase_biz_081', 'Evergreen Landscaping & Design', 'Landscaping', 'WA', 625, 780000, 5, 12, 48000, 'construction', 'high'),
  ('chase', 'chase_biz_082', 'Precision Concrete Solutions', 'Concrete', 'TX', 672, 1680000, 10, 15, 98000, 'construction', 'medium'),
  ('chase', 'chase_biz_083', 'Guardian Home Inspections', 'Inspection Services', 'CA', 705, 625000, 6, 5, 38000, 'construction', 'medium'),
  ('chase', 'chase_biz_084', 'Urban Development Group', 'Commercial Construction', 'NY', 745, 8200000, 22, 58, 495000, 'construction', 'low'),
  ('chase', 'chase_biz_085', 'Pacific Northwest Framers', 'Framing', 'OR', 658, 1250000, 8, 14, 75000, 'construction', 'medium'),
  ('chase', 'chase_biz_086', 'Complete Drywall & Painting', 'Drywall', 'AZ', 635, 985000, 6, 11, 62000, 'construction', 'high'),
  ('chase', 'chase_biz_087', 'Foundation Experts LLC', 'Foundation Work', 'TX', 688, 2100000, 12, 19, 128000, 'construction', 'medium'),

  -- Technology (12%)
  ('chase', 'chase_biz_088', 'CloudFirst Software', 'SaaS Development', 'CA', 825, 6400000, 8, 42, 385000, 'technology', 'low'),
  ('chase', 'chase_biz_089', 'CyberShield Security', 'Cybersecurity', 'NY', 842, 8200000, 11, 54, 495000, 'technology', 'low'),
  ('chase', 'chase_biz_090', 'DataFlow Analytics', 'Data Science', 'WA', 818, 5800000, 9, 38, 352000, 'technology', 'low'),
  ('chase', 'chase_biz_091', 'Mobile App Innovators', 'App Development', 'TX', 795, 3900000, 7, 28, 238000, 'technology', 'low'),
  ('chase', 'chase_biz_092', 'Enterprise Cloud Solutions', 'Cloud Consulting', 'CA', 835, 7600000, 12, 48, 458000, 'technology', 'low'),
  ('chase', 'chase_biz_093', 'NetWorks IT Support', 'IT Services', 'IL', 748, 2200000, 10, 18, 135000, 'technology', 'low'),
  ('chase', 'chase_biz_094', 'Digital Marketing Pro', 'Digital Agency', 'FL', 765, 3200000, 9, 24, 195000, 'technology', 'low'),
  ('chase', 'chase_biz_095', 'AI Insights Inc', 'Artificial Intelligence', 'CA', 852, 12400000, 6, 68, 742000, 'technology', 'low'),
  ('chase', 'chase_biz_096', 'WebWorks Design Studio', 'Web Development', 'CO', 728, 1850000, 8, 14, 112000, 'technology', 'low'),
  ('chase', 'chase_biz_097', 'TechSupport Central', 'Help Desk Services', 'MA', 712, 1450000, 11, 16, 88000, 'technology', 'low'),
  ('chase', 'chase_biz_098', 'CodeCraft Developers', 'Software Development', 'WA', 805, 4800000, 10, 32, 295000, 'technology', 'low'),
  ('chase', 'chase_biz_099', 'Quantum Computing Labs', 'R&D Services', 'CA', 862, 18200000, 9, 85, 1095000, 'technology', 'low'),
  ('chase', 'chase_biz_100', 'Platform Integration Partners', 'API Services', 'NY', 782, 5400000, 8, 36, 325000, 'technology', 'low'),

  -- Manufacturing (8%)
  ('chase', 'chase_biz_101', 'Precision Metal Fabrication', 'Metal Fabrication', 'OH', 725, 5200000, 20, 42, 315000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_102', 'American Plastics Manufacturing', 'Plastics', 'MI', 748, 6800000, 24, 58, 412000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_103', 'Custom Machine Shop Inc', 'Machining', 'PA', 692, 3400000, 18, 28, 208000, 'manufacturing', 'medium'),
  ('chase', 'chase_biz_104', 'Valley Electronics Assembly', 'Electronics Assembly', 'CA', 768, 8400000, 22, 68, 512000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_105', 'Midwest Food Processors', 'Food Manufacturing', 'IL', 712, 12200000, 28, 92, 738000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_106', 'Precision Tool & Die', 'Tool & Die', 'OH', 735, 4200000, 26, 32, 258000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_107', 'Eco-Friendly Packaging Co', 'Packaging', 'WA', 755, 5600000, 16, 45, 338000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_108', 'Industrial Coatings & Finishes', 'Chemical Manufacturing', 'TX', 702, 3800000, 19, 34, 232000, 'manufacturing', 'medium'),
  ('chase', 'chase_biz_109', 'Automated Assembly Systems', 'Automation Equipment', 'CA', 778, 9200000, 21, 72, 558000, 'manufacturing', 'low'),
  ('chase', 'chase_biz_110', 'Textile Innovations LLC', 'Textile Manufacturing', 'NC', 688, 4600000, 23, 48, 282000, 'manufacturing', 'medium'),

  -- Transportation & Logistics (4%)
  ('chase', 'chase_biz_111', 'Interstate Freight Lines', 'Trucking', 'TX', 705, 3800000, 16, 32, 232000, 'transportation', 'medium'),
  ('chase', 'chase_biz_112', 'Urban Delivery Solutions', 'Courier Services', 'CA', 728, 2450000, 11, 24, 148000, 'transportation', 'medium'),
  ('chase', 'chase_biz_113', 'Coast-to-Coast Logistics', 'Freight Brokerage', 'IL', 672, 1950000, 9, 18, 118000, 'transportation', 'medium'),
  ('chase', 'chase_biz_114', 'Premium Moving & Storage', 'Moving Services', 'FL', 645, 1280000, 7, 14, 78000, 'transportation', 'high'),
  ('chase', 'chase_biz_115', 'Rapid Express Couriers', 'Delivery Service', 'NY', 692, 1650000, 10, 16, 98000, 'transportation', 'medium'),
  ('chase', 'chase_biz_116', 'Regional Warehousing Inc', 'Warehousing', 'OH', 715, 4200000, 18, 38, 258000, 'transportation', 'low'),
  ('chase', 'chase_biz_117', 'Swift Cargo Services', 'Freight Services', 'TX', 658, 2100000, 8, 20, 128000, 'transportation', 'medium'),
  ('chase', 'chase_biz_118', 'Nationwide Auto Transport', 'Auto Transport', 'CA', 725, 3200000, 14, 26, 195000, 'transportation', 'medium'),
  ('chase', 'chase_biz_119', 'Pacific Shipping Solutions', 'Ocean Freight', 'WA', 748, 5400000, 20, 42, 325000, 'transportation', 'low'),
  ('chase', 'chase_biz_120', 'Express Distribution Network', 'Distribution', 'GA', 682, 2850000, 12, 28, 172000, 'transportation', 'medium')
ON CONFLICT (bank_id, id) DO UPDATE SET
  name = EXCLUDED.name,
  credit_score = EXCLUDED.credit_score,
  annual_revenue = EXCLUDED.annual_revenue,
  current_exposure = EXCLUDED.current_exposure;

-- ── Underwriting Queue (18 Applications) ──────────────────────────────────────

INSERT INTO applications (bank_id, business_id, product_id, amount_requested, status, assigned_analyst, time_in_queue_hours, recommendation, created_at, priority) VALUES
  ('chase', 'chase_biz_088', 'business_loc', 500000, 'pending', 'Maria Rodriguez', 12, 'approve', NOW() - INTERVAL '12 hours', 'high'),
  ('chase', 'chase_biz_074', 'equipment_financing', 350000, 'in_review', 'James Chen', 36, 'approve', NOW() - INTERVAL '36 hours', 'high'),
  ('chase', 'chase_biz_058', 'equipment_financing', 280000, 'pending', 'Sarah Mitchell', 8, 'approve', NOW() - INTERVAL '8 hours', 'medium'),
  ('chase', 'chase_biz_023', 'ink_preferred', 50000, 'in_review', 'David Park', 24, 'review', NOW() - INTERVAL '24 hours', 'medium'),
  ('chase', 'chase_biz_041', 'sba_7a', 450000, 'pending', 'Maria Rodriguez', 48, 'approve', NOW() - INTERVAL '48 hours', 'high'),
  ('chase', 'chase_biz_089', 'business_loc', 750000, 'in_review', 'James Chen', 18, 'approve', NOW() - INTERVAL '18 hours', 'high'),
  ('chase', 'chase_biz_101', 'equipment_financing', 425000, 'pending', 'Sarah Mitchell', 6, 'approve', NOW() - INTERVAL '6 hours', 'medium'),
  ('chase', 'chase_biz_042', 'business_loc', 200000, 'in_review', 'David Park', 42, 'review', NOW() - INTERVAL '42 hours', 'medium'),
  ('chase', 'chase_biz_059', 'equipment_financing', 320000, 'pending', 'Maria Rodriguez', 14, 'approve', NOW() - INTERVAL '14 hours', 'medium'),
  ('chase', 'chase_biz_111', 'fuel_cards', 150000, 'in_review', 'James Chen', 28, 'approve', NOW() - INTERVAL '28 hours', 'low'),
  ('chase', 'chase_biz_002', 'business_loc', 400000, 'pending', 'Sarah Mitchell', 10, 'approve', NOW() - INTERVAL '10 hours', 'high'),
  ('chase', 'chase_biz_076', 'equipment_financing', 180000, 'in_review', 'David Park', 52, 'decline', NOW() - INTERVAL '52 hours', 'low'),
  ('chase', 'chase_biz_090', 'ink_preferred', 75000, 'pending', 'Maria Rodriguez', 4, 'approve', NOW() - INTERVAL '4 hours', 'medium'),
  ('chase', 'chase_biz_047', 'sba_7a', 380000, 'in_review', 'James Chen', 32, 'approve', NOW() - INTERVAL '32 hours', 'high'),
  ('chase', 'chase_biz_068', 'business_loc', 550000, 'pending', 'Sarah Mitchell', 20, 'approve', NOW() - INTERVAL '20 hours', 'high'),
  ('chase', 'chase_biz_102', 'equipment_financing', 480000, 'in_review', 'David Park', 16, 'approve', NOW() - INTERVAL '16 hours', 'medium'),
  ('chase', 'chase_biz_024', 'merchant_services', 25000, 'pending', 'Maria Rodriguez', 2, 'approve', NOW() - INTERVAL '2 hours', 'low'),
  ('chase', 'chase_biz_091', 'business_loc', 350000, 'in_review', 'James Chen', 38, 'approve', NOW() - INTERVAL '38 hours', 'high')
ON CONFLICT (bank_id, business_id, product_id) DO UPDATE SET
  status = EXCLUDED.status,
  time_in_queue_hours = EXCLUDED.time_in_queue_hours;

-- ── Risk Metrics ──────────────────────────────────────────────────────────────

INSERT INTO risk_metrics (bank_id, metric_type, metric_name, current_value, limit_value, status, updated_at) VALUES
  ('chase', 'concentration', 'Technology Segment Concentration', 12.0, 15.0, 'normal', NOW()),
  ('chase', 'concentration', 'Professional Services Concentration', 18.0, 20.0, 'normal', NOW()),
  ('chase', 'concentration', 'California Geographic Concentration', 21.7, 25.0, 'normal', NOW()),
  ('chase', 'credit_quality', 'Net Charge-Off Rate', 0.28, 0.50, 'normal', NOW()),
  ('chase', 'credit_quality', 'Non-Performing Loan Rate', 0.65, 1.50, 'normal', NOW()),
  ('chase', 'credit_quality', '30+ Day Delinquency Rate', 1.85, 3.00, 'normal', NOW()),
  ('chase', 'portfolio', 'At-Risk Portfolio Percentage', 13.0, 15.0, 'normal', NOW()),
  ('chase', 'portfolio', 'Pre-Qualified Rate', 67.0, 60.0, 'favorable', NOW()),
  ('chase', 'exposure', 'Average Exposure Per Business', 47500, 60000, 'normal', NOW()),
  ('chase', 'growth', 'Portfolio Growth YoY', 4.5, 3.0, 'favorable', NOW())
ON CONFLICT (bank_id, metric_type, metric_name) DO UPDATE SET
  current_value = EXCLUDED.current_value,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

-- ── EWS Clusters (Early Warning Signals) ──────────────────────────────────────

INSERT INTO ews_clusters (bank_id, id, name, business_count, exposure, severity, recommended_action, created_at) VALUES
  ('chase', 'ews_retail_downturn', 'Retail Trade Revenue Decline', 38400, 1824000000, 'medium', 'Monitor cash flow trends; consider covenant adjustments for stable performers', NOW() - INTERVAL '2 days'),
  ('chase', 'ews_construction_late_pay', 'Construction Late Payment Pattern', 15600, 741000000, 'high', 'Immediate outreach for businesses 15+ days late; restructure where appropriate', NOW() - INTERVAL '5 days'),
  ('chase', 'ews_food_service_utilization', 'Food Service High Utilization', 27000, 1283000000, 'medium', 'Offer LOC increases to well-performing operators; prevent over-leverage', NOW() - INTERVAL '1 day'),
  ('chase', 'ews_tech_concentration', 'Technology Sector Concentration', 72000, 3420000000, 'low', 'Continue monitoring; diversify new originations across other segments', NOW() - INTERVAL '7 days'),
  ('chase', 'ews_transport_fuel_costs', 'Transportation Margin Compression', 12000, 570000000, 'medium', 'Review fuel card programs; offer operational efficiency consulting', NOW() - INTERVAL '3 days')
ON CONFLICT (bank_id, id) DO UPDATE SET
  business_count = EXCLUDED.business_count,
  exposure = EXCLUDED.exposure,
  severity = EXCLUDED.severity;

-- ── Geographic Distribution ───────────────────────────────────────────────────

INSERT INTO geographic_distribution (bank_id, region, states, portfolio_percentage, business_count, branch_count, market_share_estimate, growth_trend, trend_percentage) VALUES
  ('chase', 'West', 'CA,WA,OR,AZ,NV,CO,UT,HI', 0.30, 1800000, 1396, 0.17, 'expanding', 0.05),
  ('chase', 'Northeast', 'NY,NJ,CT,MA,PA,DC,MD,VA,DE,RI,VT,NH,ME', 0.26, 1560000, 1176, 0.22, 'stable', 0.02),
  ('chase', 'Southeast', 'FL,GA,NC,SC,TN,AL,MS,LA,KY,WV,AR', 0.20, 1200000, 556, 0.14, 'expanding', 0.06),
  ('chase', 'Midwest', 'IL,OH,MI,IN,WI,MN,MO,IA,KS,NE,SD,ND', 0.18, 1080000, 1223, 0.19, 'stable', 0.01),
  ('chase', 'Southwest', 'TX,OK,NM', 0.06, 360000, 476, 0.08, 'expanding', 0.07)
ON CONFLICT (bank_id, region) DO UPDATE SET
  portfolio_percentage = EXCLUDED.portfolio_percentage,
  business_count = EXCLUDED.business_count,
  branch_count = EXCLUDED.branch_count,
  growth_trend = EXCLUDED.growth_trend,
  trend_percentage = EXCLUDED.trend_percentage;

COMMIT;

-- ============================================================================
-- END OF CHASE SEED DATA
-- ============================================================================
-- Summary:
--   - 1 bank profile (Chase)
--   - 1 portfolio summary (6M businesses, $285B exposure)
--   - 8 industry segments
--   - 12 Chase products (real product names)
--   - 3 active campaigns
--   - 120 sample businesses across all segments
--   - 18 underwriting applications
--   - 10 risk metrics
--   - 5 EWS clusters
--   - 5 geographic regions
-- ============================================================================
