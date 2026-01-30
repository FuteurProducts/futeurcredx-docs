// =============================================================================
// BFF API: Audit Events Endpoint
// POST /audit/events - Ingest audit events from frontend
// GET /audit/events - Retrieve audit log with filters
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, hasRole, AuthContext } from '../_shared/auth.ts';
import { successResponse, errorResponse, forbiddenResponse, validationErrorResponse } from '../_shared/response.ts';
import { writeAuditEvent, extractClientInfo, AuditAction } from '../_shared/audit.ts';

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Authenticate
    const authResult = await authenticateRequest(req);
    if ('error' in authResult) {
      return errorResponse(authResult.code, authResult.error, authResult.status);
    }
    const auth: AuthContext = authResult;

    const url = new URL(req.url);
    
    if (req.method === 'POST') {
      // Ingest audit event from frontend
      const body = await req.json();
      
      if (!body.action || !body.resourceType) {
        return validationErrorResponse('action and resourceType are required');
      }

      const validActions: AuditAction[] = [
        'VIEW_PII', 'SOFT_PULL_REQUESTED', 'SCORE_VIEWED', 'PREQUAL_GENERATED',
        'APPLICATION_SUBMITTED', 'REPORT_GENERATED', 'REPORT_DOWNLOADED',
        'API_KEY_CREATED', 'API_KEY_REVOKED', 'SETTINGS_CHANGED',
        'ROLE_CHANGED', 'DATA_EXPORTED', 'LOGIN', 'LOGOUT'
      ];

      if (!validActions.includes(body.action)) {
        return validationErrorResponse(`Invalid action. Must be one of: ${validActions.join(', ')}`);
      }

      const clientInfo = extractClientInfo(req);
      
      const result = await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: body.action,
        resourceType: body.resourceType,
        resourceId: body.resourceId,
        details: body.details,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        sessionId: body.sessionId
      });

      if (!result.success) {
        return errorResponse('AUDIT_WRITE_FAILED', result.error || 'Failed to write audit event', 500);
      }

      return successResponse({ recorded: true });
    }

    if (req.method === 'GET') {
      // Retrieve audit log
      if (!hasRole(auth, 'admin')) {
        return forbiddenResponse('Admin role required to view audit logs');
      }

      const supabase = createAuthenticatedClient(req);
      
      // Parse query params
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '50'), 100);
      const action = url.searchParams.get('action');
      const userId = url.searchParams.get('userId');
      const resourceType = url.searchParams.get('resourceType');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');

      let query = supabase
        .from('audit_events')
        .select('*', { count: 'exact' })
        .eq('tenant_id', auth.tenantId)
        .order('created_at', { ascending: false });

      if (action) query = query.eq('action', action);
      if (userId) query = query.eq('user_id', userId);
      if (resourceType) query = query.eq('resource_type', resourceType);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      // Transform to camelCase for frontend
      const events = data?.map(e => ({
        id: e.id,
        userId: e.user_id,
        action: e.action,
        resourceType: e.resource_type,
        resourceId: e.resource_id,
        details: e.details,
        ipAddress: e.ip_address,
        userAgent: e.user_agent,
        createdAt: e.created_at
      })) || [];

      return successResponse(events, {
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('Audit endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
