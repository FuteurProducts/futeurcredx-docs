import React from 'react';
import { motion } from 'framer-motion';
import { Key, Calendar, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import type { UserResource } from '@clerk/types';
import type { ApiStats } from '../../types';

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
  apiStats?: ApiStats;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  isDataFresh?: boolean;
  onRefresh?: () => void;
}

const MetricCards: React.FC<MetricCardsProps> = ({ 
  apiKeys, 
  user, 
  formatDate, 
  apiStats, 
  isRefreshing = false, 
  lastUpdated, 
  isDataFresh = true,
  onRefresh 
}) => {
  // Debug logging for MetricCards
  console.log('=== METRIC CARDS RENDER ===');
  console.log('API Stats received:', apiStats);
  console.log('Total Calls:', apiStats?.totalCalls);
  console.log('This Month:', apiStats?.thisMonth);
  console.log('Key Stats:', apiStats?.keyStats);
  console.log('===========================');

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">API Usage Dashboard</h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              {isDataFresh && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Fresh
                </span>
              )}
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-2xl p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <Activity className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-green-900">Total API Calls</h3>
            <p className="text-sm text-slate-600 font-medium">All time usage</p>
          </div>
        </div>
        <div className="text-3xl font-black">{apiStats?.totalCalls || 0}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-purple-900">This Month</h3>
            <p className="text-sm text-slate-600 font-medium">Current month calls</p>
          </div>
        </div>
        <div className="text-3xl font-black">{apiStats?.thisMonth || 0}</div>
        {apiStats?.growth !== undefined && (
          <div className={`text-sm font-medium ${apiStats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {apiStats.growth >= 0 ? '+' : ''}{apiStats.growth.toFixed(1)}% vs last month
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
    </div>
  );
};

export default MetricCards;
