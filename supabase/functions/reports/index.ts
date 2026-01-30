// =============================================================================
// BFF API: Reports Endpoint
// GET /reports - List report jobs
// POST /reports - Create report job (async)
// GET /reports/:id - Get report status/download
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient, hasPortfolioAccess, AuthContext } from '../_shared/auth.ts';
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
    const path = url.pathname.replace('/reports', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // POST /reports - Create report job
    if (req.method === 'POST' && !path) {
      const body = await req.json();
      const { reportType, portfolioId, format = 'pdf', parameters = {} } = body;

      if (!reportType) {
        return validationErrorResponse('reportType is required');
      }

      const validTypes = ['portfolio_summary', 'credit_pull_history', 'compliance_audit', 'customer_dossier', 'risk_analysis'];
      if (!validTypes.includes(reportType)) {
        return validationErrorResponse(`reportType must be one of: ${validTypes.join(', ')}`);
      }

      if (portfolioId && !hasPortfolioAccess(auth, portfolioId)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // Create job
      const { data: job, error: insertError } = await serviceClient
        .from('report_jobs')
        .insert({
          tenant_id: auth.tenantId,
          portfolio_id: portfolioId,
          report_type: reportType,
          format,
          parameters,
          status: 'pending',
          requested_by: auth.userId
        })
        .select()
        .single();

      if (insertError) {
        console.error('Report job insert error:', insertError);
        return errorResponse('INSERT_ERROR', 'Failed to create report job', 500);
      }

      // Audit
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'REPORT_GENERATED',
        resourceType: 'report_job',
        resourceId: job.id,
        details: { reportType, format, portfolioId },
        ...extractClientInfo(req)
      });

      // Simulate async processing (in production, this would be handled by n8n)
      // For MVP, we'll mark it as ready after a delay
      setTimeout(async () => {
        const mockArtifactUrl = `https://storage.example.com/reports/${job.id}.${format}`;
        await serviceClient
          .from('report_jobs')
          .update({
            status: 'ready',
            artifact_url: mockArtifactUrl,
            artifact_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            started_at: new Date(Date.now() - 5000).toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);
      }, 3000);

      return successResponse({
        id: job.id,
        reportType,
        status: 'pending',
        createdAt: job.created_at
      }, {
        lastUpdated: new Date().toISOString()
      });
    }

    // GET /reports - List report jobs
    if (req.method === 'GET' && !path.startsWith('/')) {
      const status = url.searchParams.get('status');
      const reportType = url.searchParams.get('reportType');
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '50'), 100);

      let query = supabase
        .from('report_jobs')
        .select('*', { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (reportType) query = query.eq('report_type', reportType);

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      return successResponse(data?.map(r => ({
        id: r.id,
        reportType: r.report_type,
        format: r.format,
        status: r.status,
        artifactUrl: r.artifact_url,
        artifactExpiresAt: r.artifact_expires_at,
        errorMessage: r.error_message,
        createdAt: r.created_at,
        completedAt: r.completed_at
      })) || [], {
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    // GET /reports/:id - Get single report
    if (req.method === 'GET' && path.startsWith('/')) {
      const reportId = path.slice(1);

      // Check for download query param
      const download = url.searchParams.get('download') === 'true';

      const { data: report, error } = await supabase
        .from('report_jobs')
        .select('*')
        .eq('id', reportId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (error || !report) {
        return notFoundResponse('Report');
      }

      if (report.portfolio_id && !hasPortfolioAccess(auth, report.portfolio_id)) {
        return forbiddenResponse('No access to this portfolio');
      }

      // If downloading, audit it
      if (download && report.status === 'ready') {
        await writeAuditEvent({
          tenantId: auth.tenantId,
          userId: auth.userId,
          action: 'REPORT_DOWNLOADED',
          resourceType: 'report_job',
          resourceId: reportId,
          details: { reportType: report.report_type },
          ...extractClientInfo(req)
        });
      }

      return successResponse({
        id: report.id,
        reportType: report.report_type,
        format: report.format,
        parameters: report.parameters,
        status: report.status,
        artifactUrl: report.artifact_url,
        artifactExpiresAt: report.artifact_expires_at,
        errorMessage: report.error_message,
        createdAt: report.created_at,
        startedAt: report.started_at,
        completedAt: report.completed_at
      }, {
        lastUpdated: report.completed_at || report.created_at
      });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Reports endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
