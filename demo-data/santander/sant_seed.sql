-- ============================================================================
-- SANTANDER BANK — Demo SQL Seed Data
-- ============================================================================
-- Regional powerhouse in Northeast US with community banking focus
-- Brand: Santander Bank, N.A. (#EC0000 red)
-- Headquarters: Boston, MA
-- Market: 401 branches, 8 Northeast states
-- Specialty: Multifamily CRE ($13.5B), Hispanic/Latino businesses, SBA lending
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. TENANT & PORTFOLIO
-- ============================================================================

INSERT INTO "tenants" ("id","name","slug","clerkOrgId","updatedAt") VALUES
('10000000-0000-4000-a000-000000000002','Santander Bank','santander-bank','org_2santander001','2026-02-11T00:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "portfolios" ("id","tenantId","name","code","updatedAt") VALUES
('20000000-0000-4000-a000-000000000002','10000000-0000-4000-a000-000000000002','Santander Northeast SMB Portfolio','SANT-NE-SMB','2026-02-11T00:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 2. USERS (5 Santander bankers)
-- ============================================================================

INSERT INTO "users" ("id","clerkId","email","password","userFname","userLname","status","subscription","verified","updatedAt") VALUES
('30000000-0000-4000-a000-000000000010','user_2s001','carlos.admin@santanderbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Carlos','Rodriguez','ACTIVE','YEAR',true,'2026-02-11T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000011','user_2s002','maria.lopez@santanderbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Maria','Lopez','ACTIVE','YEAR',true,'2026-02-11T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000012','user_2s003','james.brennan@santanderbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','James','Brennan','ACTIVE','YEAR',true,'2026-02-11T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000013','user_2s004','sophia.chen@santanderbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','Sophia','Chen','ACTIVE','MONTH',true,'2026-02-11T00:00:00.000Z'),
('30000000-0000-4000-a000-000000000014','user_2s005','david.murphy@santanderbank.com','$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0','David','Murphy','ACTIVE','FREE',false,'2026-02-11T00:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "tenant_users" ("id","tenantId","userId","clerkUserId","role") VALUES
('31000000-0000-4000-a000-000000000010','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000010','user_2s001','admin'),
('31000000-0000-4000-a000-000000000011','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000011','user_2s002','analyst'),
('31000000-0000-4000-a000-000000000012','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000012','user_2s003','analyst'),
('31000000-0000-4000-a000-000000000013','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000013','user_2s004','rm'),
('31000000-0000-4000-a000-000000000014','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000014','user_2s005','viewer')
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 3. BUSINESSES (32 businesses — Northeast-focused, Hispanic/Latino-owned)
-- ============================================================================

INSERT INTO "businesses" ("id","userId","name","city","state","naicsCode","annualRevenue","riskTier","segment","ownerFname","ownerLname","empCount","yearFounded") VALUES
-- Massachusetts (Boston HQ market) - 8 businesses
('40000000-0000-4000-a000-000000100001','30000000-0000-4000-a000-000000000010','Boston Harbor Seafood Distributors','Boston','MA','311710',4200000,'low','small','Miguel','Santos',38,2014),
('40000000-0000-4000-a000-000000100002','30000000-0000-4000-a000-000000000010','Bay State Healthcare Partners','Worcester','MA','621111',6800000,'low','mid-market','Priya','Patel',85,2016),
('40000000-0000-4000-a000-000000100003','30000000-0000-4000-a000-000000000010','La Familia Bakery & Cafe','Springfield','MA','722515',850000,'medium','micro','Carmen','Diaz',12,2022),
('40000000-0000-4000-a000-000000100004','30000000-0000-4000-a000-000000000010','Commonwealth Tech Solutions','Cambridge','MA','541511',5100000,'low','small','David','Nguyen',42,2019),
('40000000-0000-4000-a000-000000100005','30000000-0000-4000-a000-000000000011','North Shore Construction Group','Salem','MA','236220',3200000,'medium','small','Patrick','Sullivan',28,2018),
('40000000-0000-4000-a000-000000100006','30000000-0000-4000-a000-000000000011','Beacon Hill Legal Associates','Boston','MA','541110',2900000,'low','small','Jennifer','Wu',22,2020),
('40000000-0000-4000-a000-000000100007','30000000-0000-4000-a000-000000000011','Lowell Textile Manufacturing','Lowell','MA','313210',1800000,'medium','small','Robert','OBrien',18,2015),
('40000000-0000-4000-a000-000000100008','30000000-0000-4000-a000-000000000011','Cape Cod Vacation Properties','Hyannis','MA','531110',12500000,'low','mid-market','Elizabeth','Morrison',65,2010),

-- New York (NYC multifamily focus) - 8 businesses
('40000000-0000-4000-a000-000000100009','30000000-0000-4000-a000-000000000011','Manhattan Multifamily Properties LLC','New York','NY','531110',18200000,'low','mid-market','David','Cohen',48,2012),
('40000000-0000-4000-a000-000000100010','30000000-0000-4000-a000-000000000011','Queens Latino Business Services','Queens','NY','561110',1400000,'medium','small','Rosa','Martinez',16,2021),
('40000000-0000-4000-a000-000000100011','30000000-0000-4000-a000-000000000012','Bronx Fresh Produce Wholesale','Bronx','NY','424480',3600000,'low','small','Luis','Hernandez',32,2017),
('40000000-0000-4000-a000-000000100012','30000000-0000-4000-a000-000000000012','Brooklyn Heights Dental Practice','Brooklyn','NY','621111',2200000,'low','small','Sarah','Kim',14,2019),
('40000000-0000-4000-a000-000000100013','30000000-0000-4000-a000-000000000012','Albany Government Consulting','Albany','NY','541611',4100000,'low','small','Thomas','Ryan',26,2015),
('40000000-0000-4000-a000-000000100014','30000000-0000-4000-a000-000000000012','Rochester Advanced Manufacturing','Rochester','NY','332710',8900000,'low','mid-market','Michael','Zhang',92,2009),
('40000000-0000-4000-a000-000000100015','30000000-0000-4000-a000-000000000012','Long Island Food Truck Collective','Hempstead','NY','722330',420000,'high','micro','Antonio','Garcia',8,2025),
('40000000-0000-4000-a000-000000100016','30000000-0000-4000-a000-000000000012','Hudson Valley Winery & Tours','Newburgh','NY','312130',1900000,'medium','small','Isabella','Romano',19,2020),

-- New Jersey (dense suburban commercial) - 6 businesses
('40000000-0000-4000-a000-000000100017','30000000-0000-4000-a000-000000000012','Newark Logistics & Warehousing','Newark','NJ','493110',6200000,'low','mid-market','James','Washington',58,2013),
('40000000-0000-4000-a000-000000100018','30000000-0000-4000-a000-000000000013','Jersey City Financial Services','Jersey City','NJ','523930',3800000,'low','small','Emily','Park',24,2018),
('40000000-0000-4000-a000-000000100019','30000000-0000-4000-a000-000000000013','Paterson Auto Body & Collision','Paterson','NJ','811121',950000,'medium','micro','Carlos','Morales',11,2023),
('40000000-0000-4000-a000-000000100020','30000000-0000-4000-a000-000000000013','Trenton Healthcare Staffing','Trenton','NJ','561320',5500000,'low','small','Linda','Johnson',46,2016),
('40000000-0000-4000-a000-000000100021','30000000-0000-4000-a000-000000000013','Princeton Education Technology','Princeton','NJ','541512',4700000,'low','small','Kevin','Chen',38,2021),
('40000000-0000-4000-a000-000000100022','30000000-0000-4000-a000-000000000013','Camden Community Development Corp','Camden','NJ','531390',780000,'high','small','Marcus','Brown',9,2024),

-- Pennsylvania (Philadelphia metro) - 4 businesses
('40000000-0000-4000-a000-000000100023','30000000-0000-4000-a000-000000000013','Philadelphia Italian Restaurant Group','Philadelphia','PA','722511',3200000,'medium','small','Giovanni','Rossini',42,2015),
('40000000-0000-4000-a000-000000100024','30000000-0000-4000-a000-000000000013','Lehigh Valley Industrial Supply','Allentown','PA','423840',7400000,'low','mid-market','Robert','Fischer',64,2011),
('40000000-0000-4000-a000-000000100025','30000000-0000-4000-a000-000000000014','Pittsburgh Tech Consulting','Pittsburgh','PA','541512',2800000,'low','small','Amanda','Lee',21,2020),
('40000000-0000-4000-a000-000000100026','30000000-0000-4000-a000-000000000014','Harrisburg HVAC Services','Harrisburg','PA','238220',1600000,'medium','small','Daniel','Murphy',15,2019),

-- Other Northeast states (CT, RI, NH, DE) - 6 businesses
('40000000-0000-4000-a000-000000100027','30000000-0000-4000-a000-000000000014','Hartford Insurance Brokerage','Hartford','CT','524210',4500000,'low','small','Margaret','Sullivan',32,2014),
('40000000-0000-4000-a000-000000100028','30000000-0000-4000-a000-000000000014','Providence Jewelry Manufacturers','Providence','RI','339910',2100000,'low','small','Anthony','DeLuca',18,2017),
('40000000-0000-4000-a000-000000100029','30000000-0000-4000-a000-000000000014','Manchester Software Services','Manchester','NH','541511',3400000,'low','small','Rachel','Foster',26,2021),
('40000000-0000-4000-a000-000000100030','30000000-0000-4000-a000-000000000014','Wilmington Credit Union Support','Wilmington','DE','522190',1200000,'medium','small','Steven','Wright',14,2022),
('40000000-0000-4000-a000-000000100031','30000000-0000-4000-a000-000000000014','New Haven University Food Services','New Haven','CT','722310',5800000,'low','mid-market','Maria','Torres',78,2013),
('40000000-0000-4000-a000-000000100032','30000000-0000-4000-a000-000000000014','Portsmouth Marine Supply','Portsmouth','NH','441222',880000,'medium','micro','Christopher','Hayes',10,2023)
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 4. PORTFOLIO BUSINESSES (32 businesses)
-- ============================================================================

INSERT INTO "portfolio_businesses" ("id","portfolioId","businessId")
SELECT '90000000-0000-4000-a000-0000001' || LPAD(ROW_NUMBER() OVER(ORDER BY "id")::text, 5, '0'),
  '20000000-0000-4000-a000-000000000002', "id"
FROM "businesses" WHERE "id" LIKE '40000000-0000-4000-a000-0000001%'
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 5. BUSINESS SCORES (32 businesses)
-- ============================================================================

INSERT INTO "business_scores" ("id","businessId","score","type","metadata") VALUES
('60000000-0000-4000-a000-000000100001','40000000-0000-4000-a000-000000100001',755,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100002','40000000-0000-4000-a000-000000100002',805,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100003','40000000-0000-4000-a000-000000100003',625,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100004','40000000-0000-4000-a000-000000100004',785,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100005','40000000-0000-4000-a000-000000100005',680,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100006','40000000-0000-4000-a000-000000100006',795,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100007','40000000-0000-4000-a000-000000100007',670,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100008','40000000-0000-4000-a000-000000100008',840,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100009','40000000-0000-4000-a000-000000100009',850,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100010','40000000-0000-4000-a000-000000100010',655,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100011','40000000-0000-4000-a000-000000100011',730,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100012','40000000-0000-4000-a000-000000100012',770,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100013','40000000-0000-4000-a000-000000100013',800,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100014','40000000-0000-4000-a000-000000100014',815,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100015','40000000-0000-4000-a000-000000100015',540,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100016','40000000-0000-4000-a000-000000100016',690,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100017','40000000-0000-4000-a000-000000100017',790,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100018','40000000-0000-4000-a000-000000100018',775,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100019','40000000-0000-4000-a000-000000100019',640,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100020','40000000-0000-4000-a000-000000100020',810,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100021','40000000-0000-4000-a000-000000100021',785,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100022','40000000-0000-4000-a000-000000100022',555,'EQUIFAX_MASTERSCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100023','40000000-0000-4000-a000-000000100023',675,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100024','40000000-0000-4000-a000-000000100024',820,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100025','40000000-0000-4000-a000-000000100025',745,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100026','40000000-0000-4000-a000-000000100026',665,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100027','40000000-0000-4000-a000-000000100027',805,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100028','40000000-0000-4000-a000-000000100028',735,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100029','40000000-0000-4000-a000-000000100029',770,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100030','40000000-0000-4000-a000-000000100030',685,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100031','40000000-0000-4000-a000-000000100031',795,'EQUIFAX_ONESCORE','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}'),
('60000000-0000-4000-a000-000000100032','40000000-0000-4000-a000-000000100032',650,'EXPERIAN','{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-02-11"}')
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 6. BUSINESS RECOMMENDATIONS (32 businesses)
-- ============================================================================

INSERT INTO "business_recommendations" ("id","businessId","recommendations","scoreSnapshot","expiresAt","createdAt","updatedAt")
SELECT
  '70000000-0000-4000-a000-0000001' || LPAD(ROW_NUMBER() OVER(ORDER BY b."id")::text, 5, '0'),
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
  '2026-08-11T00:00:00.000Z',
  CURRENT_TIMESTAMP,
  '2026-02-11T00:00:00.000Z'
FROM "businesses" b
JOIN "business_scores" bs ON bs."businessId" = b."id"
WHERE b."id" LIKE '40000000-0000-4000-a000-0000001%'
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 7. CARD APPLICATIONS (12 applications)
-- ============================================================================

INSERT INTO "business_card_applications" ("id","businessId","cardId","status","fitScore","reason","updatedAt") VALUES
('80000000-0000-4000-a000-000000100001','40000000-0000-4000-a000-000000100001','50000000-0000-4000-a000-000000000001','APPROVED',82,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100002','40000000-0000-4000-a000-000000100002','50000000-0000-4000-a000-000000000008','APPROVED',92,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100003','40000000-0000-4000-a000-000000100003','50000000-0000-4000-a000-000000000005','PENDING',58,'Awaiting additional documentation','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100004','40000000-0000-4000-a000-000000100004','50000000-0000-4000-a000-000000000002','APPROVED',86,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100005','40000000-0000-4000-a000-000000100009','50000000-0000-4000-a000-000000000008','APPROVED',95,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100006','40000000-0000-4000-a000-000000100014','50000000-0000-4000-a000-000000000002','APPROVED',88,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100007','40000000-0000-4000-a000-000000100015','50000000-0000-4000-a000-000000000006','REJECTED',35,'Does not meet minimum requirements','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100008','40000000-0000-4000-a000-000000100017','50000000-0000-4000-a000-000000000004','APPROVED',84,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100009','40000000-0000-4000-a000-000000100020','50000000-0000-4000-a000-000000000002','APPLIED',85,'Application under review','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100010','40000000-0000-4000-a000-000000100024','50000000-0000-4000-a000-000000000008','APPROVED',89,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100011','40000000-0000-4000-a000-000000100027','50000000-0000-4000-a000-000000000004','APPROVED',83,'Met underwriting criteria','2026-02-11T00:00:00.000Z'),
('80000000-0000-4000-a000-000000100012','40000000-0000-4000-a000-000000100031','50000000-0000-4000-a000-000000000003','APPLIED',79,'Application under review','2026-02-11T00:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 8. AUDIT EVENTS (10 events)
-- ============================================================================

INSERT INTO "audit_events" ("id","tenantId","userId","action","resourceType","resourceId","details","ipAddress","createdAt") VALUES
('b0000000-0000-4000-a000-000000100001','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000010','SCORE_PULL','business','40000000-0000-4000-a000-000000100001','{"score":755,"type":"EXPERIAN"}','192.168.2.100','2026-02-11T09:15:00.000Z'),
('b0000000-0000-4000-a000-000000100002','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000011','SCORE_PULL','business','40000000-0000-4000-a000-000000100009','{"score":850,"type":"EXPERIAN"}','192.168.2.105','2026-02-11T10:20:00.000Z'),
('b0000000-0000-4000-a000-000000100003','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000010','OFFER_GENERATED','business','40000000-0000-4000-a000-000000100002','{"cards":2}','192.168.2.100','2026-02-11T09:16:00.000Z'),
('b0000000-0000-4000-a000-000000100004','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000012','APPLICATION_APPROVED','application','80000000-0000-4000-a000-000000100001','{"product":"Business Rewards Visa"}','192.168.2.110','2026-02-10T14:30:00.000Z'),
('b0000000-0000-4000-a000-000000100005','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000012','APPLICATION_APPROVED','application','80000000-0000-4000-a000-000000100002','{"product":"Corporate Rewards Card"}','192.168.2.110','2026-02-10T15:00:00.000Z'),
('b0000000-0000-4000-a000-000000100006','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000012','APPLICATION_REJECTED','application','80000000-0000-4000-a000-000000100007','{"reason":"Does not meet minimum requirements"}','192.168.2.110','2026-02-10T16:00:00.000Z'),
('b0000000-0000-4000-a000-000000100007','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000010','SETTINGS_UPDATED','tenant','10000000-0000-4000-a000-000000000002','{"field":"ewsThresholds"}','192.168.2.100','2026-02-11T08:00:00.000Z'),
('b0000000-0000-4000-a000-000000100008','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000010','LOGIN','user','30000000-0000-4000-a000-000000000010','{"method":"clerk"}','192.168.2.100','2026-02-11T08:00:00.000Z'),
('b0000000-0000-4000-a000-000000100009','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000011','LOGIN','user','30000000-0000-4000-a000-000000000011','{"method":"clerk"}','192.168.2.105','2026-02-11T08:30:00.000Z'),
('b0000000-0000-4000-a000-000000100010','10000000-0000-4000-a000-000000000002','30000000-0000-4000-a000-000000000012','LOGIN','user','30000000-0000-4000-a000-000000000012','{"method":"clerk"}','192.168.2.110','2026-02-11T09:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 9. EWS ALERTS (4 alerts — higher rate reflecting community focus)
-- ============================================================================

INSERT INTO "ews_alerts" ("id","tenantId","portfolioId","businessId","alertType","severity","message","previousScore","currentScore","createdAt") VALUES
('c0000000-0000-4000-a000-000000100001','10000000-0000-4000-a000-000000000002','20000000-0000-4000-a000-000000000002','40000000-0000-4000-a000-000000100003','SCORE_DROP','MEDIUM','Score declined 40 points in 90 days',665,625,'2026-02-08T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000100002','10000000-0000-4000-a000-000000000002','20000000-0000-4000-a000-000000000002','40000000-0000-4000-a000-000000100015','SCORE_DROP','HIGH','Score below minimum underwriting threshold',590,540,'2026-02-09T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000100003','10000000-0000-4000-a000-000000000002','20000000-0000-4000-a000-000000000002','40000000-0000-4000-a000-000000100022','DELINQUENCY','CRITICAL','Payment 60+ days past due on trade line',600,555,'2026-02-10T10:00:00.000Z'),
('c0000000-0000-4000-a000-000000100004','10000000-0000-4000-a000-000000000002','20000000-0000-4000-a000-000000000002','40000000-0000-4000-a000-000000100032','UTILIZATION','MEDIUM','Credit utilization exceeded 85% on revolving lines',680,650,'2026-02-11T10:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

-- ============================================================================
-- 10. TENANT API KEYS (2 keys)
-- ============================================================================

INSERT INTO "tenant_api_keys" ("id","tenantId","name","keyHash","keyPrefix","scopes","environment","isActive","updatedAt") VALUES
('d0000000-0000-4000-a000-000000100001','10000000-0000-4000-a000-000000000002','Santander Production Key','sha256_sant_prod_key_001','sk_live_sant','read:write','production',true,'2026-02-11T00:00:00.000Z'),
('d0000000-0000-4000-a000-000000100002','10000000-0000-4000-a000-000000000002','Santander Sandbox Key','sha256_sant_test_key_002','sk_test_sant','read','development',true,'2026-02-11T00:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

COMMIT;

-- ============================================================================
-- SANTANDER SEED COMPLETE
-- 32 businesses, 12 applications, 4 EWS alerts
-- Northeast concentration: MA (8), NY (8), NJ (6), PA (4), Other (6)
-- Hispanic/Latino business focus + Multifamily CRE concentration
-- ============================================================================
