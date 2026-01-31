import React from 'react';
import { motion } from 'framer-motion';
import { Key, Activity, Clock, CheckCircle, XCircle, Wifi, TrendingUp, BarChart3 } from 'lucide-react';
import type { ApiKeyStats } from '../../types';

interface KeyUsageStatsProps {
  keyStats: ApiKeyStats[];
  isLive?: boolean;
}

const KeyUsageStats: React.FC<KeyUsageStatsProps> = ({ keyStats, isLive = false }) => {
  if (!keyStats || keyStats.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">API Key Usage</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No API keys found or no usage data available.</p>
        </div>
      </div>
    );
  }

  const totalCalls = keyStats.reduce((sum, key) => sum + key.callsUsed, 0);
  const activeKeys = keyStats.filter(key => key.isActive).length;
  const mostUsedKey = keyStats.reduce((max, key) => key.callsUsed > max.callsUsed ? key : max, keyStats[0]);

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">API Key Usage Statistics</h3>
            <p className="text-sm text-muted-foreground">Real-time usage tracking across all keys</p>
            <p className="text-xs text-muted-foreground mt-1">💡 Deleted keys are preserved for historical usage tracking</p>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            <Wifi className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Live Updates</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Calls</p>
              <p className="text-2xl font-bold text-blue-900">{totalCalls.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active Keys</p>
              <p className="text-2xl font-bold text-blue-900">{activeKeys}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Most Used</p>
              <p className="text-lg font-bold text-blue-900 truncate">{mostUsedKey.keyName}</p>
              <p className="text-xs text-blue-600">{mostUsedKey.callsUsed} calls</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Key Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  API Calls
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {keyStats.map((key, index) => (
                <motion.tr
                  key={key.keyId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Key className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{key.keyName}</div>
                        <div className="text-sm text-muted-foreground">Key #{index + 1}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      key.environment === 'production' 
                        ? 'bg-blue-100 text-blue-800 border-blue-300' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {key.environment || 'development'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{key.callsUsed.toLocaleString()}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {key.isActive ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Deleted</span>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeyUsageStats;
