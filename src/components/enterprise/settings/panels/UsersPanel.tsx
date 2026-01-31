// Users Panel - User management with table and drawer

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, X, Shield, ShieldCheck, ShieldX, 
  MoreHorizontal, Edit, Trash2, CheckCircle, Clock
} from 'lucide-react';
import type { PlatformUser, UserRole } from '../types';
import { roleLabels } from '../mockData';

interface UsersPanelProps {
  users: PlatformUser[];
  onAddUser: () => void;
  onEditUser: (user: PlatformUser) => void;
  onRemoveUser: (userId: string) => void;
}

const StatusBadge: React.FC<{ status: PlatformUser['status'] }> = ({ status }) => {
  const config = {
    active: { icon: CheckCircle, bg: 'bg-success/10', text: 'text-success' },
    pending: { icon: Clock, bg: 'bg-warning/10', text: 'text-warning' },
    inactive: { icon: ShieldX, bg: 'bg-muted', text: 'text-muted-foreground' },
  };
  const { icon: Icon, bg, text } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const UsersPanel: React.FC<UsersPanelProps> = ({
  users,
  onAddUser,
  onEditUser,
  onRemoveUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Users & Access</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage platform users and their permissions
          </p>
        </div>
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          className="h-9 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Roles</option>
          {Object.entries(roleLabels).map(([role, label]) => (
            <option key={role} value={role}>{label}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Login</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">MFA</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm">{roleLabels[user.role]}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</span>
                </td>
                <td className="px-4 py-3">
                  {user.mfaEnabled ? (
                    <ShieldCheck className="h-4 w-4 text-success" />
                  ) : (
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditUser(user);
                    }}
                    className="p-1.5 hover:bg-muted rounded transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    readOnly
                    className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    readOnly
                    className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full h-9 px-3 text-sm bg-background border border-border rounded-md"
                  >
                    {Object.entries(roleLabels).map(([role, label]) => (
                      <option key={role} value={role}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Portfolio Access</label>
                  <div className="text-sm text-foreground bg-muted p-2 rounded-md">
                    {selectedUser.portfolioAccess.join(', ') || 'None'}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Allow Exports</span>
                  <input
                    type="checkbox"
                    defaultChecked={selectedUser.allowExports}
                    className="h-4 w-4 text-primary rounded"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Allow API Key Creation</span>
                  <input
                    type="checkbox"
                    defaultChecked={selectedUser.allowApiKeyCreation}
                    className="h-4 w-4 text-primary rounded"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={() => onRemoveUser(selectedUser.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md text-sm font-medium hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Edit className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersPanel;
