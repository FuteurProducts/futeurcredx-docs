/**
 * RBACGate — Declarative Permission Gating Component
 * Renders children only when the current user holds the required permission(s).
 * Optionally renders a disabled version with lock icon + tooltip.
 */

import type { ReactNode } from 'react';
import { usePermissions, type Permission } from '@/hooks/usePermissions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

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
  /** If true, show a disabled version with lock icon instead of hiding */
  showDisabled?: boolean;
}

export function RBACGate({
  permission,
  permissions,
  any = false,
  children,
  fallback = null,
  showDisabled = false,
}: RBACGateProps) {
  const { hasAnyPermission, hasAllPermissions, role } = usePermissions();

  const perms = permissions ?? (permission ? [permission] : []);

  if (perms.length === 0) {
    return <>{children}</>;
  }

  const allowed = any ? hasAnyPermission(...perms) : hasAllPermissions(...perms);

  if (allowed) return <>{children}</>;

  if (showDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1.5 opacity-40 cursor-not-allowed select-none">
              <Lock className="h-3.5 w-3.5" />
              {children}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              Requires elevated permissions (current role: {role})
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <>{fallback}</>;
}
