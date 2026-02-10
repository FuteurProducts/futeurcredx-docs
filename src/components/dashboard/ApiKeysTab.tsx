import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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
      transition={{ delay: 0.1 }}
    >
      {/* 4 Bento Box Layout */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
        
        {/* TOP LEFT: Generate New Key */}
        <div className="bg-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <div>
                <h2 className="text-[1.125rem] font-semibold text-foreground">Generate New Key</h2>
                <p className="text-[0.8125rem] text-muted-foreground">Create a new API access token</p>
              </div>
            </div>
        </div>

          {/* Security Notice */}
          <div className="mb-5 p-4 bg-muted rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-foreground rounded-lg shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="text-[0.875rem] font-semibold text-foreground">Security Notice</div>
                <div className="text-[0.8125rem] text-muted-foreground">
                  The full key is only shown once after generation.
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-warning/10 border border-warning/30 rounded-xl">
              <div className="text-[0.875rem] text-foreground">{error}</div>
            </div>
          )}
          
          <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., Production)"
              className="flex-1 h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-[0.9375rem]"
              />
              <button
                onClick={handleGenerateKey}
                disabled={isGeneratingKey || !newKeyName.trim()}
              className="h-12 px-6 bg-foreground hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground text-white rounded-xl font-semibold text-[0.9375rem] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {isGeneratingKey ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                ) : (
                  <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Generate
                  </>
                )}
              </button>
        </div>

          {/* Newly Generated Key */}
        {newlyGeneratedKey && (
            <div className="mt-5 p-4 bg-success/10 border border-success/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 flex items-center justify-center bg-success rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[0.9375rem] font-semibold text-foreground">{newlyGeneratedKey.name} created!</span>
                  </div>
              <div className="bg-foreground rounded-lg p-3 mb-3">
                <code className="text-[0.8125rem] font-mono text-success break-all select-all">
                      {newlyGeneratedKey.key}
                    </code>
              </div>
              <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(newlyGeneratedKey.key)
                        toast.success('API key copied to clipboard')
                      }}
                  className="flex-1 h-10 bg-foreground text-white rounded-lg font-semibold text-[0.8125rem] hover:bg-foreground/90 transition-colors"
                    >
                  Copy Key
                    </button>
                <button
                  onClick={() => setNewlyGeneratedKey(null)}
                  className="h-10 px-4 bg-card text-muted-foreground rounded-lg font-semibold text-[0.8125rem] hover:bg-muted transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TOP RIGHT: Existing API Keys - Scrollable, max 3 visible */}
        <div className="bg-card rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[1.125rem] font-semibold text-foreground">Your API Keys</h2>
                <p className="text-[0.8125rem] text-muted-foreground">{apiKeys.length} key{apiKeys.length !== 1 ? 's' : ''} active</p>
              </div>
            </div>
            <Link
              to="/docs"
              className="text-[0.8125rem] text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
            >
              View Docs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Scrollable Keys List - Max 3 visible at a time (~300px height) */}
          <div className="flex-1 overflow-y-auto max-h-[320px] space-y-3 pr-1" style={{ scrollbarWidth: 'thin' }}>
          {isLoadingKeys ? (
              <div className="flex items-center justify-center py-12">
                <svg className="w-8 h-8 animate-spin text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
          ) : apiKeys.length > 0 ? (
            apiKeys.map(key => (
                <div key={key.id} className="p-4 bg-muted rounded-xl hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-[0.9375rem] font-semibold text-foreground">{key.name}</span>
                    </div>
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-card rounded-lg transition-all"
                      title="Revoke key"
                  >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                  </button>
                </div>
                  
                  <div className="flex items-center gap-2 bg-card p-2 rounded-lg mb-2">
                    <code className="flex-1 text-[0.8125rem] font-mono text-muted-foreground truncate">
                      {showApiKey[key.id] 
                        ? (key.key || 'Key not available') 
                        : `${key.keyPrefix || 'sk_test_'}...${(key.key || '****').slice(-4)}****`
                      }
                  </code>
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded transition-colors"
                      title={showApiKey[key.id] ? "Hide" : "Show"}
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {showApiKey[key.id] ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                  </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(key.key || '')
                        toast.success('API key copied to clipboard')
                      }}
                      className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded transition-colors"
                      title="Copy"
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                  </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground">
                    <span>Created: {formatDate(key.createdAt)}</span>
                    <span className="px-2 py-0.5 bg-card rounded text-[0.6875rem] font-semibold uppercase">
                      {key.environment || 'DEVELOPMENT'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-muted rounded-2xl">
                  <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-[0.9375rem] text-muted-foreground">No API keys yet</p>
                <p className="text-[0.8125rem] text-muted-foreground">Generate your first key to get started</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ApiKeysTab;
