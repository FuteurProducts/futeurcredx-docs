-- ============================================================================
-- LUMIQ AI Dashboard — PostgreSQL Seed Data
-- ============================================================================
-- Usage:
--   psql -U <user> -d <database> -f database/seed.sql
--
-- This file creates the complete schema and inserts all demo/mock data
-- that the LUMIQ AI Dashboard frontend displays.
-- ============================================================================

BEGIN;

-- ── Drop existing tables (reverse dependency order) ─────────────────────────

DROP TABLE IF EXISTS generated_reports CASCADE;
DROP TABLE IF EXISTS report_templates CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS model_versions CASCADE;
DROP TABLE IF EXISTS data_sources CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS system_services CASCADE;
DROP TABLE IF EXISTS ews_alerts CASCADE;
DROP TABLE IF EXISTS activity_history CASCADE;
DROP TABLE IF EXISTS product_readiness CASCADE;
DROP TABLE IF EXISTS bureau_indicators CASCADE;
DROP TABLE IF EXISTS credit_signals CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS prequal_offers CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS credit_scores CASCADE;
DROP TABLE IF EXISTS business_owners CASCADE;
DROP TABLE IF EXISTS portfolio_businesses CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS portfolio_kpis CASCADE;
DROP TABLE IF EXISTS score_distribution CASCADE;
DROP TABLE IF EXISTS risk_drivers CASCADE;
DROP TABLE IF EXISTS pilot_metrics CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS platform_users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- ── Drop existing enums ─────────────────────────────────────────────────────

DROP TYPE IF EXISTS risk_tier CASCADE;
DROP TYPE IF EXISTS segment CASCADE;
DROP TYPE IF EXISTS score_trend CASCADE;
DROP TYPE IF EXISTS relationship_stage CASCADE;
DROP TYPE IF EXISTS score_source CASCADE;
DROP TYPE IF EXISTS risk_class CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS ai_recommendation CASCADE;
DROP TYPE IF EXISTS prequal_status CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS signal_status_enum CASCADE;
DROP TYPE IF EXISTS signal_direction CASCADE;
DROP TYPE IF EXISTS product_readiness_level CASCADE;
DROP TYPE IF EXISTS trajectory_sentiment CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;
DROP TYPE IF EXISTS service_status CASCADE;
DROP TYPE IF EXISTS webhook_delivery_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS api_key_status CASCADE;
DROP TYPE IF EXISTS api_key_environment CASCADE;
DROP TYPE IF EXISTS data_source_type CASCADE;
DROP TYPE IF EXISTS data_source_status CASCADE;
DROP TYPE IF EXISTS model_status CASCADE;
DROP TYPE IF EXISTS report_category CASCADE;
DROP TYPE IF EXISTS report_format CASCADE;
DROP TYPE IF EXISTS generated_report_status CASCADE;
DROP TYPE IF EXISTS kpi_format CASCADE;
DROP TYPE IF EXISTS kpi_trend_direction CASCADE;
DROP TYPE IF EXISTS risk_driver_trend CASCADE;
DROP TYPE IF EXISTS risk_driver_severity CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TYPE risk_tier AS ENUM ('low', 'medium', 'high');
CREATE TYPE segment AS ENUM ('micro', 'small', 'mid-market');
CREATE TYPE score_trend AS ENUM ('up', 'down', 'stable');
CREATE TYPE relationship_stage AS ENUM ('prospect', 'new', 'onboarding', 'growing', 'active', 'mature', 'expansion', 'at-risk');
CREATE TYPE score_source AS ENUM ('experian_biz', 'dun_bradstreet', 'equifax_biz');
CREATE TYPE risk_class AS ENUM ('low', 'moderate', 'high', 'very_high');
CREATE TYPE application_status AS ENUM ('submitted', 'under_review', 'approved', 'declined', 'funded');
CREATE TYPE ai_recommendation AS ENUM ('approve', 'review', 'decline');
CREATE TYPE prequal_status AS ENUM ('active', 'expired', 'accepted');
CREATE TYPE product_status AS ENUM ('active', 'pending', 'closed');
CREATE TYPE signal_status_enum AS ENUM ('strong', 'stable', 'weak');
CREATE TYPE signal_direction AS ENUM ('improving', 'stable', 'worsening');
CREATE TYPE product_readiness_level AS ENUM ('likely', 'borderline', 'unlikely');
CREATE TYPE trajectory_sentiment AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE activity_type AS ENUM ('score_pull', 'application', 'approval', 'prequal', 'payment', 'alert');
CREATE TYPE service_status AS ENUM ('operational', 'degraded', 'down');
CREATE TYPE webhook_delivery_status AS ENUM ('delivered', 'failed', 'pending');
CREATE TYPE user_role AS ENUM ('admin', 'developer', 'risk', 'rm', 'readonly');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended');
CREATE TYPE api_key_status AS ENUM ('active', 'revoked');
CREATE TYPE api_key_environment AS ENUM ('production', 'sandbox');
CREATE TYPE data_source_type AS ENUM ('aggregator', 'bureau', 'accounting');
CREATE TYPE data_source_status AS ENUM ('connected', 'disconnected', 'error');
CREATE TYPE model_status AS ENUM ('active', 'deprecated', 'testing');
CREATE TYPE report_category AS ENUM ('portfolio', 'underwriting', 'customer', 'compliance', 'api');
CREATE TYPE report_format AS ENUM ('pdf', 'csv', 'xlsx');
CREATE TYPE generated_report_status AS ENUM ('ready', 'processing', 'failed');
CREATE TYPE kpi_format AS ENUM ('score', 'percent', 'number');
CREATE TYPE kpi_trend_direction AS ENUM ('up', 'down');
CREATE TYPE risk_driver_trend AS ENUM ('increasing', 'stable', 'decreasing');
CREATE TYPE risk_driver_severity AS ENUM ('low', 'medium', 'high');

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE DEFINITIONS
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. tenants
CREATE TABLE tenants (
    id          TEXT PRIMARY KEY,
    bank_name   TEXT NOT NULL,
    pilot_start DATE NOT NULL,
    pilot_end   DATE NOT NULL,
    pilot_duration_days INT NOT NULL,
    environment TEXT NOT NULL DEFAULT 'sandbox',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. portfolios
CREATE TABLE portfolios (
    id          TEXT PRIMARY KEY,
    tenant_id   TEXT NOT NULL REFERENCES tenants(id),
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. platform_users
CREATE TABLE platform_users (
    id                    TEXT PRIMARY KEY,
    tenant_id             TEXT NOT NULL REFERENCES tenants(id),
    name                  TEXT NOT NULL,
    email                 TEXT NOT NULL UNIQUE,
    role                  user_role NOT NULL,
    status                user_status NOT NULL DEFAULT 'pending',
    last_login            TIMESTAMPTZ,
    mfa_enabled           BOOLEAN NOT NULL DEFAULT false,
    portfolio_access      TEXT[] NOT NULL DEFAULT '{}',
    allow_exports         BOOLEAN NOT NULL DEFAULT false,
    allow_api_key_creation BOOLEAN NOT NULL DEFAULT false,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. businesses
CREATE TABLE businesses (
    id                  TEXT PRIMARY KEY,
    tenant_id           TEXT NOT NULL REFERENCES tenants(id),
    name                TEXT NOT NULL,
    legal_name          TEXT NOT NULL,
    industry            TEXT NOT NULL,
    naics_code          TEXT,
    city                TEXT,
    state               TEXT,
    annual_revenue      NUMERIC(15,2),
    employee_count      INT,
    years_in_business   INT,
    lumiq_score         INT,
    owner_fico          INT,
    risk_tier           risk_tier,
    score_trend         score_trend,
    trend_value         INT DEFAULT 0,
    segment             segment,
    has_active_application BOOLEAN DEFAULT false,
    product_type        TEXT,
    application_amount  NUMERIC(15,2),
    -- Customer engagement fields
    region              TEXT,
    relationship_stage  relationship_stage,
    rhs                 INT,
    rhs_change          INT DEFAULT 0,
    primary_product     TEXT,
    assigned_rm         TEXT,
    deposit_balance     NUMERIC(15,2) DEFAULT 0,
    total_exposure      NUMERIC(15,2) DEFAULT 0,
    product_count       INT DEFAULT 0,
    last_activity       DATE,
    phone               TEXT,
    email               TEXT,
    website             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_tenant ON businesses(tenant_id);
CREATE INDEX idx_businesses_risk_tier ON businesses(risk_tier);
CREATE INDEX idx_businesses_segment ON businesses(segment);
CREATE INDEX idx_businesses_region ON businesses(region);

-- 5. portfolio_businesses
CREATE TABLE portfolio_businesses (
    portfolio_id TEXT NOT NULL REFERENCES portfolios(id),
    business_id  TEXT NOT NULL REFERENCES businesses(id),
    added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (portfolio_id, business_id)
);

-- 6. business_owners
CREATE TABLE business_owners (
    id              SERIAL PRIMARY KEY,
    business_id     TEXT NOT NULL REFERENCES businesses(id),
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    title           TEXT,
    email           TEXT,
    phone           TEXT,
    ownership_pct   NUMERIC(5,2),
    fico_score      INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_owners_business ON business_owners(business_id);

-- 7. credit_scores
CREATE TABLE credit_scores (
    id          SERIAL PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id),
    source      score_source NOT NULL,
    score       INT NOT NULL,
    risk_class  risk_class NOT NULL,
    factors     TEXT[] NOT NULL DEFAULT '{}',
    pulled_at   TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_credit_scores_business ON credit_scores(business_id);

-- 8. applications
CREATE TABLE applications (
    id                TEXT PRIMARY KEY,
    app_id            TEXT NOT NULL UNIQUE,
    business_id       TEXT NOT NULL REFERENCES businesses(id),
    business_name     TEXT NOT NULL,
    status            application_status NOT NULL,
    product_type      TEXT NOT NULL,
    amount            NUMERIC(15,2) NOT NULL,
    submitted_at      TIMESTAMPTZ NOT NULL,
    ai_recommendation ai_recommendation,
    confidence        NUMERIC(5,2),
    composite_score   INT,
    risk_tier         risk_tier,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_business ON applications(business_id);
CREATE INDEX idx_applications_status ON applications(status);

-- 9. prequal_offers
CREATE TABLE prequal_offers (
    id           SERIAL PRIMARY KEY,
    business_id  TEXT NOT NULL REFERENCES businesses(id),
    product_type TEXT NOT NULL,
    amount_min   NUMERIC(15,2) NOT NULL,
    amount_max   NUMERIC(15,2) NOT NULL,
    rate_range   TEXT,
    status       prequal_status NOT NULL DEFAULT 'active',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prequal_business ON prequal_offers(business_id);

-- 10. products
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id),
    name        TEXT NOT NULL,
    type        TEXT NOT NULL,
    status      product_status NOT NULL DEFAULT 'active',
    balance     NUMERIC(15,2),
    credit_limit NUMERIC(15,2),
    opened_date DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_business ON products(business_id);

-- 11. credit_signals
CREATE TABLE credit_signals (
    id           TEXT NOT NULL,
    business_id  TEXT NOT NULL REFERENCES businesses(id),
    name         TEXT NOT NULL,
    category     TEXT NOT NULL,
    status       signal_status_enum NOT NULL,
    direction    signal_direction NOT NULL,
    detail       TEXT,
    source       TEXT,
    last_updated TIMESTAMPTZ,
    PRIMARY KEY (business_id, id)
);

-- 12. bureau_indicators
CREATE TABLE bureau_indicators (
    id              TEXT NOT NULL,
    business_id     TEXT NOT NULL REFERENCES businesses(id),
    name            TEXT NOT NULL,
    provider        TEXT NOT NULL,
    value           TEXT NOT NULL,
    interpretation  TEXT,
    as_of_date      DATE,
    PRIMARY KEY (business_id, id)
);

-- 13. product_readiness
CREATE TABLE product_readiness (
    id                SERIAL PRIMARY KEY,
    business_id       TEXT NOT NULL REFERENCES businesses(id),
    product_id        TEXT NOT NULL,
    product_name      TEXT NOT NULL,
    facility_size     TEXT,
    readiness         product_readiness_level NOT NULL,
    qualifying_signal TEXT,
    concern           TEXT
);

CREATE INDEX idx_product_readiness_business ON product_readiness(business_id);

-- 14. activity_history
CREATE TABLE activity_history (
    id          SERIAL PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id),
    event_date  DATE NOT NULL,
    type        activity_type NOT NULL,
    description TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_business ON activity_history(business_id);

-- 15. ews_alerts
CREATE TABLE ews_alerts (
    id          SERIAL PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id),
    alert_type  TEXT NOT NULL,
    severity    TEXT NOT NULL,
    description TEXT NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. system_services
CREATE TABLE system_services (
    id          SERIAL PRIMARY KEY,
    tenant_id   TEXT NOT NULL REFERENCES tenants(id),
    name        TEXT NOT NULL,
    status      service_status NOT NULL,
    latency_ms  INT,
    uptime_pct  NUMERIC(6,3),
    last_check  TEXT
);

-- 17. webhook_events
CREATE TABLE webhook_events (
    id            SERIAL PRIMARY KEY,
    tenant_id     TEXT NOT NULL REFERENCES tenants(id),
    event_type    TEXT NOT NULL,
    status        webhook_delivery_status NOT NULL,
    endpoint      TEXT NOT NULL,
    timestamp_ago TEXT,
    response_time INT
);

-- 18. api_keys
CREATE TABLE api_keys (
    id          TEXT PRIMARY KEY,
    tenant_id   TEXT NOT NULL REFERENCES tenants(id),
    name        TEXT NOT NULL,
    key_masked  TEXT NOT NULL,
    environment api_key_environment NOT NULL,
    scopes      TEXT[] NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL,
    last_used   TIMESTAMPTZ,
    status      api_key_status NOT NULL DEFAULT 'active',
    created_by  TEXT NOT NULL
);

-- 19. audit_logs
CREATE TABLE audit_logs (
    id        TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id),
    user_email TEXT NOT NULL,
    action    TEXT NOT NULL,
    resource  TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    ip        TEXT
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- 20. report_templates
CREATE TABLE report_templates (
    id                TEXT PRIMARY KEY,
    name              TEXT NOT NULL,
    category          report_category NOT NULL,
    description       TEXT,
    supported_formats report_format[] NOT NULL,
    default_format    report_format NOT NULL,
    options           JSONB NOT NULL DEFAULT '[]'
);

-- 21. generated_reports
CREATE TABLE generated_reports (
    id            TEXT PRIMARY KEY,
    template_id   TEXT NOT NULL REFERENCES report_templates(id),
    name          TEXT NOT NULL,
    format        report_format NOT NULL,
    scope         TEXT,
    period        TEXT,
    status        generated_report_status NOT NULL,
    generated_at  TIMESTAMPTZ NOT NULL,
    generated_by  TEXT NOT NULL,
    file_size     TEXT,
    download_url  TEXT,
    metadata      JSONB
);

-- 22. portfolio_kpis
CREATE TABLE portfolio_kpis (
    id              TEXT PRIMARY KEY,
    label           TEXT NOT NULL,
    value           NUMERIC(12,2) NOT NULL,
    format          kpi_format NOT NULL,
    trend           NUMERIC(8,2),
    trend_direction kpi_trend_direction NOT NULL,
    is_positive_trend BOOLEAN NOT NULL DEFAULT true,
    tooltip         TEXT,
    data_source     TEXT,
    last_updated    TEXT
);

-- 23. score_distribution
CREATE TABLE score_distribution (
    id       SERIAL PRIMARY KEY,
    range_label TEXT NOT NULL,
    min_score   INT NOT NULL,
    max_score   INT NOT NULL,
    count       INT NOT NULL,
    percent     NUMERIC(5,2) NOT NULL,
    exposure    NUMERIC(15,2) NOT NULL
);

-- 24. risk_drivers
CREATE TABLE risk_drivers (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    impact           INT NOT NULL,
    trend            risk_driver_trend NOT NULL,
    affected_clients INT NOT NULL,
    severity         risk_driver_severity NOT NULL,
    description      TEXT
);

-- 25. pilot_metrics
CREATE TABLE pilot_metrics (
    id                       SERIAL PRIMARY KEY,
    tenant_id                TEXT NOT NULL REFERENCES tenants(id),
    total_businesses         INT,
    scored_businesses        INT,
    score_coverage           NUMERIC(5,2),
    pre_qualified_businesses INT,
    pre_qual_rate            NUMERIC(5,2),
    applications_started     INT,
    application_conversion   NUMERIC(5,2),
    approved                 INT,
    approval_rate            NUMERIC(5,2),
    funded                   INT,
    funding_rate             NUMERIC(5,2),
    ineligible               INT,
    avg_lumiq_score          INT,
    median_lumiq_score       INT,
    total_api_calls          BIGINT,
    daily_avg_calls          INT,
    success_rate             NUMERIC(6,3),
    avg_latency_ms           INT,
    p99_latency_ms           INT,
    error_count              INT,
    avg_prequal_limit        INT,
    projected_originations   BIGINT,
    avg_revenue_per_business INT,
    projected_annual_revenue BIGINT,
    delinquency_rate         NUMERIC(5,2),
    default_rate             NUMERIC(5,2),
    portfolio_utilization    NUMERIC(5,2),
    mom_growth               NUMERIC(5,2),
    qoq_growth               NUMERIC(5,2),
    avg_time_to_approval     NUMERIC(5,2),
    snapshot_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 26. data_sources
CREATE TABLE data_sources (
    id         TEXT PRIMARY KEY,
    tenant_id  TEXT NOT NULL REFERENCES tenants(id),
    name       TEXT NOT NULL,
    type       data_source_type NOT NULL,
    status     data_source_status NOT NULL,
    last_sync  TIMESTAMPTZ,
    error_rate NUMERIC(6,2) DEFAULT 0
);

-- 27. model_versions
CREATE TABLE model_versions (
    id           TEXT PRIMARY KEY,
    tenant_id    TEXT NOT NULL REFERENCES tenants(id),
    name         TEXT NOT NULL,
    version      TEXT NOT NULL,
    status       model_status NOT NULL,
    validated_on TIMESTAMPTZ,
    notes        TEXT
);

-- ══════════════════════════════════════════════════════════════════════════════
-- INSERT DATA
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. tenants ──────────────────────────────────────────────────────────────

INSERT INTO tenants (id, bank_name, pilot_start, pilot_end, pilot_duration_days, environment)
VALUES ('BANK-001', 'Partner Bank', '2025-10-01', '2026-01-31', 122, 'sandbox');

-- ── 2. portfolios ───────────────────────────────────────────────────────────

INSERT INTO portfolios (id, tenant_id, name)
VALUES ('portfolio-001', 'BANK-001', 'Partner Bank SMB Portfolio');

-- ── 3. platform_users ───────────────────────────────────────────────────────

INSERT INTO platform_users (id, tenant_id, name, email, role, status, last_login, mfa_enabled, portfolio_access, allow_exports, allow_api_key_creation, created_at) VALUES
('usr-001', 'BANK-001', 'John Administrator', 'john.admin@partnerbank.com', 'admin', 'active', '2024-01-15T14:30:00Z', true, ARRAY['all'], true, true, '2023-06-01T00:00:00Z'),
('usr-002', 'BANK-001', 'Sarah Developer', 'sarah.dev@partnerbank.com', 'developer', 'active', '2024-01-15T12:00:00Z', true, ARRAY['all'], true, true, '2023-08-15T00:00:00Z'),
('usr-003', 'BANK-001', 'Mike Risk Analyst', 'mike.risk@partnerbank.com', 'risk', 'active', '2024-01-14T16:45:00Z', true, ARRAY['loc','cards'], true, false, '2023-09-01T00:00:00Z'),
('usr-004', 'BANK-001', 'Lisa Relationship Manager', 'lisa.rm@partnerbank.com', 'rm', 'active', '2024-01-15T09:00:00Z', false, ARRAY['nyc-region'], true, false, '2023-10-01T00:00:00Z'),
('usr-005', 'BANK-001', 'Tom Analyst', 'tom.analyst@partnerbank.com', 'readonly', 'pending', NULL, false, ARRAY[]::TEXT[], false, false, '2024-01-10T00:00:00Z');

-- ── 4. businesses (41 rows) ────────────────────────────────────────────────

INSERT INTO businesses (id, tenant_id, name, legal_name, industry, naics_code, city, state, annual_revenue, employee_count, years_in_business, lumiq_score, owner_fico, risk_tier, score_trend, trend_value, segment, has_active_application, product_type, application_amount, region, relationship_stage, rhs, rhs_change, primary_product, assigned_rm, deposit_balance, total_exposure, product_count, last_activity, phone, email, website) VALUES
('biz-001','BANK-001','Stellar Dynamics LLC','Stellar Dynamics LLC','Technology Services','541511','Austin','TX',3400000,42,7,78,742,'low','up',3,'small',true,'Business Line of Credit',250000,'Southwest','growing',82,3,'Line of Credit','Sarah Mitchell',429400,250000,3,'2026-01-28','(512) 555-0147','jchen@stellardynamics.com','www.stellardynamics.com'),
('biz-002','BANK-001','Metro Logistics Corp','Metro Logistics Corporation','Transportation','484110','Dallas','TX',5200000,82,15,71,698,'medium','stable',0,'small',true,'Working Capital',500000,'Southwest','growing',68,0,'Fleet Card Program','David Park',198500,547200,2,'2026-01-27','(214) 555-0283','mrodriguez@metrologistics.com','www.metrologistics.com'),
('biz-003','BANK-001','Apex Construction Group','Apex Construction Group Inc.','Construction','236220','Phoenix','AZ',8100000,120,12,82,758,'low','up',4,'mid-market',true,'Equipment Financing',350000,'West','mature',86,4,'Equipment LOC','Sarah Mitchell',834000,542400,4,'2026-01-26','(602) 555-0391','rkim@apexconstruction.com','www.apexconstruction.com'),
('biz-004','BANK-001','Sunrise Healthcare Partners','Sunrise Healthcare Partners LLC','Healthcare','621111','Houston','TX',12500000,210,9,85,771,'low','up',2,'mid-market',false,NULL,NULL,'Southwest','mature',88,2,'Treasury Management','Jennifer Adams',1240000,8200,3,'2026-01-29','(713) 555-0462','dpatel@sunrisehealthcare.com','www.sunrisehealthpartners.com'),
('biz-005','BANK-001','GreenLeaf Organics','GreenLeaf Organics LLC','Agriculture & Food','111000','Fresno','CA',1800000,35,4,65,672,'medium','down',3,'micro',true,'Term Loan',75000,'West','new',62,-3,'Term Loan','David Park',34200,75000,1,'2026-01-27','(559) 555-0518','smendez@greenleaforganics.com','www.greenleaforganics.com'),
('biz-006','BANK-001','Coastal Hospitality Group','Coastal Hospitality Group Inc.','Hospitality','721110','Miami','FL',4200000,92,6,58,648,'high','down',8,'small',false,NULL,NULL,'Southeast','at-risk',42,-8,'Business Checking','Jennifer Adams',67800,0,1,'2026-01-28','(305) 555-0627','dthompson@coastalhospitality.com','www.coastalhospitalitygroup.com'),
('biz-007','BANK-001','Precision Manufacturing Co','Precision Manufacturing Company','Manufacturing','332710','Detroit','MI',9800000,175,22,76,735,'low','stable',1,'mid-market',false,NULL,NULL,'Midwest','mature',79,1,'Term Loan','Sarah Mitchell',412000,338900,3,'2026-01-25','(313) 555-0734','tmueller@precisionmfg.com','www.precisionmanufacturing.com'),
('biz-008','BANK-001','TechVenture Solutions','TechVenture Solutions Inc.','Technology','541512','San Francisco','CA',2200000,28,3,85,782,'low','up',5,'small',true,'Business Credit Card',50000,'West','new',91,5,'Business Credit Card','David Park',385000,50000,2,'2026-01-29','(415) 555-0842','skim@techventure.io','www.techventuresolutions.io'),
('biz-009','BANK-001','Urban Retail Partners','Urban Retail Partners LP','Retail','445110','Chicago','IL',950000,18,2,62,665,'high','down',4,'micro',false,NULL,NULL,'Midwest','at-risk',48,-4,'Business Checking','Jennifer Adams',18700,0,1,'2026-01-26','(312) 555-0953','mjohnson@urbanretail.com','www.urbanretailpartners.com'),
('biz-010','BANK-001','Pacific Marine Services','Pacific Marine Services LLC','Marine Services','483211','Seattle','WA',6700000,65,11,73,718,'medium','up',2,'small',false,NULL,NULL,'West','growing',74,2,'Line of Credit','Sarah Mitchell',289000,145000,2,'2026-01-28','(206) 555-1064','mwalsh@pacificmarine.com','www.pacificmarineservices.com'),
-- biz-011 to biz-020
('biz-011','BANK-001','Empire State Digital','Empire State Digital Inc.','Technology','541511','New York','NY',7200000,95,8,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'Northeast','mature',84,2,'Line of Credit','Sarah Mitchell',620000,480000,4,'2026-01-27',NULL,NULL,NULL),
('biz-012','BANK-001','Harbor Freight Logistics','Harbor Freight Logistics LLC','Transportation','484110','Boston','MA',3800000,55,14,NULL,NULL,'medium',NULL,NULL,'small',false,NULL,NULL,'Northeast','growing',71,1,'Auto Fleet','David Park',245000,320000,3,'2026-01-25',NULL,NULL,NULL),
('biz-013','BANK-001','Liberty Dental Group','Liberty Dental Group PC','Healthcare','621111','Hartford','CT',2900000,38,11,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Northeast','mature',80,0,'SBA 7(a) Loan','Jennifer Adams',310000,175000,3,'2026-01-24',NULL,NULL,NULL),
('biz-014','BANK-001','BrightPath Tutoring','BrightPath Tutoring LLC','Education Services','611710','Newark','NJ',320000,8,2,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'Northeast','new',58,2,'Business Credit Card','David Park',28000,15000,2,'2026-01-20',NULL,NULL,NULL),
('biz-015','BANK-001','Granite State Builders','Granite State Builders Inc.','Construction','236220','Manchester','NH',420000,12,5,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'Northeast','growing',66,3,'SBA Express Loan','Sarah Mitchell',42000,85000,3,'2026-01-22',NULL,NULL,NULL),
('biz-016','BANK-001','Atlantic Seafood Co','Atlantic Seafood Company LLC','Food & Beverage','311710','Providence','RI',1100000,22,18,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Northeast','mature',77,0,'Line of Credit','Jennifer Adams',165000,120000,3,'2026-01-23',NULL,NULL,NULL),
('biz-017','BANK-001','Hudson Valley Farms','Hudson Valley Farms LLC','Agriculture','111000','Albany','NY',280000,6,3,NULL,NULL,'high',NULL,NULL,'micro',false,NULL,NULL,'Northeast','prospect',45,-2,'Business Checking','David Park',12500,0,1,'2026-01-18',NULL,NULL,NULL),
('biz-018','BANK-001','Peachtree Medical Associates','Peachtree Medical Associates PA','Healthcare','621111','Atlanta','GA',6400000,78,15,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'Southeast','mature',85,1,'Commercial RE Loan','Sarah Mitchell',890000,720000,4,'2026-01-29',NULL,NULL,NULL),
('biz-019','BANK-001','Carolina BBQ Supply','Carolina BBQ Supply Inc.','Wholesale Trade','424490','Charlotte','NC',1400000,16,7,NULL,NULL,'medium',NULL,NULL,'small',false,NULL,NULL,'Southeast','growing',69,2,'Merchant Services','David Park',118000,95000,3,'2026-01-26',NULL,NULL,NULL),
('biz-020','BANK-001','Sunshine Auto Repair','Sunshine Auto Repair LLC','Automotive Services','811111','Tampa','FL',380000,9,4,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'Southeast','new',60,1,'Auto Equipment Loan','Jennifer Adams',31000,48000,2,'2026-01-21',NULL,NULL,NULL),
-- biz-021 to biz-030
('biz-021','BANK-001','Savannah Event Planners','Savannah Event Planners LLC','Event Services','561920','Savannah','GA',190000,4,1,NULL,NULL,'high',NULL,NULL,'micro',false,NULL,NULL,'Southeast','prospect',41,0,'Business Checking','David Park',8900,0,1,'2026-01-15',NULL,NULL,NULL),
('biz-022','BANK-001','Lowcountry Brewing Co','Lowcountry Brewing Company LLC','Food & Beverage','312120','Charleston','SC',2600000,32,6,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Southeast','growing',76,4,'SBA 504 Loan','Sarah Mitchell',210000,340000,4,'2026-01-28',NULL,NULL,NULL),
('biz-023','BANK-001','Magnolia Staffing','Magnolia Staffing Solutions Inc.','Staffing Services','561311','Jacksonville','FL',5800000,145,10,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'Southeast','growing',81,2,'Line of Credit','Jennifer Adams',520000,400000,3,'2026-01-27',NULL,NULL,NULL),
('biz-024','BANK-001','Palmetto Landscaping','Palmetto Landscaping LLC','Landscaping Services','561730','Raleigh','NC',450000,14,3,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'Southeast','new',57,1,'Equipment Lease','David Park',24000,35000,2,'2026-01-19',NULL,NULL,NULL),
('biz-025','BANK-001','Great Lakes Plating','Great Lakes Plating Inc.','Manufacturing','332710','Cleveland','OH',11200000,190,28,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'Midwest','mature',83,1,'Equipment Financing','Sarah Mitchell',980000,1200000,4,'2026-01-29',NULL,NULL,NULL),
('biz-026','BANK-001','Prairie Wind Energy','Prairie Wind Energy LLC','Renewable Energy','221115','Des Moines','IA',3100000,40,6,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Midwest','growing',78,3,'SBA 504 Green Loan','Jennifer Adams',275000,420000,3,'2026-01-25',NULL,NULL,NULL),
('biz-027','BANK-001','Heartland Trucking','Heartland Trucking Inc.','Transportation','484110','Milwaukee','WI',4500000,68,19,NULL,NULL,'medium',NULL,NULL,'small',false,NULL,NULL,'Midwest','at-risk',52,-5,'Fleet Financing','David Park',156000,380000,3,'2026-01-28',NULL,NULL,NULL),
('biz-028','BANK-001','Twin Cities Bakery','Twin Cities Bakery LLC','Food & Beverage','311811','Minneapolis','MN',240000,7,2,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'Midwest','new',55,0,'Merchant Services','Jennifer Adams',19000,0,2,'2026-01-17',NULL,NULL,NULL),
('biz-029','BANK-001','Buckeye Dental Labs','Buckeye Dental Laboratories Inc.','Healthcare','339116','Columbus','OH',1600000,24,9,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Midwest','growing',75,2,'SBA Express','Sarah Mitchell',148000,110000,4,'2026-01-24',NULL,NULL,NULL),
('biz-030','BANK-001','Desert Sun Solar','Desert Sun Solar Installations LLC','Construction','238220','Albuquerque','NM',2800000,36,5,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Southwest','growing',77,4,'SBA 504 Loan','David Park',195000,225000,3,'2026-01-27',NULL,NULL,NULL),
-- biz-031 to biz-041
('biz-031','BANK-001','Rio Grande Veterinary','Rio Grande Veterinary Clinic PA','Healthcare','541940','El Paso','TX',680000,11,8,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'Southwest','mature',81,1,'Commercial Mortgage','Jennifer Adams',92000,310000,3,'2026-01-23',NULL,NULL,NULL),
('biz-032','BANK-001','Lone Star Food Truck','Lone Star Food Truck LLC','Food Services','722330','San Antonio','TX',160000,3,1,NULL,NULL,'high',NULL,NULL,'micro',false,NULL,NULL,'Southwest','prospect',38,-1,'Merchant POS','David Park',6200,0,2,'2026-01-12',NULL,NULL,NULL),
('biz-033','BANK-001','Tulsa Oil Equipment','Tulsa Oil Equipment Rentals Inc.','Oil & Gas Services','213112','Tulsa','OK',8500000,110,20,NULL,NULL,'medium',NULL,NULL,'mid-market',false,NULL,NULL,'Southwest','at-risk',54,-6,'Equipment LOC','Sarah Mitchell',340000,920000,4,'2026-01-29',NULL,NULL,NULL),
('biz-034','BANK-001','Golden Gate Consulting','Golden Gate Consulting Group LLC','Management Consulting','541611','San Jose','CA',5600000,48,10,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'West','mature',87,2,'Working Capital LOC','Jennifer Adams',710000,350000,4,'2026-01-28',NULL,NULL,NULL),
('biz-035','BANK-001','Cascade Pet Care','Cascade Pet Care Inc.','Veterinary Services','541940','Portland','OR',350000,10,3,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'West','new',59,2,'SBA Microloan','David Park',22000,45000,2,'2026-01-16',NULL,NULL,NULL),
('biz-036','BANK-001','Silver State Logistics','Silver State Logistics LLC','Warehousing','493110','Las Vegas','NV',7800000,130,13,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'West','growing',80,3,'CRE Warehouse Loan','Sarah Mitchell',560000,680000,4,'2026-01-26',NULL,NULL,NULL),
('biz-037','BANK-001','Cornfield Ag Supply','Cornfield Agricultural Supply Co.','Agriculture','111000','Cedar Rapids','IA',390000,8,4,NULL,NULL,'medium',NULL,NULL,'micro',false,NULL,NULL,'Midwest','prospect',50,-1,'Business Checking','David Park',15000,0,1,'2026-01-14',NULL,NULL,NULL),
('biz-038','BANK-001','Gulf Coast Marine','Gulf Coast Marine Repair LLC','Marine Services','811490','Mobile','AL',1200000,15,9,NULL,NULL,'high',NULL,NULL,'small',false,NULL,NULL,'Southeast','at-risk',46,-7,'Equipment Loan','Jennifer Adams',45000,185000,3,'2026-01-28',NULL,NULL,NULL),
('biz-039','BANK-001','Cactus Creek Wellness','Cactus Creek Wellness Spa LLC','Health & Wellness','812199','Scottsdale','AZ',520000,12,2,NULL,NULL,'medium',NULL,NULL,'small',false,NULL,NULL,'Southwest','new',63,3,'Business Credit Card','Sarah Mitchell',48000,20000,3,'2026-01-22',NULL,NULL,NULL),
('biz-040','BANK-001','Redwood Analytics','Redwood Analytics Corp.','Data Analytics','518210','Sacramento','CA',4100000,55,5,NULL,NULL,'low',NULL,NULL,'small',false,NULL,NULL,'West','growing',83,5,'Growth LOC','David Park',320000,200000,3,'2026-01-27',NULL,NULL,NULL),
('biz-041','BANK-001','Lakeshore Distribution','Lakeshore Distribution Inc.','Distribution','423990','Indianapolis','IN',6900000,85,16,NULL,NULL,'low',NULL,NULL,'mid-market',false,NULL,NULL,'Midwest','growing',79,2,'CRE Warehouse','Jennifer Adams',450000,520000,4,'2026-01-26',NULL,NULL,NULL);

-- ── 5. portfolio_businesses (link all 41 businesses) ────────────────────────

INSERT INTO portfolio_businesses (portfolio_id, business_id)
SELECT 'portfolio-001', id FROM businesses WHERE tenant_id = 'BANK-001';

-- ── 6. business_owners (10 rows — one per core business) ────────────────────

INSERT INTO business_owners (business_id, first_name, last_name, title, email, phone, ownership_pct, fico_score) VALUES
('biz-001', 'James', 'Chen', 'CEO & Founder', 'jchen@stellardynamics.com', '(512) 555-0147', 85, 742),
('biz-002', 'Maria', 'Rodriguez', 'President', 'mrodriguez@metrologistics.com', '(214) 555-0283', 60, 698),
('biz-003', 'Robert', 'Kim', 'Managing Partner', 'rkim@apexconstruction.com', '(602) 555-0391', 70, 758),
('biz-004', 'Priya', 'Patel', 'Chief Medical Officer', 'dpatel@sunrisehealthcare.com', '(713) 555-0462', 55, 771),
('biz-005', 'Sofia', 'Mendez', 'Founder & CEO', 'smendez@greenleaforganics.com', '(559) 555-0518', 100, 672),
('biz-006', 'David', 'Thompson', 'Managing Director', 'dthompson@coastalhospitality.com', '(305) 555-0627', 45, 648),
('biz-007', 'Thomas', 'Mueller', 'CEO', 'tmueller@precisionmfg.com', '(313) 555-0734', 75, 735),
('biz-008', 'Sarah', 'Kim', 'Co-founder & CEO', 'skim@techventure.io', '(415) 555-0842', 60, 782),
('biz-009', 'Marcus', 'Johnson', 'Owner', 'mjohnson@urbanretail.com', '(312) 555-0953', 100, 665),
('biz-010', 'Michael', 'Walsh', 'Captain & Owner', 'mwalsh@pacificmarine.com', '(206) 555-1064', 80, 718);

-- ── 7. credit_scores ────────────────────────────────────────────────────────

INSERT INTO credit_scores (business_id, source, score, risk_class, factors, pulled_at) VALUES
('biz-001', 'experian_biz', 780, 'low', ARRAY['Strong payment history','Low credit utilization','Established trade lines','Diverse credit mix'], '2026-01-28T14:30:00Z'),
('biz-002', 'dun_bradstreet', 710, 'moderate', ARRAY['Moderate payment speed','High industry risk sector','Adequate trade references','Growing debt-to-income'], '2026-01-27T09:00:00Z'),
('biz-003', 'experian_biz', 820, 'low', ARRAY['Excellent payment record','Strong financial statements','Mature business profile','Low debt ratio'], '2026-01-26T11:45:00Z'),
('biz-004', 'equifax_biz', 850, 'low', ARRAY['Exceptional payment history','Low leverage ratio','Strong cash reserves','Industry stability'], '2026-01-29T08:15:00Z'),
('biz-005', 'experian_biz', 650, 'moderate', ARRAY['Limited credit history','High utilization on existing lines','Young business age','Seasonal revenue pattern'], '2026-01-27T16:00:00Z'),
('biz-006', 'dun_bradstreet', 580, 'high', ARRAY['Declining payment trends','High leverage ratio','Industry downturn impact','Multiple slow-pay reports'], '2026-01-28T10:00:00Z'),
('biz-007', 'equifax_biz', 760, 'low', ARRAY['Long operating history','Consistent payment patterns','Diversified customer base','Strong asset base'], '2026-01-25T13:30:00Z'),
('biz-008', 'experian_biz', 850, 'low', ARRAY['Exceptional growth trajectory','Zero delinquencies','Strong venture backing','Low debt ratio'], '2026-01-29T15:00:00Z'),
('biz-009', 'dun_bradstreet', 620, 'high', ARRAY['Very limited credit history','High personal debt-to-income','New business risk','Single trade reference'], '2026-01-26T14:00:00Z'),
('biz-010', 'experian_biz', 730, 'moderate', ARRAY['Good payment history','Moderate utilization','Specialized industry','Stable revenue base'], '2026-01-28T11:30:00Z');

-- ── 8. applications ─────────────────────────────────────────────────────────

INSERT INTO applications (id, app_id, business_id, business_name, status, product_type, amount, submitted_at, ai_recommendation, confidence, composite_score, risk_tier) VALUES
('app-001', 'APP-2026-001', 'biz-001', 'Stellar Dynamics LLC', 'submitted', 'Business Line of Credit', 250000, '2026-01-25T10:15:00Z', 'approve', 91, 82, 'low'),
('app-002', 'APP-2026-002', 'biz-002', 'Metro Logistics Corp', 'under_review', 'Working Capital', 500000, '2026-01-20T14:30:00Z', 'review', 72, 68, 'medium'),
('app-003', 'APP-2026-003', 'biz-003', 'Apex Construction Group', 'approved', 'Equipment Financing', 350000, '2026-01-10T09:00:00Z', 'approve', 94, 86, 'low'),
('app-005', 'APP-2026-005', 'biz-005', 'GreenLeaf Organics', 'submitted', 'Term Loan', 75000, '2026-01-22T11:30:00Z', 'review', 65, 62, 'medium'),
('app-008', 'APP-2026-008', 'biz-008', 'TechVenture Solutions', 'under_review', 'Business Credit Card', 50000, '2026-01-23T09:45:00Z', 'approve', 96, 91, 'low');

-- ── 9. prequal_offers ───────────────────────────────────────────────────────

INSERT INTO prequal_offers (business_id, product_type, amount_min, amount_max, rate_range, status) VALUES
('biz-001', 'Business Line of Credit', 150000, 300000, '7.5% – 9.2%', 'accepted'),
('biz-001', 'Business Credit Card', 25000, 75000, '14.9% – 18.9%', 'active'),
('biz-002', 'Working Capital Loan', 200000, 500000, '9.8% – 12.5%', 'accepted'),
('biz-003', 'Equipment Financing', 200000, 500000, '6.5% – 8.0%', 'accepted'),
('biz-003', 'Business Line of Credit', 300000, 750000, '7.0% – 8.5%', 'active'),
('biz-004', 'Treasury Management', 0, 0, 'Custom', 'active'),
('biz-004', 'Business Line of Credit', 500000, 2000000, '5.9% – 7.5%', 'active'),
('biz-005', 'Term Loan', 25000, 100000, '11.5% – 14.9%', 'accepted'),
('biz-007', 'Equipment Financing', 500000, 1500000, '6.9% – 8.5%', 'active'),
('biz-007', 'Working Capital LOC', 250000, 750000, '7.5% – 9.0%', 'active'),
('biz-008', 'Business Credit Card', 25000, 100000, '12.9% – 16.9%', 'accepted'),
('biz-008', 'Business Line of Credit', 100000, 500000, '7.0% – 8.5%', 'active'),
('biz-010', 'Equipment Financing', 200000, 800000, '8.0% – 10.5%', 'active');

-- ── 10. products ────────────────────────────────────────────────────────────

INSERT INTO products (business_id, name, type, status, balance, credit_limit, opened_date) VALUES
('biz-001', 'Business Checking', 'deposit', 'active', 287400, NULL, '2024-03-15'),
('biz-001', 'Business Savings', 'deposit', 'active', 142000, NULL, '2024-06-01'),
('biz-001', 'Line of Credit', 'credit', 'pending', NULL, 250000, '2026-01-25'),
('biz-002', 'Business Checking', 'deposit', 'active', 198500, NULL, '2019-08-10'),
('biz-002', 'Fleet Card Program', 'credit', 'active', 47200, 75000, '2022-01-15'),
('biz-003', 'Business Checking', 'deposit', 'active', 524000, NULL, '2018-05-20'),
('biz-003', 'Equipment LOC', 'credit', 'active', 180000, 400000, '2023-03-01'),
('biz-003', 'Business Credit Card', 'credit', 'active', 12400, 50000, '2020-09-15'),
('biz-003', 'Business Savings', 'deposit', 'active', 310000, NULL, '2019-01-10'),
('biz-004', 'Business Checking', 'deposit', 'active', 1240000, NULL, '2021-02-01'),
('biz-004', 'Treasury Management', 'service', 'active', NULL, NULL, '2022-06-15'),
('biz-004', 'Business Credit Card', 'credit', 'active', 8200, 100000, '2021-09-01'),
('biz-005', 'Business Checking', 'deposit', 'active', 34200, NULL, '2023-04-01'),
('biz-006', 'Business Checking', 'deposit', 'active', 67800, NULL, '2022-07-01'),
('biz-007', 'Business Checking', 'deposit', 'active', 412000, NULL, '2010-03-15'),
('biz-007', 'Term Loan', 'credit', 'active', 320000, 500000, '2023-09-01'),
('biz-007', 'Business Credit Card', 'credit', 'active', 18900, 75000, '2015-06-20'),
('biz-008', 'Business Checking', 'deposit', 'active', 385000, NULL, '2024-01-15'),
('biz-008', 'Business Credit Card', 'credit', 'pending', NULL, 50000, '2026-01-23'),
('biz-009', 'Business Checking', 'deposit', 'active', 18700, NULL, '2025-03-01'),
('biz-010', 'Business Checking', 'deposit', 'active', 289000, NULL, '2017-09-01'),
('biz-010', 'Line of Credit', 'credit', 'active', 145000, 300000, '2022-04-15');

-- ── 11. credit_signals (biz-001: custom, biz-002: custom, biz-003..010: default) ──

-- biz-001 signals
INSERT INTO credit_signals (id, business_id, name, category, status, direction, detail, source, last_updated) VALUES
('s1','biz-001','Payment Behavior','Trade Credit','strong','improving','98.2% on-time across 12 active trade lines','D&B Trade Tape','2026-01-28T10:00:00Z'),
('s2','biz-001','Revenue Trajectory','Financial','stable','improving','+8.3% QoQ from deposit activity analysis','Banking Data Feed','2026-01-28T10:00:00Z'),
('s3','biz-001','Debt Service Coverage','Financial','strong','stable','DSCR 1.8x vs 1.25x policy minimum','Financial Statements + Banking','2026-01-28T10:00:00Z'),
('s4','biz-001','Trade Credit Standing','Trade Credit','stable','stable','D&B PAYDEX 78, no derogatory filings','D&B Commercial','2026-01-28T10:00:00Z'),
('s5','biz-001','Cash Flow Consistency','Banking','strong','improving','CV 0.12, 18-month operational runway','Banking Data Feed','2026-01-28T10:00:00Z'),
('s6','biz-001','Collateral Position','Secured','stable','stable','LTV 62% on primary secured facility','UCC Filings + Appraisal','2026-01-28T10:00:00Z'),
('s7','biz-001','Owner Credit Profile','Personal Guarantor','weak','worsening','Personal guarantor FICO declined 15pts in 90 days','Soft Pull — Experian','2026-01-28T10:00:00Z'),
-- biz-002 signals
('s1','biz-002','Payment Behavior','Trade Credit','stable','stable','91.5% on-time across 8 trade lines','D&B Trade Tape','2026-01-28T10:00:00Z'),
('s2','biz-002','Revenue Trajectory','Financial','stable','stable','Flat QoQ — seasonal normalization','Banking Data Feed','2026-01-28T10:00:00Z'),
('s3','biz-002','Debt Service Coverage','Financial','stable','worsening','DSCR 1.35x — approaching 1.25x minimum','Financial Statements','2026-01-28T10:00:00Z'),
('s4','biz-002','Trade Credit Standing','Trade Credit','stable','stable','D&B PAYDEX 71, one slow-pay notation','D&B Commercial','2026-01-28T10:00:00Z'),
('s5','biz-002','Cash Flow Consistency','Banking','stable','stable','CV 0.22, moderate seasonality','Banking Data Feed','2026-01-28T10:00:00Z'),
('s6','biz-002','Collateral Position','Secured','strong','stable','Fleet valued at $1.2M, LTV 45%','Equipment Appraisal','2026-01-28T10:00:00Z'),
('s7','biz-002','Owner Credit Profile','Personal Guarantor','stable','stable','Guarantor FICO 718, stable 6-month trend','Soft Pull — Experian','2026-01-28T10:00:00Z');

-- biz-003 through biz-010: default signal profiles
INSERT INTO credit_signals (id, business_id, name, category, status, direction, detail, source, last_updated)
SELECT s.id, b.id, s.name, s.category, s.status, s.direction, s.detail, s.source, s.last_updated::timestamptz
FROM (VALUES
  ('s1','Payment Behavior','Trade Credit','stable','stable','93% on-time across active trade lines','D&B Trade Tape','2026-01-28T10:00:00Z'),
  ('s2','Revenue Trajectory','Financial','stable','stable','Consistent with historical patterns','Banking Data Feed','2026-01-28T10:00:00Z'),
  ('s3','Debt Service Coverage','Financial','stable','stable','DSCR 1.5x — within policy range','Financial Statements','2026-01-28T10:00:00Z'),
  ('s4','Trade Credit Standing','Trade Credit','stable','stable','No derogatory filings','D&B Commercial','2026-01-28T10:00:00Z'),
  ('s5','Cash Flow Consistency','Banking','stable','stable','Moderate variability within norms','Banking Data Feed','2026-01-28T10:00:00Z'),
  ('s6','Collateral Position','Secured','stable','stable','Adequate for current facility levels','UCC Filings','2026-01-28T10:00:00Z'),
  ('s7','Owner Credit Profile','Personal Guarantor','stable','stable','Guarantor credit within acceptable range','Soft Pull — Experian','2026-01-28T10:00:00Z')
) AS s(id, name, category, status, direction, detail, source, last_updated)
CROSS JOIN (
  SELECT id FROM businesses WHERE id IN ('biz-003','biz-004','biz-005','biz-006','biz-007','biz-008','biz-009','biz-010')
) AS b;

-- ── 12. bureau_indicators ───────────────────────────────────────────────────

-- biz-001
INSERT INTO bureau_indicators (id, business_id, name, provider, value, interpretation, as_of_date) VALUES
('b1','biz-001','D&B PAYDEX','Dun & Bradstreet','78 / 100','Above median for SIC 5411 (Computer Services)','2026-01-15'),
('b2','biz-001','Experian Intelliscore Plus','Experian','Low-Medium Risk Band','Percentile 62 — moderate commercial credit risk','2026-01-20'),
('b3','biz-001','FICO SBSS','FICO / SBA','Pre-screen Eligible (>140)','Meets SBA 7(a) pre-screen threshold','2026-01-18'),
-- biz-002
('b1','biz-002','D&B PAYDEX','Dun & Bradstreet','71 / 100','Median range for SIC 4210 (Trucking)','2026-01-15'),
('b2','biz-002','Experian Intelliscore Plus','Experian','Medium Risk Band','Percentile 48 — moderate commercial credit risk','2026-01-20'),
('b3','biz-002','FICO SBSS','FICO / SBA','Pre-screen Eligible (>140)','Meets SBA 7(a) pre-screen threshold','2026-01-18');

-- biz-003 through biz-010: default bureau indicators
INSERT INTO bureau_indicators (id, business_id, name, provider, value, interpretation, as_of_date)
SELECT s.id, b.id, s.name, s.provider, s.value, s.interpretation, s.as_of_date::date
FROM (VALUES
  ('b1','D&B PAYDEX','Dun & Bradstreet','72 / 100','Median range for industry','2026-01-15'),
  ('b2','Experian Intelliscore Plus','Experian','Medium Risk Band','Moderate commercial credit risk','2026-01-20'),
  ('b3','FICO SBSS','FICO / SBA','Pre-screen Eligible (>140)','Meets SBA pre-screen threshold','2026-01-18')
) AS s(id, name, provider, value, interpretation, as_of_date)
CROSS JOIN (
  SELECT id FROM businesses WHERE id IN ('biz-003','biz-004','biz-005','biz-006','biz-007','biz-008','biz-009','biz-010')
) AS b;

-- ── 13. product_readiness ───────────────────────────────────────────────────

-- biz-001
INSERT INTO product_readiness (business_id, product_id, product_name, facility_size, readiness, qualifying_signal, concern) VALUES
('biz-001','loc','Business Line of Credit ($250K)','$250,000','likely','Strong cash flow, DSCR 1.8x','Guarantor FICO trending down'),
('biz-001','sba','SBA 7(a) Loan','$500,000','likely','SBSS eligible, 7yr operating history','None material'),
('biz-001','cre','Commercial Real Estate','$1,200,000','borderline','Adequate collateral position','Revenue concentration in single vertical'),
('biz-001','equipment','Equipment Financing','$150,000','likely','Strong payment history, low leverage','None material'),
('biz-001','cards','Business Credit Card','$50,000','likely','Consistent deposit activity','None material'),
('biz-001','auto','Commercial Auto','$75,000','unlikely','N/A — no fleet operations identified','No demonstrated business need'),
-- biz-002
('biz-002','loc','Business Line of Credit ($150K)','$150,000','likely','Strong collateral, adequate cash flow','DSCR trending toward minimum'),
('biz-002','sba','SBA 7(a) Loan','$350,000','borderline','SBSS eligible','DSCR compression, seasonal cash flow'),
('biz-002','equipment','Equipment Financing','$200,000','likely','Existing fleet as collateral','None material'),
('biz-002','cards','Business Credit Card','$25,000','likely','Consistent deposit activity','None material'),
('biz-002','auto','Commercial Auto','$120,000','likely','Core business need, strong fleet history','None material'),
('biz-002','cre','Commercial Real Estate','$800,000','unlikely','N/A','Insufficient revenue scale for CRE');

-- biz-003 through biz-010: default product readiness
INSERT INTO product_readiness (business_id, product_id, product_name, facility_size, readiness, qualifying_signal, concern)
SELECT b.id, s.product_id, s.product_name, s.facility_size, s.readiness::product_readiness_level, s.qualifying_signal, s.concern
FROM (VALUES
  ('loc','Business Line of Credit','$100,000','likely','Adequate cash flow signals','None material'),
  ('sba','SBA 7(a) Loan','$250,000','borderline','SBSS eligible','Limited operating history data'),
  ('cards','Business Credit Card','$25,000','likely','Consistent deposit activity','None material'),
  ('equipment','Equipment Financing','$75,000','likely','Stable payment patterns','None material'),
  ('cre','Commercial Real Estate','N/A','unlikely','N/A','Insufficient scale'),
  ('auto','Commercial Auto','$50,000','borderline','Adequate credit profile','No demonstrated fleet need')
) AS s(product_id, product_name, facility_size, readiness, qualifying_signal, concern)
CROSS JOIN (
  SELECT id FROM businesses WHERE id IN ('biz-003','biz-004','biz-005','biz-006','biz-007','biz-008','biz-009','biz-010')
) AS b;

-- ── 14. activity_history ────────────────────────────────────────────────────

INSERT INTO activity_history (business_id, event_date, type, description) VALUES
-- biz-001
('biz-001','2026-01-28','score_pull','Experian BizID score refreshed: 780'),
('biz-001','2026-01-25','application','LOC application submitted for $250K'),
('biz-001','2026-01-15','prequal','Pre-qualified for Business LOC up to $300K'),
('biz-001','2025-12-20','payment','All trade payments current (30-day check)'),
('biz-001','2025-11-01','score_pull','Initial scoring: Experian 775, FICO 742'),
-- biz-002
('biz-002','2026-01-27','score_pull','D&B PAYDEX refreshed: 710'),
('biz-002','2026-01-20','application','Working Capital application submitted for $500K'),
('biz-002','2026-01-10','prequal','Pre-qualified for Working Capital up to $500K'),
('biz-002','2025-12-15','payment','Fleet card payment received — 5 days late'),
('biz-002','2025-11-05','alert','D&B score dropped 15 points (725 → 710)'),
-- biz-003
('biz-003','2026-01-26','score_pull','Experian BizID refreshed: 820'),
('biz-003','2026-01-15','approval','Equipment Financing $350K approved — auto-decision'),
('biz-003','2026-01-10','application','Equipment Financing application submitted for $350K'),
('biz-003','2025-12-01','payment','All obligations current — perfect payment record'),
('biz-003','2025-10-15','prequal','Pre-qualified for Equipment Financing up to $500K'),
-- biz-004
('biz-004','2026-01-29','score_pull','Equifax BizID refreshed: 850'),
('biz-004','2026-01-15','prequal','Pre-qualified for LOC up to $2M'),
('biz-004','2025-12-10','payment','All trade payments current — 0 days average payable'),
('biz-004','2025-11-20','score_pull','Quarterly bureau refresh: Equifax 845'),
-- biz-005
('biz-005','2026-01-27','score_pull','Experian BizID refreshed: 650'),
('biz-005','2026-01-22','application','Term Loan application submitted for $75K'),
('biz-005','2026-01-05','prequal','Pre-qualified for Term Loan up to $100K'),
('biz-005','2025-12-18','alert','Banking health score dropped below 50 threshold'),
('biz-005','2025-11-10','score_pull','Initial scoring: Experian 660, FICO 672'),
-- biz-006
('biz-006','2026-01-28','score_pull','D&B PAYDEX refreshed: 580'),
('biz-006','2026-01-20','alert','Risk alert: score dropped below 600 threshold'),
('biz-006','2025-12-05','alert','Payment 15+ days late on vendor trade line'),
('biz-006','2025-11-15','score_pull','D&B score declined: 610 → 580'),
-- biz-007
('biz-007','2026-01-25','score_pull','Equifax BizID refreshed: 760'),
('biz-007','2026-01-10','prequal','Pre-qualified for Equipment Financing up to $1.5M'),
('biz-007','2025-12-15','payment','Term loan payment received on time'),
('biz-007','2025-11-01','score_pull','Quarterly refresh: Equifax 758'),
-- biz-008
('biz-008','2026-01-29','score_pull','Experian BizID refreshed: 850'),
('biz-008','2026-01-23','application','Business Credit Card application for $50K'),
('biz-008','2026-01-15','prequal','Pre-qualified for CC up to $100K and LOC up to $500K'),
('biz-008','2025-12-20','score_pull','Bureau refresh: Experian 840, trending up'),
('biz-008','2025-11-01','payment','All obligations current — perfect record'),
-- biz-009
('biz-009','2026-01-26','score_pull','D&B PAYDEX refreshed: 620'),
('biz-009','2025-12-20','alert','Cash balance dropped below $20K threshold'),
('biz-009','2025-11-15','score_pull','Initial scoring: D&B 635, FICO 665'),
-- biz-010
('biz-010','2026-01-28','score_pull','Experian BizID refreshed: 730'),
('biz-010','2026-01-05','prequal','Pre-qualified for Equipment Financing up to $800K'),
('biz-010','2025-12-20','payment','LOC payment received on time'),
('biz-010','2025-11-10','score_pull','Quarterly refresh: Experian 725');

-- ── 15. ews_alerts ──────────────────────────────────────────────────────────

INSERT INTO ews_alerts (business_id, alert_type, severity, description, detected_at) VALUES
('biz-006', 'score_decline', 'high', 'D&B PAYDEX dropped below 600 — payment deterioration', '2026-01-20T10:00:00Z'),
('biz-009', 'low_balance', 'medium', 'Cash balance dropped below $20K threshold', '2025-12-20T10:00:00Z'),
('biz-005', 'health_score_drop', 'medium', 'Banking health score dropped below 50', '2025-12-18T10:00:00Z'),
('biz-006', 'late_payment', 'high', 'Payment 15+ days late on vendor trade line', '2025-12-05T10:00:00Z'),
('biz-002', 'score_decline', 'medium', 'D&B score dropped 15 points (725 → 710)', '2025-11-05T10:00:00Z');

-- ── 16. system_services ──────────────────────────────────────────────────────

INSERT INTO system_services (tenant_id, name, status, latency_ms, uptime_pct, last_check) VALUES
('BANK-001', 'Core API', 'operational', 45, 99.990, '1m ago'),
('BANK-001', 'Score Engine', 'operational', 142, 99.970, '1m ago'),
('BANK-001', 'Bureau Gateway', 'operational', 234, 99.950, '1m ago'),
('BANK-001', 'Webhook Delivery', 'operational', 89, 99.920, '1m ago'),
('BANK-001', 'Authentication', 'operational', 28, 99.990, '1m ago');

-- ── 17. webhook_events ──────────────────────────────────────────────────────

INSERT INTO webhook_events (tenant_id, event_type, status, endpoint, timestamp_ago, response_time) VALUES
('BANK-001', 'score.updated', 'delivered', 'https://api.partner-bank.com/webhooks/lumiq', '2m ago', 89),
('BANK-001', 'prequal.matched', 'delivered', 'https://api.partner-bank.com/webhooks/lumiq', '8m ago', 124),
('BANK-001', 'application.approved', 'delivered', 'https://api.partner-bank.com/webhooks/lumiq', '15m ago', 95),
('BANK-001', 'risk.alert', 'delivered', 'https://api.partner-bank.com/webhooks/lumiq', '22m ago', 108);

-- ── 18. api_keys ────────────────────────────────────────────────────────────

INSERT INTO api_keys (id, tenant_id, name, key_masked, environment, scopes, created_at, last_used, status, created_by) VALUES
('key-001','BANK-001','Production API Key','sk_live_****************************1234','production',ARRAY['read:scores','read:businesses','write:webhooks'],'2024-01-01T00:00:00Z','2024-01-15T14:30:00Z','active','john.admin@partnerbank.com'),
('key-002','BANK-001','Sandbox Test Key','sk_test_****************************5678','sandbox',ARRAY['read:scores','read:businesses','write:webhooks','read:pii'],'2024-01-05T00:00:00Z','2024-01-15T10:00:00Z','active','sarah.dev@partnerbank.com'),
('key-003','BANK-001','Legacy Key (Deprecated)','sk_live_****************************9012','production',ARRAY['read:scores'],'2023-06-01T00:00:00Z','2023-12-01T00:00:00Z','revoked','john.admin@partnerbank.com');

-- ── 19. audit_logs ──────────────────────────────────────────────────────────

INSERT INTO audit_logs (id, tenant_id, user_email, action, resource, timestamp, ip) VALUES
('log-001','BANK-001','john.admin@partnerbank.com','user.created','tom.analyst@partnerbank.com','2026-01-28T14:30:00Z','192.168.1.100'),
('log-002','BANK-001','sarah.dev@partnerbank.com','api_key.created','Sandbox Test Key','2026-01-28T12:00:00Z','192.168.1.105'),
('log-003','BANK-001','mike.risk@partnerbank.com','customer.viewed','Business: Stellar Dynamics LLC (biz-001)','2026-01-28T11:45:00Z','192.168.1.110'),
('log-004','BANK-001','mike.risk@partnerbank.com','report.exported','Credit Intelligence Dossier — Stellar Dynamics','2026-01-28T11:42:00Z','192.168.1.110'),
('log-005','BANK-001','john.admin@partnerbank.com','settings.updated','Early Warning Signal Thresholds','2026-01-28T10:15:00Z','192.168.1.100'),
('log-006','BANK-001','lisa.rm@partnerbank.com','customer.viewed','Business: Metro Logistics Corp (biz-002)','2026-01-28T09:30:00Z','192.168.1.115'),
('log-007','BANK-001','mike.risk@partnerbank.com','report.exported','Portfolio Risk Summary Q1-2026','2026-01-27T16:20:00Z','192.168.1.110'),
('log-008','BANK-001','sarah.dev@partnerbank.com','settings.updated','Webhook endpoint configuration','2026-01-27T14:00:00Z','192.168.1.105'),
('log-009','BANK-001','john.admin@partnerbank.com','role.updated','Risk Analyst — added PII access','2026-01-27T11:30:00Z','192.168.1.100'),
('log-010','BANK-001','lisa.rm@partnerbank.com','customer.viewed','Business: GreenTech Solutions (biz-003)','2026-01-27T09:15:00Z','192.168.1.115'),
('log-011','BANK-001','mike.risk@partnerbank.com','customer.viewed','Business: Apex Construction (biz-005)','2026-01-26T15:45:00Z','192.168.1.110'),
('log-012','BANK-001','john.admin@partnerbank.com','api_key.revoked','Legacy Key (Deprecated)','2026-01-26T10:00:00Z','192.168.1.100'),
('log-013','BANK-001','sarah.dev@partnerbank.com','report.exported','API Usage Report — January 2026','2026-01-25T17:00:00Z','192.168.1.105'),
('log-014','BANK-001','mike.risk@partnerbank.com','settings.updated','Risk Indicator Drop Trigger — changed to 10pts','2026-01-25T14:30:00Z','192.168.1.110'),
('log-015','BANK-001','lisa.rm@partnerbank.com','customer.viewed','Business: QuickServe Restaurant (biz-004)','2026-01-25T10:15:00Z','192.168.1.115');

-- ── 20. report_templates (18 rows) ──────────────────────────────────────────

INSERT INTO report_templates (id, name, category, description, supported_formats, default_format, options) VALUES
('portfolio-risk-summary','Portfolio Risk Summary','portfolio','Comprehensive risk overview with tier distribution and trends',ARRAY['pdf','xlsx']::report_format[],'pdf','[{"id":"include-heatmaps","label":"Include heatmaps","type":"checkbox","defaultValue":true},{"id":"include-concentration","label":"Include concentration tables","type":"checkbox","defaultValue":true},{"id":"include-drivers","label":"Include risk driver analysis","type":"checkbox","defaultValue":false},{"id":"include-appendix","label":"Include entity appendix (top 100)","type":"checkbox","defaultValue":false}]'),
('score-distribution','Score Distribution Snapshot','portfolio','Current score distribution across all bands',ARRAY['csv','xlsx']::report_format[],'csv','[{"id":"include-exposure","label":"Include exposure weights","type":"checkbox","defaultValue":true},{"id":"breakdown-segment","label":"Break down by segment","type":"checkbox","defaultValue":false}]'),
('score-migration','Score Migration (90d)','portfolio','Score band migration matrix over 90 days',ARRAY['xlsx','pdf']::report_format[],'xlsx','[{"id":"include-trends","label":"Include trend analysis","type":"checkbox","defaultValue":true},{"id":"highlight-deteriorating","label":"Highlight deteriorating clients","type":"checkbox","defaultValue":true}]'),
('industry-concentration','Industry Concentration Report','portfolio','Exposure concentration by industry sector',ARRAY['pdf','xlsx']::report_format[],'pdf','[{"id":"include-limits","label":"Include concentration limits","type":"checkbox","defaultValue":true},{"id":"include-benchmarks","label":"Include industry benchmarks","type":"checkbox","defaultValue":false}]'),
('regional-exposure','Regional Exposure Report','portfolio','Geographic distribution of portfolio exposure',ARRAY['pdf','xlsx']::report_format[],'pdf','[{"id":"include-maps","label":"Include geographic maps","type":"checkbox","defaultValue":true},{"id":"drill-to-branch","label":"Drill down to branch level","type":"checkbox","defaultValue":false}]'),
('application-funnel','Application Funnel Report','underwriting','End-to-end application funnel conversion metrics',ARRAY['xlsx','pdf']::report_format[],'xlsx','[{"id":"breakdown-segment","label":"Break down by segment","type":"checkbox","defaultValue":true},{"id":"breakdown-industry","label":"Break down by industry","type":"checkbox","defaultValue":false},{"id":"include-time","label":"Include time-to-decision","type":"checkbox","defaultValue":true}]'),
('approval-rate','Approval Rate Analysis','underwriting','Approval rates by segment, industry, and region',ARRAY['csv','xlsx']::report_format[],'csv','[{"id":"include-trends","label":"Include trend comparison","type":"checkbox","defaultValue":true},{"id":"include-reasons","label":"Include decline reasons","type":"checkbox","defaultValue":false}]'),
('prequal-performance','Pre-qualification Performance','underwriting','LUMIQ AI pre-qualification accuracy and conversion',ARRAY['pdf','xlsx']::report_format[],'pdf','[{"id":"include-accuracy","label":"Include accuracy metrics","type":"checkbox","defaultValue":true},{"id":"include-lift","label":"Include conversion lift analysis","type":"checkbox","defaultValue":true}]'),
('relationship-health','Relationship Health Report','customer','RHS distribution and engagement metrics',ARRAY['pdf','xlsx']::report_format[],'pdf','[{"id":"include-drivers","label":"Include RHS drivers","type":"checkbox","defaultValue":true},{"id":"include-actions","label":"Include recommended actions","type":"checkbox","defaultValue":false}]'),
('top-opportunities','Top Opportunities Report','customer','Ranked cross-sell and upsell opportunities',ARRAY['xlsx','csv']::report_format[],'xlsx','[{"id":"limit-count","label":"Limit to top 500","type":"checkbox","defaultValue":true},{"id":"include-propensity","label":"Include propensity scores","type":"checkbox","defaultValue":true}]'),
('at-risk-clients','At-Risk Clients Report','customer','Clients showing deterioration signals',ARRAY['csv','xlsx']::report_format[],'csv','[{"id":"include-signals","label":"Include risk signals","type":"checkbox","defaultValue":true},{"id":"include-history","label":"Include interaction history","type":"checkbox","defaultValue":false}]'),
('access-log','Access Log Export','compliance','Complete audit trail of system access',ARRAY['csv']::report_format[],'csv','[{"id":"include-ip","label":"Include IP addresses","type":"checkbox","defaultValue":true},{"id":"include-actions","label":"Include action details","type":"checkbox","defaultValue":true}]'),
('data-lineage','Data Lineage Summary','compliance','Data source traceability and transformation log',ARRAY['pdf']::report_format[],'pdf','[{"id":"include-diagram","label":"Include lineage diagram","type":"checkbox","defaultValue":true},{"id":"include-transformations","label":"Include transformation rules","type":"checkbox","defaultValue":false}]'),
('consent-scope','Consent & Scope Report','compliance','Customer consent status and data access scope',ARRAY['csv','xlsx']::report_format[],'csv','[{"id":"include-expiry","label":"Include consent expiry dates","type":"checkbox","defaultValue":true},{"id":"include-revoked","label":"Include revoked consents","type":"checkbox","defaultValue":false}]'),
('webhook-audit','Webhook Delivery Audit','compliance','Webhook delivery success rates and failures',ARRAY['csv']::report_format[],'csv','[{"id":"include-payloads","label":"Include payload samples","type":"checkbox","defaultValue":false},{"id":"include-retries","label":"Include retry attempts","type":"checkbox","defaultValue":true}]'),
('api-usage','API Usage Report','api','API call volumes, latency, and error rates',ARRAY['xlsx','csv']::report_format[],'xlsx','[{"id":"breakdown-endpoint","label":"Break down by endpoint","type":"checkbox","defaultValue":true},{"id":"include-latency","label":"Include latency percentiles","type":"checkbox","defaultValue":true}]'),
('data-freshness','Data Freshness Report','api','Data source freshness and refresh status',ARRAY['pdf','xlsx']::report_format[],'pdf','[{"id":"include-sla","label":"Include SLA compliance","type":"checkbox","defaultValue":true},{"id":"include-gaps","label":"Include data gap analysis","type":"checkbox","defaultValue":false}]'),
('error-incidents','Error Rate & Incidents','api','System errors, incidents, and resolution times',ARRAY['csv','xlsx']::report_format[],'csv','[{"id":"include-root-cause","label":"Include root cause analysis","type":"checkbox","defaultValue":false},{"id":"include-resolution","label":"Include resolution times","type":"checkbox","defaultValue":true}]');

-- ── 21. generated_reports ────────────────────────────────────────────────────

INSERT INTO generated_reports (id, template_id, name, format, scope, period, status, generated_at, generated_by, file_size, download_url, metadata) VALUES
('rpt-001','portfolio-risk-summary','Portfolio Risk Summary - Q4 2025','pdf','LOC — Small — National','90d','ready','2026-01-15T14:30:00Z','john.analyst@partnerbank.com','2.4 MB','#','{"dataSources":["LUMIQ AI Score Engine","Bureau Data Feed","Internal CRM"],"lastDataRefresh":"2026-01-15T12:00:00Z","transformationSummary":"Aggregated by segment, filtered by product type","tenantId":"BANK-001","confidenceScore":0.94,"recordCount":45678}'),
('rpt-002','application-funnel','Application Funnel Report - January','xlsx','All Products — Mid-market — NYC','30d','ready','2026-01-14T09:15:00Z','sarah.ops@partnerbank.com','1.1 MB','#','{"dataSources":["LUMIQ AI Decision Engine","LOS System"],"lastDataRefresh":"2026-01-14T08:00:00Z","transformationSummary":"Funnel stages computed from application lifecycle events","tenantId":"BANK-001","confidenceScore":0.98,"recordCount":3456}'),
('rpt-003','at-risk-clients','At-Risk Clients - Weekly Export','csv','LOC — Micro — National','7d','ready','2026-01-13T16:45:00Z','mike.risk@partnerbank.com','456 KB','#','{"dataSources":["LUMIQ AI EWS","Payment History","Bureau Alerts"],"lastDataRefresh":"2026-01-13T16:00:00Z","transformationSummary":"Filtered by risk tier >= Medium, sorted by deterioration velocity","tenantId":"BANK-001","confidenceScore":0.91,"recordCount":892}'),
('rpt-004','api-usage','API Usage Report - Weekly','xlsx','All Endpoints','7d','processing','2026-01-15T15:00:00Z','platform.ops@partnerbank.com',NULL,NULL,'{"dataSources":["API Gateway Logs","CloudWatch Metrics"],"lastDataRefresh":"2026-01-15T14:55:00Z","transformationSummary":"Aggregated by endpoint, computed percentiles","tenantId":"BANK-001","confidenceScore":0.99,"recordCount":1245678}'),
('rpt-005','consent-scope','Consent & Scope Report - Audit','csv','All Clients','12m','failed','2026-01-12T11:30:00Z','compliance@partnerbank.com',NULL,NULL,'{"dataSources":["Consent Management System","Identity Provider"],"lastDataRefresh":"2026-01-12T11:00:00Z","transformationSummary":"Failed: Data source timeout","tenantId":"BANK-001","confidenceScore":0,"recordCount":0}'),
('rpt-006','score-migration','Score Migration Analysis - Q4 2025','xlsx','Cards — Small — National','90d','ready','2026-01-10T08:00:00Z','analytics@partnerbank.com','890 KB','#','{"dataSources":["LUMIQ AI Score Engine","Historical Score Archive"],"lastDataRefresh":"2026-01-10T06:00:00Z","transformationSummary":"Migration matrix computed from 90-day score snapshots","tenantId":"BANK-001","confidenceScore":0.96,"recordCount":28456}');

-- ── 22. portfolio_kpis ──────────────────────────────────────────────────────

INSERT INTO portfolio_kpis (id, label, value, format, trend, trend_direction, is_positive_trend, tooltip, data_source, last_updated) VALUES
('avg-score','Avg Risk Indicator',72.40,'score',3.20,'up',true,'Exposure-weighted average risk indicator across portfolio','LUMIQ AI Signal Engine','2 mins ago'),
('score-momentum','Signal Momentum (90d)',2.80,'percent',0.50,'up',true,'Average signal change over last 90 days','LUMIQ AI Signal Engine','2 mins ago'),
('improving-clients','% Improving Clients',38.20,'percent',4.10,'up',true,'Clients with signal improvement in 90d','Portfolio Analytics','5 mins ago'),
('deteriorating-clients','% Deteriorating Clients',12.50,'percent',-1.80,'down',true,'Clients with signal deterioration in 90d','Portfolio Analytics','5 mins ago'),
('volatility-index','Portfolio Volatility',8.30,'number',-0.40,'down',true,'Standard deviation of signal changes','Risk Analytics','1 hour ago'),
('risk-index','Exp-Weighted Risk Index',24.70,'score',-2.10,'down',true,'Exposure-weighted aggregate risk metric','Risk Engine','15 mins ago');

-- ── 23. score_distribution ──────────────────────────────────────────────────

INSERT INTO score_distribution (range_label, min_score, max_score, count, percent, exposure) VALUES
('0–50', 0, 50, 1250, 5.00, 45000000),
('51–65', 51, 65, 3750, 15.00, 187500000),
('66–75', 66, 75, 7500, 30.00, 562500000),
('76–85', 76, 85, 8750, 35.00, 787500000),
('86–100', 86, 100, 3750, 15.00, 412500000);

-- ── 24. risk_drivers ────────────────────────────────────────────────────────

INSERT INTO risk_drivers (id, name, impact, trend, affected_clients, severity, description) VALUES
('rd-1','Cash Flow Volatility',28,'decreasing',4250,'high','Increased month-over-month variance in operating cash flows'),
('rd-2','Bureau Score Changes',22,'stable',3100,'medium','Commercial bureau score movements from D&B, Experian, Equifax'),
('rd-3','Utilization Spikes',18,'increasing',2850,'high','Credit line utilization exceeding 80% threshold'),
('rd-4','Revenue Contraction',16,'stable',2200,'medium','YoY revenue decline exceeding 15%'),
('rd-5','Payment Delays',12,'decreasing',1650,'medium','Days payable outstanding increasing beyond industry norms');

-- ── 25. pilot_metrics ───────────────────────────────────────────────────────

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
  'BANK-001', 47500, 38200, 80.40,
  12400, 32.50, 3100, 25.00,
  2340, 75.50, 2106, 90.00, 9300,
  72, 74,
  3247000, 35293, 99.940, 145, 380, 1948,
  125000, 292500000, 4250, 9945000,
  1.80, 0.40, 62.50,
  12.50, 38.20, 2.30
);

-- ── 26. data_sources ────────────────────────────────────────────────────────

INSERT INTO data_sources (id, tenant_id, name, type, status, last_sync, error_rate) VALUES
('ds-001','BANK-001','Plaid','aggregator','connected','2024-01-15T14:00:00Z',0.20),
('ds-002','BANK-001','MX','aggregator','connected','2024-01-15T13:45:00Z',0.50),
('ds-003','BANK-001','Yodlee','aggregator','disconnected',NULL,0.00),
('ds-004','BANK-001','Experian','bureau','connected','2024-01-15T12:00:00Z',0.10),
('ds-005','BANK-001','Equifax','bureau','connected','2024-01-15T11:30:00Z',0.30),
('ds-006','BANK-001','QuickBooks','accounting','error','2024-01-14T00:00:00Z',15.20),
('ds-007','BANK-001','Xero','accounting','connected','2024-01-15T10:00:00Z',0.80);

-- ── 27. model_versions ──────────────────────────────────────────────────────

INSERT INTO model_versions (id, tenant_id, name, version, status, validated_on, notes) VALUES
('model-001','BANK-001','LUMIQ AI Signal Engine','v3.2.1','active','2024-01-10T00:00:00Z','Production model with improved cash flow features'),
('model-002','BANK-001','LUMIQ AI Signal Engine','v3.1.0','deprecated','2023-11-15T00:00:00Z','Previous stable version'),
('model-003','BANK-001','Early Warning System','v2.0.0','active','2024-01-05T00:00:00Z','Enhanced deterioration detection'),
('model-004','BANK-001','Cross-sell Propensity','v1.5.0','testing','2024-01-12T00:00:00Z','A/B testing in progress');

COMMIT;
