// =============================================================================
// BFF API: Customers/SMB Entities Endpoint
// GET /customers - List SMB entities
// GET /customers/:id - Get customer dossier
// POST /customers - Create SMB entity
// PATCH /customers/:id - Update SMB entity
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient, hasPortfolioAccess, AuthContext } from '../_shared/auth.ts';
import { successResponse, errorResponse, forbiddenResponse, notFoundResponse, validationErrorResponse, DataSource } from '../_shared/response.ts';
import { writeAuditEvent, extractClientInfo } from '../_shared/audit.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authResult = await authenticateRequest(req);
    if ('error' in authResult) {
      return errorResponse(authResult.code, authResult.error, authResult.status);
    }
    const auth: AuthContext = authResult;

    const url = new URL(req.url);
    const path = url.pathname.replace('/customers', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // GET /customers - List entities
    if (req.method === 'GET' && !path.startsWith('/')) {
      const portfolioId = url.searchParams.get('portfolioId');
      const search = url.searchParams.get('search');
      const riskClass = url.searchParams.get('riskClass');
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '50'), 100);

      // MANDATORY: portfolioId is required for all list operations
      if (!portfolioId) {
        return validationErrorResponse('portfolioId is required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      let query = supabase
        .from('smb_entities')
        .select('*', { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .eq('portfolio_id', portfolioId)
        .order('business_name', { ascending: true });
      if (search) {
        query = query.or(`business_name.ilike.%${search}%,dba_name.ilike.%${search}%,ein.ilike.%${search}%`);
      }

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      // Get latest scores for each entity
      const entityIds = data?.map(e => e.id) || [];
      const { data: scores } = entityIds.length > 0 ? await supabase
        .from('credit_scores')
        .select('smb_entity_id, score, risk_class, source, pulled_at')
        .in('smb_entity_id', entityIds)
        .order('pulled_at', { ascending: false }) : { data: [] };

      // Map scores to entities
      const scoresByEntity: Record<string, any> = {};
      scores?.forEach(s => {
        if (!scoresByEntity[s.smb_entity_id]) {
          scoresByEntity[s.smb_entity_id] = s;
        }
      });

      let filtered = data || [];
      if (riskClass) {
        filtered = filtered.filter(e => scoresByEntity[e.id]?.risk_class === riskClass);
      }

      return successResponse(filtered.map(e => ({
        id: e.id,
        businessName: e.business_name,
        dbaName: e.dba_name,
        ein: e.ein,
        naicsCode: e.naics_code,
        businessType: e.business_type,
        addressCity: e.address_city,
        addressState: e.address_state,
        annualRevenue: e.annual_revenue,
        employeeCount: e.employee_count,
        latestScore: scoresByEntity[e.id]?.score,
        riskClass: scoresByEntity[e.id]?.risk_class,
        lastScorePull: scoresByEntity[e.id]?.pulled_at,
        createdAt: e.created_at
      })), {
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    // GET /customers/:id - Customer dossier
    if (req.method === 'GET' && path.startsWith('/') && !path.includes('/owners')) {
      const entityId = path.slice(1);

      const { data: entity, error } = await supabase
        .from('smb_entities')
        .select('*')
        .eq('id', entityId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (error || !entity) {
        return notFoundResponse('Customer');
      }

      if (!hasPortfolioAccess(auth, entity.portfolio_id)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Get owners
      const { data: owners } = await supabase
        .from('business_owners')
        .select('*')
        .eq('smb_entity_id', entityId);

      // Get scores
      const { data: scores } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('smb_entity_id', entityId)
        .order('pulled_at', { ascending: false });

      // Get offers
      const { data: offers } = await supabase
        .from('prequal_offers')
        .select('*')
        .eq('smb_entity_id', entityId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get applications
      const { data: applications } = await supabase
        .from('applications')
        .select('*')
        .eq('smb_entity_id', entityId)
        .order('submitted_at', { ascending: false })
        .limit(5);

      // Get AI insights
      const { data: insights } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('smb_entity_id', entityId)
        .order('generated_at', { ascending: false })
        .limit(3);

      // Get lineage
      const { data: lineage } = await supabase
        .from('data_lineage')
        .select('*')
        .eq('resource_type', 'smb_entity')
        .eq('resource_id', entityId);

      // Audit PII view
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'VIEW_PII',
        resourceType: 'smb_entity',
        resourceId: entityId,
        details: { businessName: entity.business_name },
        ...extractClientInfo(req)
      });

      const dataSources: DataSource[] = lineage?.map(l => ({
        name: l.source_name,
        type: l.source_type,
        pulledAt: l.pulled_at,
        coveragePct: l.coverage_pct,
        freshnessHours: l.freshness_hours
      })) || [];

      return successResponse({
        entity: {
          id: entity.id,
          businessName: entity.business_name,
          dbaName: entity.dba_name,
          ein: entity.ein,
          dunsNumber: entity.duns_number,
          naicsCode: entity.naics_code,
          sicCode: entity.sic_code,
          businessType: entity.business_type,
          formationDate: entity.formation_date,
          address: {
            street: entity.address_street,
            city: entity.address_city,
            state: entity.address_state,
            zip: entity.address_zip
          },
          phone: entity.phone,
          email: entity.email,
          website: entity.website,
          annualRevenue: entity.annual_revenue,
          employeeCount: entity.employee_count
        },
        owners: owners?.map(o => ({
          id: o.id,
          name: `${o.first_name} ${o.last_name}`,
          ownershipPercentage: o.ownership_percentage,
          isGuarantor: o.is_guarantor,
          email: o.email
        })),
        scores: scores?.map(s => ({
          id: s.id,
          source: s.source,
          scoreType: s.score_type,
          score: s.score,
          riskClass: s.risk_class,
          factors: s.factors,
          pulledAt: s.pulled_at
        })),
        offers: offers?.map(o => ({
          id: o.id,
          productType: o.product_type,
          amountRange: { min: o.amount_min, max: o.amount_max },
          status: o.status,
          createdAt: o.created_at
        })),
        applications: applications?.map(a => ({
          id: a.id,
          status: a.status,
          requestedAmount: a.requested_amount,
          submittedAt: a.submitted_at
        })),
        insights: insights?.map(i => ({
          id: i.id,
          type: i.insight_type,
          title: i.title,
          content: i.content,
          recommendations: i.recommendations,
          generatedAt: i.generated_at
        }))
      }, {
        lastUpdated: entity.updated_at,
        dataSources,
        coveragePct: lineage?.length ? Math.round(lineage.reduce((sum, l) => sum + (l.coverage_pct || 0), 0) / lineage.length) : 100
      });
    }

    // POST /customers - Create entity
    if (req.method === 'POST' && !path) {
      const body = await req.json();
      const { portfolioId, businessName, ...entityData } = body;

      if (!portfolioId || !businessName) {
        return validationErrorResponse('portfolioId and businessName are required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      const { data: entity, error: insertError } = await serviceClient
        .from('smb_entities')
        .insert({
          tenant_id: auth.tenantId,
          portfolio_id: portfolioId,
          business_name: businessName,
          dba_name: entityData.dbaName,
          ein: entityData.ein,
          duns_number: entityData.dunsNumber,
          naics_code: entityData.naicsCode,
          sic_code: entityData.sicCode,
          business_type: entityData.businessType,
          formation_date: entityData.formationDate,
          address_street: entityData.addressStreet,
          address_city: entityData.addressCity,
          address_state: entityData.addressState,
          address_zip: entityData.addressZip,
          phone: entityData.phone,
          email: entityData.email,
          website: entityData.website,
          annual_revenue: entityData.annualRevenue,
          employee_count: entityData.employeeCount,
          metadata: entityData.metadata || {}
        })
        .select()
        .single();

      if (insertError) {
        console.error('Entity insert error:', insertError);
        return errorResponse('INSERT_ERROR', 'Failed to create customer', 500);
      }

      return successResponse({
        id: entity.id,
        businessName: entity.business_name,
        createdAt: entity.created_at
      }, {
        lastUpdated: new Date().toISOString()
      });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Customers endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
