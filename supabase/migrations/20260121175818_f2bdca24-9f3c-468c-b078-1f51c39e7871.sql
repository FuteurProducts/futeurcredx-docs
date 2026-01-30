-- =============================================================================
-- LumiqAI MVP Schema: Credit Journey + Prequal + Underwriting Gateway
-- Bank-grade multi-tenant architecture with strict RLS
-- =============================================================================

-- ========================
-- ENUMS
-- ========================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'developer', 'risk_analyst', 'relationship_manager', 'readonly');
CREATE TYPE public.audit_action AS ENUM (
  'VIEW_PII', 'SOFT_PULL_REQUESTED', 'SCORE_VIEWED', 'PREQUAL_GENERATED', 
  'APPLICATION_SUBMITTED', 'REPORT_GENERATED', 'REPORT_DOWNLOADED', 
  'API_KEY_CREATED', 'API_KEY_REVOKED', 'SETTINGS_CHANGED', 
  'ROLE_CHANGED', 'DATA_EXPORTED', 'LOGIN', 'LOGOUT'
);
CREATE TYPE public.score_source AS ENUM ('experian_business', 'experian_consumer', 'equifax_business', 'equifax_consumer', 'dnb', 'fico');
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'declined', 'expired');
CREATE TYPE public.report_status AS ENUM ('pending', 'processing', 'ready', 'failed');
CREATE TYPE public.offer_status AS ENUM ('generated', 'viewed', 'accepted', 'declined', 'expired');

-- ========================
-- CORE IDENTITY & TENANCY
-- ========================

-- Tenants (Banks)
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  config JSONB DEFAULT '{}',
  sso_provider TEXT DEFAULT 'oidc',
  session_timeout_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Portfolios (Books/Segments within a bank)
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);

-- User Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  mfa_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Roles (separate table - security critical)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tenant_id, role)
);

-- Portfolio Access (which portfolios a user can access)
CREATE TABLE public.portfolio_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  can_export BOOLEAN DEFAULT false,
  can_create_keys BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, portfolio_id)
);

-- ========================
-- CREDIT & UNDERWRITING
-- ========================

-- SMB Entities
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
  formation_date DATE,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  annual_revenue NUMERIC,
  employee_count INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Business Owners (linked to SMB)
CREATE TABLE public.business_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  ownership_percentage NUMERIC,
  ssn_last_four TEXT,
  date_of_birth DATE,
  email TEXT,
  phone TEXT,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  is_guarantor BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Credit Scores (current state)
CREATE TABLE public.credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.business_owners(id) ON DELETE SET NULL,
  source public.score_source NOT NULL,
  score_type TEXT NOT NULL, -- 'business' or 'consumer'
  score INTEGER,
  score_range_min INTEGER DEFAULT 0,
  score_range_max INTEGER DEFAULT 100,
  risk_class TEXT,
  factors JSONB DEFAULT '[]',
  raw_response JSONB,
  pulled_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  consent_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Score History (journey tracking)
CREATE TABLE public.score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_score_id UUID NOT NULL REFERENCES public.credit_scores(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  delta INTEGER,
  source public.score_source NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Underwriting Rulesets (per tenant/portfolio)
CREATE TABLE public.underwriting_rulesets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  rules JSONB NOT NULL DEFAULT '{}',
  thresholds JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, portfolio_id, name, version)
);

-- Prequal Offers
CREATE TABLE public.prequal_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  ruleset_id UUID REFERENCES public.underwriting_rulesets(id),
  product_type TEXT NOT NULL,
  amount_min NUMERIC,
  amount_max NUMERIC,
  term_months_min INTEGER,
  term_months_max INTEGER,
  rate_min NUMERIC,
  rate_max NUMERIC,
  required_docs JSONB DEFAULT '[]',
  eligibility_factors JSONB DEFAULT '{}',
  status public.offer_status DEFAULT 'generated',
  expires_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.prequal_offers(id),
  status public.application_status DEFAULT 'draft',
  requested_amount NUMERIC,
  requested_term_months INTEGER,
  application_data JSONB DEFAULT '{}',
  decision_data JSONB,
  submitted_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========================
-- REPORTS & JOBS
-- ========================

CREATE TABLE public.report_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL,
  format TEXT DEFAULT 'pdf',
  parameters JSONB DEFAULT '{}',
  status public.report_status DEFAULT 'pending',
  artifact_url TEXT,
  artifact_expires_at TIMESTAMPTZ,
  error_message TEXT,
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================
-- AUDIT & COMPLIANCE
-- ========================

CREATE TABLE public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action public.audit_action NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Data Lineage (tracking bureau sources)
CREATE TABLE public.data_lineage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  pulled_at TIMESTAMPTZ NOT NULL,
  coverage_pct NUMERIC,
  freshness_hours INTEGER,
  consent_reference TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Insights (LangGraph outputs)
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]',
  factors JSONB DEFAULT '[]',
  confidence_score NUMERIC,
  model_version TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- ========================
-- API CONNECTIONS & KEYS
-- ========================

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  environment TEXT DEFAULT 'sandbox',
  scopes TEXT[] DEFAULT '{}',
  rate_limit_per_minute INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  error_message TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.webhook_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_hash TEXT,
  events TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========================
-- RISK AGGREGATES (for fast UI)
-- ========================

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
  computed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, portfolio_id, aggregate_date, metric_type, dimension, dimension_value)
);

-- EWS (Early Warning System) Queue
CREATE TABLE public.ews_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smb_entity_id UUID NOT NULL REFERENCES public.smb_entities(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  trigger_value NUMERIC,
  threshold_value NUMERIC,
  description TEXT,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================
-- SECURITY DEFINER FUNCTIONS
-- ========================

-- Check if user has specific role in tenant
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

-- Check if user has any role in tenant
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

-- Check if user has portfolio access
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

-- Get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- ========================
-- RLS POLICIES
-- ========================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smb_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.underwriting_rulesets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prequal_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ews_queue ENABLE ROW LEVEL SECURITY;

-- Tenants: Only users with access can view their tenant
CREATE POLICY "Users can view their tenant" ON public.tenants
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), id));

-- Portfolios: Tenant isolation + portfolio access
CREATE POLICY "Users can view accessible portfolios" ON public.portfolios
  FOR SELECT TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), id)
  );

-- Profiles: Users can view/update own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- User Roles: Only admins can manage, users can view own
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), tenant_id, 'admin') OR public.has_role(auth.uid(), tenant_id, 'super_admin'));

-- Portfolio Access: View own access
CREATE POLICY "Users can view own portfolio access" ON public.portfolio_access
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- SMB Entities: Tenant + Portfolio isolation
CREATE POLICY "Users can view SMBs in accessible portfolios" ON public.smb_entities
  FOR SELECT TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

CREATE POLICY "Users can insert SMBs in accessible portfolios" ON public.smb_entities
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

CREATE POLICY "Users can update SMBs in accessible portfolios" ON public.smb_entities
  FOR UPDATE TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

-- Business Owners: Access via SMB
CREATE POLICY "Users can view owners of accessible SMBs" ON public.business_owners
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.smb_entities s
      WHERE s.id = smb_entity_id
        AND public.has_tenant_access(auth.uid(), s.tenant_id)
        AND public.has_portfolio_access(auth.uid(), s.portfolio_id)
    )
  );

-- Credit Scores: Tenant isolation
CREATE POLICY "Users can view scores in their tenant" ON public.credit_scores
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Score History: Via credit score
CREATE POLICY "Users can view score history" ON public.score_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.credit_scores cs
      WHERE cs.id = credit_score_id
        AND public.has_tenant_access(auth.uid(), cs.tenant_id)
    )
  );

-- Underwriting Rulesets: Tenant isolation
CREATE POLICY "Users can view rulesets" ON public.underwriting_rulesets
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage rulesets" ON public.underwriting_rulesets
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), tenant_id, 'admin') OR
    public.has_role(auth.uid(), tenant_id, 'risk_analyst')
  );

-- Prequal Offers: Portfolio isolation
CREATE POLICY "Users can view offers in accessible portfolios" ON public.prequal_offers
  FOR SELECT TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

-- Applications: Portfolio isolation
CREATE POLICY "Users can view applications in accessible portfolios" ON public.applications
  FOR SELECT TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

CREATE POLICY "Users can create applications" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

-- Report Jobs: Tenant isolation
CREATE POLICY "Users can view own report jobs" ON public.report_jobs
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can create report jobs" ON public.report_jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    requested_by = auth.uid()
  );

-- Audit Events: Tenant isolation (view only)
CREATE POLICY "Users can view tenant audit events" ON public.audit_events
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Data Lineage: Tenant isolation
CREATE POLICY "Users can view lineage in tenant" ON public.data_lineage
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- AI Insights: Tenant isolation
CREATE POLICY "Users can view insights in tenant" ON public.ai_insights
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- API Keys: Tenant isolation
CREATE POLICY "Users can view tenant API keys" ON public.api_keys
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage API keys" ON public.api_keys
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), tenant_id, 'admin') OR
    public.has_role(auth.uid(), tenant_id, 'developer')
  );

-- API Usage Logs: Tenant isolation
CREATE POLICY "Users can view usage logs" ON public.api_usage_logs
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Webhook Configs: Tenant isolation
CREATE POLICY "Users can view webhooks" ON public.webhook_configs
  FOR SELECT TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage webhooks" ON public.webhook_configs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), tenant_id, 'admin'));

-- Risk Aggregates: Portfolio isolation
CREATE POLICY "Users can view risk aggregates" ON public.risk_aggregates
  FOR SELECT TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

-- EWS Queue: Portfolio isolation
CREATE POLICY "Users can view EWS alerts" ON public.ews_queue
  FOR SELECT TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id) AND
    public.has_portfolio_access(auth.uid(), portfolio_id)
  );

-- ========================
-- TRIGGERS
-- ========================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_smb_entities_updated_at BEFORE UPDATE ON public.smb_entities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_business_owners_updated_at BEFORE UPDATE ON public.business_owners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_underwriting_rulesets_updated_at BEFORE UPDATE ON public.underwriting_rulesets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_webhook_configs_updated_at BEFORE UPDATE ON public.webhook_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================
-- INDEXES FOR PERFORMANCE
-- ========================

CREATE INDEX idx_portfolios_tenant ON public.portfolios(tenant_id);
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant ON public.user_roles(tenant_id);
CREATE INDEX idx_portfolio_access_user ON public.portfolio_access(user_id);
CREATE INDEX idx_portfolio_access_portfolio ON public.portfolio_access(portfolio_id);
CREATE INDEX idx_smb_entities_tenant ON public.smb_entities(tenant_id);
CREATE INDEX idx_smb_entities_portfolio ON public.smb_entities(portfolio_id);
CREATE INDEX idx_credit_scores_smb ON public.credit_scores(smb_entity_id);
CREATE INDEX idx_credit_scores_tenant ON public.credit_scores(tenant_id);
CREATE INDEX idx_score_history_smb ON public.score_history(smb_entity_id);
CREATE INDEX idx_prequal_offers_smb ON public.prequal_offers(smb_entity_id);
CREATE INDEX idx_applications_smb ON public.applications(smb_entity_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_report_jobs_tenant ON public.report_jobs(tenant_id);
CREATE INDEX idx_report_jobs_status ON public.report_jobs(status);
CREATE INDEX idx_audit_events_tenant ON public.audit_events(tenant_id);
CREATE INDEX idx_audit_events_user ON public.audit_events(user_id);
CREATE INDEX idx_audit_events_action ON public.audit_events(action);
CREATE INDEX idx_audit_events_created ON public.audit_events(created_at DESC);
CREATE INDEX idx_api_keys_tenant ON public.api_keys(tenant_id);
CREATE INDEX idx_api_usage_logs_key ON public.api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_logs_created ON public.api_usage_logs(created_at DESC);
CREATE INDEX idx_risk_aggregates_lookup ON public.risk_aggregates(tenant_id, portfolio_id, aggregate_date);
CREATE INDEX idx_ews_queue_tenant ON public.ews_queue(tenant_id);
CREATE INDEX idx_ews_queue_severity ON public.ews_queue(severity);
CREATE INDEX idx_ai_insights_smb ON public.ai_insights(smb_entity_id);