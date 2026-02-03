import React from 'react';
import { motion } from 'framer-motion';
// UserResource type from AuthContext
interface UserResource {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  imageUrl?: string;
  createdAt?: string | Date;
}
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
  onRefresh 
}) => {
  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-headline text-foreground">API Usage Dashboard</h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <img src="/icons/loading-01.svg" alt="Refresh" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} style={{ filter: 'brightness(0) invert(1)' }} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-4 sm:p-6 shadow-[0px_5px_1.5px_-4px_rgba(8,8,8,0.15),0px_6px_4px_-4px_rgba(8,8,8,0.1),0px_12px_24px_-8px_rgba(8,8,8,0.12)] hover:shadow-[0px_8px_24px_-4px_rgba(8,8,8,0.18),0px_16px_32px_-8px_rgba(8,8,8,0.14)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <img src="/icons/lock-03.svg" alt="Key" className="w-8 h-8" style={{ filter: 'brightness(0)' }} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-foreground">API Keys</h3>
            <p className="text-sm text-muted-foreground font-medium">Total keys</p>
          </div>
        </div>
        <div className="text-3xl font-black">{Array.isArray(apiKeys) ? apiKeys.length : 0}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-4 sm:p-6 shadow-[0px_5px_1.5px_-4px_rgba(8,8,8,0.15),0px_6px_4px_-4px_rgba(8,8,8,0.1),0px_12px_24px_-8px_rgba(8,8,8,0.12)] hover:shadow-[0px_8px_24px_-4px_rgba(8,8,8,0.18),0px_16px_32px_-8px_rgba(8,8,8,0.14)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <img src="/icons/disc-02.svg" alt="Activity" className="w-8 h-8" style={{ filter: 'brightness(0)' }} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-foreground">Total API Calls</h3>
            <p className="text-sm text-muted-foreground font-medium">All time usage</p>
          </div>
        </div>
        <div className="text-3xl font-black">{apiStats?.totalCalls || 0}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl p-4 sm:p-6 shadow-[0px_5px_1.5px_-4px_rgba(8,8,8,0.15),0px_6px_4px_-4px_rgba(8,8,8,0.1),0px_12px_24px_-8px_rgba(8,8,8,0.12)] hover:shadow-[0px_8px_24px_-4px_rgba(8,8,8,0.18),0px_16px_32px_-8px_rgba(8,8,8,0.14)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <img src="/icons/disc-02.svg" alt="Trending" className="w-8 h-8" style={{ filter: 'brightness(0)' }} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-foreground">This Month</h3>
            <p className="text-sm text-muted-foreground font-medium">Current month calls</p>
          </div>
        </div>
        <div className="text-3xl font-black">{apiStats?.thisMonth || 0}</div>
        {apiStats?.growth !== undefined && (
          <div className={`text-sm font-medium ${apiStats.growth >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
            {apiStats.growth >= 0 ? '+' : ''}{apiStats.growth.toFixed(1)}% vs last month
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-4 sm:p-6 shadow-[0px_5px_1.5px_-4px_rgba(8,8,8,0.15),0px_6px_4px_-4px_rgba(8,8,8,0.1),0px_12px_24px_-8px_rgba(8,8,8,0.12)] hover:shadow-[0px_8px_24px_-4px_rgba(8,8,8,0.18),0px_16px_32px_-8px_rgba(8,8,8,0.14)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <img src="/icons/help-circle.svg" alt="Calendar" className="w-8 h-8" style={{ filter: 'brightness(0)' }} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-foreground">Member Since</h3>
            <p className="text-sm text-muted-foreground font-medium">Account created</p>
          </div>
        </div>
        <div className="text-lg font-bold">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</div>
      </motion.div>
      </div>
    </div>
  );
};

export default MetricCards;

