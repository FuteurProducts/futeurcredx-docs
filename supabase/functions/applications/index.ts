// =============================================================================
// BFF API: Applications Endpoint
// GET /applications - List applications
// POST /applications - Create application (one-tap apply)
// PATCH /applications/:id - Update application status
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient, hasPortfolioAccess, hasRole, AuthContext } from '../_shared/auth.ts';
import { successResponse, errorResponse, forbiddenResponse, notFoundResponse, validationErrorResponse } from '../_shared/response.ts';
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
    const path = url.pathname.replace('/applications', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // POST /applications - Create application
    if (req.method === 'POST' && !path) {
      const body = await req.json();
      const { offerId, smbEntityId, portfolioId, requestedAmount, requestedTermMonths } = body;

      if (!smbEntityId || !portfolioId) {
        return validationErrorResponse('smbEntityId and portfolioId are required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Verify entity
      const { data: entity, error: entityError } = await supabase
        .from('smb_entities')
        .select('*')
        .eq('id', smbEntityId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (entityError || !entity) {
        return notFoundResponse('SMB Entity');
      }

      // If offer specified, validate it
      let offer = null;
      if (offerId) {
        const { data: offerData, error: offerError } = await supabase
          .from('prequal_offers')
          .select('*')
          .eq('id', offerId)
          .eq('tenant_id', auth.tenantId)
          .maybeSingle();

        if (offerError || !offerData) {
          return notFoundResponse('Offer');
        }

        // Check offer not expired
        if (new Date(offerData.expires_at) < new Date()) {
          return validationErrorResponse('Offer has expired');
        }

        offer = offerData;
      }

      // Create application
      const { data: application, error: insertError } = await serviceClient
        .from('applications')
        .insert({
          tenant_id: auth.tenantId,
          smb_entity_id: smbEntityId,
          portfolio_id: portfolioId,
          offer_id: offerId,
          status: 'submitted',
          requested_amount: requestedAmount || offer?.amount_max,
          requested_term_months: requestedTermMonths || offer?.term_months_max,
          application_data: body.applicationData || {},
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Application insert error:', insertError);
        return errorResponse('INSERT_ERROR', 'Failed to create application', 500);
      }

      // Mark offer as accepted if provided
      if (offerId) {
        await serviceClient
          .from('prequal_offers')
          .update({ status: 'accepted' })
          .eq('id', offerId);
      }

      // Audit
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'APPLICATION_SUBMITTED',
        resourceType: 'application',
        resourceId: application.id,
        details: { 
          smbEntityId,
          offerId,
          requestedAmount: application.requested_amount,
          businessName: entity.business_name
        },
        ...extractClientInfo(req)
      });

      return successResponse({
        id: application.id,
        status: application.status,
        submittedAt: application.submitted_at,
        requestedAmount: application.requested_amount
      }, {
        lastUpdated: new Date().toISOString()
      });
    }

    // GET /applications - List applications
    if (req.method === 'GET' && !path.startsWith('/')) {
      const portfolioId = url.searchParams.get('portfolioId');
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
        .from('applications')
        .select(`
          *,
          smb_entities(id, business_name),
          prequal_offers(id, product_type)
        `, { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .eq('portfolio_id', portfolioId)
        .order('submitted_at', { ascending: false });

      if (status) query = query.eq('status', status);

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      return successResponse(data?.map(a => ({
        id: a.id,
        smbEntityId: a.smb_entity_id,
        businessName: a.smb_entities?.business_name,
        portfolioId: a.portfolio_id,
        offerId: a.offer_id,
        productType: a.prequal_offers?.product_type,
        status: a.status,
        requestedAmount: a.requested_amount,
        requestedTermMonths: a.requested_term_months,
        submittedAt: a.submitted_at,
        decidedAt: a.decided_at
      })) || [], {
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    // PATCH /applications/:id - Update status (for underwriters)
    if (req.method === 'PATCH' && path.startsWith('/')) {
      const applicationId = path.slice(1);
      const body = await req.json();
      const { status, decisionData } = body;

      if (!hasRole(auth, 'risk_analyst')) {
        return forbiddenResponse('Risk analyst role required');
      }

      const validStatuses = ['under_review', 'approved', 'declined', 'expired'];
      if (!validStatuses.includes(status)) {
        return validationErrorResponse(`status must be one of: ${validStatuses.join(', ')}`);
      }

      const { data: app, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (appError || !app) {
        return notFoundResponse('Application');
      }

      const updateData: Record<string, any> = { status };
      if (['approved', 'declined'].includes(status)) {
        updateData.decided_at = new Date().toISOString();
        updateData.decided_by = auth.userId;
        updateData.decision_data = decisionData || {};
      }

      const { error: updateError } = await serviceClient
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);

      if (updateError) {
        return errorResponse('UPDATE_ERROR', updateError.message, 500);
      }

      return successResponse({ id: applicationId, status, updated: true });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Applications endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
