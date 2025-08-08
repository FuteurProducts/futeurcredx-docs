import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Key, 
  BarChart3, 
  CreditCard, 
  FileText, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  ExternalLink,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Shield,
  Users
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user, apiKeys, generateApiKey, revokeApiKey, logout } = useAuth()
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState('')
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return
    
    setIsGeneratingKey(true)
    try {
      await generateApiKey(newKeyName.trim())
      setNewKeyName('')
    } catch (error) {
      console.error('Failed to generate API key:', error)
    } finally {
      setIsGeneratingKey(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    // You could add a toast notification here
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const usagePercentage = user ? (user.apiCallsUsed / user.apiCallsLimit) * 100 : 0

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0E0E10]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-black uppercase tracking-tight">
                FUTEURCREDX
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/dashboard" className="text-white font-bold uppercase tracking-wide text-sm">Dashboard</Link>
                <Link to="/docs" className="text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wide text-sm">API Docs</Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400 font-medium">Welcome, <span className="text-white font-bold">{user?.name}</span></span>
              <button
                onClick={logout}
                className="text-sm text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wide"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">API Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Monitor your API usage, manage keys, and track your business credit integration performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">API Calls</h3>
                <p className="text-sm text-gray-400 font-medium">This month</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-black">{user?.apiCallsUsed.toLocaleString()}</div>
              <div className="text-sm text-gray-400 font-medium">
                of {user?.apiCallsLimit.toLocaleString()} limit
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Key className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">API Keys</h3>
                <p className="text-sm text-gray-400 font-medium">Active keys</p>
              </div>
            </div>
            <div className="text-3xl font-black">{apiKeys.filter(key => key.isActive).length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">Plan</h3>
                <p className="text-sm text-gray-400 font-medium">Current tier</p>
              </div>
            </div>
            <div className="text-3xl font-black capitalize">{user?.plan}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">Member Since</h3>
                <p className="text-sm text-gray-400 font-medium">Account created</p>
              </div>
            </div>
            <div className="text-lg font-bold">{user ? formatDate(user.createdAt) : ''}</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Keys Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Key className="w-6 h-6" />
                API Keys
              </h2>
              <Link
                to="/docs"
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-wide"
              >
                View Docs <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Generate New Key */}
            <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-black uppercase tracking-tight mb-4">Generate New API Key</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter key name (e.g., Production App)"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400 font-medium"
                />
                <button
                  onClick={handleGenerateKey}
                  disabled={!newKeyName.trim() || isGeneratingKey}
                  className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-black uppercase tracking-wide"
                >
                  {isGeneratingKey ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Generate
                </button>
              </div>
            </div>

            {/* API Keys List */}
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Key className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-bold text-lg mb-2">No API keys yet</p>
                  <p className="text-sm">Generate your first key to get started</p>
                </div>
              ) : (
                apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-black text-lg">{apiKey.name}</h4>
                        <p className="text-sm text-gray-400 font-medium">
                          Created {formatDate(apiKey.createdAt)}
                          {apiKey.lastUsed && ` • Last used ${formatDate(apiKey.lastUsed)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          apiKey.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <code className="flex-1 px-4 py-3 bg-black/50 rounded-xl border border-white/10 text-sm font-mono">
                        {showApiKey[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-3 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"
                      >
                        {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopyKey(apiKey.key)}
                        className="p-3 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => revokeApiKey(apiKey.id)}
                        className="p-3 text-red-400 hover:text-red-300 transition-colors bg-red-500/10 rounded-xl border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-400 font-medium">
                      {apiKey.callsUsed.toLocaleString()} calls made
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Billing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/docs"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">API Documentation</div>
                    <div className="text-sm text-gray-400 font-medium">Test APIs and view examples</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Usage Analytics</div>
                    <div className="text-sm text-gray-400 font-medium">View detailed usage metrics</div>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Coming Soon</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Billing & Subscriptions</div>
                    <div className="text-sm text-gray-400 font-medium">Manage your billing settings</div>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Usage Warning */}
            {usagePercentage > 80 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="font-black uppercase tracking-tight text-yellow-400 text-xl">Usage Alert</h3>
                </div>
                <p className="text-sm text-yellow-200 mb-6 font-medium leading-relaxed">
                  You've used {usagePercentage.toFixed(1)}% of your monthly API limit. 
                  Consider upgrading your plan to avoid service interruption.
                </p>
                <button className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-black text-sm hover:bg-yellow-300 transition-colors uppercase tracking-wide">
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* Getting Started */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Getting Started</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-black text-sm">
                    ✓
                  </div>
                  <span className="font-medium">Account created</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-black text-sm ${
                    apiKeys.length > 0 ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {apiKeys.length > 0 ? '✓' : '2'}
                  </div>
                  <span className="font-medium">Generate your first API key</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-black font-black text-sm">
                    3
                  </div>
                  <span className="font-medium">Make your first API call</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
