// Audit Event System
import { createServiceClient } from './auth.ts';

export type AuditAction = 
  | 'VIEW_PII'
  | 'SOFT_PULL_REQUESTED'
  | 'SCORE_VIEWED'
  | 'PREQUAL_GENERATED'
  | 'APPLICATION_SUBMITTED'
  | 'REPORT_GENERATED'
  | 'REPORT_DOWNLOADED'
  | 'API_KEY_CREATED'
  | 'API_KEY_REVOKED'
  | 'SETTINGS_CHANGED'
  | 'ROLE_CHANGED'
  | 'DATA_EXPORTED'
  | 'LOGIN'
  | 'LOGOUT';

export interface AuditEvent {
  tenantId: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

// Write audit event to database (uses service role to bypass RLS for writes)
export async function writeAuditEvent(event: AuditEvent): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    
    const { error } = await supabase
      .from('audit_events')
      .insert({
        tenant_id: event.tenantId,
        user_id: event.userId,
        action: event.action,
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        details: event.details || {},
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        session_id: event.sessionId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Audit write error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Audit write exception:', err);
    return { success: false, error: String(err) };
  }
}

// Extract client info from request
export function extractClientInfo(req: Request): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               undefined,
    userAgent: req.headers.get('user-agent') || undefined
  };
}

// Write data lineage record
export async function writeDataLineage(params: {
  tenantId: string;
  resourceType: string;
  resourceId: string;
  sourceName: string;
  sourceType: string;
  coveragePct?: number;
  freshnessHours?: number;
  consentReference?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    
    const { error } = await supabase
      .from('data_lineage')
      .insert({
        tenant_id: params.tenantId,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        source_name: params.sourceName,
        source_type: params.sourceType,
        pulled_at: new Date().toISOString(),
        coverage_pct: params.coveragePct,
        freshness_hours: params.freshnessHours,
        consent_reference: params.consentReference,
        metadata: params.metadata || {}
      });

    if (error) {
      console.error('Lineage write error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Lineage write exception:', err);
    return { success: false, error: String(err) };
  }
}
