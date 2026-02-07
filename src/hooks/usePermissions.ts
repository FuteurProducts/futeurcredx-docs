/**
 * usePermissions Hook — RBAC Permission Gating
 * Role-based access control with a strict permission matrix.
 * Roles: admin, developer, risk_analyst, relationship_manager, readonly
 */

export type Role = 'admin' | 'developer' | 'risk_analyst' | 'relationship_manager' | 'readonly';

export type Permission =
  | 'credentials:read'
  | 'credentials:write'
  | 'credentials:reveal'
  | 'export:csv'
  | 'export:pdf'
  | 'underwriting:approve'
  | 'underwriting:decline'
  | 'underwriting:bulk_action'
  | 'risk:acknowledge_alert'
  | 'risk:modify_thresholds'
  | 'customer:edit'
  | 'customer:assign'
  | 'reports:generate'
  | 'reports:download'
  | 'settings:manage'
  | 'users:manage';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'credentials:read', 'credentials:write', 'credentials:reveal',
    'export:csv', 'export:pdf',
    'underwriting:approve', 'underwriting:decline', 'underwriting:bulk_action',
    'risk:acknowledge_alert', 'risk:modify_thresholds',
    'customer:edit', 'customer:assign',
    'reports:generate', 'reports:download',
    'settings:manage', 'users:manage',
  ],
  developer: [
    'credentials:read', 'credentials:write', 'credentials:reveal',
    'export:csv', 'export:pdf',
    'reports:generate', 'reports:download',
  ],
  risk_analyst: [
    'credentials:read',
    'export:csv', 'export:pdf',
    'risk:acknowledge_alert', 'risk:modify_thresholds',
    'reports:generate', 'reports:download',
  ],
  relationship_manager: [
    'credentials:read',
    'export:csv',
    'underwriting:approve', 'underwriting:decline',
    'customer:edit', 'customer:assign',
    'reports:generate', 'reports:download',
  ],
  readonly: [
    'credentials:read',
    'reports:download',
  ],
};

/**
 * Returns the current user's role and permission check helpers.
 * In mock/demo mode, defaults to 'admin' for full access.
 */
export function usePermissions() {
  // In production this would read from Clerk session claims or a JWT.
  // For the demo/sandbox, default to admin so everything is accessible.
  const role: Role = 'admin';

  const permissions = ROLE_PERMISSIONS[role] ?? [];

  const hasPermission = (permission: Permission): boolean =>
    permissions.includes(permission);

  const hasAnyPermission = (...perms: Permission[]): boolean =>
    perms.some((p) => permissions.includes(p));

  const hasAllPermissions = (...perms: Permission[]): boolean =>
    perms.every((p) => permissions.includes(p));

  return { role, permissions, hasPermission, hasAnyPermission, hasAllPermissions };
}
