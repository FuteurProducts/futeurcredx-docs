import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Key,
  ExternalLink,
  Shield,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  apiKey?: string;
  token?: string;
  value?: string;
  fullKey?: string;
  secretKey?: string;
  fullKeyOnCreation?: string;
  keyPrefix?: string;
  createdAt: string | Date;
  created_at?: string;
  lastUsed?: string | Date | null;
  last_used?: string | Date | null;
  lastUsedAt?: string | null;
  callsUsed?: number;
  calls_used?: number;
  usageCount?: number;
  isActive?: boolean;
  environment?: string;
  message?: string | null;
  scopes?: string[];
  expiresInDays?: number;
  ipWhitelist?: string[];
  geoRestrictions?: string[];
}

interface ApiKeysTabProps {
  apiKeys: ApiKey[];
  isLoadingKeys: boolean;
  error: string;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  handleGenerateKey: () => void;
  isGeneratingKey: boolean;
  newlyGeneratedKey: { id: string; key: string; name: string } | null;
  setNewlyGeneratedKey: (key: { id: string; key: string; name: string } | null) => void;
  handleRevokeKey: (keyId: string) => void;
  showApiKey: Record<string, boolean>;
  toggleKeyVisibility: (keyId: string) => void;
  formatDate: (date: string | Date) => string;
}

const ApiKeysTab: React.FC<ApiKeysTabProps> = ({
  apiKeys,
  isLoadingKeys,
  error,
  newKeyName,
  setNewKeyName,
  handleGenerateKey,
  isGeneratingKey,
  newlyGeneratedKey,
  setNewlyGeneratedKey,
  handleRevokeKey,
  showApiKey,
  toggleKeyVisibility,
  formatDate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* API Keys Management */}
      <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2 sm:gap-3 text-blue-900">
            <Key className="w-5 h-5 sm:w-6 sm:h-6" />
            API Keys
          </h2>
          <Link
            to="/docs"
            className="text-xs sm:text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 font-bold uppercase tracking-wide"
          >
            View Docs <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* Generate New Key */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50/80 rounded-xl border border-blue-200 backdrop-blur-sm">
          <h3 className="font-black uppercase tracking-tight mb-3 sm:mb-4 text-sm sm:text-base text-blue-900">Generate New API Key</h3>
          
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5 flex-shrink-0">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-blue-900 mb-1 text-xs sm:text-sm">Important Security Notice</div>
                <div className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                  <strong>Save your API key immediately!</strong> For security reasons, the full key is only shown once. Store it securely.
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <div className="font-bold mb-2">Error:</div>
              <div className="whitespace-pre-wrap font-mono text-xs">{error}</div>
            </div>
          )}
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name (e.g., Production App)"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 text-slate-800 placeholder-slate-500 font-medium text-sm"
              />
              <button
                onClick={handleGenerateKey}
                disabled={isGeneratingKey || !newKeyName.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isGeneratingKey ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Generate Key
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Newly Generated Key Alert */}
        {newlyGeneratedKey && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-green-800 mb-2 text-lg">🎉 API Key Generated Successfully!</div>
                <div className="text-sm text-green-700 mb-4">
                  <strong>\"{newlyGeneratedKey.name}\"</strong> has been created. 
                  <span className="text-red-600 font-bold"> This is the ONLY time you'll see the full key!</span>
                </div>
                
                <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-700 uppercase">Your API Key:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-gray-50 border rounded text-sm font-mono text-gray-800 break-all select-all">
                      {newlyGeneratedKey.key}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(newlyGeneratedKey.key)}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setNewlyGeneratedKey(null)}
                  className="w-full text-center py-2 text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing API Keys List */}
        <div className="space-y-4">
          {isLoadingKeys ? (
            <div className="text-center py-8 text-slate-500">Loading API keys...</div>
          ) : apiKeys.length > 0 ? (
            apiKeys.map(key => (
              <div key={key.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800">{key.name}</h4>
                  <button 
                    onClick={() => handleRevokeKey(key.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                  <code className="flex-1 text-sm font-mono text-slate-600 truncate">
                    {showApiKey[key.id] ? (key.key || 'Key not available') : `${key.keyPrefix || 'fc_'}...${(key.key || '****************').slice(-4)}`}
                  </code>
                  <button onClick={() => toggleKeyVisibility(key.id)} className="p-2 text-slate-500 hover:text-slate-700">
                    {showApiKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(key.key || '')} className="p-2 text-slate-500 hover:text-slate-700">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Created: {formatDate(key.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">No API keys found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeysTab;
