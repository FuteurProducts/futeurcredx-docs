#!/usr/bin/env python3
"""Generate api-seed.sql for the Prisma-managed database."""
import os, sys

TS = '2026-01-28T00:00:00.000Z'
PW = '$2b$10$SeedHashForTestingOnlyXNotForProductionUseEverPlease0'
TID = '10000000-0000-4000-a000-000000000001'
PID = '20000000-0000-4000-a000-000000000001'

def uid(n): return f'30000000-0000-4000-a000-{n:012d}'
def bid(n): return f'40000000-0000-4000-a000-{n:012d}'
def cid(n): return f'50000000-0000-4000-a000-{n:012d}'
def caid(n): return f'50100000-0000-4000-a000-{n:012d}'
def sid(n): return f'60000000-0000-4000-a000-{n:012d}'
def appid(n): return f'80000000-0000-4000-a000-{n:012d}'

USERS = [
    (1, 'user_2a001', 'john.admin@partnerbank.com', 'John', 'Administrator', 'ACTIVE', 'YEAR', True),
    (2, 'user_2a002', 'sarah.dev@partnerbank.com', 'Sarah', 'Developer', 'ACTIVE', 'YEAR', True),
    (3, 'user_2a003', 'mike.risk@partnerbank.com', 'Mike', 'Analyst', 'ACTIVE', 'YEAR', True),
    (4, 'user_2a004', 'lisa.rm@partnerbank.com', 'Lisa', 'Manager', 'ACTIVE', 'MONTH', True),
    (5, 'user_2a005', 'tom.analyst@partnerbank.com', 'Tom', 'Analyst', 'ACTIVE', 'FREE', False),
]

# (num, name, city, state, naics, revenue, risk, segment, fname, lname, emp, yearFounded)
BUSINESSES = [
    (1,'Stellar Dynamics LLC','Austin','TX','541511',3400000,'low','small','James','Chen',42,2019),
    (2,'Metro Logistics Corp','Dallas','TX','484110',5200000,'medium','small','Maria','Rodriguez',82,2011),
    (3,'Apex Construction Group','Phoenix','AZ','236220',8100000,'low','mid-market','Robert','Kim',120,2014),
    (4,'Sunrise Healthcare Partners','Houston','TX','621111',12500000,'low','mid-market','Priya','Patel',210,2017),
    (5,'GreenLeaf Organics','Fresno','CA','111000',1800000,'medium','micro','Sofia','Mendez',35,2022),
    (6,'Coastal Hospitality Group','Miami','FL','721110',4200000,'high','small','David','Thompson',92,2020),
    (7,'Precision Manufacturing Co','Detroit','MI','332710',9800000,'low','mid-market','Thomas','Mueller',175,2004),
    (8,'TechVenture Solutions','San Francisco','CA','541512',2200000,'low','small','Sarah','Kim',28,2023),
    (9,'Urban Retail Partners','Chicago','IL','445110',950000,'high','micro','Marcus','Johnson',18,2024),
    (10,'Pacific Marine Services','Seattle','WA','483211',6700000,'medium','small','Michael','Walsh',65,2015),
    (11,'Empire State Digital','New York','NY','541511',7200000,'low','mid-market','Alex','Rivera',95,2018),
    (12,'Harbor Freight Logistics','Boston','MA','484110',3800000,'medium','small','Patrick','Sullivan',55,2012),
    (13,'Liberty Dental Group','Hartford','CT','621111',2900000,'low','small','Linda','Wu',38,2015),
    (14,'BrightPath Tutoring','Newark','NJ','611710',320000,'medium','micro','Rachel','Foster',8,2024),
    (15,'Granite State Builders','Manchester','NH','236220',420000,'medium','micro','Mark','Thompson',12,2021),
    (16,'Atlantic Seafood Co','Providence','RI','311710',1100000,'low','small','Anthony','Russo',22,2008),
    (17,'Hudson Valley Farms','Albany','NY','111000',280000,'high','micro','Karen','Brennan',6,2023),
    (18,'Peachtree Medical Associates','Atlanta','GA','621111',6400000,'low','mid-market','William','Harris',78,2011),
    (19,'Carolina BBQ Supply','Charlotte','NC','424490',1400000,'medium','small','Danny','Wilson',16,2019),
    (20,'Sunshine Auto Repair','Tampa','FL','811111',380000,'medium','micro','Jose','Garcia',9,2022),
    (21,'Savannah Event Planners','Savannah','GA','561920',190000,'high','micro','Brittany','Cole',4,2025),
    (22,'Lowcountry Brewing Co','Charleston','SC','312120',2600000,'low','small','Nathan','Baker',32,2020),
    (23,'Magnolia Staffing','Jacksonville','FL','561311',5800000,'low','mid-market','Diana','Reyes',145,2016),
    (24,'Palmetto Landscaping','Raleigh','NC','561730',450000,'medium','micro','Tyler','Scott',14,2023),
    (25,'Great Lakes Plating','Cleveland','OH','332710',11200000,'low','mid-market','Richard','Novak',190,1998),
    (26,'Prairie Wind Energy','Des Moines','IA','221115',3100000,'low','small','Carol','Anderson',40,2020),
    (27,'Heartland Trucking','Milwaukee','WI','484110',4500000,'medium','small','Brian','Murphy',68,2007),
    (28,'Twin Cities Bakery','Minneapolis','MN','311811',240000,'medium','micro','Sarah','Lund',7,2024),
    (29,'Buckeye Dental Labs','Columbus','OH','339116',1600000,'low','small','Christopher','Hayes',24,2017),
    (30,'Desert Sun Solar','Albuquerque','NM','238220',2800000,'low','small','Miguel','Santos',36,2021),
    (31,'Rio Grande Veterinary','El Paso','TX','541940',680000,'low','small','Ana','Flores',11,2018),
    (32,'Lone Star Food Truck','San Antonio','TX','722330',160000,'high','micro','Kyle','Cooper',3,2025),
    (33,'Tulsa Oil Equipment','Tulsa','OK','213112',8500000,'medium','mid-market','Roger','Dawson',110,2006),
    (34,'Golden Gate Consulting','San Jose','CA','541611',5600000,'low','mid-market','Jennifer','Park',48,2016),
    (35,'Cascade Pet Care','Portland','OR','541940',350000,'medium','micro','Amanda','Green',10,2023),
    (36,'Silver State Logistics','Las Vegas','NV','493110',7800000,'low','mid-market','Steven','Chen',130,2013),
    (37,'Cornfield Ag Supply','Cedar Rapids','IA','111000',390000,'medium','micro','Thomas','Brown',8,2022),
    (38,'Gulf Coast Marine','Mobile','AL','811490',1200000,'high','small','Wayne','Marshall',15,2017),
    (39,'Cactus Creek Wellness','Scottsdale','AZ','812199',520000,'medium','small','Nicole','Ramirez',12,2024),
    (40,'Redwood Analytics','Sacramento','CA','518210',4100000,'low','small','David','Lee',55,2021),
    (41,'Lakeshore Distribution','Indianapolis','IN','423990',6900000,'low','mid-market','Robert','Fischer',85,2010),
    (42,'Summit Pharmaceuticals','Boston','MA','325411',15200000,'low','mid-market','Elena','Patel',180,2014),
    (43,'FinEdge Technologies','New York','NY','522320',8900000,'low','mid-market','Ryan','Chang',65,2021),
    (44,'Pacific Plate Restaurant Group','Los Angeles','CA','722511',3200000,'medium','small','Marco','DiStefano',85,2018),
    (45,'Mountain View Development','Denver','CO','236220',22500000,'low','mid-market','Katherine','Wells',95,2008),
    (46,'CyberShield Solutions','Washington','DC','541512',6300000,'low','mid-market','James','Washington',45,2019),
    (47,'Napa Valley Vintners','Napa','CA','312130',4800000,'low','small','Pierre','Dubois',35,2011),
    (48,'Cascade Sports Equipment','Portland','OR','339920',1900000,'medium','small','Derek','Hansen',22,2022),
    (49,'Hartford Insurance Associates','Hartford','CT','524210',3500000,'low','small','Margaret','OBrien',28,2006),
    (50,'Arizona Solar Installations','Phoenix','AZ','238220',5100000,'low','mid-market','Carlos','Mendez',60,2020),
    (51,'Hill Country Craft Brewing','Austin','TX','312120',1700000,'medium','small','Austin','Reed',18,2023),
    (52,'Norfolk Maritime Shipping','Norfolk','VA','483111',12800000,'low','mid-market','William','Patterson',95,2001),
    (53,'Heartland AgTech Solutions','Omaha','NE','541715',2400000,'medium','small','Emily','Larson',30,2022),
    (54,'Peach State Film Productions','Atlanta','GA','512110',3800000,'low','small','Michael','Taylor',42,2020),
    (55,'Emerald City Green Building','Seattle','WA','236220',9500000,'low','mid-market','Sarah','Nakamura',75,2016),
]

# (biz_num, score_type, score)
SCORES = [
    (1,'EXPERIAN',780),(2,'EQUIFAX_ONESCORE',710),(3,'EXPERIAN',820),(4,'EQUIFAX_ONESCORE',850),
    (5,'EXPERIAN',650),(6,'EQUIFAX_MASTERSCORE',580),(7,'EQUIFAX_ONESCORE',760),(8,'EXPERIAN',850),
    (9,'EQUIFAX_MASTERSCORE',620),(10,'EXPERIAN',730),(11,'EXPERIAN',790),(12,'EQUIFAX_ONESCORE',680),
    (13,'EXPERIAN',760),(14,'SBSS',165),(15,'EXPERIAN',660),(16,'EQUIFAX_ONESCORE',740),
    (17,'EXPERIAN',550),(18,'EXPERIAN',810),(19,'EQUIFAX_ONESCORE',685),(20,'EXPERIAN',645),
    (21,'EQUIFAX_MASTERSCORE',520),(22,'EXPERIAN',755),(23,'EQUIFAX_ONESCORE',795),(24,'EXPERIAN',670),
    (25,'EXPERIAN',830),(26,'EQUIFAX_ONESCORE',775),(27,'EXPERIAN',640),(28,'SBSS',155),
    (29,'EXPERIAN',745),(30,'EQUIFAX_ONESCORE',770),(31,'EXPERIAN',750),(32,'EXPERIAN',510),
    (33,'EQUIFAX_MASTERSCORE',635),(34,'EXPERIAN',805),(35,'SBSS',160),(36,'EQUIFAX_ONESCORE',785),
    (37,'EXPERIAN',655),(38,'EQUIFAX_MASTERSCORE',565),(39,'EXPERIAN',675),(40,'EXPERIAN',800),
    (41,'EQUIFAX_ONESCORE',780),(42,'EXPERIAN',825),(43,'EXPERIAN',815),(44,'EQUIFAX_ONESCORE',690),
    (45,'EXPERIAN',840),(46,'EXPERIAN',810),(47,'EQUIFAX_ONESCORE',750),(48,'EXPERIAN',670),
    (49,'EQUIFAX_ONESCORE',760),(50,'EXPERIAN',795),(51,'SBSS',170),(52,'EQUIFAX_ONESCORE',800),
    (53,'EXPERIAN',680),(54,'EXPERIAN',765),(55,'EQUIFAX_ONESCORE',810),
]

CARDS = [
    (1,'Business Rewards Visa','Visa','Visa',0,0,'0% 12 months','14.99% - 22.99%','Good','1.5% on all purchases','Cash Back'),
    (2,'Business Platinum Visa','Visa','Visa',95,95,'0% 15 months','13.99% - 21.99%','Excellent','2x points on all purchases','Points'),
    (3,'Business Cash Back Card','Mastercard','Mastercard',0,0,'0% 9 months','15.99% - 24.99%','Fair','2% on dining and gas, 1% other','Cash Back'),
    (4,'Business Travel Card','Visa','Visa',150,150,'N/A','16.99% - 23.99%','Good','3x on travel, 2x dining','Miles'),
    (5,'Small Business Starter Card','Visa','Visa',0,0,'0% 6 months','19.99% - 26.99%','Fair','1% on all purchases','Cash Back'),
    (6,'Business Secured Card','Visa','Visa',0,0,'N/A','22.99%','None','1% on all purchases','Cash Back'),
    (7,'Business Fleet Card','Mastercard','Mastercard',0,0,'N/A','18.99% - 24.99%','Good','3% on fuel, 2% maintenance','Cash Back'),
    (8,'Corporate Rewards Card','Amex','Amex',250,250,'N/A','15.99% - 22.99%','Excellent','3x on all categories','Points'),
]

# (app_num, biz_num, card_num, status, fitScore)
APPLICATIONS = [
    (1,1,1,'APPROVED',92),(2,1,3,'APPLIED',87),(3,2,7,'APPROVED',71),(4,3,2,'APPROVED',88),
    (5,3,4,'APPLIED',85),(6,4,8,'APPROVED',94),(7,5,5,'PENDING',62),(8,6,6,'REJECTED',38),
    (9,7,2,'APPROVED',82),(10,8,1,'APPROVED',95),(11,8,4,'APPLIED',88),(12,10,3,'APPROVED',78),
    (13,11,2,'APPROVED',85),(14,13,1,'APPROVED',80),(15,18,8,'APPROVED',90),(16,22,3,'APPLIED',76),
    (17,23,2,'APPROVED',84),(18,25,8,'APPROVED',91),(19,34,4,'APPROVED',86),(20,36,2,'APPLIED',83),
    (21,40,1,'APPROVED',85),(22,42,8,'APPROVED',92),(23,43,4,'APPROVED',88),(24,45,2,'APPROVED',90),
    (25,52,8,'APPLIED',84),
]

EWS = [
    (1,6,'SCORE_DROP','HIGH','Score dropped below 600 threshold',610,580),
    (2,9,'SCORE_DROP','MEDIUM','Score declined 35 points in 90 days',655,620),
    (3,17,'SCORE_DROP','HIGH','Score below minimum underwriting threshold',590,550),
    (4,21,'DELINQUENCY','CRITICAL','Payment 60+ days past due on trade line',560,520),
    (5,32,'SCORE_DROP','HIGH','Severe score deterioration — review required',580,510),
    (6,38,'PUBLIC_RECORD','MEDIUM','New tax lien filed against business',600,565),
    (7,27,'UTILIZATION','MEDIUM','Credit utilization exceeded 85% on revolving lines',670,640),
    (8,5,'SCORE_DROP','LOW','Score trending down — monitor closely',680,650),
]

def e(s):
    """Escape single quotes for SQL."""
    return str(s).replace("'", "''")

def user_for_biz(n):
    """Assign user: 1-11→u1, 12-22→u2, 23-33→u3, 34-44→u4, 45-55→u5"""
    return (n - 1) // 11 + 1

def main():
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'api-seed.sql')
    with open(out, 'w') as f:
        w = f.write
        w("-- ============================================================================\n")
        w("-- LUMIQ AI — API PostgreSQL Seed Data (Prisma Schema)\n")
        w("-- ============================================================================\n")
        w("-- INSERT-only — Prisma manages DDL via migrations.\n")
        w("-- Prerequisites: npx prisma migrate deploy\n")
        w("-- Usage: psql -U <user> -d <database> -f api-seed.sql\n")
        w("-- 55 businesses across 30+ industries with scores, recommendations,\n")
        w("-- applications, EWS alerts, audit trail, and batch processing.\n")
        w("-- ============================================================================\n\n")
        w("BEGIN;\n\n")

        # Truncate
        w("-- Clean existing data\n")
        tables = [
            'ews_alerts','audit_events','batch_items','batch_jobs',
            'business_card_applications','business_recommendations','business_scores',
            'card_attributes','card_agreements','cards','portfolio_businesses',
            'portfolios','tenant_users','tenant_api_keys','businesses',
            'api_usage_logs','api_keys','alerts','events','otps','users','tenants'
        ]
        quoted = ", ".join(f'"{t}"' for t in tables)
        w(f'TRUNCATE {quoted} CASCADE;\n\n')

        # Users
        w("-- ── Users (5) ──\n")
        w('INSERT INTO "users" ("id","clerkId","email","password","userFname","userLname","status","subscription","verified","updatedAt") VALUES\n')
        rows = []
        for n, clerk, email, fn, ln, st, sub, ver in USERS:
            rows.append(f"('{uid(n)}','{clerk}','{email}','{PW}','{fn}','{ln}','{st}','{sub}',{str(ver).lower()},'{TS}')")
        w(',\n'.join(rows) + ';\n\n')

        # Tenant
        w("-- ── Tenant ──\n")
        w(f'''INSERT INTO "tenants" ("id","name","slug","clerkOrgId","updatedAt") VALUES\n('{TID}','Partner Bank','partner-bank','org_2partner001','{TS}');\n\n''')

        # Portfolio
        w("-- ── Portfolio ──\n")
        w(f'''INSERT INTO "portfolios" ("id","tenantId","name","code","updatedAt") VALUES\n('{PID}','{TID}','SMB Pilot Portfolio','SMB-PILOT','{TS}');\n\n''')

        # Tenant Users
        w("-- ── Tenant Users (5) ──\n")
        w('INSERT INTO "tenant_users" ("id","tenantId","userId","clerkUserId","role") VALUES\n')
        roles = ['admin','analyst','analyst','rm','viewer']
        rows = []
        for i, (n, clerk, *_) in enumerate(USERS):
            tuid = f'31000000-0000-4000-a000-{n:012d}'
            rows.append(f"('{tuid}','{TID}','{uid(n)}','{clerk}','{roles[i]}')")
        w(',\n'.join(rows) + ';\n\n')

        # Businesses
        w("-- ── Businesses (55) ──\n")
        w('INSERT INTO "businesses" ("id","userId","name","city","state","naicsCode","annualRevenue","riskTier","segment","ownerFname","ownerLname","empCount","yearFounded") VALUES\n')
        rows = []
        for b in BUSINESSES:
            n,name,city,state,naics,rev,risk,seg,fn,ln,emp,yr = b
            u = user_for_biz(n)
            rows.append(f"('{bid(n)}','{uid(u)}','{e(name)}','{e(city)}','{state}','{naics}',{rev},'{risk}','{seg}','{e(fn)}','{e(ln)}',{emp},{yr})")
        w(',\n'.join(rows) + ';\n\n')

        # Portfolio Businesses (SELECT-based)
        w("-- ── Portfolio Businesses (55) ──\n")
        w(f'''INSERT INTO "portfolio_businesses" ("id","portfolioId","businessId")
SELECT '90000000-0000-4000-a000-' || LPAD(ROW_NUMBER() OVER(ORDER BY "id")::text, 12, '0'),
  '{PID}', "id"
FROM "businesses" WHERE "id" LIKE '40000000-%';\n\n''')

        # Cards
        w("-- ── Cards (8) ──\n")
        w('INSERT INTO "cards" ("id","name","brand","network","annualFee","updatedAt") VALUES\n')
        rows = []
        for c in CARDS:
            n,name,brand,net,fee,*_ = c
            rows.append(f"('{cid(n)}','{name}','{brand}','{net}',{fee},'{TS}')")
        w(',\n'.join(rows) + ';\n\n')

        # Card Attributes
        w("-- ── Card Attributes (8) ──\n")
        w('INSERT INTO "card_attributes" ("id","cardId","annualFee","introAPR","regularAPR","creditRequired","rewardRate","rewardType","updatedAt") VALUES\n')
        rows = []
        for c in CARDS:
            n,name,brand,net,fee,afloat,intro,reg,cred,rate,rtype = c
            rows.append(f"('{caid(n)}','{cid(n)}',{afloat},'{intro}','{reg}','{cred}','{rate}','{rtype}','{TS}')")
        w(',\n'.join(rows) + ';\n\n')

        # Business Scores
        w("-- ── Business Scores (55) ──\n")
        meta = '{"factors":["Payment history","Credit utilization","Trade references"],"pullDate":"2026-01-28"}'
        w('INSERT INTO "business_scores" ("id","businessId","score","type","metadata") VALUES\n')
        rows = []
        for bn, stype, score in SCORES:
            rows.append(f"('{sid(bn)}','{bid(bn)}',{score},'{stype}','{meta}')")
        w(',\n'.join(rows) + ';\n\n')

        # Business Recommendations (SELECT-based from businesses+scores)
        w("-- ── Business Recommendations (55, generated from businesses+scores) ──\n")
        w(f'''INSERT INTO "business_recommendations" ("id","businessId","recommendations","scoreSnapshot","expiresAt","createdAt","updatedAt")
SELECT
  '70000000-0000-4000-a000-' || LPAD(ROW_NUMBER() OVER(ORDER BY b."id")::text, 12, '0'),
  b."id",
  CASE
    WHEN b."riskTier" = 'low' AND bs."score" >= 800
      THEN '[{{"cardId":"{cid(2)}","name":"Business Platinum Visa","fitScore":94,"reason":"Premium credit profile"}},{{"cardId":"{cid(1)}","name":"Business Rewards Visa","fitScore":89,"reason":"Strong payment history"}}]'::jsonb
    WHEN b."riskTier" = 'low'
      THEN '[{{"cardId":"{cid(1)}","name":"Business Rewards Visa","fitScore":82,"reason":"Good credit profile"}},{{"cardId":"{cid(3)}","name":"Business Cash Back Card","fitScore":78,"reason":"Fits operational spending"}}]'::jsonb
    WHEN b."riskTier" = 'medium'
      THEN '[{{"cardId":"{cid(5)}","name":"Small Business Starter Card","fitScore":62,"reason":"Build credit history"}},{{"cardId":"{cid(3)}","name":"Business Cash Back Card","fitScore":55,"reason":"Consider after 6 months"}}]'::jsonb
    ELSE '[{{"cardId":"{cid(6)}","name":"Business Secured Card","fitScore":42,"reason":"Secured card to rebuild credit"}}]'::jsonb
  END,
  bs."score",
  '2026-07-28T00:00:00.000Z',
  CURRENT_TIMESTAMP,
  '{TS}'
FROM "businesses" b
JOIN "business_scores" bs ON bs."businessId" = b."id"
WHERE b."id" LIKE '40000000-%';\n\n''')

        # Card Applications
        w("-- ── Card Applications (25) ──\n")
        w('INSERT INTO "business_card_applications" ("id","businessId","cardId","status","fitScore","reason","updatedAt") VALUES\n')
        rows = []
        reasons = {'APPROVED':'Met underwriting criteria','APPLIED':'Application under review','PENDING':'Awaiting additional documentation','REJECTED':'Does not meet minimum requirements'}
        for an, bn, cn, status, fs in APPLICATIONS:
            rows.append(f"('{appid(an)}','{bid(bn)}','{cid(cn)}','{status}',{fs},'{reasons[status]}','{TS}')")
        w(',\n'.join(rows) + ';\n\n')

        # Batch Jobs
        w("-- ── Batch Jobs (2) ──\n")
        w(f'''INSERT INTO "batch_jobs" ("id","portfolioId","tenantId","submittedBy","status","totalCount","processedCount","failedCount","startedAt","completedAt","updatedAt") VALUES
('a0000000-0000-4000-a000-000000000001','{PID}','{TID}','{uid(1)}','COMPLETED',10,10,0,'2026-01-25T10:00:00.000Z','2026-01-25T10:05:00.000Z','{TS}'),
('a0000000-0000-4000-a000-000000000002','{PID}','{TID}','{uid(2)}','PROCESSING',5,3,0,'2026-01-28T14:00:00.000Z',NULL,'{TS}');\n\n''')

        # Batch Items
        w("-- ── Batch Items (10) ──\n")
        w('INSERT INTO "batch_items" ("id","batchJobId","businessId","inputData","status","scoreResult","processedAt") VALUES\n')
        rows = []
        for i in range(1, 11):
            b = BUSINESSES[i-1]
            score = SCORES[i-1][2]
            inp = f'{{"name":"{e(b[1])}","city":"{e(b[2])}","state":"{b[3]}"}}'
            sr = f'{{"score":{score},"type":"{SCORES[i-1][1]}"}}'
            rows.append(f"('a1000000-0000-4000-a000-{i:012d}','a0000000-0000-4000-a000-000000000001','{bid(i)}','{inp}','RECOMMENDED','{sr}','2026-01-25T10:0{i % 10}:00.000Z')")
        w(',\n'.join(rows) + ';\n\n')

        # Audit Events
        w("-- ── Audit Events (20) ──\n")
        w('INSERT INTO "audit_events" ("id","tenantId","userId","action","resourceType","resourceId","details","ipAddress","createdAt") VALUES\n')
        events = [
            (1,1,'SCORE_PULL','business',bid(1),'{"score":780,"type":"EXPERIAN"}','192.168.1.100','2026-01-28T14:30:00.000Z'),
            (2,2,'SCORE_PULL','business',bid(2),'{"score":710,"type":"EQUIFAX_ONESCORE"}','192.168.1.105','2026-01-28T14:00:00.000Z'),
            (3,3,'SCORE_PULL','business',bid(3),'{"score":820,"type":"EXPERIAN"}','192.168.1.110','2026-01-28T13:30:00.000Z'),
            (4,1,'OFFER_GENERATED','business',bid(1),'{"cards":2}','192.168.1.100','2026-01-28T14:31:00.000Z'),
            (5,1,'OFFER_GENERATED','business',bid(3),'{"cards":2}','192.168.1.100','2026-01-28T13:31:00.000Z'),
            (6,3,'APPLICATION_APPROVED','application',appid(1),'{"product":"Business Rewards Visa"}','192.168.1.110','2026-01-27T16:00:00.000Z'),
            (7,3,'APPLICATION_APPROVED','application',appid(4),'{"product":"Business Platinum Visa"}','192.168.1.110','2026-01-27T15:00:00.000Z'),
            (8,3,'APPLICATION_REJECTED','application',appid(8),'{"reason":"Does not meet minimum requirements"}','192.168.1.110','2026-01-27T14:00:00.000Z'),
            (9,1,'BATCH_SUBMITTED','batch','a0000000-0000-4000-a000-000000000001','{"totalCount":10}','192.168.1.100','2026-01-25T10:00:00.000Z'),
            (10,2,'BATCH_SUBMITTED','batch','a0000000-0000-4000-a000-000000000002','{"totalCount":5}','192.168.1.105','2026-01-28T14:00:00.000Z'),
            (11,1,'SETTINGS_UPDATED','tenant',TID,'{"field":"ewsThresholds"}','192.168.1.100','2026-01-28T10:15:00.000Z'),
            (12,1,'LOGIN','user',uid(1),'{"method":"clerk"}','192.168.1.100','2026-01-28T09:00:00.000Z'),
            (13,2,'LOGIN','user',uid(2),'{"method":"clerk"}','192.168.1.105','2026-01-28T09:05:00.000Z'),
            (14,3,'LOGIN','user',uid(3),'{"method":"clerk"}','192.168.1.110','2026-01-28T08:50:00.000Z'),
            (15,4,'LOGIN','user',uid(4),'{"method":"clerk"}','192.168.1.115','2026-01-28T09:10:00.000Z'),
            (16,4,'SCORE_PULL','business',bid(34),'{"score":805,"type":"EXPERIAN"}','192.168.1.115','2026-01-27T11:00:00.000Z'),
            (17,4,'OFFER_GENERATED','business',bid(34),'{"cards":2}','192.168.1.115','2026-01-27T11:01:00.000Z'),
            (18,1,'SETTINGS_UPDATED','tenant',TID,'{"field":"apiKeyRotation"}','192.168.1.100','2026-01-26T10:00:00.000Z'),
            (19,3,'APPLICATION_APPROVED','application',appid(6),'{"product":"Corporate Rewards Card"}','192.168.1.110','2026-01-26T14:00:00.000Z'),
            (20,2,'SCORE_PULL','business',bid(42),'{"score":825,"type":"EXPERIAN"}','192.168.1.105','2026-01-26T09:00:00.000Z'),
        ]
        rows = []
        for en, un, action, rtype, rid, det, ip, ts in events:
            rows.append(f"('b0000000-0000-4000-a000-{en:012d}','{TID}','{uid(un)}','{action}','{rtype}','{rid}','{det}','{ip}','{ts}')")
        w(',\n'.join(rows) + ';\n\n')

        # EWS Alerts
        w("-- ── EWS Alerts (8) ──\n")
        w('INSERT INTO "ews_alerts" ("id","tenantId","portfolioId","businessId","alertType","severity","message","previousScore","currentScore","createdAt") VALUES\n')
        rows = []
        for en, bn, atype, sev, msg, prev, curr in EWS:
            rows.append(f"('c0000000-0000-4000-a000-{en:012d}','{TID}','{PID}','{bid(bn)}','{atype}','{sev}','{e(msg)}',{prev},{curr},'2026-01-{20+en}T10:00:00.000Z')")
        w(',\n'.join(rows) + ';\n\n')

        # Tenant API Keys
        w("-- ── Tenant API Keys (3) ──\n")
        w(f'''INSERT INTO "tenant_api_keys" ("id","tenantId","name","keyHash","keyPrefix","scopes","environment","isActive","updatedAt") VALUES
('d0000000-0000-4000-a000-000000000001','{TID}','Production API Key','sha256_prod_key_001_hash','sk_live_abc','read:write','production',true,'{TS}'),
('d0000000-0000-4000-a000-000000000002','{TID}','Sandbox Test Key','sha256_test_key_002_hash','sk_test_xyz','read','development',true,'{TS}'),
('d0000000-0000-4000-a000-000000000003','{TID}','Deprecated Key','sha256_old_key_003_hash','sk_live_old','read','production',false,'{TS}');\n\n''')

        # API Keys (user-level)
        w("-- ── API Keys (user-level, 3) ──\n")
        w(f'''INSERT INTO "api_keys" ("id","name","keyHash","keyPrefix","userId","isActive","scopes","environment","updatedAt") VALUES
('f0000000-0000-4000-a000-000000000001','Admin Production Key','sha256_user_key_001','sk_u_live_a','{uid(1)}',true,ARRAY['read','write','admin'],'production','{TS}'),
('f0000000-0000-4000-a000-000000000002','Dev Sandbox Key','sha256_user_key_002','sk_u_test_b','{uid(2)}',true,ARRAY['read','write'],'development','{TS}'),
('f0000000-0000-4000-a000-000000000003','Risk Read-Only Key','sha256_user_key_003','sk_u_live_c','{uid(3)}',true,ARRAY['read'],'production','{TS}');\n\n''')

        # Events
        w("-- ── Events (8) ──\n")
        w('INSERT INTO "events" ("id","eventType","userId","details","createdAt") VALUES\n')
        evts = [
            (1,'SUCCESS',1,'User login successful','2026-01-28T09:00:00.000Z'),
            (2,'SUCCESS',2,'User login successful','2026-01-28T09:05:00.000Z'),
            (3,'SUCCESS',3,'User login successful','2026-01-28T08:50:00.000Z'),
            (4,'SUCCESS',4,'User login successful','2026-01-28T09:10:00.000Z'),
            (5,'INFO',1,'Settings updated: EWS thresholds','2026-01-28T10:15:00.000Z'),
            (6,'SUCCESS',1,'Batch job submitted: 10 businesses','2026-01-25T10:00:00.000Z'),
            (7,'ERROR',2,'API rate limit exceeded','2026-01-27T16:30:00.000Z'),
            (8,'INFO',3,'Report exported: Portfolio Risk Summary','2026-01-27T16:20:00.000Z'),
        ]
        rows = []
        for en, etype, un, det, ts in evts:
            rows.append(f"('f2000000-0000-4000-a000-{en:012d}','{etype}','{uid(un)}','{e(det)}','{ts}')")
        w(',\n'.join(rows) + ';\n\n')

        # Alerts
        w("-- ── Alerts (5) ──\n")
        w('INSERT INTO "alerts" ("id","userId","warningDetails","read","createdAt") VALUES\n')
        alerts = [
            (1,1,'{"type":"ews","message":"5 new EWS alerts require attention","severity":"high"}',False,'2026-01-28T10:00:00.000Z'),
            (2,3,'{"type":"score_change","message":"3 businesses had score drops > 20 points","severity":"medium"}',False,'2026-01-28T09:00:00.000Z'),
            (3,4,'{"type":"application","message":"2 applications awaiting RM review","severity":"low"}',True,'2026-01-27T14:00:00.000Z'),
            (4,1,'{"type":"system","message":"Batch job completed: 10/10 processed","severity":"info"}',True,'2026-01-25T10:05:00.000Z'),
            (5,2,'{"type":"api","message":"API key approaching rate limit threshold","severity":"medium"}',False,'2026-01-27T16:30:00.000Z'),
        ]
        rows = []
        for an, un, det, read, ts in alerts:
            rows.append(f"('f3000000-0000-4000-a000-{an:012d}','{uid(un)}','{det}',{str(read).lower()},'{ts}')")
        w(',\n'.join(rows) + ';\n\n')

        w("COMMIT;\n")

    print(f"Generated {out}")
    # Count lines
    with open(out) as f:
        lines = sum(1 for _ in f)
    print(f"  {lines} lines")

if __name__ == '__main__':
    main()
