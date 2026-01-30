// =============================================================================
// BFF API: Credit Scores Endpoint
// GET /scores - List scores for entity/portfolio
// POST /scores/pull - Trigger soft pull (mock for MVP)
// GET /scores/:id - Get single score with lineage
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient, hasPortfolioAccess, AuthContext } from '../_shared/auth.ts';
import { successResponse, errorResponse, forbiddenResponse, notFoundResponse, validationErrorResponse, DataSource } from '../_shared/response.ts';
import { writeAuditEvent, writeDataLineage, extractClientInfo } from '../_shared/audit.ts';

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
    const path = url.pathname.replace('/scores', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // POST /scores/pull - Trigger score pull
    if (req.method === 'POST' && path === '/pull') {
      const body = await req.json();
      const { smbEntityId, bureaus = ['experian_business', 'fico'] } = body;

      if (!smbEntityId) {
        return validationErrorResponse('smbEntityId is required');
      }

      // Verify entity exists and user has access
      const { data: entity, error: entityError } = await supabase
        .from('smb_entities')
        .select('id, tenant_id, portfolio_id, business_name')
        .eq('id', smbEntityId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (entityError || !entity) {
        return notFoundResponse('SMB Entity');
      }

      if (!hasPortfolioAccess(auth, entity.portfolio_id)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Log audit event for soft pull request
      const clientInfo = extractClientInfo(req);
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'SOFT_PULL_REQUESTED',
        resourceType: 'smb_entity',
        resourceId: smbEntityId,
        details: { bureaus, businessName: entity.business_name },
        ...clientInfo
      });

      // Mock bureau pull - in production this would call real APIs
      const mockScores = bureaus.map((bureau: string) => ({
        source: bureau,
        score: Math.floor(Math.random() * 200) + 600, // 600-800 range
        scoreType: bureau.includes('consumer') ? 'consumer' : 'business',
        riskClass: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
        factors: [
          { code: 'F001', description: 'Payment history', impact: 'positive' },
          { code: 'F002', description: 'Credit utilization', impact: Math.random() > 0.5 ? 'positive' : 'negative' },
          { code: 'F003', description: 'Account age', impact: 'neutral' }
        ]
      }));

      // Store scores
      const scoresToInsert = mockScores.map((s: any) => ({
        tenant_id: auth.tenantId,
        smb_entity_id: smbEntityId,
        source: s.source,
        score_type: s.scoreType,
        score: s.score,
        score_range_min: 300,
        score_range_max: 850,
        risk_class: s.riskClass,
        factors: s.factors,
        pulled_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }));

      const { data: insertedScores, error: insertError } = await serviceClient
        .from('credit_scores')
        .insert(scoresToInsert)
        .select();

      if (insertError) {
        console.error('Score insert error:', insertError);
        return errorResponse('INSERT_ERROR', 'Failed to store scores', 500);
      }

      // Write score history
      for (const score of insertedScores || []) {
        await serviceClient.from('score_history').insert({
          credit_score_id: score.id,
          smb_entity_id: smbEntityId,
          score: score.score,
          source: score.source,
          recorded_at: new Date().toISOString()
        });

        // Write data lineage
        await writeDataLineage({
          tenantId: auth.tenantId,
          resourceType: 'credit_score',
          resourceId: score.id,
          sourceName: score.source,
          sourceType: 'bureau',
          coveragePct: 95,
          freshnessHours: 0
        });
      }

      const dataSources: DataSource[] = bureaus.map((b: string) => ({
        name: b,
        type: 'bureau',
        pulledAt: new Date().toISOString(),
        coveragePct: 95,
        freshnessHours: 0
      }));

      return successResponse({
        smbEntityId,
        scores: mockScores,
        pullId: insertedScores?.[0]?.id
      }, {
        lastUpdated: new Date().toISOString(),
        dataSources,
        coveragePct: 95
      });
    }

    // GET /scores - List scores
    if (req.method === 'GET' && !path.startsWith('/')) {
      const portfolioId = url.searchParams.get('portfolioId');
      const smbEntityId = url.searchParams.get('smbEntityId');
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
        .from('credit_scores')
        .select(`
          *,
          smb_entities!inner(id, business_name, portfolio_id)
        `, { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .eq('smb_entities.portfolio_id', portfolioId)
        .order('pulled_at', { ascending: false });

      if (smbEntityId) {
        query = query.eq('smb_entity_id', smbEntityId);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      // Log score view audit
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'SCORE_VIEWED',
        resourceType: 'credit_scores',
        details: { portfolioId, smbEntityId, count },
        ...extractClientInfo(req)
      });

      const scores = data?.map(s => ({
        id: s.id,
        smbEntityId: s.smb_entity_id,
        businessName: s.smb_entities?.business_name,
        source: s.source,
        scoreType: s.score_type,
        score: s.score,
        scoreRangeMin: s.score_range_min,
        scoreRangeMax: s.score_range_max,
        riskClass: s.risk_class,
        factors: s.factors,
        pulledAt: s.pulled_at,
        expiresAt: s.expires_at
      })) || [];

      return successResponse(scores, {
        lastUpdated: data?.[0]?.pulled_at,
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    // GET /scores/:id - Single score with lineage
    if (req.method === 'GET' && path.startsWith('/')) {
      const scoreId = path.slice(1);
      
      const { data: score, error } = await supabase
        .from('credit_scores')
        .select(`
          *,
          smb_entities(id, business_name, portfolio_id)
        `)
        .eq('id', scoreId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (error || !score) {
        return notFoundResponse('Credit Score');
      }

      if (!hasPortfolioAccess(auth, score.smb_entities?.portfolio_id)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Get lineage
      const { data: lineage } = await supabase
        .from('data_lineage')
        .select('*')
        .eq('resource_type', 'credit_score')
        .eq('resource_id', scoreId);

      const dataSources: DataSource[] = lineage?.map(l => ({
        name: l.source_name,
        type: l.source_type,
        pulledAt: l.pulled_at,
        coveragePct: l.coverage_pct,
        freshnessHours: l.freshness_hours
      })) || [];

      return successResponse({
        id: score.id,
        smbEntityId: score.smb_entity_id,
        businessName: score.smb_entities?.business_name,
        source: score.source,
        scoreType: score.score_type,
        score: score.score,
        riskClass: score.risk_class,
        factors: score.factors,
        pulledAt: score.pulled_at,
        expiresAt: score.expires_at
      }, {
        lastUpdated: score.pulled_at,
        dataSources,
        coveragePct: lineage?.[0]?.coverage_pct || 100
      });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Scores endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
