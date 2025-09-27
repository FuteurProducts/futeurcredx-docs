import React from 'react';
import { motion } from 'framer-motion';
import { Key, Activity, Clock, CheckCircle, XCircle, Wifi } from 'lucide-react';
import type { ApiKeyStats } from '../../types';

interface KeyUsageStatsProps {
  keyStats: ApiKeyStats[];
  isLive?: boolean;
}

const KeyUsageStats: React.FC<KeyUsageStatsProps> = ({ keyStats, isLive = false }) => {
  if (!keyStats || keyStats.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Key Usage</h3>
        <p className="text-gray-500">No API keys found or no usage data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">API Key Usage Statistics</h3>
        {isLive && (
          <div className="flex items-center gap-2 text-green-600">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Live Updates</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {keyStats.map((key, index) => (
          <motion.div
            key={key.keyId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{key.keyName}</h4>
                <p className="text-sm text-gray-500">ID: {key.keyId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  <span>Calls</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">{key.callsUsed}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last Used</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {key.isActive ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-600 font-medium">Inactive</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total API Calls Across All Keys:</span>
          <span className="text-lg font-bold text-gray-900">
            {keyStats.reduce((sum, key) => sum + key.callsUsed, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KeyUsageStats;
