-- ============================================================
-- LumiqAI Complete Schema Export
-- For self-hosted Supabase or any Postgres database
-- Generated: 2026-01-22
-- ============================================================

-- ============================================================
-- PART 1: ENUMS
-- ============================================================

CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'admin',
  'developer',
  'risk_analyst',
  'relationship_manager',
  'readonly'
);

CREATE TYPE public.application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'declined',
  'withdrawn'
);

CREATE TYPE public.offer_status AS ENUM (
  'generated',
  'viewed',
  'accepted',
  'declined',
  'expired'
);

CREATE TYPE public.report_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TYPE public.bureau_source AS ENUM (
  'mock',
  'uploaded',
  'api',
  'experian_biz',
  'dnb',
  'equifax_biz'
);

CREATE TYPE public.audit_action AS ENUM (
  'LOGIN',
  'LOGOUT',
  'VIEW_PII',
  'EXPORT_DATA',
  'SOFT_PULL_REQUESTED',
  'HARD_PULL_REQUESTED',
  'OFFER_GENERATED',
  'OFFER_VIEWED',
  'APPLICATION_SUBMITTED',
  'APPLICATION_DECIDED',
  'REPORT_REQUESTED',
  'REPORT_DOWNLOADED',
  'API_KEY_CREATED',
  'API_KEY_REVOKED',
  'SETTINGS_CHANGED',
  'USER_CREATED',
  'USER_UPDATED',
  'ROLE_ASSIGNED',
  'SCORE_VIEWED',
  'FILTER_APPLIED',
  'DOSSIER_OPENED'
);

-- ============================================================
-- PART 2: CORE IDENTITY TABLES
-- ============================================================

-- Tenants (Bank organizations)
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sso_provider TEXT DEFAULT 'oidc',
  session_timeout_minutes INTEGER DEFAULT 60,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tenant_id UUID REFERENCES public.tenants(id),
  mfa_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Roles (RBAC)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tenant_id, role)
);

-- Portfolios (Loan portfolios within a tenant)
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);

-- Portfolio Access (User → Portfolio mapping)
CREATE TABLE public.portfolio_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  can_export BOOLEAN DEFAULT false,
  can_create_keys BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, portfolio_id)
);

-- ============================================================
-- PART 3: SMB ENTITY TABLES
-- ============================================================

-- SMB Entities (Small/Medium Businesses)
CREATE TABLE public.smb_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  dba_name TEXT,
  ein TEXT,
  duns_number TEXT,
  naics_code TEXT,
  sic_code TEXT,
  business_type TEXT,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  annual_revenue NUMERIC,
  employee_count INTEGER,
  formation_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Business Owners (linked to SMB entities)
CREATE TABLE public.business_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  ssn_last_four TEXT,
  ownership_percentage NUMERIC,
  is_guarantor BOOLEAN DEFAULT false,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PART 4: CREDIT & SCORING TABLES
-- ============================================================

-- Credit Scores
CREATE TABLE public.credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.business_owners(id),
  source public.bureau_source NOT NULL,
  score_type TEXT NOT NULL,
  score INTEGER,
  score_range_min INTEGER DEFAULT 0,
  score_range_max INTEGER DEFAULT 100,
  risk_class TEXT,
  factors JSONB DEFAULT '[]'::jsonb,
  raw_response JSONB,
  consent_id UUID,
  pulled_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Score History (tracking changes over time)
CREATE TABLE public.score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_score_id UUID NOT NULL REFERENCES public.credit_scores(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  source public.bureau_source NOT NULL,
  score INTEGER NOT NULL,
  delta INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Data Lineage (tracking data provenance)
CREATE TABLE public.data_lineage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  source_name TEXT NOT NULL,
  pulled_at TIMESTAMPTZ NOT NULL,
  freshness_hours INTEGER,
  coverage_pct NUMERIC,
  consent_reference TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PART 5: WORKFLOW TABLES
-- ============================================================

-- Underwriting Rulesets
CREATE TABLE public.underwriting_rulesets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  thresholds JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prequal Offers
CREATE TABLE public.prequal_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  ruleset_id UUID REFERENCES public.underwriting_rulesets(id),
  product_type TEXT NOT NULL,
  amount_min NUMERIC,
  amount_max NUMERIC,
  term_months_min INTEGER,
  term_months_max INTEGER,
  rate_min NUMERIC,
  rate_max NUMERIC,
  required_docs JSONB DEFAULT '[]'::jsonb,
  eligibility_factors JSONB DEFAULT '{}'::jsonb,
  status public.offer_status DEFAULT 'generated',
  viewed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.prequal_offers(id),
  requested_amount NUMERIC,
  requested_term_months INTEGER,
  application_data JSONB DEFAULT '{}'::jsonb,
  status public.application_status DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES auth.users(id),
  decision_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Report Jobs
CREATE TABLE public.report_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id),
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  report_type TEXT NOT NULL,
  format TEXT DEFAULT 'pdf',
  parameters JSONB DEFAULT '{}'::jsonb,
  status public.report_status DEFAULT 'pending',
  artifact_url TEXT,
  artifact_expires_at TIMESTAMPTZ,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PART 6: RISK & ANALYTICS TABLES
-- ============================================================

-- Risk Aggregates (pre-computed metrics)
CREATE TABLE public.risk_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  aggregate_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  dimension TEXT,
  dimension_value TEXT,
  count INTEGER DEFAULT 0,
  sum_value NUMERIC,
  avg_value NUMERIC,
  min_value NUMERIC,
  max_value NUMERIC,
  computed_at TIMESTAMPTZ DEFAULT now()
);

-- EWS Queue (Early Warning System alerts)
CREATE TABLE public.ews_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  trigger_value NUMERIC,
  threshold_value NUMERIC,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Insights
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID REFERENCES public.smb_entities(id),
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  factors JSONB DEFAULT '[]'::jsonb,
  confidence_score NUMERIC,
  model_version TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- ============================================================
-- PART 7: AUDIT & COMPLIANCE TABLES
-- ============================================================

-- Audit Events
CREATE TABLE public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action public.audit_action NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PART 8: API & INTEGRATION TABLES
-- ============================================================

-- API Keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  environment TEXT DEFAULT 'sandbox',
  scopes TEXT[] DEFAULT '{}',
  rate_limit_per_minute INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- API Usage Logs
CREATE TABLE public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  ip_address INET,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Webhook Configs
CREATE TABLE public.webhook_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_hash TEXT,
  events TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  failure_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PART 9: DATABASE FUNCTIONS
-- ============================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _tenant_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
      AND role = _role
  )
$$;

-- Check if user has access to a tenant
CREATE OR REPLACE FUNCTION public.has_tenant_access(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
  )
$$;

-- Check if user has access to a portfolio
CREATE OR REPLACE FUNCTION public.has_portfolio_access(_user_id UUID, _portfolio_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.portfolio_access
    WHERE user_id = _user_id
      AND portfolio_id = _portfolio_id
  )
$$;

-- Get user's tenant ID
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- ============================================================
-- PART 10: TRIGGERS
-- ============================================================

-- Auto-create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_smb_entities_updated_at
  BEFORE UPDATE ON public.smb_entities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_business_owners_updated_at
  BEFORE UPDATE ON public.business_owners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_underwriting_rulesets_updated_at
  BEFORE UPDATE ON public.underwriting_rulesets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_webhook_configs_updated_at
  BEFORE UPDATE ON public.webhook_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- PART 11: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smb_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.underwriting_rulesets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prequal_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ews_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Tenants
CREATE POLICY "Users can view their tenant"
  ON public.tenants FOR SELECT
  USING (has_tenant_access(auth.uid(), id));

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- User Roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (
    has_role(auth.uid(), tenant_id, 'admin') OR
    has_role(auth.uid(), tenant_id, 'super_admin')
  );

-- Portfolios
CREATE POLICY "Users can view accessible portfolios"
  ON public.portfolios FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), id)
  );

-- Portfolio Access
CREATE POLICY "Users can view own portfolio access"
  ON public.portfolio_access FOR SELECT
  USING (user_id = auth.uid());

-- SMB Entities
CREATE POLICY "Users can view SMBs in accessible portfolios"
  ON public.smb_entities FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

CREATE POLICY "Users can insert SMBs in accessible portfolios"
  ON public.smb_entities FOR INSERT
  WITH CHECK (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

CREATE POLICY "Users can update SMBs in accessible portfolios"
  ON public.smb_entities FOR UPDATE
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

-- Business Owners
CREATE POLICY "Users can view owners of accessible SMBs"
  ON public.business_owners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.smb_entities s
      WHERE s.id = business_owners.smb_entity_id
        AND has_tenant_access(auth.uid(), s.tenant_id)
        AND has_portfolio_access(auth.uid(), s.portfolio_id)
    )
  );

-- Credit Scores
CREATE POLICY "Users can view scores in their tenant"
  ON public.credit_scores FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

-- Score History
CREATE POLICY "Users can view score history"
  ON public.score_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.credit_scores cs
      WHERE cs.id = score_history.credit_score_id
        AND has_tenant_access(auth.uid(), cs.tenant_id)
    )
  );

-- Data Lineage
CREATE POLICY "Users can view lineage in tenant"
  ON public.data_lineage FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

-- Underwriting Rulesets
CREATE POLICY "Users can view rulesets"
  ON public.underwriting_rulesets FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage rulesets"
  ON public.underwriting_rulesets FOR ALL
  USING (
    has_role(auth.uid(), tenant_id, 'admin') OR
    has_role(auth.uid(), tenant_id, 'risk_analyst')
  );

-- Prequal Offers
CREATE POLICY "Users can view offers in accessible portfolios"
  ON public.prequal_offers FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

-- Applications
CREATE POLICY "Users can view applications in accessible portfolios"
  ON public.applications FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

CREATE POLICY "Users can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

-- Report Jobs
CREATE POLICY "Users can view own report jobs"
  ON public.report_jobs FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can create report jobs"
  ON public.report_jobs FOR INSERT
  WITH CHECK (
    has_tenant_access(auth.uid(), tenant_id) AND
    requested_by = auth.uid()
  );

-- Risk Aggregates
CREATE POLICY "Users can view risk aggregates"
  ON public.risk_aggregates FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

-- EWS Queue
CREATE POLICY "Users can view EWS alerts"
  ON public.ews_queue FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id) AND
    has_portfolio_access(auth.uid(), portfolio_id)
  );

-- AI Insights
CREATE POLICY "Users can view insights in tenant"
  ON public.ai_insights FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

-- Audit Events
CREATE POLICY "Users can view tenant audit events"
  ON public.audit_events FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

-- API Keys
CREATE POLICY "Users can view tenant API keys"
  ON public.api_keys FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage API keys"
  ON public.api_keys FOR ALL
  USING (
    has_role(auth.uid(), tenant_id, 'admin') OR
    has_role(auth.uid(), tenant_id, 'developer')
  );

-- API Usage Logs
CREATE POLICY "Users can view usage logs"
  ON public.api_usage_logs FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

-- Webhook Configs
CREATE POLICY "Users can view webhooks"
  ON public.webhook_configs FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage webhooks"
  ON public.webhook_configs FOR ALL
  USING (has_role(auth.uid(), tenant_id, 'admin'));

-- ============================================================
-- PART 12: INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_smb_entities_portfolio ON public.smb_entities(portfolio_id);
CREATE INDEX idx_smb_entities_tenant ON public.smb_entities(tenant_id);
CREATE INDEX idx_credit_scores_smb_entity ON public.credit_scores(smb_entity_id);
CREATE INDEX idx_credit_scores_tenant ON public.credit_scores(tenant_id);
CREATE INDEX idx_score_history_smb_entity ON public.score_history(smb_entity_id);
CREATE INDEX idx_applications_portfolio ON public.applications(portfolio_id);
CREATE INDEX idx_applications_smb_entity ON public.applications(smb_entity_id);
CREATE INDEX idx_prequal_offers_portfolio ON public.prequal_offers(portfolio_id);
CREATE INDEX idx_prequal_offers_smb_entity ON public.prequal_offers(smb_entity_id);
CREATE INDEX idx_audit_events_tenant ON public.audit_events(tenant_id);
CREATE INDEX idx_audit_events_user ON public.audit_events(user_id);
CREATE INDEX idx_audit_events_created ON public.audit_events(created_at DESC);
CREATE INDEX idx_api_usage_logs_api_key ON public.api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_logs_created ON public.api_usage_logs(created_at DESC);
CREATE INDEX idx_ews_queue_portfolio ON public.ews_queue(portfolio_id);
CREATE INDEX idx_ews_queue_acknowledged ON public.ews_queue(is_acknowledged);
CREATE INDEX idx_risk_aggregates_portfolio_date ON public.risk_aggregates(portfolio_id, aggregate_date);

-- ============================================================
-- PART 13: SEED DATA (Demo Tenant & Portfolio)
-- ============================================================

-- Demo Tenant
INSERT INTO public.tenants (id, name, slug, config) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Demo Bank', 'demo-bank', '{"productTypes": ["LOC", "Term Loan", "SBA"]}');

-- Demo Portfolio
INSERT INTO public.portfolios (id, tenant_id, name, code, config) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Demo Portfolio', 'DEMO-001', '{"productTypes": ["LOC", "Term Loan"]}');

-- Demo SMB Entities
INSERT INTO public.smb_entities (id, tenant_id, portfolio_id, business_name, naics_code, business_type, address_city, address_state, annual_revenue, employee_count) VALUES
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Apex Construction LLC', '236220', 'LLC', 'Austin', 'TX', 2500000, 45),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Metro Logistics Inc', '484110', 'Corporation', 'Dallas', 'TX', 5200000, 82),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Sunrise Healthcare Group', '621111', 'LLC', 'Houston', 'TX', 8100000, 156),
  ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'TechVenture Solutions', '541511', 'Corporation', 'San Francisco', 'CA', 3400000, 28),
  ('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Green Valley Farms', '111000', 'LLC', 'Fresno', 'CA', 1800000, 35),
  ('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Coastal Hospitality LLC', '721110', 'LLC', 'Miami', 'FL', 4200000, 92),
  ('33333333-3333-3333-3333-333333333307', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Precision Manufacturing Co', '332710', 'Corporation', 'Detroit', 'MI', 12500000, 210),
  ('33333333-3333-3333-3333-333333333308', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Urban Retail Partners', '445110', 'Partnership', 'Chicago', 'IL', 950000, 18);

-- Demo Credit Scores
INSERT INTO public.credit_scores (tenant_id, smb_entity_id, source, score_type, score, risk_class, factors) VALUES
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333301', 'experian_biz', 'intelliscore', 720, 'low', '[{"code": "PH01", "description": "Strong payment history", "impact": "positive"}]'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333302', 'dnb', 'paydex', 685, 'medium', '[{"code": "AG01", "description": "Business age under 5 years", "impact": "negative"}]'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333303', 'experian_biz', 'intelliscore', 745, 'low', '[{"code": "TL01", "description": "Diverse trade lines", "impact": "positive"}]'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333304', 'equifax_biz', 'business_risk', 702, 'low', '[{"code": "CF01", "description": "Stable cash flow", "impact": "positive"}]'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333305', 'dnb', 'paydex', 658, 'medium', '[{"code": "IND01", "description": "Seasonal industry volatility", "impact": "negative"}]');

-- ============================================================
-- END OF MIGRATION
-- ============================================================

-- To apply this migration to self-hosted Supabase:
-- 1. Start your self-hosted Supabase: docker compose up -d
-- 2. Connect to Postgres: psql postgres://postgres:your-super-secret@localhost:5432/postgres
-- 3. Run this script: \i self-hosted-migration.sql

-- NOTE: The auth.users trigger requires Supabase Auth to be running.
-- For non-Supabase Postgres, you'll need to handle user creation differently.
