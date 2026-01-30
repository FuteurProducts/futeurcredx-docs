// =============================================================================
// BFF API: Risk Analytics Endpoint
// GET /risk/summary - Executive risk summary
// GET /risk/ews - Early warning queue
// GET /risk/aggregates - Risk aggregates (heatmaps, concentrations)
// POST /risk/ews/:id/acknowledge - Acknowledge EWS alert
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient, hasPortfolioAccess, hasRole, AuthContext } from '../_shared/auth.ts';
import { successResponse, errorResponse, forbiddenResponse, notFoundResponse, validationErrorResponse } from '../_shared/response.ts';

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
    const path = url.pathname.replace('/risk', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // GET /risk/summary - Executive summary
    if (req.method === 'GET' && path === '/summary') {
      const portfolioId = url.searchParams.get('portfolioId');

      // MANDATORY: portfolioId is required for all risk operations
      if (!portfolioId) {
        return validationErrorResponse('portfolioId is required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Get scores for distribution
      const { data: scores } = await supabase
        .from('credit_scores')
        .select('score, risk_class, source, smb_entities!inner(portfolio_id)')
        .eq('tenant_id', auth.tenantId)
        .eq('smb_entities.portfolio_id', portfolioId);

      // Calculate distributions
      const distribution = {
        excellent: scores?.filter(s => (s.score || 0) >= 750).length || 0,
        good: scores?.filter(s => (s.score || 0) >= 700 && (s.score || 0) < 750).length || 0,
        fair: scores?.filter(s => (s.score || 0) >= 650 && (s.score || 0) < 700).length || 0,
        poor: scores?.filter(s => (s.score || 0) >= 600 && (s.score || 0) < 650).length || 0,
        veryPoor: scores?.filter(s => (s.score || 0) < 600).length || 0
      };

      const riskClassCounts = {
        low: scores?.filter(s => s.risk_class === 'low').length || 0,
        medium: scores?.filter(s => s.risk_class === 'medium').length || 0,
        high: scores?.filter(s => s.risk_class === 'high').length || 0
      };

      // Get EWS counts (portfolioId already validated above)
      const { count: ewsCount } = await supabase
        .from('ews_queue')
        .select('severity', { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .eq('portfolio_id', portfolioId)
        .eq('is_acknowledged', false);

      const avgScore = scores?.length 
        ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length)
        : 0;

      return successResponse({
        totalEntities: scores?.length || 0,
        avgScore,
        scoreDistribution: distribution,
        riskClassDistribution: riskClassCounts,
        activeAlerts: ewsCount || 0,
        portfolioHealthScore: Math.min(100, Math.max(0, Math.round((avgScore - 300) / 5.5)))
      }, {
        lastUpdated: new Date().toISOString()
      });
    }

    // GET /risk/ews - Early warning queue
    if (req.method === 'GET' && path === '/ews') {
      const portfolioId = url.searchParams.get('portfolioId');
      const severity = url.searchParams.get('severity');
      const acknowledged = url.searchParams.get('acknowledged');
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '50'), 100);

      // MANDATORY: portfolioId is required for all risk operations
      if (!portfolioId) {
        return validationErrorResponse('portfolioId is required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      let query = supabase
        .from('ews_queue')
        .select(`
          *,
          smb_entities(id, business_name)
        `, { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false });

      if (severity) query = query.eq('severity', severity);
      if (acknowledged !== null) query = query.eq('is_acknowledged', acknowledged === 'true');

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
        alertType: a.alert_type,
        severity: a.severity,
        triggerValue: a.trigger_value,
        thresholdValue: a.threshold_value,
        description: a.description,
        isAcknowledged: a.is_acknowledged,
        acknowledgedAt: a.acknowledged_at,
        createdAt: a.created_at
      })) || [], {
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    // GET /risk/aggregates - Heatmaps, concentrations
    if (req.method === 'GET' && path === '/aggregates') {
      const portfolioId = url.searchParams.get('portfolioId');
      const metricType = url.searchParams.get('metricType');
      const startDate = url.searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = url.searchParams.get('endDate') || new Date().toISOString().split('T')[0];

      // MANDATORY: portfolioId is required for all risk operations
      if (!portfolioId) {
        return validationErrorResponse('portfolioId is required');
      }

      if (!hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      let query = supabase
        .from('risk_aggregates')
        .select('*')
        .eq('tenant_id', auth.tenantId)
        .eq('portfolio_id', portfolioId)
        .gte('aggregate_date', startDate)
        .lte('aggregate_date', endDate)
        .order('aggregate_date', { ascending: false });

      if (metricType) query = query.eq('metric_type', metricType);

      const { data, error } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      // Group by metric type
      const byMetricType: Record<string, any[]> = {};
      data?.forEach(r => {
        if (!byMetricType[r.metric_type]) {
          byMetricType[r.metric_type] = [];
        }
        byMetricType[r.metric_type].push({
          date: r.aggregate_date,
          dimension: r.dimension,
          dimensionValue: r.dimension_value,
          count: r.count,
          sum: r.sum_value,
          avg: r.avg_value,
          min: r.min_value,
          max: r.max_value
        });
      });

      return successResponse({
        aggregates: byMetricType,
        dateRange: { start: startDate, end: endDate }
      });
    }

    // POST /risk/ews/:id/acknowledge
    if (req.method === 'POST' && path.match(/^\/ews\/[^/]+\/acknowledge$/)) {
      const alertId = path.split('/')[2];

      if (!hasRole(auth, 'risk_analyst')) {
        return forbiddenResponse('Risk analyst role required');
      }

      const { data: alert, error: alertError } = await supabase
        .from('ews_queue')
        .select('*')
        .eq('id', alertId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (alertError || !alert) {
        return notFoundResponse('EWS Alert');
      }

      const { error: updateError } = await serviceClient
        .from('ews_queue')
        .update({
          is_acknowledged: true,
          acknowledged_by: auth.userId,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (updateError) {
        return errorResponse('UPDATE_ERROR', updateError.message, 500);
      }

      return successResponse({ id: alertId, acknowledged: true });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Risk endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
