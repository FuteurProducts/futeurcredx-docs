/**
 * usePermissions Hook — RBAC Permission Gating
 *
 * Role-based access control with a strict permission matrix.
 * In demo/sandbox mode, the current user's role is stored in localStorage
 * and defaults to 'admin' so the full feature set is visible.
 *
 * In production this would read from the authenticated session / JWT claims.
 */

import { useMemo, useSyncExternalStore } from 'react';
import type { UserRole } from '@/components/enterprise/settings/types';

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

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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
  risk: [
    'credentials:read',
    'export:csv', 'export:pdf',
    'risk:acknowledge_alert', 'risk:modify_thresholds',
    'reports:generate', 'reports:download',
  ],
  rm: [
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

// ── localStorage-backed role store (for demo mode) ──────────────────────
const ROLE_STORAGE_KEY = 'lumiqai-current-role';
const DEFAULT_ROLE: UserRole = 'admin';

let listeners: Array<() => void> = [];

function getSnapshot(): UserRole {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    if (stored && stored in ROLE_PERMISSIONS) return stored as UserRole;
  } catch { /* SSR / restricted */ }
  return DEFAULT_ROLE;
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/** Call this to change the active demo role (e.g. from Settings page). */
export function setCurrentRole(role: UserRole) {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
  listeners.forEach(l => l());
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  developer: 'Developer',
  risk: 'Risk Analyst',
  rm: 'Relationship Manager',
  readonly: 'Read-only',
};

/**
 * Returns the current user's role and permission check helpers.
 * Reactively updates when the demo role changes via setCurrentRole().
 */
export function usePermissions() {
  const role = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_ROLE);

  const permissions = useMemo(() => ROLE_PERMISSIONS[role] ?? [], [role]);

  const hasPermission = (permission: Permission): boolean =>
    permissions.includes(permission);

  const hasAnyPermission = (...perms: Permission[]): boolean =>
    perms.some((p) => permissions.includes(p));

  const hasAllPermissions = (...perms: Permission[]): boolean =>
    perms.every((p) => permissions.includes(p));

  return {
    role,
    roleLabel: ROLE_LABELS[role] ?? role,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
