// BFF Authentication & Authorization Middleware
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuthContext {
  userId: string;
  tenantId: string;
  email: string;
  roles: string[];
  portfolioScopes: string[];
}

export interface AuthError {
  error: string;
  code: string;
  status: number;
}

// Extract and validate JWT, return tenant context
export async function authenticateRequest(req: Request): Promise<AuthContext | AuthError> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', code: 'UNAUTHORIZED', status: 401 };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  
  if (claimsError || !claimsData?.claims) {
    return { error: 'Invalid or expired token', code: 'INVALID_TOKEN', status: 401 };
  }

  const userId = claimsData.claims.sub as string;
  const email = claimsData.claims.email as string;

  // Get user's tenant from profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', userId)
    .maybeSingle();

  if (profileError || !profile?.tenant_id) {
    return { error: 'User not associated with a tenant', code: 'NO_TENANT', status: 403 };
  }

  // Get user roles for this tenant
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('tenant_id', profile.tenant_id);

  const roles = userRoles?.map(r => r.role) || [];

  // Get portfolio access
  const { data: portfolioAccess } = await supabase
    .from('portfolio_access')
    .select('portfolio_id')
    .eq('user_id', userId);

  const portfolioScopes = portfolioAccess?.map(p => p.portfolio_id) || [];

  return {
    userId,
    tenantId: profile.tenant_id,
    email,
    roles,
    portfolioScopes
  };
}

// Check if user has required role
export function hasRole(auth: AuthContext, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    'super_admin': 100,
    'admin': 80,
    'developer': 60,
    'risk_analyst': 50,
    'relationship_manager': 40,
    'readonly': 10
  };

  const userMaxRole = Math.max(...auth.roles.map(r => roleHierarchy[r] || 0));
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userMaxRole >= requiredLevel;
}

// Check if user has access to specific portfolio
export function hasPortfolioAccess(auth: AuthContext, portfolioId: string): boolean {
  // Super admin and admin have access to all portfolios
  if (auth.roles.includes('super_admin') || auth.roles.includes('admin')) {
    return true;
  }
  return auth.portfolioScopes.includes(portfolioId);
}

// Create authenticated Supabase client
export function createAuthenticatedClient(req: Request) {
  const authHeader = req.headers.get('Authorization')!;
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });
}

// Create service role client (for audit writes, etc.)
export function createServiceClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  return createClient(supabaseUrl, serviceRoleKey);
}
