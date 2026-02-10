// Users Panel - User management with table and drawer

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Shield, ShieldCheck, ShieldX,
  MoreHorizontal, Edit, Trash2, CheckCircle, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
        <Button onClick={onAddUser}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
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
            className="w-full h-12 pl-9 pr-3 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          className="h-12 px-3 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
        >
          <option value="all">All Roles</option>
          {Object.entries(roleLabels).map(([role, label]) => (
            <option key={role} value={role}>{label}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border/30">
              <th className="px-5 py-4 h-14 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-5 py-4 h-14 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="px-5 py-4 h-14 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="px-5 py-4 h-14 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 h-14 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Login</th>
              <th className="px-5 py-4 h-14 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">MFA</th>
              <th className="px-5 py-4 h-14 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="h-16 border-b border-border/30 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm">{roleLabels[user.role]}</span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</span>
                </td>
                <td className="px-5 py-4">
                  {user.mfaEnabled ? (
                    <ShieldCheck className="h-4 w-4 text-success" />
                  ) : (
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditUser(user);
                    }}
                    className="p-1.5 hover:bg-muted rounded-lg transition-all duration-200"
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
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.5)] rounded-l-3xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold">User Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    readOnly
                    className="w-full h-12 px-3 text-sm bg-muted/50 border border-border/50 rounded-xl transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    readOnly
                    className="w-full h-12 px-3 text-sm bg-muted/50 border border-border/50 rounded-xl transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full h-12 px-3 text-sm bg-muted/50 border border-border/50 rounded-xl transition-all duration-200"
                  >
                    {Object.entries(roleLabels).map(([role, label]) => (
                      <option key={role} value={role}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Portfolio Access</label>
                  <div className="text-sm text-foreground bg-muted/50 p-2 rounded-xl">
                    {selectedUser.portfolioAccess.join(', ') || 'None'}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Allow Exports</span>
                  <input
                    type="checkbox"
                    defaultChecked={selectedUser.allowExports}
                    className="h-4 w-4 text-primary rounded-md"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Allow API Key Creation</span>
                  <input
                    type="checkbox"
                    defaultChecked={selectedUser.allowApiKeyCreation}
                    className="h-4 w-4 text-primary rounded-md"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onRemoveUser(selectedUser.id)}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success('User changes saved successfully');
                    setSelectedUser(null);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersPanel;
