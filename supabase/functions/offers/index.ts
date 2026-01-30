// =============================================================================
// BFF API: Prequal & Offers Endpoint
// GET /offers - List offers for entity/portfolio
// POST /offers/generate - Generate prequal offers
// PATCH /offers/:id - Update offer status (view, accept, decline)
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
    const path = url.pathname.replace('/offers', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // POST /offers/generate - Generate prequal offers based on scores
    if (req.method === 'POST' && path === '/generate') {
      const body = await req.json();
      const { smbEntityId, portfolioId } = body;

      if (!smbEntityId || !portfolioId) {
        return validationErrorResponse('smbEntityId and portfolioId are required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Get entity
      const { data: entity, error: entityError } = await supabase
        .from('smb_entities')
        .select('*')
        .eq('id', smbEntityId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (entityError || !entity) {
        return notFoundResponse('SMB Entity');
      }

      // Get latest scores
      const { data: scores } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('smb_entity_id', smbEntityId)
        .order('pulled_at', { ascending: false })
        .limit(5);

      // Get active ruleset
      const { data: ruleset } = await supabase
        .from('underwriting_rulesets')
        .select('*')
        .eq('tenant_id', auth.tenantId)
        .or(`portfolio_id.eq.${portfolioId},portfolio_id.is.null`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Mock prequal logic
      const avgScore = scores?.length 
        ? scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length 
        : 650;

      const offers = [];

      // Generate offers based on score
      if (avgScore >= 700) {
        offers.push({
          productType: 'term_loan',
          amountMin: 50000,
          amountMax: 500000,
          termMonthsMin: 12,
          termMonthsMax: 60,
          rateMin: 6.5,
          rateMax: 9.5,
          requiredDocs: ['bank_statements', 'tax_returns'],
          eligibilityFactors: { avgScore, tier: 'prime' }
        });
        offers.push({
          productType: 'line_of_credit',
          amountMin: 25000,
          amountMax: 250000,
          termMonthsMin: 12,
          termMonthsMax: 24,
          rateMin: 8.0,
          rateMax: 12.0,
          requiredDocs: ['bank_statements'],
          eligibilityFactors: { avgScore, tier: 'prime' }
        });
      } else if (avgScore >= 650) {
        offers.push({
          productType: 'term_loan',
          amountMin: 25000,
          amountMax: 150000,
          termMonthsMin: 12,
          termMonthsMax: 36,
          rateMin: 12.0,
          rateMax: 18.0,
          requiredDocs: ['bank_statements', 'tax_returns', 'financial_statements'],
          eligibilityFactors: { avgScore, tier: 'near_prime' }
        });
      }

      // Store offers
      const offersToInsert = offers.map(o => ({
        tenant_id: auth.tenantId,
        smb_entity_id: smbEntityId,
        portfolio_id: portfolioId,
        ruleset_id: ruleset?.id,
        product_type: o.productType,
        amount_min: o.amountMin,
        amount_max: o.amountMax,
        term_months_min: o.termMonthsMin,
        term_months_max: o.termMonthsMax,
        rate_min: o.rateMin,
        rate_max: o.rateMax,
        required_docs: o.requiredDocs,
        eligibility_factors: o.eligibilityFactors,
        status: 'generated',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }));

      const { data: insertedOffers, error: insertError } = await serviceClient
        .from('prequal_offers')
        .insert(offersToInsert)
        .select();

      if (insertError) {
        console.error('Offer insert error:', insertError);
        return errorResponse('INSERT_ERROR', 'Failed to store offers', 500);
      }

      // Audit
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'PREQUAL_GENERATED',
        resourceType: 'smb_entity',
        resourceId: smbEntityId,
        details: { 
          offersGenerated: insertedOffers?.length,
          avgScore,
          businessName: entity.business_name
        },
        ...extractClientInfo(req)
      });

      return successResponse({
        smbEntityId,
        offers: insertedOffers?.map(o => ({
          id: o.id,
          productType: o.product_type,
          amountRange: { min: o.amount_min, max: o.amount_max },
          termRange: { min: o.term_months_min, max: o.term_months_max },
          rateRange: { min: o.rate_min, max: o.rate_max },
          requiredDocs: o.required_docs,
          status: o.status,
          expiresAt: o.expires_at
        }))
      }, {
        lastUpdated: new Date().toISOString(),
        dataSources: [{
          name: 'underwriting_engine',
          type: 'internal',
          pulledAt: new Date().toISOString(),
          coveragePct: 100
        }]
      });
    }

    // GET /offers - List offers
    if (req.method === 'GET' && !path.startsWith('/')) {
      const portfolioId = url.searchParams.get('portfolioId');
      const smbEntityId = url.searchParams.get('smbEntityId');
      const status = url.searchParams.get('status');
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
        .from('prequal_offers')
        .select(`
          *,
          smb_entities(id, business_name)
        `, { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false });

      if (smbEntityId) query = query.eq('smb_entity_id', smbEntityId);
      if (status) query = query.eq('status', status);

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      return successResponse(data?.map(o => ({
        id: o.id,
        smbEntityId: o.smb_entity_id,
        businessName: o.smb_entities?.business_name,
        productType: o.product_type,
        amountRange: { min: o.amount_min, max: o.amount_max },
        termRange: { min: o.term_months_min, max: o.term_months_max },
        rateRange: { min: o.rate_min, max: o.rate_max },
        status: o.status,
        createdAt: o.created_at,
        expiresAt: o.expires_at
      })) || [], {
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    // PATCH /offers/:id - Update offer status
    if (req.method === 'PATCH' && path.startsWith('/')) {
      const offerId = path.slice(1);
      const body = await req.json();
      const { status } = body;

      if (!['viewed', 'accepted', 'declined'].includes(status)) {
        return validationErrorResponse('status must be viewed, accepted, or declined');
      }

      const { data: offer, error: offerError } = await supabase
        .from('prequal_offers')
        .select('*, smb_entities(portfolio_id)')
        .eq('id', offerId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (offerError || !offer) {
        return notFoundResponse('Offer');
      }

      if (!hasPortfolioAccess(auth, offer.smb_entities?.portfolio_id)) {
        return forbiddenResponse('No access to this portfolio');
      }

      const updateData: Record<string, any> = { status };
      if (status === 'viewed' && !offer.viewed_at) {
        updateData.viewed_at = new Date().toISOString();
      }

      const { error: updateError } = await serviceClient
        .from('prequal_offers')
        .update(updateData)
        .eq('id', offerId);

      if (updateError) {
        return errorResponse('UPDATE_ERROR', updateError.message, 500);
      }

      return successResponse({ id: offerId, status, updated: true });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Offers endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
