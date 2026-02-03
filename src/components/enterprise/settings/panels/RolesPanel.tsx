// Roles & Permissions Panel - Permission matrix

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RolePermissions, Permission, UserRole } from '../types';
import { roleLabels } from '../mockData';

interface RolesPanelProps {
  roles: RolePermissions[];
  permissions: Permission[];
  onSave: (roles: RolePermissions[]) => void;
}

export const RolesPanel: React.FC<RolesPanelProps> = ({
  roles: initialRoles,
  permissions,
  onSave,
}) => {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (role: UserRole, permissionId: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.role === role
          ? { ...r, permissions: { ...r.permissions, [permissionId]: !r.permissions[permissionId] } }
          : r
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(roles);
    setHasChanges(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure access levels for each role
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Roles List */}
        <div className="bg-card rounded-lg border border-border p-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase px-2 py-2">Roles</h3>
          <div className="space-y-1">
            {roles.map((role) => (
              <button
                key={role.role}
                onClick={() => setSelectedRole(role.role)}
                className={`w-full px-3 py-2 rounded-md text-sm text-left transition-colors ${
                  selectedRole === role.role
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="col-span-3 bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role.role}
                    className={`px-3 py-3 text-center text-xs font-medium uppercase ${
                      selectedRole === role.role ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                    }`}
                  >
                    {roleLabels[role.role].slice(0, 5)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{permission.label}</p>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </td>
                  {roles.map((role) => (
                    <td
                      key={role.role}
                      className={`px-3 py-3 text-center ${
                        selectedRole === role.role ? 'bg-primary/5' : ''
                      }`}
                    >
                      <button
                        onClick={() => togglePermission(role.role, permission.id)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                      >
                        {role.permissions[permission.id] ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/30" />
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default RolesPanel;
