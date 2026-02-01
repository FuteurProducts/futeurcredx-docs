-- =============================================================================
-- LumiqAI Phase 2 Seed Script
-- Populates database with realistic 90-day bank pilot data
-- Run with service_role key via Supabase SQL Editor
-- =============================================================================
-- IMPORTANT: Before running this script:
-- 1. Create auth user demo@partnerbank.com / LumiqDemo2026! via Supabase Dashboard
-- 2. Note the user UUID and update DEMO_USER_ID below
-- 3. The handle_new_user trigger will auto-create a profile row
-- =============================================================================

-- ========================
-- CONFIGURATION VARIABLES
-- ========================
-- Replace this UUID with the actual auth.users UUID after creating the demo user
DO $$
DECLARE
  TENANT_ID UUID := '10000000-0000-4000-8000-000000000001';
  PORTFOLIO_ID UUID := '20000000-0000-4000-8000-000000000001';
  DEMO_USER_ID UUID; -- Will be looked up from auth.users
  RULESET_ID UUID := '30000000-0000-4000-8000-000000000001';
  -- SMB Entity IDs (deterministic for the 10 demo businesses)
  SMB_01 UUID := '00000000-0000-4000-8000-000000000001';
  SMB_02 UUID := '00000000-0000-4000-8000-000000000002';
  SMB_03 UUID := '00000000-0000-4000-8000-000000000003';
  SMB_04 UUID := '00000000-0000-4000-8000-000000000004';
  SMB_05 UUID := '00000000-0000-4000-8000-000000000005';
  SMB_06 UUID := '00000000-0000-4000-8000-000000000006';
  SMB_07 UUID := '00000000-0000-4000-8000-000000000007';
  SMB_08 UUID := '00000000-0000-4000-8000-000000000008';
  SMB_09 UUID := '00000000-0000-4000-8000-000000000009';
  SMB_10 UUID := '00000000-0000-4000-8000-000000000010';
  -- Background entity IDs
  i INTEGER;
  bg_id UUID;
  bg_score INTEGER;
  bg_owner_id UUID;
  bg_score_id UUID;
  -- API key IDs
  API_KEY_1 UUID := '40000000-0000-4000-8000-000000000001';
  API_KEY_2 UUID := '40000000-0000-4000-8000-000000000002';
  -- Date tracking
  agg_date DATE;
  day_offset INTEGER;
BEGIN

-- ========================
-- 0. Idempotency guard + user lookup
-- ========================
-- Skip if already seeded (check for known tenant)
IF EXISTS (SELECT 1 FROM public.tenants WHERE id = TENANT_ID) THEN
  RAISE NOTICE 'Seed data already exists for tenant %. Skipping seed.', TENANT_ID;
  RAISE NOTICE 'To re-seed: DELETE FROM public.tenants WHERE id = ''%''; then run again.', TENANT_ID;
  RETURN;
END IF;

SELECT id INTO DEMO_USER_ID FROM auth.users WHERE email = 'demo@partnerbank.com' LIMIT 1;
IF DEMO_USER_ID IS NULL THEN
  RAISE EXCEPTION 'Demo user demo@partnerbank.com not found. Create it via Supabase Dashboard first.';
END IF;

-- ========================
-- 1. TENANT
-- ========================
INSERT INTO public.tenants (id, name, slug, config) VALUES
  (TENANT_ID, 'Partner Bank', 'partner-bank', '{"pilotStartDate":"2025-10-01","pilotEndDate":"2026-01-31","environment":"sandbox"}')
ON CONFLICT (slug) DO NOTHING;

-- ========================
-- 2. PORTFOLIO
-- ========================
INSERT INTO public.portfolios (id, tenant_id, name, code, config) VALUES
  (PORTFOLIO_ID, TENANT_ID, 'SMB Credit Pilot', 'smb-credit-pilot', '{"productTypes":["LOC","Term Loan","SBA","Equipment Financing","Business Credit Card","Working Capital"]}')
ON CONFLICT (tenant_id, code) DO NOTHING;

-- ========================
-- 3. PROFILE (update auto-created)
-- ========================
UPDATE public.profiles
SET tenant_id = TENANT_ID,
    full_name = 'Demo User',
    avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
WHERE id = DEMO_USER_ID;

-- ========================
-- 4. USER ROLE
-- ========================
INSERT INTO public.user_roles (user_id, tenant_id, role) VALUES
  (DEMO_USER_ID, TENANT_ID, 'admin')
ON CONFLICT (user_id, tenant_id, role) DO NOTHING;

-- ========================
-- 5. PORTFOLIO ACCESS
-- ========================
INSERT INTO public.portfolio_access (user_id, portfolio_id, can_export, can_create_keys) VALUES
  (DEMO_USER_ID, PORTFOLIO_ID, true, true)
ON CONFLICT (user_id, portfolio_id) DO NOTHING;

-- ========================
-- 6. SMB ENTITIES (10 demo + 40 background)
-- ========================
INSERT INTO public.smb_entities (id, tenant_id, portfolio_id, business_name, dba_name, naics_code, business_type, address_city, address_state, annual_revenue, employee_count, ein, metadata) VALUES
  (SMB_01, TENANT_ID, PORTFOLIO_ID, 'Stellar Dynamics LLC',           'Stellar Dynamics',       '541511', 'LLC',         'Austin',        'TX', 3400000,  42, '12-3456001', '{"segment":"small","yearsInBusiness":7}'),
  (SMB_02, TENANT_ID, PORTFOLIO_ID, 'Metro Logistics Corporation',    'Metro Logistics Corp',   '484110', 'Corporation', 'Dallas',        'TX', 5200000,  82, '12-3456002', '{"segment":"small","yearsInBusiness":15}'),
  (SMB_03, TENANT_ID, PORTFOLIO_ID, 'Apex Construction Group Inc.',   'Apex Construction',      '236220', 'Corporation', 'Phoenix',       'AZ', 8100000, 120, '12-3456003', '{"segment":"mid_market","yearsInBusiness":12}'),
  (SMB_04, TENANT_ID, PORTFOLIO_ID, 'Sunrise Healthcare Partners LLC','Sunrise Healthcare',     '621111', 'LLC',         'Houston',       'TX', 12500000, 210, '12-3456004', '{"segment":"mid_market","yearsInBusiness":9}'),
  (SMB_05, TENANT_ID, PORTFOLIO_ID, 'GreenLeaf Organics LLC',         'GreenLeaf Organics',     '111000', 'LLC',         'Fresno',        'CA', 1800000,  35, '12-3456005', '{"segment":"micro","yearsInBusiness":4}'),
  (SMB_06, TENANT_ID, PORTFOLIO_ID, 'Coastal Hospitality Group Inc.', 'Coastal Hospitality',    '721110', 'Corporation', 'Miami',         'FL', 4200000,  92, '12-3456006', '{"segment":"small","yearsInBusiness":6}'),
  (SMB_07, TENANT_ID, PORTFOLIO_ID, 'Precision Manufacturing Company','Precision Manufacturing','332710', 'Corporation', 'Detroit',       'MI', 9800000, 175, '12-3456007', '{"segment":"mid_market","yearsInBusiness":22}'),
  (SMB_08, TENANT_ID, PORTFOLIO_ID, 'TechVenture Solutions Inc.',     'TechVenture Solutions',  '541512', 'Corporation', 'San Francisco', 'CA', 2200000,  28, '12-3456008', '{"segment":"small","yearsInBusiness":3}'),
  (SMB_09, TENANT_ID, PORTFOLIO_ID, 'Urban Retail Partners LP',       'Urban Retail Partners',  '445110', 'LP',          'Chicago',       'IL',  950000,  18, '12-3456009', '{"segment":"micro","yearsInBusiness":2}'),
  (SMB_10, TENANT_ID, PORTFOLIO_ID, 'Pacific Marine Services LLC',    'Pacific Marine Services','483211', 'LLC',         'Seattle',       'WA', 6700000,  65, '12-3456010', '{"segment":"small","yearsInBusiness":11}')
ON CONFLICT DO NOTHING;

-- 40 background entities
FOR i IN 11..50 LOOP
  bg_id := ('00000000-0000-4000-8000-0000000000' || LPAD(i::text, 2, '0'))::UUID;
  INSERT INTO public.smb_entities (id, tenant_id, portfolio_id, business_name, naics_code, business_type, address_city, address_state, annual_revenue, employee_count, metadata)
  VALUES (
    bg_id, TENANT_ID, PORTFOLIO_ID,
    'Business Entity ' || i,
    CASE (i % 5) WHEN 0 THEN '541511' WHEN 1 THEN '484110' WHEN 2 THEN '236220' WHEN 3 THEN '621111' ELSE '445110' END,
    CASE (i % 3) WHEN 0 THEN 'LLC' WHEN 1 THEN 'Corporation' ELSE 'LP' END,
    CASE (i % 6) WHEN 0 THEN 'Austin' WHEN 1 THEN 'Dallas' WHEN 2 THEN 'Phoenix' WHEN 3 THEN 'Houston' WHEN 4 THEN 'Chicago' ELSE 'Seattle' END,
    CASE (i % 6) WHEN 0 THEN 'TX' WHEN 1 THEN 'TX' WHEN 2 THEN 'AZ' WHEN 3 THEN 'TX' WHEN 4 THEN 'IL' ELSE 'WA' END,
    1000000 + (i * 150000),
    10 + (i * 3),
    jsonb_build_object('segment', CASE WHEN (1000000 + i * 150000) < 500000 THEN 'micro' WHEN (1000000 + i * 150000) < 5000000 THEN 'small' ELSE 'mid_market' END, 'yearsInBusiness', 2 + (i % 20))
  )
  ON CONFLICT DO NOTHING;
END LOOP;

-- ========================
-- 7. BUSINESS OWNERS (50 rows, 1 per entity)
-- ========================
-- Owner names and emails aligned with enriched demoData.ts
INSERT INTO public.business_owners (smb_entity_id, first_name, last_name, ownership_percentage, is_guarantor, email) VALUES
  (SMB_01, 'James',   'Chen',      85,  true,  'jchen@stellardynamics.com'),
  (SMB_02, 'Maria',   'Rodriguez', 60,  true,  'mrodriguez@metrologistics.com'),
  (SMB_03, 'Robert',  'Kim',       70,  true,  'rkim@apexconstruction.com'),
  (SMB_04, 'Priya',   'Patel',     55,  true,  'dpatel@sunrisehealthcare.com'),
  (SMB_05, 'Sofia',   'Mendez',    100, true,  'smendez@greenleaforganics.com'),
  (SMB_06, 'David',   'Thompson',  45,  true,  'dthompson@coastalhospitality.com'),
  (SMB_07, 'Thomas',  'Mueller',   75,  true,  'tmueller@precisionmfg.com'),
  (SMB_08, 'Sarah',   'Kim',       60,  true,  'skim@techventure.io'),
  (SMB_09, 'Marcus',  'Johnson',   100, true,  'mjohnson@urbanretail.com'),
  (SMB_10, 'Michael', 'Walsh',     80,  true,  'mwalsh@pacificmarine.com');

-- Background owners
FOR i IN 11..50 LOOP
  bg_id := ('00000000-0000-4000-8000-0000000000' || LPAD(i::text, 2, '0'))::UUID;
  INSERT INTO public.business_owners (smb_entity_id, first_name, last_name, ownership_percentage, is_guarantor)
  VALUES (bg_id, 'Owner', 'Entity' || i, 100, true)
  ON CONFLICT DO NOTHING;
END LOOP;

-- ========================
-- 8. CREDIT SCORES (50 rows - all entities scored)
-- ========================
-- Demo businesses: scores match lumiqScore * 10 range
INSERT INTO public.credit_scores (id, tenant_id, smb_entity_id, source, score_type, score, score_range_min, score_range_max, risk_class, factors, pulled_at, expires_at) VALUES
  (gen_random_uuid(), TENANT_ID, SMB_01, 'experian_business', 'business', 780, 300, 850, 'low',      '[{"code":"PH01","description":"Strong payment history","impact":"positive"},{"code":"CF01","description":"Improving cash flow","impact":"positive"}]'::jsonb, now() - interval '2 days',  now() + interval '88 days'),
  (gen_random_uuid(), TENANT_ID, SMB_02, 'dnb',              'business', 710, 300, 850, 'moderate', '[{"code":"PH01","description":"Moderate payment history","impact":"neutral"},{"code":"CF01","description":"Stable cash flow","impact":"positive"}]'::jsonb, now() - interval '3 days',  now() + interval '87 days'),
  (gen_random_uuid(), TENANT_ID, SMB_03, 'experian_business', 'business', 820, 300, 850, 'low',      '[{"code":"PH01","description":"Strong payment history","impact":"positive"},{"code":"CF01","description":"Improving cash flow","impact":"positive"}]'::jsonb, now() - interval '1 day',   now() + interval '89 days'),
  (gen_random_uuid(), TENANT_ID, SMB_04, 'equifax_business',  'business', 850, 300, 850, 'low',      '[{"code":"PH01","description":"Excellent payment history","impact":"positive"},{"code":"CF01","description":"Strong cash flow","impact":"positive"}]'::jsonb, now() - interval '5 days',  now() + interval '85 days'),
  (gen_random_uuid(), TENANT_ID, SMB_05, 'experian_business', 'business', 650, 300, 850, 'moderate', '[{"code":"PH01","description":"Mixed payment history","impact":"neutral"},{"code":"AG01","description":"Business age under 5 years","impact":"negative"}]'::jsonb, now() - interval '4 days',  now() + interval '86 days'),
  (gen_random_uuid(), TENANT_ID, SMB_06, 'dnb',              'business', 580, 300, 850, 'elevated', '[{"code":"PH01","description":"Late payments noted","impact":"negative"},{"code":"CF01","description":"Declining cash flow","impact":"negative"}]'::jsonb, now() - interval '6 days',  now() + interval '84 days'),
  (gen_random_uuid(), TENANT_ID, SMB_07, 'experian_business', 'business', 760, 300, 850, 'low',      '[{"code":"PH01","description":"Strong payment history","impact":"positive"},{"code":"TL01","description":"Long trade history","impact":"positive"}]'::jsonb, now() - interval '2 days',  now() + interval '88 days'),
  (gen_random_uuid(), TENANT_ID, SMB_08, 'experian_business',  'business', 850, 300, 850, 'low',      '[{"code":"PH01","description":"Excellent payment history","impact":"positive"},{"code":"CF01","description":"Rapid growth","impact":"positive"}]'::jsonb, now() - interval '1 day',   now() + interval '89 days'),
  (gen_random_uuid(), TENANT_ID, SMB_09, 'experian_business', 'business', 620, 300, 850, 'moderate', '[{"code":"PH01","description":"Limited payment history","impact":"neutral"},{"code":"AG01","description":"Business age under 3 years","impact":"negative"}]'::jsonb, now() - interval '7 days',  now() + interval '83 days'),
  (gen_random_uuid(), TENANT_ID, SMB_10, 'dnb',              'business', 730, 300, 850, 'moderate', '[{"code":"PH01","description":"Good payment history","impact":"positive"},{"code":"CF01","description":"Improving cash flow","impact":"positive"}]'::jsonb, now() - interval '3 days',  now() + interval '87 days');

-- Background entity scores (random 600-800)
FOR i IN 11..50 LOOP
  bg_id := ('00000000-0000-4000-8000-0000000000' || LPAD(i::text, 2, '0'))::UUID;
  bg_score := 600 + floor(random() * 200)::integer;
  INSERT INTO public.credit_scores (tenant_id, smb_entity_id, source, score_type, score, score_range_min, score_range_max, risk_class, factors, pulled_at, expires_at)
  VALUES (
    TENANT_ID, bg_id,
    CASE (i % 3) WHEN 0 THEN 'experian_business'::public.score_source WHEN 1 THEN 'dnb'::public.score_source ELSE 'equifax_business'::public.score_source END,
    'business', bg_score, 300, 850,
    CASE WHEN bg_score >= 720 THEN 'low' WHEN bg_score >= 650 THEN 'moderate' ELSE 'elevated' END,
    '[{"code":"PH01","description":"Standard payment history","impact":"neutral"}]'::jsonb,
    now() - (i || ' days')::interval,
    now() + ((90 - i) || ' days')::interval
  );
END LOOP;

-- ========================
-- 9. SCORE HISTORY (mirror credit_scores)
-- ========================
INSERT INTO public.score_history (credit_score_id, smb_entity_id, score, delta, source, recorded_at)
SELECT cs.id, cs.smb_entity_id, cs.score,
  CASE WHEN cs.risk_class = 'low' THEN floor(random() * 10)::integer ELSE -floor(random() * 10)::integer END,
  cs.source, cs.pulled_at
FROM public.credit_scores cs
WHERE cs.tenant_id = TENANT_ID;

-- ========================
-- 10. UNDERWRITING RULESET
-- ========================
INSERT INTO public.underwriting_rulesets (id, tenant_id, portfolio_id, name, version, rules, thresholds, is_active, validated_at, validated_by) VALUES
  (RULESET_ID, TENANT_ID, PORTFOLIO_ID, 'Standard SMB v1.0', '1.0.0',
   '{"minScore":600,"minYearsInBusiness":2,"maxDebtToIncome":0.45,"requiredBureaus":["experian_business"]}'::jsonb,
   '{"autoApproveAbove":750,"autoDeclineBelow":500,"manualReviewRange":[500,750],"maxExposure":1000000}'::jsonb,
   true, now() - interval '30 days', DEMO_USER_ID)
ON CONFLICT DO NOTHING;

-- ========================
-- 11. PREQUAL OFFERS (8 rows)
-- ========================
INSERT INTO public.prequal_offers (tenant_id, smb_entity_id, portfolio_id, ruleset_id, product_type, amount_min, amount_max, term_months_min, term_months_max, rate_min, rate_max, status, expires_at) VALUES
  -- 5 for demo businesses with active apps
  (TENANT_ID, SMB_01, PORTFOLIO_ID, RULESET_ID, 'Business Line of Credit', 100000, 300000, 12, 60, 5.9, 8.5,  'accepted', now() + interval '30 days'),
  (TENANT_ID, SMB_02, PORTFOLIO_ID, RULESET_ID, 'Working Capital',         200000, 600000, 12, 36, 6.5, 9.2,  'accepted', now() + interval '30 days'),
  (TENANT_ID, SMB_03, PORTFOLIO_ID, RULESET_ID, 'Equipment Financing',     150000, 400000, 24, 72, 5.5, 7.8,  'accepted', now() + interval '30 days'),
  (TENANT_ID, SMB_05, PORTFOLIO_ID, RULESET_ID, 'Term Loan',                50000, 100000, 12, 36, 7.5, 11.2, 'accepted', now() + interval '30 days'),
  (TENANT_ID, SMB_08, PORTFOLIO_ID, RULESET_ID, 'Business Credit Card',     25000,  75000,  0,  0, 15.9, 22.9,'accepted', now() + interval '30 days'),
  -- 3 for background entities
  (TENANT_ID, ('00000000-0000-4000-8000-000000000011')::UUID, PORTFOLIO_ID, RULESET_ID, 'Term Loan',   75000, 200000, 12, 48, 6.2, 9.0, 'generated', now() + interval '60 days'),
  (TENANT_ID, ('00000000-0000-4000-8000-000000000015')::UUID, PORTFOLIO_ID, RULESET_ID, 'LOC',        100000, 250000, 12, 36, 5.8, 8.5, 'viewed',    now() + interval '45 days'),
  (TENANT_ID, ('00000000-0000-4000-8000-000000000020')::UUID, PORTFOLIO_ID, RULESET_ID, 'SBA',        200000, 500000, 60, 120, 4.5, 6.5, 'generated', now() + interval '90 days');

-- ========================
-- 12. APPLICATIONS (8 rows, various statuses)
-- ========================
-- Get offer IDs for linking
INSERT INTO public.applications (tenant_id, smb_entity_id, portfolio_id, offer_id, status, requested_amount, requested_term_months, application_data, decision_data, submitted_at, decided_at, decided_by) VALUES
  -- 2 submitted
  (TENANT_ID, SMB_01, PORTFOLIO_ID, (SELECT id FROM public.prequal_offers WHERE smb_entity_id = SMB_01 LIMIT 1), 'submitted',     250000, 36, '{"productType":"Business Line of Credit"}'::jsonb, NULL, now() - interval '2 hours', NULL, NULL),
  (TENANT_ID, SMB_05, PORTFOLIO_ID, (SELECT id FROM public.prequal_offers WHERE smb_entity_id = SMB_05 LIMIT 1), 'submitted',      75000, 24, '{"productType":"Term Loan"}'::jsonb, NULL, now() - interval '4 hours', NULL, NULL),
  -- 2 under_review
  (TENANT_ID, SMB_02, PORTFOLIO_ID, (SELECT id FROM public.prequal_offers WHERE smb_entity_id = SMB_02 LIMIT 1), 'under_review',  500000, 24, '{"productType":"Working Capital"}'::jsonb, NULL, now() - interval '1 day', NULL, NULL),
  (TENANT_ID, SMB_08, PORTFOLIO_ID, (SELECT id FROM public.prequal_offers WHERE smb_entity_id = SMB_08 LIMIT 1), 'under_review',   50000,  0, '{"productType":"Business Credit Card"}'::jsonb, NULL, now() - interval '6 hours', NULL, NULL),
  -- 2 approved
  (TENANT_ID, SMB_03, PORTFOLIO_ID, (SELECT id FROM public.prequal_offers WHERE smb_entity_id = SMB_03 LIMIT 1), 'approved',      350000, 48, '{"productType":"Equipment Financing"}'::jsonb, '{"approvedAmount":350000,"approvedRate":6.2,"riskScore":820}'::jsonb, now() - interval '3 days', now() - interval '2 days', DEMO_USER_ID),
  (TENANT_ID, ('00000000-0000-4000-8000-000000000011')::UUID, PORTFOLIO_ID, NULL, 'approved', 150000, 36, '{"productType":"Term Loan"}'::jsonb, '{"approvedAmount":150000,"approvedRate":7.5,"riskScore":720}'::jsonb, now() - interval '5 days', now() - interval '4 days', DEMO_USER_ID),
  -- 1 declined
  (TENANT_ID, SMB_06, PORTFOLIO_ID, NULL, 'declined', 120000, 24, '{"productType":"Business Line of Credit"}'::jsonb, '{"declineReason":"Score below threshold","riskScore":580}'::jsonb, now() - interval '7 days', now() - interval '6 days', DEMO_USER_ID),
  -- Note: using 'approved' as stand-in for 'funded' since enum doesn't have 'funded'
  (TENANT_ID, ('00000000-0000-4000-8000-000000000015')::UUID, PORTFOLIO_ID, NULL, 'approved', 200000, 48, '{"productType":"LOC","funded":true}'::jsonb, '{"approvedAmount":200000,"approvedRate":6.8,"riskScore":740,"fundedAt":"2026-01-15"}'::jsonb, now() - interval '14 days', now() - interval '12 days', DEMO_USER_ID);

-- ========================
-- 13. REPORT JOBS (4 rows)
-- ========================
INSERT INTO public.report_jobs (tenant_id, portfolio_id, report_type, format, parameters, status, artifact_url, requested_by, started_at, completed_at) VALUES
  (TENANT_ID, PORTFOLIO_ID, 'portfolio_summary',   'pdf',  '{"period":"Q4-2025"}'::jsonb,         'ready',      'https://storage.lumiqai.com/reports/portfolio-summary-q4.pdf',   DEMO_USER_ID, now() - interval '2 days', now() - interval '2 days' + interval '45 seconds'),
  (TENANT_ID, PORTFOLIO_ID, 'risk_analysis',        'pdf',  '{"period":"January 2026"}'::jsonb,    'ready',      'https://storage.lumiqai.com/reports/risk-analysis-jan.pdf',      DEMO_USER_ID, now() - interval '1 day',  now() - interval '1 day' + interval '60 seconds'),
  (TENANT_ID, PORTFOLIO_ID, 'compliance_audit',     'xlsx', '{"scope":"full","period":"Q4"}'::jsonb,'ready',     'https://storage.lumiqai.com/reports/compliance-audit-q4.xlsx',   DEMO_USER_ID, now() - interval '5 days', now() - interval '5 days' + interval '120 seconds'),
  (TENANT_ID, PORTFOLIO_ID, 'performance_metrics',  'pdf',  '{"period":"January 2026"}'::jsonb,    'pending',    NULL,                                                             DEMO_USER_ID, NULL, NULL);

-- ========================
-- 14. AUDIT EVENTS (20 rows covering all action types)
-- ========================
INSERT INTO public.audit_events (tenant_id, user_id, action, resource_type, resource_id, details, ip_address, session_id, created_at) VALUES
  (TENANT_ID, DEMO_USER_ID, 'LOGIN',                'session',     NULL,    '{"method":"password"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '2 hours'),
  (TENANT_ID, DEMO_USER_ID, 'VIEW_PII',             'smb_entity',  SMB_01,  '{"fields":["ein","owner_ssn"]}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 55 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'SOFT_PULL_REQUESTED',  'credit_score', SMB_01, '{"source":"experian_business"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 50 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'SCORE_VIEWED',         'credit_score', SMB_01, '{"score":780}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 45 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'PREQUAL_GENERATED',    'prequal_offer', SMB_01,'{"productType":"LOC","amount":250000}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 40 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'APPLICATION_SUBMITTED','application',  SMB_01, '{"amount":250000}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 35 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'VIEW_PII',             'smb_entity',  SMB_02,  '{"fields":["ein"]}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 30 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'SOFT_PULL_REQUESTED',  'credit_score', SMB_02, '{"source":"dnb"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 25 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'SCORE_VIEWED',         'credit_score', SMB_03, '{"score":820}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour 20 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'REPORT_GENERATED',     'report',      NULL,    '{"type":"portfolio_summary"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '1 hour'),
  (TENANT_ID, DEMO_USER_ID, 'REPORT_DOWNLOADED',    'report',      NULL,    '{"type":"portfolio_summary","format":"pdf"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '55 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'API_KEY_CREATED',      'api_key',     NULL,    '{"name":"Sandbox Test Key","environment":"sandbox"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '50 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'SETTINGS_CHANGED',     'settings',    NULL,    '{"field":"session_timeout","oldValue":60,"newValue":30}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '45 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'ROLE_CHANGED',         'user_role',   NULL,    '{"targetUser":"analyst@bank.com","newRole":"risk_analyst"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '40 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'DATA_EXPORTED',        'smb_entities', NULL,   '{"format":"csv","recordCount":50}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '35 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'VIEW_PII',             'smb_entity',  SMB_04,  '{"fields":["ein"]}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '30 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'PREQUAL_GENERATED',    'prequal_offer', SMB_08,'{"productType":"Business Credit Card"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '25 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'APPLICATION_SUBMITTED','application',  SMB_03, '{"amount":350000}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '20 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'API_KEY_REVOKED',      'api_key',     NULL,    '{"name":"Old Production Key"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '15 minutes'),
  (TENANT_ID, DEMO_USER_ID, 'LOGOUT',               'session',     NULL,    '{"reason":"manual"}'::jsonb, '192.168.1.100', 'sess-001', now() - interval '10 minutes');

-- ========================
-- 15. DATA LINEAGE (10 rows for demo businesses)
-- ========================
INSERT INTO public.data_lineage (tenant_id, resource_type, resource_id, source_name, source_type, pulled_at, coverage_pct, freshness_hours, consent_reference) VALUES
  (TENANT_ID, 'credit_score', SMB_01, 'Experian Business', 'bureau', now() - interval '2 days', 94, 18, 'CONSENT-001'),
  (TENANT_ID, 'credit_score', SMB_02, 'D&B PAYDEX',       'bureau', now() - interval '3 days', 91, 36, 'CONSENT-002'),
  (TENANT_ID, 'credit_score', SMB_03, 'Experian Business', 'bureau', now() - interval '1 day',  94, 18, 'CONSENT-003'),
  (TENANT_ID, 'credit_score', SMB_04, 'Equifax Business',  'bureau', now() - interval '5 days', 89, 24, 'CONSENT-004'),
  (TENANT_ID, 'credit_score', SMB_05, 'Experian Business', 'bureau', now() - interval '4 days', 94, 18, 'CONSENT-005'),
  (TENANT_ID, 'credit_score', SMB_06, 'D&B PAYDEX',       'bureau', now() - interval '6 days', 91, 36, 'CONSENT-006'),
  (TENANT_ID, 'credit_score', SMB_07, 'Experian Business', 'bureau', now() - interval '2 days', 94, 18, 'CONSENT-007'),
  (TENANT_ID, 'credit_score', SMB_08, 'Equifax Business',  'bureau', now() - interval '1 day',  89, 24, 'CONSENT-008'),
  (TENANT_ID, 'credit_score', SMB_09, 'Experian Business', 'bureau', now() - interval '7 days', 94, 18, 'CONSENT-009'),
  (TENANT_ID, 'credit_score', SMB_10, 'D&B PAYDEX',       'bureau', now() - interval '3 days', 91, 36, 'CONSENT-010');

-- ========================
-- 16. AI INSIGHTS (3 rows for top-scoring businesses)
-- ========================
INSERT INTO public.ai_insights (tenant_id, smb_entity_id, insight_type, title, content, recommendations, factors, confidence_score, model_version) VALUES
  (TENANT_ID, SMB_08, 'growth_opportunity', 'High Growth Potential',
   'TechVenture Solutions shows strong growth trajectory with 88% credit score and rapid revenue expansion. Ideal candidate for credit line increase.',
   '["Consider proactive LOC offer at $150K-250K","Schedule relationship review","Flag for premium tier upgrade"]'::jsonb,
   '["Rapid revenue growth (45% YoY)","Strong payment history","Low utilization ratio"]'::jsonb,
   0.92, 'lumiq-insight-v2.1'),
  (TENANT_ID, SMB_04, 'cross_sell', 'Cross-Sell Opportunity',
   'Sunrise Healthcare Partners has strong financials and low risk profile. Currently no active credit product - high potential for LOC or Term Loan.',
   '["Generate prequal offer for LOC $500K-$1M","Present equipment financing options","Consider SBA 7(a) referral"]'::jsonb,
   '["$12.5M annual revenue","85% credit score","9 years in business","Healthcare sector stability"]'::jsonb,
   0.88, 'lumiq-insight-v2.1'),
  (TENANT_ID, SMB_03, 'risk_monitor', 'Portfolio Anchor Account',
   'Apex Construction Group is a key portfolio anchor with $8.1M revenue and approved $350K equipment financing. Monitor for construction sector seasonality.',
   '["Set seasonal monitoring alerts","Review quarterly financials","Maintain relationship touchpoints"]'::jsonb,
   '["High score stability (820)","Long operating history (12 yrs)","Large employer (120)"]'::jsonb,
   0.85, 'lumiq-insight-v2.1');

-- ========================
-- 17. API KEYS (2 rows)
-- ========================
INSERT INTO public.api_keys (id, tenant_id, name, key_hash, key_prefix, environment, scopes, rate_limit_per_minute, is_active, last_used_at, expires_at, created_by) VALUES
  (API_KEY_1, TENANT_ID, 'Sandbox Test Key',    'sha256_sandbox_hash_placeholder',    'sk_test_', 'sandbox',    ARRAY['read:customers','read:scores','write:applications'], 120, true,  now() - interval '1 hour',  now() + interval '365 days', DEMO_USER_ID),
  (API_KEY_2, TENANT_ID, 'Production API Key',  'sha256_production_hash_placeholder', 'sk_live_', 'production', ARRAY['read:customers','read:scores','write:applications','read:reports'], 60, true, now() - interval '12 hours', now() + interval '180 days', DEMO_USER_ID);

-- ========================
-- 18. API USAGE LOGS (50 rows spanning Oct-Jan)
-- ========================
FOR i IN 1..50 LOOP
  INSERT INTO public.api_usage_logs (api_key_id, tenant_id, endpoint, method, status_code, latency_ms, request_size_bytes, response_size_bytes, ip_address, created_at)
  VALUES (
    CASE WHEN i % 3 = 0 THEN API_KEY_2 ELSE API_KEY_1 END,
    TENANT_ID,
    CASE (i % 5) WHEN 0 THEN '/customers' WHEN 1 THEN '/scores' WHEN 2 THEN '/offers' WHEN 3 THEN '/applications' ELSE '/reports' END,
    CASE (i % 4) WHEN 0 THEN 'POST' ELSE 'GET' END,
    CASE WHEN random() < 0.995 THEN 200 ELSE 500 END,
    100 + floor(random() * 300)::integer,
    256 + floor(random() * 1024)::integer,
    1024 + floor(random() * 4096)::integer,
    '10.0.0.' || (1 + (i % 254)),
    '2025-10-01'::date + (i * 2.44)::integer * interval '1 day' + (floor(random() * 86400) || ' seconds')::interval
  );
END LOOP;

-- ========================
-- 19. WEBHOOK CONFIG (1 row)
-- ========================
INSERT INTO public.webhook_configs (tenant_id, name, url, events, is_active, last_triggered_at) VALUES
  (TENANT_ID, 'Partner Bank Webhook', 'https://api.partner-bank.com/webhooks/lumiq',
   ARRAY['score.updated','prequal.matched','application.approved','application.declined','risk.alert'],
   true, now() - interval '2 minutes');

-- ========================
-- 20. RISK AGGREGATES (~200 rows: daily for 122 days across metric types)
-- ========================
-- We generate daily aggregates for 10 metric types across the pilot period (Oct 1 - Jan 31)
-- The final day's values must match PILOT_METRICS exactly

-- Oct 1 to Jan 31 = 123 days (offsets 0..122)
FOR day_offset IN 0..122 LOOP
  agg_date := '2025-10-01'::date + day_offset;

  -- Calculate progressive growth toward final values
  -- total_businesses: grows from 42000 to 47500
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'total_businesses',
    42000 + floor((47500 - 42000) * (day_offset::numeric / 122))::integer, NULL, NULL);

  -- scored_businesses: grows from 32000 to 38200
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'scored_businesses',
    32000 + floor((38200 - 32000) * (day_offset::numeric / 122))::integer, NULL, NULL);

  -- prequalified: grows from 8000 to 12400
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'prequalified',
    8000 + floor((12400 - 8000) * (day_offset::numeric / 122))::integer, NULL, NULL);

  -- applications_started: grows from 1800 to 3100
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'applications_started',
    1800 + floor((3100 - 1800) * (day_offset::numeric / 122))::integer, NULL, NULL);

  -- approved: grows from 1200 to 2340
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'approved',
    1200 + floor((2340 - 1200) * (day_offset::numeric / 122))::integer, NULL, NULL);

  -- funded: grows from 1000 to 2106
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'funded',
    1000 + floor((2106 - 1000) * (day_offset::numeric / 122))::integer, NULL, NULL);

  -- avg_score: hovers around 72 (the PILOT_METRICS avgLumiqScore)
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'avg_score',
    NULL, 70 + (day_offset::numeric / 122) * 2);

  -- delinquency_rate: stays around 1.8%
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'delinquency_rate',
    2.0 - (day_offset::numeric / 122) * 0.2);

  -- api_calls: daily API calls growing from ~28K to ~35K
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, count, sum_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'api_calls',
    28000 + floor((35293 - 28000) * (day_offset::numeric / 122))::integer, NULL);

  -- conversion_funnel: application conversion rate growing toward 25%
  INSERT INTO public.risk_aggregates (tenant_id, portfolio_id, aggregate_date, metric_type, avg_value)
  VALUES (TENANT_ID, PORTFOLIO_ID, agg_date, 'conversion_funnel',
    17.0 + (day_offset::numeric / 122) * 8.0);

END LOOP;

-- ========================
-- 21. EWS QUEUE (3 unacknowledged alerts)
-- ========================
INSERT INTO public.ews_queue (tenant_id, smb_entity_id, portfolio_id, alert_type, severity, trigger_value, threshold_value, description, is_acknowledged) VALUES
  (TENANT_ID, SMB_06, PORTFOLIO_ID, 'score_decline', 'critical', 580, 600,
   'Credit score dropped below 600 threshold (580). Payment pattern deterioration detected. Recommend immediate review.',
   false),
  (TENANT_ID, SMB_09, PORTFOLIO_ID, 'utilization_spike', 'warning', 78, 70,
   'Credit utilization spiked to 78%, exceeding 70% warning threshold. Revenue decline of 12% also noted.',
   false),
  (TENANT_ID, SMB_05, PORTFOLIO_ID, 'cash_flow_stress', 'warning', 15, 10,
   'Operating cash flow declined 15% in last 90 days. Seasonal agriculture business - may be cyclical.',
   false);

RAISE NOTICE 'Seed completed successfully. Demo user: %, Tenant: %, Portfolio: %', DEMO_USER_ID, TENANT_ID, PORTFOLIO_ID;

END $$;
