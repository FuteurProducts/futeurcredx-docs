// =============================================================================
// BFF API: API Keys Endpoint
// GET /api-keys - List keys
// POST /api-keys - Create key
// DELETE /api-keys/:id - Revoke key
// GET /api-keys/usage - Usage stats
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient, hasRole, AuthContext } from '../_shared/auth.ts';
import { successResponse, errorResponse, forbiddenResponse, notFoundResponse, validationErrorResponse } from '../_shared/response.ts';
import { writeAuditEvent, extractClientInfo } from '../_shared/audit.ts';

// Simple hash function for API keys
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'lq_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

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
    const path = url.pathname.replace('/api-keys', '');
    const supabase = createAuthenticatedClient(req);
    const serviceClient = createServiceClient();

    // POST /api-keys - Create key
    if (req.method === 'POST' && !path) {
      if (!hasRole(auth, 'developer')) {
        return forbiddenResponse('Developer role required to create API keys');
      }

      const body = await req.json();
      const { name, environment = 'sandbox', scopes = ['read:scores', 'read:offers'], rateLimitPerMinute = 60 } = body;

      if (!name) {
        return validationErrorResponse('name is required');
      }

      const rawKey = generateApiKey();
      const keyHash = await hashKey(rawKey);
      const keyPrefix = rawKey.substring(0, 10);

      const { data: apiKey, error: insertError } = await serviceClient
        .from('api_keys')
        .insert({
          tenant_id: auth.tenantId,
          name,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          environment,
          scopes,
          rate_limit_per_minute: rateLimitPerMinute,
          is_active: true,
          created_by: auth.userId
        })
        .select()
        .single();

      if (insertError) {
        console.error('API key insert error:', insertError);
        return errorResponse('INSERT_ERROR', 'Failed to create API key', 500);
      }

      // Audit
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'API_KEY_CREATED',
        resourceType: 'api_key',
        resourceId: apiKey.id,
        details: { name, environment, scopes },
        ...extractClientInfo(req)
      });

      // Return the raw key ONLY on creation
      return successResponse({
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey, // Only returned once!
        keyPrefix,
        environment,
        scopes,
        rateLimitPerMinute,
        createdAt: apiKey.created_at
      }, {
        lastUpdated: new Date().toISOString()
      });
    }

    // GET /api-keys/usage - Usage stats
    if (req.method === 'GET' && path === '/usage') {
      const keyId = url.searchParams.get('keyId');
      const startDate = url.searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = url.searchParams.get('endDate') || new Date().toISOString();

      let query = supabase
        .from('api_usage_logs')
        .select('*')
        .eq('tenant_id', auth.tenantId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (keyId) {
        query = query.eq('api_key_id', keyId);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      // Aggregate stats
      const stats = {
        totalRequests: data?.length || 0,
        successfulRequests: data?.filter(l => l.status_code && l.status_code < 400).length || 0,
        errorRequests: data?.filter(l => l.status_code && l.status_code >= 400).length || 0,
        avgLatencyMs: data?.length 
          ? Math.round(data.reduce((sum, l) => sum + (l.latency_ms || 0), 0) / data.length)
          : 0,
        byEndpoint: {} as Record<string, number>,
        byDay: {} as Record<string, number>
      };

      data?.forEach(l => {
        stats.byEndpoint[l.endpoint] = (stats.byEndpoint[l.endpoint] || 0) + 1;
        const day = l.created_at.split('T')[0];
        stats.byDay[day] = (stats.byDay[day] || 0) + 1;
      });

      return successResponse(stats);
    }

    // GET /api-keys - List keys
    if (req.method === 'GET' && !path.startsWith('/')) {
      const environment = url.searchParams.get('environment');

      let query = supabase
        .from('api_keys')
        .select('*')
        .eq('tenant_id', auth.tenantId)
        .order('created_at', { ascending: false });

      if (environment) {
        query = query.eq('environment', environment);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse('QUERY_ERROR', error.message, 500);
      }

      return successResponse(data?.map(k => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.key_prefix,
        environment: k.environment,
        scopes: k.scopes,
        rateLimitPerMinute: k.rate_limit_per_minute,
        isActive: k.is_active,
        lastUsedAt: k.last_used_at,
        createdAt: k.created_at,
        revokedAt: k.revoked_at
      })) || []);
    }

    // DELETE /api-keys/:id - Revoke key
    if (req.method === 'DELETE' && path.startsWith('/')) {
      if (!hasRole(auth, 'developer')) {
        return forbiddenResponse('Developer role required to revoke API keys');
      }

      const keyId = path.slice(1);

      const { data: key, error: keyError } = await supabase
        .from('api_keys')
        .select('*')
        .eq('id', keyId)
        .eq('tenant_id', auth.tenantId)
        .maybeSingle();

      if (keyError || !key) {
        return notFoundResponse('API Key');
      }

      const { error: updateError } = await serviceClient
        .from('api_keys')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: auth.userId
        })
        .eq('id', keyId);

      if (updateError) {
        return errorResponse('UPDATE_ERROR', updateError.message, 500);
      }

      // Audit
      await writeAuditEvent({
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: 'API_KEY_REVOKED',
        resourceType: 'api_key',
        resourceId: keyId,
        details: { name: key.name },
        ...extractClientInfo(req)
      });

      return successResponse({ id: keyId, revoked: true });
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  } catch (err) {
    console.error('API keys endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
