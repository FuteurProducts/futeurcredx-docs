/**
 * RBACGate — Declarative Permission Gating Component
 * Renders children only when the current user holds the required permission(s).
 * Optionally renders a fallback (e.g. a disabled button or tooltip).
 */

import type { ReactNode } from 'react';
import { usePermissions, type Permission } from '@/hooks/usePermissions';

interface RBACGateProps {
  /** Single permission required */
  permission?: Permission;
  /** Multiple permissions — user must hold ALL of them */
  permissions?: Permission[];
  /** If true, user only needs ANY of the listed permissions */
  any?: boolean;
  /** Content shown when permission is granted */
  children: ReactNode;
  /** Content shown when permission is denied (default: nothing) */
  fallback?: ReactNode;
}

export function RBACGate({
  permission,
  permissions,
  any = false,
  children,
  fallback = null,
}: RBACGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const perms = permissions ?? (permission ? [permission] : []);

  if (perms.length === 0) {
    // No permission requirement — always render
    return <>{children}</>;
  }

  const allowed = any ? hasAnyPermission(...perms) : hasAllPermissions(...perms);

  return <>{allowed ? children : fallback}</>;
}
