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
      <div className="bg-card/80 backdrop-blur-sm border border-info/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-info/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-info" />
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
    <div className="bg-card/80 backdrop-blur-sm border border-info/20 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-info/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">API Key Usage Statistics</h3>
            <p className="text-sm text-muted-foreground">Real-time usage tracking across all keys</p>
            <p className="text-xs text-muted-foreground mt-1">💡 Deleted keys are preserved for historical usage tracking</p>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-info/10 rounded-full border border-info/20">
            <Wifi className="w-4 h-4 text-info" />
            <span className="text-sm font-medium text-info">Live Updates</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-info/10 to-info/20 rounded-xl p-4 border border-info/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info">Total Calls</p>
              <p className="text-2xl font-bold text-foreground">{totalCalls.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-info" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-info/10 to-info/20 rounded-xl p-4 border border-info/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info">Active Keys</p>
              <p className="text-2xl font-bold text-foreground">{activeKeys}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-info" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-info/10 to-info/20 rounded-xl p-4 border border-info/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info">Most Used</p>
              <p className="text-lg font-bold text-foreground truncate">{mostUsedKey.keyName}</p>
              <p className="text-xs text-info">{mostUsedKey.callsUsed} calls</p>
            </div>
            <TrendingUp className="w-8 h-8 text-info" />
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-hidden rounded-2xl border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/30">
              <tr className="h-14">
                <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Key Name
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  API Calls
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border/30">
              {keyStats.map((key, index) => (
                <motion.tr
                  key={key.keyId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-info/10 rounded-lg">
                        <Key className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{key.keyName}</div>
                        <div className="text-sm text-muted-foreground">Key #{index + 1}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      key.environment === 'production'
                        ? 'bg-info/20 text-info border-info/30'
                        : 'bg-info/10 text-info border-info/20'
                    }`}>
                      {key.environment || 'development'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{key.callsUsed.toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {key.isActive ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-info" />
                          <span className="text-sm font-medium text-info">Active</span>
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
