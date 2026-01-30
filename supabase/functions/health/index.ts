// =============================================================================
// BFF API: Health Check Endpoint
// GET /health - Returns service health status
// No authentication required
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Track when the function started for uptime calculation
const startTime = Date.now();

interface HealthCheck {
  database: 'ok' | 'error';
  auth: 'ok' | 'error';
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  checks: HealthCheck;
  version: string;
  uptime_seconds: number;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const response: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'ok',
      auth: 'ok',
    },
    version: '1.0.0',
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
  };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      response.status = 'unhealthy';
      response.checks.database = 'error';
      response.error = 'Missing environment configuration';
      return new Response(JSON.stringify(response), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create service client for health check
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check database connectivity with a simple query
    const dbCheckStart = Date.now();
    const { error: dbError } = await supabase
      .from('tenants')
      .select('id')
      .limit(1);

    const dbLatency = Date.now() - dbCheckStart;

    if (dbError) {
      console.error('Database health check failed:', dbError);
      response.checks.database = 'error';
      response.status = 'unhealthy';
      response.error = `Database check failed: ${dbError.message}`;
    }

    // Log health check with latency
    console.log(JSON.stringify({
      level: 'info',
      timestamp: response.timestamp,
      endpoint: '/health',
      method: 'GET',
      statusCode: response.status === 'healthy' ? 200 : 503,
      dbLatencyMs: dbLatency,
      status: response.status,
    }));

    // Determine HTTP status code
    const httpStatus = response.status === 'healthy' ? 200 : 503;

    return new Response(JSON.stringify(response), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Health check error:', err);
    response.status = 'unhealthy';
    response.checks.database = 'error';
    response.checks.auth = 'error';
    response.error = err instanceof Error ? err.message : 'Unknown error';

    return new Response(JSON.stringify(response), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
