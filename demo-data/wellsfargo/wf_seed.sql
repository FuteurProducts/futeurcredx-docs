-- ============================================================================
-- WELLS FARGO — PostgreSQL Seed Data (Dashboard Schema)
-- ============================================================================
-- Usage: psql -U <user> -d <database> -f demo-data/wellsfargo/wf_seed.sql
--
-- Idempotent: Uses ON CONFLICT DO UPDATE for all inserts
-- Portfolio: 3.3M SMB customers, $267B exposure, 4,500 branches
-- Geographic: West (32.5%), Southeast (26.8%), Midwest (13%), SW (12.5%), NE (15.2%)
-- Industry: Construction (15.5%), Transportation (14.5%), Manufacturing (14.2%),
--           Retail (12.3%), Professional Services (11.8%), Healthcare (11.0%),
--           Food Service/Ag (10.2%), Technology (10.5%)
-- ============================================================================

BEGIN;

-- ══════════════════════════════════════════════════════════════════════════════
-- CONFIGURATION
-- ══════════════════════════════════════════════════════════════════════════════

-- Wells Fargo tenant configuration
INSERT INTO tenants (id, bank_name, pilot_start, pilot_end, pilot_duration_days, environment)
VALUES ('WF-001', 'Wells Fargo', '2025-11-01', '2026-03-31', 150, 'sandbox')
ON CONFLICT (id) DO UPDATE SET
  bank_name = EXCLUDED.bank_name,
  pilot_start = EXCLUDED.pilot_start,
  pilot_end = EXCLUDED.pilot_end,
  pilot_duration_days = EXCLUDED.pilot_duration_days,
  environment = EXCLUDED.environment;

-- Portfolio configuration
INSERT INTO portfolios (id, tenant_id, name)
VALUES ('wf-portfolio-001', 'WF-001', 'Wells Fargo Small Business Banking')
ON CONFLICT (id) DO UPDATE SET
  tenant_id = EXCLUDED.tenant_id,
  name = EXCLUDED.name;

-- ══════════════════════════════════════════════════════════════════════════════
-- USERS (5 Wells Fargo team members)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO platform_users (id, tenant_id, name, email, role, status, last_login, mfa_enabled, portfolio_access, allow_exports, allow_api_key_creation, created_at) VALUES
('wf-usr-001', 'WF-001', 'Jennifer Martinez', 'jennifer.martinez@wellsfargo.com', 'admin', 'active', '2026-02-11T14:30:00Z', true, ARRAY['all'], true, true, '2025-11-01T00:00:00Z'),
('wf-usr-002', 'WF-001', 'David Chen', 'david.chen@wellsfargo.com', 'developer', 'active', '2026-02-11T12:15:00Z', true, ARRAY['all'], true, true, '2025-11-01T00:00:00Z'),
('wf-usr-003', 'WF-001', 'Sarah Johnson', 'sarah.johnson@wellsfargo.com', 'risk', 'active', '2026-02-11T09:45:00Z', true, ARRAY['west','southeast'], true, false, '2025-11-01T00:00:00Z'),
('wf-usr-004', 'WF-001', 'Michael Torres', 'michael.torres@wellsfargo.com', 'rm', 'active', '2026-02-11T11:00:00Z', false, ARRAY['southwest'], true, false, '2025-11-15T00:00:00Z'),
('wf-usr-005', 'WF-001', 'Emily Patel', 'emily.patel@wellsfargo.com', 'readonly', 'pending', NULL, false, ARRAY[]::TEXT[], false, false, '2026-02-05T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  last_login = EXCLUDED.last_login,
  mfa_enabled = EXCLUDED.mfa_enabled,
  portfolio_access = EXCLUDED.portfolio_access,
  allow_exports = EXCLUDED.allow_exports,
  allow_api_key_creation = EXCLUDED.allow_api_key_creation;

-- ══════════════════════════════════════════════════════════════════════════════
-- BUSINESSES (120 businesses — real Wells Fargo strength distribution)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO businesses (id, tenant_id, name, legal_name, industry, naics_code, city, state, annual_revenue, employee_count, years_in_business, lumiq_score, owner_fico, risk_tier, score_trend, trend_value, segment, has_active_application, product_type, application_amount, region, relationship_stage, rhs, rhs_change, primary_product, assigned_rm, deposit_balance, total_exposure, product_count, last_activity, phone, email, website) VALUES
-- CONSTRUCTION (19 businesses, 15.5% of 120) — WF strength
('wf-biz-001','WF-001','Ironclad Construction Co','Ironclad Construction Company LLC','Construction','236220','Charlotte','NC',12400000,145,18,82,758,'low','up',4,'mid-market',true,'Construction Line of Credit',850000,'Southeast','mature',86,4,'Commercial LOC','Sarah Johnson',1240000,850000,4,'2026-02-11','(704) 555-0147','contact@ironcladconstruction.com','www.ironcladconstruction.com'),
('wf-biz-002','WF-001','Desert Ridge Builders','Desert Ridge Builders Inc.','Construction','236220','Phoenix','AZ',8900000,110,15,79,742,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',83,1,'Equipment LOC','Michael Torres',890000,520000,3,'2026-02-10','(602) 555-0283','info@desertridgebuilders.com','www.desertridgebuilders.com'),
('wf-biz-003','WF-001','Bay Area Commercial Build','Bay Area Commercial Build LLC','Construction','236220','San Francisco','CA',15200000,178,22,84,771,'low','up',3,'mid-market',true,'Equipment Financing',1200000,'West','expansion',88,3,'Equipment LOC','Sarah Johnson',1520000,1200000,5,'2026-02-09','(415) 555-0391','admin@bayareabuild.com','www.bayareacommercialbuild.com'),
('wf-biz-004','WF-001','Coastal Roofing & Solar','Coastal Roofing & Solar Inc.','Construction','238220','Tampa','FL',4200000,52,9,74,718,'low','up',2,'small',false,NULL,NULL,'Southeast','growing',78,2,'SBA 7(a) Loan','Sarah Johnson',420000,380000,3,'2026-02-11','(813) 555-0462','service@coastalroofingsolar.com','www.coastalroofingsolar.com'),
('wf-biz-005','WF-001','Heartland Concrete & Paving','Heartland Concrete & Paving LLC','Construction','237310','Des Moines','IA',2800000,38,12,76,735,'low','stable',0,'small',false,NULL,NULL,'Midwest','mature',80,0,'Term Loan','Michael Torres',280000,195000,2,'2026-02-10','(515) 555-0518','info@heartlandconcrete.com','www.heartlandconcrete.com'),
('wf-biz-006','WF-001','Rocky Mountain HVAC Install','Rocky Mountain HVAC Installation Inc.','Construction','238220','Denver','CO',5600000,72,14,77,728,'low','up',3,'mid-market',false,NULL,NULL,'West','growing',81,3,'Working Capital LOC','Sarah Johnson',560000,410000,3,'2026-02-08','(303) 555-0627','contact@rockymountainhvac.com','www.rockymountainhvac.com'),
('wf-biz-007','WF-001','Southeast Electrical Systems','Southeast Electrical Systems LLC','Construction','238210','Atlanta','GA',9200000,125,20,80,748,'low','stable',1,'mid-market',false,NULL,NULL,'Southeast','mature',84,1,'Commercial LOC','Sarah Johnson',920000,720000,4,'2026-02-11','(404) 555-0734','hello@seelectrical.com','www.seelectrical.com'),
('wf-biz-008','WF-001','Pioneer Plumbing Services','Pioneer Plumbing Services Inc.','Construction','238220','Portland','OR',3400000,45,11,75,722,'low','up',2,'small',false,NULL,NULL,'West','growing',79,2,'Equipment Lease','David Chen',340000,240000,3,'2026-02-10','(503) 555-0842','admin@pioneersplumbing.com','www.pioneerplumbing.com'),
('wf-biz-009','WF-001','Texas Commercial Drywall','Texas Commercial Drywall LLC','Construction','238310','Dallas','TX',6700000,88,13,78,738,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',82,1,'Equipment LOC','Michael Torres',670000,480000,3,'2026-02-09','(214) 555-0953','info@txcommercialdrywall.com','www.texascommercialdrywall.com'),
('wf-biz-010','WF-001','Summit Framing & Carpentry','Summit Framing & Carpentry Inc.','Construction','238130','Seattle','WA',4800000,62,10,76,725,'low','up',3,'small',false,NULL,NULL,'West','growing',80,3,'Working Capital','Sarah Johnson',480000,350000,3,'2026-02-11','(206) 555-1064','contact@summitframing.com','www.summitframing.com'),
('wf-biz-011','WF-001','Metro Tile & Flooring','Metro Tile & Flooring LLC','Construction','238330','Minneapolis','MN',1900000,28,8,72,710,'medium','stable',0,'small',false,NULL,NULL,'Midwest','growing',74,0,'Business LOC','David Chen',190000,135000,2,'2026-02-08','(612) 555-1175','hello@metrotileflooring.com','www.metrotileflooring.com'),
('wf-biz-012','WF-001','Coastal Painting Contractors','Coastal Painting Contractors Inc.','Construction','238320','San Diego','CA',2200000,32,7,73,'low',698,'stable',0,'small',false,NULL,NULL,'West','growing',75,0,'SBA Express','Sarah Johnson',220000,158000,2,'2026-02-10','(619) 555-1286','info@coastalpaintingsd.com','www.coastalpainting.com'),
('wf-biz-013','WF-001','Tri-State Foundation Works','Tri-State Foundation Works LLC','Construction','238910','Charlotte','NC',3800000,48,15,77,732,'low','up',2,'small',false,NULL,NULL,'Southeast','mature',79,2,'Equipment LOC','Sarah Johnson',380000,280000,3,'2026-02-09','(704) 555-1397','contact@tristatefoundation.com','www.tristatefoundation.com'),
('wf-biz-014','WF-001','Southwest Excavation','Southwest Excavation Inc.','Construction','238910','Albuquerque','NM',5100000,68,12,78,740,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','growing',81,1,'Equipment Financing','Michael Torres',510000,385000,3,'2026-02-11','(505) 555-1408','admin@southwestexcavation.com','www.swexcavation.com'),
('wf-biz-015','WF-001','Pacific Coast Landscaping','Pacific Coast Landscaping LLC','Construction','561730','Los Angeles','CA',4500000,58,9,75,720,'low','up',2,'small',true,'Working Capital',320000,'West','growing',78,2,'Business LOC','Sarah Johnson',450000,320000,3,'2026-02-08','(213) 555-1519','info@pacificcoastlandscaping.com','www.pclandscaping.com'),
('wf-biz-016','WF-001','Heritage Masonry','Heritage Masonry Inc.','Construction','238140','Charleston','SC',2600000,35,14,74,715,'low','stable',0,'small',false,NULL,NULL,'Southeast','mature',76,0,'Term Loan','Sarah Johnson',260000,180000,2,'2026-02-10','(843) 555-1620','contact@heritagemasonry.com','www.heritagemasonry.com'),
('wf-biz-017','WF-001','Precision Demolition Services','Precision Demolition Services LLC','Construction','238910','Houston','TX',7200000,95,17,79,745,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',82,1,'Equipment LOC','Michael Torres',720000,540000,4,'2026-02-09','(713) 555-1731','admin@precisiondemolition.com','www.precisiondemolition.com'),
('wf-biz-018','WF-001','Green Valley Site Development','Green Valley Site Development Inc.','Construction','237110','Phoenix','AZ',8500000,112,16,80,750,'low','up',3,'mid-market',false,NULL,NULL,'West','mature',83,3,'Commercial LOC','Sarah Johnson',850000,620000,4,'2026-02-11','(602) 555-1842','info@greenvalleysite.com','www.greenvalleysite.com'),
('wf-biz-019','WF-001','Cornerstone Commercial Roofing','Cornerstone Commercial Roofing LLC','Construction','238160','Orlando','FL',3200000,42,10,76,728,'low','up',2,'small',false,NULL,NULL,'Southeast','growing',79,2,'Equipment LOC','Sarah Johnson',320000,235000,3,'2026-02-10','(407) 555-1953','contact@cornerstoneroofing.com','www.cornerstoneroofing.com'),

-- TRANSPORTATION (17 businesses, 14.5% of 120) — WF strength (ag transport)
('wf-biz-020','WF-001','Great Plains Logistics','Great Plains Logistics Inc.','Transportation','484110','Omaha','NE',9800000,125,19,78,738,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',82,1,'Fleet Financing','David Chen',980000,720000,4,'2026-02-11','(402) 555-2064','ops@greatplainslogistics.com','www.gplogistics.com'),
('wf-biz-021','WF-001','Silverado Trucking','Silverado Trucking LLC','Transportation','484110','Oklahoma City','OK',6200000,78,14,75,725,'low','up',2,'mid-market',false,NULL,NULL,'Southwest','growing',79,2,'Equipment LOC','Michael Torres',620000,450000,3,'2026-02-10','(405) 555-2175','dispatch@silveradotrucking.com','www.silveradotrucking.com'),
('wf-biz-022','WF-001','Pacific Coast Freight','Pacific Coast Freight Inc.','Transportation','484110','Seattle','WA',12400000,148,22,81,755,'low','up',3,'mid-market',true,'Fleet Expansion',950000,'West','mature',85,3,'Fleet Financing','Sarah Johnson',1240000,950000,5,'2026-02-09','(206) 555-2286','admin@pacificcoastfreight.com','www.pcfreight.com'),
('wf-biz-023','WF-001','Heartland Ag Transport','Heartland Ag Transport LLC','Transportation','484110','Des Moines','IA',4800000,62,15,77,730,'low','stable',1,'small',false,NULL,NULL,'Midwest','mature',80,1,'Equipment LOC','David Chen',480000,340000,3,'2026-02-11','(515) 555-2397','office@heartlandagtransport.com','www.heartlandagtransport.com'),
('wf-biz-024','WF-001','Southwest Express Delivery','Southwest Express Delivery Inc.','Transportation','492110','Phoenix','AZ',3400000,45,9,74,718,'low','up',2,'small',false,NULL,NULL,'West','growing',77,2,'Working Capital','Sarah Johnson',340000,245000,3,'2026-02-10','(602) 555-2408','info@southwestexpress.com','www.swexpress.com'),
('wf-biz-025','WF-001','Metro Area Courier','Metro Area Courier LLC','Transportation','492210','Atlanta','GA',1900000,28,6,71,'medium',695,'stable',0,'small',false,NULL,NULL,'Southeast','growing',73,0,'Business LOC','Sarah Johnson',190000,128000,2,'2026-02-08','(404) 555-2519','dispatch@metroareacourier.com','www.metroareacourier.com'),
('wf-biz-026','WF-001','Golden State Auto Transport','Golden State Auto Transport Inc.','Transportation','484230','Sacramento','CA',5600000,72,12,76,728,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',79,2,'Equipment LOC','Sarah Johnson',560000,410000,3,'2026-02-11','(916) 555-2620','admin@goldenstateautotransport.com','www.gsautotransport.com'),
('wf-biz-027','WF-001','Texas Oil Field Transport','Texas Oil Field Transport LLC','Transportation','484220','Houston','TX',8200000,105,17,78,742,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',81,1,'Fleet Financing','Michael Torres',820000,595000,4,'2026-02-10','(713) 555-2731','ops@texasoilfieldtransport.com','www.txoilfieldtransport.com'),
('wf-biz-028','WF-001','Columbia River Shipping','Columbia River Shipping Inc.','Transportation','483111','Portland','OR',6800000,88,16,77,735,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',80,1,'Equipment LOC','Sarah Johnson',680000,480000,3,'2026-02-09','(503) 555-2842','admin@columbiarivership.com','www.columbiarivershipping.com'),
('wf-biz-029','WF-001','Mountain West Logistics','Mountain West Logistics LLC','Transportation','484110','Denver','CO',7500000,95,14,79,745,'low','up',3,'mid-market',false,NULL,NULL,'West','growing',82,3,'Working Capital LOC','Sarah Johnson',750000,550000,4,'2026-02-11','(303) 555-2953','info@mountainwestlogistics.com','www.mwlogistics.com'),
('wf-biz-030','WF-001','Carolina Freight Lines','Carolina Freight Lines Inc.','Transportation','484110','Charlotte','NC',9200000,118,20,80,750,'low','stable',1,'mid-market',false,NULL,NULL,'Southeast','mature',83,1,'Fleet Financing','Sarah Johnson',920000,680000,4,'2026-02-10','(704) 555-3064','dispatch@carolinafreight.com','www.carolinafreightlines.com'),
('wf-biz-031','WF-001','Bay Area Moving & Storage','Bay Area Moving & Storage LLC','Transportation','484210','San Jose','CA',3800000,48,11,75,722,'low','up',2,'small',false,NULL,NULL,'West','growing',78,2,'Equipment LOC','David Chen',380000,275000,3,'2026-02-09','(408) 555-3175','office@bayareamoving.com','www.bayareamoving.com'),
('wf-biz-032','WF-001','Midwest Grain Haulers','Midwest Grain Haulers Inc.','Transportation','484110','Wichita','KS',5100000,65,15,76,728,'low','stable',1,'small',false,NULL,NULL,'Midwest','mature',79,1,'Fleet Financing','David Chen',510000,365000,3,'2026-02-11','(316) 555-3286','dispatch@midwestgrainhaulers.com','www.mwgrainhaulers.com'),
('wf-biz-033','WF-001','Sunshine Interstate Transport','Sunshine Interstate Transport LLC','Transportation','484110','Tampa','FL',4200000,55,10,74,715,'low','up',2,'small',false,NULL,NULL,'Southeast','growing',77,2,'Equipment LOC','Sarah Johnson',420000,305000,3,'2026-02-10','(813) 555-3397','admin@sunshineinterstate.com','www.sunshineinterstate.com'),
('wf-biz-034','WF-001','Pacific Northwest Freight','Pacific Northwest Freight Inc.','Transportation','484110','Spokane','WA',6500000,82,13,77,732,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',80,1,'Equipment LOC','Sarah Johnson',650000,475000,3,'2026-02-09','(509) 555-3408','ops@pnwfreight.com','www.pacificnorthwestfreight.com'),
('wf-biz-035','WF-001','Desert Express Logistics','Desert Express Logistics LLC','Transportation','484110','Las Vegas','NV',5800000,75,12,76,725,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',79,2,'Working Capital','Sarah Johnson',580000,420000,3,'2026-02-11','(702) 555-3519','info@desertexpresslogistics.com','www.desertexpresslogistics.com'),
('wf-biz-036','WF-001','Lone Star Freight Services','Lone Star Freight Services Inc.','Transportation','484110','San Antonio','TX',7800000,98,16,78,740,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',81,1,'Fleet Financing','Michael Torres',780000,570000,4,'2026-02-10','(210) 555-3620','dispatch@lonestarfreight.com','www.lonestarfreight.com'),

-- MANUFACTURING (17 businesses, 14.2% of 120) — WF strength (Midwest)
('wf-biz-037','WF-001','Great Lakes Metal Fabrication','Great Lakes Metal Fabrication Inc.','Manufacturing','332710','Cleveland','OH',14200000,175,24,82,762,'low','up',3,'mid-market',true,'Equipment Financing',1100000,'Midwest','mature',86,3,'Equipment LOC','David Chen',1420000,1100000,5,'2026-02-11','(216) 555-3731','admin@glmetalfab.com','www.greatlakesmetalfab.com'),
('wf-biz-038','WF-001','Precision Components Ohio','Precision Components Ohio LLC','Manufacturing','332710','Cincinnati','OH',9800000,128,20,80,748,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',83,1,'Term Loan','David Chen',980000,720000,4,'2026-02-10','(513) 555-3842','info@precisioncomponentsoh.com','www.precisioncomponentsohio.com'),
('wf-biz-039','WF-001','Midwest Industrial Parts','Midwest Industrial Parts Inc.','Manufacturing','333000','Milwaukee','WI',8200000,105,18,79,745,'low','up',2,'mid-market',false,NULL,NULL,'Midwest','mature',82,2,'Equipment LOC','David Chen',820000,595000,4,'2026-02-09','(414) 555-3953','contact@midwestindustrialparts.com','www.mwindustrialparts.com'),
('wf-biz-040','WF-001','Pacific Precision Machining','Pacific Precision Machining LLC','Manufacturing','332710','Portland','OR',6500000,85,15,78,738,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',81,1,'Equipment LOC','Sarah Johnson',650000,475000,3,'2026-02-11','(503) 555-4064','admin@pacificprecisionmachining.com','www.pacificprecision.com'),
('wf-biz-041','WF-001','Sunshine State Plastics','Sunshine State Plastics Inc.','Manufacturing','326100','Tampa','FL',5800000,72,12,76,728,'low','up',2,'mid-market',false,NULL,NULL,'Southeast','growing',79,2,'Working Capital','Sarah Johnson',580000,420000,3,'2026-02-10','(813) 555-4175','info@sunshineplastics.com','www.sunshinestateplastics.com'),
('wf-biz-042','WF-001','Rocky Mountain Wood Products','Rocky Mountain Wood Products LLC','Manufacturing','321900','Denver','CO',4200000,55,14,75,722,'low','stable',1,'small',false,NULL,NULL,'West','mature',78,1,'Equipment LOC','Sarah Johnson',420000,305000,3,'2026-02-09','(303) 555-4286','contact@rockymountainwood.com','www.rmwoodproducts.com'),
('wf-biz-043','WF-001','Texas Electronics Assembly','Texas Electronics Assembly Inc.','Manufacturing','334400','Austin','TX',11500000,142,17,81,758,'low','up',3,'mid-market',false,NULL,NULL,'Southwest','expansion',84,3,'Commercial LOC','Michael Torres',1150000,850000,4,'2026-02-11','(512) 555-4397','admin@texaselectronics.com','www.txelectronicsassembly.com'),
('wf-biz-044','WF-001','West Coast Packaging','West Coast Packaging LLC','Manufacturing','322200','Los Angeles','CA',7800000,98,16,78,742,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',81,1,'Equipment LOC','Sarah Johnson',780000,570000,4,'2026-02-10','(213) 555-4408','info@westcoastpackaging.com','www.wcpackaging.com'),
('wf-biz-045','WF-001','Carolina Metal Works','Carolina Metal Works Inc.','Manufacturing','332710','Charlotte','NC',6200000,78,15,77,735,'low','up',2,'mid-market',false,NULL,NULL,'Southeast','growing',80,2,'Equipment Financing','Sarah Johnson',620000,450000,3,'2026-02-09','(704) 555-4519','contact@carolinametalworks.com','www.carolinametalworks.com'),
('wf-biz-046','WF-001','Heartland Food Processing','Heartland Food Processing LLC','Manufacturing','311000','Des Moines','IA',9200000,118,20,80,750,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',83,1,'Equipment LOC','David Chen',920000,680000,4,'2026-02-11','(515) 555-4620','admin@heartlandfoodprocessing.com','www.heartlandfood.com'),
('wf-biz-047','WF-001','Bay Area Textiles','Bay Area Textiles Inc.','Manufacturing','313000','San Francisco','CA',5400000,68,13,76,725,'low','stable',0,'mid-market',false,NULL,NULL,'West','mature',79,0,'Term Loan','Sarah Johnson',540000,390000,3,'2026-02-10','(415) 555-4731','info@bayareatextiles.com','www.bayareatextiles.com'),
('wf-biz-048','WF-001','Southwest Industrial Coatings','Southwest Industrial Coatings LLC','Manufacturing','325500','Albuquerque','NM',3800000,48,11,75,720,'low','up',2,'small',false,NULL,NULL,'Southwest','growing',78,2,'Equipment LOC','Michael Torres',380000,275000,3,'2026-02-09','(505) 555-4842','contact@swindustrialcoatings.com','www.swindustrialcoatings.com'),
('wf-biz-049','WF-001','Pacific Aerospace Components','Pacific Aerospace Components Inc.','Manufacturing','336400','Seattle','WA',13800000,168,19,83,765,'low','up',4,'mid-market',true,'Equipment Expansion',1250000,'West','expansion',87,4,'Equipment LOC','Sarah Johnson',1380000,1250000,5,'2026-02-11','(206) 555-4953','admin@pacificaerospace.com','www.pacificaerocomp.com'),
('wf-biz-050','WF-001','Southeast Furniture Manufacturing','Southeast Furniture Manufacturing LLC','Manufacturing','337100','Atlanta','GA',4600000,58,12,75,718,'low','stable',1,'small',false,NULL,NULL,'Southeast','growing',78,1,'Equipment LOC','Sarah Johnson',460000,335000,3,'2026-02-10','(404) 555-5064','info@southeastfurniture.com','www.sefurniture.com'),
('wf-biz-051','WF-001','Midwest Machine Tools','Midwest Machine Tools Inc.','Manufacturing','333500','Indianapolis','IN',7200000,92,16,78,740,'low','up',2,'mid-market',false,NULL,NULL,'Midwest','mature',81,2,'Equipment Financing','David Chen',720000,525000,4,'2026-02-09','(317) 555-5175','contact@midwestmachinetools.com','www.mwmachinetools.com'),
('wf-biz-052','WF-001','Golden Gate Medical Devices','Golden Gate Medical Devices LLC','Manufacturing','339100','San Jose','CA',10500000,135,15,81,755,'low','up',3,'mid-market',false,NULL,NULL,'West','expansion',84,3,'Working Capital LOC','Sarah Johnson',1050000,780000,4,'2026-02-11','(408) 555-5286','admin@ggmedicaldevices.com','www.goldengatemedical.com'),
('wf-biz-053','WF-001','Texas Industrial Pumps','Texas Industrial Pumps Inc.','Manufacturing','333900','Houston','TX',8600000,110,18,79,748,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',82,1,'Equipment LOC','Michael Torres',860000,630000,4,'2026-02-10','(713) 555-5397','info@texasindustrialpumps.com','www.txindustrialpumps.com'),

-- RETAIL TRADE (15 businesses, 12.3% of 120)
('wf-biz-054','WF-001','Bay Area Specialty Foods','Bay Area Specialty Foods LLC','Retail','445110','Oakland','CA',6200000,78,14,76,728,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',79,2,'Merchant Services','Sarah Johnson',620000,450000,3,'2026-02-11','(510) 555-5408','admin@bayareaspecialtyfoods.com','www.baspecialtyfoods.com'),
('wf-biz-055','WF-001','Sunshine Home & Garden','Sunshine Home & Garden Inc.','Retail','444100','Tampa','FL',4800000,62,11,74,718,'low','stable',1,'small',false,NULL,NULL,'Southeast','growing',77,1,'Business LOC','Sarah Johnson',480000,350000,3,'2026-02-10','(813) 555-5519','info@sunshinehomegarden.com','www.sunshinehomegarden.com'),
('wf-biz-056','WF-001','Mountain Sports Outfitters','Mountain Sports Outfitters LLC','Retail','451110','Denver','CO',3400000,45,9,73,'medium',710,'up',2,'small',false,NULL,NULL,'West','growing',75,2,'Merchant Services','Sarah Johnson',340000,245000,2,'2026-02-09','(303) 555-5620','contact@mountainsportsoutfitters.com','www.mountainsportsoutfitters.com'),
('wf-biz-057','WF-001','Carolina Auto Parts Supply','Carolina Auto Parts Supply Inc.','Retail','441310','Charlotte','NC',5600000,72,13,76,725,'low','up',2,'mid-market',false,NULL,NULL,'Southeast','growing',79,2,'Inventory LOC','Sarah Johnson',560000,410000,3,'2026-02-11','(704) 555-5731','admin@carolinaautoparts.com','www.carolinaauto.com'),
('wf-biz-058','WF-001','Pacific Coast Surf Shop','Pacific Coast Surf Shop LLC','Retail','451110','San Diego','CA',1900000,28,7,71,'medium',695,'stable',0,'small',false,NULL,NULL,'West','growing',73,0,'Merchant Services','David Chen',190000,128000,2,'2026-02-08','(619) 555-5842','info@pacificcoastsurfshop.com','www.pcsurf.com'),
('wf-biz-059','WF-001','Heartland Hardware & Lumber','Heartland Hardware & Lumber Inc.','Retail','444100','Des Moines','IA',7800000,98,19,78,742,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',81,1,'Inventory Financing','David Chen',780000,570000,4,'2026-02-11','(515) 555-5953','contact@heartlandhardware.com','www.heartlandhardware.com'),
('wf-biz-060','WF-001','Southwest Wine & Spirits','Southwest Wine & Spirits LLC','Retail','445310','Phoenix','AZ',9200000,118,16,79,748,'low','up',2,'mid-market',true,'Inventory Expansion',680000,'West','expansion',82,2,'Inventory LOC','Sarah Johnson',920000,680000,4,'2026-02-10','(602) 555-6064','admin@southwestwine.com','www.swwineandspirits.com'),
('wf-biz-061','WF-001','Golden State Pet Supplies','Golden State Pet Supplies Inc.','Retail','453910','Sacramento','CA',4200000,55,10,74,715,'low','up',2,'small',false,NULL,NULL,'West','growing',77,2,'Merchant Services','Sarah Johnson',420000,305000,3,'2026-02-09','(916) 555-6175','info@goldenstpetsupplies.com','www.gspetsupplies.com'),
('wf-biz-062','WF-001','Southeast Office Supply','Southeast Office Supply LLC','Retail','453210','Atlanta','GA',6800000,88,15,77,735,'low','stable',1,'mid-market',false,NULL,NULL,'Southeast','mature',80,1,'Working Capital','Sarah Johnson',680000,495000,3,'2026-02-11','(404) 555-6286','contact@southeastoffice.com','www.seofficesupply.com'),
('wf-biz-063','WF-001','Texas Western Wear','Texas Western Wear Inc.','Retail','448100','San Antonio','TX',3800000,48,12,75,722,'low','stable',1,'small',false,NULL,NULL,'Southwest','mature',78,1,'Merchant Services','Michael Torres',380000,275000,3,'2026-02-10','(210) 555-6397','admin@texaswesternwear.com','www.txwesternwear.com'),
('wf-biz-064','WF-001','Bay Area Electronics','Bay Area Electronics LLC','Retail','443142','San Francisco','CA',8500000,110,17,78,740,'low','up',3,'mid-market',false,NULL,NULL,'West','mature',81,3,'Inventory LOC','Sarah Johnson',850000,620000,4,'2026-02-09','(415) 555-6408','info@bayareaelectronics.com','www.baelectronics.com'),
('wf-biz-065','WF-001','Midwest Farm Supply','Midwest Farm Supply Inc.','Retail','444220','Wichita','KS',5400000,68,14,76,728,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',79,1,'Inventory Financing','David Chen',540000,390000,3,'2026-02-11','(316) 555-6519','contact@midwestfarmsupply.com','www.mwfarmsupply.com'),
('wf-biz-066','WF-001','Coastal Bike & Scooter','Coastal Bike & Scooter LLC','Retail','441228','Miami','FL',2600000,35,8,72,'medium',705,'up',2,'small',false,NULL,NULL,'Southeast','growing',74,2,'Merchant Services','Sarah Johnson',260000,180000,2,'2026-02-10','(305) 555-6620','admin@coastalbikescooter.com','www.coastalbike.com'),
('wf-biz-067','WF-001','Pacific Northwest Books','Pacific Northwest Books Inc.','Retail','451211','Portland','OR',1400000,22,11,70,'medium',688,'stable',0,'small',false,NULL,NULL,'West','mature',72,0,'Business LOC','David Chen',140000,95000,2,'2026-02-08','(503) 555-6731','info@pnwbooks.com','www.pacificnorthwestbooks.com'),
('wf-biz-068','WF-001','Southwest Outdoor Living','Southwest Outdoor Living LLC','Retail','444200','Scottsdale','AZ',4600000,58,10,75,720,'low','up',2,'small',false,NULL,NULL,'West','growing',78,2,'Inventory LOC','Sarah Johnson',460000,335000,3,'2026-02-09','(480) 555-6842','contact@swoutdoorliving.com','www.southwestoutdoorliving.com'),

-- PROFESSIONAL SERVICES (14 businesses, 11.8% of 120)
('wf-biz-069','WF-001','Bay Area Business Consulting','Bay Area Business Consulting LLC','Professional Services','541611','San Francisco','CA',5800000,48,12,77,732,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',80,2,'Working Capital LOC','Sarah Johnson',580000,420000,3,'2026-02-11','(415) 555-6953','admin@babusinessconsulting.com','www.babusinessconsulting.com'),
('wf-biz-070','WF-001','Sunshine Marketing Group','Sunshine Marketing Group Inc.','Professional Services','541810','Tampa','FL',4200000,35,9,75,722,'low','stable',1,'small',false,NULL,NULL,'Southeast','growing',78,1,'Business LOC','Sarah Johnson',420000,305000,3,'2026-02-10','(813) 555-7064','info@sunshinemarketinggroup.com','www.sunshinemktg.com'),
('wf-biz-071','WF-001','Rocky Mountain Legal Associates','Rocky Mountain Legal Associates PC','Professional Services','541110','Denver','CO',3400000,28,14,76,728,'low','stable',0,'small',false,NULL,NULL,'West','mature',79,0,'Business LOC','Sarah Johnson',340000,245000,2,'2026-02-09','(303) 555-7175','contact@rockymountainlegal.com','www.rmlegal.com'),
('wf-biz-072','WF-001','Carolina Accounting & Tax','Carolina Accounting & Tax LLC','Professional Services','541211','Charlotte','NC',2800000,22,11,74,715,'low','up',2,'small',false,NULL,NULL,'Southeast','mature',77,2,'Business LOC','Sarah Johnson',280000,195000,2,'2026-02-11','(704) 555-7286','admin@carolinaaccounting.com','www.carolinaaccounttax.com'),
('wf-biz-073','WF-001','Pacific Northwest Design Studio','Pacific Northwest Design Studio LLC','Professional Services','541400','Portland','OR',1900000,18,7,72,'medium',705,'up',2,'small',false,NULL,NULL,'West','growing',74,2,'Business LOC','David Chen',190000,128000,2,'2026-02-08','(503) 555-7397','info@pnwdesignstudio.com','www.pnwdesign.com'),
('wf-biz-074','WF-001','Heartland Engineering Services','Heartland Engineering Services Inc.','Professional Services','541330','Des Moines','IA',6200000,52,15,77,735,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',80,1,'Working Capital','David Chen',620000,450000,3,'2026-02-11','(515) 555-7408','contact@heartlandengineering.com','www.heartlandeng.com'),
('wf-biz-075','WF-001','Southwest HR Solutions','Southwest HR Solutions LLC','Professional Services','541612','Phoenix','AZ',4800000,38,10,76,725,'low','up',2,'small',false,NULL,NULL,'West','growing',79,2,'Business LOC','Sarah Johnson',480000,350000,3,'2026-02-10','(602) 555-7519','admin@southwesthrsolutions.com','www.swhrsolutions.com'),
('wf-biz-076','WF-001','Golden State Architects','Golden State Architects PC','Professional Services','541310','Los Angeles','CA',7800000,65,16,78,742,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',81,1,'Working Capital LOC','Sarah Johnson',780000,570000,4,'2026-02-09','(213) 555-7620','info@goldenstarchitects.com','www.gsarchitects.com'),
('wf-biz-077','WF-001','Southeast IT Services','Southeast IT Services Inc.','Professional Services','541512','Atlanta','GA',5400000,45,11,76,728,'low','up',2,'mid-market',false,NULL,NULL,'Southeast','growing',79,2,'Business LOC','Sarah Johnson',540000,390000,3,'2026-02-11','(404) 555-7731','contact@southeastit.com','www.seitservices.com'),
('wf-biz-078','WF-001','Texas Legal Advisors','Texas Legal Advisors PC','Professional Services','541110','Dallas','TX',6800000,55,17,77,735,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',80,1,'Business LOC','Michael Torres',680000,495000,3,'2026-02-10','(214) 555-7842','admin@texaslegaladvisors.com','www.txlegaladvisors.com'),
('wf-biz-079','WF-001','Bay Area Tech Consulting','Bay Area Tech Consulting LLC','Professional Services','541512','San Jose','CA',9200000,75,13,79,748,'low','up',3,'mid-market',false,NULL,NULL,'West','expansion',82,3,'Working Capital LOC','Sarah Johnson',920000,680000,4,'2026-02-09','(408) 555-7953','info@batechconsulting.com','www.batechconsulting.com'),
('wf-biz-080','WF-001','Midwest Management Group','Midwest Management Group LLC','Professional Services','541611','Minneapolis','MN',3800000,32,9,75,720,'low','up',2,'small',false,NULL,NULL,'Midwest','growing',78,2,'Business LOC','David Chen',380000,275000,3,'2026-02-11','(612) 555-8064','contact@midwestmanagement.com','www.mwmgmtgroup.com'),
('wf-biz-081','WF-001','Coastal Real Estate Advisors','Coastal Real Estate Advisors LLC','Professional Services','531210','Charleston','SC',2600000,22,8,73,'medium',710,'stable',0,'small',false,NULL,NULL,'Southeast','growing',75,0,'Business LOC','Sarah Johnson',260000,180000,2,'2026-02-08','(843) 555-8175','admin@coastalrealestate.com','www.coastalreadvisors.com'),
('wf-biz-082','WF-001','Pacific Insurance Brokers','Pacific Insurance Brokers Inc.','Professional Services','524210','Seattle','WA',5600000,45,14,76,725,'low','up',2,'mid-market',false,NULL,NULL,'West','mature',79,2,'Working Capital','Sarah Johnson',560000,410000,3,'2026-02-10','(206) 555-8286','info@pacificinsbrokers.com','www.pacificinsurance.com'),

-- HEALTHCARE (13 businesses, 11.0% of 120)
('wf-biz-083','WF-001','Bay Area Family Medicine','Bay Area Family Medicine PC','Healthcare','621111','Oakland','CA',6800000,55,15,78,738,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',81,1,'Medical Practice LOC','Sarah Johnson',680000,495000,3,'2026-02-11','(510) 555-8397','admin@bafamilymedicine.com','www.bayareafamilymed.com'),
('wf-biz-084','WF-001','Sunshine Dental Group','Sunshine Dental Group PC','Healthcare','621210','Tampa','FL',4200000,35,12,76,728,'low','up',2,'small',false,NULL,NULL,'Southeast','growing',79,2,'Medical Equipment LOC','Sarah Johnson',420000,305000,3,'2026-02-10','(813) 555-8408','info@sunshinedentalgroup.com','www.sunshinedental.com'),
('wf-biz-085','WF-001','Rocky Mountain Veterinary','Rocky Mountain Veterinary Hospital PC','Healthcare','541940','Denver','CO',3400000,28,10,75,722,'low','stable',1,'small',false,NULL,NULL,'West','growing',78,1,'Equipment LOC','Sarah Johnson',340000,245000,3,'2026-02-09','(303) 555-8519','contact@rockymountainvet.com','www.rmveterinary.com'),
('wf-biz-086','WF-001','Carolina Orthopedic Associates','Carolina Orthopedic Associates PC','Healthcare','621111','Charlotte','NC',9200000,75,18,80,750,'low','up',2,'mid-market',false,NULL,NULL,'Southeast','mature',83,2,'Medical Practice LOC','Sarah Johnson',920000,680000,4,'2026-02-11','(704) 555-8620','admin@carolinaorthopedic.com','www.carolinaortho.com'),
('wf-biz-087','WF-001','Pacific Northwest Physical Therapy','Pacific Northwest Physical Therapy LLC','Healthcare','621340','Portland','OR',2800000,22,9,74,715,'low','up',2,'small',false,NULL,NULL,'West','growing',77,2,'Equipment LOC','David Chen',280000,195000,2,'2026-02-08','(503) 555-8731','info@pnwphysicaltherapy.com','www.pnwpt.com'),
('wf-biz-088','WF-001','Heartland Medical Imaging','Heartland Medical Imaging LLC','Healthcare','621512','Des Moines','IA',8500000,68,14,79,745,'low','stable',1,'mid-market',true,'Equipment Upgrade',620000,'Midwest','mature',82,1,'Medical Equipment LOC','David Chen',850000,620000,4,'2026-02-11','(515) 555-8842','contact@heartlandmedicalimaging.com','www.heartlandimaging.com'),
('wf-biz-089','WF-001','Southwest Urgent Care','Southwest Urgent Care LLC','Healthcare','621493','Phoenix','AZ',5600000,45,11,77,732,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',80,2,'Medical Practice LOC','Sarah Johnson',560000,410000,3,'2026-02-10','(602) 555-8953','admin@southwesturgentcare.com','www.swurgentcare.com'),
('wf-biz-090','WF-001','Golden State Mental Health','Golden State Mental Health Services PC','Healthcare','621330','San Francisco','CA',3800000,32,8,75,720,'low','stable',1,'small',false,NULL,NULL,'West','growing',78,1,'Business LOC','Sarah Johnson',380000,275000,3,'2026-02-09','(415) 555-9064','info@goldenstatemental.com','www.gsmentalhealth.com'),
('wf-biz-091','WF-001','Southeast Home Healthcare','Southeast Home Healthcare LLC','Healthcare','621610','Atlanta','GA',6200000,52,13,77,735,'low','up',2,'mid-market',false,NULL,NULL,'Southeast','growing',80,2,'Working Capital','Sarah Johnson',620000,450000,3,'2026-02-11','(404) 555-9175','contact@southeasthome.com','www.sehomehealthcare.com'),
('wf-biz-092','WF-001','Texas Pediatric Group','Texas Pediatric Group PC','Healthcare','621111','Houston','TX',7800000,62,16,78,742,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',81,1,'Medical Practice LOC','Michael Torres',780000,570000,4,'2026-02-10','(713) 555-9286','admin@texaspediatricgroup.com','www.txpediatrics.com'),
('wf-biz-093','WF-001','Bay Area Ophthalmology','Bay Area Ophthalmology Associates PC','Healthcare','621111','San Jose','CA',5400000,45,12,76,728,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',79,2,'Medical Equipment','Sarah Johnson',540000,390000,3,'2026-02-09','(408) 555-9397','info@baophthalmology.com','www.bayareaeyecare.com'),
('wf-biz-094','WF-001','Midwest Chiropractic Center','Midwest Chiropractic Center LLC','Healthcare','621310','Milwaukee','WI',1900000,18,7,72,'medium',705,'up',2,'small',false,NULL,NULL,'Midwest','growing',74,2,'Equipment LOC','David Chen',190000,128000,2,'2026-02-08','(414) 555-9408','contact@midwestchiro.com','www.mwchiropractic.com'),
('wf-biz-095','WF-001','Coastal Women\'s Health','Coastal Women\'s Health Associates PC','Healthcare','621111','Miami','FL',4600000,38,11,75,722,'low','stable',1,'small',false,NULL,NULL,'Southeast','growing',78,1,'Medical Practice LOC','Sarah Johnson',460000,335000,3,'2026-02-11','(305) 555-9519','admin@coastalwomenshealth.com','www.coastalwomens.com'),

-- FOOD SERVICE / AGRICULTURE (12 businesses, 10.2% of 120) — WF strength (nation's largest ag lender)
('wf-biz-096','WF-001','Great Plains Grain & Feed','Great Plains Grain & Feed Inc.','Agriculture','111000','Omaha','NE',8500000,75,22,79,745,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',82,1,'Ag Equipment LOC','David Chen',850000,620000,4,'2026-02-11','(402) 555-9620','admin@greatplainsgrain.com','www.gpgrainfeed.com'),
('wf-biz-097','WF-001','Heartland Cattle Ranch','Heartland Cattle Ranch LLC','Agriculture','112000','Wichita','KS',6200000,48,18,77,735,'low','up',2,'mid-market',false,NULL,NULL,'Midwest','mature',80,2,'Ag Operating LOC','David Chen',620000,450000,3,'2026-02-10','(316) 555-9731','info@heartlandcattleranch.com','www.heartlandcattle.com'),
('wf-biz-098','WF-001','Valley Fresh Produce','Valley Fresh Produce LLC','Agriculture','111000','Fresno','CA',9800000,88,16,78,742,'low','stable',1,'mid-market',true,'Cold Storage Expansion',720000,'West','growing',81,1,'Ag Real Estate','Sarah Johnson',980000,720000,4,'2026-02-09','(559) 555-9842','contact@valleyfreshproduce.com','www.valleyfresh.com'),
('wf-biz-099','WF-001','Sunshine Citrus Growers','Sunshine Citrus Growers LLC','Agriculture','111000','Tampa','FL',7400000,65,20,78,740,'low','stable',1,'mid-market',false,NULL,NULL,'Southeast','mature',81,1,'Ag Equipment LOC','Sarah Johnson',740000,540000,4,'2026-02-11','(813) 555-9953','admin@sunshinecitrus.com','www.sunshinecitrusgrowers.com'),
('wf-biz-100','WF-001','Pacific Vineyard Estates','Pacific Vineyard Estates LLC','Agriculture','111000','Napa','CA',5600000,45,14,76,728,'low','up',2,'mid-market',false,NULL,NULL,'West','mature',79,2,'Ag Real Estate','Sarah Johnson',560000,410000,3,'2026-02-10','(707) 555-0064','info@pacificvineyard.com','www.pacificvineyardes.com'),
('wf-biz-101','WF-001','Midwest Dairy Co-op','Midwest Dairy Cooperative','Agriculture','112000','Des Moines','IA',11200000,95,25,80,750,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',83,1,'Ag Equipment LOC','David Chen',1120000,820000,4,'2026-02-09','(515) 555-0175','contact@midwestdairycoop.com','www.mwdairycoop.com'),
('wf-biz-102','WF-001','Carolina Brewhouse','Carolina Brewhouse LLC','Food Service','312120','Charleston','SC',3800000,32,8,74,715,'low','up',2,'small',false,NULL,NULL,'Southeast','growing',77,2,'Equipment LOC','Sarah Johnson',380000,275000,3,'2026-02-11','(843) 555-0286','admin@carolinabrewhouse.com','www.carolinabrewhouse.com'),
('wf-biz-103','WF-001','Pacific Coast Seafood','Pacific Coast Seafood LLC','Food Service','311710','Seattle','WA',6800000,58,15,77,735,'low','stable',1,'mid-market',false,NULL,NULL,'West','mature',80,1,'Working Capital','Sarah Johnson',680000,495000,3,'2026-02-10','(206) 555-0397','info@pacificcoastseafood.com','www.pcseafood.com'),
('wf-biz-104','WF-001','Southwest BBQ Supply','Southwest BBQ Supply Inc.','Food Service','424490','Austin','TX',4200000,35,10,75,722,'low','up',2,'small',false,NULL,NULL,'Southwest','growing',78,2,'Inventory LOC','Michael Torres',420000,305000,3,'2026-02-09','(512) 555-0408','contact@southwestbbqsupply.com','www.swbbqsupply.com'),
('wf-biz-105','WF-001','Bay Area Organic Bakery','Bay Area Organic Bakery LLC','Food Service','311811','Oakland','CA',2600000,28,7,73,'medium',710,'up',2,'small',false,NULL,NULL,'West','growing',75,2,'Equipment LOC','David Chen',260000,180000,2,'2026-02-08','(510) 555-0519','admin@baorganicbakery.com','www.bayareaorganicbakery.com'),
('wf-biz-106','WF-001','Texas Farm Equipment','Texas Farm Equipment Supply Inc.','Agriculture','444220','Lubbock','TX',5400000,42,16,76,725,'low','stable',1,'mid-market',false,NULL,NULL,'Southwest','mature',79,1,'Inventory Financing','Michael Torres',540000,390000,3,'2026-02-11','(806) 555-0620','info@texasfarmequipment.com','www.txfarmequip.com'),
('wf-biz-107','WF-001','Pacific Northwest Winery','Pacific Northwest Winery LLC','Agriculture','312130','Portland','OR',4800000,38,11,76,728,'low','up',2,'small',false,NULL,NULL,'West','growing',79,2,'Ag Equipment','Sarah Johnson',480000,350000,3,'2026-02-10','(503) 555-0731','contact@pnwwinery.com','www.pacificnorthwestwinery.com'),

-- TECHNOLOGY (13 businesses, 10.5% of 120) — WF growing but historically weaker
('wf-biz-108','WF-001','Bay Area Cloud Solutions','Bay Area Cloud Solutions Inc.','Technology','541512','San Francisco','CA',8500000,68,9,78,742,'low','up',3,'mid-market',true,'Growth Capital',620000,'West','expansion',81,3,'Working Capital LOC','Sarah Johnson',850000,620000,4,'2026-02-11','(415) 555-0842','admin@bacloudsolutions.com','www.bayareacloudsolutions.com'),
('wf-biz-109','WF-001','Pacific Northwest Software','Pacific Northwest Software Inc.','Technology','511210','Seattle','WA',6800000,55,8,77,735,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',80,2,'Business LOC','Sarah Johnson',680000,495000,3,'2026-02-10','(206) 555-0953','info@pnwsoftware.com','www.pacificnorthwestsoftware.com'),
('wf-biz-110','WF-001','Texas Cybersecurity Group','Texas Cybersecurity Group LLC','Technology','541512','Austin','TX',5400000,45,7,76,728,'low','up',2,'mid-market',false,NULL,NULL,'Southwest','growing',79,2,'Working Capital','Michael Torres',540000,390000,3,'2026-02-09','(512) 555-1064','contact@texascybergroup.com','www.txcybergroup.com'),
('wf-biz-111','WF-001','Golden State Data Analytics','Golden State Data Analytics Inc.','Technology','518210','San Jose','CA',7200000,58,10,78,740,'low','up',3,'mid-market',false,NULL,NULL,'West','expansion',81,3,'Business LOC','Sarah Johnson',720000,525000,4,'2026-02-11','(408) 555-1175','admin@goldenstatedata.com','www.gsdataanalytics.com'),
('wf-biz-112','WF-001','Southeast Tech Staffing','Southeast Tech Staffing LLC','Technology','541612','Atlanta','GA',4200000,35,8,75,722,'low','stable',1,'small',false,NULL,NULL,'Southeast','growing',78,1,'Working Capital','Sarah Johnson',420000,305000,3,'2026-02-10','(404) 555-1286','info@southeasttechstaffing.com','www.setechstaffing.com'),
('wf-biz-113','WF-001','Rocky Mountain App Dev','Rocky Mountain App Development LLC','Technology','541511','Denver','CO',3800000,32,6,74,715,'low','up',2,'small',false,NULL,NULL,'West','growing',77,2,'Business LOC','Sarah Johnson',380000,275000,3,'2026-02-09','(303) 555-1397','contact@rockymountainappdev.com','www.rmappdev.com'),
('wf-biz-114','WF-001','Pacific IoT Systems','Pacific IoT Systems Inc.','Technology','334400','Portland','OR',5600000,45,7,76,725,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',79,2,'Equipment LOC','Sarah Johnson',560000,410000,3,'2026-02-11','(503) 555-1408','admin@pacificiotsystems.com','www.pacificiot.com'),
('wf-biz-115','WF-001','Heartland SaaS Solutions','Heartland SaaS Solutions LLC','Technology','511210','Des Moines','IA',2600000,22,5,72,'medium',705,'up',2,'small',false,NULL,NULL,'Midwest','growing',74,2,'Working Capital','David Chen',260000,180000,2,'2026-02-08','(515) 555-1519','info@heartlandsaas.com','www.heartlandsaas.com'),
('wf-biz-116','WF-001','Southwest IT Infrastructure','Southwest IT Infrastructure Inc.','Technology','541512','Phoenix','AZ',6200000,52,9,77,732,'low','up',2,'mid-market',false,NULL,NULL,'West','growing',80,2,'Equipment LOC','Sarah Johnson',620000,450000,3,'2026-02-10','(602) 555-1620','contact@swit infrastructure.com','www.switinfrastructure.com'),
('wf-biz-117','WF-001','Carolina Software Development','Carolina Software Development LLC','Technology','541511','Charlotte','NC',4800000,38,8,75,720,'low','stable',1,'small',false,NULL,NULL,'Southeast','growing',78,1,'Business LOC','Sarah Johnson',480000,350000,3,'2026-02-09','(704) 555-1731','admin@carolinasoftdev.com','www.carolinasoftware.com'),
('wf-biz-118','WF-001','Bay Area AI Labs','Bay Area AI Labs Inc.','Technology','541712','San Francisco','CA',9800000,78,6,79,748,'low','up',4,'mid-market',true,'Series A Bridge',850000,'West','expansion',82,4,'Venture Debt','Sarah Johnson',980000,850000,4,'2026-02-11','(415) 555-1842','info@baailabs.com','www.bayareaailabs.com'),
('wf-biz-119','WF-001','Pacific Mobile Apps','Pacific Mobile Apps LLC','Technology','541511','Seattle','WA',3400000,28,5,73,'medium',710,'up',2,'small',false,NULL,NULL,'West','growing',75,2,'Business LOC','David Chen',340000,245000,2,'2026-02-08','(206) 555-1953','contact@pacificmobileapps.com','www.pacificmobileapps.com'),
('wf-biz-120','WF-001','Texas Blockchain Services','Texas Blockchain Services Inc.','Technology','541512','Dallas','TX',5800000,48,4,75,722,'low','up',3,'mid-market',false,NULL,NULL,'Southwest','growing',78,3,'Working Capital','Michael Torres',580000,420000,3,'2026-02-10','(214) 555-2064','admin@texasblockchain.com','www.txblockchainservices.com')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  legal_name = EXCLUDED.legal_name,
  industry = EXCLUDED.industry,
  naics_code = EXCLUDED.naics_code,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  annual_revenue = EXCLUDED.annual_revenue,
  employee_count = EXCLUDED.employee_count,
  years_in_business = EXCLUDED.years_in_business,
  lumiq_score = EXCLUDED.lumiq_score,
  owner_fico = EXCLUDED.owner_fico,
  risk_tier = EXCLUDED.risk_tier,
  score_trend = EXCLUDED.score_trend,
  trend_value = EXCLUDED.trend_value,
  segment = EXCLUDED.segment,
  has_active_application = EXCLUDED.has_active_application,
  product_type = EXCLUDED.product_type,
  application_amount = EXCLUDED.application_amount,
  region = EXCLUDED.region,
  relationship_stage = EXCLUDED.relationship_stage,
  rhs = EXCLUDED.rhs,
  rhs_change = EXCLUDED.rhs_change,
  primary_product = EXCLUDED.primary_product,
  assigned_rm = EXCLUDED.assigned_rm,
  deposit_balance = EXCLUDED.deposit_balance,
  total_exposure = EXCLUDED.total_exposure,
  product_count = EXCLUDED.product_count,
  last_activity = EXCLUDED.last_activity,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website;

-- Link all businesses to portfolio
INSERT INTO portfolio_businesses (portfolio_id, business_id)
SELECT 'wf-portfolio-001', id FROM businesses WHERE tenant_id = 'WF-001'
ON CONFLICT (portfolio_id, business_id) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════════════
-- PRODUCTS & APPLICATIONS
-- ══════════════════════════════════════════════════════════════════════════════

-- Wells Fargo real product catalog (15 products)
INSERT INTO products (business_id, name, type, status, balance, credit_limit, opened_date) VALUES
('wf-biz-001', 'Business Elite Checking', 'deposit', 'active', 1240000, NULL, '2020-03-15'),
('wf-biz-001', 'Construction Line of Credit', 'credit', 'pending', NULL, 850000, '2026-02-11'),
('wf-biz-003', 'Business Elite Checking', 'deposit', 'active', 1520000, NULL, '2018-06-01'),
('wf-biz-003', 'Equipment Financing', 'credit', 'pending', NULL, 1200000, '2026-02-09'),
('wf-biz-022', 'Business Elite Checking', 'deposit', 'active', 1240000, NULL, '2017-09-20'),
('wf-biz-022', 'Wells Fargo Business Elite Card', 'credit', 'active', 48500, 100000, '2019-03-10'),
('wf-biz-037', 'Business Elite Checking', 'deposit', 'active', 1420000, NULL, '2015-04-12'),
('wf-biz-037', 'Equipment Line of Credit', 'credit', 'pending', NULL, 1100000, '2026-02-11'),
('wf-biz-049', 'Business Elite Checking', 'deposit', 'active', 1380000, NULL, '2019-08-05'),
('wf-biz-049', 'Wells Fargo BusinessLine', 'credit', 'active', 125000, 500000, '2021-11-15'),
('wf-biz-060', 'Business Platinum Checking', 'deposit', 'active', 920000, NULL, '2019-01-20'),
('wf-biz-060', 'Inventory Line of Credit', 'credit', 'pending', NULL, 680000, '2026-02-10'),
('wf-biz-088', 'Business Platinum Checking', 'deposit', 'active', 850000, NULL, '2018-07-18'),
('wf-biz-088', 'Medical Equipment Financing', 'credit', 'pending', NULL, 620000, '2026-02-11'),
('wf-biz-098', 'Agribusiness Checking', 'deposit', 'active', 980000, NULL, '2016-05-22'),
('wf-biz-098', 'Ag Real Estate Term Loan', 'credit', 'active', 320000, 720000, '2020-09-10'),
('wf-biz-108', 'Business Elite Checking', 'deposit', 'active', 850000, NULL, '2021-02-28'),
('wf-biz-108', 'Growth Capital LOC', 'credit', 'pending', NULL, 620000, '2026-02-11'),
('wf-biz-118', 'Business Platinum Checking', 'deposit', 'active', 980000, NULL, '2022-06-15'),
('wf-biz-118', 'Venture Debt Facility', 'credit', 'pending', NULL, 850000, '2026-02-11')
ON CONFLICT DO NOTHING;

-- Applications (11 active applications across key segments)
INSERT INTO applications (id, app_id, business_id, business_name, status, product_type, amount, submitted_at, ai_recommendation, confidence, composite_score, risk_tier) VALUES
('wf-app-001', 'WF-2026-001', 'wf-biz-001', 'Ironclad Construction Co', 'submitted', 'Construction Line of Credit', 850000, '2026-02-08T10:15:00Z', 'approve', 92, 86, 'low'),
('wf-app-002', 'WF-2026-002', 'wf-biz-003', 'Bay Area Commercial Build', 'under_review', 'Equipment Financing', 1200000, '2026-02-05T14:30:00Z', 'approve', 94, 88, 'low'),
('wf-app-003', 'WF-2026-003', 'wf-biz-015', 'Pacific Coast Landscaping', 'submitted', 'Working Capital', 320000, '2026-02-06T11:20:00Z', 'review', 78, 78, 'low'),
('wf-app-004', 'WF-2026-004', 'wf-biz-022', 'Pacific Coast Freight', 'under_review', 'Fleet Expansion', 950000, '2026-02-04T09:45:00Z', 'approve', 91, 85, 'low'),
('wf-app-005', 'WF-2026-005', 'wf-biz-037', 'Great Lakes Metal Fabrication', 'submitted', 'Equipment Financing', 1100000, '2026-02-07T16:00:00Z', 'approve', 93, 86, 'low'),
('wf-app-006', 'WF-2026-006', 'wf-biz-049', 'Pacific Aerospace Components', 'under_review', 'Equipment Expansion', 1250000, '2026-02-09T11:30:00Z', 'approve', 94, 87, 'low'),
('wf-app-007', 'WF-2026-007', 'wf-biz-060', 'Southwest Wine & Spirits', 'submitted', 'Inventory Expansion', 680000, '2026-02-08T14:45:00Z', 'review', 82, 82, 'low'),
('wf-app-008', 'WF-2026-008', 'wf-biz-088', 'Heartland Medical Imaging', 'under_review', 'Equipment Upgrade', 620000, '2026-02-10T09:00:00Z', 'approve', 89, 82, 'low'),
('wf-app-009', 'WF-2026-009', 'wf-biz-098', 'Valley Fresh Produce', 'submitted', 'Cold Storage Expansion', 720000, '2026-02-07T13:15:00Z', 'approve', 88, 81, 'low'),
('wf-app-010', 'WF-2026-010', 'wf-biz-108', 'Bay Area Cloud Solutions', 'under_review', 'Growth Capital', 620000, '2026-02-09T15:30:00Z', 'approve', 87, 81, 'low'),
('wf-app-011', 'WF-2026-011', 'wf-biz-118', 'Bay Area AI Labs', 'submitted', 'Series A Bridge', 850000, '2026-02-10T10:45:00Z', 'approve', 90, 82, 'low')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  ai_recommendation = EXCLUDED.ai_recommendation,
  confidence = EXCLUDED.confidence,
  composite_score = EXCLUDED.composite_score;

-- ══════════════════════════════════════════════════════════════════════════════
-- CREDIT SCORES & SIGNALS
-- ══════════════════════════════════════════════════════════════════════════════

-- Credit scores for first 20 businesses (sample)
INSERT INTO credit_scores (business_id, source, score, risk_class, factors, pulled_at) VALUES
('wf-biz-001', 'experian_biz', 820, 'low', ARRAY['Excellent payment history','Strong financial statements','Mature business profile','Low debt ratio'], '2026-02-11T14:00:00Z'),
('wf-biz-002', 'experian_biz', 790, 'low', ARRAY['Strong payment record','Good cash reserves','Industry stability','Moderate leverage'], '2026-02-10T09:00:00Z'),
('wf-biz-003', 'experian_biz', 840, 'low', ARRAY['Exceptional payment history','Very strong financials','Long operating history','Excellent collateral'], '2026-02-09T11:00:00Z'),
('wf-biz-004', 'experian_biz', 740, 'low', ARRAY['Good payment history','Adequate cash flow','Growth trajectory','Moderate utilization'], '2026-02-11T10:00:00Z'),
('wf-biz-005', 'experian_biz', 760, 'low', ARRAY['Consistent payment patterns','Good financial strength','Established trade lines','Stable revenue'], '2026-02-10T13:00:00Z'),
('wf-biz-006', 'experian_biz', 770, 'low', ARRAY['Strong payment history','Good asset base','Industry leader','Low risk profile'], '2026-02-09T15:00:00Z'),
('wf-biz-007', 'experian_biz', 800, 'low', ARRAY['Excellent track record','Strong cash position','Mature business','Diversified customer base'], '2026-02-11T09:00:00Z'),
('wf-biz-008', 'experian_biz', 750, 'low', ARRAY['Good payment patterns','Adequate liquidity','Growth stage','Moderate debt'], '2026-02-10T14:00:00Z'),
('wf-biz-009', 'experian_biz', 780, 'low', ARRAY['Strong payment history','Good financial position','Established operations','Low leverage'], '2026-02-09T10:00:00Z'),
('wf-biz-010', 'experian_biz', 760, 'low', ARRAY['Consistent payments','Good cash flow','Stable industry','Moderate growth'], '2026-02-11T11:00:00Z'),
('wf-biz-020', 'dun_bradstreet', 780, 'low', ARRAY['Strong payment history','Good PAYDEX','Established business','Low industry risk'], '2026-02-11T10:00:00Z'),
('wf-biz-022', 'experian_biz', 810, 'low', ARRAY['Excellent payment record','Strong fleet assets','Long operating history','Low default risk'], '2026-02-09T12:00:00Z'),
('wf-biz-037', 'experian_biz', 820, 'low', ARRAY['Exceptional payment history','Very strong financials','Industry leader','Excellent collateral'], '2026-02-11T13:00:00Z'),
('wf-biz-049', 'experian_biz', 830, 'low', ARRAY['Outstanding payment record','Excellent financials','Strong growth','Low risk'], '2026-02-11T14:30:00Z'),
('wf-biz-060', 'dun_bradstreet', 790, 'low', ARRAY['Strong payment patterns','Good inventory management','Established brand','Low leverage'], '2026-02-10T11:00:00Z'),
('wf-biz-088', 'experian_biz', 790, 'low', ARRAY['Strong payment history','Good equipment value','Stable cash flow','Moderate growth'], '2026-02-11T10:30:00Z'),
('wf-biz-098', 'experian_biz', 780, 'low', ARRAY['Good payment record','Strong land assets','Established operations','Seasonal variability'], '2026-02-09T09:00:00Z'),
('wf-biz-108', 'experian_biz', 780, 'low', ARRAY['Good payment history','Strong growth trajectory','Modern operations','Moderate debt'], '2026-02-11T15:00:00Z'),
('wf-biz-118', 'experian_biz', 790, 'low', ARRAY['Strong payment record','High growth potential','VC backing','Moderate risk'], '2026-02-11T16:00:00Z'),
('wf-biz-037', 'equifax_biz', 825, 'low', ARRAY['Exceptional commercial credit','Strong trade references','Long payment history','Industry leader'], '2026-02-10T10:00:00Z')
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════════════
-- RISK & MONITORING
-- ══════════════════════════════════════════════════════════════════════════════

-- EWS Alerts (10 alerts across portfolio)
INSERT INTO ews_alerts (business_id, alert_type, severity, description, detected_at) VALUES
('wf-biz-056', 'score_decline', 'medium', 'Experian BizID dropped 18 points in 60 days', '2026-02-08T10:00:00Z'),
('wf-biz-058', 'low_balance', 'medium', 'Cash balance dropped below $150K threshold', '2026-02-06T10:00:00Z'),
('wf-biz-067', 'score_decline', 'high', 'D&B PAYDEX dropped below 680 — payment deterioration', '2026-02-05T10:00:00Z'),
('wf-biz-073', 'utilization_spike', 'medium', 'Credit utilization exceeded 85% on LOC', '2026-02-09T10:00:00Z'),
('wf-biz-087', 'late_payment', 'medium', 'Payment 12 days late on equipment lease', '2026-02-07T10:00:00Z'),
('wf-biz-100', 'revenue_decline', 'medium', 'YoY revenue down 22% per deposit analysis', '2026-02-10T10:00:00Z'),
('wf-biz-109', 'delinquency', 'high', 'Trade payment 45+ days past due reported', '2026-02-06T10:00:00Z'),
('wf-biz-112', 'score_decline', 'medium', 'Bureau score trending down over 90 days', '2026-02-08T10:00:00Z'),
('wf-biz-115', 'volatility', 'low', 'Cash flow volatility increased above normal range', '2026-02-09T10:00:00Z'),
('wf-biz-119', 'utilization_spike', 'medium', 'Credit utilization jumped from 45% to 82%', '2026-02-11T10:00:00Z')
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════════════
-- PORTFOLIO ANALYTICS
-- ══════════════════════════════════════════════════════════════════════════════

-- KPIs (Wells Fargo portfolio metrics)
INSERT INTO portfolio_kpis (id, label, value, format, trend, trend_direction, is_positive_trend, tooltip, data_source, last_updated) VALUES
('wf-avg-score','Avg Risk Indicator',77.80,'score',2.80,'up',true,'Exposure-weighted average risk indicator across Wells Fargo portfolio','LUMIQ AI Signal Engine','3 mins ago'),
('wf-signal-momentum','Signal Momentum (90d)',3.20,'percent',0.80,'up',true,'Average signal change over last 90 days (stronger than Chase)','LUMIQ AI Signal Engine','3 mins ago'),
('wf-improving-clients','% Improving Clients',41.50,'percent',5.20,'up',true,'Clients with signal improvement in 90d (construction/ag strength)','Portfolio Analytics','5 mins ago'),
('wf-deteriorating-clients','% Deteriorating Clients',9.80,'percent',-2.10,'down',true,'Clients with signal deterioration in 90d (lower than Chase)','Portfolio Analytics','5 mins ago'),
('wf-volatility-index','Portfolio Volatility',7.20,'number',-0.60,'down',true,'Standard deviation of signal changes (stable ag/construction base)','Risk Analytics','1 hour ago'),
('wf-risk-index','Exp-Weighted Risk Index',21.40,'score',-2.80,'down',true,'Exposure-weighted aggregate risk metric (improving)','Risk Engine','15 mins ago')
ON CONFLICT (id) DO UPDATE SET
  value = EXCLUDED.value,
  trend = EXCLUDED.trend,
  trend_direction = EXCLUDED.trend_direction,
  last_updated = EXCLUDED.last_updated;

-- Score distribution (Wells Fargo)
INSERT INTO score_distribution (range_label, min_score, max_score, count, percent, exposure) VALUES
('0–50', 0, 50, 3300, 2.75, 28000000),
('51–65', 51, 65, 13200, 11.00, 145000000),
('66–75', 66, 75, 36300, 30.25, 520000000),
('76–85', 76, 85, 46200, 38.50, 820000000),
('86–100', 86, 100, 21120, 17.60, 487000000)
ON CONFLICT DO NOTHING;

-- Risk drivers (Wells Fargo-specific)
INSERT INTO risk_drivers (id, name, impact, trend, affected_clients, severity, description) VALUES
('wf-rd-1','Agricultural Volatility',24,'stable',3850,'medium','Commodity price fluctuations affecting ag customers (mitigated by WF expertise)'),
('wf-rd-2','Construction Cycle',22,'decreasing',4620,'medium','Commercial construction slowdown in select markets'),
('wf-rd-3','Bureau Score Changes',18,'stable',2970,'medium','Commercial bureau score movements from D&B, Experian, Equifax'),
('wf-rd-4','Regional Concentration',16,'stable',2640,'low','West/Southeast geographic concentration (diversified within regions)'),
('wf-rd-5','Utilization Spikes',14,'increasing',2310,'medium','Credit line utilization exceeding 80% threshold')
ON CONFLICT (id) DO UPDATE SET
  impact = EXCLUDED.impact,
  trend = EXCLUDED.trend,
  affected_clients = EXCLUDED.affected_clients,
  severity = EXCLUDED.severity,
  description = EXCLUDED.description;

-- Pilot metrics (Wells Fargo)
INSERT INTO pilot_metrics (
  tenant_id, total_businesses, scored_businesses, score_coverage,
  pre_qualified_businesses, pre_qual_rate, applications_started, application_conversion,
  approved, approval_rate, funded, funding_rate, ineligible,
  avg_lumiq_score, median_lumiq_score,
  total_api_calls, daily_avg_calls, success_rate, avg_latency_ms, p99_latency_ms, error_count,
  avg_prequal_limit, projected_originations, avg_revenue_per_business, projected_annual_revenue,
  delinquency_rate, default_rate, portfolio_utilization,
  mom_growth, qoq_growth, avg_time_to_approval
) VALUES (
  'WF-001', 120000, 99600, 83.00,
  34800, 35.00, 8280, 23.80,
  6600, 79.70, 6072, 92.00, 18600,
  77, 79,
  8820000, 58800, 99.960, 138, 362, 3528,
  142000, 862000000, 5850, 17745000,
  1.40, 0.30, 65.80,
  15.20, 42.50, 2.10
)
ON CONFLICT (tenant_id) DO UPDATE SET
  total_businesses = EXCLUDED.total_businesses,
  scored_businesses = EXCLUDED.scored_businesses,
  score_coverage = EXCLUDED.score_coverage,
  pre_qualified_businesses = EXCLUDED.pre_qualified_businesses,
  pre_qual_rate = EXCLUDED.pre_qual_rate,
  applications_started = EXCLUDED.applications_started,
  application_conversion = EXCLUDED.application_conversion,
  approved = EXCLUDED.approved,
  approval_rate = EXCLUDED.approval_rate,
  funded = EXCLUDED.funded,
  funding_rate = EXCLUDED.funding_rate,
  ineligible = EXCLUDED.ineligible,
  avg_lumiq_score = EXCLUDED.avg_lumiq_score,
  median_lumiq_score = EXCLUDED.median_lumiq_score,
  total_api_calls = EXCLUDED.total_api_calls,
  daily_avg_calls = EXCLUDED.daily_avg_calls,
  success_rate = EXCLUDED.success_rate,
  avg_latency_ms = EXCLUDED.avg_latency_ms,
  p99_latency_ms = EXCLUDED.p99_latency_ms,
  error_count = EXCLUDED.error_count,
  avg_prequal_limit = EXCLUDED.avg_prequal_limit,
  projected_originations = EXCLUDED.projected_originations,
  avg_revenue_per_business = EXCLUDED.avg_revenue_per_business,
  projected_annual_revenue = EXCLUDED.projected_annual_revenue,
  delinquency_rate = EXCLUDED.delinquency_rate,
  default_rate = EXCLUDED.default_rate,
  portfolio_utilization = EXCLUDED.portfolio_utilization,
  mom_growth = EXCLUDED.mom_growth,
  qoq_growth = EXCLUDED.qoq_growth,
  avg_time_to_approval = EXCLUDED.avg_time_to_approval;

-- ══════════════════════════════════════════════════════════════════════════════
-- INTEGRATIONS & AUDIT
-- ══════════════════════════════════════════════════════════════════════════════

-- API Keys
INSERT INTO api_keys (id, tenant_id, name, key_masked, environment, scopes, created_at, last_used, status, created_by) VALUES
('wf-key-001','WF-001','Production API Key','wf_live_****************************1234','production',ARRAY['read:scores','read:businesses','write:webhooks'],'2025-11-01T00:00:00Z','2026-02-11T14:30:00Z','active','jennifer.martinez@wellsfargo.com'),
('wf-key-002','WF-001','Sandbox Test Key','wf_test_****************************5678','sandbox',ARRAY['read:scores','read:businesses','write:webhooks','read:pii'],'2025-11-05T00:00:00Z','2026-02-11T10:00:00Z','active','david.chen@wellsfargo.com'),
('wf-key-003','WF-001','Risk Analytics Key','wf_live_****************************9012','production',ARRAY['read:scores','read:risk','read:ews'],'2025-11-15T00:00:00Z','2026-02-10T16:00:00Z','active','sarah.johnson@wellsfargo.com')
ON CONFLICT (id) DO UPDATE SET
  last_used = EXCLUDED.last_used,
  status = EXCLUDED.status;

-- Audit logs (sample 10)
INSERT INTO audit_logs (id, tenant_id, user_email, action, resource, timestamp, ip) VALUES
('wf-log-001','WF-001','jennifer.martinez@wellsfargo.com','user.created','emily.patel@wellsfargo.com','2026-02-11T14:30:00Z','10.12.45.100'),
('wf-log-002','WF-001','david.chen@wellsfargo.com','api_key.created','Sandbox Test Key','2026-02-11T12:00:00Z','10.12.45.105'),
('wf-log-003','WF-001','sarah.johnson@wellsfargo.com','customer.viewed','Business: Ironclad Construction Co (wf-biz-001)','2026-02-11T11:45:00Z','10.12.45.110'),
('wf-log-004','WF-001','sarah.johnson@wellsfargo.com','report.exported','Credit Intelligence Dossier — Ironclad Construction','2026-02-11T11:42:00Z','10.12.45.110'),
('wf-log-005','WF-001','jennifer.martinez@wellsfargo.com','settings.updated','Early Warning Signal Thresholds','2026-02-11T10:15:00Z','10.12.45.100'),
('wf-log-006','WF-001','michael.torres@wellsfargo.com','customer.viewed','Business: Pacific Coast Freight (wf-biz-022)','2026-02-11T09:30:00Z','10.12.45.115'),
('wf-log-007','WF-001','sarah.johnson@wellsfargo.com','report.exported','Portfolio Risk Summary — Q1-2026','2026-02-10T16:20:00Z','10.12.45.110'),
('wf-log-008','WF-001','david.chen@wellsfargo.com','settings.updated','Webhook endpoint configuration','2026-02-10T14:00:00Z','10.12.45.105'),
('wf-log-009','WF-001','jennifer.martinez@wellsfargo.com','role.updated','Risk Analyst — added PII access','2026-02-10T11:30:00Z','10.12.45.100'),
('wf-log-010','WF-001','michael.torres@wellsfargo.com','customer.viewed','Business: Texas Cybersecurity Group (wf-biz-110)','2026-02-10T09:15:00Z','10.12.45.115')
ON CONFLICT (id) DO UPDATE SET
  action = EXCLUDED.action,
  resource = EXCLUDED.resource,
  timestamp = EXCLUDED.timestamp;

-- Data sources
INSERT INTO data_sources (id, tenant_id, name, type, status, last_sync, error_rate) VALUES
('wf-ds-001','WF-001','Plaid','aggregator','connected','2026-02-11T14:00:00Z',0.15),
('wf-ds-002','WF-001','MX','aggregator','connected','2026-02-11T13:45:00Z',0.45),
('wf-ds-003','WF-001','Experian','bureau','connected','2026-02-11T12:00:00Z',0.08),
('wf-ds-004','WF-001','Equifax','bureau','connected','2026-02-11T11:30:00Z',0.25),
('wf-ds-005','WF-001','Dun & Bradstreet','bureau','connected','2026-02-11T10:00:00Z',0.12),
('wf-ds-006','WF-001','QuickBooks','accounting','connected','2026-02-11T09:00:00Z',0.65),
('wf-ds-007','WF-001','Xero','accounting','connected','2026-02-11T10:30:00Z',0.78)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  last_sync = EXCLUDED.last_sync,
  error_rate = EXCLUDED.error_rate;

-- Model versions
INSERT INTO model_versions (id, tenant_id, name, version, status, validated_on, notes) VALUES
('wf-model-001','WF-001','LUMIQ AI Signal Engine','v3.3.2','active','2026-02-01T00:00:00Z','Production model with enhanced construction/ag features for Wells Fargo'),
('wf-model-002','WF-001','LUMIQ AI Signal Engine','v3.2.1','deprecated','2026-01-10T00:00:00Z','Previous stable version'),
('wf-model-003','WF-001','Early Warning System','v2.1.0','active','2026-01-20T00:00:00Z','Enhanced deterioration detection for ag/construction volatility'),
('wf-model-004','WF-001','Cross-sell Propensity — Ag','v1.2.0','testing','2026-02-08T00:00:00Z','Agricultural banking product propensity model (A/B testing)')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  validated_on = EXCLUDED.validated_on,
  notes = EXCLUDED.notes;

-- System services
INSERT INTO system_services (tenant_id, name, status, latency_ms, uptime_pct, last_check) VALUES
('WF-001', 'Core API', 'operational', 42, 99.995, '1m ago'),
('WF-001', 'Score Engine', 'operational', 135, 99.980, '1m ago'),
('WF-001', 'Bureau Gateway', 'operational', 228, 99.960, '1m ago'),
('WF-001', 'Webhook Delivery', 'operational', 82, 99.930, '1m ago'),
('WF-001', 'Authentication', 'operational', 24, 99.995, '1m ago')
ON CONFLICT DO NOTHING;

-- Webhook events
INSERT INTO webhook_events (tenant_id, event_type, status, endpoint, timestamp_ago, response_time) VALUES
('WF-001', 'score.updated', 'delivered', 'https://api.wellsfargo.com/webhooks/lumiq', '3m ago', 82),
('WF-001', 'prequal.matched', 'delivered', 'https://api.wellsfargo.com/webhooks/lumiq', '12m ago', 118),
('WF-001', 'application.approved', 'delivered', 'https://api.wellsfargo.com/webhooks/lumiq', '24m ago', 92),
('WF-001', 'risk.alert', 'delivered', 'https://api.wellsfargo.com/webhooks/lumiq', '35m ago', 105)
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- END WELLS FARGO SEED
-- ============================================================================
