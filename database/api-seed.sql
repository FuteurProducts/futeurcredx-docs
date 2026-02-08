-- ============================================================================
-- LUMIQ AI — API PostgreSQL Seed Data (Prisma Schema)
-- ============================================================================
-- INSERT-only — Prisma manages DDL via migrations.
-- Prerequisites: npx prisma migrate deploy
-- Usage: psql -U <user> -d <database> -f api-seed.sql
-- 55 businesses across 30+ industries with scores, recommendations,
-- applications, EWS alerts, audit trail, and batch processing.
-- ============================================================================

BEGIN;

-- Clean existing data
TRUNCATE "ews_alerts", "audit_events", "batch_items", "batch_jobs", "business_card_applications", "business_recommendations", "business_scores", "card_attributes", "card_agreements", "cards", "portfolio_businesses", "portfolios", "tenant_users", "tenant_api_keys", "businesses", "api_usage_logs", "api_keys", "alerts", "events", "otps", "users", "tenants" CASCADE;

-- ── Users (5) ──
INSERT INTO "users" ("id","clerkId","email","password","userFname","userLname","status","subscription","verified","updatedAt") VALUES
('30000000-0000-4000-a000-000000000001','user_2a001','john.admin@partnerbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','John','Administrator','ACTIVE','YEAR',true,'2026-01-28T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000002','user_2a002','sarah.dev@partnerbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Sarah','Developer','ACTIVE','YEAR',true,'2026-01-28T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000003','user_2a003','mike.risk@partnerbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Mike','Analyst','ACTIVE','YEAR',true,'2026-01-28T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000004','user_2a004','lisa.rm@partnerbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Lisa','Manager','ACTIVE','MONTH',true,'2026-01-28T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000005','user_2a005','tom.analyst@partnerbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Tom','Analyst','ACTIVE','FREE',false,'2026-01-28T00:00:00.000Z');

-- ── Tenant ──
INSERT INTO "tenants" ("id","name","slug","clerkOrgId","updatedAt") VALUES
('10000000-0000-4000-a000-000000000001','Partner Bank','partner-bank','org_2partner001','2026-01-28T00:00:00.000Z');

-- ── Portfolio ──
INSERT INTO "portfolios" ("id","tenantId","name","code","updatedAt") VALUES
('20000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','SMB Pilot Portfolio','SMB-PILOT','2026-01-28T00:00:00.000Z');

-- ── Tenant Users (5) ──
INSERT INTO "tenant_users" ("id","tenantId","userId","clerkUserId","role") VALUES
('31000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','user_2a001','admin'),
('31000000-0000-4000-a000-000000000002','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000002','user_2a002','analyst'),
('31000000-0000-4000-a000-000000000003','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','user_2a003','analyst'),
('31000000-0000-4000-a000-000000000004','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000004','user_2a004','rm'),
('31000000-0000-4000-a000-000000000005','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000005','user_2a005','viewer');

-- ── Businesses (55) ──
INSERT INTO "businesses" ("id","userId","name","city","state","naicsCode","annualRevenue","riskTier","segment","ownerFname","ownerLname","empCount","yearFounded") VALUES
('40000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','Stellar Dynamics LLC','Austin','TX','541511',3400000,'low','small','James','Chen',42,2019),
('40000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000001','Metro Logistics Corp','Dallas','TX','484110',5200000,'medium','small','Maria','Rodriguez',82,2011),
('40000000-0000-4000-a000-000000000003','30000000-0000-4000-a000-000000000001','Apex Construction Group','Phoenix','AZ','236220',8100000,'low','mid-market','Robert','Kim',120,2014),
('40000000-0000-4000-a000-000000000004','30000000-0000-4000-a000-000000000001','Sunrise Healthcare Partners','Houston','TX','621111',12500000,'low','mid-market','Priya','Patel',210,2017),
('40000000-0000-4000-a000-000000000005','30000000-0000-4000-a000-000000000001','GreenLeaf Organics','Fresno','CA','111000',1800000,'medium','micro','Sofia','Mendez',35,2022),
('40000000-0000-4000-a000-000000000006','30000000-0000-4000-a000-000000000001','Coastal Hospitality Group','Miami','FL','721110',4200000,'high','small','David','Thompson',92,2020),
('40000000-0000-4000-a000-000000000007','30000000-0000-4000-a000-000000000001','Precision Manufacturing Co','Detroit','MI','332710',9800000,'low','mid-market','Thomas','Mueller',175,2004),
('40000000-0000-4000-a000-000000000008','30000000-0000-4000-a000-000000000001','TechVenture Solutions','San Francisco','CA','541512',2200000,'low','small','Sarah','Kim',28,2023),
('40000000-0000-4000-a000-000000000009','30000000-0000-4000-a000-000000000001','Urban Retail Partners','Chicago','IL','445110',950000,'high','micro','Marcus','Johnson',18,2024),
('40000000-0000-4000-a000-000000000010','30000000-0000-4000-a000-000000000001','Pacific Marine Services','Seattle','WA','483211',6700000,'medium','small','Michael','Walsh',65,2015),
('40000000-0000-4000-a000-000000000011','30000000-0000-4000-a000-000000000001','Empire State Digital','New York','NY','541511',7200000,'low','mid-market','Alex','Rivera',95,2018),
('40000000-0000-4000-a000-000000000012','30000000-0000-4000-a000-000000000002','Harbor Freight Logistics','Boston','MA','484110',3800000,'medium','small','Patrick','Sullivan',55,2012),
('40000000-0000-4000-a000-000000000013','30000000-0000-4000-a000-000000000002','Liberty Dental Group','Hartford','CT','621111',2900000,'low','small','Linda','Wu',38,2015),
('40000000-0000-4000-a000-000000000014','30000000-0000-4000-a000-000000000002','BrightPath Tutoring','Newark','NJ','611710',320000,'medium','micro','Rachel','Foster',8,2024),
('40000000-0000-4000-a000-000000000015','30000000-0000-4000-a000-000000000002','Granite State Builders','Manchester','NH','236220',420000,'medium','micro','Mark','Thompson',12,2021),
('40000000-0000-4000-a000-000000000016','30000000-0000-4000-a000-000000000002','Atlantic Seafood Co','Providence','RI','311710',1100000,'low','small','Anthony','Russo',22,2008),
('40000000-0000-4000-a000-000000000017','30000000-0000-4000-a000-000000000002','Hudson Valley Farms','Albany','NY','111000',280000,'high','micro','Karen','Brennan',6,2023),
('40000000-0000-4000-a000-000000000018','30000000-0000-4000-a000-000000000002','Peachtree Medical Associates','Atlanta','GA','621111',6400000,'low','mid-market','William','Harris',78,2011),
('40000000-0000-4000-a000-000000000019','30000000-0000-4000-a000-000000000002','Carolina BBQ Supply','Charlotte','NC','424490',1400000,'medium','small','Danny','Wilson',16,2019),
('40000000-0000-4000-a000-000000000020','30000000-0000-4000-a000-000000000002','Sunshine Auto Repair','Tampa','FL','811111',380000,'medium','micro','Jose','Garcia',9,2022),
('40000000-0000-4000-a000-000000000021','30000000-0000-4000-a000-000000000002','Savannah Event Planners','Savannah','GA','561920',190000,'high','micro','Brittany','Cole',4,2025),
('40000000-0000-4000-a000-000000000022','30000000-0000-4000-a000-000000000002','Lowcountry Brewing Co','Charleston','SC','312120',2600000,'low','small','Nathan','Baker',32,2020),
('40000000-0000-4000-a000-000000000023','30000000-0000-4000-a000-000000000003','Magnolia Staffing','Jacksonville','FL','561311',5800000,'low','mid-market','Diana','Reyes',145,2016),
('40000000-0000-4000-a000-000000000024','30000000-0000-4000-a000-000000000003','Palmetto Landscaping','Raleigh','NC','561730',450000,'medium','micro','Tyler','Scott',14,2023),
('40000000-0000-4000-a000-000000000025','30000000-0000-4000-a000-000000000003','Great Lakes Plating','Cleveland','OH','332710',11200000,'low','mid-market','Richard','Novak',190,1998),
('40000000-0000-4000-a000-000000000026','30000000-0000-4000-a000-000000000003','Prairie Wind Energy','Des Moines','IA','221115',3100000,'low','small','Carol','Anderson',40,2020),
('40000000-0000-4000-a000-000000000027','30000000-0000-4000-a000-000000000003','Heartland Trucking','Milwaukee','WI','484110',4500000,'medium','small','Brian','Murphy',68,2007),
('40000000-0000-4000-a000-000000000028','30000000-0000-4000-a000-000000000003','Twin Cities Bakery','Minneapolis','MN','311811',240000,'medium','micro','Sarah','Lund',7,2024),
('40000000-0000-4000-a000-000000000029','30000000-0000-4000-a000-000000000003','Buckeye Dental Labs','Columbus','OH','339116',1600000,'low','small','Christopher','Hayes',24,2017),
('40000000-0000-4000-a000-000000000030','30000000-0000-4000-a000-000000000003','Desert Sun Solar','Albuquerque','NM','238220',2800000,'low','small','Miguel','Santos',36,2021),
('40000000-0000-4000-a000-000000000031','30000000-0000-4000-a000-000000000003','Rio Grande Veterinary','El Paso','TX','541940',680000,'low','small','Ana','Flores',11,2018),
('40000000-0000-4000-a000-000000000032','30000000-0000-4000-a000-000000000003','Lone Star Food Truck','San Antonio','TX','722330',160000,'high','micro','Kyle','Cooper',3,2025),
('40000000-0000-4000-a000-000000000033','30000000-0000-4000-a000-000000000003','Tulsa Oil Equipment','Tulsa','OK','213112',8500000,'medium','mid-market','Roger','Dawson',110,2006),
('40000000-0000-4000-a000-000000000034','30000000-0000-4000-a000-000000000004','Golden Gate Consulting','San Jose','CA','541611',5600000,'low','mid-market','Jennifer','Park',48,2016),
('40000000-0000-4000-a000-000000000035','30000000-0000-4000-a000-000000000004','Cascade Pet Care','Portland','OR','541940',350000,'medium','micro','Amanda','Green',10,2023),
('40000000-0000-4000-a000-000000000036','30000000-0000-4000-a000-000000000004','Silver State Logistics','Las Vegas','NV','493110',7800000,'low','mid-market','Steven','Chen',130,2013),
('40000000-0000-4000-a000-000000000037','30000000-0000-4000-a000-000000000004','Cornfield Ag Supply','Cedar Rapids','IA','111000',390000,'medium','micro','Thomas','Brown',8,2022),
('40000000-0000-4000-a000-000000000038','30000000-0000-4000-a000-000000000004','Gulf Coast Marine','Mobile','AL','811490',1200000,'high','small','Wayne','Marshall',15,2017),
('40000000-0000-4000-a000-000000000039','30000000-0000-4000-a000-000000000004','Cactus Creek Wellness','Scottsdale','AZ','812199',520000,'medium','small','Nicole','Ramirez',12,2024),
('40000000-0000-4000-a000-000000000040','30000000-0000-4000-a000-000000000004','Redwood Analytics','Sacramento','CA','518210',4100000,'low','small','David','Lee',55,2021),
('40000000-0000-4000-a000-000000000041','30000000-0000-4000-a000-000000000004','Lakeshore Distribution','Indianapolis','IN','423990',6900000,'low','mid-market','Robert','Fischer',85,2010),
('40000000-0000-4000-a000-000000000042','30000000-0000-4000-a000-000000000004','Summit Pharmaceuticals','Boston','MA','325411',15200000,'low','mid-market','Elena','Patel',180,2014),
('40000000-0000-4000-a000-000000000043','30000000-0000-4000-a000-000000000004','FinEdge Technologies','New York','NY','522320',8900000,'low','mid-market','Ryan','Chang',65,2021),
('40000000-0000-4000-a000-000000000044','30000000-0000-4000-a000-000000000004','Pacific Plate Restaurant Group','Los Angeles','CA','722511',3200000,'medium','small','Marco','DiStefano',85,2018),
('40000000-0000-4000-a000-000000000045','30000000-0000-4000-a000-000000000005','Mountain View Development','Denver','CO','236220',22500000,'low','mid-market','Katherine','Wells',95,2008),
('40000000-0000-4000-a000-000000000046','30000000-0000-4000-a000-000000000005','CyberShield Solutions','Washington','DC','541512',6300000,'low','mid-market','James','Washington',45,2019),
('40000000-0000-4000-a000-000000000047','30000000-0000-4000-a000-000000000005','Napa Valley Vintners','Napa','CA','312130',4800000,'low','small','Pierre','Dubois',35,2011),
('40000000-0000-4000-a000-000000000048','30000000-0000-4000-a000-000000000005','Cascade Sports Equipment','Portland','OR','339920',1900000,'medium','small','Derek','Hansen',22,2022),
('40000000-0000-4000-a000-000000000049','30000000-0000-4000-a000-000000000005','Hartford Insurance Associates','Hartford','CT','524210',3500000,'low','small','Margaret','OBrien',28,2006),
('40000000-0000-4000-a000-000000000050','30000000-0000-4000-a000-000000000005','Arizona Solar Installations','Phoenix','AZ','238220',5100000,'low','mid-market','Carlos','Mendez',60,2020),
('40000000-0000-4000-a000-000000000051','30000000-0000-4000-a000-000000000005','Hill Country Craft Brewing','Austin','TX','312120',1700000,'medium','small','Austin','Reed',18,2023),
('40000000-0000-4000-a000-000000000052','30000000-0000-4000-a000-000000000005','Norfolk Maritime Shipping','Norfolk','VA','483111',12800000,'low','mid-market','William','Patterson',95,2001),
('40000000-0000-4000-a000-000000000053','30000000-0000-4000-a000-000000000005','Heartland AgTech Solutions','Omaha','NE','541715',2400000,'medium','small','Emily','Larson',30,2022),
('40000000-0000-4000-a000-000000000054','30000000-0000-4000-a000-000000000005','Peach State Film Productions','Atlanta','GA','512110',3800000,'low','small','Michael','Taylor',42,2020),
('40000000-0000-4000-a000-000000000055','30000000-0000-4000-a000-000000000005','Emerald City Green Building','Seattle','WA','236220',9500000,'low','mid-market','Sarah','Nakamura',75,2016);

-- ── Portfolio Businesses (55) ──
INSERT INTO "portfolio_businesses" ("id","portfolioId","businessId")
SELECT '90000000-0000-4000-a000-' || LPAD(ROW_NUMBER() OVER(ORDER BY "id")::text, 12, '0'),
  '20000000-0000-4000-a000-000000000001', "id"
FROM "businesses" WHERE "id" LIKE '40000000-%';

-- ── Cards (8) ──
INSERT INTO "cards" ("id","name","brand","network","annualFee","updatedAt") VALUES
('50000000-0000-4000-a000-000000000001','Business Rewards Visa','Visa','Visa',0,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000002','Business Platinum Visa','Visa','Visa',95,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000003','Business Cash Back Card','Mastercard','Mastercard',0,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000004','Business Travel Card','Visa','Visa',150,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000005','Small Business Starter Card','Visa','Visa',0,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000006','Business Secured Card','Visa','Visa',0,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000007','Business Fleet Card','Mastercard','Mastercard',0,'2026-01-28T00:00:00.000Z'),
('50000000-0000-4000-a000-000000000008','Corporate Rewards Card','Amex','Amex',250,'2026-01-28T00:00:00.000Z');

-- ── Card Attributes (8) ──
INSERT INTO "card_attributes" ("id","cardId","annualFee","introAPR","regularAPR","creditRequired","rewardRate","rewardType","updatedAt") VALUES
('50100000-0000-4000-a000-000000000001','50000000-0000-4000-a000-000000000001',0,'0% 12 months','14.99% - 22.99%','Good','1.5% on all purchases','Cash Back','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000002','50000000-0000-4000-a000-000000000002',95,'0% 15 months','13.99% - 21.99%','Excellent','2x points on all purchases','Points','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000003','50000000-0000-4000-a000-000000000003',0,'0% 9 months','15.99% - 24.99%','Fair','2% on dining and gas, 1% other','Cash Back','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000004','50000000-0000-4000-a000-000000000004',150,'N/A','16.99% - 23.99%','Good','3x on travel, 2x dining','Miles','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000005','50000000-0000-4000-a000-000000000005',0,'0% 6 months','19.99% - 26.99%','Fair','1% on all purchases','Cash Back','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000006','50000000-0000-4000-a000-000000000006',0,'N/A','22.99%','None','1% on all purchases','Cash Back','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000007','50000000-0000-4000-a000-000000000007',0,'N/A','18.99% - 24.99%','Good','3% on fuel, 2% maintenance','Cash Back','2026-01-28T00:00:00.000Z'),
('50100000-0000-4000-a000-000000000008','50000000-0000-4000-a000-000000000008',250,'N/A','15.99% - 22.99%','Excellent','3x on all categories','Points','2026-01-28T00:00:00.000Z');

-- ── Business Scores (55) ──
INSERT INTO "business_scores" ("id","businessId","score","type","metadata") VALUES
('60000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000001',780,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000002','40000000-0000-4000-a000-000000000002',710,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000003','40000000-0000-4000-a000-000000000003',820,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000004','40000000-0000-4000-a000-000000000004',850,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000005','40000000-0000-4000-a000-000000000005',650,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000006','40000000-0000-4000-a000-000000000006',580,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000007','40000000-0000-4000-a000-000000000007',760,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000008','40000000-0000-4000-a000-000000000008',850,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000009','40000000-0000-4000-a000-000000000009',620,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000010','40000000-0000-4000-a000-000000000010',730,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000011','40000000-0000-4000-a000-000000000011',790,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000012','40000000-0000-4000-a000-000000000012',680,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000013','40000000-0000-4000-a000-000000000013',760,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000014','40000000-0000-4000-a000-000000000014',165,'SBSS','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000015','40000000-0000-4000-a000-000000000015',660,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000016','40000000-0000-4000-a000-000000000016',740,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000017','40000000-0000-4000-a000-000000000017',550,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000018','40000000-0000-4000-a000-000000000018',810,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000019','40000000-0000-4000-a000-000000000019',685,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000020','40000000-0000-4000-a000-000000000020',645,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000021','40000000-0000-4000-a000-000000000021',520,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000022','40000000-0000-4000-a000-000000000022',755,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000023','40000000-0000-4000-a000-000000000023',795,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000024','40000000-0000-4000-a000-000000000024',670,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000025','40000000-0000-4000-a000-000000000025',830,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000026','40000000-0000-4000-a000-000000000026',775,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000027','40000000-0000-4000-a000-000000000027',640,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000028','40000000-0000-4000-a000-000000000028',155,'SBSS','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000029','40000000-0000-4000-a000-000000000029',745,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000030','40000000-0000-4000-a000-000000000030',770,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000031','40000000-0000-4000-a000-000000000031',750,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000032','40000000-0000-4000-a000-000000000032',510,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000033','40000000-0000-4000-a000-000000000033',635,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000034','40000000-0000-4000-a000-000000000034',805,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000035','40000000-0000-4000-a000-000000000035',160,'SBSS','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000036','40000000-0000-4000-a000-000000000036',785,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000037','40000000-0000-4000-a000-000000000037',655,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000038','40000000-0000-4000-a000-000000000038',565,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000039','40000000-0000-4000-a000-000000000039',675,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000040','40000000-0000-4000-a000-000000000040',800,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000041','40000000-0000-4000-a000-000000000041',780,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000042','40000000-0000-4000-a000-000000000042',825,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000043','40000000-0000-4000-a000-000000000043',815,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000044','40000000-0000-4000-a000-000000000044',690,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000045','40000000-0000-4000-a000-000000000045',840,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000046','40000000-0000-4000-a000-000000000046',810,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000047','40000000-0000-4000-a000-000000000047',750,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000048','40000000-0000-4000-a000-000000000048',670,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000049','40000000-0000-4000-a000-000000000049',760,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000050','40000000-0000-4000-a000-000000000050',795,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000051','40000000-0000-4000-a000-000000000051',170,'SBSS','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000052','40000000-0000-4000-a000-000000000052',800,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000053','40000000-0000-4000-a000-000000000053',680,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000054','40000000-0000-4000-a000-000000000054',765,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'),
('60000000-0000-4000-a000-000000000055','40000000-0000-4000-a000-000000000055',810,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}');

-- ── Business Recommendations (55, generated from businesses+scores) ──
INSERT INTO "business_recommendations" ("id","businessId","recommendations","scoreSnapshot","expiresAt","createdAt","updatedAt")
SELECT
  '70000000-0000-4000-a000-' || LPAD(ROW_NUMBER() OVER(ORDER BY b."id")::text, 12, '0'),
  b."id",
  CASE
    WHEN b."riskTier" = 'low' AND bs."score" >= 800
      THEN '[{"cardId":"50000000-0000-4000-a000-000000000002","name":"Business Platinum Visa","fitScore":94,"reason":"Premium credit profile"},{"cardId":"50000000-0000-4000-a000-000000000001","name":"Business Rewards Visa","fitScore":89,"reason":"Strong payment history"}]'::jsonb
    WHEN b."riskTier" = 'low'
      THEN '[{"cardId":"50000000-0000-4000-a000-000000000001","name":"Business Rewards Visa","fitScore":82,"reason":"Good credit profile"},{"cardId":"50000000-0000-4000-a000-000000000003","name":"Business Cash Back Card","fitScore":78,"reason":"Fits operational spending"}]'::jsonb
    WHEN b."riskTier" = 'medium'
      THEN '[{"cardId":"50000000-0000-4000-a000-000000000005","name":"Small Business Starter Card","fitScore":62,"reason":"Build credit history"},{"cardId":"50000000-0000-4000-a000-000000000003","name":"Business Cash Back Card","fitScore":55,"reason":"Consider after 6 months"}]'::jsonb
    ELSE '[{"cardId":"50000000-0000-4000-a000-000000000006","name":"Business Secured Card","fitScore":42,"reason":"Secured card to rebuild credit"}]'::jsonb
  END,
  bs."score",
  '2026-07-28T00:00:00.000Z',
  CURRENT_TIMESTAMP,
  '2026-01-28T00:00:00.000Z'
FROM "businesses" b
JOIN "business_scores" bs ON bs."businessId" = b."id"
WHERE b."id" LIKE '40000000-%';

-- ── Card Applications (25) ──
INSERT INTO "business_card_applications" ("id","businessId","cardId","status","fitScore","reason","updatedAt") VALUES
('80000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000001','50000000-0000-4000-a000-000000000001','APPROVED',92,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000002','40000000-0000-4000-a000-000000000001','50000000-0000-4000-a000-000000000003','APPLIED',87,'Application under review','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000003','40000000-0000-4000-a000-000000000002','50000000-0000-4000-a000-000000000007','APPROVED',71,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000004','40000000-0000-4000-a000-000000000003','50000000-0000-4000-a000-000000000002','APPROVED',88,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000005','40000000-0000-4000-a000-000000000003','50000000-0000-4000-a000-000000000004','APPLIED',85,'Application under review','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000006','40000000-0000-4000-a000-000000000004','50000000-0000-4000-a000-000000000008','APPROVED',94,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000007','40000000-0000-4000-a000-000000000005','50000000-0000-4000-a000-000000000005','PENDING',62,'Awaiting additional documentation','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000008','40000000-0000-4000-a000-000000000006','50000000-0000-4000-a000-000000000006','REJECTED',38,'Does not meet minimum requirements','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000009','40000000-0000-4000-a000-000000000007','50000000-0000-4000-a000-000000000002','APPROVED',82,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000010','40000000-0000-4000-a000-000000000008','50000000-0000-4000-a000-000000000001','APPROVED',95,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000011','40000000-0000-4000-a000-000000000008','50000000-0000-4000-a000-000000000004','APPLIED',88,'Application under review','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000012','40000000-0000-4000-a000-000000000010','50000000-0000-4000-a000-000000000003','APPROVED',78,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000013','40000000-0000-4000-a000-000000000011','50000000-0000-4000-a000-000000000002','APPROVED',85,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000014','40000000-0000-4000-a000-000000000013','50000000-0000-4000-a000-000000000001','APPROVED',80,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000015','40000000-0000-4000-a000-000000000018','50000000-0000-4000-a000-000000000008','APPROVED',90,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000016','40000000-0000-4000-a000-000000000022','50000000-0000-4000-a000-000000000003','APPLIED',76,'Application under review','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000017','40000000-0000-4000-a000-000000000023','50000000-0000-4000-a000-000000000002','APPROVED',84,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000018','40000000-0000-4000-a000-000000000025','50000000-0000-4000-a000-000000000008','APPROVED',91,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000019','40000000-0000-4000-a000-000000000034','50000000-0000-4000-a000-000000000004','APPROVED',86,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000020','40000000-0000-4000-a000-000000000036','50000000-0000-4000-a000-000000000002','APPLIED',83,'Application under review','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000021','40000000-0000-4000-a000-000000000040','50000000-0000-4000-a000-000000000001','APPROVED',85,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000022','40000000-0000-4000-a000-000000000042','50000000-0000-4000-a000-000000000008','APPROVED',92,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000023','40000000-0000-4000-a000-000000000043','50000000-0000-4000-a000-000000000004','APPROVED',88,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000024','40000000-0000-4000-a000-000000000045','50000000-0000-4000-a000-000000000002','APPROVED',90,'Met underwriting criteria','2026-01-28T00:00:00.000Z'),
('80000000-0000-4000-a000-000000000025','40000000-0000-4000-a000-000000000052','50000000-0000-4000-a000-000000000008','APPLIED',84,'Application under review','2026-01-28T00:00:00.000Z');

-- ── Batch Jobs (2) ──
INSERT INTO "batch_jobs" ("id","portfolioId","tenantId","submittedBy","status","totalCount","processedCount","failedCount","startedAt","completedAt","updatedAt") VALUES
('a0000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','COMPLETED',10,10,0,'2026-01-25T10:00:00.000Z','2026-01-25T10:05:00.000Z','2026-01-28T00:00:00.000Z'),
('a0000000-0000-4000-a000-000000000002','20000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000002','PROCESSING',5,3,0,'2026-01-28T14:00:00.000Z',NULL,'2026-01-28T00:00:00.000Z');

-- ── Batch Items (10) ──
INSERT INTO "batch_items" ("id","batchJobId","businessId","inputData","status","scoreResult","processedAt") VALUES
('a1000000-0000-4000-a000-000000000001','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000001','{"name":"Stellar Dynamics LLC","city":"Austin","state":"TX"}','RECOMMENDED','{"score":780,"type":"EXPERIAN"}','2026-01-25T10:01:00.000Z'),
('a1000000-0000-4000-a000-000000000002','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000002','{"name":"Metro Logistics Corp","city":"Dallas","state":"TX"}','RECOMMENDED','{"score":710,"type":"EQUIFAX_ONESCORE"}','2026-01-25T10:02:00.000Z'),
('a1000000-0000-4000-a000-000000000003','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000003','{"name":"Apex Construction Group","city":"Phoenix","state":"AZ"}','RECOMMENDED','{"score":820,"type":"EXPERIAN"}','2026-01-25T10:03:00.000Z'),
('a1000000-0000-4000-a000-000000000004','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000004','{"name":"Sunrise Healthcare Partners","city":"Houston","state":"TX"}','RECOMMENDED','{"score":850,"type":"EQUIFAX_ONESCORE"}','2026-01-25T10:04:00.000Z'),
('a1000000-0000-4000-a000-000000000005','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000005','{"name":"GreenLeaf Organics","city":"Fresno","state":"CA"}','RECOMMENDED','{"score":650,"type":"EXPERIAN"}','2026-01-25T10:05:00.000Z'),
('a1000000-0000-4000-a000-000000000006','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000006','{"name":"Coastal Hospitality Group","city":"Miami","state":"FL"}','RECOMMENDED','{"score":580,"type":"EQUIFAX_MASTERSCORE"}','2026-01-25T10:06:00.000Z'),
('a1000000-0000-4000-a000-000000000007','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000007','{"name":"Precision Manufacturing Co","city":"Detroit","state":"MI"}','RECOMMENDED','{"score":760,"type":"EQUIFAX_ONESCORE"}','2026-01-25T10:07:00.000Z'),
('a1000000-0000-4000-a000-000000000008','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000008','{"name":"TechVenture Solutions","city":"San Francisco","state":"CA"}','RECOMMENDED','{"score":850,"type":"EXPERIAN"}','2026-01-25T10:08:00.000Z'),
('a1000000-0000-4000-a000-000000000009','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000009','{"name":"Urban Retail Partners","city":"Chicago","state":"IL"}','RECOMMENDED','{"score":620,"type":"EQUIFAX_MASTERSCORE"}','2026-01-25T10:09:00.000Z'),
('a1000000-0000-4000-a000-000000000010','a0000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000010','{"name":"Pacific Marine Services","city":"Seattle","state":"WA"}','RECOMMENDED','{"score":730,"type":"EXPERIAN"}','2026-01-25T10:00:00.000Z');

-- ── Audit Events (20) ──
INSERT INTO "audit_events" ("id","tenantId","userId","action","resourceType","resourceId","details","ipAddress","createdAt") VALUES
('b0000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','SCORE_PULL','business','40000000-0000-4000-a000-000000000001','{"score":780,"type":"EXPERIAN"}','192.168.1.100','2026-01-28T14:30:00.000Z'),
('b0000000-0000-4000-a000-000000000002','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000002','SCORE_PULL','business','40000000-0000-4000-a000-000000000002','{"score":710,"type":"EQUIFAX_ONESCORE"}','192.168.1.105','2026-01-28T14:00:00.000Z'),
('b0000000-0000-4000-a000-000000000003','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','SCORE_PULL','business','40000000-0000-4000-a000-000000000003','{"score":820,"type":"EXPERIAN"}','192.168.1.110','2026-01-28T13:30:00.000Z'),
('b0000000-0000-4000-a000-000000000004','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','OFFER_GENERATED','business','40000000-0000-4000-a000-000000000001','{"cards":2}','192.168.1.100','2026-01-28T14:31:00.000Z'),
('b0000000-0000-4000-a000-000000000005','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','OFFER_GENERATED','business','40000000-0000-4000-a000-000000000003','{"cards":2}','192.168.1.100','2026-01-28T13:31:00.000Z'),
('b0000000-0000-4000-a000-000000000006','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','APPLICATION_APPROVED','application','80000000-0000-4000-a000-000000000001','{"product":"Business Rewards Visa"}','192.168.1.110','2026-01-27T16:00:00.000Z'),
('b0000000-0000-4000-a000-000000000007','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','APPLICATION_APPROVED','application','80000000-0000-4000-a000-000000000004','{"product":"Business Platinum Visa"}','192.168.1.110','2026-01-27T15:00:00.000Z'),
('b0000000-0000-4000-a000-000000000008','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','APPLICATION_REJECTED','application','80000000-0000-4000-a000-000000000008','{"reason":"Does not meet minimum requirements"}','192.168.1.110','2026-01-27T14:00:00.000Z'),
('b0000000-0000-4000-a000-000000000009','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','BATCH_SUBMITTED','batch','a0000000-0000-4000-a000-000000000001','{"totalCount":10}','192.168.1.100','2026-01-25T10:00:00.000Z'),
('b0000000-0000-4000-a000-000000000010','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000002','BATCH_SUBMITTED','batch','a0000000-0000-4000-a000-000000000002','{"totalCount":5}','192.168.1.105','2026-01-28T14:00:00.000Z'),
('b0000000-0000-4000-a000-000000000011','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','SETTINGS_UPDATED','tenant','10000000-0000-4000-a000-000000000001','{"field":"ewsThresholds"}','192.168.1.100','2026-01-28T10:15:00.000Z'),
('b0000000-0000-4000-a000-000000000012','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','LOGIN','user','30000000-0000-4000-a000-000000000001','{"method":"clerk"}','192.168.1.100','2026-01-28T09:00:00.000Z'),
('b0000000-0000-4000-a000-000000000013','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000002','LOGIN','user','30000000-0000-4000-a000-000000000002','{"method":"clerk"}','192.168.1.105','2026-01-28T09:05:00.000Z'),
('b0000000-0000-4000-a000-000000000014','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','LOGIN','user','30000000-0000-4000-a000-000000000003','{"method":"clerk"}','192.168.1.110','2026-01-28T08:50:00.000Z'),
('b0000000-0000-4000-a000-000000000015','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000004','LOGIN','user','30000000-0000-4000-a000-000000000004','{"method":"clerk"}','192.168.1.115','2026-01-28T09:10:00.000Z'),
('b0000000-0000-4000-a000-000000000016','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000004','SCORE_PULL','business','40000000-0000-4000-a000-000000000034','{"score":805,"type":"EXPERIAN"}','192.168.1.115','2026-01-27T11:00:00.000Z'),
('b0000000-0000-4000-a000-000000000017','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000004','OFFER_GENERATED','business','40000000-0000-4000-a000-000000000034','{"cards":2}','192.168.1.115','2026-01-27T11:01:00.000Z'),
('b0000000-0000-4000-a000-000000000018','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','SETTINGS_UPDATED','tenant','10000000-0000-4000-a000-000000000001','{"field":"apiKeyRotation"}','192.168.1.100','2026-01-26T10:00:00.000Z'),
('b0000000-0000-4000-a000-000000000019','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000003','APPLICATION_APPROVED','application','80000000-0000-4000-a000-000000000006','{"product":"Corporate Rewards Card"}','192.168.1.110','2026-01-26T14:00:00.000Z'),
('b0000000-0000-4000-a000-000000000020','10000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000002','SCORE_PULL','business','40000000-0000-4000-a000-000000000042','{"score":825,"type":"EXPERIAN"}','192.168.1.105','2026-01-26T09:00:00.000Z');

-- ── EWS Alerts (8) ──
INSERT INTO "ews_alerts" ("id","tenantId","portfolioId","businessId","alertType","severity","message","previousScore","currentScore","createdAt") VALUES
('c0000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000006','SCORE_DROP','HIGH','Score dropped below 600 threshold',610,580,'2026-01-21T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000002','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000009','SCORE_DROP','MEDIUM','Score declined 35 points in 90 days',655,620,'2026-01-22T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000003','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000017','SCORE_DROP','HIGH','Score below minimum underwriting threshold',590,550,'2026-01-23T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000004','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000021','DELINQUENCY','CRITICAL','Payment 60+ days past due on trade line',560,520,'2026-01-24T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000005','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000032','SCORE_DROP','HIGH','Severe score deterioration — review required',580,510,'2026-01-25T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000006','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000038','PUBLIC_RECORD','MEDIUM','New tax lien filed against business',600,565,'2026-01-26T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000007','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000027','UTILIZATION','MEDIUM','Credit utilization exceeded 85% on revolving lines',670,640,'2026-01-27T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000000008','10000000-0000-4000-a000-000000000001','20000000-0000-4000-a000-000000000001','40000000-0000-4000-a000-000000000005','SCORE_DROP','LOW','Score trending down — monitor closely',680,650,'2026-01-28T10:00:00.000Z');

-- ── Tenant API Keys (3) ──
INSERT INTO "tenant_api_keys" ("id","tenantId","name","keyHash","keyPrefix","scopes","environment","isActive","updatedAt") VALUES
('d0000000-0000-4000-a000-000000000001','10000000-0000-4000-a000-000000000001','Production API Key','sha256_prod_key_001_hash','sk_live_abc','read:write','production',true,'2026-01-28T00:00:00.000Z'),
('d0000000-0000-4000-a000-000000000002','10000000-0000-4000-a000-000000000001','Sandbox Test Key','sha256_test_key_002_hash','sk_test_xyz','read','development',true,'2026-01-28T00:00:00.000Z'),
('d0000000-0000-4000-a000-000000000003','10000000-0000-4000-a000-000000000001','Deprecated Key','sha256_old_key_003_hash','sk_live_old','read','production',false,'2026-01-28T00:00:00.000Z');

-- ── API Keys (user-level, 3) ──
INSERT INTO "api_keys" ("id","name","keyHash","keyPrefix","userId","isActive","scopes","environment","updatedAt") VALUES
('f0000000-0000-4000-a000-000000000001','Admin Production Key','sha256_user_key_001','sk_u_live_a','30000000-0000-4000-a000-000000000001',true,ARRAY['read','write','admin'],'production','2026-01-28T00:00:00.000Z'),
('f0000000-0000-4000-a000-000000000002','Dev Sandbox Key','sha256_user_key_002','sk_u_test_b','30000000-0000-4000-a000-000000000002',true,ARRAY['read','write'],'development','2026-01-28T00:00:00.000Z'),
('f0000000-0000-4000-a000-000000000003','Risk Read-Only Key','sha256_user_key_003','sk_u_live_c','30000000-0000-4000-a000-000000000003',true,ARRAY['read'],'production','2026-01-28T00:00:00.000Z');

-- ── Events (8) ──
INSERT INTO "events" ("id","eventType","userId","details","createdAt") VALUES
('f2000000-0000-4000-a000-000000000001','SUCCESS','30000000-0000-4000-a000-000000000001','User login successful','2026-01-28T09:00:00.000Z'),
('f2000000-0000-4000-a000-000000000002','SUCCESS','30000000-0000-4000-a000-000000000002','User login successful','2026-01-28T09:05:00.000Z'),
('f2000000-0000-4000-a000-000000000003','SUCCESS','30000000-0000-4000-a000-000000000003','User login successful','2026-01-28T08:50:00.000Z'),
('f2000000-0000-4000-a000-000000000004','SUCCESS','30000000-0000-4000-a000-000000000004','User login successful','2026-01-28T09:10:00.000Z'),
('f2000000-0000-4000-a000-000000000005','INFO','30000000-0000-4000-a000-000000000001','Settings updated: EWS thresholds','2026-01-28T10:15:00.000Z'),
('f2000000-0000-4000-a000-000000000006','SUCCESS','30000000-0000-4000-a000-000000000001','Batch job submitted: 10 businesses','2026-01-25T10:00:00.000Z'),
('f2000000-0000-4000-a000-000000000007','ERROR','30000000-0000-4000-a000-000000000002','API rate limit exceeded','2026-01-27T16:30:00.000Z'),
('f2000000-0000-4000-a000-000000000008','INFO','30000000-0000-4000-a000-000000000003','Report exported: Portfolio Risk Summary','2026-01-27T16:20:00.000Z');

-- ── Alerts (5) ──
INSERT INTO "alerts" ("id","userId","warningDetails","read","createdAt") VALUES
('f3000000-0000-4000-a000-000000000001','30000000-0000-4000-a000-000000000001','{"type":"ews","message":"5 new EWS alerts require attention","severity":"high"}',false,'2026-01-28T10:00:00.000Z'),
('f3000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000003','{"type":"score_change","message":"3 businesses had score drops > 20 points","severity":"medium"}',false,'2026-01-28T09:00:00.000Z'),
('f3000000-0000-4000-a000-000000000003','30000000-0000-4000-a000-000000000004','{"type":"application","message":"2 applications awaiting RM review","severity":"low"}',true,'2026-01-27T14:00:00.000Z'),
('f3000000-0000-4000-a000-000000000004','30000000-0000-4000-a000-000000000001','{"type":"system","message":"Batch job completed: 10/10 processed","severity":"info"}',true,'2026-01-25T10:05:00.000Z'),
('f3000000-0000-4000-a000-000000000005','30000000-0000-4000-a000-000000000002','{"type":"api","message":"API key approaching rate limit threshold","severity":"medium"}',false,'2026-01-27T16:30:00.000Z');

COMMIT;
