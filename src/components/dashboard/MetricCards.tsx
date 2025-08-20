import React from 'react';
import { motion } from 'framer-motion';
import { Key, Calendar } from 'lucide-react';
import type { UserResource } from '@clerk/types';

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  createdAt: string | Date;
  lastUsed: string | Date | null;
  callsUsed: number;
  isActive: boolean;
}

interface MetricCardsProps {
  apiKeys: ApiKey[];
  user: UserResource | null;
  formatDate: (date: string | Date) => string;
}

const MetricCards: React.FC<MetricCardsProps> = ({ apiKeys, user, formatDate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-blue-900">API Keys</h3>
            <p className="text-sm text-slate-600 font-medium">Total keys</p>
          </div>
        </div>
        <div className="text-3xl font-black">{Array.isArray(apiKeys) ? apiKeys.length : 0}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-blue-900">Member Since</h3>
            <p className="text-sm text-slate-600 font-medium">Account created</p>
          </div>
        </div>
        <div className="text-lg font-bold">{user ? formatDate(user.createdAt) : ''}</div>
      </motion.div>
    </div>
  );
};

export default MetricCards;
