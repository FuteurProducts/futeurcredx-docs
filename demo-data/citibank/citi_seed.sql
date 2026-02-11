-- ============================================================================
-- CITIBANK — PostgreSQL Seed Data for Lumiq AI Dashboard
-- ============================================================================
-- Citibank-specific demo data aligned with Prisma schema
-- Brand: Citi (#003DA5 blue), metro-concentrated, higher deal sizes
-- Focus: International businesses, trade finance, treasury solutions
-- Geographic: NYC (35%), SF Bay (20%), Miami (15%), Chicago (10%), LA (10%)
-- ============================================================================

BEGIN;

-- Clean existing Citibank data (if re-running)
-- Note: This preserves other bank data if present
DELETE FROM "ews_alerts" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank');
DELETE FROM "audit_events" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank');
DELETE FROM "batch_items" WHERE "batchJobId" IN (SELECT "id" FROM "batch_jobs" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank'));
DELETE FROM "batch_jobs" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank');
DELETE FROM "business_card_applications" WHERE "businessId" IN (SELECT "id" FROM "businesses" WHERE "userId" IN (SELECT "id" FROM "users" WHERE "email" LIKE '%@citibank.com'));
DELETE FROM "business_recommendations" WHERE "businessId" IN (SELECT "id" FROM "businesses" WHERE "userId" IN (SELECT "id" FROM "users" WHERE "email" LIKE '%@citibank.com'));
DELETE FROM "business_scores" WHERE "businessId" IN (SELECT "id" FROM "businesses" WHERE "userId" IN (SELECT "id" FROM "users" WHERE "email" LIKE '%@citibank.com'));
DELETE FROM "portfolio_businesses" WHERE "portfolioId" IN (SELECT "id" FROM "portfolios" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank'));
DELETE FROM "businesses" WHERE "userId" IN (SELECT "id" FROM "users" WHERE "email" LIKE '%@citibank.com');
DELETE FROM "tenant_users" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank');
DELETE FROM "tenant_api_keys" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank');
DELETE FROM "portfolios" WHERE "tenantId" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'citibank');
DELETE FROM "tenants" WHERE "slug" = 'citibank';
DELETE FROM "users" WHERE "email" LIKE '%@citibank.com';

-- ── Citi Users (5) ──
INSERT INTO "users" ("id","clerkId","email","password","userFname","userLname","status","subscription","verified","updatedAt") VALUES
('c0000001-0000-4000-a000-000000000001','user_citi001','patricia.admin@citibank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Patricia','Chen','ACTIVE','YEAR',true,'2026-02-11T00:00:00.000Z'),
('c0000001-0000-4000-a000-000000000002','user_citi002','marcus.treasury@citibank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Marcus','Thompson','ACTIVE','YEAR',true,'2026-02-11T00:00:00.000Z'),
('c0000001-0000-4000-a000-000000000003','user_citi003','rachel.risk@citibank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Rachel','Goldman','ACTIVE','YEAR',true,'2026-02-11T00:00:00.000Z'),
('c0000001-0000-4000-a000-000000000004','user_citi004','david.rm@citibank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','David','Patel','ACTIVE','MONTH',true,'2026-02-11T00:00:00.000Z'),
('c0000001-0000-4000-a000-000000000005','user_citi005','jennifer.analyst@citibank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Jennifer','Liu','ACTIVE','FREE',false,'2026-02-11T00:00:00.000Z');

-- ── Citibank Tenant ──
INSERT INTO "tenants" ("id","name","slug","clerkOrgId","updatedAt") VALUES
('c1000000-0000-4000-a000-000000000001','Citibank Commercial Banking','citibank','org_citi_commercial_001','2026-02-11T00:00:00.000Z');

-- ── Citi Portfolio ──
INSERT INTO "portfolios" ("id","tenantId","name","code","updatedAt") VALUES
('c2000000-0000-4000-a000-000000000001','c1000000-0000-4000-a000-000000000001','Global Commercial Portfolio','CITI-GLOBAL','2026-02-11T00:00:00.000Z');

-- ── Citi Tenant Users (5) ──
INSERT INTO "tenant_users" ("id","tenantId","userId","clerkUserId","role") VALUES
('c3000000-0000-4000-a000-000000000001','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','user_citi001','admin'),
('c3000000-0000-4000-a000-000000000002','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000002','user_citi002','analyst'),
('c3000000-0000-4000-a000-000000000003','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000003','user_citi003','analyst'),
('c3000000-0000-4000-a000-000000000004','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000004','user_citi004','rm'),
('c3000000-0000-4000-a000-000000000005','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000005','user_citi005','viewer');

-- ── Citi Businesses (45) ──
-- Metro-concentrated: NYC (35%), SF Bay (20%), Miami (15%), Chicago (10%), LA (10%), Other (10%)
-- Higher revenue range ($5M-$25M avg), international trade focus
INSERT INTO "businesses" ("id","userId","name","city","state","naicsCode","annualRevenue","riskTier","segment","ownerFname","ownerLname","empCount","yearFounded") VALUES
-- NYC Metro (16 businesses - 35%)
('c4000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','Apex Global Fintech LLC','New York','NY','522320',18500000,'low','mid-market','Michael','Zhang',85,2015),
('c4000000-0000-4000-a000-000000000002','c0000001-0000-4000-a000-000000000001','Hudson Valley Import Partners','New York','NY','424990',24000000,'low','mid-market','Elena','Rodriguez',120,2012),
('c4000000-0000-4000-a000-000000000003','c0000001-0000-4000-a000-000000000001','Manhattan Med Device Co','New York','NY','339112',32500000,'low','mid-market','Dr. Priya','Sharma',145,2010),
('c4000000-0000-4000-a000-000000000004','c0000001-0000-4000-a000-000000000001','Empire Legal Advisors PLLC','New York','NY','541110',12800000,'low','small','Richard','Bloomberg',48,2018),
('c4000000-0000-4000-a000-000000000005','c0000001-0000-4000-a000-000000000001','Tribeca Digital Marketing Group','New York','NY','541810',9200000,'low','small','Sarah','Johnson',52,2019),
('c4000000-0000-4000-a000-000000000006','c0000001-0000-4000-a000-000000000001','Brooklyn E-Commerce Collective','Brooklyn','NY','454110',7800000,'medium','small','David','Kim',38,2020),
('c4000000-0000-4000-a000-000000000007','c0000001-0000-4000-a000-000000000001','Queens International Freight','Queens','NY','488510',15500000,'low','mid-market','Carlos','Mendez',92,2013),
('c4000000-0000-4000-a000-000000000008','c0000001-0000-4000-a000-000000000001','Wall Street Tech Solutions','New York','NY','541511',11200000,'low','small','Jennifer','Wang',65,2021),
('c4000000-0000-4000-a000-000000000009','c0000001-0000-4000-a000-000000000001','Midtown Architecture Partners','New York','NY','541310',8900000,'low','small','Thomas','Sullivan',42,2016),
('c4000000-0000-4000-a000-000000000010','c0000001-0000-4000-a000-000000000001','Harlem Healthcare Associates','New York','NY','621111',14200000,'low','mid-market','Dr. Angela','Davis',78,2014),
('c4000000-0000-4000-a000-000000000011','c0000001-0000-4000-a000-000000000001','Chelsea Restaurant Group','New York','NY','722511',6500000,'medium','small','Marco','DiStefano',95,2017),
('c4000000-0000-4000-a000-000000000012','c0000001-0000-4000-a000-000000000001','SoHo Fashion Imports','New York','NY','424340',19800000,'low','mid-market','Isabella','Rossi',68,2011),
('c4000000-0000-4000-a000-000000000013','c0000001-0000-4000-a000-000000000001','Battery Park Consulting Group','New York','NY','541611',10500000,'low','small','James','Harper',55,2019),
('c4000000-0000-4000-a000-000000000014','c0000001-0000-4000-a000-000000000001','Jersey City Distribution Corp','Jersey City','NJ','493110',22000000,'low','mid-market','Robert','Chen',105,2009),
('c4000000-0000-4000-a000-000000000015','c0000001-0000-4000-a000-000000000001','Stamford Biotech Supplies','Stamford','CT','325413',28500000,'low','mid-market','Dr. Lisa','Kumar',132,2008),
('c4000000-0000-4000-a000-000000000016','c0000001-0000-4000-a000-000000000001','White Plains Commercial Real Estate','White Plains','NY','531210',16700000,'low','mid-market','Katherine','Morgan',58,2015),

-- SF Bay Area (9 businesses - 20%)
('c4000000-0000-4000-a000-000000000017','c0000001-0000-4000-a000-000000000002','Silicon Valley Cloud Solutions','San Francisco','CA','518210',26500000,'low','mid-market','Alex','Thompson',118,2016),
('c4000000-0000-4000-a000-000000000018','c0000001-0000-4000-a000-000000000002','Bay Area Biotech Ventures','South San Francisco','CA','325414',31200000,'low','mid-market','Dr. Emily','Chen',142,2013),
('c4000000-0000-4000-a000-000000000019','c0000001-0000-4000-a000-000000000002','San Jose Semiconductor Supplies','San Jose','CA','423690',21500000,'low','mid-market','Kevin','Park',88,2014),
('c4000000-0000-4000-a000-000000000020','c0000001-0000-4000-a000-000000000002','Oakland Import Logistics','Oakland','CA','488510',18900000,'low','mid-market','Marcus','Washington',95,2011),
('c4000000-0000-4000-a000-000000000021','c0000001-0000-4000-a000-000000000002','Palo Alto AI Consulting','Palo Alto','CA','541512',15800000,'low','mid-market','Samantha','Liu',72,2020),
('c4000000-0000-4000-a000-000000000022','c0000001-0000-4000-a000-000000000002','Berkeley Green Energy Systems','Berkeley','CA','221115',13200000,'low','small','Nathan','Foster',62,2018),
('c4000000-0000-4000-a000-000000000023','c0000001-0000-4000-a000-000000000002','Fremont Manufacturing Tech','Fremont','CA','333249',27800000,'low','mid-market','Daniel','Ng',125,2010),
('c4000000-0000-4000-a000-000000000024','c0000001-0000-4000-a000-000000000002','San Mateo Legal Services','San Mateo','CA','541110',9400000,'low','small','Victoria','Adams',45,2017),
('c4000000-0000-4000-a000-000000000025','c0000001-0000-4000-a000-000000000002','Mountain View SaaS Ventures','Mountain View','CA','511210',19600000,'low','mid-market','Christopher','Lee',82,2019),

-- Miami Metro (7 businesses - 15%)
('c4000000-0000-4000-a000-000000000026','c0000001-0000-4000-a000-000000000003','Miami Latin Trade Partners','Miami','FL','424990',29500000,'low','mid-market','Eduardo','Fernandez',135,2009),
('c4000000-0000-4000-a000-000000000027','c0000001-0000-4000-a000-000000000003','Brickell Hospitality Group','Miami','FL','721110',14800000,'medium','mid-market','Sofia','Martinez',158,2015),
('c4000000-0000-4000-a000-000000000028','c0000001-0000-4000-a000-000000000003','Coral Gables Medical Tourism','Coral Gables','FL','621111',17200000,'low','mid-market','Dr. Antonio','Garcia',82,2016),
('c4000000-0000-4000-a000-000000000029','c0000001-0000-4000-a000-000000000003','Fort Lauderdale Yacht Services','Fort Lauderdale','FL','811490',8600000,'medium','small','William','Brooks',48,2018),
('c4000000-0000-4000-a000-000000000030','c0000001-0000-4000-a000-000000000003','Doral International Freight','Doral','FL','488510',24300000,'low','mid-market','Carmen','Diaz',112,2012),
('c4000000-0000-4000-a000-000000000031','c0000001-0000-4000-a000-000000000003','Miami Beach Tech Consultants','Miami Beach','FL','541512',11800000,'low','small','Rachel','Cohen',58,2020),
('c4000000-0000-4000-a000-000000000032','c0000001-0000-4000-a000-000000000003','Aventura Luxury Retail Group','Aventura','FL','452000',16400000,'low','mid-market','Isabella','Santos',92,2014),

-- Chicago (5 businesses - 10%)
('c4000000-0000-4000-a000-000000000033','c0000001-0000-4000-a000-000000000004','Chicago Global Commodities','Chicago','IL','424590',33500000,'low','mid-market','Robert','Miller',148,2007),
('c4000000-0000-4000-a000-000000000034','c0000001-0000-4000-a000-000000000004','Loop Financial Services','Chicago','IL','523930',22800000,'low','mid-market','Patricia','Wilson',95,2013),
('c4000000-0000-4000-a000-000000000035','c0000001-0000-4000-a000-000000000004','OHare Logistics Solutions','Chicago','IL','493110',19200000,'low','mid-market','Steven','Anderson',88,2015),
('c4000000-0000-4000-a000-000000000036','c0000001-0000-4000-a000-000000000004','River North Legal Group','Chicago','IL','541110',12500000,'low','small','Michelle','Taylor',62,2017),
('c4000000-0000-4000-a000-000000000037','c0000001-0000-4000-a000-000000000004','Magnificent Mile Consulting','Chicago','IL','541611',14700000,'low','mid-market','Andrew','Johnson',68,2016),

-- Los Angeles (5 businesses - 10%)
('c4000000-0000-4000-a000-000000000038','c0000001-0000-4000-a000-000000000004','Los Angeles Media Distribution','Los Angeles','CA','512120',25600000,'low','mid-market','Jessica','Rodriguez',105,2011),
('c4000000-0000-4000-a000-000000000039','c0000001-0000-4000-a000-000000000004','Long Beach Port Logistics','Long Beach','CA','488320',28900000,'low','mid-market','David','Chang',132,2010),
('c4000000-0000-4000-a000-000000000040','c0000001-0000-4000-a000-000000000004','Beverly Hills Healthcare Partners','Beverly Hills','CA','621111',18500000,'low','mid-market','Dr. Amanda','Foster',78,2014),
('c4000000-0000-4000-a000-000000000041','c0000001-0000-4000-a000-000000000004','Santa Monica Tech Ventures','Santa Monica','CA','541511',16200000,'low','mid-market','Eric','Goldstein',72,2018),
('c4000000-0000-4000-a000-000000000042','c0000001-0000-4000-a000-000000000004','Pasadena Engineering Services','Pasadena','CA','541330',13800000,'low','small','Laura','Martinez',55,2016),

-- Other Markets (3 businesses - 10%)
('c4000000-0000-4000-a000-000000000043','c0000001-0000-4000-a000-000000000005','Boston Pharmaceutical Imports','Boston','MA','424210',30500000,'low','mid-market','Dr. William','Harris',125,2009),
('c4000000-0000-4000-a000-000000000044','c0000001-0000-4000-a000-000000000005','DC Government Solutions','Washington','DC','541611',21200000,'low','mid-market','Catherine','Adams',92,2013),
('c4000000-0000-4000-a000-000000000045','c0000001-0000-4000-a000-000000000005','Seattle International Trade Co','Seattle','WA','424990',23800000,'low','mid-market','Benjamin','Lee',98,2012);

-- ── Citi Portfolio Businesses (45) ──
INSERT INTO "portfolio_businesses" ("id","portfolioId","businessId")
SELECT 'c9000000-0000-4000-a000-' || LPAD(ROW_NUMBER() OVER(ORDER BY "id")::text, 12, '0'),
  'c2000000-0000-4000-a000-000000000001', "id"
FROM "businesses" WHERE "id" LIKE 'c4000000-%';

-- ── Citi Business Scores (45) ──
-- Higher credit scores reflect Citi's focus on established, international businesses
INSERT INTO "business_scores" ("id","businessId","score","type","metadata") VALUES
('c6000000-0000-4000-a000-000000000001','c4000000-0000-4000-a000-000000000001',815,'EXPERIAN','{"factors":["Strong payment history","Low utilization","International trade experience"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000002','c4000000-0000-4000-a000-000000000002',835,'EQUIFAX_ONESCORE','{"factors":["Established credit","Strong financials","Trade finance history"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000003','c4000000-0000-4000-a000-000000000003',850,'EXPERIAN','{"factors":["Excellent payment history","Healthcare sector stability","Low risk"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000004','c4000000-0000-4000-a000-000000000004',805,'EXPERIAN','{"factors":["Professional services","Strong cash flow","Stable operations"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000005','c4000000-0000-4000-a000-000000000005',790,'EQUIFAX_ONESCORE','{"factors":["Good payment history","Digital services growth","Moderate leverage"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000006','c4000000-0000-4000-a000-000000000006',720,'EXPERIAN','{"factors":["E-commerce sector","Seasonal volatility","Growth stage"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000007','c4000000-0000-4000-a000-000000000007',825,'EQUIFAX_ONESCORE','{"factors":["Strong operations","International trade","Low risk profile"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000008','c4000000-0000-4000-a000-000000000008',810,'EXPERIAN','{"factors":["Tech sector strength","Good financials","Growing revenues"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000009','c4000000-0000-4000-a000-000000000009',795,'EXPERIAN','{"factors":["Professional services","Stable cash flow","Good credit history"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000010','c4000000-0000-4000-a000-000000000010',830,'EQUIFAX_ONESCORE','{"factors":["Healthcare stability","Strong payer mix","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000011','c4000000-0000-4000-a000-000000000011',695,'EXPERIAN','{"factors":["Hospitality sector","Moderate volatility","Acceptable credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000012','c4000000-0000-4000-a000-000000000012',840,'EXPERIAN','{"factors":["Established importer","Strong financials","International operations"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000013','c4000000-0000-4000-a000-000000000013',800,'EQUIFAX_ONESCORE','{"factors":["Consulting services","Good margins","Stable client base"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000014','c4000000-0000-4000-a000-000000000014',820,'EXPERIAN','{"factors":["Logistics strength","Strong operations","Good credit history"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000015','c4000000-0000-4000-a000-000000000015',845,'EQUIFAX_ONESCORE','{"factors":["Biotech sector","Strong financials","Low risk"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000016','c4000000-0000-4000-a000-000000000016',815,'EXPERIAN','{"factors":["Commercial real estate","Diverse portfolio","Good management"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000017','c4000000-0000-4000-a000-000000000017',835,'EXPERIAN','{"factors":["Tech sector leader","Strong growth","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000018','c4000000-0000-4000-a000-000000000018',850,'EQUIFAX_ONESCORE','{"factors":["Biotech excellence","Strong IP","Premium credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000019','c4000000-0000-4000-a000-000000000019',810,'EXPERIAN','{"factors":["Semiconductor supply","Strong demand","Good financials"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000020','c4000000-0000-4000-a000-000000000020',805,'EQUIFAX_ONESCORE','{"factors":["Import logistics","Port access","Good operations"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000021','c4000000-0000-4000-a000-000000000021',825,'EXPERIAN','{"factors":["AI consulting","High margins","Strong demand"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000022','c4000000-0000-4000-a000-000000000022',795,'EXPERIAN','{"factors":["Green energy","Good growth","Moderate leverage"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000023','c4000000-0000-4000-a000-000000000023',830,'EQUIFAX_ONESCORE','{"factors":["Manufacturing tech","Strong contracts","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000024','c4000000-0000-4000-a000-000000000024',785,'EXPERIAN','{"factors":["Legal services","Good reputation","Stable revenues"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000025','c4000000-0000-4000-a000-000000000025',820,'EXPERIAN','{"factors":["SaaS model","Recurring revenue","Strong growth"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000026','c4000000-0000-4000-a000-000000000026',840,'EQUIFAX_ONESCORE','{"factors":["Latin trade leader","Strong relationships","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000027','c4000000-0000-4000-a000-000000000027',710,'EXPERIAN','{"factors":["Hospitality sector","Tourism exposure","Moderate risk"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000028','c4000000-0000-4000-a000-000000000028',815,'EXPERIAN','{"factors":["Medical tourism","Growing sector","Good credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000029','c4000000-0000-4000-a000-000000000029',680,'EQUIFAX_MASTERSCORE','{"factors":["Yacht services","Luxury market","Cyclical exposure"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000030','c4000000-0000-4000-a000-000000000030',835,'EXPERIAN','{"factors":["International freight","Strong operations","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000031','c4000000-0000-4000-a000-000000000031',800,'EQUIFAX_ONESCORE','{"factors":["Tech consulting","Good growth","Stable credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000032','c4000000-0000-4000-a000-000000000032',810,'EXPERIAN','{"factors":["Luxury retail","Good location","Strong sales"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000033','c4000000-0000-4000-a000-000000000033',850,'EXPERIAN','{"factors":["Commodities trading","Strong financials","Premier credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000034','c4000000-0000-4000-a000-000000000034',825,'EQUIFAX_ONESCORE','{"factors":["Financial services","Good compliance","Strong operations"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000035','c4000000-0000-4000-a000-000000000035',815,'EXPERIAN','{"factors":["Logistics hub","Good infrastructure","Strong credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000036','c4000000-0000-4000-a000-000000000036',795,'EXPERIAN','{"factors":["Legal services","Professional sector","Good credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000037','c4000000-0000-4000-a000-000000000037',805,'EQUIFAX_ONESCORE','{"factors":["Consulting services","Stable revenues","Good credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000038','c4000000-0000-4000-a000-000000000038',830,'EXPERIAN','{"factors":["Media distribution","Strong contracts","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000039','c4000000-0000-4000-a000-000000000039',840,'EQUIFAX_ONESCORE','{"factors":["Port logistics","Strategic location","Premier credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000040','c4000000-0000-4000-a000-000000000040',820,'EXPERIAN','{"factors":["Healthcare premium","High-net-worth","Strong credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000041','c4000000-0000-4000-a000-000000000041',810,'EXPERIAN','{"factors":["Tech ventures","Good growth","Strong financials"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000042','c4000000-0000-4000-a000-000000000042',795,'EQUIFAX_ONESCORE','{"factors":["Engineering services","Stable demand","Good credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000043','c4000000-0000-4000-a000-000000000043',845,'EXPERIAN','{"factors":["Pharma imports","Strong compliance","Excellent credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000044','c4000000-0000-4000-a000-000000000044',820,'EQUIFAX_ONESCORE','{"factors":["Government contracts","Stable revenue","Strong credit"],"pullDate":"2026-02-11"}'),
('c6000000-0000-4000-a000-000000000045','c4000000-0000-4000-a000-000000000045',825,'EXPERIAN','{"factors":["International trade","Strong operations","Excellent credit"],"pullDate":"2026-02-11"}');

-- ── Citi Business Recommendations (45) ──
INSERT INTO "business_recommendations" ("id","businessId","recommendations","scoreSnapshot","expiresAt","createdAt","updatedAt")
SELECT
  'c7000000-0000-4000-a000-' || LPAD(ROW_NUMBER() OVER(ORDER BY b."id")::text, 12, '0'),
  b."id",
  CASE
    WHEN bs."score" >= 820
      THEN '[{"cardId":"citi-aadvantage-world-elite","name":"Citi AAdvantage Business World Elite","fitScore":96,"reason":"Premium credit profile with international focus"},{"cardId":"citi-business-loc","name":"Citi Treasury & Trade Solutions Line of Credit","fitScore":92,"reason":"Excellent for trade finance and working capital"}]'::jsonb
    WHEN bs."score" >= 780
      THEN '[{"cardId":"citi-business-aadvantage","name":"CitiBusiness AAdvantage Platinum Select","fitScore":88,"reason":"Strong credit with business travel needs"},{"cardId":"citi-business-loc","name":"Citi Business Line of Credit","fitScore":84,"reason":"Good for cash flow management"}]'::jsonb
    WHEN bs."score" >= 720
      THEN '[{"cardId":"citi-businesscard","name":"Citi BusinessCard","fitScore":78,"reason":"Solid credit profile, no annual fee option"},{"cardId":"citi-equipment-finance","name":"Citi Equipment Financing","fitScore":72,"reason":"Consider for equipment purchases"}]'::jsonb
    ELSE '[{"cardId":"citi-secured-card","name":"Citi Business Secured Card","fitScore":58,"reason":"Build credit with secured option"}]'::jsonb
  END,
  bs."score",
  '2026-08-11T00:00:00.000Z',
  CURRENT_TIMESTAMP,
  '2026-02-11T00:00:00.000Z'
FROM "businesses" b
JOIN "business_scores" bs ON bs."businessId" = b."id"
WHERE b."id" LIKE 'c4000000-%';

-- ── Citi Audit Events (15) ──
INSERT INTO "audit_events" ("id","tenantId","userId","action","resourceType","resourceId","details","ipAddress","createdAt") VALUES
('cb000000-0000-4000-a000-000000000001','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','SCORE_PULL','business','c4000000-0000-4000-a000-000000000001','{"score":815,"type":"EXPERIAN","tradeFinance":true}','10.20.30.40','2026-02-11T09:30:00.000Z'),
('cb000000-0000-4000-a000-000000000002','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000002','OFFER_GENERATED','business','c4000000-0000-4000-a000-000000000001','{"products":2,"treasury":true}','10.20.30.41','2026-02-11T09:31:00.000Z'),
('cb000000-0000-4000-a000-000000000003','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000003','SCORE_PULL','business','c4000000-0000-4000-a000-000000000002','{"score":835,"type":"EQUIFAX_ONESCORE"}','10.20.30.42','2026-02-11T10:00:00.000Z'),
('cb000000-0000-4000-a000-000000000004','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','SCORE_PULL','business','c4000000-0000-4000-a000-000000000017','{"score":835,"type":"EXPERIAN"}','10.20.30.40','2026-02-11T11:00:00.000Z'),
('cb000000-0000-4000-a000-000000000005','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000002','OFFER_GENERATED','business','c4000000-0000-4000-a000-000000000017','{"products":2}','10.20.30.41','2026-02-11T11:01:00.000Z'),
('cb000000-0000-4000-a000-000000000006','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','LOGIN','user','c0000001-0000-4000-a000-000000000001','{"method":"clerk"}','10.20.30.40','2026-02-11T08:00:00.000Z'),
('cb000000-0000-4000-a000-000000000007','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000002','LOGIN','user','c0000001-0000-4000-a000-000000000002','{"method":"clerk"}','10.20.30.41','2026-02-11T08:15:00.000Z'),
('cb000000-0000-4000-a000-000000000008','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000003','LOGIN','user','c0000001-0000-4000-a000-000000000003','{"method":"clerk"}','10.20.30.42','2026-02-11T08:30:00.000Z'),
('cb000000-0000-4000-a000-000000000009','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000004','LOGIN','user','c0000001-0000-4000-a000-000000000004','{"method":"clerk"}','10.20.30.43','2026-02-11T08:45:00.000Z'),
('cb000000-0000-4000-a000-000000000010','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','SETTINGS_UPDATED','tenant','c1000000-0000-4000-a000-000000000001','{"field":"treasuryIntegration"}','10.20.30.40','2026-02-11T10:15:00.000Z'),
('cb000000-0000-4000-a000-000000000011','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000003','SCORE_PULL','business','c4000000-0000-4000-a000-000000000026','{"score":840,"type":"EQUIFAX_ONESCORE","international":true}','10.20.30.42','2026-02-10T14:00:00.000Z'),
('cb000000-0000-4000-a000-000000000012','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000002','OFFER_GENERATED','business','c4000000-0000-4000-a000-000000000026','{"products":2,"tradeFinance":true}','10.20.30.41','2026-02-10T14:01:00.000Z'),
('cb000000-0000-4000-a000-000000000013','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000004','SCORE_PULL','business','c4000000-0000-4000-a000-000000000033','{"score":850,"type":"EXPERIAN"}','10.20.30.43','2026-02-10T11:00:00.000Z'),
('cb000000-0000-4000-a000-000000000014','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000001','SETTINGS_UPDATED','tenant','c1000000-0000-4000-a000-000000000001','{"field":"fxRateAlerts"}','10.20.30.40','2026-02-09T10:00:00.000Z'),
('cb000000-0000-4000-a000-000000000015','c1000000-0000-4000-a000-000000000001','c0000001-0000-4000-a000-000000000003','SCORE_PULL','business','c4000000-0000-4000-a000-000000000043','{"score":845,"type":"EXPERIAN"}','10.20.30.42','2026-02-09T09:00:00.000Z');

-- ── Citi EWS Alerts (5) ──
-- Fewer alerts due to higher quality portfolio
INSERT INTO "ews_alerts" ("id","tenantId","portfolioId","businessId","alertType","severity","message","previousScore","currentScore","createdAt") VALUES
('cc000000-0000-4000-a000-000000000001','c1000000-0000-4000-a000-000000000001','c2000000-0000-4000-a000-000000000001','c4000000-0000-4000-a000-000000000006','SCORE_DROP','MEDIUM','Score declined 25 points — monitor closely',745,720,'2026-02-09T10:00:00.000Z'),
('cc000000-0000-4000-a000-000000000002','c1000000-0000-4000-a000-000000000001','c2000000-0000-4000-a000-000000000001','c4000000-0000-4000-a000-000000000011','UTILIZATION','MEDIUM','Credit utilization increased to 72%',695,695,'2026-02-08T10:00:00.000Z'),
('cc000000-0000-4000-a000-000000000003','c1000000-0000-4000-a000-000000000001','c2000000-0000-4000-a000-000000000001','c4000000-0000-4000-a000-000000000027','SCORE_DROP','MEDIUM','Hospitality sector pressure — score down 18 points',728,710,'2026-02-07T10:00:00.000Z'),
('cc000000-0000-4000-a000-000000000004','c1000000-0000-4000-a000-000000000001','c2000000-0000-4000-a000-000000000001','c4000000-0000-4000-a000-000000000029','SCORE_DROP','HIGH','Luxury market exposure — score below 700',710,680,'2026-02-06T10:00:00.000Z'),
('cc000000-0000-4000-a000-000000000005','c1000000-0000-4000-a000-000000000001','c2000000-0000-4000-a000-000000000001','c4000000-0000-4000-a000-000000000011','DELINQUENCY','MEDIUM','Payment 30 days past due on supplier credit',695,695,'2026-02-05T10:00:00.000Z');

-- ── Citi Tenant API Keys (3) ──
INSERT INTO "tenant_api_keys" ("id","tenantId","name","keyHash","keyPrefix","scopes","environment","isActive","updatedAt") VALUES
('cd000000-0000-4000-a000-000000000001','c1000000-0000-4000-a000-000000000001','Production Treasury API Key','sha256_citi_prod_key_001','sk_live_citi_abc','read:write','production',true,'2026-02-11T00:00:00.000Z'),
('cd000000-0000-4000-a000-000000000002','c1000000-0000-4000-a000-000000000001','Sandbox Test Key','sha256_citi_test_key_002','sk_test_citi_xyz','read','development',true,'2026-02-11T00:00:00.000Z'),
('cd000000-0000-4000-a000-000000000003','c1000000-0000-4000-a000-000000000001','Trade Finance Integration Key','sha256_citi_tts_key_003','sk_live_citi_tts','read:write','production',true,'2026-02-11T00:00:00.000Z');

COMMIT;

-- ============================================================================
-- END CITIBANK SEED DATA
-- ============================================================================
